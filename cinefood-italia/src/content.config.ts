import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * ============================================================
 *  DEFINIZIONE DEI CONTENUTI (Content Collections)
 * ============================================================
 *
 * Qui definiamo la "forma" dei dati di ogni ristorante e di ogni
 * articolo del blog. Lo schema (fatto con Zod) controlla che ogni
 * file abbia i campi giusti: se sbagli o dimentichi un campo, il
 * sito te lo segnala subito con un errore chiaro durante la build.
 *
 * 👉 Per aggiungere un locale NON serve toccare questo file:
 *    basta creare un nuovo file in `src/content/restaurants/`.
 *    (Vedi il README e il file `_template.md`.)
 */

/** Tipi di locale ammessi. */
export const TIPI_LOCALE = [
  "ristorante",
  "trattoria",
  "bar",
  "caffè",
  "pasticceria",
] as const;

/** Fasce di prezzo ammesse. */
export const FASCE_PREZZO = ["€", "€€", "€€€", "€€€€"] as const;

/** Stati di apertura ammessi. */
export const STATI = ["aperto", "chiuso", "temporaneamente-chiuso"] as const;

/**
 * Schema di un singolo film/serie in cui appare il locale.
 */
const filmSchema = z.object({
  /** Titolo del film o della serie TV. */
  titolo: z.string(),
  /** Anno di uscita. */
  anno: z.number().int().min(1895).max(2100),
  /** Regista (o creatore, per le serie). */
  regista: z.string(),
  /** Descrizione della scena girata/ambientata nel locale. */
  descrizioneScena: z.string(),
  /** È una serie TV? (default: false = film) */
  serieTv: z.boolean().default(false),
});

/**
 * COLLECTION "restaurants" — le schede dei locali.
 * Ogni file .md/.mdx dentro src/content/restaurants/ è una scheda.
 */
const restaurants = defineCollection({
  loader: glob({
    // Esclude i file che iniziano con "_" (es. _template.md), così il
    // modello non viene mai pubblicato come se fosse un locale reale.
    pattern: ["**/*.{md,mdx}", "!**/_*"],
    base: "./src/content/restaurants",
  }),
  schema: ({ image }) =>
    z.object({
      /** Nome del locale. */
      nome: z.string(),
      /** Città in cui si trova. */
      citta: z.string(),
      /** Regione italiana. */
      regione: z.string(),
      /** Indirizzo completo (via, numero, CAP). */
      indirizzo: z.string(),
      /** Coordinate geografiche per la mappa. */
      coordinate: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      }),
      /** Tipo di locale. */
      tipo: z.enum(TIPI_LOCALE),
      /** Fascia di prezzo. */
      prezzo: z.enum(FASCE_PREZZO),
      /** Stato di apertura. */
      stato: z.enum(STATI).default("aperto"),
      /** Elenco dei film/serie in cui appare (almeno uno). */
      film: z.array(filmSchema).min(1),
      /** Descrizione breve del locale. */
      descrizione: z.string(),
      /** Sito web ufficiale (opzionale). */
      sitoWeb: z.string().url().optional(),
      /** Link per prenotare (opzionale). */
      prenotazione: z.string().url().optional(),
      /** In evidenza / sponsorizzato (per la monetizzazione futura). */
      inEvidenza: z.boolean().default(false),
      /** Immagine principale (messa in src/content/... o src/assets/). */
      immagine: image(),
      /** Testo alternativo dell'immagine (accessibilità/SEO). */
      immagineAlt: z.string().default(""),
      /** Data dell'ultimo aggiornamento della scheda. */
      ultimoAggiornamento: z.coerce.date(),
    }),
});

/**
 * COLLECTION "blog" — gli articoli per la SEO.
 * Ogni file .md/.mdx dentro src/content/blog/ è un articolo.
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
      /** Se true l'articolo non viene pubblicato. */
      bozza: z.boolean().default(false),
    }),
});

export const collections = { restaurants, blog };
