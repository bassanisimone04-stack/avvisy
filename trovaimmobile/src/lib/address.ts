// Normalizzazione degli indirizzi italiani per riconoscere lo stesso immobile
// anche quando viene scritto in modo diverso ("V.le Monza 12/a" == "viale monza 12 A").

const STREET_ABBREVIATIONS: [RegExp, string][] = [
  [/^v\.?\s*le\b\.?/, "viale"],
  [/^c\.?\s*so\b\.?/, "corso"],
  [/^p\.?\s*(zz|z)?a\b\.?/, "piazza"],
  [/^p\.?\s*le\b\.?/, "piazzale"],
  [/^l\.?\s*go\b\.?/, "largo"],
  [/^v\.?\s*lo\b\.?/, "vicolo"],
  [/^str\.?(?=\s)/, "strada"],
  [/^v\.(?=\s|\w)/, "via"],
];

export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function basic(s: string): string {
  return stripAccents(s).toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, " ").trim();
}

export function normalizeVia(via: string): string {
  let v = basic(via);
  for (const [re, full] of STREET_ABBREVIATIONS) {
    if (re.test(v)) {
      v = v.replace(re, full + " ");
      break;
    }
  }
  return v
    .replace(/[.,;:"]/g, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCivico(civico: string): string {
  // "12/A", "12 a", "12-a", "12bis" → "12a" / "12bis"
  return basic(civico).replace(/[^0-9a-z]/g, "");
}

export function normalizeComune(comune: string): string {
  return basic(comune).replace(/[^a-z0-9' ]/g, " ").replace(/'/g, "").replace(/\s+/g, " ").trim();
}

export function normalizeInterno(interno: string | null | undefined): string {
  if (!interno) return "";
  return basic(interno).replace(/^(int(erno)?|scala|sc)\.?\s*/, "").replace(/[^0-9a-z]/g, "");
}

/** Chiave dell'edificio: comune + via + civico. */
export function buildingKey(a: { comune: string; via: string; civico: string }): string {
  return [normalizeComune(a.comune), normalizeVia(a.via), normalizeCivico(a.civico)].join("|");
}

/** Chiave univoca dell'immobile: edificio + interno (vuoto se non specificato). */
export function addressKey(a: { comune: string; via: string; civico: string; interno?: string | null }): string {
  return buildingKey(a) + "|" + normalizeInterno(a.interno);
}

/** Via in forma leggibile, con iniziali maiuscole. */
export function prettyVia(via: string): string {
  return normalizeVia(via)
    .split(" ")
    .map((w, i) => (i > 0 && ["di", "del", "della", "dei", "degli", "delle", "da", "de", "e"].includes(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export function prettyCivico(civico: string): string {
  return normalizeCivico(civico).toUpperCase().replace(/^(\d+)([A-Z]+)$/, "$1/$2");
}
