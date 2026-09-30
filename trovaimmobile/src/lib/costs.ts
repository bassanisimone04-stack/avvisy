export type CostInput = { canone: number; spese: number; cauzione: number; commissione: number };

/**
 * Costo totale d'ingresso: quanto serve per entrare in casa.
 * = primo mese di canone + primo mese di spese condominiali + cauzione + commissione d'agenzia.
 */
export function entryCost(c: CostInput): number {
  return c.canone + c.spese + c.cauzione + c.commissione;
}

export function monthlyCost(c: Pick<CostInput, "canone" | "spese">): number {
  return c.canone + c.spese;
}

/** Mesi di cauzione (arrotondati a mezzo mese), utile per segnalare cauzioni anomale. */
export function depositMonths(c: Pick<CostInput, "canone" | "cauzione">): number {
  return Math.round((c.cauzione / c.canone) * 2) / 2;
}
