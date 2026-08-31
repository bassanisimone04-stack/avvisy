# Directory Longevità, Biohacking e Medicina Preventiva — documentazione di progetto

Documentazione strategica e operativa per il lancio della directory verticale italiana su
longevità, biohacking e medicina preventiva: architettura del sito, tassonomia della directory,
strategia editoriale SEO, acquisizione dei centri e design system.

## Indice

| Documento | Contenuto |
|---|---|
| [`docs/01-architettura-informativa.md`](docs/01-architettura-informativa.md) | Alberatura del menu e delle pagine di servizio, struttura URL, tassonomia della directory (9 macro-categorie + sottocategorie), filtri di ricerca, modello dati della scheda, piani di abbonamento, conformità sanitaria, implementazione su WordPress / Webflow / Next.js |
| [`docs/02-strategia-blog-e-keyword.md`](docs/02-strategia-blog-e-keyword.md) | Modello pilastro-cluster, 10 categorie del blog, 9 macro-temi con i relativi cluster, standard editoriale e struttura dell'articolo, le 10 keyword di lancio, calendario dei primi 90 giorni |
| [`docs/03-acquisizione-centri-outreach.md`](docs/03-acquisizione-centri-outreach.md) | Criteri e fonti per i primi 50 centri, modello di punteggio, template di cold email con sequenza di follow-up, gestione delle obiezioni, strategia di inbound listing e piano operativo a 6 settimane |
| [`docs/04-design-system.md`](docs/04-design-system.md) | Design system in stile "Afterglow": token colore, tipografia, componenti, accessibilità |

## Stato

Fase di progettazione. Il codice del sito non è ancora in questa cartella: l'implementazione
consigliata riusa il pattern di `glutenfree-directory` (Next.js 15 + App Router + directory
filtrabile + blog + area business + admin) con tassonomia e design system di questi documenti.
