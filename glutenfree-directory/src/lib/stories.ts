/**
 * "Le vostre storie": testimonianze di lettori. Resta vuoto finche' non ci
 * sono storie reali, inviate da persone vere e pubblicate col loro consenso.
 * Non si inventano testimonianze: la pagina nasconde la lista e resta
 * fuori dall'indice di Google finche' questo elenco e' vuoto.
 */
export interface Story {
  id: string;
  /** Nome o iniziale scelti dall'autore. */
  author: string;
  /** Slug della scheda locale citata, se c'e'. */
  businessSlug?: string;
  date: string; // YYYY-MM-DD
  body: string;
}

export const STORIES: Story[] = [];
