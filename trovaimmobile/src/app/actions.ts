"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, nowIso } from "@/lib/db";
import { hashPassword, randomToken, verifyPassword } from "@/lib/crypto";
import { createSession, currentUser, destroySession, isAdvertiser, requireUser } from "@/lib/session";
import { geocode } from "@/lib/geocode";
import { CONTRATTI, isRegione, TIPOLOGIE } from "@/lib/italy";
import { closeListing, createListing, findBuildingMatches, reconfirmListing, updatePrice } from "@/lib/listings";
import { MAX_PHOTOS, savePhoto } from "@/lib/storage";
import { bookVisit, syncCalendar } from "@/lib/calendar";
import { hhmmToMinutes } from "@/lib/time";
import { mentionsAdvancePayment } from "@/lib/trust";
import { sendMail } from "@/lib/mail";
import { normalizeFeedUrl } from "@/lib/safe-fetch";

export type FormState = { error?: string; ok?: string } | undefined;

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
function int(f: FormData, k: string, min: number, max: number): number | null {
  const raw = str(f, k).replace(/[.\s€]/g, "");
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= min && n <= max ? n : null;
}
const safeNext = (n: string) => (n.startsWith("/") && !n.startsWith("//") ? n : "/dashboard");

// ---------------------------------------------------------------------------
// Autenticazione

const attempts = new Map<string, { n: number; until: number }>();

export async function registerAction(_: FormState, f: FormData): Promise<FormState> {
  const email = str(f, "email").toLowerCase();
  const password = String(f.get("password") ?? "");
  const name = str(f, "name");
  const role = str(f, "role");
  const agencyName = str(f, "agency_name");
  const agencyVat = str(f, "agency_vat").replace(/\s/g, "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Email non valida." };
  if (password.length < 8) return { error: "La password deve avere almeno 8 caratteri." };
  if (name.length < 2) return { error: "Inserisci il tuo nome." };
  if (!["seeker", "private", "agency"].includes(role)) return { error: "Scegli il tipo di account." };
  if (role === "agency") {
    if (agencyName.length < 2) return { error: "Inserisci la ragione sociale dell'agenzia." };
    if (!/^(IT)?\d{11}$/i.test(agencyVat)) return { error: "Partita IVA non valida (11 cifre)." };
  }
  const exists = db().prepare("SELECT 1 FROM users WHERE email = ?").get(email);
  if (exists) return { error: "Esiste già un account con questa email." };
  const info = db()
    .prepare("INSERT INTO users (email, password_hash, name, role, agency_name, agency_vat, ical_token) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run(email, hashPassword(password), name, role, role === "agency" ? agencyName : null, role === "agency" ? agencyVat.replace(/^IT/i, "") : null, randomToken());
  const userId = Number(info.lastInsertRowid);
  if (role !== "seeker") {
    // Disponibilità di partenza per le visite, modificabile in dashboard: lun-ven 17:30-19:30, sab 10-13.
    const ins = db().prepare("INSERT INTO availability_rules (user_id, weekday, start_min, end_min) VALUES (?, ?, ?, ?)");
    for (let wd = 0; wd < 5; wd++) ins.run(userId, wd, 17 * 60 + 30, 19 * 60 + 30);
    ins.run(userId, 5, 10 * 60, 13 * 60);
  }
  await createSession(userId);
  redirect(role === "seeker" ? safeNext(str(f, "next") || "/annunci") : "/dashboard");
}

export async function loginAction(_: FormState, f: FormData): Promise<FormState> {
  const email = str(f, "email").toLowerCase();
  const password = String(f.get("password") ?? "");
  const a = attempts.get(email);
  if (a && a.n >= 5 && a.until > Date.now()) return { error: "Troppi tentativi. Riprova tra qualche minuto." };
  const user = db().prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as { id: number; password_hash: string } | undefined;
  if (!user || !verifyPassword(password, user.password_hash)) {
    attempts.set(email, { n: (a && a.until > Date.now() ? a.n : 0) + 1, until: Date.now() + 10 * 60000 });
    return { error: "Email o password non corretti." };
  }
  attempts.delete(email);
  await createSession(user.id);
  redirect(safeNext(str(f, "next") || "/dashboard"));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

// ---------------------------------------------------------------------------
// Pubblicazione annuncio

export type AddressCheck =
  | {
      ok: true;
      precision: "exact" | "approx";
      displayName: string;
      suggestedQuartiere?: string;
      matches: {
        id: number;
        via: string;
        civico: string;
        interno: string | null;
        tipologia: string;
        mq: number;
        locali: number;
        bagni: number;
        piano: string | null;
        quartiere: string | null;
        same_unit: number;
        active_listings: number;
        total_listings: number;
      }[];
    }
  | { ok: false; error: string };

/** Passo 1: geocodifica l'indirizzo e cerca schede già esistenti allo stesso civico. */
export async function checkAddressAction(input: { regione: string; comune: string; via: string; civico: string; interno: string; cap: string }): Promise<AddressCheck> {
  const user = await currentUser();
  if (!isAdvertiser(user)) return { ok: false, error: "Devi accedere come inserzionista." };
  if (!isRegione(input.regione)) return { ok: false, error: "Seleziona la regione." };
  if (!input.comune || !input.via || !input.civico) return { ok: false, error: "Comune, via e numero civico sono obbligatori." };
  const geo = await geocode({ comune: input.comune, via: input.via, civico: input.civico, cap: input.cap || undefined });
  if (!geo.ok) return geo;
  const matches = findBuildingMatches(input).map((m) => ({
    id: m.id,
    via: m.via,
    civico: m.civico,
    interno: m.interno,
    tipologia: m.tipologia,
    mq: m.mq,
    locali: m.locali,
    bagni: m.bagni,
    piano: m.piano,
    quartiere: m.quartiere,
    same_unit: m.same_unit,
    active_listings: m.active_listings,
    total_listings: m.total_listings,
  }));
  return { ok: true, precision: geo.precision, displayName: geo.displayName, suggestedQuartiere: geo.quartiere, matches };
}

export async function publishAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await currentUser();
  if (!user || !isAdvertiser(user)) return { error: "Devi accedere come inserzionista (privato o agenzia)." };

  const address = {
    regione: str(f, "regione"),
    comune: str(f, "comune"),
    quartiere: str(f, "quartiere") || null,
    via: str(f, "via"),
    civico: str(f, "civico"),
    interno: str(f, "interno") || null,
    cap: str(f, "cap") || null,
  };
  if (!isRegione(address.regione)) return { error: "Seleziona la regione." };
  if (!address.comune || !address.via || !address.civico) return { error: "Indirizzo incompleto." };

  const tipologia = str(f, "tipologia");
  const contratto = str(f, "contratto");
  const mq = int(f, "mq", 8, 2000);
  const locali = int(f, "locali", 1, 30);
  const bagni = int(f, "bagni", 0, 10);
  const canone = int(f, "canone", 50, 50000);
  const spese = int(f, "spese", 0, 5000);
  const cauzione = int(f, "cauzione", 0, 200000);
  const commissione = int(f, "commissione", 0, 100000);
  const title = str(f, "title");
  const description = str(f, "description");

  if (!(TIPOLOGIE as readonly string[]).includes(tipologia)) return { error: "Seleziona la tipologia." };
  if (!(CONTRATTI as readonly string[]).includes(contratto)) return { error: "Seleziona il tipo di contratto." };
  if (mq == null || locali == null || bagni == null) return { error: "Controlla superficie, locali e bagni." };
  // Costi: tutti i campi sono obbligatori e numerici, mai testo libero.
  if (canone == null) return { error: "Canone mensile obbligatorio (in euro, senza decimali)." };
  if (spese == null) return { error: "Spese condominiali obbligatorie (scrivi 0 se incluse o assenti)." };
  if (cauzione == null) return { error: "Cauzione obbligatoria (scrivi 0 se non prevista)." };
  if (commissione == null) return { error: "Commissione obbligatoria (scrivi 0 se non prevista)." };
  if (user.role === "private" && commissione > 0) return { error: "Un proprietario privato non può applicare commissioni di agenzia." };
  if (title.length < 10 || title.length > 90) return { error: "Il titolo deve avere tra 10 e 90 caratteri." };
  if (description.length < 40) return { error: "Descrivi l'immobile in almeno 40 caratteri." };
  if (mentionsAdvancePayment(description) || mentionsAdvancePayment(title)) {
    return { error: "La descrizione non può chiedere pagamenti, caparre o quote anticipate. Su TrovaImmobile nulla si paga prima della visita." };
  }

  const photos = f.getAll("photos").filter((x): x is File => x instanceof File && x.size > 0);
  if (photos.length > MAX_PHOTOS) return { error: `Massimo ${MAX_PHOTOS} foto.` };

  const geo = await geocode({ comune: address.comune, via: address.via, civico: address.civico, cap: address.cap ?? undefined });
  if (!geo.ok) return { error: geo.error };

  const photoKeys: string[] = [];
  try {
    for (const p of photos) photoKeys.push(await savePhoto(Buffer.from(await p.arrayBuffer())));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Errore nel caricamento delle foto." };
  }

  const piano = str(f, "piano") || null;
  const disponibileDal = str(f, "disponibile_dal");
  const result = createListing({
    advertiserId: user.id,
    address,
    geo: { lat: geo.lat, lon: geo.lon, precision: geo.precision },
    property: { tipologia, mq, locali, bagni, piano },
    listing: {
      title,
      description,
      canone,
      spese,
      cauzione,
      commissione,
      contratto,
      arredato: f.get("arredato") === "on",
      disponibile_dal: /^\d{4}-\d{2}-\d{2}$/.test(disponibileDal) ? disponibileDal : null,
    },
    photoKeys,
  });
  if (!result.ok) return { error: result.error };
  revalidatePath("/annunci");
  redirect(`/annunci/${result.listingId}?pubblicato=${result.attached ? "agganciato" : "nuovo"}`);
}

// ---------------------------------------------------------------------------
// Gestione annunci

export async function reconfirmAction(f: FormData) {
  const user = await requireUser();
  reconfirmListing(Number(f.get("listingId")), user.id);
  revalidatePath("/dashboard");
}

export async function closeListingAction(f: FormData) {
  const user = await requireUser();
  const reason = str(f, "reason") === "affittato" ? "affittato" : "ritirato";
  closeListing(Number(f.get("listingId")), user.id, reason);
  revalidatePath("/dashboard");
}

export async function updatePriceAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  const c = { canone: int(f, "canone", 50, 50000), spese: int(f, "spese", 0, 5000), cauzione: int(f, "cauzione", 0, 200000), commissione: int(f, "commissione", 0, 100000) };
  if (c.canone == null || c.spese == null || c.cauzione == null || c.commissione == null) return { error: "Tutti i costi sono obbligatori." };
  if (user.role === "private" && c.commissione > 0) return { error: "Un privato non può applicare commissioni." };
  if (!updatePrice(Number(f.get("listingId")), user.id, c as { canone: number; spese: number; cauzione: number; commissione: number })) return { error: "Annuncio non trovato." };
  revalidatePath("/dashboard");
  return { ok: "Prezzi aggiornati e registrati nello storico." };
}

// ---------------------------------------------------------------------------
// Calendario

export async function saveAvailabilityAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  if (!isAdvertiser(user)) return { error: "Solo per inserzionisti." };
  const slot = int(f, "slot_minutes", 15, 120);
  if (slot == null || ![15, 20, 30, 45, 60].includes(slot)) return { error: "Durata visita non valida." };
  const rules: { weekday: number; start: number; end: number }[] = [];
  for (let wd = 0; wd < 7; wd++) {
    const text = str(f, `day_${wd}`);
    if (!text) continue;
    for (const part of text.split(",")) {
      const [a, b] = part.split("-").map((s) => hhmmToMinutes(s ?? ""));
      if (a == null || b == null || b <= a) return { error: `Fascia non valida: "${part.trim()}". Usa il formato 17:30-19:30.` };
      rules.push({ weekday: wd, start: a, end: b });
    }
  }
  const d = db();
  d.transaction(() => {
    d.prepare("DELETE FROM availability_rules WHERE user_id = ?").run(user.id);
    const ins = d.prepare("INSERT INTO availability_rules (user_id, weekday, start_min, end_min) VALUES (?, ?, ?, ?)");
    for (const r of rules) ins.run(user.id, r.weekday, r.start, r.end);
    d.prepare("UPDATE users SET slot_minutes = ? WHERE id = ?").run(slot, user.id);
  })();
  revalidatePath("/dashboard/calendario");
  return { ok: "Disponibilità salvata." };
}

export async function saveCalendarUrlAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  const raw = str(f, "ical_import_url");
  if (raw && !normalizeFeedUrl(raw)) return { error: "Inserisci un indirizzo iCal valido (https:// o webcal://)." };
  db().prepare("UPDATE users SET ical_import_url = ?, ical_synced_at = NULL, ical_sync_error = NULL WHERE id = ?").run(raw || null, user.id);
  const r = await syncCalendar(user.id);
  revalidatePath("/dashboard/calendario");
  if (!r.ok) return { error: `Calendario salvato ma non sincronizzato: ${r.error}` };
  return { ok: raw ? `Calendario sincronizzato: ${r.blocks} impegni nei prossimi giorni.` : "Calendario scollegato." };
}

export async function syncNowAction() {
  const user = await requireUser();
  await syncCalendar(user.id);
  revalidatePath("/dashboard/calendario");
}

// ---------------------------------------------------------------------------
// Visite

export async function bookVisitAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await currentUser();
  const listingId = Number(f.get("listingId"));
  if (!user) redirect(`/accedi?next=/annunci/${listingId}`);
  const r = bookVisit(listingId, user.id, str(f, "start"));
  if (!r.ok) return { error: r.error };
  revalidatePath(`/annunci/${listingId}`);
  redirect(`/dashboard?visita=${r.visitId}`);
}

export async function cancelVisitAction(f: FormData) {
  const user = await requireUser();
  const id = Number(f.get("visitId"));
  const v = db().prepare("SELECT v.*, l.title FROM visits v JOIN listings l ON l.id = v.listing_id WHERE v.id = ?").get(id) as
    | { id: number; seeker_id: number; advertiser_id: number; status: string; start_at: string; title: string }
    | undefined;
  if (!v || v.status !== "confirmed" || (v.seeker_id !== user.id && v.advertiser_id !== user.id) || Date.parse(v.start_at) < Date.now()) return;
  db().prepare("UPDATE visits SET status = 'cancelled', cancelled_by = ? WHERE id = ?").run(user.id, id);
  const otherId = v.seeker_id === user.id ? v.advertiser_id : v.seeker_id;
  const other = db().prepare("SELECT email FROM users WHERE id = ?").get(otherId) as { email: string };
  sendMail(other.email, `Visita annullata: ${v.title}`, `La visita per "${v.title}" è stata annullata.`);
  revalidatePath("/dashboard");
}

/** L'inserzionista registra l'esito di una visita passata. */
export async function visitOutcomeAction(f: FormData) {
  const user = await requireUser();
  const id = Number(f.get("visitId"));
  const outcome = str(f, "outcome");
  const v = db().prepare("SELECT advertiser_id, end_at, status FROM visits WHERE id = ?").get(id) as { advertiser_id: number; end_at: string; status: string } | undefined;
  if (!v || v.advertiser_id !== user.id || Date.parse(v.end_at) > Date.now() || v.status === "cancelled") return;
  if (outcome === "no_show") db().prepare("UPDATE visits SET status = 'no_show', contract_signed = 0 WHERE id = ?").run(id);
  else if (outcome === "completed") db().prepare("UPDATE visits SET status = 'completed' WHERE id = ?").run(id);
  else if (outcome === "contract") db().prepare("UPDATE visits SET status = 'completed', contract_signed = 1 WHERE id = ?").run(id);
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Contatti e recensioni

export async function contactAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await currentUser();
  const listingId = Number(f.get("listingId"));
  if (!user) redirect(`/accedi?next=/annunci/${listingId}`);
  const message = str(f, "message");
  if (message.length < 10) return { error: "Scrivi un messaggio di almeno 10 caratteri." };
  if (message.length > 2000) return { error: "Messaggio troppo lungo." };
  const l = db().prepare("SELECT l.advertiser_id, l.title, l.status, u.email FROM listings l JOIN users u ON u.id = l.advertiser_id WHERE l.id = ?").get(listingId) as
    | { advertiser_id: number; title: string; status: string; email: string }
    | undefined;
  if (!l || l.status !== "active") return { error: "Annuncio non disponibile." };
  if (l.advertiser_id === user.id) return { error: "Non puoi contattare te stesso." };
  const open = db().prepare("SELECT 1 FROM contacts WHERE listing_id = ? AND seeker_id = ? AND replied_at IS NULL").get(listingId, user.id);
  if (open) return { error: "Hai già una richiesta in attesa di risposta per questo annuncio." };
  db().prepare("INSERT INTO contacts (listing_id, advertiser_id, seeker_id, message, payment_flag) VALUES (?, ?, ?, ?, ?)").run(listingId, l.advertiser_id, user.id, message, mentionsAdvancePayment(message) ? 1 : 0);
  sendMail(l.email, `Nuova richiesta: ${l.title}`, `${user.name} ti ha scritto:\n\n${message}\n\nRispondi dalla dashboard: il tempo di risposta è visibile sul tuo profilo pubblico.`);
  return { ok: "Messaggio inviato. Riceverai la risposta nella tua dashboard." };
}

export async function replyAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = Number(f.get("contactId"));
  const reply = str(f, "reply");
  if (reply.length < 2) return { error: "Scrivi una risposta." };
  const c = db().prepare("SELECT c.advertiser_id, c.replied_at, u.email, l.title FROM contacts c JOIN users u ON u.id = c.seeker_id JOIN listings l ON l.id = c.listing_id WHERE c.id = ?").get(id) as
    | { advertiser_id: number; replied_at: string | null; email: string; title: string }
    | undefined;
  if (!c || c.advertiser_id !== user.id) return { error: "Richiesta non trovata." };
  if (c.replied_at) return { error: "Hai già risposto." };
  const flagged = mentionsAdvancePayment(reply);
  db().prepare("UPDATE contacts SET reply = ?, replied_at = ?, payment_flag = MAX(payment_flag, ?) WHERE id = ?").run(reply, nowIso(), flagged ? 1 : 0, id);
  sendMail(c.email, `Risposta: ${c.title}`, `${reply}\n\n— Ricorda: non pagare nulla prima di aver visitato l'immobile.`);
  revalidatePath("/dashboard");
  return { ok: flagged ? "Risposta inviata. Nota: il messaggio sembra parlare di pagamenti anticipati ed è stato segnalato con un avviso al destinatario." : "Risposta inviata." };
}

export async function reviewAction(_: FormState, f: FormData): Promise<FormState> {
  const user = await requireUser();
  const visitId = Number(f.get("visitId"));
  const rating = int(f, "rating", 1, 5);
  const text = str(f, "text");
  if (rating == null) return { error: "Scegli un voto da 1 a 5." };
  if (text.length < 20) return { error: "Scrivi almeno 20 caratteri." };
  // Una recensione è possibile solo per una visita reale, prenotata sulla piattaforma e già avvenuta.
  const v = db().prepare("SELECT seeker_id, advertiser_id, end_at, status FROM visits WHERE id = ?").get(visitId) as
    | { seeker_id: number; advertiser_id: number; end_at: string; status: string }
    | undefined;
  if (!v || v.seeker_id !== user.id) return { error: "Puoi recensire solo visite che hai effettuato." };
  if (Date.parse(v.end_at) > Date.now()) return { error: "Potrai recensire dopo la visita." };
  if (v.status === "cancelled" || v.status === "no_show") return { error: "Questa visita non risulta effettuata." };
  try {
    db().prepare("INSERT INTO reviews (visit_id, advertiser_id, reviewer_id, rating, text) VALUES (?, ?, ?, ?, ?)").run(visitId, v.advertiser_id, user.id, rating, text);
  } catch {
    return { error: "Hai già recensito questa visita." };
  }
  revalidatePath("/dashboard");
  return { ok: "Grazie! La recensione è pubblica sul profilo dell'inserzionista." };
}
