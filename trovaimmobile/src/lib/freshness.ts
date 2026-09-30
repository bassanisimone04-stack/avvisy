// Disponibilità verificata: ogni annuncio porta con sé quando l'inserzionista ha confermato
// per l'ultima volta che l'immobile è ancora libero.

export const RECONFIRM_EVERY_DAYS = 7;
const DAY = 86400000;

export type Freshness = "fresh" | "aging" | "stale";

export function freshness(confirmedAt: string, now = Date.now()): Freshness {
  const age = now - Date.parse(confirmedAt);
  if (age <= RECONFIRM_EVERY_DAYS * DAY) return "fresh";
  if (age <= 2 * RECONFIRM_EVERY_DAYS * DAY) return "aging";
  return "stale";
}

/** Espressione SQL del "gruppo" di freschezza (0 migliore): gli annunci non riconfermati scendono nei risultati. */
export function freshnessRankSql(column: string): string {
  return `CASE
    WHEN julianday('now') - julianday(${column}) <= ${RECONFIRM_EVERY_DAYS} THEN 0
    WHEN julianday('now') - julianday(${column}) <= ${2 * RECONFIRM_EVERY_DAYS} THEN 1
    ELSE 2 END`;
}
