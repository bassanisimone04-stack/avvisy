import type { Catalog } from "@/lib/catalog";
import { filterModels, paramsToStrings, type Params } from "@/lib/filter";
import type { SunglassesModel } from "@/lib/types";
import { Grid, ModelCard } from "./cards";
import { Pagination } from "./ui";

export function ModelResults({ c, p, basePath, base }: { c: Catalog; p: Params; basePath: string; base?: SunglassesModel[] }) {
  const r = filterModels(c, p, base);
  return (
    <div id="results" className="mt-8 transition-opacity">
      <p className="mb-4 text-sm text-slate" aria-live="polite">{r.total} {r.total === 1 ? "result" : "results"}</p>
      {r.items.length ? <Grid>{r.items.map((m) => <ModelCard key={m.id} c={c} m={m} as="h2" />)}</Grid> : <p className="rounded-2xl border border-dashed border-line p-10 text-center text-slate">No sunglasses match these filters. Try removing one.</p>}
      <Pagination page={r.page} pages={r.pages} basePath={basePath} params={paramsToStrings(p)} />
    </div>
  );
}
