import type { Film, Restaurant } from "./utils";
import { localiPerFilm } from "./utils";

/** Film "vicini": stessa città (campo citta[]) o stessa regione dei locali. Solo film che hanno almeno un locale in guida. */
export function filmCorrelati(film: Film, films: Film[], locali: Restaurant[], n = 4): Film[] {
  const mine = localiPerFilm(locali, film.id);
  const regioni = new Set(mine.map((l) => l.data.regione));
  const citta = new Set(film.data.citta);
  return films
    .filter((f) => f.id !== film.id)
    .map((f) => {
      const loc = localiPerFilm(locali, f.id);
      if (loc.length === 0) return { f, s: -1 };
      let s = 0;
      if (f.data.citta.some((c) => citta.has(c)) || loc.some((l) => citta.has(l.data.citta))) s += 3;
      if (loc.some((l) => regioni.has(l.data.regione))) s += 1;
      return { f, s };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || a.f.data.titolo.localeCompare(b.f.data.titolo, "it"))
    .slice(0, n)
    .map((x) => x.f);
}

/** Film con locali nella stessa regione ma non già mostrati nella pagina città. */
export function filmDellaRegione(regione: string, escludi: Set<string>, films: Film[], locali: Restaurant[], n = 4): Film[] {
  return films
    .filter((f) => !escludi.has(f.id) && localiPerFilm(locali, f.id).some((l) => l.data.regione === regione))
    .sort((a, b) => a.data.titolo.localeCompare(b.data.titolo, "it"))
    .slice(0, n);
}
