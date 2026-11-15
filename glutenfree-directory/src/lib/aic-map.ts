import { BUSINESSES } from "./mock-businesses";
import type { Business } from "./types";

/**
 * Ristoranti e pizzerie della directory che risultano aderenti al programma
 * AIC Alimentazione Fuori Casa. Numeri e città della pagina "Mappa ristoranti
 * AIC" sono tutti calcolati da qui: niente cifre scritte a mano.
 */
export function aicRestaurants(): Business[] {
  return BUSINESSES.filter((b) => b.aicCertified && (b.category === "ristorante" || b.category === "pizzeria"));
}
