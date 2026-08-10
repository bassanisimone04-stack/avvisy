export type Ruolo = "P" | "D" | "C" | "A";

/** Ruoli Mantra ufficiali (Por, Dc, Dd, Ds, E, M, C, W, T, A, Pc) */
export type RuoloMantra =
  | "Por"
  | "Dc"
  | "Dd"
  | "Ds"
  | "E"
  | "M"
  | "C"
  | "W"
  | "T"
  | "A"
  | "Pc";

export type TeamCode =
  | "ATA"
  | "BOL"
  | "CAG"
  | "COM"
  | "FIO"
  | "FRO"
  | "GEN"
  | "INT"
  | "JUV"
  | "LAZ"
  | "LEC"
  | "MIL"
  | "MON"
  | "NAP"
  | "PAR"
  | "ROM"
  | "SAS"
  | "TOR"
  | "UDI"
  | "VEN";

/**
 * Tag informativi sul giocatore. Guidano sia il motore di valutazione
 * sia i filtri rapidi durante l'asta.
 */
export type PlayerTag =
  /** Gerarchia dal dischetto */
  | "rig1"
  | "rig2"
  | "rig3"
  /** Batte punizioni / calci d'angolo */
  | "piazzati"
  /** Grado di titolarità */
  | "titolare"
  | "ballottaggio"
  | "riserva"
  /** Etichette d'asta */
  | "top"
  | "lowcost"
  | "scommessa"
  /** Ruolo di listone più difensivo di quello reale in campo: occasione */
  | "bug"
  | "neopromossa"
  | "rischio";

export interface Player {
  id: string;
  nome: string;
  team: TeamCode;
  /** Ruolo Classic */
  r: Ruolo;
  /** Ruoli Mantra (uno o più) */
  rm: RuoloMantra[];
  /** Quotazione iniziale stimata, base 500 crediti */
  qt: number;
  /** Fantavalore di mercato stimato, base 1000 crediti (come da listone) */
  fvm: number;
  /** Fascia d'asta 1 (top) → 5 (scommessa/tappabuchi) */
  fascia: 1 | 2 | 3 | 4 | 5;
  /** Fantamedia stagione 2025/26, quando nota */
  fm?: number;
  gol?: number;
  assist?: number;
  presenze?: number;
  tags: PlayerTag[];
  nota?: string;
}

export interface SquadraSerieA {
  code: TeamCode;
  nome: string;
  allenatore: string;
  modulo: string;
  /** Forza complessiva percepita 0-100, usata dal motore di valutazione */
  forza: number;
  /** Solidità difensiva percepita 0-100, pesa su portieri e difensori */
  difesa: number;
  formazioneTipo: string;
  rigorista: string;
  piazzati?: string;
  nota: string;
  neopromossa?: boolean;
}

/* ------------------------------------------------------------------ */
/* Stato dell'asta                                                     */
/* ------------------------------------------------------------------ */

export interface Fantallenatore {
  id: string;
  nome: string;
  /** true per la squadra dell'utente: sblocca i suggerimenti personali */
  io?: boolean;
}

export interface SlotConfig {
  P: number;
  D: number;
  C: number;
  A: number;
}

export interface LegaConfig {
  nome: string;
  modalita: "classic" | "mantra";
  budget: number;
  slot: SlotConfig;
  /** Percentuali di budget consigliate per reparto (somma 100) */
  ripartizione: SlotConfig;
  modificatoreDifesa: boolean;
  /** Asta "a chiamata" con timer, in secondi. 0 = disattivato */
  timer: number;
}

export interface Acquisto {
  playerId: string;
  fantallenatoreId: string;
  prezzo: number;
  ts: number;
}

export interface AstaState {
  lega: LegaConfig;
  fantallenatori: Fantallenatore[];
  acquisti: Acquisto[];
  /** Giocatori messi in lista obiettivi dall'utente */
  target: string[];
  /** Giocatori marcati come "da evitare" */
  esclusi: string[];
  /** Prezzi personalizzati: sovrascrivono il consigliato del motore */
  prezziCustom: Record<string, number>;
  /** Listone importato dall'utente (sostituisce quello di default) */
  listoneCustom?: Player[];
  version: number;
}
