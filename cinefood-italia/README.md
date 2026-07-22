# 🎬 CineFood Italia

Sito web tipo **directory** dedicato ai ristoranti, bar e caffè italiani
apparsi in **film e serie TV**. È un sito **statico** (velocissimo e ottimo
per Google), senza database: ogni locale è un semplice file di testo, quindi
puoi aggiornarlo **senza saper programmare**.

> Il nome "CineFood Italia" è provvisorio: puoi cambiarlo in un secondo
> (vedi la sezione [Come rinominare il sito](#-come-rinominare-il-sito)).

---

## 📑 Indice

1. [Cosa serve per iniziare](#-cosa-serve-per-iniziare)
2. [Avviare il sito sul tuo computer](#-avviare-il-sito-sul-tuo-computer)
3. [Come aggiungere un nuovo ristorante (passo passo)](#-come-aggiungere-un-nuovo-ristorante-passo-passo)
4. [Come aggiungere un articolo al blog](#-come-aggiungere-un-articolo-al-blog)
5. [Come rinominare il sito](#-come-rinominare-il-sito)
6. [Pubblicare il sito online gratis](#-pubblicare-il-sito-online-gratis)
7. [Struttura delle cartelle](#-struttura-delle-cartelle)
8. [Domande frequenti](#-domande-frequenti)

---

## 🧰 Cosa serve per iniziare

Devi installare **una sola cosa** sul tuo computer: **Node.js**.

1. Vai su <https://nodejs.org>
2. Scarica la versione **LTS** (il pulsante grande a sinistra).
3. Installa come un normale programma (Avanti → Avanti → Fine).

Fatto! Non serve altro.

---

## 💻 Avviare il sito sul tuo computer

Apri il **Terminale** (su Mac: "Terminale"; su Windows: "Prompt dei comandi"
o "PowerShell"), poi scrivi questi comandi **uno alla volta**, premendo Invio
dopo ognuno:

```bash
# 1. Entra nella cartella del sito
cd cinefood-italia

# 2. Installa i componenti (solo la PRIMA volta, ci mette un minuto)
npm install

# 3. Avvia il sito
npm run dev
```

Ora apri il browser all'indirizzo che compare (di solito
**http://localhost:4321**). Vedrai il sito in tempo reale: ogni volta che
salvi una modifica, la pagina si aggiorna da sola. ✨

Per **fermare** il sito, torna nel Terminale e premi `Ctrl + C`.

---

## 🍝 Come aggiungere un nuovo ristorante (passo passo)

Aggiungere un locale significa semplicemente **creare un nuovo file**. Ecco
come:

### Passo 1 — Copia il modello

Vai nella cartella `src/content/restaurants/`. Qui trovi un file chiamato
**`_template.md`**: è il modello già pronto. **Fanne una copia** nella stessa
cartella.

### Passo 2 — Rinomina la copia

Dai alla copia il nome del locale, tutto in **minuscolo**, con i **trattini**
al posto degli spazi e **senza accenti**. Il nome del file diventerà
l'indirizzo web della pagina.

| Nome del locale        | Nome del file                |
| ---------------------- | ---------------------------- |
| Trattoria da Mario     | `trattoria-da-mario.md`      |
| Caffè del Corso        | `caffe-del-corso.md`         |
| Bar Centrale (Roma)    | `bar-centrale-roma.md`       |

### Passo 3 — Compila i dati

Apri il file con un editor di testo (va benissimo il **Blocco note** o
**TextEdit**) e compila i campi tra virgolette. Ecco il modello completo con
le spiegazioni:

```yaml
---
nome: "Nome del Locale"
citta: "Città"
regione: "Regione"                 # es. "Lazio", "Sicilia"
indirizzo: "Via Esempio 1, 00100 Città PR"
coordinate:
  lat: 41.9028                      # latitudine (vedi sotto come trovarla)
  lng: 12.4964                      # longitudine
tipo: "ristorante"                  # ristorante | trattoria | bar | caffè | pasticceria
prezzo: "€€"                        # € | €€ | €€€ | €€€€
stato: "aperto"                     # aperto | chiuso | temporaneamente-chiuso
inEvidenza: false                   # true = mostra il locale in evidenza in home
immagine: "../../assets/placeholder/og-default.jpg"
immagineAlt: "Descrizione dell'immagine"
sitoWeb: "https://www.esempio.it"          # opzionale
prenotazione: "https://www.esempio.it/prenota"  # opzionale
ultimoAggiornamento: 2026-01-01
film:
  - titolo: "Titolo del Film"
    anno: 2020
    regista: "Nome del Regista"
    serieTv: false                  # true se è una serie TV
    descrizioneScena: "Cosa succede nella scena girata nel locale."
descrizione: "Descrizione breve e invitante del locale."
---

Qui puoi scrivere un testo più lungo (facoltativo) che comparirà nella pagina.
```

> 💡 **Come trovare le coordinate (lat/lng):** apri **Google Maps**, fai clic
> con il **tasto destro** sul locale e scegli **"Che cosa c'è qui?"**. In
> basso compaiono due numeri: il **primo** è `lat`, il **secondo** è `lng`.
> Copiali nel file.

> 💡 **Più film nello stesso locale:** copia il blocco che inizia con
> `- titolo:` e incollalo sotto, con i dati del secondo film.

### Passo 4 — Aggiungi la foto

Metti la foto del locale (formato `.jpg` o `.png`) nella cartella
`src/assets/placeholder/` e scrivi il suo percorso nel campo `immagine`,
ad esempio: `immagine: "../../assets/placeholder/trattoria-da-mario.jpg"`.

### Passo 5 — Salva e controlla

Salva il file. Se il sito è avviato (`npm run dev`), il nuovo locale
comparirà **automaticamente**! Lo trovi nell'elenco `/locali`, sulla mappa e
nelle pagine per città e per film.

> ✅ **Se hai sbagliato un campo**, il sito te lo dice con un messaggio chiaro
> (es. "manca il campo città"): correggi e salva di nuovo.

---

## ✍️ Come aggiungere un articolo al blog

Uguale ai ristoranti, ma nella cartella `src/content/blog/`. Crea un file
`.md`, ad esempio `il-cinema-a-firenze.md`, con questa intestazione:

```yaml
---
titolo: "Titolo dell'articolo"
descrizione: "Riassunto breve per Google e i social."
autore: "Redazione CineFood Italia"
dataPubblicazione: 2026-01-15
immagine: "../../assets/placeholder/blog-roma-cinema.jpg"  # opzionale
immagineAlt: "Descrizione dell'immagine"
tags: ["Firenze", "cinema"]
bozza: false        # metti true se NON vuoi ancora pubblicarlo
---

Qui scrivi l'articolo. Puoi usare titoli con ## e grassetto con **testo**.
```

---

## 🏷️ Come rinominare il sito

Apri il file **`src/config/site.ts`** e cambia la riga:

```ts
name: "CineFood Italia",
```

Metti il nome che preferisci: comparirà **ovunque** (menu, footer, titoli,
SEO). Nello stesso file puoi cambiare anche lo slogan, l'email e i social.

---

## 🚀 Pubblicare il sito online gratis

Puoi mettere il sito online **gratuitamente** con Netlify o Vercel. Entrambi
partono da un account gratuito e ripubblicano il sito da soli ogni volta che
aggiorni i contenuti (se usi GitHub).

### Opzione A — Netlify (consigliata, ha anche i form)

1. Crea un account gratuito su <https://www.netlify.com>.
2. Carica il progetto su **GitHub** (o trascina la cartella su Netlify).
3. Quando Netlify chiede le impostazioni, usa:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Clicca **Deploy**. In un minuto il sito è online con un indirizzo tipo
   `nome-a-caso.netlify.app` (puoi poi collegare un tuo dominio).

> 📨 **Il form "Aggiungi il tuo locale"** funziona automaticamente su Netlify:
> le richieste arrivano nella sezione **Forms** della tua dashboard. Non devi
> fare nulla.

### Opzione B — Vercel

1. Crea un account gratuito su <https://vercel.com>.
2. Collega il progetto da GitHub.
3. Vercel riconosce Astro da solo:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Clicca **Deploy**.

> Su Vercel il form di contatto non è incluso: puoi usare un servizio gratuito
> come [Formspree](https://formspree.io). Basta cambiare l'attributo `action`
> del form nel file `src/pages/aggiungi-locale.astro`.

### ⚠️ Prima di pubblicare

Apri `src/config/site.ts` e cambia l'indirizzo `url:` con quello vero del tuo
sito (es. `https://ilmiosito.netlify.app`). Serve per la sitemap e per le
anteprime social corrette.

---

## 📁 Struttura delle cartelle

```
cinefood-italia/
├── src/
│   ├── config/
│   │   └── site.ts          ← NOME e impostazioni del sito (modifica qui!)
│   ├── content/
│   │   ├── restaurants/      ← UN FILE PER OGNI LOCALE (aggiungi qui i ristoranti)
│   │   │   └── _template.md  ← modello da copiare
│   │   └── blog/             ← gli articoli del blog
│   ├── assets/
│   │   └── placeholder/      ← le immagini (metti qui le foto dei locali)
│   ├── components/           ← pezzi riutilizzabili (schede, mappa, filtri…)
│   ├── layouts/              ← struttura comune delle pagine
│   ├── pages/                ← le pagine del sito
│   ├── lib/                  ← funzioni di supporto (non serve toccarle)
│   ├── styles/               ← colori e stile del sito
│   └── content.config.ts     ← definisce i campi di ogni locale (schema)
├── public/                   ← file pubblici (favicon, robots.txt, immagine social)
├── scripts/                  ← script per generare le immagini placeholder
├── astro.config.mjs          ← configurazione tecnica (raramente da toccare)
└── package.json              ← elenco dei componenti del progetto
```

**Le cartelle che userai più spesso** sono solo due:
`src/content/restaurants/` (per i locali) e `src/config/site.ts`
(per il nome e le impostazioni).

---

## ❓ Domande frequenti

**Devo salvare online ogni modifica?**
Se hai pubblicato con GitHub + Netlify/Vercel, ti basta caricare i file
aggiornati su GitHub (comando `git add . && git commit -m "nuovo locale" &&
git push`) e il sito si aggiorna da solo. In alternativa puoi ricaricare la
cartella su Netlify.

**Ho aggiunto un locale ma non lo vedo.**
Controlla che il file sia nella cartella `src/content/restaurants/`, che
finisca con `.md` e che **non** inizi con un trattino basso `_` (quei file
vengono ignorati apposta, come il modello).

**Posso cambiare i tipi di locale (aggiungere "gelateria")?**
Sì: apri `src/content.config.ts` e aggiungi la parola all'elenco `TIPI_LOCALE`.

**È tutto gratis?**
Sì. Il sito, la mappa (OpenStreetMap) e gli hosting Netlify/Vercel hanno piani
gratuiti sufficienti per iniziare.

---

## 🛠️ Comandi tecnici (riepilogo)

| Comando           | Cosa fa                                             |
| ----------------- | --------------------------------------------------- |
| `npm install`     | Installa i componenti (solo la prima volta)         |
| `npm run dev`     | Avvia il sito in locale per lavorarci               |
| `npm run build`   | Crea la versione pronta per la pubblicazione (`dist/`) |
| `npm run preview` | Mostra un'anteprima della versione pubblicata       |

---

Realizzato con [Astro](https://astro.build), Tailwind CSS e Leaflet.
Buon lavoro e… buona visione! 🍿
