# Strategia SEO

## Struttura URL
```
/explore/us/woodworking/                       (implementata, noindex finché i dati sono demo)
/explore/us/woodworking/{state}/{city}/{cat}/  (Fase 3, solo sopra soglia)
/business/{slug}/                              (implementata)
/shop/  /shop/woodworking/  /shop/{product}/   (implementate)
/tools/{tool}/                                 (implementate, indicizzabili quando l'indexing sarà attivo)
/resources/{article}/                          (Fase 5)
```

## Implementato
- Metadata per pagina con canonical e Open Graph (`lib/seo.ts → pageMetadata`).
- Breadcrumb visibile + `BreadcrumbList` JSON-LD.
- `productJsonLd` predisposto, ma **non emesso per i prodotti demo**. Nessun `AggregateRating`.
- `LocalBusiness` sarà emesso solo per le schede verificate (Fase 3).
- `robots.txt` e `sitemap.xml` dinamici. La sitemap esclude i contenuti demo.
- **Kill switch:** finché `NEXT_PUBLIC_ALLOW_INDEXING` non è `true`, il sito ha `robots: noindex` + header `X-Robots-Tag: noindex, nofollow` + `Disallow: /`. Lo verifica un test e2e.
- 404 reali per gli slug inesistenti (niente soft 404).
- Directory consultabile senza JavaScript: lista server-side e filtri tramite form GET.

## Regole di indicizzazione (da applicare in Fase 3)
- Pagina città: indicizzabile con almeno 3 attività pubblicate e verificate; pagina città+categoria: almeno 3 attività della categoria. Sotto soglia: `noindex, follow` ed esclusione dalla sitemap.
- Combinazioni di filtri in query string: canonical sulla pagina pulita.
- Mai indicizzare: dati demo, preview, admin, account, carrello, ricerca, verticali non attivi.
- `hreflang` solo per pagine con un equivalente tradotto realmente pubblicato.

## Linking interno
Strumento → prodotti correlati + directory; prodotto → "Make it locally" + correlati; attività → progetti realizzabili + attività vicine.
