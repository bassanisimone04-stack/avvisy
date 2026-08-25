"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LISTONE } from "./players";
import { calcolaMercato, statoRosa } from "./valuation";
import type {
  Acquisto,
  AstaState,
  Fantallenatore,
  LegaConfig,
  Player,
  Ruolo,
} from "./types";
import type { Mercato, RosaStato } from "./valuation";

const STORAGE_KEY = "fanta-asta:v1";
const VERSIONE_STATO = 1;

export const LEGA_DEFAULT: LegaConfig = {
  nome: "La mia lega",
  modalita: "classic",
  budget: 500,
  slot: { P: 3, D: 8, C: 8, A: 6 },
  // Ripartizione classica consigliata dalle guide: 7% portieri, 14% difesa,
  // 29% centrocampo, 50% attacco (35/70/145/250 su 500 crediti).
  ripartizione: { P: 7, D: 14, C: 29, A: 50 },
  modificatoreDifesa: false,
  timer: 0,
};

function statoIniziale(): AstaState {
  return {
    lega: LEGA_DEFAULT,
    fantallenatori: [
      { id: "io", nome: "La mia squadra", io: true },
      { id: "sq2", nome: "Squadra 2" },
      { id: "sq3", nome: "Squadra 3" },
      { id: "sq4", nome: "Squadra 4" },
      { id: "sq5", nome: "Squadra 5" },
      { id: "sq6", nome: "Squadra 6" },
      { id: "sq7", nome: "Squadra 7" },
      { id: "sq8", nome: "Squadra 8" },
    ],
    acquisti: [],
    target: [],
    esclusi: [],
    prezziCustom: {},
    version: VERSIONE_STATO,
  };
}

export interface AstaContextValue {
  state: AstaState;
  pronto: boolean;
  listone: Player[];
  mercato: Mercato;
  /** Mappa playerId → id del fantallenatore che lo ha preso */
  assegnati: Map<string, Acquisto>;
  rose: Map<string, RosaStato>;
  liberiPerRuolo: Record<Ruolo, number>;
  io: Fantallenatore | undefined;

  aggiornaLega: (patch: Partial<LegaConfig>) => void;
  aggiungiFantallenatore: (nome: string) => void;
  rinominaFantallenatore: (id: string, nome: string) => void;
  rimuoviFantallenatore: (id: string) => void;
  impostaIo: (id: string) => void;

  assegna: (playerId: string, fantallenatoreId: string, prezzo: number) => void;
  annullaAcquisto: (playerId: string) => void;
  annullaUltimo: () => void;

  toggleTarget: (playerId: string) => void;
  toggleEscluso: (playerId: string) => void;
  impostaPrezzoCustom: (playerId: string, prezzo: number | null) => void;

  importaListone: (players: Player[]) => void;
  ripristinaListone: () => void;
  caricaStato: (stato: AstaState) => void;
  azzeraAsta: () => void;
  azzeraTutto: () => void;
}

const AstaContext = createContext<AstaContextValue | null>(null);

export function AstaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AstaState>(statoIniziale);
  const [pronto, setPronto] = useState(false);

  // Caricamento da localStorage: l'asta deve sopravvivere a un refresh
  // accidentale mentre sei al tavolo con gli amici.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AstaState;
        if (parsed && parsed.lega && Array.isArray(parsed.fantallenatori)) {
          setState({ ...statoIniziale(), ...parsed });
        }
      }
    } catch {
      // Storage corrotto o non disponibile: si riparte dallo stato iniziale.
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Quota superata o modalità privata: l'asta continua comunque in memoria.
    }
  }, [state, pronto]);

  const listone = useMemo(
    () => state.listoneCustom ?? LISTONE,
    [state.listoneCustom]
  );

  const mercato = useMemo(
    () => calcolaMercato(listone, state.lega, state.fantallenatori.length),
    [listone, state.lega, state.fantallenatori.length]
  );

  const assegnati = useMemo(() => {
    const map = new Map<string, Acquisto>();
    for (const a of state.acquisti) map.set(a.playerId, a);
    return map;
  }, [state.acquisti]);

  const rose = useMemo(() => {
    const map = new Map<string, RosaStato>();
    for (const f of state.fantallenatori) {
      map.set(f.id, statoRosa(state, f.id, listone));
    }
    return map;
  }, [state, listone]);

  const liberiPerRuolo = useMemo(() => {
    const conteggio: Record<Ruolo, number> = { P: 0, D: 0, C: 0, A: 0 };
    for (const p of listone) {
      if (!assegnati.has(p.id)) conteggio[p.r]++;
    }
    return conteggio;
  }, [listone, assegnati]);

  const io = useMemo(
    () => state.fantallenatori.find((f) => f.io),
    [state.fantallenatori]
  );

  const aggiornaLega = useCallback((patch: Partial<LegaConfig>) => {
    setState((s) => ({ ...s, lega: { ...s.lega, ...patch } }));
  }, []);

  const aggiungiFantallenatore = useCallback((nome: string) => {
    setState((s) => ({
      ...s,
      fantallenatori: [
        ...s.fantallenatori,
        { id: `sq-${Date.now().toString(36)}`, nome: nome || "Nuova squadra" },
      ],
    }));
  }, []);

  const rinominaFantallenatore = useCallback((id: string, nome: string) => {
    setState((s) => ({
      ...s,
      fantallenatori: s.fantallenatori.map((f) =>
        f.id === id ? { ...f, nome } : f
      ),
    }));
  }, []);

  const rimuoviFantallenatore = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      fantallenatori: s.fantallenatori.filter((f) => f.id !== id),
      // Gli acquisti di una squadra rimossa tornano sul mercato.
      acquisti: s.acquisti.filter((a) => a.fantallenatoreId !== id),
    }));
  }, []);

  const impostaIo = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      fantallenatori: s.fantallenatori.map((f) => ({ ...f, io: f.id === id })),
    }));
  }, []);

  const assegna = useCallback(
    (playerId: string, fantallenatoreId: string, prezzo: number) => {
      setState((s) => ({
        ...s,
        acquisti: [
          ...s.acquisti.filter((a) => a.playerId !== playerId),
          {
            playerId,
            fantallenatoreId,
            prezzo: Math.max(1, Math.round(prezzo)),
            ts: Date.now(),
          },
        ],
      }));
    },
    []
  );

  const annullaAcquisto = useCallback((playerId: string) => {
    setState((s) => ({
      ...s,
      acquisti: s.acquisti.filter((a) => a.playerId !== playerId),
    }));
  }, []);

  const annullaUltimo = useCallback(() => {
    setState((s) => {
      if (s.acquisti.length === 0) return s;
      const ultimo = s.acquisti.reduce((max, a) => (a.ts > max.ts ? a : max));
      return {
        ...s,
        acquisti: s.acquisti.filter((a) => a.playerId !== ultimo.playerId),
      };
    });
  }, []);

  const toggleTarget = useCallback((playerId: string) => {
    setState((s) => ({
      ...s,
      target: s.target.includes(playerId)
        ? s.target.filter((id) => id !== playerId)
        : [...s.target, playerId],
      esclusi: s.esclusi.filter((id) => id !== playerId),
    }));
  }, []);

  const toggleEscluso = useCallback((playerId: string) => {
    setState((s) => ({
      ...s,
      esclusi: s.esclusi.includes(playerId)
        ? s.esclusi.filter((id) => id !== playerId)
        : [...s.esclusi, playerId],
      target: s.target.filter((id) => id !== playerId),
    }));
  }, []);

  const impostaPrezzoCustom = useCallback(
    (playerId: string, prezzo: number | null) => {
      setState((s) => {
        const next = { ...s.prezziCustom };
        if (prezzo === null) delete next[playerId];
        else next[playerId] = Math.max(1, Math.round(prezzo));
        return { ...s, prezziCustom: next };
      });
    },
    []
  );

  const importaListone = useCallback((players: Player[]) => {
    setState((s) => ({ ...s, listoneCustom: players }));
  }, []);

  const ripristinaListone = useCallback(() => {
    setState((s) => {
      const next = { ...s };
      delete next.listoneCustom;
      return next;
    });
  }, []);

  const caricaStato = useCallback((stato: AstaState) => {
    setState({ ...statoIniziale(), ...stato });
  }, []);

  const azzeraAsta = useCallback(() => {
    setState((s) => ({ ...s, acquisti: [] }));
  }, []);

  const azzeraTutto = useCallback(() => {
    setState(statoIniziale());
  }, []);

  const value: AstaContextValue = {
    state,
    pronto,
    listone,
    mercato,
    assegnati,
    rose,
    liberiPerRuolo,
    io,
    aggiornaLega,
    aggiungiFantallenatore,
    rinominaFantallenatore,
    rimuoviFantallenatore,
    impostaIo,
    assegna,
    annullaAcquisto,
    annullaUltimo,
    toggleTarget,
    toggleEscluso,
    impostaPrezzoCustom,
    importaListone,
    ripristinaListone,
    caricaStato,
    azzeraAsta,
    azzeraTutto,
  };

  return <AstaContext.Provider value={value}>{children}</AstaContext.Provider>;
}

export function useAsta(): AstaContextValue {
  const ctx = useContext(AstaContext);
  if (!ctx) {
    throw new Error("useAsta va usato dentro <AstaProvider>");
  }
  return ctx;
}

/** Prezzo di riferimento: quello personalizzato se c'è, altrimenti il modello. */
export function prezzoRiferimento(
  playerId: string,
  state: AstaState,
  mercato: Mercato
): number {
  const custom = state.prezziCustom[playerId];
  if (custom !== undefined) return custom;
  return mercato.get(playerId)?.consigliato ?? 1;
}
