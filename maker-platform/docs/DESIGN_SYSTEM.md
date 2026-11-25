# Design system

Fonte unica dei token: `src/app/globals.css` (blocco `@theme` di Tailwind v4).

## Colori
| Token | Valore | Uso |
|---|---|---|
| `ivory` | #F8F6F0 | Sfondo pagina |
| `ivory-deep` | #F0ECE2 | Sezioni alternate |
| `forest` | #263B32 | Titoli, primari, bande scure |
| `forest-deep` | #1B2A24 | Hover primari, banner |
| `sage` / `sage-ink` | #78866B / #56614B | Decorativo / testo AA |
| `clay` / `clay-ink` | #C47751 / #9A5432 | Accento (logo, decorazioni) / testo e link AA |
| `ink` | #222222 | Testo |
| `muted` / `subtle` | #5F5C55 / #6F6B62 | Testo secondario / terziario (≥4.5:1) |
| `line` / `line-strong` | #E3DED2 / #CFC8B8 | Bordi |

La terracotta pura (#C47751) non supera AA per i testi piccoli: per i testi si usa `clay-ink`. Il controllo è automatizzato con axe (`tests/e2e/a11y.spec.ts`).

## Tipografia
- **Fraunces** variabile (asse opsz, corsivo) per titoli e numerali editoriali; **Inter** variabile per UI e testo.
- Self-hosted da `@fontsource-variable` tramite `next/font/local` (nessuna richiesta a Google).
- Scala fluida: `text-display-xl/lg/md/sm`, `eyebrow` (maiuscoletto 0.75rem, tracking .14em).
- Il corsivo terracotta si usa per una sola parola chiave per titolo, non di più.

## Forme e movimento
- Raggi: `xs` 3 · `sm` 6 · `md` 10 · `lg` 14 px. Mai pillole su card.
- Ombre: `hairline`, `soft`, `lift`, calde e leggere.
- Animazioni: `animate-rise` (comparsa hero), hover discreti, transizioni ≤ 700 ms. `prefers-reduced-motion` disattiva tutto.
- Breakpoint: 390 · 640 · 768 · 1024 · 1280 · 1440.

## Linguaggio visivo
- **Tavole tecniche isometriche** (`IsoDrawing` + `PlanSheet`): ogni prodotto è disegnato a partire dai suoi componenti (`drawing` in `products.ts`), su carta millimetrata con cartiglio. Sono illustrazioni originali generate dai dati.
- **Materiali**: texture procedurali (noce, rovere, acero, ciliegio, end grain, compensato, quilt, cuoio, argento, argilla) generate da `scripts/generate-material-imagery.py`. Sono **segnaposto** per le fotografie, etichettati come tali nella UI.
- Index editoriali numerati (01, 02…), filetti sottili e numerali in corsivo al posto delle griglie di card ripetitive.

## Fotografia (da fare)
Prima del lancio servono foto con licenza o commissionate per: hero (laboratorio con luce naturale), le card dei verticali e le pagine business (solo foto fornite o autorizzate dal proprietario). Le immagini si sostituiscono in `src/config/verticals.ts` e nei componenti `home/`. Un'immagine generica non va mai associata a un'attività reale.

## Componenti principali
`Button`, `Badge`/`DemoBadge`, `Input`/`Select`/`Checkbox`, `SectionHeading`, `Breadcrumbs` (con JSON-LD), `ProductCard`, `PlanSheet`, `BusinessRow`, `UsMapStatic`, `DirectoryMap`, `BuyBox`, calcolatori in `components/tools`.
