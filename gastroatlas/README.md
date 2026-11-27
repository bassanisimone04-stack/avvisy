# GastroAtlas (Next.js + TypeScript)

Migrazione della guida statica GastroAtlas a Next.js 15 (App Router, TypeScript strict).
Verde bosco `#142820`, avorio `#f6f3ec`, DM Sans. Il codice originale è in `legacy/` solo come riferimento.

```bash
npm install
npm run dev          # http://localhost:3300  →  /  porta a /it/
npm run build && npm start
npm test             # 27 test unitari (filtri, confronto, catalogo, i18n)
npm run e2e          # 64 test nel browser: telefono 390, tablet 768, desktop 1280
```

## Indirizzi (invariati rispetto all'originale)
`/it/` · `/en/` · `/{it,en}/restaurants/` (`?q=&city=&cuisine=&level=&max=&rooms=1&sort=price|high|name`) ·
`/restaurants/{città}/` · `/restaurant/atlas-1 … atlas-30/` · `/compare/?r=atlas-1,atlas-2` · `/favorites/` e le altre pagine del menu.

## Dati
`src/data/catalog.ts`: 30 ristoranti **fittizi**, 10 destinazioni. Ogni scheda mostra "Demo", "Distinzione demo · Livello n", "Menù demo".
Tutto il sito è `noindex` finché non imposti `NEXT_PUBLIC_INDEXABLE=true` (da fare solo con dati reali).
Preferiti e confronti restano nel browser con le stesse chiavi dell'originale (`atlas-saves`, `atlas-compare`).

## Foto
`public/assets/*.webp` (dal tuo zip). Per aggiungerne altre: salva il file in `public/assets/`, poi usa `<Photo name="nome-file" … />`.
