---
# ============================================================
#  TEMPLATE — SCHEDA DI UN NUOVO LOCALE
# ============================================================
#
#  COME USARLO (per chi NON è tecnico):
#  1. Fai una COPIA di questo file nella stessa cartella
#     (src/content/restaurants/).
#  2. Rinomina la copia con il nome del locale, tutto minuscolo,
#     con i trattini al posto degli spazi e senza accenti.
#     Esempio: "Trattoria da Mario" → "trattoria-da-mario.md"
#     (il nome del file diventa l'indirizzo web della pagina)
#  3. Compila i campi qui sotto tra virgolette.
#  4. Salva. Fatto: il locale comparirà automaticamente sul sito.
#
#  NB: i file che iniziano con "_" (come questo) vengono ignorati
#      e NON diventano pagine del sito.
# ============================================================

nome: "Nome del Locale"
citta: "Città"
regione: "Regione"                     # es. "Lazio", "Sicilia", "Lombardia"
indirizzo: "Via Esempio 1, 00100 Città PR"

# Coordinate per la mappa. Come trovarle:
# apri Google Maps, tasto destro sul locale → "Che cosa c'è qui?"
# e copia i due numeri (il primo è lat, il secondo è lng).
coordinate:
  lat: 41.9028
  lng: 12.4964

tipo: "ristorante"                     # ristorante | trattoria | bar | caffè | pasticceria
prezzo: "€€"                           # € | €€ | €€€ | €€€€
stato: "aperto"                        # aperto | chiuso | temporaneamente-chiuso

# Metti "true" per mostrare il locale tra quelli IN EVIDENZA in home
# (utile per i locali sponsorizzati). Altrimenti lascia "false".
inEvidenza: false

# Immagine principale. Metti il file immagine (jpg/png) nella cartella
# src/assets/placeholder/ e scrivi qui il percorso.
immagine: "../../assets/placeholder/og-default.jpg"
immagineAlt: "Breve descrizione dell'immagine (per accessibilità e SEO)"

# Link opzionali (puoi cancellare le righe se non li hai).
sitoWeb: "https://www.esempio.it"
prenotazione: "https://www.esempio.it/prenota"

# Data dell'ultimo aggiornamento (anno-mese-giorno).
ultimoAggiornamento: 2026-01-01

# Elenco dei film o serie TV in cui appare il locale.
# Puoi aggiungerne quanti vuoi copiando il blocco che inizia con "- titolo:".
film:
  - titolo: "Titolo del Film o della Serie"
    anno: 2020
    regista: "Nome del Regista"
    serieTv: false                     # true se è una serie TV
    descrizioneScena: "Descrivi in una frase la scena girata o ambientata nel locale."

# Descrizione breve del locale (1-3 frasi).
descrizione: "Descrizione breve e invitante del locale."
---

<!-- Qui sotto puoi scrivere un testo più lungo (facoltativo) che comparirà
     nella pagina di dettaglio del locale. Usa un linguaggio semplice. -->

Racconta qui la storia del locale, i piatti tipici e perché vale la pena
visitarlo.
