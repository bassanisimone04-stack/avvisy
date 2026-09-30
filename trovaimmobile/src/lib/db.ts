import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

// Modello relazionale:
//   users 1─n listings n─1 properties        (un immobile ha più annunci nel tempo, mai il contrario)
//   listings 1─n price_history / listing_photos / contacts / visits
//   visits 1─1 reviews                        (una recensione esiste solo se esiste una visita reale)
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id              INTEGER PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash   TEXT NOT NULL,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('seeker','private','agency')),
  agency_name     TEXT,
  agency_vat      TEXT,
  phone           TEXT,
  ical_import_url TEXT,
  ical_token      TEXT NOT NULL UNIQUE,
  ical_synced_at  TEXT,
  ical_sync_error TEXT,
  ical_unsupported INTEGER NOT NULL DEFAULT 0,
  slot_minutes    INTEGER NOT NULL DEFAULT 30,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS properties (
  id           INTEGER PRIMARY KEY,
  address_key  TEXT NOT NULL UNIQUE,
  regione      TEXT NOT NULL,
  comune       TEXT NOT NULL,
  quartiere    TEXT,
  via          TEXT NOT NULL,
  civico       TEXT NOT NULL,
  interno      TEXT,
  cap          TEXT,
  lat          REAL NOT NULL,
  lon          REAL NOT NULL,
  geo_precision TEXT NOT NULL CHECK (geo_precision IN ('exact','approx')),
  tipologia    TEXT NOT NULL,
  mq           INTEGER NOT NULL,
  locali       INTEGER NOT NULL,
  bagni        INTEGER NOT NULL,
  piano        TEXT,
  created_by   INTEGER REFERENCES users(id),
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_properties_building ON properties(comune, via, civico);
CREATE INDEX IF NOT EXISTS idx_properties_geo ON properties(regione, comune, quartiere);

CREATE TABLE IF NOT EXISTS listings (
  id            INTEGER PRIMARY KEY,
  property_id   INTEGER NOT NULL REFERENCES properties(id),
  advertiser_id INTEGER NOT NULL REFERENCES users(id),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('active','closed')) DEFAULT 'active',
  canone        INTEGER NOT NULL CHECK (canone > 0),
  spese         INTEGER NOT NULL CHECK (spese >= 0),
  cauzione      INTEGER NOT NULL CHECK (cauzione >= 0),
  commissione   INTEGER NOT NULL CHECK (commissione >= 0),
  contratto     TEXT NOT NULL,
  arredato      INTEGER NOT NULL DEFAULT 0,
  disponibile_dal TEXT,
  confirmed_at  TEXT NOT NULL,
  reminder_sent_at TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  closed_at     TEXT,
  closed_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_listings_property ON listings(property_id);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(status, confirmed_at);
CREATE UNIQUE INDEX IF NOT EXISTS uq_listing_active_per_advertiser
  ON listings(property_id, advertiser_id) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS listing_photos (
  id         INTEGER PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  position   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS price_history (
  id          INTEGER PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  listing_id  INTEGER NOT NULL REFERENCES listings(id),
  canone      INTEGER NOT NULL,
  spese       INTEGER NOT NULL,
  recorded_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_price_history_property ON price_history(property_id, recorded_at);

-- Fasce settimanali in cui l'inserzionista è disponibile per le visite (ora locale Europe/Rome)
CREATE TABLE IF NOT EXISTS availability_rules (
  id        INTEGER PRIMARY KEY,
  user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weekday   INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0 = lunedì
  start_min INTEGER NOT NULL,
  end_min   INTEGER NOT NULL,
  CHECK (end_min > start_min)
);

-- Impegni importati dal calendario esterno (Google Calendar / iCal) dell'inserzionista
CREATE TABLE IF NOT EXISTS busy_blocks (
  id       INTEGER PRIMARY KEY,
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_at TEXT NOT NULL,
  end_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_busy_user ON busy_blocks(user_id, start_at);

CREATE TABLE IF NOT EXISTS visits (
  id            INTEGER PRIMARY KEY,
  listing_id    INTEGER NOT NULL REFERENCES listings(id),
  advertiser_id INTEGER NOT NULL REFERENCES users(id),
  seeker_id     INTEGER NOT NULL REFERENCES users(id),
  start_at      TEXT NOT NULL,
  end_at        TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('confirmed','cancelled','completed','no_show')) DEFAULT 'confirmed',
  contract_signed INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  cancelled_by  INTEGER REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_visits_advertiser ON visits(advertiser_id, start_at);
CREATE INDEX IF NOT EXISTS idx_visits_seeker ON visits(seeker_id, start_at);

CREATE TABLE IF NOT EXISTS contacts (
  id            INTEGER PRIMARY KEY,
  listing_id    INTEGER NOT NULL REFERENCES listings(id),
  advertiser_id INTEGER NOT NULL REFERENCES users(id),
  seeker_id     INTEGER NOT NULL REFERENCES users(id),
  message       TEXT NOT NULL,
  reply         TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  replied_at    TEXT,
  payment_flag  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_contacts_advertiser ON contacts(advertiser_id, created_at);

CREATE TABLE IF NOT EXISTS reviews (
  id            INTEGER PRIMARY KEY,
  visit_id      INTEGER NOT NULL UNIQUE REFERENCES visits(id),
  advertiser_id INTEGER NOT NULL REFERENCES users(id),
  reviewer_id   INTEGER NOT NULL REFERENCES users(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text          TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE IF NOT EXISTS geocode_cache (
  query      TEXT PRIMARY KEY,
  result     TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Email in uscita. Senza provider configurato restano qui (visibili in /dashboard per lo sviluppo).
CREATE TABLE IF NOT EXISTS outbox (
  id         INTEGER PRIMARY KEY,
  to_email   TEXT NOT NULL,
  subject    TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
`;

export function openDatabase(file: string): Database.Database {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.exec(SCHEMA);
  return db;
}

export function databasePath(): string {
  return process.env.DATABASE_PATH ?? path.join(process.cwd(), ".data", "trovaimmobile.db");
}

const globalForDb = globalThis as unknown as { __trovaDb?: Database.Database };

export function db(): Database.Database {
  if (!globalForDb.__trovaDb) globalForDb.__trovaDb = openDatabase(databasePath());
  return globalForDb.__trovaDb;
}

export const nowIso = () => new Date().toISOString();
