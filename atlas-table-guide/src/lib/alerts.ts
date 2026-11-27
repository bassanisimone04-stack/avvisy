export type Alert = { kind: "price_change" | "price_below" | "reopening"; threshold_amount: number | null; currency: string | null; last_notified_at: string | null; created_at: string };
export type PriceRow = { amount: number | null; currency: string; recorded_at: string; menu: string };

/**
 * Decides whether an alert fires and what to tell the user.
 *  - price_change: any price_history row recorded after the last notification (or creation) with a different amount.
 *  - price_below: any current price at or under the threshold (same currency), not already notified for this value.
 */
export function evaluateAlert(alert: Alert, history: PriceRow[], current: PriceRow[]): { notify: boolean; lines: string[] } {
  const since = alert.last_notified_at ?? alert.created_at;
  if (alert.kind === "price_change") {
    const fresh = history.filter((h) => h.amount != null && h.recorded_at > since);
    const lines = fresh.map((h) => `${h.menu}: ${h.amount} ${h.currency} (${h.recorded_at.slice(0, 10)})`);
    return { notify: lines.length > 0, lines };
  }
  if (alert.kind === "price_below" && alert.threshold_amount != null) {
    const hits = current.filter((c) => c.amount != null && c.currency === alert.currency && c.amount <= alert.threshold_amount! && (!alert.last_notified_at || c.recorded_at > alert.last_notified_at));
    return { notify: hits.length > 0, lines: hits.map((c) => `${c.menu}: ${c.amount} ${c.currency}`) };
  }
  return { notify: false, lines: [] };
}
