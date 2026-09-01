/**
 * ============================================================
 *  TASSONOMIA DELLA DIRECTORY
 * ============================================================
 * Fonte: docs/01-architettura-informativa.md §3.2.
 * Due assi: `service_categories` (multiplo, questo file) e
 * `facility_type` (singolo, vedi FACILITY_TYPES sotto).
 * Ogni categoria genera `/directory/[slug]`; le combinazioni
 * categoria+città si generano solo con ≥3 schede (vedi
 * src/pages/directory/[categoria]/[citta].astro).
 */

export interface Subcategory {
  slug: string;
  label: string;
}

export interface Category {
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
  cover: CoverId;
  subcategories: Subcategory[];
}

/** Id delle 8 palette usate per generare le copertine (vedi Aurora/Cover.astro). */
export type CoverId = "cv1" | "cv2" | "cv3" | "cv4" | "cv5" | "cv6" | "cv7" | "cv8";

export const CATEGORIES: Category[] = [
  {
    slug: "medicina-longevita",
    label: "Medicina della longevità e preventiva",
    shortLabel: "Medicina della longevità",
    description:
      "Check-up di medicina preventiva personalizzata, valutazione del rischio cardiovascolare, prevenzione oncologica, salute cognitiva e healthy aging.",
    cover: "cv1",
    subcategories: [
      { slug: "check-up-longevita", label: "Check-up longevità / medicina preventiva personalizzata" },
      { slug: "rischio-cardiovascolare", label: "Valutazione del rischio cardiovascolare avanzata" },
      { slug: "prevenzione-oncologica", label: "Prevenzione oncologica personalizzata" },
      { slug: "salute-cognitiva", label: "Salute cognitiva e prevenzione neurodegenerativa" },
      { slug: "menopausa-salute-femminile", label: "Medicina di genere: menopausa e salute femminile" },
      { slug: "salute-maschile", label: "Salute maschile e andrologia preventiva" },
      { slug: "healthy-aging-over-60", label: "Healthy aging over 60 e prevenzione della sarcopenia" },
    ],
  },
  {
    slug: "diagnostica-avanzata",
    label: "Diagnostica avanzata e biomarcatori",
    shortLabel: "Diagnostica avanzata",
    description:
      "Test dell'età biologica, pannelli ematici avanzati, test genetici, microbiota, composizione corporea, imaging preventivo e monitoraggio glicemico.",
    cover: "cv2",
    subcategories: [
      { slug: "eta-biologica", label: "Test dell'età biologica (orologi epigenetici)" },
      { slug: "pannelli-ematici-avanzati", label: "Pannelli ematici avanzati (ApoB, Lp(a), hs-CRP, insulina)" },
      { slug: "test-genetici", label: "Test genetici e farmacogenetica" },
      { slug: "microbiota", label: "Analisi del microbiota intestinale" },
      { slug: "profilo-ormonale", label: "Profilo ormonale completo" },
      { slug: "composizione-corporea", label: "Composizione corporea (DEXA, BIA, densitometria)" },
      { slug: "vo2max-test-cardiopolmonare", label: "Test cardiopolmonare e VO₂max" },
      { slug: "imaging-preventivo", label: "Imaging preventivo (RM total body, calcium score)" },
      { slug: "cgm-glicemia", label: "Monitoraggio continuo del glucosio (CGM)" },
      { slug: "diagnostica-sonno", label: "Polisonnografia e studio del sonno" },
      { slug: "tossicologia", label: "Tossicologia e metalli pesanti" },
    ],
  },
  {
    slug: "medicina-funzionale",
    label: "Medicina funzionale e integrata",
    shortLabel: "Medicina funzionale",
    description:
      "Medicina funzionale, PNEI, gastroenterologia funzionale, terapia ormonale sostitutiva e gestione dell'infiammazione cronica di basso grado.",
    cover: "cv4",
    subcategories: [
      { slug: "medicina-funzionale", label: "Medicina funzionale" },
      { slug: "pnei", label: "PNEI (psico-neuro-endocrino-immunologia)" },
      { slug: "gastro-funzionale", label: "Gastroenterologia funzionale e asse intestino-cervello" },
      { slug: "terapia-ormonale", label: "Endocrinologia e terapia ormonale sostitutiva (TRT / HRT)" },
      { slug: "infiammazione-cronica", label: "Immunologia e infiammazione cronica di basso grado" },
      { slug: "dolore-reumatologia", label: "Medicina del dolore e reumatologia preventiva" },
    ],
  },
  {
    slug: "terapie-tecnologie",
    label: "Terapie e tecnologie (biohacking clinico)",
    shortLabel: "Terapie e tecnologie",
    description:
      "Crioterapia, ossigenoterapia iperbarica, fotobiomodulazione, IV therapy e NAD⁺, ipossia intermittente, PEMF e neurofeedback.",
    cover: "cv3",
    subcategories: [
      { slug: "crioterapia", label: "Crioterapia whole body e criosauna" },
      { slug: "ossigenoterapia-iperbarica", label: "Ossigenoterapia iperbarica (HBOT)" },
      { slug: "sauna-infrarossi", label: "Sauna a infrarossi e protocolli caldo/freddo" },
      { slug: "fotobiomodulazione", label: "Fotobiomodulazione / red light therapy" },
      { slug: "iv-therapy-nad", label: "Terapie infusionali e NAD⁺ (IV therapy)" },
      { slug: "ipossia-intermittente", label: "Ipossia intermittente (IHHT)" },
      { slug: "pemf", label: "PEMF e campi elettromagnetici pulsati" },
      { slug: "ems-vibrazione", label: "Elettrostimolazione (EMS) e vibrazione a corpo intero" },
      { slug: "pressoterapia", label: "Pressoterapia e drenaggio linfatico" },
      { slug: "floating", label: "Floating e deprivazione sensoriale" },
      { slug: "neurofeedback", label: "Neurofeedback e stimolazione cognitiva" },
    ],
  },
  {
    slug: "nutrizione-metabolismo",
    label: "Nutrizione e metabolismo",
    shortLabel: "Nutrizione e metabolismo",
    description:
      "Nutrizione clinica per la longevità, digiuno terapeutico e dieta mima-digiuno, nutrigenetica e gestione della salute metabolica.",
    cover: "cv5",
    subcategories: [
      { slug: "nutrizione-longevita", label: "Nutrizione clinica per la longevità" },
      { slug: "digiuno-fmd", label: "Digiuno terapeutico e dieta mima-digiuno (FMD)" },
      { slug: "nutrigenetica", label: "Nutrigenetica e nutrizione di precisione" },
      { slug: "salute-metabolica", label: "Gestione del peso e salute metabolica" },
      { slug: "nutrizione-sportiva", label: "Nutrizione sportiva e ricomposizione corporea" },
    ],
  },
  {
    slug: "movimento-performance",
    label: "Movimento, performance e riabilitazione",
    shortLabel: "Movimento e performance",
    description:
      "Allenamento della forza per la longevità, zona 2, fisioterapia preventiva, valutazione funzionale e riabilitazione cardio-respiratoria.",
    cover: "cv6",
    subcategories: [
      { slug: "forza-longevita", label: "Allenamento della forza per la longevità" },
      { slug: "zona-2-cardio", label: "Zona 2 e allenamento cardiometabolico su misura" },
      { slug: "fisioterapia-prevenzione", label: "Fisioterapia e prevenzione degli infortuni" },
      { slug: "postura-mobilita", label: "Rieducazione posturale e mobilità" },
      { slug: "valutazione-funzionale", label: "Valutazione funzionale e test di stabilità/equilibrio" },
      { slug: "riabilitazione-cardio-respiratoria", label: "Riabilitazione cardiologica e respiratoria" },
    ],
  },
  {
    slug: "sonno-mente-stress",
    label: "Sonno, mente e gestione dello stress",
    shortLabel: "Sonno, mente e stress",
    description:
      "Medicina del sonno, terapia cognitivo-comportamentale per l'insonnia, psicoterapia, mindfulness e coaching su HRV e recupero.",
    cover: "cv7",
    subcategories: [
      { slug: "medicina-del-sonno", label: "Centri di medicina del sonno" },
      { slug: "cbt-insonnia", label: "Terapia cognitivo-comportamentale per l'insonnia (CBT-I)" },
      { slug: "psicoterapia-stress", label: "Psicoterapia e gestione dello stress" },
      { slug: "mindfulness-respirazione", label: "Mindfulness, MBSR e respirazione" },
      { slug: "hrv-recupero", label: "Coaching su HRV e recupero" },
    ],
  },
  {
    slug: "estetica-rigenerativa",
    label: "Estetica rigenerativa e skin longevity",
    shortLabel: "Estetica rigenerativa",
    description:
      "Skin longevity e dermatologia preventiva, medicina rigenerativa, tecnologie laser, tricologia e salute orale.",
    cover: "cv8",
    subcategories: [
      { slug: "skin-longevity", label: "Skin longevity e dermatologia preventiva" },
      { slug: "medicina-rigenerativa", label: "Medicina rigenerativa (PRP, biostimolazione)" },
      { slug: "laser-dermatologia", label: "Laser e tecnologie dermatologiche" },
      { slug: "tricologia", label: "Tricologia e salute del capello" },
      { slug: "salute-orale", label: "Salute orale e infiammazione sistemica" },
    ],
  },
  {
    slug: "retreat-spa-medicali",
    label: "Retreat, spa medicali e programmi residenziali",
    shortLabel: "Retreat e spa medicali",
    description:
      "Longevity retreat residenziali, terme e spa a indirizzo medico, programmi detox supervisionati e longevity travel.",
    cover: "cv1",
    subcategories: [
      { slug: "longevity-retreat", label: "Longevity retreat residenziali" },
      { slug: "terme-spa-mediche", label: "Terme e spa a indirizzo medico" },
      { slug: "programmi-detox", label: "Programmi detox e reset metabolico supervisionati" },
      { slug: "longevity-travel", label: "Health & longevity travel" },
    ],
  },
];

export const FACILITY_TYPES = [
  { slug: "clinica-poliambulatorio", label: "Clinica / poliambulatorio" },
  { slug: "centro-diagnostico", label: "Centro diagnostico" },
  { slug: "studio-medico-privato", label: "Studio medico privato" },
  { slug: "longevity-center-integrato", label: "Longevity center integrato" },
  { slug: "medical-spa-retreat", label: "Medical spa / retreat" },
  { slug: "centro-performance-fitness", label: "Centro performance e fitness" },
  { slug: "laboratorio-analisi", label: "Laboratorio analisi" },
] as const;

export const INSURANCES = ["UniSalute", "Fasi", "Previmedical", "SSN convenzionato"] as const;
export const LANGUAGES = ["IT", "EN", "FR", "DE"] as const;
export const DELIVERY_MODES = ["In presenza", "Telemedicina", "A domicilio"] as const;

/** Minimo di schede pubblicate perché una pagina categoria+città venga generata (doc 01 §2.1). */
export const MIN_LISTINGS_FOR_CITY_PAGE = 3;

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function citySlug(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Le combinazioni categoria+città che superano la soglia anti-thin-content
 * (doc 01 §2.1) — stessa regola usata da
 * `directory/[categoria]/[citta].astro` per `getStaticPaths` e dalla
 * sitemap, in un solo posto per evitare che le due liste possano divergere.
 */
export function getCityPageCombos(
  centri: { data: { categorie: string[]; citta: string } }[],
): { categoria: string; citta: string; cittaSlug: string }[] {
  const combos: { categoria: string; citta: string; cittaSlug: string }[] = [];
  for (const category of CATEGORIES) {
    const inCategory = centri.filter((c) => c.data.categorie.includes(category.slug));
    const byCity = new Map<string, number>();
    for (const c of inCategory) byCity.set(c.data.citta, (byCity.get(c.data.citta) || 0) + 1);
    for (const [citta, count] of byCity) {
      if (count >= MIN_LISTINGS_FOR_CITY_PAGE) {
        combos.push({ categoria: category.slug, citta, cittaSlug: citySlug(citta) });
      }
    }
  }
  return combos;
}
