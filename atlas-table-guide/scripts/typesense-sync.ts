/** Rebuilds the Typesense collections (one per locale) from the current dataset: npm run search:sync */
import { getDataset } from "../src/db/repository";
import { localizeDataset } from "../src/db/queries";
import { buildSearchDocs } from "../src/lib/search-docs";
import { syncCollection, typesenseConfigured } from "../src/lib/typesense";

if (!typesenseConfigured()) { console.error("Set TYPESENSE_HOST and TYPESENSE_API_KEY first."); process.exit(1); }
const raw = await getDataset();
for (const locale of ["en", "it"] as const) {
  const n = await syncCollection(locale, buildSearchDocs(localizeDataset(raw, locale), locale));
  console.log(`✓ atlas_${locale}: ${n} documents`);
}
