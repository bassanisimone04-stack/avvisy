# Fonti dati, mappe e geocoding

## Stato attuale
- Le attività sono **fittizie** (`src/data/demo/businesses.ts`): numeri 555-01xx, siti su `example.com` (RFC 2606), coordinate approssimative dentro città reali.
- Il geocoding è una **tabella di lookup demo** (`features/directory/geo.ts`): Austin, Portland, Brooklyn, Denver e prefissi ZIP.
- La basemap è costruita sui confini degli stati USA dal pacchetto `us-atlas` (U.S. Census Bureau, pubblico dominio). Nessuna tile di terze parti.

## Pipeline di acquisizione (Fase 3)
CSV/fonte → staging → normalizzazione (indirizzo, telefono, URL) → geocoding → deduplicazione → validazione Zod → revisione admin → pubblicazione → report di import. Ogni record porta fonte, ID nella fonte, licenza, attribuzione, ultima verifica, stato di pubblicazione e stato di proprietà.

| Fonte | Licenza | Note |
|---|---|---|
| Inserimenti proprietari + verifica manuale | Propria | Priorità 1 |
| Overture Maps (Places) | CDLA-Permissive-2.0 / ODbL a seconda del tema | Verificare per ogni release |
| OpenStreetMap | ODbL | Attribuzione + share-alike sul DB derivato: valutare con un legale |
| Open data federali e statali | Varie | Caso per caso |
| Associazioni di categoria, dataset commerciali | Contratto | Solo con accordo scritto |

**Vietato:** scraping di Google Maps e copia di database di concorrenti. **Nessun dato reale entra nel sistema prima della verifica della licenza.**

## Mappe (decisione in Fase 3)
MapLibre GL è solo il renderer: tile e geocoding sono servizi separati, con costi e licenze propri.
- **Tile:** MapTiler (piano commerciale, `NEXT_PUBLIC_MAP_STYLE_URL`) oppure Protomaps PMTiles self-hosted (costi di storage e banda).
- **Geocoding:** Geocodio (focus USA, consente di salvare i risultati) o un equivalente. Verificare sempre i termini di **storage** dei risultati.
- Prezzi indicativi da verificare: MapTiler da ~$25/mese; Geocodio 2.500 lookup/giorno gratuiti, poi ~$0,50 ogni 1.000.
