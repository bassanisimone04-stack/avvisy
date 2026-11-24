// Foto dei locali, in public/images/locali/<slug>.jpg.
// Si pubblicano solo foto scattate da noi o concesse per iscritto dal locale:
// un locale senza voce qui continua a mostrare l'illustrazione.
// `position` serve quando la foto non e' nel formato della scheda (4:3 o 16:10)
// e va tenuta la parte alta (es. l'insegna): e' il valore CSS di object-position.
export interface BusinessPhoto {
  src: string;
  position?: string;
}

export const BUSINESS_PHOTOS: Record<string, BusinessPhoto> = {
  // Scattata dal titolare del sito. Quadrata: si tiene la parte alta con l'insegna.
  "la-rosa-dei-venti-milano": { src: "/images/locali/la-rosa-dei-venti-milano.jpg", position: "50% 0%" },
  // Ritagliata sopra le persone: resta la facciata con l'ombrellone e la lampada.
  "panperfocaccia-torino": { src: "/images/locali/panperfocaccia-torino.jpg" },
  // Una figura nella vetrina e' sfocata (non riconoscibile). Quadrata: si tengono le insegne.
  "trattoria-vecchio-mercato-bologna": { src: "/images/locali/trattoria-vecchio-mercato-bologna.jpg", position: "50% 22%" },
  "mama-eat-roma": { src: "/images/locali/mama-eat-roma.jpg" },
  "quinoa-firenze": { src: "/images/locali/quinoa-firenze.jpg" },
};
