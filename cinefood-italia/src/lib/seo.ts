/**
 * Aiutanti SEO per i titoli e le meta description generati dai template.
 * Google taglia i titoli oltre ~60 caratteri e le description oltre ~160:
 * qui scegliamo la prima variante che ci sta, invece di farla troncare.
 */

/** Lunghezza massima del titolo scritto nel frontmatter (il suffisso "· CineFood" è a parte). */
export const MAX_TITLE = 52;
/** Lunghezza massima della meta description. */
export const MAX_DESC = 158;

/**
 * Prende la prima variante di titolo che sta nel limite.
 * Se nessuna ci sta, taglia l'ultima al confine di parola.
 */
export function fitTitle(candidates: (string | undefined)[], max = MAX_TITLE): string {
  const valide = candidates.filter((c): c is string => !!c && c.trim().length > 0);
  const ok = valide.find((c) => c.length <= max);
  if (ok) return ok;
  const ultima = valide[valide.length - 1] ?? "";
  return troncaParola(ultima, max);
}

/** Accorcia una description al limite, tagliando al confine di parola. */
export function clampDesc(testo: string, max = MAX_DESC): string {
  const t = testo.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : troncaParola(t, max);
}

function troncaParola(t: string, max: number): string {
  if (t.length <= max) return t;
  const tagliato = t.slice(0, max - 1);
  const spazio = tagliato.lastIndexOf(" ");
  return (spazio > max * 0.6 ? tagliato.slice(0, spazio) : tagliato).replace(/[\s,;:.–-]+$/, "") + "…";
}
