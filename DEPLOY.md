# Istruzioni per il deploy (per Claude Code)

Questo è l'MVP di **Avvisy** — Next.js (App Router) + TypeScript + Tailwind v4, solo dati mock. Niente Supabase, autenticazione o pagamenti per ora.

## Obiettivo immediato: mettere il sito online su Vercel

Aiutami a fare il deploy passo passo. Io sto lavorando da un PC e non ho pratica con il terminale, quindi guidami e, dove puoi, esegui tu i comandi spiegandomi cosa fanno.

### 1. Verifica che il progetto giri in locale

```bash
npm install
npm run dev
```

Deve partire su http://localhost:3000 e mostrare la landing. Le route da controllare:
`/` · `/s/demo-caf` · `/s/demo-caf/book` · `/checkin/demo-appointment` · `/dashboard` (+ `/appointments`, `/services`, `/queue`, `/settings`).

### 2. Controlla che il build di produzione passi

```bash
npm run build
```

Nota: il layout usa i Google Fonts (Bricolage Grotesque, Instrument Sans, JetBrains Mono) via `next/font/google`. Se il build fallisce perché non riesce a scaricarli (rete assente o CDN Google bloccata), convertili in `next/font/local` oppure sostituiscili temporaneamente con font di sistema, poi spiegami la modifica.

### 3. Push su GitHub

Il `.gitignore` è già configurato (esclude `node_modules`, `.next`, ecc.). Aiutami a:
- inizializzare il repo git,
- fare il primo commit,
- creare un repo su GitHub (posso crearlo io dal sito se mi dici i passaggi, oppure usa la GitHub CLI `gh` se disponibile),
- fare il push su `main`.

Se serve autenticazione GitHub, spiegami come generare un Personal Access Token.

### 4. Deploy su Vercel

Preferisco collegare GitHub a Vercel dal sito (vercel.com → Add New → Project → import del repo → Deploy, senza toccare i default). In alternativa, se hai la Vercel CLI, possiamo fare `vercel` da terminale: spiegami pro e contro e procediamo come consigli tu.

## Dopo il deploy

Quando il sito è online e verificato da telefono, i prossimi passi saranno (in ordine):
1. Rifinire l'UI.
2. Schema Supabase (tradurre `src/lib/types.ts` in tabelle con RLS, poi sostituire `src/lib/mock-data.ts` con query reali — gli helper come `getOrganizationBySlug` sono già il punto di aggancio).
3. Autenticazione (proteggere `/dashboard`, derivare l'org dalla sessione al posto dell'`ORG_ID` fisso).
4. Realtime sulla coda.

Per ora concentriamoci solo sul deploy.
