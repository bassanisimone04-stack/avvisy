# Contesto del progetto

## Visione
Una piattaforma unica per maker che risponde a sei domande: **cosa** realizzare, **come**, **dove**, **dove comprare i materiali**, **con quali strumenti**, **quali progetti digitali acquistare**. Il vantaggio competitivo è l'integrazione tra prodotti digitali, risorse fisiche locali e strumenti: ogni pagina rimanda agli altri due pilastri (esempio: calcolatore → piano DXF → servizio CNC vicino).

## Pilastri
- **EXPLORE**: directory map-first di workshop, makerspace, servizi CNC, fornitori di legname.
- **CREATE**: store centralizzato di prodotti digitali (PDF, DXF, SVG, STEP, STL, XLSX, CSV, ZIP).
- **TOOLS**: calcolatori gratuiti con formule documentate.

## Decisioni prese
| Tema | Decisione | Stato |
|---|---|---|
| Collocazione | Cartella `maker-platform/` nel repository `avvisy`, accanto agli altri progetti | Approvata |
| Brand | Segnaposto "YourBrand" in `src/config/site.ts` | Da decidere |
| Dominio | Da decidere; `NEXT_PUBLIC_SITE_URL` | Da decidere |
| Mercato iniziale | USA, en-US, USD, unità imperiali con supporto metrico | Approvata |
| Verticale iniziale | Woodworking & CNC (nessuna ricerca di mercato presente nel repository) | Approvata |
| Architettura | Monolite modulare Next.js | Approvata |

## Monetizzazione (ipotesi da validare)
- Prodotti digitali: entry $5–15, premium $19–39, bundle $39–99, licenze commerciali $49–149.
- Schede: FREE (sempre gratuita); PRO ~$29/mese e BUSINESS ~$79/mese, prezzi da testare.
- Le inserzioni sponsorizzate sono sempre etichettate. Correggere i dati o verificare la proprietà di una scheda non è mai a pagamento.
- In seguito: affiliazioni, lead generation, contenuti sponsorizzati, commissioni marketplace.

## Principi non negoziabili
- Niente dati inventati su attività reali: recensioni, valutazioni, prezzi, disponibilità.
- Niente scraping non autorizzato e nessun import di dati reali prima di aver verificato la licenza.
- I file tecnici venduti sono sempre verificati da una persona.
- Il proprietario opera dall'Italia e vende negli USA: sales tax, IVA/OSS, GDPR e tutela dei consumatori vanno valutati con professionisti.
