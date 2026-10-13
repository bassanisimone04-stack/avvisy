import { createClient, type InValue } from "@libsql/client";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Persistenza reale, compatibile sia con sviluppo locale su file sia con
 * ambienti serverless (Vercel): libSQL è lo stesso dialetto SQL di SQLite,
 * ma il client parla via rete quando serve — niente file locale da tenere
 * vivo tra un'invocazione e l'altra di una funzione serverless, dove il
 * filesystem è effimero e non condiviso tra istanze.
 *
 * - In produzione: imposta TURSO_DATABASE_URL (e TURSO_AUTH_TOKEN) — un
 *   database Turso gratuito (https://turso.tech) è compatibile 1:1 con
 *   questo schema, zero modifiche alle query.
 * - In locale, senza quelle variabili: punta a un file SQLite su disco
 *   (invariato rispetto a prima), zero configurazione, zero account.
 *
 * Prima di questa migrazione il progetto usava better-sqlite3 (sincrono,
 * solo file locale) — funzionava perfettamente ma non è utilizzabile su
 * un adapter serverless come Vercel. Lo schema qui sotto è identico;
 * cambia solo il client, e le funzioni che lo usano sono ora asincrone
 * (vedi lib/auth.ts e le Actions).
 */

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

const LOCAL_PATH = process.env.DATABASE_PATH || "./data/app.db";
if (!TURSO_URL && !existsSync(dirname(LOCAL_PATH))) {
  mkdirSync(dirname(LOCAL_PATH), { recursive: true });
}

export const db = TURSO_URL
  ? createClient({ url: TURSO_URL, authToken: TURSO_TOKEN })
  : createClient({ url: `file:${LOCAL_PATH}` });

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS business_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nome_struttura TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES business_users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES business_users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    piva TEXT NOT NULL,
    facility_type TEXT NOT NULL,
    categorie TEXT NOT NULL,
    indirizzo TEXT NOT NULL,
    citta TEXT NOT NULL,
    direttore_sanitario TEXT NOT NULL,
    numero_albo TEXT NOT NULL,
    telefono TEXT,
    stato TEXT NOT NULL DEFAULT 'in_attesa',
    piano TEXT NOT NULL DEFAULT 'free',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    centro_slug TEXT NOT NULL,
    centro_nome TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    messaggio TEXT,
    letto INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    motivo TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    messaggio TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_leads_centro ON leads(centro_slug)`,
  `CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id)`,
];

// Lo schema va creato una sola volta per processo, ma ogni gestore di
// richiesta lo aspetta (await ensureSchema()) prima di interrogare il
// database: su un cold start serverless è la prima cosa che gira.
let ready: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = db.batch(SCHEMA_STATEMENTS, "write").then(() => undefined);
  }
  return ready;
}

/** INSERT/UPDATE/DELETE — restituisce numero di righe modificate e ultimo id inserito. */
export async function run(sql: string, args: InValue[] = []): Promise<{ lastInsertRowid: bigint | undefined; rowsAffected: number }> {
  await ensureSchema();
  const res = await db.execute({ sql, args });
  return { lastInsertRowid: res.lastInsertRowid, rowsAffected: res.rowsAffected };
}

/** SELECT che restituisce al più una riga. */
export async function get<T>(sql: string, args: InValue[] = []): Promise<T | undefined> {
  await ensureSchema();
  const res = await db.execute({ sql, args });
  return (res.rows[0] as unknown as T) ?? undefined;
}

/** SELECT che restituisce più righe. */
export async function all<T>(sql: string, args: InValue[] = []): Promise<T[]> {
  await ensureSchema();
  const res = await db.execute({ sql, args });
  return res.rows as unknown as T[];
}

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
