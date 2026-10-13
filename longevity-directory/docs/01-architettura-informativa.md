# Architettura informativa — Directory Longevità, Biohacking e Medicina Preventiva

> Documento operativo per l'implementazione su CMS (WordPress / Webflow) o sul
> nostro stack Next.js già usato per `glutenfree-directory`.
> Nome di lavoro nei tracciati: **[NOME SITO]** — sostituire in fase di setup.

---

## 0. Decisioni di base (da fissare prima di toccare il CMS)

| Tema | Decisione consigliata | Perché |
|---|---|---|
| Posizionamento | Directory **verticale premium** + editoriale scientifico. Non un portale medico generalista | Su query mediche generiche competono Humanitas, Auxologico, MioDottore: perdiamo. Sul verticale longevità il campo è quasi vuoto in Italia |
| Lingua | IT come default senza prefisso; `/en/` in fase 2 | Stesso schema di `glutenfree-directory` (health tourism in entrata = revenue futura) |
| Modello di ricavo | Listing freemium + abbonamenti (Verificato / Premium / Esclusiva) + lead generation + affiliazioni prodotti | Il traffico informativo da solo non paga; le schede sì |
| Entità indicizzabili | Scheda centro, categoria+città, articolo, guida città, prodotto | Sono le uniche pagine con domanda di ricerca reale |
| Standard editoriale | Revisione medica obbligatoria, gradazione delle evidenze, fonti citate | È un sito YMYL: senza E-E-A-T non si posiziona e non si vende |

---

## 1. Alberatura del menu principale

### 1.1 Header (menu primario)

| # | Voce | URL | Tipo | Scopo | Indicizzazione |
|---|---|---|---|---|---|
| 1 | Home | `/` | Statica | Hero + ricerca + categorie + centri in evidenza + ultimi articoli + FAQ | index |
| 2 | Directory ▾ | `/directory` | Archivio + mega menu | Hub di tutte le categorie e città | index |
| 3 | Blog ▾ | `/blog` | Archivio + mega menu | Hub editoriale per categoria | index |
| 4 | Guide | `/guide` | Archivio | Pillar page lunghe (contenuti pilastro) | index |
| 5 | Prodotti | `/prodotti` | Archivio | Integratori, wearable, dispositivi (recensiti, non venduti) | index |
| 6 | Chi siamo ▾ | `/chi-siamo` | Statica | Autorevolezza: team, comitato scientifico, metodo | index |
| 7 | Contatti | `/contatti` | Statica | Form + supporto | index |
| 8 | **Aggiungi la tua struttura** (bottone CTA) | `/per-i-centri` | Landing commerciale | Acquisizione centri (B2B) | index |
| 9 | Accedi / Area riservata | `/accedi` | Auth | Utenti e titolari scheda | noindex |

**Mega menu "Directory"** (3 colonne + box):
- Colonna 1 — *Per categoria*: le 8 macro-categorie (§3)
- Colonna 2 — *Per città*: Milano, Roma, Torino, Bologna, Firenze, Padova, Verona, Napoli, Bari, Palermo → `/directory/citta/[slug]`
- Colonna 3 — *Per esigenza*: "Voglio misurare la mia età biologica", "Voglio un check-up completo", "Voglio migliorare sonno ed energia", "Voglio prevenire malattie cardiovascolari" → landing di intento
- Box: "Sei un centro? Aggiungi la tua struttura →"

**Mega menu "Blog"**: le 8 categorie editoriali (§ doc 02) + "Ultimi articoli" + "Guide pilastro".

### 1.2 Pagine di servizio e istituzionali

```
/chi-siamo
├─ /chi-siamo/comitato-scientifico      ← revisori medici con foto, albo, CV (E-E-A-T)
├─ /chi-siamo/metodo-di-valutazione     ← come selezioniamo e verifichiamo i centri
├─ /chi-siamo/linea-editoriale          ← standard evidenze, correzioni, conflitti d'interesse
└─ /chi-siamo/autori/[slug]             ← archivio autore (bio + articoli)

/contatti
├─ /contatti/segnala-un-centro          ← UGC: suggerisci una struttura
├─ /contatti/segnala-un-errore          ← credibilità + segnale di qualità
└─ /contatti/collabora                  ← medici e divulgatori che vogliono scrivere

/per-i-centri                            ← landing B2B (vedi doc 03)
├─ /per-i-centri/piani-e-prezzi
├─ /per-i-centri/come-funziona
├─ /per-i-centri/registrazione           ← self-service onboarding (form + Stripe)
└─ /per-i-centri/rivendica-scheda        ← claim di una scheda già pubblicata

/faq
/newsletter                              ← squeeze page dedicata
/disclaimer-medico                       ← obbligatoria su sito YMYL
/privacy  /cookie  /termini
/sitemap.xml  /robots.txt
```

### 1.3 Footer (4 colonne)

1. **Directory**: 8 macro-categorie + "Tutte le città"
2. **Contenuti**: Blog, Guide, Prodotti, Newsletter, Podcast (fase 2)
3. **Progetto**: Chi siamo, Comitato scientifico, Metodo, Linea editoriale, Contatti, Lavora con noi
4. **Per i centri**: Aggiungi struttura, Piani e prezzi, Rivendica scheda, Media kit, Area riservata
+ riga legale: Disclaimer medico, Privacy, Cookie, Termini, P.IVA, © anno.

---

## 2. Struttura URL della directory (la parte SEO che decide il progetto)

```
/directory                                   Hub: tutte le categorie + città + ricerca
/directory/[categoria]                       es. /directory/medicina-funzionale
/directory/[categoria]/[citta]               es. /directory/crioterapia/milano      ← PAGINE MONEY
/directory/citta/[citta]                     es. /directory/citta/milano            ← hub città
/centri/[slug]                               es. /centri/clinica-x-milano           ← scheda singola
/professionisti/[slug]                       schede di singoli medici/professionisti
/prodotti/[slug]
```

**Perché la scheda sta su `/centri/[slug]` e non annidata sotto categoria+città:** un centro cambia
categoria, apre sedi, si sposta. Un URL piatto non si rompe mai e non genera redirect a catena.

### 2.1 Regole di indicizzazione delle faccette (fondamentale)

| Combinazione | URL | Indicizzazione |
|---|---|---|
| Categoria | `/directory/crioterapia` | index, in sitemap |
| Categoria + città | `/directory/crioterapia/milano` | index **solo se ≥ 3 schede pubblicate**, altrimenti `noindex,follow` |
| Città | `/directory/citta/milano` | index |
| 1 filtro extra applicato | `?prezzo=€€` | `noindex,follow` + canonical alla pagina base |
| 2+ filtri, ordinamenti, paginazione oltre pag. 1 | `?prezzo=€€&voto=4&sort=vicini` | `noindex,follow`, no canonical cross-pagina (paginazione: self-canonical + rel prev/next logico) |
| Ricerca interna | `/cerca?q=` | `noindex,nofollow`, escluso da sitemap |

**Anti-thin-content**: una pagina categoria+città si genera solo quando esistono almeno 3 schede.
Sotto quella soglia si mostra la pagina provincia/regione più vicina. È la regola che ha ucciso
metà delle directory concorrenti: 4.000 pagine vuote = declassamento su tutto il dominio.

### 2.2 Contenuto minimo di una pagina categoria+città (per non essere "solo una lista")

1. H1 `Crioterapia a Milano: centri, prezzi e come scegliere`
2. 250–400 parole di introduzione **originale** (che cos'è, a chi serve, prezzi medi locali, cosa verificare)
3. Elenco schede con filtri
4. Box "Come abbiamo selezionato questi centri" (link al metodo)
5. 3–5 FAQ locali con markup `FAQPage`
6. Link agli articoli di blog correlati (cluster → money page e ritorno)
7. Markup `ItemList` + `BreadcrumbList`

---

## 3. Tassonomia della Directory

Tassonomia **a due assi**: `categoria_servizio` (cosa fanno) e `tipo_struttura` (cosa sono).
Un centro può appartenere a più categorie di servizio ma a un solo tipo di struttura.

### 3.1 Tipo di struttura (tassonomia secondaria, usata come filtro)

`clinica-poliambulatorio` · `centro-diagnostico` · `studio-medico-privato` ·
`longevity-center-integrato` · `medical-spa-retreat` · `centro-performance-fitness` ·
`professionista-singolo` · `farmacia-specializzata` · `laboratorio-analisi`

### 3.2 Categorie e sottocategorie di servizio

#### A. Medicina della longevità e preventiva — `/directory/medicina-longevita`
- Check-up longevità / medicina preventiva personalizzata — `check-up-longevita`
- Valutazione del rischio cardiovascolare avanzata — `rischio-cardiovascolare`
- Prevenzione oncologica personalizzata — `prevenzione-oncologica`
- Salute cognitiva e prevenzione neurodegenerativa — `salute-cognitiva`
- Medicina di genere: menopausa e salute femminile — `menopausa-salute-femminile`
- Salute maschile e andrologia preventiva — `salute-maschile`
- Healthy aging over 60 e prevenzione della sarcopenia — `healthy-aging-over-60`

#### B. Diagnostica avanzata e biomarcatori — `/directory/diagnostica-avanzata`
- Test dell'età biologica (orologi epigenetici / metilazione del DNA) — `eta-biologica`
- Pannelli ematici avanzati (ApoB, Lp(a), hs-CRP, insulina, omocisteina) — `pannelli-ematici-avanzati`
- Test genetici e farmacogenetica — `test-genetici`
- Analisi del microbiota intestinale — `microbiota`
- Profilo ormonale completo — `profilo-ormonale`
- Composizione corporea (DEXA, BIA, densitometria ossea) — `composizione-corporea`
- Test cardiopolmonare e VO₂max — `vo2max-test-cardiopolmonare`
- Imaging preventivo (RM total body, calcium score coronarico, ecodoppler TSA) — `imaging-preventivo`
- Monitoraggio continuo del glucosio (CGM) — `cgm-glicemia`
- Polisonnografia e studio del sonno — `diagnostica-sonno`
- Tossicologia e metalli pesanti — `tossicologia`

#### C. Medicina funzionale e integrata — `/directory/medicina-funzionale`
- Medicina funzionale — `medicina-funzionale`
- PNEI (psico-neuro-endocrino-immunologia) — `pnei`
- Gastroenterologia funzionale e asse intestino-cervello — `gastro-funzionale`
- Endocrinologia e terapia ormonale sostitutiva (TRT / HRT) — `terapia-ormonale`
- Immunologia e infiammazione cronica di basso grado — `infiammazione-cronica`
- Medicina del dolore e reumatologia preventiva — `dolore-reumatologia`

#### D. Terapie e tecnologie (biohacking clinico) — `/directory/terapie-tecnologie`
- Crioterapia whole body e criosauna — `crioterapia`
- Ossigenoterapia iperbarica (HBOT) — `ossigenoterapia-iperbarica`
- Sauna a infrarossi e protocolli caldo/freddo — `sauna-infrarossi`
- Fotobiomodulazione / red light therapy — `fotobiomodulazione`
- Terapie infusionali e NAD⁺ (IV therapy) — `iv-therapy-nad`
- Ipossia intermittente (IHHT) e allenamento ipossico — `ipossia-intermittente`
- PEMF e campi elettromagnetici pulsati — `pemf`
- Elettrostimolazione (EMS) e vibrazione a corpo intero — `ems-vibrazione`
- Pressoterapia e drenaggio linfatico — `pressoterapia`
- Floating e deprivazione sensoriale — `floating`
- Neurofeedback e stimolazione cognitiva — `neurofeedback`

#### E. Nutrizione e metabolismo — `/directory/nutrizione-metabolismo`
- Nutrizione clinica per la longevità — `nutrizione-longevita`
- Digiuno terapeutico e dieta mima-digiuno (FMD) — `digiuno-fmd`
- Nutrigenetica e nutrizione di precisione — `nutrigenetica`
- Gestione del peso e salute metabolica — `salute-metabolica`
- Nutrizione sportiva e ricomposizione corporea — `nutrizione-sportiva`

#### F. Movimento, performance e riabilitazione — `/directory/movimento-performance`
- Allenamento della forza per la longevità — `forza-longevita`
- Zona 2 e allenamento cardiometabolico su misura — `zona-2-cardio`
- Fisioterapia e prevenzione degli infortuni — `fisioterapia-prevenzione`
- Rieducazione posturale e mobilità — `postura-mobilita`
- Valutazione funzionale e test di stabilità/equilibrio — `valutazione-funzionale`
- Riabilitazione cardiologica e respiratoria — `riabilitazione-cardio-respiratoria`

#### G. Sonno, mente e gestione dello stress — `/directory/sonno-mente-stress`
- Centri di medicina del sonno — `medicina-del-sonno`
- Terapia cognitivo-comportamentale per l'insonnia (CBT-I) — `cbt-insonnia`
- Psicoterapia e gestione dello stress — `psicoterapia-stress`
- Mindfulness, MBSR e respirazione — `mindfulness-respirazione`
- Coaching su HRV e recupero — `hrv-recupero`

#### H. Estetica rigenerativa e skin longevity — `/directory/estetica-rigenerativa`
- Skin longevity e dermatologia preventiva — `skin-longevity`
- Medicina rigenerativa (PRP, biostimolazione) — `medicina-rigenerativa`
- Laser e tecnologie dermatologiche — `laser-dermatologia`
- Tricologia e salute del capello — `tricologia`
- Salute orale e infiammazione sistemica — `salute-orale`

#### I. Retreat, spa medicali e programmi residenziali — `/directory/retreat-spa-medicali`
- Longevity retreat residenziali — `longevity-retreat`
- Terme e spa a indirizzo medico — `terme-spa-mediche`
- Programmi detox e reset metabolico supervisionati — `programmi-detox`
- Health & longevity travel (in entrata dall'estero) — `longevity-travel`

#### J. Professionisti — `/professionisti` (post type separato)
Filtro per specializzazione: medico internista · cardiologo · endocrinologo · nutrizionista ·
biologo nutrizionista · dietista · genetista · neurologo · geriatra · medico dello sport ·
fisioterapista · psicologo/psicoterapeuta · farmacista · personal trainer certificato ·
health coach. Campo obbligatorio: **numero di iscrizione all'albo**.

#### K. Prodotti — `/prodotti` (post type separato, non è una scheda-centro)
Integratori · wearable e tracker (anelli, cinture HR, CGM consumer) · dispositivi per la casa
(sauna, red light, criobagni) · test da fare a casa · libri e corsi.

### 3.3 Politica di ammissione (proteggere l'autorevolezza = proteggere il business)

**Non ammessi** in directory, senza eccezioni: terapie prive di plausibilità biologica o
proibite (ozonoterapia per uso non autorizzato, chelazione per l'aterosclerosi, "medicina
quantistica"/biorisonanza, iridologia, cristalloterapia, terapie con cellule staminali non
autorizzate, cure alternative per il cancro), claim di guarigione, promesse su "invertire
l'invecchiamento", strutture senza direttore sanitario identificabile o senza autorizzazione
sanitaria dove richiesta.

**Requisiti minimi per la pubblicazione**: ragione sociale e P.IVA verificabili, indirizzo fisico,
per le prestazioni sanitarie un medico responsabile con numero di iscrizione all'albo,
almeno un canale di contatto attivo.

Pubblicare la policy su `/chi-siamo/metodo-di-valutazione`: è ciò che ti fa citare da altri e
distingue il progetto da un elenco a pagamento.

---

## 4. Filtri di ricerca

### 4.1 Filtri globali (sempre visibili, sidebar desktop / bottom-sheet mobile)

| Filtro | Tipo UI | Campo dati | Note |
|---|---|---|---|
| Località | Autocomplete città + "vicino a me" + raggio (5/10/25/50 km) | `region`, `province`, `city`, `lat`, `lng` | Il filtro più usato: va in cima |
| Categoria di servizio | Checkbox multi-livello | `service_categories[]` | Multi-select |
| Tipo di struttura | Checkbox | `facility_type` | |
| Fascia di prezzo | Chips € / €€ / €€€ | `price_range` | + campo "primo consulto da € X" |
| Valutazione minima | Stelle 3+ / 4+ / 4,5+ | `rating` | Solo con recensioni verificate reali |
| Modalità | Chips: in presenza · telemedicina · a domicilio | `delivery_modes[]` | |
| Prenotazione online | Toggle | `online_booking` | Alto valore commerciale |
| Aperto ora / weekend / sera | Toggle | `hours` | |
| Verifica | Toggle "Solo centri verificati" | `verified` | Leva di upsell verso i piani |
| Convenzioni | Multi-select: SSN, assicurazioni (UniSalute, Fasi, Previmedical), fondi sanitari | `insurances[]` | Fortissimo in Italia, quasi nessuno lo offre |
| Lingue parlate | Multi-select | `languages[]` | Serve al longevity travel |
| Accessibilità | Toggle | `accessibility` | |

### 4.2 Filtri specifici per categoria (faccette condizionali)

- **Diagnostica avanzata**: esami disponibili (multi-select sulla lista sottocategorie) · refertazione in X giorni · consulto medico incluso · pacchetto check-up completo · prelievo a domicilio
- **Terapie e tecnologie**: tecnologia disponibile (crioterapia, HBOT, red light, IHHT…) · pressione della camera iperbarica (1.3 / 2.0+ ATA) · seduta singola vs abbonamento · supervisione medica presente
- **Medicina funzionale / longevità**: specializzazione del team · primo consulto (durata e prezzo) · programma continuativo (3/6/12 mesi) · follow-up incluso · esami inclusi nel programma
- **Nutrizione**: approccio (clinico, sportivo, FMD, nutrigenetica) · online/in presenza · piano personalizzato incluso
- **Movimento e performance**: valutazione funzionale iniziale · 1-a-1 vs piccolo gruppo · test VO₂max in sede
- **Retreat e spa**: durata (weekend / 3-5 giorni / 7+) · pensione inclusa · supervisione medica · fascia di prezzo del programma
- **Professionisti**: albo e numero iscrizione · anni di esperienza · prima visita online · lingue

### 4.3 Ordinamenti

`Rilevanza` (default, pesa: piano premium > completezza scheda > recensioni > distanza) ·
`Più vicini` · `Valutazione migliore` · `Più recensiti` · `Aggiunti di recente`

Nota commerciale: i profili Premium entrano nei primi 3 risultati **etichettati come "In evidenza"**.
Etichettare la promozione non è solo trasparenza: evita contestazioni AGCM sulla pubblicità occulta.

---

## 5. Modello dati della scheda centro (pronto per ACF / Webflow CMS / Supabase)

| Campo | Tipo | Uso |
|---|---|---|
| `name`, `slug` | text | H1, URL |
| `facility_type` | select | filtro, schema.org `@type` |
| `service_categories[]` | relation multi | filtro, pagine categoria |
| `short_description` (160 car.) / `description` (600–1200 car.) | text / rich text | card / scheda |
| `region`, `province`, `city`, `address`, `postal_code`, `lat`, `lng` | text/number | filtri geo, mappa, `PostalAddress` |
| `phone`, `email`, `website`, `booking_url`, `whatsapp` | text | contatti (gated per piano) |
| `instagram`, `linkedin`, `youtube` | url | scheda |
| `hours[]` | repeater | "aperto ora", `openingHoursSpecification` |
| `medical_director`, `albo_number`, `albo_province` | text | verifica + trust |
| `team[]` (nome, ruolo, albo, foto, bio) | repeater | E-E-A-T |
| `services[]` (nome, descrizione, prezzo da, durata) | repeater | listino, filtri prezzo, `Offer` |
| `technologies[]` | multi-select | faccette categoria D |
| `tests_available[]` | multi-select | faccette categoria B |
| `price_range`, `first_visit_price` | select / number | filtro |
| `insurances[]`, `languages[]`, `delivery_modes[]` | multi-select | filtri |
| `certifications[]` (autorizzazione sanitaria, ISO, accreditamento) | repeater | trust |
| `gallery[]`, `cover_photo`, `logo` | media | scheda |
| `video_url`, `virtual_tour` | url | solo piano Premium |
| `faqs[]` | repeater | `FAQPage` sulla scheda |
| `rating`, `review_count`, `reviews[]` | computed | **solo recensioni reali**; se assenti, nessun markup rating |
| `verified`, `verified_at`, `plan` (`free`/`verificato`/`premium`/`esclusiva`) | select | badge, ordinamento |
| `claimed`, `owner_user_id` | bool / relation | flusso "rivendica scheda" |
| `featured_until`, `stripe_subscription_id` | date / text | abbonamenti |
| `lead_count_30d`, `profile_views_30d` | computed | dashboard cliente = retention |
| `created_at`, `updated_at`, `last_verified_at` | date | freshness |

### 5.1 Dati strutturati (JSON-LD)

- Scheda centro: `MedicalClinic` / `MedicalBusiness` / `Physician` (per professionisti) con
  `address`, `geo`, `telephone`, `openingHoursSpecification`, `medicalSpecialty`, `availableService`
- Rating: `aggregateRating` **solo se esistono recensioni reali verificate**. Mai emettere
  `AggregateRating` o `Review` vuoti o inventati — è esattamente l'errore già corretto su
  `glutenfree-directory` (commit `51ff640`) e vale una penalizzazione manuale
- Liste: `ItemList` · Percorsi: `BreadcrumbList` · Articoli: `Article` + `author` + `reviewedBy`
- Sito: `Organization` con `sameAs`, `WebSite` + `SearchAction`

---

## 6. Piani di abbonamento mappati sulle funzionalità

| Funzione | Base (gratis) | Verificato | Premium | Esclusiva città+categoria |
|---|---|---|---|---|
| Scheda pubblica, indirizzo, mappa | ✅ | ✅ | ✅ | ✅ |
| Link al sito (dofollow) | ❌ (nofollow) | ✅ | ✅ | ✅ |
| Telefono e contatto diretto | parziale | ✅ | ✅ | ✅ |
| Badge "Verificato" | ❌ | ✅ | ✅ | ✅ |
| Galleria foto / video / listino completo | 1 foto | 5 foto | illimitate + video | illimitate + video |
| Posizione nei risultati | standard | +boost | Top 3 "In evidenza" | Slot esclusivo in cima |
| Form contatto e lead diretti | ❌ | ✅ | ✅ + WhatsApp | ✅ |
| Dashboard statistiche e lead | ❌ | base | completa | completa |
| Articolo/intervista sul blog | ❌ | ❌ | 1/anno | 2/anno + newsletter |
| Concorrenti mostrati sulla scheda | sì | sì | no | no |
| Prezzo indicativo | 0 € | 39–49 €/mese | 99–149 €/mese | 249–399 €/mese |

Sconto annuale −20% (2 mesi gratis). Offerta di lancio "Founding 50": Premium gratuito 6 mesi
per i primi 50 centri, prezzo bloccato per 12 mesi (vedi doc 03).

---

## 7. Conformità (non opzionale: è un sito sanitario italiano)

1. **Pubblicità sanitaria** — L. 145/2018 art. 1 c. 525: le comunicazioni delle strutture
   sanitarie devono essere funzionali a garantire la sicurezza dei trattamenti, non promozionali
   né suggestive. Conseguenza pratica: niente "il miglior centro", niente prima/dopo con promesse,
   niente sconti civetta sulle prestazioni sanitarie. I titoli usano formule descrittive
   ("centri di crioterapia a Milano: elenco, prezzi indicativi, come scegliere").
2. **Codice deontologico FNOMCeO** — i professionisti sono responsabili dei contenuti della propria
   scheda: farlo dichiarare in fase di onboarding (checkbox + termini).
3. **Contenuti in evidenza a pagamento** sempre etichettati ("In evidenza", "Contenuto sponsorizzato").
4. **Recensioni** — Direttiva Omnibus / Codice del Consumo: pubblicare solo recensioni verificate
   e dichiarare il metodo di verifica. Mai recensioni generate o acquistate.
5. **GDPR** — dati sanitari degli utenti: mai raccogliere condizioni cliniche in form pubblici
   senza base giuridica e informativa dedicata; lead form limitati a nome, contatto, servizio
   di interesse, messaggio libero (con avviso di non inserire dati sulla salute).
6. **Disclaimer medico** su ogni articolo e in footer: contenuti informativi, non sostituiscono
   il parere del medico.
7. **Integratori e prodotti** — Reg. CE 1924/2006: si possono usare solo claim autorizzati;
   affiliazioni dichiarate esplicitamente in cima all'articolo.

---

## 8. Implementazione sul CMS

### Opzione A — WordPress (consigliata se vuoi delegare l'editoria)
- Tema leggero: **Blocksy** o **Kadence** (evitare i temi directory pesanti tipo ListingPro)
- Directory: **HivePress** + add-on *Paid Listings*, *Claim Listing*, *Reviews*, *Geolocation*
  (alternativa: CPT UI + **ACF Pro** + **FacetWP** se vuoi controllo totale sulle faccette)
- Filtri: **FacetWP** (gestisce bene URL, `noindex` sulle combinazioni, prestazioni)
- SEO: **RankMath Pro** (schema custom per `MedicalClinic`, controllo indicizzazione faccette)
- Pagamenti: **WooCommerce Subscriptions** o Stripe Billing via HivePress
- Performance: WP Rocket + Cloudflare + immagini WebP/AVIF
- Struttura tassonomie: `service_category` (gerarchica), `facility_type`, `city` (gerarchica:
  regione → provincia → comune), `technology`, `test`, `insurance` (non gerarchiche)

### Opzione B — Webflow (consigliata se vuoi il massimo controllo estetico)
- CMS Collections: `Centri`, `Categorie servizio`, `Città`, `Articoli`, `Autori`, `Prodotti`,
  `Piani`. Attenzione ai limiti: 40 collection e 10.000 item per sito, filtro multi-reference limitato
- Filtri: **Finsweet Attributes** (CMS Filter + Load); su >2.000 schede valuta un'istanza
  esterna di ricerca (Algolia/Typesense)
- Area riservata e paywall: **Memberstack** + Stripe
- Le pagine categoria+città vanno create manualmente o via script API: è il limite principale di Webflow

### Opzione C — Next.js + Supabase + Stripe (riuso del nostro stack)
Già collaudata su `glutenfree-directory`: App Router, filtri via query string,
`generateStaticParams` per categoria/città, `sitemap.ts`/`robots.ts` nativi, JSON-LD in
`lib/seo.tsx`, area business e admin. È l'opzione con il costo marginale più basso perché il
90% dei componenti (`DirectoryFilters`, `BusinessCard`, `MapSection`, `FaqAccordion`,
`BusinessOnboardingContent`) è riutilizzabile cambiando tassonomia e contenuti.

### 8.1 Checklist tecnica di lancio

- [ ] Un H1 per pagina, title ≤ 60 caratteri, meta description ≤ 155
- [ ] Breadcrumb visibili + `BreadcrumbList` su tutte le pagine profonde
- [ ] Sitemap XML separate: `pagine`, `directory`, `centri`, `blog`, `prodotti`
- [ ] `robots.txt`: `Disallow: /cerca`, `/account`, `/admin`, `/*?sort=`
- [ ] Core Web Vitals: LCP < 2,5 s su mobile (le pagine directory sono immagine-pesanti: lazy load + dimensioni fisse)
- [ ] Google Business Profile del progetto + Search Console + Bing Webmaster + Analytics 4 con eventi `lead_centro`, `click_telefono`, `click_sito`, `iscrizione_newsletter`
- [ ] Pagina 404 con ricerca e link alle categorie
- [ ] Redirect 301 pianificati per ogni cambio di slug (registro dei redirect)
- [ ] Consent Mode v2 (obbligatorio per l'SEE) e cookie banner conforme
