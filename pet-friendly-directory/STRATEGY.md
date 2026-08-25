# Oltre la Taglia — Directory-Blog per Alloggi Pet-Friendly Senza Restrizioni

> **Nicchia**: hotel, B&B e agriturismi italiani che accettano cani di taglia
> grande/gigante e/o più di un cane, senza le limitazioni tipiche del
> "pet-friendly generico" (1 cane, max 10kg).
> **Nome**: **Oltre la Taglia** (dominio `oltrelataglia.it`) — payoff:
> *"Il tuo cane, senza taglia, senza limiti."*
> Nomi alternativi valutati: CaniGrandi.it (troppo simile a un exact-match
> domain, poco protetto/proteggibile), DogSizeFree, SenzaTaglia. "Cani
> grandi"/"taglia grande" restano comunque le keyword a maggior volume
> **nei title tag, nelle meta description e nei contenuti**, anche se il
> brand non le contiene letteralmente — è la keyword strategy a portare
> traffico, non il nome del dominio.
> 🖼️ **Mockup navigabile della home**: vedi link nel messaggio dell'assistente
> (artifact pubblicato) — palette, font (Bricolage Grotesque + Karla + IBM
> Plex Mono) e FAQ complete applicati.

Documento di riferimento per Design (UI/UX), Copy strategico e SEO on-page
della home page e dell'architettura del sito. Pensato per essere passato
direttamente a uno sviluppatore front-end (stack consigliato: Next.js 15 +
Tailwind CSS v4, coerente con gli altri progetti del repository).

---

## 0. Posizionamento e razionale

Il mercato "pet-friendly" in Italia è enorme ma **generico e inaffidabile**:
la maggior parte delle OTA (Booking, Airbnb) etichetta come "pet friendly"
strutture che in realtà impongono un tetto di peso (spesso 10 kg) o un solo
animale, scoperto solo al check-in. Chi possiede un Alano, un Pastore
Maremmano, due Labrador o un branco di cani da soccorso deve scrivere email
una per una per verificare le regole reali.

**La promessa del brand**: ogni struttura in vetrina è stata *verificata
manualmente* sui 4 punti che contano davvero — taglia massima ammessa,
numero massimo di animali, spazi comuni accessibili, eventuali supplementi —
zero sorprese al check-in.

Questo è anche il differenziale SEO: intercettiamo query transazionali che
i grandi portali non filtrano ("hotel cani taglia grande", "b&b 2 cani
ammessi"), a bassa concorrenza e altissima intenzione.

---

## 1. IDENTITÀ VISIVA E LINEE GUIDA DI DESIGN (UI/UX)

### 1.1 Palette colori

| Ruolo | Colore | Hex | Uso |
|---|---|---|---|
| Primario testo-safe | Azzurro cielo | `#0077B6` | Link, icone piccole, testo su sfondo bianco |
| Primario intenso | Azzurro vivido | `#0091E6` | Sfondi ampi, hero, badge, mark del logo, illustrazioni |
| Primario scuro (hover/testo su bianco) | Blu petrolio | `#03045E` | Titoli H1/H2, footer, CTA banner |
| Primario chiaro | Azzurro polvere saturo | `#A6DFFB` | Sfondi sezione alternati, chip filtri |
| Accento CTA | Corallo/Arancio | `#FF6B4A` | Bottoni primari, prezzi, badge urgenza |
| Accento secondario | Giallo senape tenue | `#FFB627` | Stelle recensioni, evidenziazioni |
| Neutro sfondo | Bianco / Grigio ghiaccio | `#FFFFFF` / `#F7FAFC` | Sfondo pagina |
| Neutro testo | Grigio ardesia | `#334155` | Body copy |
| Feedback positivo | Verde salvia | `#2A9D8F` | "Nessuna restrizione", check verificati |
| Bordi/Divider | Grigio perla | `#E2E8F0` | Card, separatori |

Contrasto verificato AA su testo `#03045E` e `#334155` su bianco.

> ⚠️ **Fix contrasto (bug corretto nel mockup)**: il corallo puro `#FF6B4A`
> su bianco ha un contrasto di ~2.8:1 — insufficiente anche per bottoni
> (serve ≥3:1 su testo bold ≥14px, ≥4.5:1 su testo normale). Nel mockup si
> usano due varianti distinte: **`#E8542F`** come sfondo dei bottoni CTA
> (testo bianco bold, contrasto ~4:1) e **`#D9481F`** per il corallo usato
> come testo diretto (prezzi, icone). Lo stesso vale per il giallo senape:
> `#FFB627` è riservato a riempimenti decorativi, mentre per le stelle di
> valutazione (testo) si usa la variante più scura `#9A6A0E`. Regola
> generale da portare in produzione: ogni colore ad alto impatto ha una
> **variante "fill" (decorativa)** e una **variante "text-safe" (più scura)**
> — non riusare mai il valore decorativo come colore di testo.

### 1.2 Tipografia

- **Titoli**: *Fredoka* (500–700) — sans-serif "bubble", tratto arrotondato,
  personalità giocosa e accogliente, coerente con un brand che parla di
  cani e vacanze senza pensieri. Fallback: `system-ui, sans-serif`.
- **Corpo testo**: *Nunito* — umanista arrotondata, altissima leggibilità
  mobile, si abbina naturalmente al tratto bubble dei titoli senza
  scontrarsi con esso. Fallback: `system-ui, sans-serif`.
- **Dati/etichette (taglia, n° cani, prezzo)**: *IBM Plex Mono* — lasciata
  volutamente "tecnica" e non arrotondata: il contrasto con il resto della
  UI rinforza il concetto di "specifica verificata" (come un'etichetta da
  scheda tecnica), usata per pillole informative, eyebrow ed etichette dei
  filtri.
- Scala tipografica mobile-first: H1 28–32px, H2 22–24px, body 16px, small 14px.
- Line-height generoso (1.5–1.6) per leggibilità in mobilità (turisti che
  cercano da smartphone in auto/in stazione).
- Tutti e tre i font sono disponibili su Google Fonts, caricabili con un
  singolo `<link>`/`@import` per performance.

### 1.3 Iconografia e immagini

- Iconografia a **linea arrotondata (rounded stroke)**, coerente con il tono
  "accogliente": zampa, valigia, casa, recinto, ciotola, guinzaglio.
- Fotografia: cani di **taglia grande/gigante reali** (mai stock con Chihuahua
  in borsetta — è l'errore numero uno che allontana il target). Foto
  luminose, ambienti open air, aree verdi, spiagge.
- Badge distintivo ricorrente: "✅ Verificato Oltre la Taglia — nessun limite di
  taglia" da usare su card, hero, meta immagini social.

### 1.4 Principi UX

1. **Mobile-first assoluto**: 70%+ del traffico stimato da mobile (ricerche
   last-minute in viaggio). Barra di ricerca sticky su scroll mobile.
2. **Zero attrito nel primo filtro**: nessun form lungo above the fold, solo
   3 campi (Dove / Quando / Filtro rapido taglia-numero cani) + bottone CTA.
3. **Trasparenza immediata**: ogni card struttura mostra da subito le 4 info
   chiave (taglia max, n° cani max, supplemento, giardino) come "pillole"
   colorate, senza dover aprire la scheda.
4. **Fiducia visiva**: badge "Verificato", numero di recensioni reali,
   iconografia di garanzia visibili fin dalla hero.
5. **Accessibilità**: contrasto AA, focus state visibili, tap target ≥44px,
   alt text descrittivi per ogni foto (rilevante anche per SEO immagini).

---

## 2. STRUTTURA DELLA HOME PAGE

### 2.1 Header (sticky)

Logo "Oltre la Taglia 🐾" — menu: `Cerca alloggi` · `Blog & Guide` · `Per le
strutture` · `Chi siamo` — CTA secondaria a destra: **"Inserisci la tua
struttura"** (bottone outline azzurro).

### 2.2 Hero Section (above the fold)

**H1 (headline orientata al beneficio):**
> ## Vacanze senza limiti di taglia. Trova l'alloggio perfetto per il tuo cane grande.

**Sottotitolo:**
> Oltre [N] hotel, B&B e agriturismi in tutta Italia verificati uno per uno:
> nessun limite di peso, nessun "massimo un cane". Solo strutture che
> accolgono davvero la tua famiglia a quattro zampe — comprese le taglie
> giganti e i branchi numerosi.

**Barra di ricerca avanzata (componente centrale, card bianca con ombra su
sfondo azzurro/foto hero):**

```
[ 📍 Dove vuoi andare? (es. Toscana, Costa Amalfitana...) ]
[ 📅 Check-in ]  [ 📅 Check-out ]
[ 🐕 Quanti cani? ▾ ]  [ 📏 Taglia ▾ (Grande 25-45kg / Gigante 45kg+) ]
              [ CERCA ALLOGGI → ]  (bottone corallo #FF6B4A)
```

- Il bottone CTA è sempre il colore accento (corallo), mai l'azzurro
  primario, per massimizzare il contrasto e guidare l'occhio.
- Sotto la barra: micro-trust row — *"🐾 Zero sorprese al check-in · ✅
  Regole verificate telefonicamente · ⭐ Recensioni da veri proprietari di
  cani grandi"*.

### 2.3 Filtri Rapidi in Evidenza (chip/icone cliccabili sotto la hero)

Riga orizzontale scrollabile su mobile, di pillole con icona:

- 🐻 **Cani oltre 40 kg benvenuti**
- 🐕‍🦺 **Più di 2 cani ammessi**
- 🌳 **Giardino/terreno recintato**
- 🍽️ **Cani ammessi in sala colazione/ristorante**
- 🏖️ **Vicino a spiagge pet-friendly**
- 🚫💰 **Nessun supplemento o cauzione**

Ogni chip porta a una pagina di ricerca pre-filtrata (utile anche per SEO —
vedi sezione 5, ogni filtro genera una landing page indicizzabile tipo
`/cerca/cani-oltre-40kg`).

### 2.4 Sezione Vetrina / Strutture in Evidenza

**Titolo sezione:** "Le strutture più amate dai cani grandi (e dai loro
umani)"
**Sottotitolo:** "Selezionate e verificate dal nostro team. Nessun limite,
solo accoglienza vera."

Griglia responsive (1 colonna mobile, 2 tablet, 3–4 desktop). Ogni **card
struttura** contiene:

- Foto principale (16:9) con badge overlay "✅ Verificata" in alto a sinistra
  e cuore/preferiti in alto a destra.
- Nome struttura + località (con icona pin) + rating a stelle (giallo senape).
- 4 pillole informative rapide (icone + testo breve):
  `🐕 Fino a 2 cani` · `📏 Nessun limite di taglia` · `🌳 Giardino recintato`
  · `🆓 Nessun supplemento`
- Prezzo indicativo "da €XX/notte" in corallo, in basso a destra.
- CTA "Vedi disponibilità" (bottone pieno corallo, full width su mobile).

CTA sezione: **"Esplora tutte le strutture verificate →"**

### 2.5 Sezione "Perché Affidarsi a Noi" (3 vantaggi)

Layout a 3 colonne (stack su mobile), icona grande + titolo + 2 righe di testo.

1. **🔍 Zero sorprese sulle regole**
   *Contattiamo ogni struttura prima di pubblicarla e verifichiamo taglia
   massima, numero di animali e costi extra. Quello che leggi qui è quello
   che troverai al check-in.*

2. **📏 Zero restrizioni di taglia**
   *Non pubblichiamo il "pet-friendly" generico che accetta solo cani sotto
   i 10 kg. Qui trovi solo strutture pensate per Alani, Maremmani, San
   Bernardo e branchi di più cani.*

3. **✅ Strutture testate, non solo elencate**
   *Ogni scheda include foto reali degli spazi esterni, recensioni di
   proprietari di cani grandi e, dove possibile, sopralluoghi diretti del
   nostro team.*

### 2.6 Sezione Blog / Guide Recenti

**Titolo:** "Guide e consigli per viaggiare con cani grandi"
**Sottotitolo:** "Itinerari, diritti, consigli pratici e recensioni per
chi non vuole lasciare a casa nessun membro della famiglia."

Griglia di 3–4 card articolo (immagine, categoria tag, titolo, estratto 1
riga, tempo di lettura). Esempi di titoli pronti (v. sezione 6 per il piano
editoriale completo):

- *"Le 10 spiagge libere in Italia dove i cani grandi possono correre liberi"*
- *"Agriturismi in Toscana per cani senza guinzaglio: la guida 2026"*
- *"Come viaggiare in traghetto con 2 cani di taglia gigante: documenti e regole"*
- *"Hotel vs B&B vs agriturismo pet-friendly: qual è il migliore per un cane grande?"*

CTA sezione: **"Leggi tutte le guide →"**

### 2.7 Sezione Community / Numeri (opzionale ma consigliata)

Striscia con contatori: "**[N]+ strutture verificate** · **[N]+ regioni
coperte** · **[N]+ recensioni da proprietari reali**" — rafforza fiducia
prima della FAQ.

### 2.8 Sezione FAQ

Vedi sezione 4 completa più sotto. Titolo sezione: **"Le domande più
frequenti di chi viaggia con cani grandi"**.

### 2.9 CTA finale / Sezione "Per le strutture"

Banner a tutta larghezza, sfondo blu petrolio `#03045E`, testo bianco:

> **Gestisci una struttura pet-friendly senza limiti?**
> Unisciti alla directory dedicata ai proprietari di cani grandi e raggiungi
> un pubblico che cerca esattamente quello che offri.
> [Inserisci la tua struttura gratis →] (bottone corallo)

### 2.10 Footer

Colonne: `Esplora` (Cerca alloggi, Blog, Destinazioni top) · `Per le
strutture` (Come funziona, Linee guida verifica, Login proprietari) ·
`Azienda` (Chi siamo, Contatti, Termini, Privacy) · Social + newsletter
("Ricevi ogni mese le nuove strutture verificate e le guide di viaggio").

---

## 3. OTTIMIZZAZIONE SEO ON-PAGE — HOME PAGE

### 3.1 Title tag (≤60 caratteri)

> `Hotel e B&B per Cani Grandi Senza Limiti | Oltre la Taglia`
(56 caratteri — include keyword transazionale "hotel per cani grandi" + brand)

Varianti A/B testabili:
- `Alloggi Pet Friendly per Cani Grandi, Senza Taglia` (52 car.)
- `Hotel Pet Friendly Senza Limiti di Taglia | Oltre la Taglia` (58 car.)

### 3.2 Meta description (≤155 caratteri)

> `Trova hotel, B&B e agriturismi che accettano cani grandi, giganti o più di uno. Nessun limite di taglia, regole verificate. Cerca ora la tua vacanza.`
(154 caratteri)

### 3.3 URL

`https://www.oltrelataglia.it/` (dominio) — struttura URL consigliata per le
sezioni interne, tutte in italiano e keyword-friendly:

- `/cerca` — motore di ricerca/listing principale
- `/cerca/cani-oltre-40kg`, `/cerca/piu-di-2-cani`, `/cerca/giardino-recintato`
  → landing di filtro pre-costruite (alto potenziale SEO long-tail)
- `/regione/toscana`, `/regione/puglia`, ... → hub geografici
- `/struttura/[slug]` — scheda singola struttura
- `/blog/[slug]` — articoli
- `/blog/categoria/spiagge-per-cani`, `/blog/categoria/normativa-viaggi`

### 3.4 Keyword primarie target (Home)

Transazionali/commerciali ad alto intento (volume IT stimato medio-basso ma
altissima conversione, bassa competizione):

- hotel pet friendly cani grandi
- b&b che accettano cani senza limiti
- agriturismo cani taglia grande
- alloggi per cani giganti
- hotel 2 cani ammessi
- vacanze con cane senza restrizioni di taglia
- pet friendly no limiti di peso

### 3.5 Dati strutturati (Schema Markup)

Combinazione consigliata per la home:

1. **`WebSite`** con `SearchAction` (per abilitare la sitelinks search box
   di Google):
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Oltre la Taglia",
  "url": "https://www.oltrelataglia.it/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.oltrelataglia.it/cerca?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

2. **`ItemList`** per la sezione "Strutture in evidenza" (elenco di
   `LodgingBusiness`/`Hotel`), utile perché Google comprenda che la home è
   una directory/hub e non una singola scheda struttura:
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "url": "https://www.oltrelataglia.it/struttura/nome-struttura"
    }
  ]
}
```

3. Sulle **schede struttura** (non home, ma da prevedere subito
   nell'architettura dati): `LodgingBusiness` (specializzazione di
   `LocalBusiness`) con proprietà custom in `additionalProperty` per
   "taglia massima ammessa" e "numero massimo animali", più `AggregateRating`
   se ci sono recensioni reali.

4. **`FAQPage`** per la sezione FAQ della home (vedi sezione 4) — fondamentale
   per intercettare i featured snippet e la "People Also Ask".

5. **`BreadcrumbList`** su tutte le pagine interne (cerca → regione →
   struttura) per una migliore comprensione della gerarchia da parte di
   Google.

> Nota tecnica: **non** usare `LocalBusiness` sulla home stessa (la home non
> è la sede fisica di un'attività, ma un aggregatore) — è un errore comune
> che confonde Google. La home usa `WebSite` + `ItemList` + `FAQPage`; è la
> singola scheda struttura a usare `LodgingBusiness`.

### 3.6 Alt text immagini (esempio)

`alt="Golden Retriever di taglia grande in giardino recintato di un agriturismo pet-friendly in Toscana"` — descrittivo, include keyword naturalmente, mai keyword-stuffing.

---

## 4. SEZIONE FAQ APPROFONDITA (Home Page)

Testi pronti all'uso, ottimizzati per ricerca vocale (domande colloquiali,
risposte dirette nelle prime 1–2 frasi, dettaglio a seguire) e per People
Also Ask. Da marcare con `FAQPage` schema.

**1. Le strutture su Oltre la Taglia accettano davvero cani di qualsiasi taglia?**
Sì. A differenza dei portali generalisti, su Oltre la Taglia pubblichiamo solo
strutture che abbiamo verificato accettare cani di taglia grande (25–45 kg)
e gigante (oltre 45 kg), come Alani, Pastori del Caucaso, San Bernardo o
Mastini. Per ogni struttura indichiamo chiaramente la taglia massima
ammessa, così non ci sono sorprese al check-in.

**2. Posso portare più di un cane nella stessa struttura?**
Molte strutture della nostra directory accettano 2, 3 o più cani nella
stessa camera o appartamento, spesso senza supplemento aggiuntivo per ogni
animale extra. Usa il filtro "Più di 2 cani ammessi" nella home per vedere
subito solo queste opzioni: il numero massimo di animali è sempre indicato
nella scheda struttura.

**3. Ci sono supplementi nascosti da pagare al check-in?**
No, se prenoti tramite una struttura verificata Oltre la Taglia il costo per il
soggiorno con animali è sempre indicato in modo trasparente nella scheda,
prima della prenotazione. Alcune strutture applicano un piccolo supplemento
di pulizia forfettario (non "per cane"), altre non applicano alcun
supplemento: la voce "Costi extra animali" nella scheda riporta sempre
l'importo esatto o l'indicazione "nessun supplemento".

**4. Come viene richiesta la cauzione per gli animali?**
Non tutte le strutture la richiedono. Quando prevista, la cauzione è
generalmente una cifra fissa (indicativamente 20–50€) restituita al
check-out se non ci sono danni, e viene sempre dichiarata in anticipo nella
scheda della struttura, mai comunicata a sorpresa in loco. Ti consigliamo
comunque di richiedere conferma scritta (email o messaggio) prima di
partire, così hai una prova in caso di controversie.

**5. I cani possono accedere alla sala colazione o al ristorante interno?**
Dipende dalla struttura: alcune ammettono i cani anche negli spazi comuni
interni (sala colazione, area bar), altre solo negli spazi esterni o in
camera. Per questo ogni scheda include la pillola informativa "Accesso aree
comuni" con il dettaglio preciso — puoi anche filtrare direttamente per
"Cani ammessi in sala colazione/ristorante" nella home.

**6. Le strutture hanno un giardino o uno spazio recintato dove far correre il cane libero?**
Molte sì. Segnaliamo sempre nella scheda se la struttura dispone di un
giardino, terreno o area sgambamento recintata dove il cane può stare libero
senza guinzaglio in sicurezza. Usa il filtro "Giardino/terreno recintato"
per vedere solo queste strutture, ideali soprattutto per cani di taglia
grande abituati a muoversi molto.

**7. Come faccio a sapere se una struttura è vicina a spiagge o sentieri dog-friendly?**
Nella scheda di ogni struttura situata in zone costiere o montane indichiamo
le spiagge libere per cani, le aree sgambamento e i sentieri pet-friendly
più vicini, con relativa distanza in auto o a piedi. Trovi inoltre guide
dedicate nel nostro blog con l'elenco aggiornato delle spiagge per cani
regione per regione.

**8. Come verificate davvero le regole delle strutture prima di pubblicarle?**
Ogni struttura viene contattata direttamente dal nostro team (telefono o
email) per confermare quattro punti: taglia massima ammessa, numero massimo
di animali, eventuali supplementi/cauzioni e accesso agli spazi comuni.
Solo dopo questa verifica la struttura entra nella directory con il badge
"Verificato Oltre la Taglia". Le informazioni vengono aggiornate periodicamente
e ogni utente può segnalarci discrepanze trovate sul posto.

**9. Cosa succede se al check-in la struttura applica regole diverse da quelle indicate sul sito?**
Ti invitiamo a contattarci subito tramite il modulo di segnalazione presente
in ogni scheda struttura: verifichiamo la discrepanza con la struttura e, se
confermata, aggiorniamo immediatamente la scheda o rimuoviamo il badge
"Verificato". La trasparenza delle informazioni è il cuore del nostro
servizio, quindi ogni segnalazione viene gestita con priorità.

**10. Il servizio di ricerca su Oltre la Taglia è gratuito?**
Sì, la ricerca, la consultazione delle schede e delle guide del blog sono
completamente gratuite per chi viaggia. Il nostro modello si basa sulla
collaborazione con le strutture ricettive, che possono richiedere
l'inserimento nella directory secondo le nostre linee guida di verifica.

**11. Posso lasciare una recensione dopo il soggiorno?**
Sì, dopo il soggiorno puoi lasciare una recensione dedicata specificamente
all'esperienza con il tuo cane (comportamento del personale, rispetto delle
regole dichiarate, qualità degli spazi esterni), utile per aiutare altri
proprietari di cani grandi a scegliere con fiducia.

---

## 5. STRUTTURA / ARCHITETTURA DEL SITO (oltre la Home)

```
/                          Home
/cerca                     Motore di ricerca con filtri avanzati (mappa + lista)
/cerca/[filtro-slug]        Landing SEO per singolo filtro (taglia, n. cani, ecc.)
/regione/[slug]              Hub geografico regione (es. /regione/toscana)
/regione/[slug]/[citta]     Hub geografico città
/struttura/[slug]            Scheda struttura (LodgingBusiness schema)
/blog                       Indice blog
/blog/categoria/[slug]        Categorie: Destinazioni · Normativa & Viaggi ·
                             Guide per Taglia · Consigli Pratici
/blog/[slug]                Articolo singolo
/per-le-strutture           Landing B2B per acquisizione strutture
/per-le-strutture/come-funziona
/chi-siamo
/faq                        FAQ estesa (oltre quelle in home)
/contatti
/privacy  /termini  /cookie
```

### Piano editoriale blog — primi 12 articoli consigliati (pilastri SEO)

1. Hotel pet-friendly senza limiti di taglia: la guida definitiva 2026
2. Le migliori spiagge libere per cani grandi in Italia (regione per regione)
3. Agriturismi in Toscana per cani senza restrizioni: la mappa completa
4. Viaggiare in traghetto con più cani di taglia grande: documenti e regole
5. Cosa dice la legge italiana su cani in hotel e ristoranti (guida pratica)
6. Come scegliere un B&B pet-friendly se hai un cane oltre i 40 kg
7. 10 agriturismi in Puglia con giardino recintato per cani grandi
8. Weekend in montagna con il cane: rifugi e baite senza limiti di taglia
9. Hotel vs B&B vs agriturismo: quale scegliere con un cane gigante
10. Documenti e vaccinazioni per viaggiare con il cane in Italia: checklist
11. Le 5 domande da fare sempre prima di prenotare (e perché contano)
12. Come si comporta un cane di taglia grande in un B&B: consigli pratici

---

## 6. RIEPILOGO ASSET PRONTI PER LO SVILUPPO

- ✅ Palette colori + token esadecimali
- ✅ Font pairing consigliato
- ✅ Wireframe testuale sezione-per-sezione della home
- ✅ Copy pronto all'uso per hero, filtri, vantaggi, CTA, footer
- ✅ Title tag + meta description ottimizzati e testabili in A/B
- ✅ Struttura URL SEO-friendly per l'intero sito
- ✅ Schema Markup consigliato (WebSite+SearchAction, ItemList, FAQPage,
  LodgingBusiness, BreadcrumbList) con JSON-LD di esempio
- ✅ 11 FAQ complete con risposte pronte, ottimizzate voice search
- ✅ Piano editoriale blog (12 articoli pilastro)

Prossimo passo naturale: wireframe visivo (Figma o canvas design) e
implementazione front-end (Next.js + Tailwind, coerente con lo stack già
in uso nel repository).
