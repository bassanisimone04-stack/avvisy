/**
 * Gradazione dell'evidenza scientifica usata nel blog.
 * Vedi docs/02-strategia-blog-e-keyword.md §4.2.
 */
export const EVIDENCE_LEVELS = ["solida", "promettente", "insufficiente"] as const;
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

export const EVIDENCE_META: Record<EvidenceLevel, { label: string; dot: string }> = {
  solida: { label: "Evidenza solida", dot: "var(--color-mint)" },
  promettente: { label: "Promettente ma incerta", dot: "#E0A33E" },
  insufficiente: { label: "Insufficiente / marketing", dot: "#E2685C" },
};
