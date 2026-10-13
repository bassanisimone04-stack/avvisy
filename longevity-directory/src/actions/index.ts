import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import type { AstroCookies } from "astro";
import { run } from "../lib/db";
import { createUser, findUserByEmail, verifyPassword, createSession, destroySession, getUserFromSession, SESSION_COOKIE } from "../lib/auth";
import { stripeEnabled, createCheckoutSession as stripeCreateCheckout } from "../lib/stripe";
import { ADMIN_COOKIE, checkAdminPassword, issueAdminCookieValue, adminConfigured, verifyAdminCookieValue } from "../lib/admin-auth";
import { CATEGORIES, FACILITY_TYPES } from "../lib/taxonomy";
import { SITE } from "../lib/site";

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];
const facilitySlugs = FACILITY_TYPES.map((f) => f.slug) as [string, ...string[]];

/** Imposta il cookie di sessione con le opzioni corrette (httpOnly, sameSite). */
function setSessionCookie(cookies: AstroCookies, token: string, expiresAt: Date) {
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export const server = {
  /** Modulo di contatto pubblico (/contatti). */
  sendContactMessage: defineAction({
    accept: "form",
    input: z.object({
      motivo: z.string().min(1),
      nome: z.string().min(1, "Il nome è obbligatorio.").max(200),
      email: z.string().email("Inserisci un'email valida."),
      messaggio: z.string().min(5, "Scrivi qualche parola in più.").max(4000),
    }),
    handler: async (input) => {
      await run("INSERT INTO contact_messages (motivo, nome, email, messaggio) VALUES (?, ?, ?, ?)", [
        input.motivo,
        input.nome.trim(),
        input.email.trim(),
        input.messaggio.trim(),
      ]);
      return { ok: true as const };
    },
  }),

  /** "Richiedi informazioni" sulla scheda di un centro. */
  sendLead: defineAction({
    accept: "form",
    input: z.object({
      centroSlug: z.string().min(1),
      centroNome: z.string().min(1),
      nome: z.string().min(1, "Il nome è obbligatorio.").max(200),
      email: z.string().email("Inserisci un'email valida."),
      telefono: z.string().max(40).optional(),
      messaggio: z.string().max(2000).optional(),
    }),
    handler: async (input) => {
      await run(
        `INSERT INTO leads (centro_slug, centro_nome, nome, email, telefono, messaggio)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          input.centroSlug,
          input.centroNome,
          input.nome.trim(),
          input.email.trim(),
          input.telefono?.trim() || null,
          input.messaggio?.trim() || null,
        ],
      );
      return { ok: true as const };
    },
  }),

  /** Passaggio 4 della registrazione struttura: crea account + invio in revisione. */
  registerBusiness: defineAction({
    accept: "form",
    input: z.object({
      nomeStruttura: z.string().min(2, "Inserisci il nome della struttura.").max(200),
      email: z.string().email("Inserisci un'email valida."),
      password: z.string().min(8, "La password deve avere almeno 8 caratteri."),
      piva: z.string().min(5, "Inserisci una partita IVA valida.").max(20),
      facilityType: z.enum(facilitySlugs, { message: "Seleziona il tipo di struttura." }),
      // Deve restare un ZodArray "nudo" (senza .or/.transform): Astro riconosce il
      // campo come multiplo introspezionando lo schema e usa `formData.getAll(key)`
      // solo se il validator è `instanceof z.ZodArray` — un'unione lo farebbe
      // leggere con `formData.get(key)`, perdendo tutte le checkbox tranne una.
      categorie: z.array(z.enum(categorySlugs)).min(1, "Seleziona almeno una disciplina."),
      indirizzo: z.string().min(3, "Inserisci l'indirizzo."),
      citta: z.string().min(2, "Inserisci la città."),
      direttoreSanitario: z.string().min(2, "Inserisci il nome del direttore sanitario."),
      numeroAlbo: z.string().min(1, "Inserisci il numero di iscrizione all'albo."),
      telefono: z.string().max(40).optional(),
    }),
    handler: async (input, context) => {
      if (await findUserByEmail(input.email)) {
        throw new ActionError({
          code: "CONFLICT",
          message: "Esiste già un account con questa email. Prova ad accedere invece di registrarti.",
        });
      }

      const user = await createUser(input.email, input.password, input.nomeStruttura);
      await run(
        `INSERT INTO submissions
           (user_id, nome, piva, facility_type, categorie, indirizzo, citta, direttore_sanitario, numero_albo, telefono)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          input.nomeStruttura.trim(),
          input.piva.trim(),
          input.facilityType,
          JSON.stringify(input.categorie),
          input.indirizzo.trim(),
          input.citta.trim(),
          input.direttoreSanitario.trim(),
          input.numeroAlbo.trim(),
          input.telefono?.trim() || null,
        ],
      );

      const { token, expiresAt } = await createSession(user.id);
      setSessionCookie(context.cookies, token, expiresAt);

      return { ok: true as const };
    },
  }),

  login: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email("Inserisci un'email valida."),
      password: z.string().min(1, "Inserisci la password."),
    }),
    handler: async (input, context) => {
      const user = await findUserByEmail(input.email);
      if (!user || !verifyPassword(input.password, user.password_hash)) {
        throw new ActionError({ code: "UNAUTHORIZED", message: "Email o password non corrette." });
      }
      const { token, expiresAt } = await createSession(user.id);
      setSessionCookie(context.cookies, token, expiresAt);
      return { ok: true as const };
    },
  }),

  logout: defineAction({
    accept: "form",
    handler: async (_input, context) => {
      const token = context.cookies.get(SESSION_COOKIE)?.value;
      if (token) await destroySession(token);
      context.cookies.delete(SESSION_COOKIE, { path: "/" });
      return { ok: true as const };
    },
  }),

  adminLogin: defineAction({
    accept: "form",
    input: z.object({ password: z.string().min(1) }),
    handler: async (input, context) => {
      if (!adminConfigured()) {
        throw new ActionError({ code: "PRECONDITION_FAILED", message: "ADMIN_PASSWORD non configurata su questo ambiente." });
      }
      if (!checkAdminPassword(input.password)) {
        throw new ActionError({ code: "UNAUTHORIZED", message: "Password errata." });
      }
      context.cookies.set(ADMIN_COOKIE, issueAdminCookieValue(), {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        path: "/",
        maxAge: 12 * 60 * 60,
      });
      return { ok: true as const };
    },
  }),

  adminLogout: defineAction({
    accept: "form",
    handler: async (_input, context) => {
      context.cookies.delete(ADMIN_COOKIE, { path: "/" });
      return { ok: true as const };
    },
  }),

  /** Approva o rifiuta una registrazione in attesa (solo admin). */
  reviewSubmission: defineAction({
    accept: "form",
    input: z.object({
      id: z.coerce.number().int().positive(),
      decisione: z.enum(["approvata", "rifiutata"]),
    }),
    handler: async (input, context) => {
      if (!verifyAdminCookieValue(context.cookies.get(ADMIN_COOKIE)?.value)) {
        throw new ActionError({ code: "UNAUTHORIZED", message: "Accesso admin richiesto." });
      }
      await run("UPDATE submissions SET stato = ? WHERE id = ?", [input.decisione, input.id]);
      return { ok: true as const };
    },
  }),

  /** Avvia un checkout Stripe per un piano a pagamento. Richiede login e chiavi configurate. */
  createCheckoutSession: defineAction({
    accept: "form",
    input: z.object({
      piano: z.enum(["verificato", "premium", "esclusiva"]),
    }),
    handler: async (input, context) => {
      if (!stripeEnabled) {
        throw new ActionError({
          code: "PRECONDITION_FAILED",
          message: "I pagamenti non sono ancora configurati su questo ambiente (mancano le chiavi Stripe).",
        });
      }
      const token = context.cookies.get(SESSION_COOKIE)?.value;
      const user = await getUserFromSession(token);
      if (!user) {
        throw new ActionError({ code: "UNAUTHORIZED", message: "Accedi con l'account della tua struttura prima di scegliere un piano." });
      }
      const url = await stripeCreateCheckout({
        piano: input.piano,
        successUrl: `${SITE.url}/account?checkout=ok`,
        cancelUrl: `${SITE.url}/per-i-centri?checkout=annullato`,
        customerEmail: user.email,
      });
      return { url };
    },
  }),
};
