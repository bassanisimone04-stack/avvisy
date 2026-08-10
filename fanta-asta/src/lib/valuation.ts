import { SQUADRE_BY_CODE } from "./teams";
import type {
  Acquisto,
  AstaState,
  LegaConfig,
  Player,
  Ruolo,
} from "./types";

/* ------------------------------------------------------------------ */
/* 1. FANTAINDICE — quanto vale un giocatore, a prescindere dal prezzo */
/* ------------------------------------------------------------------ */

const PUNTEGGIO_FASCIA: Record<number, number> = {
  1: 100,
  2: 80,
  3: 62,
  4: 44,
  5: 28,
};

/** Bonus attesi di partenza per ruolo: un attaccante parte più in alto. */
const BONUS_BASE: Record<Ruolo, number> = { P: 18, D: 30, C: 55, A: 75 };

function punteggioTitolarita(p: Player): number {
  if (p.tags.includes("titolare")) return 100;
  if (p.tags.includes("ballottaggio")) return 62;
  if (p.tags.includes("riserva")) return 22;
  return 70;
}

function punteggioBonus(p: Player): number {
  let score = BONUS_BASE[p.r];
  if (p.tags.includes("rig1")) score += 30;
  else if (p.tags.includes("rig2")) score += 14;
  else if (p.tags.includes("rig3")) score += 6;
  if (p.tags.includes("piazzati")) score += 10;
  // Chi gioca più avanti del ruolo di listone produce bonus "fuori scala".
  if (p.tags.includes("bug")) score += 12;
  return clamp(score, 0, 100);
}

function punteggioSquadra(p: Player, modificatore: boolean): number {
  const s = SQUADRE_BY_CODE[p.team];
  if (!s) return 50;
  if (p.r === "P" || p.r === "D") {
    const pesoDifesa = modificatore ? 0.85 : 0.7;
    return s.difesa * pesoDifesa + s.forza * (1 - pesoDifesa);
  }
  return s.forza;
}

function punteggioRendimento(p: Player): number {
  if (p.fm === undefined) return PUNTEGGIO_FASCIA[p.fascia];
  // 5.5 di fantamedia = zero, 7.5 = massimo.
  return clamp(((p.fm - 5.5) / 2) * 100, 0, 100);
}

/**
 * Fantaindice 0-100: sintesi di fascia d'asta, titolarità, bonus attesi,
 * contesto squadra e rendimento passato. È il "quanto vale", separato dal
 * "quanto costa": è il confronto tra i due a generare gli affari.
 */
export function fantaindice(p: Player, lega: LegaConfig): number {
  const raw =
    0.34 * PUNTEGGIO_FASCIA[p.fascia] +
    0.18 * punteggioTitolarita(p) +
    0.22 * punteggioBonus(p) +
    0.16 * punteggioSquadra(p, lega.modificatoreDifesa) +
    0.1 * punteggioRendimento(p);

  // Col modificatore di difesa attivo portieri e difensori di squadre solide
  // valgono di più di quanto dica il loro fantavalore.
  const spinta =
    lega.modificatoreDifesa && (p.r === "P" || p.r === "D") ? 1.07 : 1;

  return Math.round(clamp(raw * spinta, 0, 100));
}

/* ------------------------------------------------------------------ */
/* 2. MERCATO — quanto costerà davvero, nella TUA lega                 */
/* ------------------------------------------------------------------ */

export interface ValutazioneGiocatore {
  player: Player;
  indice: number;
  /** Prezzo d'equilibrio nella lega configurata */
  consigliato: number;
  /** Soglia oltre la quale stai strappando */
  strappo: number;
  /** Indice / prezzo, normalizzato a 100 sulla mediana del reparto */
  convenienza: number;
  giudizio: "affare" | "giusto" | "caro" | "trappola";
}

export type Mercato = Map<string, ValutazioneGiocatore>;

/**
 * Quanto la spesa si concentra sui top. Ripartire i crediti in proporzione
 * esatta al fantavalore darebbe ai primissimi nomi cifre che nessuna asta reale
 * raggiunge, perché nel finale ogni squadra è costretta a comprare comunque i
 * suoi slot residui. L'esponente sotto 1 comprime quella coda.
 */
const CONCENTRAZIONE_MERCATO = 0.78;

/**
 * Il fantaindice vive in 0-100 mentre i prezzi coprono due ordini di grandezza:
 * per trasformarlo in un peso di spesa serve una curva convessa. Con questo
 * esponente il rapporto tra un top da 95 e un riempitivo da 30 è confrontabile
 * con quello tra i rispettivi fantavalori.
 */
const CONVESSITA_INDICE = 3.2;

/** Quanto pesa il mercato rispetto all'opinione del modello nel prezzo finale. */
const PESO_MERCATO = 0.65;

/**
 * Modello di equilibrio dell'asta.
 *
 * L'idea: in una lega da N squadre con S slot per reparto verranno comprati
 * esattamente N*S giocatori di quel reparto, spendendo la quota di budget che
 * la lega dedica al reparto. Quei crediti vengono distribuiti due volte:
 *
 *  - una in proporzione al fantavalore, cioè a quanto il mercato chiede;
 *  - una in proporzione al fantaindice, cioè a quanto il modello ritiene giusto.
 *
 * Il prezzo consigliato è la media pesata dei due, e il loro rapporto è la
 * convenienza: dove il modello vede più valore di quanto il mercato chieda,
 * c'è l'affare. Tutto si adatta da solo a numero di partecipanti, budget, slot
 * e ripartizione scelta.
 */
export function calcolaMercato(
  listone: Player[],
  lega: LegaConfig,
  numPartecipanti: number
): Mercato {
  const mercato: Mercato = new Map();
  const partecipanti = Math.max(2, numPartecipanti);
  const ruoli: Ruolo[] = ["P", "D", "C", "A"];

  for (const ruolo of ruoli) {
    const slot = Math.max(1, lega.slot[ruolo]);
    const quota = Math.max(0, lega.ripartizione[ruolo]) / 100;
    const creditiReparto = lega.budget * partecipanti * quota;

    const giocatori = listone
      .filter((p) => p.r === ruolo)
      .map((p) => ({ p, indice: fantaindice(p, lega) }));
    if (giocatori.length === 0) continue;

    // Solo i primi N*S per valore verranno realmente acquistati: sono loro a
    // spartirsi i crediti del reparto. Gli altri restano a prezzo di base.
    const acquistabili = Math.min(slot * partecipanti, giocatori.length);
    const dentroIds = new Set(
      [...giocatori]
        .sort((a, b) => pesoMercato(b) - pesoMercato(a))
        .slice(0, acquistabili)
        .map((g) => g.p.id)
    );
    const dentro = giocatori.filter((g) => dentroIds.has(g.p.id));

    const totaleMercato = dentro.reduce((sum, g) => sum + pesoMercato(g), 0) || 1;
    const totaleValore = dentro.reduce((sum, g) => sum + pesoValore(g), 0) || 1;
    // Ogni slot costa almeno 1 credito: quello che avanza è il vero contendibile.
    const contendibili = Math.max(0, creditiReparto - dentro.length);

    for (const g of giocatori) {
      const inLista = dentroIds.has(g.p.id);
      const prezzoMercato = inLista
        ? 1 + (pesoMercato(g) / totaleMercato) * contendibili
        : 1;
      const prezzoValore = inLista
        ? 1 + (pesoValore(g) / totaleValore) * contendibili
        : 1;

      const consigliato = Math.max(
        1,
        Math.round(PESO_MERCATO * prezzoMercato + (1 - PESO_MERCATO) * prezzoValore)
      );

      mercato.set(g.p.id, {
        player: g.p,
        indice: g.indice,
        consigliato,
        strappo: Math.max(consigliato + 1, Math.round(consigliato * 1.22)),
        convenienza: Math.round((prezzoValore / prezzoMercato) * 100),
        giudizio: "giusto",
      });
      const v = mercato.get(g.p.id)!;
      v.giudizio = giudizioDa(v.convenienza, g.p);
    }
  }

  return mercato;
}

/** Quanto il mercato chiede per un giocatore: il fantavalore, compresso. */
function pesoMercato(g: { p: Player; indice: number }): number {
  return Math.pow(Math.max(1, g.p.fvm), CONCENTRAZIONE_MERCATO);
}

/** Quanto il modello ritiene che valga: il fantaindice, reso convesso. */
function pesoValore(g: { p: Player; indice: number }): number {
  return Math.pow(Math.max(1, g.indice) / 100, CONVESSITA_INDICE);
}

function giudizioDa(
  convenienza: number,
  p: Player
): ValutazioneGiocatore["giudizio"] {
  if (p.tags.includes("rischio")) return "trappola";
  if (convenienza >= 125) return "affare";
  if (convenienza >= 88) return "giusto";
  if (convenienza >= 65) return "caro";
  return "trappola";
}

/* ------------------------------------------------------------------ */
/* 3. STATO ROSA E BUDGET — quanto puoi ancora spendere                */
/* ------------------------------------------------------------------ */

export interface RepartoStato {
  ruolo: Ruolo;
  presi: number;
  slot: number;
  mancanti: number;
  speso: number;
  /** Budget teorico del reparto secondo la ripartizione scelta */
  budgetTeorico: number;
  /** Quanto resta rispetto al budget teorico (può essere negativo) */
  residuoTeorico: number;
}

export interface RosaStato {
  fantallenatoreId: string;
  acquisti: Acquisto[];
  speso: number;
  residuo: number;
  slotTotali: number;
  presiTotali: number;
  slotMancanti: number;
  /**
   * L'offerta massima assoluta: tutti i crediti liberi tranne 1 per ogni
   * altro slot ancora da riempire. Il numero che salva le aste.
   */
  maxOfferta: number;
  /** Crediti mediamente disponibili per ciascuno slot ancora vuoto */
  mediaPerSlot: number;
  reparti: Record<Ruolo, RepartoStato>;
  completa: boolean;
}

export function statoRosa(
  state: AstaState,
  fantallenatoreId: string,
  listone: Player[]
): RosaStato {
  const byId = new Map(listone.map((p) => [p.id, p]));
  const acquisti = state.acquisti.filter(
    (a) => a.fantallenatoreId === fantallenatoreId
  );
  const speso = acquisti.reduce((sum, a) => sum + a.prezzo, 0);
  const residuo = state.lega.budget - speso;

  const ruoli: Ruolo[] = ["P", "D", "C", "A"];
  const reparti = {} as Record<Ruolo, RepartoStato>;

  for (const ruolo of ruoli) {
    const diRuolo = acquisti.filter((a) => byId.get(a.playerId)?.r === ruolo);
    const slot = state.lega.slot[ruolo];
    const spesoReparto = diRuolo.reduce((sum, a) => sum + a.prezzo, 0);
    const budgetTeorico = Math.round(
      (state.lega.budget * state.lega.ripartizione[ruolo]) / 100
    );
    reparti[ruolo] = {
      ruolo,
      presi: diRuolo.length,
      slot,
      mancanti: Math.max(0, slot - diRuolo.length),
      speso: spesoReparto,
      budgetTeorico,
      residuoTeorico: budgetTeorico - spesoReparto,
    };
  }

  const slotTotali = ruoli.reduce((sum, r) => sum + state.lega.slot[r], 0);
  const presiTotali = acquisti.length;
  const slotMancanti = Math.max(0, slotTotali - presiTotali);
  const maxOfferta =
    slotMancanti === 0 ? 0 : Math.max(1, residuo - (slotMancanti - 1));

  return {
    fantallenatoreId,
    acquisti,
    speso,
    residuo,
    slotTotali,
    presiTotali,
    slotMancanti,
    maxOfferta,
    mediaPerSlot: slotMancanti > 0 ? residuo / slotMancanti : 0,
    reparti,
    completa: slotMancanti === 0,
  };
}

/**
 * Offerta massima sostenibile per uno specifico ruolo: oltre al vincolo di
 * budget assoluto tiene conto degli slot ancora aperti in quel reparto.
 * Restituisce 0 se il reparto è già completo.
 */
export function maxOffertaPerRuolo(rosa: RosaStato, ruolo: Ruolo): number {
  if (rosa.reparti[ruolo].mancanti === 0) return 0;
  return rosa.maxOfferta;
}

/**
 * Semaforo da usare mentre il rilancio sale: dice se l'offerta corrente è
 * ancora dentro il consigliato, se è uno strappo o se è fuori budget.
 */
export type SemaforoOfferta = "ok" | "attenzione" | "strappo" | "impossibile";

export function semaforoOfferta(
  offerta: number,
  valutazione: ValutazioneGiocatore | undefined,
  rosa: RosaStato | undefined
): SemaforoOfferta {
  if (rosa && offerta > rosa.maxOfferta) return "impossibile";
  if (!valutazione) return "ok";
  if (offerta > valutazione.strappo) return "strappo";
  if (offerta > valutazione.consigliato) return "attenzione";
  return "ok";
}

/* ------------------------------------------------------------------ */
/* 4. SUGGERIMENTI — cosa fare adesso                                  */
/* ------------------------------------------------------------------ */

export interface Suggerimento {
  livello: "info" | "attenzione" | "allarme";
  testo: string;
}

/**
 * Consigli calcolati sullo stato reale dell'asta: slot scoperti, crediti
 * fermi, reparti sforati. Sono l'equivalente dell'amico che ti dà una gomitata
 * quando stai per pagare 40 crediti il quarto attaccante.
 */
export function suggerimenti(
  rosa: RosaStato,
  lega: LegaConfig,
  liberiPerRuolo: Record<Ruolo, number>
): Suggerimento[] {
  const out: Suggerimento[] = [];
  const nomiRuolo: Record<Ruolo, string> = {
    P: "portieri",
    D: "difensori",
    C: "centrocampisti",
    A: "attaccanti",
  };

  if (rosa.completa) {
    out.push({
      livello: "info",
      testo: `Rosa completa: ${rosa.presiTotali} giocatori per ${rosa.speso} crediti. Ti restano ${rosa.residuo} crediti inutilizzati.`,
    });
    return out;
  }

  out.push({
    livello: "info",
    testo: `Puoi arrivare a ${rosa.maxOfferta} crediti su un singolo giocatore tenendo 1 credito per ciascuno degli altri ${Math.max(
      0,
      rosa.slotMancanti - 1
    )} slot.`,
  });

  if (rosa.mediaPerSlot < 2 && rosa.slotMancanti > 2) {
    out.push({
      livello: "allarme",
      testo: `Restano ${rosa.slotMancanti} slot e ${rosa.residuo} crediti: da qui in poi puoi solo riempire a 1. Punta sui titolari low cost.`,
    });
  }

  for (const ruolo of ["P", "D", "C", "A"] as Ruolo[]) {
    const reparto = rosa.reparti[ruolo];
    if (reparto.mancanti === 0) continue;

    if (reparto.residuoTeorico < 0) {
      out.push({
        livello: "attenzione",
        testo: `Hai sforato di ${Math.abs(reparto.residuoTeorico)} crediti il budget previsto per i ${
          nomiRuolo[ruolo]
        }: recupera sugli altri reparti.`,
      });
    }

    const liberi = liberiPerRuolo[ruolo] ?? 0;
    if (liberi <= reparto.mancanti) {
      out.push({
        livello: "allarme",
        testo: `Restano solo ${liberi} ${nomiRuolo[ruolo]} disponibili per i tuoi ${reparto.mancanti} slot scoperti: prendine uno subito.`,
      });
    }
  }

  const spesaPercentuale = (rosa.speso / lega.budget) * 100;
  const slotPercentuale = (rosa.presiTotali / rosa.slotTotali) * 100;
  if (spesaPercentuale - slotPercentuale > 25) {
    out.push({
      livello: "attenzione",
      testo: `Hai speso il ${Math.round(spesaPercentuale)}% del budget per il ${Math.round(
        slotPercentuale
      )}% della rosa: stai correndo troppo.`,
    });
  }

  return out;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
