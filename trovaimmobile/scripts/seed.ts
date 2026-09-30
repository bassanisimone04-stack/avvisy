// Popola il database con dati DEMO (persone e indirizzi di fantasia, coordinate approssimate).
//   npm run seed            → solo se il database è vuoto
//   npm run seed -- --reset → cancella e ricrea il database

import fs from "node:fs";
import { databasePath, openDatabase } from "../src/lib/db";
import { hashPassword, randomToken } from "../src/lib/crypto";
import { addressKey, prettyCivico, prettyVia } from "../src/lib/address";

const file = databasePath();
if (process.argv.includes("--reset")) for (const f of [file, `${file}-wal`, `${file}-shm`]) fs.rmSync(f, { force: true });
const db = openDatabase(file);
if ((db.prepare("SELECT COUNT(*) n FROM users").get() as { n: number }).n > 0) {
  console.log("Il database contiene già dati. Usa `npm run seed -- --reset` per ricrearlo.");
  process.exit(0);
}

const H = 3600000;
const D = 24 * H;
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
const PASSWORD = hashPassword("demo1234");

function user(email: string, name: string, role: "seeker" | "private" | "agency", agency?: [string, string]) {
  const info = db
    .prepare("INSERT INTO users (email, password_hash, name, role, agency_name, agency_vat, ical_token, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .run(email, PASSWORD, name, role, agency?.[0] ?? null, agency?.[1] ?? null, randomToken(), ago(400 * D));
  const id = Number(info.lastInsertRowid);
  if (role !== "seeker") {
    const ins = db.prepare("INSERT INTO availability_rules (user_id, weekday, start_min, end_min) VALUES (?, ?, ?, ?)");
    for (let wd = 0; wd < 5; wd++) ins.run(id, wd, 17 * 60 + 30, 19 * 60 + 30);
    ins.run(id, 5, 10 * 60, 13 * 60);
  }
  return id;
}

const agMilano = user("agenzia.milano@demo.it", "Paolo Bianchi", "agency", ["Casa Chiara Immobiliare (demo)", "01234567890"]);
const agRoma = user("agenzia.roma@demo.it", "Laura De Santis", "agency", ["Studio Tirreno Case (demo)", "09876543210"]);
const giulia = user("giulia@demo.it", "Giulia Rinaldi", "private");
const marco = user("marco@demo.it", "Marco Esposito", "private");
const anna = user("anna@demo.it", "Anna Ferri", "private");
const luca = user("luca@demo.it", "Luca Sanna", "private");
const francesca = user("francesca@demo.it", "Francesca Lo Bianco", "private");
const sara = user("sara@demo.it", "Sara Conti", "seeker");
const davide = user("davide@demo.it", "Davide Moretti", "seeker");
const elena = user("elena@demo.it", "Elena Galli", "seeker");
const seekers = [sara, davide, elena];

type P = {
  regione: string; comune: string; quartiere: string; via: string; civico: string; interno?: string; cap: string;
  lat: number; lon: number; tipologia: string; mq: number; locali: number; bagni: number; piano: string;
};

function property(p: P, createdAgo: number) {
  const info = db
    .prepare(
      `INSERT INTO properties (address_key, regione, comune, quartiere, via, civico, interno, cap, lat, lon, geo_precision, tipologia, mq, locali, bagni, piano, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approx', ?, ?, ?, ?, ?, ?)`,
    )
    .run(addressKey(p), p.regione, p.comune, p.quartiere, prettyVia(p.via), prettyCivico(p.civico), p.interno ?? null, p.cap, p.lat, p.lon, p.tipologia, p.mq, p.locali, p.bagni, p.piano, ago(createdAgo));
  return Number(info.lastInsertRowid);
}

type L = {
  advertiser: number; title: string; description: string; canone: number; spese: number; cauzione: number; commissione: number;
  contratto: string; arredato?: boolean; createdAgo: number; confirmedAgo: number; closedAgo?: number; closedReason?: string;
  priceChanges?: [number, number][]; // [msAgo, nuovoCanone]
};

function listing(propertyId: number, l: L) {
  const info = db
    .prepare(
      `INSERT INTO listings (property_id, advertiser_id, title, description, status, canone, spese, cauzione, commissione, contratto, arredato, confirmed_at, created_at, closed_at, closed_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(propertyId, l.advertiser, l.title, l.description, l.closedAgo ? "closed" : "active", l.canone, l.spese, l.cauzione, l.commissione, l.contratto, l.arredato ? 1 : 0, ago(l.confirmedAgo), ago(l.createdAgo), l.closedAgo ? ago(l.closedAgo) : null, l.closedReason ?? null);
  const id = Number(info.lastInsertRowid);
  const ph = db.prepare("INSERT INTO price_history (property_id, listing_id, canone, spese, recorded_at) VALUES (?, ?, ?, ?, ?)");
  const changes = l.priceChanges ?? [];
  ph.run(propertyId, id, changes.length ? changes[0][1] : l.canone, l.spese, ago(l.createdAgo));
  for (let i = 1; i < changes.length; i++) ph.run(propertyId, id, changes[i][1], l.spese, ago(changes[i][0]));
  if (changes.length) db.prepare("UPDATE listings SET canone = ? WHERE id = ?").run(changes[changes.length - 1][1], id);
  return id;
}

const DESC = (s: string) => `${s}\n\nDati di esempio generati per la demo di TrovaImmobile: persona, indirizzo e immobile sono di fantasia.`;

// --- Milano: scheda con storico lungo (annuncio chiuso di un privato, ora ripubblicato da un'agenzia)
const pNavigli = property({ regione: "Lombardia", comune: "Milano", quartiere: "Navigli", via: "Via Vigevano", civico: "18", interno: "7", cap: "20144", lat: 45.4535, lon: 9.1735, tipologia: "Bilocale", mq: 52, locali: 2, bagni: 1, piano: "3° con ascensore" }, 420 * D);
listing(pNavigli, { advertiser: giulia, title: "Bilocale sui Navigli, luminoso", description: DESC("Bilocale con balcone sul cortile interno, cucina abitabile."), canone: 980, spese: 90, cauzione: 1960, commissione: 0, contratto: "4+4 libero", createdAgo: 400 * D, confirmedAgo: 330 * D, closedAgo: 320 * D, closedReason: "affittato", arredato: true });
const lNavigli = listing(pNavigli, { advertiser: agMilano, title: "Bilocale arredato zona Navigli con balcone", description: DESC("Bilocale completamente arredato, a due passi dalla Darsena. Riscaldamento centralizzato, cantina."), canone: 1150, spese: 100, cauzione: 2300, commissione: 1150, contratto: "4+4 libero", createdAgo: 20 * D, confirmedAgo: 3 * H, arredato: true, priceChanges: [[20 * D, 1200], [8 * D, 1150]] });

const pCitta = property({ regione: "Lombardia", comune: "Milano", quartiere: "Città Studi", via: "Via Pascoli", civico: "41", cap: "20133", lat: 45.4786, lon: 9.2269, tipologia: "Trilocale", mq: 85, locali: 3, bagni: 1, piano: "2°" }, 60 * D);
listing(pCitta, { advertiser: agMilano, title: "Trilocale per studenti vicino al Politecnico", description: DESC("Tre camere, soggiorno, cucina separata. Ideale per studenti fuori sede."), canone: 1500, spese: 150, cauzione: 3000, commissione: 1500, contratto: "Studenti universitari", createdAgo: 30 * D, confirmedAgo: 26 * H, arredato: true });

const pIsola = property({ regione: "Lombardia", comune: "Milano", quartiere: "Isola", via: "Via Borsieri", civico: "9", cap: "20159", lat: 45.4887, lon: 9.1893, tipologia: "Monolocale", mq: 32, locali: 1, bagni: 1, piano: "1°" }, 25 * D);
listing(pIsola, { advertiser: agMilano, title: "Monolocale ristrutturato in Isola", description: DESC("Monolocale con soppalco, ristrutturato nel 2024."), canone: 850, spese: 60, cauzione: 1700, commissione: 850, contratto: "Transitorio", createdAgo: 25 * D, confirmedAgo: 11 * D, arredato: true });

// --- Roma
const pPigneto = property({ regione: "Lazio", comune: "Roma", quartiere: "Pigneto", via: "Via del Pigneto", civico: "112", cap: "00176", lat: 41.8889, lon: 12.5301, tipologia: "Bilocale", mq: 55, locali: 2, bagni: 1, piano: "Terra" }, 90 * D);
listing(pPigneto, { advertiser: agRoma, title: "Bilocale al Pigneto con cortile privato", description: DESC("Piano terra con piccolo cortile esclusivo. Vicino alla metro C."), canone: 900, spese: 40, cauzione: 1800, commissione: 900, contratto: "3+2 concordato", createdAgo: 45 * D, confirmedAgo: 2 * D, priceChanges: [[45 * D, 950], [15 * D, 900]] });
const pMonti = property({ regione: "Lazio", comune: "Roma", quartiere: "Monti", via: "Via Panisperna", civico: "56", cap: "00184", lat: 41.8969, lon: 12.4921, tipologia: "Trilocale", mq: 78, locali: 3, bagni: 2, piano: "4° senza ascensore" }, 35 * D);
listing(pMonti, { advertiser: agRoma, title: "Trilocale a Monti, travi a vista", description: DESC("Trilocale con travi a vista e doppi servizi nel cuore di Monti."), canone: 1600, spese: 80, cauzione: 3200, commissione: 1600, contratto: "4+4 libero", createdAgo: 35 * D, confirmedAgo: 19 * D });
const pGarbatella = property({ regione: "Lazio", comune: "Roma", quartiere: "Garbatella", via: "Via Guglielmo Massaia", civico: "7", cap: "00154", lat: 41.8633, lon: 12.4887, tipologia: "Stanza singola", mq: 14, locali: 1, bagni: 1, piano: "2°" }, 10 * D);
listing(pGarbatella, { advertiser: agRoma, title: "Stanza singola in appartamento condiviso", description: DESC("Stanza singola in trilocale condiviso con due studentesse."), canone: 450, spese: 50, cauzione: 900, commissione: 250, contratto: "Transitorio", createdAgo: 10 * D, confirmedAgo: 5 * H, arredato: true });

// --- Bologna (privato, risponde velocemente)
const pBologna = property({ regione: "Emilia-Romagna", comune: "Bologna", quartiere: "Santo Stefano", via: "Strada Maggiore", civico: "33", interno: "2", cap: "40125", lat: 44.4917, lon: 11.3544, tipologia: "Bilocale", mq: 50, locali: 2, bagni: 1, piano: "1°" }, 200 * D);
listing(pBologna, { advertiser: giulia, title: "Bilocale sotto i portici di Strada Maggiore", description: DESC("Bilocale silenzioso sul retro, a 10 minuti a piedi da Piazza Maggiore."), canone: 850, spese: 70, cauzione: 1700, commissione: 0, contratto: "3+2 concordato", createdAgo: 12 * D, confirmedAgo: 1 * D });
const pBolognina = property({ regione: "Emilia-Romagna", comune: "Bologna", quartiere: "Bolognina", via: "Via di Corticella", civico: "20", cap: "40128", lat: 44.5122, lon: 11.3476, tipologia: "Trilocale", mq: 70, locali: 3, bagni: 1, piano: "5° con ascensore" }, 18 * D);
listing(pBolognina, { advertiser: giulia, title: "Trilocale con terrazzo in Bolognina", description: DESC("Terrazzo abitabile, cucina nuova, posto bici in cortile."), canone: 950, spese: 90, cauzione: 1900, commissione: 0, contratto: "4+4 libero", createdAgo: 18 * D, confirmedAgo: 30 * H });

// --- Napoli
const pVomero = property({ regione: "Campania", comune: "Napoli", quartiere: "Vomero", via: "Via Scarlatti", civico: "60", cap: "80129", lat: 40.8466, lon: 14.2317, tipologia: "Quadrilocale", mq: 110, locali: 4, bagni: 2, piano: "3°" }, 50 * D);
listing(pVomero, { advertiser: marco, title: "Quadrilocale al Vomero, vista golfo", description: DESC("Ampio quadrilocale con balcone panoramico e doppi servizi."), canone: 1200, spese: 120, cauzione: 3600, commissione: 0, contratto: "4+4 libero", createdAgo: 50 * D, confirmedAgo: 9 * D });

// --- Torino
const pSanSalvario = property({ regione: "Piemonte", comune: "Torino", quartiere: "San Salvario", via: "Via Madama Cristina", civico: "28", cap: "10125", lat: 45.0558, lon: 7.6823, tipologia: "Bilocale", mq: 48, locali: 2, bagni: 1, piano: "2°" }, 15 * D);
listing(pSanSalvario, { advertiser: anna, title: "Bilocale in San Salvario, vicino al Valentino", description: DESC("Bilocale arredato con riscaldamento autonomo."), canone: 620, spese: 60, cauzione: 1240, commissione: 0, contratto: "3+2 concordato", createdAgo: 15 * D, confirmedAgo: 6 * H, arredato: true });

// --- Cagliari, Palermo, Firenze, Bari, Trieste
const pCagliari = property({ regione: "Sardegna", comune: "Cagliari", quartiere: "Marina", via: "Via Sardegna", civico: "45", cap: "09124", lat: 39.2147, lon: 9.1107, tipologia: "Monolocale", mq: 35, locali: 1, bagni: 1, piano: "1°" }, 22 * D);
listing(pCagliari, { advertiser: luca, title: "Monolocale nel quartiere Marina", description: DESC("Monolocale a pochi passi dal porto, arredato."), canone: 550, spese: 30, cauzione: 1100, commissione: 0, contratto: "Transitorio", createdAgo: 22 * D, confirmedAgo: 40 * H, arredato: true });
const pPalermo = property({ regione: "Sicilia", comune: "Palermo", quartiere: "Politeama", via: "Via Libertà", civico: "90", cap: "90143", lat: 38.1335, lon: 13.3479, tipologia: "Trilocale", mq: 95, locali: 3, bagni: 2, piano: "6° con ascensore" }, 70 * D);
listing(pPalermo, { advertiser: francesca, title: "Trilocale signorile in Via Libertà", description: DESC("Palazzo d'epoca con portineria. Doppi servizi, ripostiglio."), canone: 780, spese: 110, cauzione: 1560, commissione: 0, contratto: "4+4 libero", createdAgo: 70 * D, confirmedAgo: 25 * D });
const pFirenze = property({ regione: "Toscana", comune: "Firenze", quartiere: "Santo Spirito", via: "Via Maggio", civico: "15", cap: "50125", lat: 43.7663, lon: 11.2485, tipologia: "Bilocale", mq: 45, locali: 2, bagni: 1, piano: "2°" }, 40 * D);
listing(pFirenze, { advertiser: agMilano, title: "Bilocale in Oltrarno a due passi da Santo Spirito", description: DESC("Soffitti alti, parquet, cucina a vista."), canone: 1100, spese: 50, cauzione: 2200, commissione: 1100, contratto: "Transitorio", createdAgo: 40 * D, confirmedAgo: 4 * D, arredato: true });
const pBari = property({ regione: "Puglia", comune: "Bari", quartiere: "Murat", via: "Via Sparano da Bari", civico: "70", cap: "70121", lat: 41.1225, lon: 16.8697, tipologia: "Trilocale", mq: 88, locali: 3, bagni: 1, piano: "3°" }, 14 * D);
listing(pBari, { advertiser: marco, title: "Trilocale nel Murattiano, zona pedonale", description: DESC("Trilocale in zona pedonale, vicino alla stazione."), canone: 700, spese: 60, cauzione: 1400, commissione: 0, contratto: "3+2 concordato", createdAgo: 14 * D, confirmedAgo: 20 * H });
const pTrieste = property({ regione: "Friuli-Venezia Giulia", comune: "Trieste", quartiere: "Borgo Teresiano", via: "Via Roma", civico: "12", cap: "34121", lat: 45.6527, lon: 13.7746, tipologia: "Bilocale", mq: 58, locali: 2, bagni: 1, piano: "4° con ascensore" }, 8 * D);
listing(pTrieste, { advertiser: anna, title: "Bilocale vista mare in Borgo Teresiano", description: DESC("Bilocale con scorcio sul mare, riscaldamento autonomo."), canone: 650, spese: 70, cauzione: 1300, commissione: 0, contratto: "4+4 libero", createdAgo: 8 * D, confirmedAgo: 2 * H });

// --- Richieste reali → tempo di risposta
const contact = db.prepare("INSERT INTO contacts (listing_id, advertiser_id, seeker_id, message, reply, created_at, replied_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
const listingsOf = (adv: number) => (db.prepare("SELECT id FROM listings WHERE advertiser_id = ? AND status = 'active'").all(adv) as { id: number }[]).map((r) => r.id);
const responsePlan: [number, number[]][] = [
  [giulia, [0.5 * H, 1 * H, 2 * H, 0.7 * H, 3 * H]],
  [agMilano, [3 * H, 5 * H, 26 * H, 4 * H, 8 * H, -1]],
  [agRoma, [20 * H, 30 * H, 50 * H, -1, -1]],
  [marco, [6 * H, 2 * H, 10 * H]],
  [anna, [1 * H, 0.3 * H, 4 * H]],
  [luca, [12 * H]],
  [francesca, [-1, -1]],
];
for (const [adv, delays] of responsePlan) {
  const ls = listingsOf(adv);
  delays.forEach((delay, i) => {
    const created = (70 - i * 9) * D;
    contact.run(
      ls[i % ls.length], adv, seekers[i % 3],
      "Buongiorno, l'immobile è ancora disponibile? Sono una persona referenziata con contratto a tempo indeterminato.",
      delay > 0 ? "Buongiorno, sì è ancora disponibile. Può prenotare una visita dal calendario dell'annuncio." : null,
      ago(created), delay > 0 ? ago(created - delay) : null,
    );
  });
}

// --- Visite passate con recensioni verificate + qualche visita futura
const visit = db.prepare("INSERT INTO visits (listing_id, advertiser_id, seeker_id, start_at, end_at, status, contract_signed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
const review = db.prepare("INSERT INTO reviews (visit_id, advertiser_id, reviewer_id, rating, text, created_at) VALUES (?, ?, ?, ?, ?, ?)");
function pastVisit(listingId: number, adv: number, seeker: number, daysAgo: number, rating: number | null, text: string, contract = false) {
  const start = Date.now() - daysAgo * D;
  const v = visit.run(listingId, adv, seeker, new Date(start).toISOString(), new Date(start + 30 * 60000).toISOString(), "completed", contract ? 1 : 0, ago((daysAgo + 3) * D));
  if (rating) review.run(Number(v.lastInsertRowid), adv, seeker, rating, text, ago((daysAgo - 1) * D));
}
pastVisit(lNavigli, agMilano, sara, 6, 4, "Puntuali e chiari sui costi: la commissione era quella indicata nell'annuncio, nessuna sorpresa.");
pastVisit(listingsOf(giulia)[0], giulia, davide, 9, 5, "Casa identica alle foto, Giulia ha risposto in meno di un'ora e ci ha fatto vedere anche la cantina.", true);
pastVisit(listingsOf(giulia)[1], giulia, elena, 4, 5, "Visita puntuale, tutto come descritto. Spese condominiali spiegate nel dettaglio.");
pastVisit(listingsOf(agRoma)[0], agRoma, elena, 12, 3, "Appartamento come in foto, ma l'agente è arrivato con 20 minuti di ritardo.");
pastVisit(listingsOf(anna)[0], anna, sara, 3, 5, "Proprietaria disponibilissima, casa pulita e luminosa.");

const futureStart = new Date(Date.now() + 2 * D);
futureStart.setUTCHours(16, 0, 0, 0); // 18:00 ora legale italiana
visit.run(lNavigli, agMilano, davide, futureStart.toISOString(), new Date(futureStart.getTime() + 30 * 60000).toISOString(), "confirmed", 0, ago(2 * H));

const counts = db.prepare("SELECT (SELECT COUNT(*) FROM users) u, (SELECT COUNT(*) FROM properties) p, (SELECT COUNT(*) FROM listings) l, (SELECT COUNT(*) FROM visits) v, (SELECT COUNT(*) FROM reviews) r").get();
console.log("Dati demo creati:", counts);
console.log("Accessi demo (password: demo1234): agenzia.milano@demo.it, giulia@demo.it, sara@demo.it, …");
