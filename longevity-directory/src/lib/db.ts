import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Persistenza reale del prototipo: SQLite su file, zero configurazione,
 * zero servizi esterni. Non è la scelta per un sito in produzione ad alto
 * traffico (nessuna replica, un solo processo scrivente), ma è un database
 * vero — le richieste, gli account e le registrazioni sopravvivono al
 * riavvio del server, a differenza di uno stato in memoria.
 *
 * Per passare a Postgres/Supabase in produzione: lo schema qui sotto è
 * volutamente semplice (nessuna feature specifica di SQLite oltre
 * l'autoincrement) e si porta 1:1 con `CREATE TABLE` equivalenti.
 */

const DB_PATH = process.env.DATABASE_PATH || "./data/app.db";

if (!existsSync(dirname(DB_PATH))) {
  mkdirSync(dirname(DB_PATH), { recursive: true });
}

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS business_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nome_struttura TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES business_users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES business_users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    piva TEXT NOT NULL,
    facility_type TEXT NOT NULL,
    categorie TEXT NOT NULL,           -- JSON array di slug categoria
    indirizzo TEXT NOT NULL,
    citta TEXT NOT NULL,
    direttore_sanitario TEXT NOT NULL,
    numero_albo TEXT NOT NULL,
    telefono TEXT,
    stato TEXT NOT NULL DEFAULT 'in_attesa', -- in_attesa | approvata | rifiutata
    piano TEXT NOT NULL DEFAULT 'free',       -- free | verificato | premium | esclusiva
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    centro_slug TEXT NOT NULL,
    centro_nome TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    messaggio TEXT,
    letto INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    motivo TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    messaggio TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_centro ON leads(centro_slug);
  CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
`);

export interface BusinessUser {
  id: number;
  email: string;
  password_hash: string;
  nome_struttura: string;
  created_at: string;
}

export interface Submission {
  id: number;
  user_id: number;
  nome: string;
  piva: string;
  facility_type: string;
  categorie: string;
  indirizzo: string;
  citta: string;
  direttore_sanitario: string;
  numero_albo: string;
  telefono: string | null;
  stato: "in_attesa" | "approvata" | "rifiutata";
  piano: string;
  created_at: string;
}

export interface Lead {
  id: number;
  centro_slug: string;
  centro_nome: string;
  nome: string;
  email: string;
  telefono: string | null;
  messaggio: string | null;
  letto: number;
  created_at: string;
}
