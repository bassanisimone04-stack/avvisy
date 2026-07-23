---
# ============================================================
#  TEMPLATE — SCHEDA DI UN NUOVO LOCALE
# ============================================================
#  COME USARLO (per chi NON è tecnico):
#  1. Copia questo file nella stessa cartella (src/content/restaurants/).
#  2. Rinominalo con il nome del locale: minuscolo, con i trattini al
#     posto degli spazi e senza accenti. Es. "Trattoria da Mario" →
#     "trattoria-da-mario.md" (il nome file diventa l'indirizzo web).
#  3. Compila i campi qui sotto e salva.
#  I file che iniziano con "_" (come questo) vengono ignorati.
#
#  IMPORTANTE: nel campo "film" devi usare lo SLUG di un film che esiste
#  già nella cartella src/content/films/. Se il film non c'è ancora,
#  crealo prima copiando src/content/films/_template.md.
# ============================================================

nome: "Nome del Locale"
citta: "Città"
regione: "Regione"                     # es. "Lazio", "Lombardia"
indirizzo: "Via Esempio 1, 00100 Città PR"

# Coordinate per la mappa (tasto destro su Google Maps → "Che cosa c'è qui?").
coordinate:
  lat: 41.9028
  lng: 12.4964

tipo: "ristorante"                     # ristorante | trattoria | bar | caffè | pasticceria
categoria: "set-reale"                 # set-reale (girato qui) | a-tema-cinema (a tema)
prezzo: "€€"                           # € | €€ | €€€ | €€€€
stato: "aperto"                        # aperto | chiuso | temporaneamente-chiuso
inEvidenza: false                      # true = mostralo tra i locali in evidenza

# Immagine principale (metti il file in src/assets/placeholder/).
immagine: "../../assets/placeholder/og-default.jpg"
immagineAlt: "Descrizione dell'immagine (accessibilità e SEO)"

# Galleria opzionale (altre foto). Cancella le righe se non ti serve.
galleria:
  - "../../assets/placeholder/gallery-1.jpg"
  - "../../assets/placeholder/gallery-2.jpg"

# Link opzionali (cancella le righe se non li hai).
sitoWeb: "https://www.esempio.it"
prenotazione: "https://www.esempio.it/prenota"

ultimoAggiornamento: 2026-01-01

# Film/serie collegati. "film" = SLUG di un file in src/content/films/.
# Copia il blocco "- film:" per aggiungerne altri.
film:
  - film: "titolo-del-film"            # es. "la-grande-bellezza"
    descrizioneScena: "Descrivi in una frase la scena girata o ambientata qui."

descrizione: "Descrizione breve e invitante del locale."
---

<!-- Testo lungo facoltativo che comparirà nella pagina di dettaglio. -->

Racconta qui la storia del locale, i piatti tipici e perché visitarlo.
