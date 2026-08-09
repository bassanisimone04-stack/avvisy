/**
 * Helper per generare link di affiliazione (Booking.com, GetYourGuide).
 *
 * L'ID affiliato/partner si imposta UNA VOLTA in src/config/site.ts
 * (SITE.affiliates): finché è vuoto "" i link funzionano comunque (portano
 * l'utente al sito, ricerca del nome+città) ma senza tracciare commissioni.
 * Appena imposti l'ID, tutti i link del sito iniziano a monetizzare senza
 * bisogno di modificare i contenuti.
 */
import { SITE } from "../config/site";

/** Link di ricerca Booking.com per un hotel/struttura (con aid se impostato). */
export function bookingUrl(nome: string, citta: string): string {
  const params = new URLSearchParams({ ss: `${nome}, ${citta}` });
  if (SITE.affiliates.bookingAid) params.set("aid", SITE.affiliates.bookingAid);
  return `https://www.booking.com/searchresults.html?${params.toString()}`;
}

/** Link di ricerca GetYourGuide per attività/tour in una città. */
export function getyourguideUrl(query: string): string {
  const params = new URLSearchParams({ q: query });
  if (SITE.affiliates.getyourguidePartnerId) {
    params.set("partner_id", SITE.affiliates.getyourguidePartnerId);
  }
  return `https://www.getyourguide.com/s/?${params.toString()}`;
}
