/* Pushes the bundled seed data to Supabase. Usage: npm run db:seed  (needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) */
import { seed } from "../src/data/seed";
import { sbUpsert } from "../src/lib/store/supabase";
import { COLLECTION_NAMES } from "../src/lib/types";

// Insert parents before children to satisfy foreign keys.
const ORDER = ["movies", "actors", "brands", "merchants", "characters", "models", "appearances", "evidence", "alternatives", "articles", "keywords", "offers", "revenue", "redirects", "photos", "messages", "clicks", "views"] as const;

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Imposta SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  if (ORDER.length !== COLLECTION_NAMES.length) throw new Error("ORDER non copre tutte le collezioni");
  for (const name of ORDER) {
    const rows = seed[name] as never[];
    for (const r of rows) await sbUpsert(name, r);
    console.log(`${name}: ${rows.length}`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
