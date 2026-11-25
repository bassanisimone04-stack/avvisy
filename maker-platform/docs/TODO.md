# TODO

## Decisioni in attesa (utente)
- [ ] **Approvazione dell'identità grafica della Fase 1**
- [ ] Nome del brand e dominio
- [ ] Ricerca di mercato (se disponibile) per confermare verticale e città di lancio
- [ ] Fotografie: acquisto/licenza o shooting commissionato
- [ ] Provider di tile e geocoding (MapTiler / Protomaps; Geocodio)

## Fase 2 (prossima)
- [ ] Progetto Supabase (dev) + PostGIS; migrazioni iniziali (vedi `DATABASE.md`)
- [ ] Supabase Auth (magic link) e ruoli; protezione server-side di `/admin`
- [ ] RLS su tutte le tabelle; test delle policy
- [ ] Reimplementare `features/*/repository.ts` su Supabase mantenendo le firme
- [ ] Preferiti persistenti per utente; migrazione dal `localStorage`
- [ ] Segnalazioni e claim salvati server-side, con rate limiting

## Debito tecnico / note
- [ ] Le primitive UI sono scritte a mano: valutare l'allineamento con il registry shadcn quando sarà raggiungibile
- [ ] Pagine geografiche `/explore/us/woodworking/{state}/{city}` (Fase 3) con soglie di indicizzazione
- [ ] Ottimizzazione 2D per i pannelli nel Cut List (oggi solo stima lineare dichiarata)
- [ ] Strumenti futuri per i nuovi verticali (quilt, leather, ring size…)
- [ ] CSP e audit delle dipendenze (Fase 6)
- [ ] Rivedere `partialPrefetching` quando Next.js gestirà gli status 404 nelle shell parziali

## Implementato / dimostrativo / pianificato
Vedi la tabella nel `README.md` e la pagina pubblica `/about-this-preview`.
