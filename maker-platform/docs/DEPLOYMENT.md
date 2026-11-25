# Deployment

**Nessun deployment è stato effettuato.** Questo documento descrive il setup previsto.

## Vercel
1. Nuovo progetto Vercel collegato a questo repository, con **Root Directory = `maker-platform`**.
2. Framework: Next.js; install `pnpm install`; build `pnpm build` (lo script `prebuild` copia il worker MapLibre).
3. Variabili per ambiente (vedi `.env.example`). In Preview: `NEXT_PUBLIC_ALLOW_INDEXING=false` (sempre).
4. Il dominio definitivo si collega solo dopo approvazione.

Nota: negli altri progetti del repository, Vercel non avvia i deploy dei commit fatti da Claude (autore non collegato) e si usano Deploy Hook in GitHub Actions. Valutare lo stesso approccio, previa approvazione.

## Passi (a cura dell'utente, account Vercel)
1. vercel.com → **Add New → Project** → importa il repository `avvisy`.
2. **Root Directory:** `maker-platform` (il repository contiene più progetti).
3. Framework Next.js, Install `pnpm install`, Build `pnpm build`.
4. Environment Variables: `NEXT_PUBLIC_SITE_URL` = URL del progetto Vercel, `NEXT_PUBLIC_ALLOW_INDEXING` = `false` (lascialo `false` finché non approvi il lancio), `NEXT_PUBLIC_DEMO_MODE` = `true`.
5. Project Settings → Git → **Deploy Hooks** → crea un hook per `main`; copia l'URL.
6. GitHub → Settings → Secrets and variables → Actions → nuovo secret `VERCEL_DEPLOY_HOOK_MAKER_PLATFORM` con quell'URL.
7. Ogni push su `main` che tocca `maker-platform/` avvia il deploy tramite `.github/workflows/deploy-maker-platform.yml`. Le pull request ottengono la preview di Vercel.

Il dominio si collega solo dopo la decisione sul brand.

## CI (GitHub Actions)
`.github/workflows/maker-platform-ci.yml` (alla radice del repository) parte solo per modifiche in `maker-platform/**` ed esegue typecheck, lint, test unitari, build ed e2e Playwright. Non esegue deploy.

## Branch
`main` = produzione. Feature branch + pull request + preview deployment. Nessun push su `main` senza autorizzazione.
