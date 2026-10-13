import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { CATEGORIES, FACILITY_TYPES, INSURANCES, LANGUAGES, DELIVERY_MODES } from "./lib/taxonomy";
import { EVIDENCE_LEVELS } from "./lib/evidence";

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];
const facilitySlugs = FACILITY_TYPES.map((f) => f.slug) as [string, ...string[]];
const coverIds = ["cv1", "cv2", "cv3", "cv4", "cv5", "cv6", "cv7", "cv8"] as const;

/**
 * COLLECTION "centri" — una scheda per ogni struttura/professionista.
 * Modello dati coerente con docs/01-architettura-informativa.md §5.
 */
const centri = defineCollection({
  loader: glob({ pattern: ["**/*.md", "!**/_*"], base: "./src/content/centri" }),
  schema: z.object({
    nome: z.string(),
    facilityType: z.enum(facilitySlugs),
    categorie: z.array(z.enum(categorySlugs)).min(1),
    cover: z.enum(coverIds).default("cv1"),

    regione: z.string(),
    provincia: z.string(),
    citta: z.string(),
    indirizzo: z.string(),

    telefono: z.string().optional(),
    sito: z.string().url().optional(),
    email: z.string().email().optional(),

    direttoreSanitario: z.string().optional(),
    alboProvincia: z.string().optional(),
    numeroAlbo: z.string().optional(),

    fasciaPrezzo: z.enum(["€", "€€", "€€€"]),
    prezzoPrimoConsulto: z.number().int().positive(),

    valutazione: z.number().min(1).max(5),
    numeroRecensioni: z.number().int().nonnegative().default(0),

    /** free | verificato | premium | esclusiva — vedi doc 01 §6. */
    piano: z.enum(["free", "verificato", "premium", "esclusiva"]).default("free"),
    verificato: z.boolean().default(false),

    convenzioni: z.array(z.enum(INSURANCES)).default([]),
    lingue: z.array(z.enum(LANGUAGES)).default(["IT"]),
    modalita: z.array(z.enum(DELIVERY_MODES)).default(["In presenza"]),

    servizi: z
      .array(
        z.object({
          nome: z.string(),
          descrizione: z.string().optional(),
          prezzo: z.number().int().positive().optional(),
          durata: z.string().optional(),
        }),
      )
      .default([]),

    tag: z.array(z.string()).default([]),

    faqs: z
      .array(
        z.object({
          domanda: z.string(),
          risposta: z.string(),
        }),
      )
      .default([]),

    descrizioneBreve: z.string().max(200),

    dataAggiunta: z.coerce.date(),
  }),
});

/**
 * COLLECTION "blog" — articoli editoriali.
 * Standard editoriale in docs/02-strategia-blog-e-keyword.md §4.
 */
const blog = defineCollection({
  loader: glob({ pattern: ["**/*.md", "!**/_*"], base: "./src/content/blog" }),
  schema: z.object({
    titolo: z.string(),
    titoloSeo: z.string().max(60),
    metaDescription: z.string().max(160),
    categoria: z.string(),
    cover: z.enum(coverIds).default("cv1"),

    livelloEvidenza: z.enum(EVIDENCE_LEVELS).optional(),

    keywordPrimaria: z.string(),
    ctaDirectory: z.string(),
    ctaLabel: z.string().default("Vedi i centri"),

    excerpt: z.string().max(240),

    autore: z.string().default("Redazione"),
    revisoreMedico: z.string().optional(),
    dataPubblicazione: z.coerce.date(),
    dataAggiornamento: z.coerce.date().optional(),

    faqs: z
      .array(
        z.object({
          domanda: z.string(),
          risposta: z.string(),
        }),
      )
      .default([]),
  }),
});

/**
 * COLLECTION "guide" — guide pilastro (doc 02 §1 e §3): contenuto lungo (2.500–4.000
 * parole) che collega tra loro un gruppo di articoli /blog dello stesso macro-tema e
 * punta sempre alla pagina directory di categoria corrispondente.
 */
const guide = defineCollection({
  loader: glob({ pattern: ["**/*.md", "!**/_*"], base: "./src/content/guide" }),
  schema: z.object({
    titolo: z.string(),
    titoloSeo: z.string().max(60),
    metaDescription: z.string().max(160),
    cover: z.enum(coverIds).default("cv1"),

    excerpt: z.string().max(240),
    keyTakeaways: z.array(z.string()).min(3).max(6),

    /** id (slug di file) degli articoli /blog collegati come cluster di questo pilastro. */
    clusterSlugs: z.array(z.string()).default([]),

    ctaDirectory: z.string(),
    ctaLabel: z.string().default("Vedi i centri"),

    autore: z.string().default("Redazione"),
    revisoreMedico: z.string().optional(),
    dataPubblicazione: z.coerce.date(),
    dataAggiornamento: z.coerce.date().optional(),

    faqs: z
      .array(
        z.object({
          domanda: z.string(),
          risposta: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { centri, blog, guide };
