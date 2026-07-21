// Anti-disintermediazione: oscura i contatti diretti (telefono, email, link)
// scambiati nei messaggi, per scoraggiare le trattative fuori piattaforma.

const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const URL = /\b(?:https?:\/\/|www\.)[^\s]+/gi;
// Sequenze che assomigliano a un numero di telefono (cifre + separatori).
const PHONE = /\+?\d[\d.\-/ ]{6,}\d/g;
const HANDLE = /\b(whats?app|telegram|instagram|@[a-z0-9._]{3,})\b/gi;

/** Restituisce il testo con i contatti diretti mascherati. */
export function maskContacts(text: string): string {
  let out = text.replace(EMAIL, "•••@•••");
  out = out.replace(URL, "•••");
  out = out.replace(PHONE, (m) => {
    const digits = (m.match(/\d/g) || []).length;
    return digits >= 8 ? "•••••" : m;
  });
  out = out.replace(HANDLE, "•••");
  return out;
}

/** true se il testo contiene contatti diretti che verrebbero mascherati. */
export function hasContactInfo(text: string): boolean {
  return maskContacts(text) !== text;
}
