/** Scans the client bundle (.next/static) for secrets or server-only env names. Run after `next build`. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PATTERNS = [/sk_(live|test)_[A-Za-z0-9]{8,}/, /re_[A-Za-z0-9]{16,}/, /SUPABASE_SERVICE_ROLE_KEY/, /service_role/, /LLM_API_KEY/, /RESEND_API_KEY/, /STRIPE_SECRET_KEY/, /ADMIN_DEV_TOKEN/, /TYPESENSE_API_KEY/, /IP_HASH_SALT/, /-----BEGIN (RSA |EC )?PRIVATE KEY-----/];
const hits = [];
function walk(p) {
  const st = statSync(p);
  if (st.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  if (!/\.(js|css|html|json|txt)$/.test(p)) return;
  const s = readFileSync(p, "utf8");
  for (const re of PATTERNS) if (re.test(s)) hits.push(`${p}: ${re}`);
}
try { walk(".next/static"); } catch { console.error("run `next build` first"); process.exit(2); }
for (const v of ["SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "RESEND_API_KEY", "LLM_API_KEY", "ADMIN_DEV_TOKEN"]) {
  const val = process.env[v];
  if (val && val.length > 8) { try { const all = readdirSync(".next/static", { recursive: true }).map(String); for (const f of all) { const p = join(".next/static", f); if (statSync(p).isFile() && readFileSync(p, "utf8").includes(val)) hits.push(`${p}: value of ${v}`); } } catch { /* ignore */ } }
}
if (hits.length) { console.error(`✗ possible secrets in client bundle:\n${hits.join("\n")}`); process.exit(1); }
console.log("✓ no secrets in client bundle");
