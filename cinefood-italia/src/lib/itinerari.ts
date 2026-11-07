/**
 * Mappa film → slug dell'articolo-itinerario del blog.
 * Usata per collegare le pagine film ai relativi approfondimenti (link interni).
 * Lo slug è quello base (senza suffisso -en); per l'inglese si aggiunge /en/.
 */
export const ITINERARIO_PER_FILM: Record<string, string> = {
  "il-commissario-montalbano": "dove-mangiava-montalbano-sicilia",
  "il-padrino": "bar-vitelli-savoca-padrino",
  "mangia-prega-ama": "eat-pray-love-pizza-da-michele-napoli",
  "chiamami-col-tuo-nome": "chiamami-col-tuo-nome-crema",
  "benvenuti-al-sud": "benvenuti-al-sud-castellabate",
  "la-grande-bellezza": "la-grande-bellezza-ristoranti-roma",
  "il-postino": "il-postino-salina-eolie",
  "nuovo-cinema-paradiso": "nuovo-cinema-paradiso-palazzo-adriano",
  "un-americano-a-roma": "un-americano-a-roma-maccheroni",
  "la-dolce-vita": "la-dolce-vita-via-veneto-cafe-de-paris",
  "il-talento-di-mr-ripley": "mr-ripley-venezia-caffe-florian",
  "the-white-lotus": "the-white-lotus-sicilia-taormina",
  "la-vita-e-bella": "la-vita-e-bella-arezzo",
  "l-oro-di-napoli": "pizzerie-napoli-nei-film-oltre-da-michele",
};
