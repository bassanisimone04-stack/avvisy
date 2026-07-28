import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * ============================================================
 *  DEFINIZIONE DEI CONTENUTI (Content Collections)
 * ============================================================
 *
 * Tre "raccolte" di file, ognuna con i suoi campi controllati da Zod:
 *   - films        → un file per ogni film/serie (con FAQ per la SEO)
 *   - restaurants  → un file per ogni locale (collegato ai film)
 *   - blog         → un file per ogni articolo
 *
 * Aggiungere un contenuto = creare un nuovo file. Se sbagli un campo,
 * il sito te lo segnala con un errore chiaro durante la build.
 * (Vedi il README e i file `_template.md`.)
 */

/** Tipi di locale ammessi. */
export const TIPI_LOCALE = [
  "ristorante",
  "trattoria",
  "bar",
  "caffè",
  "pasticceria",
  "pizzeria",
] as const;

/** Fasce di prezzo ammesse. */
export const FASCE_PREZZO = ["€", "€€", "€€€", "€€€€"] as const;

/** Stati di apertura ammessi. */
export const STATI = ["aperto", "chiuso", "temporaneamente-chiuso"] as const;

/** Categoria: location reale di un film oppure locale a tema cinema. */
export const CATEGORIE = ["set-reale", "a-tema-cinema"] as const;

/**
 * COLLECTION "films" — le opere (film o serie TV).
 * Ogni file .md dentro src/content/films/ è una scheda film.
 */
const films = defineCollection({
  loader: glob({ pattern: ["**/*.{md,mdx}", "!**/_*"], base: "./src/content/films" }),
  schema: ({ image }) =>
    z.object({
      /** Titolo del film o della serie. */
      titolo: z.string(),
      /** Anno di uscita. */
      anno: z.number().int().min(1895).max(2100),
      /** Regista (o creatore, per le serie). */
      regista: z.string(),
      /** È una serie TV? (default: false = film) */
      serieTv: z.boolean().default(false),
      /** Breve sinossi dell'opera. */
      sinossi: z.string(),
      /** Locandina/immagine del film. */
      locandina: image(),
      /** Testo alternativo della locandina. */
      locandinaAlt: z.string().default(""),
      /** Città principali legate al film (per l'internal linking). */
      citta: z.array(z.string()).default([]),
      /** Domande frequenti (generano i dati strutturati FAQPage). */
      faq: z
        .array(z.object({ domanda: z.string(), risposta: z.string() }))
        .default([]),
    }),
});

/**
 * COLLECTION "restaurants" — le schede dei locali.
 */
const restaurants = defineCollection({
  loader: glob({
    // Esclude i file che iniziano con "_" (es. _template.md).
    pattern: ["**/*.{md,mdx}", "!**/_*"],
    base: "./src/content/restaurants",
  }),
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      citta: z.string(),
      regione: z.string(),
      indirizzo: z.string(),
      coordinate: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      }),
      tipo: z.enum(TIPI_LOCALE),
      /** "set-reale" (girato davvero qui) o "a-tema-cinema" (locale a tema). */
      categoria: z.enum(CATEGORIE).default("set-reale"),
      prezzo: z.enum(FASCE_PREZZO),
      stato: z.enum(STATI).default("aperto"),
      /**
       * Film/serie in cui appare il locale. Ogni voce collega un film della
       * collection "films" (per slug/nome-file) e descrive la scena.
       */
      film: z
        .array(
          z.object({
            /** Slug del film (nome del file in src/content/films/, senza .md). */
            film: reference("films"),
            /** Descrizione della scena girata/ambientata nel locale. */
            descrizioneScena: z.string(),
          })
        )
        .min(1),
      descrizione: z.string(),
      /** Orari di apertura in testo libero (opzionale), es. "Mar–Dom 12–15, 19–23". */
      orari: z.string().optional(),
      sitoWeb: z.string().url().optional(),
      prenotazione: z.string().url().optional(),
      inEvidenza: z.boolean().default(false),
      /** Immagine principale. */
      immagine: image(),
      immagineAlt: z.string().default(""),
      /** Galleria di foto aggiuntive (opzionale). */
      galleria: z.array(image()).default([]),
      ultimoAggiornamento: z.coerce.date(),
    }),
});

/**
 * COLLECTION "blog" — gli articoli per la SEO.
 */
const blog = defineCollection({
  loader: glob({ pattern: ["**/*.{md,mdx}", "!**/_*"], base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      descrizione: z.string(),
      autore: z.string().default("Redazione CineFood Italia"),
      dataPubblicazione: z.coerce.date(),
      immagine: image().optional(),
      immagineAlt: z.string().default(""),
      tags: z.array(z.string()).default([]),
      bozza: z.boolean().default(false),
      /** Domande frequenti (FAQ) → dati strutturati FAQPage per la SEO. */
      faq: z
        .array(z.object({ domanda: z.string(), risposta: z.string() }))
        .default([]),
      /** Lingua dell'articolo: "it" (default) o "en". */
      lang: z.enum(["it", "en"]).default("it"),
    }),
});

export const collections = { films, restaurants, blog };
