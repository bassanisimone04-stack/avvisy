import { BRAND } from "@/config/brand";

type Body = { title: string; lead: string; sections: { h: string; p: string[] }[] };
export type ContentPage = { slug: string; title: string; lead: string; sections: { h: string; p: string[] }[]; template?: boolean; it?: Body };
const B = BRAND.shortName;

/** Editable templates. Legal pages MUST be reviewed by a lawyer before launch (see docs/REPORT.md). */
export const LEGAL: ContentPage[] = [
  { slug: "privacy", template: true, title: "Privacy policy", lead: `How ${B} collects, uses and protects personal data.`, sections: [
    { h: "Controller", p: [`The data controller is ${BRAND.legalEntity}. Contact: ${BRAND.supportEmail}.`] },
    { h: "What we collect", p: ["Newsletter: email address, language, chosen topics and cities, consent timestamp and wording version.", "Forms (contact, corrections, concierge, waitlists): the details you type in.", "Accounts (when enabled): email address, saved items, comparisons, alerts and preferences.", "Affiliate clicks: the link identifier, the page you came from, a salted hash of your IP address and your browser's user agent — no cookies."] },
    { h: "Legal bases", p: ["Consent (newsletter, analytics cookies), contract (accounts), legitimate interest (security, fraud prevention, aggregated affiliate statistics)."] },
    { h: "Retention", p: ["Unconfirmed newsletter sign-ups are deleted after 30 days. Form submissions are kept for up to 24 months. Account data is kept until you delete your account."] },
    { h: "Your rights", p: ["You can access, export, correct and delete your data at any time from your account page or by emailing us. You may lodge a complaint with your supervisory authority."] },
    { h: "Processors", p: ["Hosting, database (Supabase), email delivery (Resend), payments (Stripe), privacy-friendly analytics (Plausible) — each only when configured."] },
  ],
  it: { title: "Informativa sulla privacy", lead: `Come ${B} raccoglie, usa e protegge i dati personali.`, sections: [
    { h: "Titolare del trattamento", p: [`Il titolare del trattamento è ${BRAND.legalEntity}. Contatto: ${BRAND.supportEmail}.`] },
    { h: "Cosa raccogliamo", p: ["Newsletter: indirizzo email, lingua, argomenti e città scelti, data e versione del testo del consenso.", "Moduli (contatti, correzioni, concierge, liste d’attesa): i dati che inserisci.", "Account (quando attivi): indirizzo email, elementi salvati, confronti, avvisi e preferenze.", "Clic sui link di affiliazione: l’identificativo del link, la pagina di provenienza, un hash con sale del tuo indirizzo IP e lo user agent del browser, senza cookie."] },
    { h: "Basi giuridiche", p: ["Consenso (newsletter, cookie di analisi), contratto (account), legittimo interesse (sicurezza, prevenzione delle frodi, statistiche aggregate sull’affiliazione)."] },
    { h: "Conservazione", p: ["Le iscrizioni alla newsletter non confermate vengono cancellate dopo 30 giorni. I moduli inviati sono conservati fino a 24 mesi. I dati dell’account sono conservati finché non lo cancelli."] },
    { h: "I tuoi diritti", p: ["Puoi accedere, esportare, correggere e cancellare i tuoi dati in qualsiasi momento dalla pagina del tuo account o scrivendoci. Puoi proporre reclamo all’autorità di controllo competente."] },
    { h: "Responsabili del trattamento", p: ["Hosting, database (Supabase), invio email (Resend), pagamenti (Stripe), statistiche rispettose della privacy (Plausible): ciascuno solo quando configurato."] },
  ] } },
  { slug: "cookies", template: true, title: "Cookie policy", lead: "Which cookies and local storage we use, and why.", sections: [
    { h: "Strictly necessary", p: ["atg_consent (your cookie choices, 180 days), atg_currency (preferred currency, 1 year). Local storage keeps favourites, comparisons and recent searches on your device."] },
    { h: "Analytics (optional)", p: ["Only after consent, we load Plausible, which does not use cookies and does not track you across sites."] },
    { h: "Changing your choice", p: ["Use the \"Cookie settings\" link in the footer at any time."] },
  ],
  it: { title: "Cookie policy", lead: "Quali cookie e quale archiviazione locale usiamo, e perché.", sections: [
    { h: "Strettamente necessari", p: ["atg_consent (le tue scelte sui cookie, 180 giorni), atg_currency (valuta preferita, 1 anno). L’archiviazione locale conserva sul tuo dispositivo preferiti, confronti e ricerche recenti."] },
    { h: "Statistiche (facoltative)", p: ["Solo dopo il tuo consenso carichiamo Plausible, che non usa cookie e non ti traccia tra siti diversi."] },
    { h: "Cambiare la scelta", p: ["Usa in qualsiasi momento il link «Impostazioni cookie» nel piè di pagina."] },
  ] } },
  { slug: "terms", template: true, title: "Terms of use", lead: `Conditions for using ${B}.`, sections: [
    { h: "Information only", p: [`${B} publishes information about restaurants, hotels and experiences. Prices, opening hours and availability can change; always confirm with the venue.`] },
    { h: "Bookings and purchases", p: ["Reservations, hotel stays and experiences are contracts between you and the venue or partner. Gift cards and memberships are sold only once merchant agreements are in place."] },
    { h: "Acceptable use", p: ["Do not scrape, overload or attempt to bypass security measures of this site."] },
  ],
  it: { title: "Termini di utilizzo", lead: `Condizioni per usare ${B}.`, sections: [
    { h: "Solo informazione", p: [`${B} pubblica informazioni su ristoranti, hotel ed esperienze. Prezzi, orari e disponibilità possono cambiare: conferma sempre con il locale.`] },
    { h: "Prenotazioni e acquisti", p: ["Prenotazioni, soggiorni in hotel ed esperienze sono contratti tra te e il locale o il partner. Gift card e iscrizioni verranno vendute solo quando gli accordi con gli esercenti saranno attivi."] },
    { h: "Uso consentito", p: ["Non effettuare scraping, non sovraccaricare il sito e non tentare di aggirarne le misure di sicurezza."] },
  ] } },
  { slug: "affiliate-disclosure", template: true, title: "Affiliate disclosure", lead: "How we earn money from some links.", sections: [
    { h: "What affiliate links are", p: ["Some links to hotels and experiences go through /go/ and may earn us a commission if you book. They are marked as sponsored links."] },
    { h: "Editorial independence", p: [`Commissions, partner plans and sponsorships never influence recognitions, the ${BRAND.selectionName} or the order of directory results.`] },
  ],
  it: { title: "Informativa sull’affiliazione", lead: "Come guadagniamo con alcuni link.", sections: [
    { h: "Cosa sono i link di affiliazione", p: ["Alcuni link a hotel ed esperienze passano da /go/ e possono farci guadagnare una commissione se prenoti. Sono indicati come link sponsorizzati."] },
    { h: "Indipendenza editoriale", p: [`Commissioni, piani per i partner e sponsorizzazioni non influenzano mai i riconoscimenti, la ${BRAND.selectionName} né l’ordine dei risultati dell’elenco.`] },
  ] } },
  { slug: "sponsored-content", template: true, title: "Sponsored content policy", lead: "How paid content is labelled.", sections: [
    { h: "Labelling", p: ["Sponsored articles carry a visible \"Sponsored\" label at the top and in listings, name the sponsor, and are marked as sponsored in structured data."] },
    { h: "Separation", p: ["Sponsors do not review editorial content, recognitions or price data."] },
  ],
  it: { title: "Politica sui contenuti sponsorizzati", lead: "Come etichettiamo i contenuti a pagamento.", sections: [
    { h: "Etichettatura", p: ["Gli articoli sponsorizzati portano un’etichetta «Sponsorizzato» ben visibile in testa e negli elenchi, indicano lo sponsor e sono segnalati come tali anche nei dati strutturati."] },
    { h: "Separazione", p: ["Gli sponsor non rivedono i contenuti editoriali, i riconoscimenti né i dati sui prezzi."] },
  ] } },
  { slug: "data-correction", template: true, title: "Data correction policy", lead: "How to report and how we fix incorrect information.", sections: [
    { h: "Reporting", p: ["Use \"Report incorrect information\" on any profile or the contact page. Venues can also claim their profile to update operational details."] },
    { h: "Handling", p: ["We acknowledge reports within 5 working days, verify against a primary source, update the record, and log the change with its source and date."] },
  ],
  it: { title: "Politica di correzione dei dati", lead: "Come segnalare e come correggiamo le informazioni errate.", sections: [
    { h: "Segnalare", p: ["Usa «Segnala un’informazione errata» in ogni scheda o nella pagina dei contatti. I locali possono anche rivendicare la propria scheda per aggiornare i dati operativi."] },
    { h: "Gestione", p: ["Confermiamo la ricezione entro 5 giorni lavorativi, verifichiamo su una fonte primaria, aggiorniamo la scheda e registriamo la modifica con fonte e data."] },
  ] } },
];

export const STATIC: ContentPage[] = [
  { slug: "about", title: `About ${B}`, lead: `${B} is an independent guide to fine dining: what it costs, where it is, and whether the information is current.`, sections: [
    { h: "What we do", p: ["We publish structured, sourced profiles of restaurants, with verified tasting-menu prices, opening hours, dietary options and recognitions — each with the date it was last checked.", "We also map hotels, experiences and culinary itineraries around those restaurants."] },
    { h: "Independence", p: [`${B} is not affiliated with any restaurant guide or award body. When we mention third-party recognitions, we state them as facts with the awarding body, year and a source link.`] },
  ],
  it: { title: `Chi siamo — ${B}`, lead: `${B} è una guida indipendente all'alta cucina: quanto costa, dove si trova e se le informazioni sono aggiornate.`, sections: [
    { h: "Cosa facciamo", p: ["Pubblichiamo schede strutturate e documentate dei ristoranti, con prezzi verificati dei menu degustazione, orari, opzioni alimentari e riconoscimenti, ciascuna con la data dell'ultimo controllo.", "Mappiamo anche hotel, esperienze e itinerari gastronomici attorno a quei ristoranti."] },
    { h: "Indipendenza", p: [`${B} non è affiliata ad alcuna guida di ristoranti né ente che assegna premi. Quando citiamo riconoscimenti di terzi li riportiamo come fatti, con ente, anno e link alla fonte.`] },
  ] } },
  { slug: "editorial-policy", title: "Editorial policy", lead: "How we decide what to publish and how we stay independent.", sections: [
    { h: "Our own selection", p: [`The ${BRAND.selectionName} is an editorial distinction awarded by our team. It cannot be bought, and partners cannot influence it.`] },
    { h: "Third-party recognitions", p: ["We report third-party recognitions only as plain text, attributed to the awarding body, with the year and a source link. We never reproduce third-party logos or symbols."] },
    { h: "Commercial separation", p: ["Partner plans can improve how complete a profile is (photos, menus, booking links) but never its recognition, its ranking under \"Recommended\", or its inclusion in collections."] },
  ],
  it: { title: "Linee editoriali", lead: "Come decidiamo cosa pubblicare e come restiamo indipendenti.", sections: [
    { h: "La nostra selezione", p: [`La ${BRAND.selectionName} è una distinzione editoriale assegnata dalla nostra redazione. Non si può comprare e i partner non possono influenzarla.`] },
    { h: "Riconoscimenti di terzi", p: ["Riportiamo i riconoscimenti di terzi solo come testo semplice, attribuiti all'ente che li assegna, con anno e link alla fonte. Non riproduciamo mai loghi o simboli di terzi."] },
    { h: "Separazione commerciale", p: ["I piani per i partner possono rendere più completa una scheda (foto, menu, link di prenotazione) ma non ne cambiano il riconoscimento, la posizione in \"Consigliati\" né l'inclusione nelle selezioni."] },
  ] } },
  { slug: "methodology", title: "Methodology", lead: "How prices and facts are collected, verified and displayed.", sections: [
    { h: "Sources", p: ["Restaurant submissions, licensed datasets, official websites where terms allow, confirmed bookings and editorial research. Every record stores its source URL and collection date."] },
    { h: "Price statuses", p: ["Verified: confirmed from a primary source within the staleness window (default 180 days). Estimated: from a reliable but indirect source. Missing: we do not have it and say so."] },
    { h: "Price history", p: ["Prices are stored in their original currency and every change is appended to an immutable price history; we never overwrite old prices."] },
    { h: "Price Index", p: ["Figures use verified prices only. Each figure shows its sample size (n) and collection date; figures with fewer than 5 verified prices are hidden. Currency conversions use ECB reference rates when available."] },
    { h: "Quality gates", p: ["Destination pages are indexed by search engines only when they list at least 5 verified restaurants and have an original introduction."] },
  ],
  it: { title: "Metodologia", lead: "Come raccogliamo, verifichiamo e mostriamo prezzi e informazioni.", sections: [
    { h: "Fonti", p: ["Segnalazioni dei ristoranti, dataset con licenza, siti ufficiali dove i termini lo consentono, prenotazioni confermate e ricerca editoriale. Ogni scheda riporta l'URL della fonte e la data di raccolta."] },
    { h: "Stato dei prezzi", p: ["Verificato: confermato da una fonte primaria entro la finestra di validità (predefinita 180 giorni). Stimato: da una fonte affidabile ma indiretta. Mancante: non lo abbiamo e lo diciamo."] },
    { h: "Storico dei prezzi", p: ["I prezzi sono salvati nella valuta originale e ogni variazione viene aggiunta a uno storico non modificabile: non sovrascriviamo mai i prezzi precedenti."] },
    { h: "Indice dei prezzi", p: ["I dati usano solo prezzi verificati. Ogni valore mostra campione (n) e data di raccolta; i valori con meno di 5 prezzi verificati sono nascosti. Le conversioni usano i tassi di riferimento BCE, quando disponibili."] },
    { h: "Soglie di qualità", p: ["Le pagine di destinazione vengono indicizzate dai motori di ricerca solo se elencano almeno 5 ristoranti verificati e hanno un'introduzione originale."] },
  ] } },
];

export const BUSINESS: (ContentPage & { form: "claim" | "partner-lead" })[] = [
  { slug: "claim-your-restaurant", form: "claim", title: "Claim your restaurant", lead: "Keep your profile accurate: menus, prices, photos, hours and booking links.", sections: [{ h: "Verification", p: ["We verify claims by email domain, a document check, or a phone call-back to the number on your official website. An editor approves every claim before you can edit."] }, { h: "What you can edit", p: ["Operational details only: description, contact, opening hours, menus and prices (marked as restaurant-supplied until verified), authorised photos (with licence confirmation) and booking links. Recognitions and editorial fields are never editable by partners."] }],
  it: { title: "Rivendica il tuo ristorante", lead: "Mantieni la scheda accurata: menu, prezzi, foto, orari e link di prenotazione.", sections: [{ h: "Verifica", p: ["Verifichiamo le rivendicazioni tramite dominio email, controllo di un documento o richiamata al numero indicato sul tuo sito ufficiale. Un editor approva ogni richiesta prima che tu possa modificare."] }, { h: "Cosa puoi modificare", p: ["Solo i dati operativi: descrizione, contatti, orari, menu e prezzi (indicati come forniti dal ristorante finché non verificati), foto autorizzate (con conferma della licenza) e link di prenotazione. Riconoscimenti e campi editoriali non sono mai modificabili dai partner."] }] } },
  { slug: "list-your-hotel", form: "partner-lead", title: "List your hotel", lead: "For hotels built around their kitchens.", sections: [{ h: "Who we list", p: ["Hotels with notable restaurants, restaurants with rooms, wine estates, gastronomic resorts and countryside retreats."] }],
  it: { title: "Inserisci il tuo hotel", lead: "Per hotel costruiti attorno alle loro cucine.", sections: [{ h: "Chi inseriamo", p: ["Hotel con ristoranti di rilievo, ristoranti con camere, tenute vinicole, resort gastronomici e ritiri in campagna."] }] } },
  { slug: "experience-partner", form: "partner-lead", title: "Become an experience partner", lead: "Chef's tables, classes, tastings, tours and culinary weekends.", sections: [{ h: "Integration", p: ["Start with a booking link; a supplier API integration is available for partners with live inventory."] }],
  it: { title: "Diventa partner di esperienze", lead: "Tavoli dello chef, corsi, degustazioni, tour e weekend gastronomici.", sections: [{ h: "Integrazione", p: ["Si parte da un link di prenotazione; per i partner con disponibilità in tempo reale è prevista l’integrazione via API."] }] } },
  { slug: "advertise", form: "partner-lead", title: "Advertise", lead: "Clearly labelled placements for brands relevant to fine dining and travel.", sections: [{ h: "Rules", p: ["All placements are labelled as sponsored and never alter recognitions or rankings."] }],
  it: { title: "Pubblicità", lead: "Spazi chiaramente etichettati per marchi pertinenti all’alta cucina e ai viaggi.", sections: [{ h: "Regole", p: ["Tutti gli spazi sono etichettati come sponsorizzati e non modificano mai riconoscimenti o classifiche."] }] } },
  { slug: "sponsored-editorial", form: "partner-lead", title: "Sponsored editorial", lead: "Partner stories, labelled and separated from our editorial.", sections: [{ h: "Disclosure", p: ["Sponsored articles carry a prominent label and the sponsor's name."] }],
  it: { title: "Editoriale sponsorizzato", lead: "Storie dei partner, etichettate e separate dalla nostra redazione.", sections: [{ h: "Trasparenza", p: ["Gli articoli sponsorizzati portano un’etichetta ben visibile e il nome dello sponsor."] }] } },
  { slug: "brand-partnerships", form: "partner-lead", title: "Brand partnerships", lead: "Collaborations with wine, hospitality and travel brands.", sections: [{ h: "How it works", p: ["Tell us about your brand and goals; we propose formats that keep our editorial independence intact."] }],
  it: { title: "Partnership con i marchi", lead: "Collaborazioni con marchi del vino, dell’ospitalità e dei viaggi.", sections: [{ h: "Come funziona", p: ["Raccontaci il tuo marchio e i tuoi obiettivi: proporremo formati che mantengano intatta la nostra indipendenza editoriale."] }] } },
  { slug: "supplier-marketplace", form: "partner-lead", title: "Supplier marketplace", lead: "A planned marketplace connecting restaurants with specialist suppliers.", sections: [{ h: "Status", p: ["In development — register interest and we will contact you when it opens."] }],
  it: { title: "Marketplace dei fornitori", lead: "Un marketplace in programma che metterà in contatto ristoranti e fornitori specializzati.", sections: [{ h: "Stato", p: ["In sviluppo: registra il tuo interesse e ti contatteremo all’apertura."] }] } },
  { slug: "careers", form: "partner-lead", title: "Careers", lead: "Editors, data verifiers and engineers who care about getting the details right.", sections: [{ h: "Open roles", p: ["No open roles are published yet. Send us a note and we will keep it on file."] }],
  it: { title: "Lavora con noi", lead: "Redattori, verificatori di dati e ingegneri attenti ai dettagli.", sections: [{ h: "Posizioni aperte", p: ["Al momento non ci sono posizioni pubblicate. Scrivici e terremo il tuo contatto."] }] } },
  { slug: "media-kit", form: "partner-lead", title: "Media kit", lead: "Brand assets and audience information for press and partners.", sections: [{ h: "Assets", p: ["Logo files are available on request. Audience statistics will be published once measured — we do not publish estimates."] }],
  it: { title: "Media kit", lead: "Risorse del marchio e informazioni sul pubblico per stampa e partner.", sections: [{ h: "Risorse", p: ["I file del logo sono disponibili su richiesta. Le statistiche sul pubblico saranno pubblicate quando misurate: non pubblichiamo stime."] }] } },
  { slug: "contact-sales", form: "partner-lead", title: "Contact sales", lead: "Talk to us about partner plans and campaigns.", sections: [{ h: "Response time", p: ["We reply within two working days."] }],
  it: { title: "Contatta le vendite", lead: "Parla con noi di piani per i partner e campagne.", sections: [{ h: "Tempi di risposta", p: ["Rispondiamo entro due giorni lavorativi."] }] } },
];

export const PLANS = [
  { name: "Basic", price: "Free", features: ["Claimed profile", "Edit hours and contact", "Correction requests"] },
  { name: "Professional", price: "€49 / month", features: ["Menus & prices", "Authorised photo gallery", "Booking link", "Monthly analytics"] },
  { name: "Premium", price: "€99 / month", features: ["Everything in Professional", "Gift card listing", "Experience listings"] },
  { name: "Elite", price: "€199 / month", features: ["Everything in Premium", "Campaign tools", "Priority support"] },
  { name: "Enterprise", price: "Custom", features: ["Groups and hotel collections", "API access", "Dedicated manager"] },
];
