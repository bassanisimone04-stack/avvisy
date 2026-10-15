# Strategia SEO e keyword

> **Nessun volume di ricerca è stato misurato** (nessun accesso a Semrush, Ahrefs, Keyword Planner o Search Console da questo ambiente). Le keyword qui sotto sono ipotesi strutturate: validale prima di investire in contenuti.

## 1. Mappa keyword → pagina (una keyword, una pagina)

| Tipo di pagina | Keyword principale (pattern) | Secondarie | Intento |
|---|---|---|---|
| `/movies/[film]` | `{film} sunglasses` | `what sunglasses are worn in {film}`, `{film} sunglasses brand` | informativo/identificazione |
| `/sunglasses/[modello]` | `{modello} sunglasses`, `{marchio} {codice}` | `what sunglasses does {attore} wear in {film}`, `{personaggio} sunglasses {film}`, `where to buy {modello}`, `{modello} alternative` | commerciale |
| `/actors/[attore]` | `{attore} sunglasses` | `{attore} movie sunglasses` | informativo |
| `/styles/[stile]` | `{stile} sunglasses worn in movies` | `best {stile} sunglasses inspired by movies` | commerciale |
| `/affordable-alternatives` | `cheap alternatives to movie sunglasses` | `movie sunglasses under $50 / $100` | commerciale |
| `/vintage` | `vintage movie sunglasses` | `vintage movie sunglasses you can still buy` | commerciale |
| `/blog/[articolo]` | vedi `EDITORIAL-PLAN.md` | | misto |

Le 244 keyword candidate derivate dal catalogo si generano in **Admin → Keyword & cluster → Genera candidate** (già mappate alla pagina giusta e senza volume). Il pulsante *Scarica CSV* le esporta per l'analisi bulk in Semrush/Ahrefs; reimporta il CSV con i volumi.

## 2. Cosa è stato ottimizzato nel codice

- **Title ≤ 60 caratteri** su tutte le pagine generate (prima la maggior parte delle schede modello superava 60, fino a 101). Pattern: `{Modello} – {Film} Sunglasses`; il suffisso del brand si aggiunge solo se ci sta. Test automatico.
- **Description ≤ 155 caratteri** con keyword, film, attore e grado di evidenza; nessun codice interno ("5022 (reported)") nei title.
- **Title univoci** su tutte le schede (test automatico) e controllo dei duplicati nell'audit.
- **FAQ guidate dai dati** su modelli, film e attori (`What sunglasses does X wear in Y?`) con markup `FAQPage`; per le identificazioni non confermate la risposta lo dice esplicitamente.
- **Contenuti**: i 5 articoli ora hanno risposta immediata con la keyword, meta description con la keyword, ≥ 300 parole, sezione "Quick facts" con link interni, checklist d'acquisto.
- **Link interni**: blocco "More movie sunglasses" nelle schede (stesso film, stesso attore, stesso marchio, stessa forma); articoli ↔ modelli ↔ film.
- **Dati strutturati**: `ItemList` su catalogo e film, `FAQPage`, `Product`, `Movie/TVSeries`, `Person`, `Brand`, `Article`, `BreadcrumbList`.
- **Anteprime social**: immagini Open Graph generate (solo testo, nessuna foto protetta) per home, modelli e film.
- **Contenuti sottili**: le pagine marchio con un solo modello sono `noindex` e fuori dalla sitemap; le descrizioni troppo brevi delle alternative sono state ampliate.
- `max-image-preview:large` e `max-snippet:-1` per gli snippet estesi.
- **Audit SEO** in Admin → *Audit SEO*: lunghezza title/description, duplicati, keyword assente da title/description/risposta, contenuto breve, pochi link interni, FAQ/fonti mancanti, cannibalizzazione (stessa keyword su più articoli o mappata a più URL).

## 3. Cosa resta da fare (richiede dati o decisioni tue)

1. Misurare i volumi (CSV candidate → Semrush/Ahrefs) e guardare le SERP dei 20 articoli; scartare o accorpare quelli senza domanda.
2. Collegare **Google Search Console** (verifica dominio, invio sitemap) e controllare query reali dopo 4–6 settimane.
3. Aggiungere **foto autorizzate** con alt descrittivo: oggi le pagine usano illustrazioni, che non competono su Google Immagini.
4. Cercare **fonti primarie** per le identificazioni: sono ciò che rende le schede più affidabili dei competitor.
5. Backlink e PR: non automatizzabili da codice.
6. Dopo il lancio: Core Web Vitals reali (PageSpeed/CrUX). Il carico JS condiviso è ~103 kB; non ho eseguito Lighthouse.
