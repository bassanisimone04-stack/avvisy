# Deployment

**Nessun deployment è stato effettuato.** Questo documento descrive il setup previsto.

## Vercel
1. Nuovo progetto Vercel collegato a questo repository, con **Root Directory = `maker-platform`**.
2. Framework: Next.js; install `pnpm install`; build `pnpm build` (lo script `prebuild` copia il worker MapLibre).
3. Variabili per ambiente (vedi `.env.example`). In Preview: `NEXT_PUBLIC_ALLOW_INDEXING=false` (sempre).
4. Il dominio definitivo si collega solo dopo approvazione.

Nota: negli altri progetti del repository, Vercel non avvia i deploy dei commit fatti da Claude (autore non collegato) e si usano Deploy Hook in GitHub Actions. Valutare lo stesso approccio, previa approvazione.

## CI (GitHub Actions)
`.github/workflows/maker-platform-ci.yml` (alla radice del repository) parte solo per modifiche in `maker-platform/**` ed esegue typecheck, lint, test unitari, build ed e2e Playwright. Non esegue deploy.

## Branch
`main` = produzione. Feature branch + pull request + preview deployment. Nessun push su `main` senza autorizzazione.
