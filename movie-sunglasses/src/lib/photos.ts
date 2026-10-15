import type { Photo, PhotoLicense } from "./types";

export const LICENSES: { value: PhotoLicense; label: string; needsProof: boolean; hint: string }[] = [
  { value: "owned", label: "Scatto nostro (proprietario)", needsProof: false, hint: "Hai fotografato tu il prodotto o hai un contratto di cessione con il fotografo." },
  { value: "licensed", label: "Licenza acquistata (Getty, Alamy, Shutterstock…)", needsProof: true, hint: "Incolla il link alla licenza o alla ricevuta; controlla l'uso editoriale e web." },
  { value: "press", label: "Materiale stampa (presskit/EPK dello studio o del marchio)", needsProof: true, hint: "Incolla il link alla pagina del presskit e leggi i termini d'uso: spesso valgono solo per recensioni/editoriale." },
  { value: "cc", label: "Creative Commons (es. Wikimedia Commons)", needsProof: true, hint: "Incolla il link alla pagina del file: licenza, autore e obblighi di attribuzione." },
  { value: "public_domain", label: "Pubblico dominio", needsProof: true, hint: "Documenta perché è di pubblico dominio (es. pagina Commons). Attenzione: varia per paese." },
  { value: "fair_use", label: "Fair use dichiarato (NON è una licenza)", needsProof: false, hint: "Fotogramma usato come commento/identificazione. Rischio tuo: può essere contestato. Serve motivazione scritta e pagina di origine." },
  { value: "affiliate_feed", label: "Immagine da feed di un programma affiliato", needsProof: true, hint: "Solo se i termini del programma consentono di mostrare le immagini prodotto; incolla il link ai termini." },
];

export const LICENSE_LABEL = Object.fromEntries(LICENSES.map((l) => [l.value, l.label.replace(/ \(.*\)$/, "")])) as Record<string, string>;

/** Returns an error message (Italian, for the admin) or null. A photo can only go live with provable rights. */
export function validatePhoto(p: Pick<Photo, "url" | "alt" | "credit" | "license" | "licenseUrl" | "approved" | "modelId" | "movieId" | "articleId" | "kind" | "sourceUrl" | "rightsNote">, opts: { ownHost?: string } = {}): string | null {
  if (!/^https:\/\//.test(p.url)) return "L'URL dell'immagine deve iniziare con https://";
  if (!p.modelId && !p.movieId && !p.articleId) return "Collega la foto ad almeno un modello, un film o un articolo.";
  if (!p.approved) return null;
  if (p.alt.trim().length < 10) return "Per approvare serve un testo alternativo descrittivo (almeno 10 caratteri).";
  if (!p.credit.trim()) return "Per approvare serve il credito dell'autore.";
  const lic = LICENSES.find((l) => l.value === p.license);
  if (!lic) return "Per approvare scegli un tipo di licenza dall'elenco.";
  if (lic.needsProof && !(p.licenseUrl && /^https:\/\//.test(p.licenseUrl))) return `Per approvare una foto con licenza «${LICENSE_LABEL[lic.value]}» serve il link https alla prova dei diritti.`;
  if (p.license === "fair_use") {
    if (p.kind !== "scene") return "Il fair use vale solo per fotogrammi/scene (tipo «Scena»). Per le foto prodotto usa scatti tuoi, immagini dei marchi o dei programmi affiliati.";
    if ((p.rightsNote ?? "").trim().length < 40) return "Per il fair use scrivi la motivazione (almeno 40 caratteri): perché l'uso è commento/identificazione e come è limitato.";
    if (!(p.sourceUrl && /^https:\/\//.test(p.sourceUrl))) return "Per il fair use indica la pagina di origine (https) da cui proviene l'immagine.";
    if (opts.ownHost) { let host = ""; try { host = new URL(p.url).host; } catch { /* checked above */ } if (host !== opts.ownHost) return `Ospita l'immagine sul tuo storage (${opts.ownHost}): non collegare direttamente il sito di altri (hotlink).`; }
  }
  if (p.kind === "product" && !p.modelId) return "Una foto «prodotto» deve essere collegata a un modello.";
  return null;
}
