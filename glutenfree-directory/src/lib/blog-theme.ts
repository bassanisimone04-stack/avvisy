import type { BlogCategory } from "./types";

export interface CategoryTheme {
  accent: string;
  accentDark: string;
  soft: string;
  softDark: string;
}

const THEME: Record<BlogCategory, CategoryTheme> = {
  Alimentazione: { accent: "#a75b05", accentDark: "#fbbf24", soft: "#fef3c7", softDark: "#3a2c0c" },
  Celiachia: { accent: "#7c3aed", accentDark: "#a78bfa", soft: "#ede9fe", softDark: "#271b40" },
  News: { accent: "#475569", accentDark: "#94a3b8", soft: "#e2e8f0", softDark: "#232b36" },
  Ricette: { accent: "#bb4709", accentDark: "#fb923c", soft: "#ffedd5", softDark: "#3a2410" },
  Viaggi: { accent: "#0272ac", accentDark: "#38bdf8", soft: "#e0f2fe", softDark: "#0e2a38" },
  Salute: { accent: "#0a7b72", accentDark: "#2dd4bf", soft: "#ccfbf1", softDark: "#0d2e29" },
  Guide: { accent: "#0f7a47", accentDark: "#35b874", soft: "#e2f5ea", softDark: "#163b28" },
  Prodotti: { accent: "#c8216b", accentDark: "#f472b6", soft: "#fce7f3", softDark: "#3a1830" },
  Bambini: { accent: "#976703", accentDark: "#facc15", soft: "#fef9c3", softDark: "#332c0a" },
  Eventi: { accent: "#4f46e5", accentDark: "#818cf8", soft: "#e0e7ff", softDark: "#211f3d" },
};

export function getCategoryTheme(category: BlogCategory): CategoryTheme {
  return THEME[category];
}

const SLUGS: Record<BlogCategory, string> = {
  Alimentazione: "alimentazione",
  Celiachia: "celiachia",
  News: "news",
  Ricette: "ricette",
  Viaggi: "viaggi",
  Salute: "salute",
  Guide: "guide",
  Prodotti: "prodotti",
  Bambini: "bambini",
  Eventi: "eventi",
};

/** Classe CSS che espone --article-accent/--article-soft con override per il dark mode (vedi globals.css). */
export function categoryThemeClass(category: BlogCategory): string {
  return `cat-${SLUGS[category]}`;
}
