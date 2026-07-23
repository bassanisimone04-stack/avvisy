# 🎬 CineFood Italia

Sito web tipo **directory** dedicato ai ristoranti, bar e caffè italiani
apparsi in **film e serie TV**. È un sito **statico** (velocissimo e ottimo
per Google), con un look "cinematografico" (tema scuro, accenti oro) e
**senza database**: ogni locale, film o articolo è un semplice file di testo,
quindi puoi aggiornarlo **senza saper programmare**.

> Il nome "CineFood Italia" è provvisorio: puoi cambiarlo in un secondo
> (vedi [Come rinominare il sito](#-come-rinominare-il-sito)).

---

## 📑 Indice

1. [Cosa serve per iniziare](#-cosa-serve-per-iniziare)
2. [Avviare il sito sul tuo computer](#-avviare-il-sito-sul-tuo-computer)
3. [Come aggiungere un nuovo ristorante](#-come-aggiungere-un-nuovo-ristorante-passo-passo)
4. [Come aggiungere un nuovo film](#-come-aggiungere-un-nuovo-film)
5. [Come aggiungere una città](#-come-aggiungere-una-città)
6. [Come aggiungere un articolo al blog](#-come-aggiungere-un-articolo-al-blog)
7. [Rinominare il sito e cambiare colori/font](#-come-rinominare-il-sito)
8. [Pubblicare online gratis](#-pubblicare-il-sito-online-gratis)
9. [Struttura delle cartelle](#-struttura-delle-cartelle)
10. [Domande frequenti](#-domande-frequenti)

---

## 🧰 Cosa serve per iniziare

Devi installare **una sola cosa**: **Node.js**.

1. Vai su <https://nodejs.org> e scarica la versione **LTS**.
2. Installa come un normale programma (Avanti → Avanti → Fine).

---

## 💻 Avviare il sito sul tuo computer

Apri il **Terminale** e scrivi questi comandi uno alla volta:

```bash
cd cinefood-italia   # entra nella cartella del sito
npm install          # installa i componenti (solo la prima volta)
npm run dev          # avvia il sito
```

Apri il browser su **http://localhost:4321**. Ogni modifica salvata aggiorna
la pagina da sola. Per fermare il sito: `Ctrl + C`.

---

## 🍝 Come aggiungere un nuovo ristorante (passo passo)

Aggiungere un locale = **creare un file**.

1. Vai in `src/content/restaurants/` e **copia** il file `_template.md`.
2. **Rinomina** la copia con il nome del locale, minuscolo, con i trattini e
   senza accenti. Es. "Trattoria da Mario" → `trattoria-da-mario.md`
   (il nome del file diventa l'indirizzo web `/locale/trattoria-da-mario`).
3. Apri il file e compila i campi. Ecco quelli principali:

```yaml
nome: "Nome del Locale"
citta: "Città"
regione: "Regione"
indirizzo: "Via Esempio 1, 00100 Città PR"
coordinate: { lat: 41.9028, lng: 12.4964 }   # da Google Maps, tasto destro
tipo: "ristorante"          # ristorante | trattoria | bar | caffè | pasticceria
categoria: "set-reale"      # set-reale (girato qui) | a-tema-cinema (a tema)
prezzo: "€€"                # € | €€ | €€€ | €€€€
stato: "aperto"             # aperto | chiuso | temporaneamente-chiuso
inEvidenza: false           # true = compare tra i locali in evidenza
immagine: "../../assets/placeholder/og-default.jpg"
immagineAlt: "Descrizione della foto"
ultimoAggiornamento: 2026-01-01
film:
  - film: "la-grande-bellezza"   # SLUG di un film esistente in src/content/films/
    descrizioneScena: "Cosa succede nella scena girata qui."
descrizione: "Descrizione breve e invitante."
```

> ⚠️ **Importante:** nel campo `film` devi usare lo **slug di un film che
> esiste già** in `src/content/films/`. Se il film non c'è ancora, crealo
> prima (vedi sotto). Se sbagli, il sito te lo segnala con un errore chiaro.

4. Metti la foto (jpg/png) in `src/assets/placeholder/` e scrivi il percorso
   nel campo `immagine`. Puoi aggiungere una `galleria` di foto extra.
5. Salva: il locale compare automaticamente su home, elenco, mappa, pagina
   città e pagina film.

**Set reale vs a tema cinema:** usa `categoria: "set-reale"` se il film è
stato girato davvero lì; `categoria: "a-tema-cinema"` per i locali a tema
(arredi, menù ispirati al cinema) che non sono location reali.

---

## 🎞️ Come aggiungere un nuovo film

I film sono schede a parte (con FAQ per Google). Per aggiungerne uno:

1. In `src/content/films/` copia `_template.md`.
2. Rinominalo con lo slug del film. Es. `la-grande-bellezza.md`
   (diventa la pagina `/film/la-grande-bellezza`).
3. Compila titolo, anno, regista, sinossi, locandina, città e le FAQ.
4. Usa questo **stesso slug** nel campo `film` delle schede dei locali per
   collegarli.

---

## 🏙️ Come aggiungere una città

Le città **si creano da sole**: appena un locale ha un nuovo valore nel campo
`citta`, la pagina città (es. `/roma`) viene generata in automatico.
Per darle una bella foto di copertina, metti un'immagine in
`src/assets/cities/` con il nome-slug della città (es. `firenze.jpg`).

---

## ✍️ Come aggiungere un articolo al blog

In `src/content/blog/` crea un file `.md`, es. `il-cinema-a-firenze.md`:

```yaml
titolo: "Titolo dell'articolo"
descrizione: "Riassunto per Google e social."
autore: "Redazione CineFood Italia"
dataPubblicazione: 2026-01-15
immagine: "../../assets/placeholder/blog-roma-cinema.jpg"   # opzionale
tags: ["Firenze", "cinema"]
bozza: false     # true = non ancora pubblicato
```

---

## 🏷️ Come rinominare il sito

Apri **`src/config/site.ts`** e cambia la riga `name: "CineFood Italia"`.
Il nuovo nome comparirà **ovunque**. Nello stesso file cambi anche slogan,
email, social e le voci del menu.

### 🎨 Cambiare colori e font

- **Colori:** apri `src/styles/global.css`, blocco `@theme`. Modifica i valori
  di `--color-gold-*` (accento), `--color-noir-*` (scuri) e `--color-cream-*`
  (chiari).
- **Font:** sempre in `@theme`, le variabili `--font-display` (titoli) e
  `--font-sans` (testo). I font sono ospitati localmente (nessuna richiesta
  esterna): per cambiarli, installa un pacchetto `@fontsource/...` e importalo
  in `src/layouts/BaseLayout.astro`.
- **Tema scuro/chiaro:** il sito parte in **scuro** e ha un interruttore
  ☀️/🌙 in alto a destra. Per partire in chiaro, cambia `class="dark"` in
  `class=""` sul tag `<html>` in `BaseLayout.astro`.

### 📷 Mettere foto reali (al posto dei placeholder)

Le immagini incluse sono **placeholder** grafici. Le foto e le locandine reali
dei film sono **protette da copyright**, quindi non vanno copiate dal web. Hai
due modi per avere immagini vere:

1. **Foto tue o con licenza** (consigliato per i locali): metti il file (jpg/png)
   in `src/assets/…` con lo **stesso nome** di quello attuale. Esempi:
   `src/assets/films/il-padrino.jpg`, `src/assets/cities/roma.jpg`,
   `src/assets/placeholder/bar-vitelli.jpg`.
2. **Foto libere automatiche**: esegui, sul tuo computer,
   `node scripts/scarica-foto.mjs`. Scarica fotografie **gratuite e legali**
   (licenza Unsplash, uso commerciale senza attribuzione) e le applica a film e
   città. Sono immagini d'atmosfera, non le scene dei film: per una foto
   specifica usa il metodo 1.

---

## 🚀 Pubblicare il sito online gratis

### Netlify (consigliata, ha anche i form)

1. Crea un account gratuito su <https://www.netlify.com>.
2. Carica il progetto su GitHub (o trascina la cartella su Netlify).
3. Impostazioni: **Build command** `npm run build`, **Publish directory** `dist`.
4. **Deploy**: il sito è online in un minuto.

> 📨 I form "Aggiungi il tuo locale" e la newsletter funzionano
> automaticamente su Netlify (sezione **Forms** della dashboard).

### Vercel

1. Account gratuito su <https://vercel.com>, collega il progetto da GitHub.
2. Vercel riconosce Astro da solo (Build `npm run build`, Output `dist`).
3. **Deploy**. Per i form usa un servizio come [Formspree](https://formspree.io)
   cambiando l'`action` in `src/pages/aggiungi-locale.astro`.

### ⚠️ Prima di pubblicare

In `src/config/site.ts` cambia `url:` con l'indirizzo vero del sito
(serve per sitemap e anteprime social).

---

## 📁 Struttura delle cartelle

```
cinefood-italia/
├── src/
│   ├── config/site.ts        ← NOME, colori-brand, menu (modifica qui!)
│   ├── content/
│   │   ├── restaurants/       ← UN FILE PER LOCALE (+ _template.md)
│   │   ├── films/             ← UN FILE PER FILM/SERIE (+ _template.md)
│   │   └── blog/              ← gli articoli
│   ├── content.config.ts      ← definisce i campi (schema) dei contenuti
│   ├── assets/
│   │   ├── placeholder/        ← foto dei locali + hero
│   │   ├── films/              ← locandine dei film
│   │   └── cities/             ← foto di copertina delle città
│   ├── components/             ← pezzi riutilizzabili (card, mappa, hero…)
│   ├── layouts/BaseLayout.astro
│   ├── pages/                  ← le pagine e gli indirizzi del sito
│   │   ├── index.astro         → /            (homepage)
│   │   ├── [citta].astro       → /roma, /milano … (pagine città)
│   │   ├── film/[slug].astro   → /film/…      (pagine film con FAQ)
│   │   ├── locale/[slug].astro → /locale/…    (dettaglio locale)
│   │   ├── locali/index.astro  → /locali      (elenco + filtri)
│   │   ├── tipo/[tipo].astro   → /tipo/…       (per tipo di locale)
│   │   ├── mappa · blog · chi-siamo · aggiungi-locale · inserzioni
│   │   └── robots.txt.ts
│   ├── lib/                    ← funzioni di supporto (non serve toccarle)
│   └── styles/global.css       ← colori e font del sito
├── public/                     ← favicon, robots, immagine social
├── scripts/                    ← genera le immagini placeholder (cancellabile)
└── astro.config.mjs
```

**Le cartelle che userai più spesso:** `src/content/restaurants/`,
`src/content/films/` e `src/config/site.ts`.

---

## ❓ Domande frequenti

**Ho aggiunto un locale ma non lo vedo.** Controlla che il file sia in
`src/content/restaurants/`, che finisca con `.md` e che **non** inizi con `_`
(i file con `_` sono ignorati, come il modello).

**Errore "film non trovato" quando aggiungo un locale.** Il valore del campo
`film` deve corrispondere al nome di un file esistente in `src/content/films/`
(senza `.md`). Crea prima la scheda del film.

**Posso aggiungere un tipo (es. "gelateria")?** Sì: apri `src/content.config.ts`
e aggiungi la parola all'elenco `TIPI_LOCALE`.

**È tutto gratis?** Sì. Sito, font, mappa (OpenStreetMap) e hosting
Netlify/Vercel hanno piani gratuiti sufficienti per iniziare.

---

## 🛠️ Comandi (riepilogo)

| Comando           | Cosa fa                                          |
| ----------------- | ------------------------------------------------ |
| `npm install`     | Installa i componenti (prima volta)              |
| `npm run dev`     | Avvia il sito in locale                          |
| `npm run build`   | Crea la versione pronta per la pubblicazione     |
| `npm run preview` | Anteprima della versione pubblicata              |

---

Realizzato con [Astro](https://astro.build), Tailwind CSS, Leaflet e i font
Playfair Display + Inter. Buon lavoro e… buona visione! 🍿
