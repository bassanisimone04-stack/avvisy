/**
 * Replace the generated illustrations with REAL photographs.
 *
 *   npm run photos -- ./my-photos            (folder of .jpg/.png/.webp named after the image keys)
 *
 * File name (without extension) = image key, e.g. hero-mediterranean.jpg, destination-paris.jpg,
 * dish-3.jpg, interior-5.jpg, tuscany-travel.jpg … (see docs/PHOTOS.md for the full list and crops).
 * Optional ./my-photos/credits.json:  { "hero-mediterranean": { "licence": "CC BY 4.0", "author": "…", "source": "https://…" } }
 * Without credits the licence is recorded as "owner-supplied" — only use photos you have the right to publish.
 * Each photo is cropped to the slot's aspect ratio, converted to WebP, given a blur placeholder, and its
 * manifest entry is flipped to illustrative:false (the "Illustrative image" label disappears).
 */
import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const dir = process.argv[2];
if (!dir || !existsSync(dir)) { console.error("usage: npm run photos -- <folder>"); process.exit(1); }
const MANIFEST = new URL("../src/data/generated/image-manifest.json", import.meta.url);
const OUT = new URL("../public/images/generated/", import.meta.url);
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const credits = existsSync(join(dir, "credits.json")) ? JSON.parse(readFileSync(join(dir, "credits.json"), "utf8")) : {};

// slot sizes (w×h) per key family
const slot = (key) => key === "hero-mediterranean" ? [2100, 900] : key.startsWith("destination-") ? [900, 1200] : key === "tuscany-travel" ? [1600, 900] : key === "restaurant-interior" ? [1600, 900] : [1200, 900];

let n = 0;
for (const f of readdirSync(dir)) {
  const ext = extname(f).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) continue;
  const key = basename(f, ext);
  if (!manifest[key]) { console.warn(`skip ${f}: "${key}" is not an image key`); continue; }
  const [w, h] = slot(key);
  const img = sharp(join(dir, f)).rotate().resize(w, h, { fit: "cover", position: "attention" });
  await img.clone().webp({ quality: 82, effort: 5 }).toFile(new URL(`${key}.webp`, OUT).pathname);
  const tiny = await img.clone().resize(16).webp({ quality: 40 }).toBuffer();
  const c = credits[key] ?? {};
  manifest[key] = { src: `/images/generated/${key}.webp`, width: w, height: h, blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`, illustrative: false, licence: c.licence ?? "owner-supplied", author: c.author, source: c.source };
  console.log(`✓ ${key}`);
  n++;
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
console.log(`${n} photo(s) imported. Rebuild to see them.`);
