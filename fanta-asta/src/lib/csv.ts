import { LISTONE, slugify } from "./players";
import type { Player, PlayerTag, Ruolo, RuoloMantra, TeamCode } from "./types";

/* ------------------------------------------------------------------ */
/* Import del listone ufficiale                                        */
/* ------------------------------------------------------------------ */

/**
 * Sigle usate dai listoni ufficiali per le squadre. L'export di Leghe
 * Fantacalcio usa il nome esteso, altri fogli usano la sigla a 3 lettere.
 */
const ALIAS_SQUADRE: Record<string, TeamCode> = {
  atalanta: "ATA",
  ata: "ATA",
  bologna: "BOL",
  bol: "BOL",
  cagliari: "CAG",
  cag: "CAG",
  como: "COM",
  com: "COM",
  fiorentina: "FIO",
  fio: "FIO",
  frosinone: "FRO",
  fro: "FRO",
  genoa: "GEN",
  gen: "GEN",
  inter: "INT",
  int: "INT",
  juventus: "JUV",
  juve: "JUV",
  juv: "JUV",
  lazio: "LAZ",
  laz: "LAZ",
  lecce: "LEC",
  lec: "LEC",
  milan: "MIL",
  mil: "MIL",
  monza: "MON",
  mon: "MON",
  napoli: "NAP",
  nap: "NAP",
  parma: "PAR",
  par: "PAR",
  roma: "ROM",
  rom: "ROM",
  sassuolo: "SAS",
  sas: "SAS",
  torino: "TOR",
  tor: "TOR",
  udinese: "UDI",
  udi: "UDI",
  venezia: "VEN",
  ven: "VEN",
};

export interface RisultatoImport {
  players: Player[];
  importati: number;
  scartati: number;
  /** Giocatori del dataset interno che hanno ritrovato tag e note */
  arricchiti: number;
  errori: string[];
}

/** Divide una riga CSV rispettando le virgolette. */
function splitRow(row: string, sep: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === sep && !inQuotes) {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out.map((v) => v.trim());
}

function rilevaSeparatore(header: string): string {
  const candidati = [";", ",", "\t"];
  let migliore = ";";
  let max = 0;
  for (const sep of candidati) {
    const n = header.split(sep).length;
    if (n > max) {
      max = n;
      migliore = sep;
    }
  }
  return migliore;
}

function normalizzaIntestazione(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/** Trova la colonna il cui nome normalizzato combacia con uno degli alias. */
function trovaColonna(headers: string[], alias: string[]): number {
  const norm = headers.map(normalizzaIntestazione);
  for (const a of alias) {
    const idx = norm.indexOf(a);
    if (idx !== -1) return idx;
  }
  for (const a of alias) {
    const idx = norm.findIndex((h) => h.startsWith(a));
    if (idx !== -1) return idx;
  }
  return -1;
}

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function fasciaDaFvm(fvm: number, ruolo: Ruolo): 1 | 2 | 3 | 4 | 5 {
  // Soglie tarate su base 1000 crediti, differenziate perché un difensore da
  // 90 di fantavalore è un top mentre un attaccante da 90 è di terza fascia.
  const soglie: Record<Ruolo, number[]> = {
    P: [85, 55, 30, 12],
    D: [80, 50, 25, 10],
    C: [170, 100, 50, 18],
    A: [200, 120, 60, 20],
  };
  const [s1, s2, s3, s4] = soglie[ruolo];
  if (fvm >= s1) return 1;
  if (fvm >= s2) return 2;
  if (fvm >= s3) return 3;
  if (fvm >= s4) return 4;
  return 5;
}

/**
 * Legge un CSV di listone (export Leghe Fantacalcio o foglio compatibile) e lo
 * trasforma in giocatori. Tag, note e statistiche del dataset interno vengono
 * riportati sui giocatori riconosciuti, così l'import non fa perdere il lavoro
 * di analisi già fatto.
 */
export function importaListoneCsv(testo: string): RisultatoImport {
  const errori: string[] = [];
  const righe = testo
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter(Boolean);

  if (righe.length < 2) {
    return {
      players: [],
      importati: 0,
      scartati: 0,
      arricchiti: 0,
      errori: ["Il file sembra vuoto."],
    };
  }

  // I listoni ufficiali hanno una riga di titolo prima delle intestazioni.
  let headerIndex = 0;
  let sep = rilevaSeparatore(righe[0]);
  for (let i = 0; i < Math.min(5, righe.length); i++) {
    const candidato = splitRow(righe[i], rilevaSeparatore(righe[i]));
    if (trovaColonna(candidato, ["nome", "calciatore", "giocatore"]) !== -1) {
      headerIndex = i;
      sep = rilevaSeparatore(righe[i]);
      break;
    }
  }

  const headers = splitRow(righe[headerIndex], sep);
  const cNome = trovaColonna(headers, ["nome", "calciatore", "giocatore"]);
  const cSquadra = trovaColonna(headers, ["squadra", "team", "club"]);
  const cRuolo = trovaColonna(headers, ["r", "ruolo", "ruoloclassic"]);
  const cRuoloM = trovaColonna(headers, ["rm", "ruolomantra", "ruolim"]);
  const cQt = trovaColonna(headers, ["qta", "qtia", "quotazione", "qt", "qti"]);
  const cFvm = trovaColonna(headers, ["fvm", "fantavalore", "fvmclassic"]);

  if (cNome === -1 || cSquadra === -1) {
    return {
      players: [],
      importati: 0,
      scartati: 0,
      arricchiti: 0,
      errori: [
        "Non trovo le colonne Nome e Squadra. Attese intestazioni tipo: Nome; Squadra; R; RM; Qt.A; FVM.",
      ],
    };
  }

  const interniPerChiave = new Map(
    LISTONE.map((p) => [`${slugify(p.nome)}|${p.team}`, p])
  );

  const players: Player[] = [];
  const visti = new Set<string>();
  let scartati = 0;
  let arricchiti = 0;

  for (let i = headerIndex + 1; i < righe.length; i++) {
    const cells = splitRow(righe[i], sep);
    const nome = cells[cNome];
    const squadraRaw = cells[cSquadra];
    if (!nome || !squadraRaw) {
      scartati++;
      continue;
    }

    const team = ALIAS_SQUADRE[normalizzaIntestazione(squadraRaw)];
    if (!team) {
      scartati++;
      if (errori.length < 5) {
        errori.push(`Squadra non riconosciuta: "${squadraRaw}" (riga ${i + 1}).`);
      }
      continue;
    }

    const ruoloRaw = (cells[cRuolo] ?? "").toUpperCase().trim();
    const ruolo: Ruolo = ["P", "D", "C", "A"].includes(ruoloRaw)
      ? (ruoloRaw as Ruolo)
      : "C";

    const fvm = toNumber(cells[cFvm]) ?? 1;
    const qt = toNumber(cells[cQt]) ?? Math.max(1, Math.round(fvm / 10));

    const chiave = `${slugify(nome)}|${team}`;
    if (visti.has(chiave)) {
      scartati++;
      continue;
    }
    visti.add(chiave);

    const interno = interniPerChiave.get(chiave);
    if (interno) arricchiti++;

    const rm = (cells[cRuoloM] ?? "")
      .split(/[;,/ ]+/)
      .map((x) => x.trim())
      .filter(Boolean) as RuoloMantra[];

    players.push({
      id: `${slugify(nome)}-${team.toLowerCase()}`,
      nome,
      team,
      r: ruolo,
      rm: rm.length > 0 ? rm : (interno?.rm ?? []),
      qt,
      fvm,
      fascia: interno?.fascia ?? fasciaDaFvm(fvm, ruolo),
      fm: interno?.fm,
      gol: interno?.gol,
      assist: interno?.assist,
      presenze: interno?.presenze,
      tags: (interno?.tags ?? []) as PlayerTag[],
      nota: interno?.nota,
    });
  }

  return { players, importati: players.length, scartati, arricchiti, errori };
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

function cella(value: string | number | undefined): string {
  const raw = value === undefined ? "" : String(value);
  return /[";\n]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
}

export function esportaCsv(headers: string[], righe: (string | number | undefined)[][]): string {
  return [headers.join(";"), ...righe.map((r) => r.map(cella).join(";"))].join(
    "\n"
  );
}

export function scaricaFile(nome: string, contenuto: string, tipo: string): void {
  const blob = new Blob([contenuto], { type: `${tipo};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
