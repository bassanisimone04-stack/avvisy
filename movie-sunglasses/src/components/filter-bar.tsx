import Link from "next/link";
import type { Catalog } from "@/lib/catalog";
import { MATCH_LABEL, PRICE_BAND_LABEL } from "@/lib/site";
import { colorGroup, one, type Params } from "@/lib/filter";
import { LiveForm } from "./live-form";

function Select({ name, label, value, options }: { name: string; label: string; value?: string; options: [string, string][] }) {
  return (
    <div>
      <label htmlFor={`f-${name}`} className="mb-1 block text-xs font-medium uppercase tracking-widest text-mist">{label}</label>
      <select id={`f-${name}`} name={name} defaultValue={value ?? ""} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm">
        <option value="">All</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}

/** Pure HTML GET form: filters are shareable URLs and work without JavaScript. */
export function SunglassesFilters({ c, p, action = "/sunglasses", only }: { c: Catalog; p: Params; action?: string; only?: string[] }) {
  const show = (k: string) => !only || only.includes(k);
  const shapes = [...new Set(c.models.map((m) => m.shape))].sort();
  const colors = [...new Set(c.models.map((m) => colorGroup(m.frameColor)))].sort();
  const active = ["q", "movie", "actor", "brand", "shape", "color", "status", "match", "budget", "kind"].some((k) => one(p[k]));
  return (
    <LiveForm action={action} label="Filter sunglasses" className="rounded-2xl border border-line bg-white p-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {show("q") && <div className="col-span-2">
          <label htmlFor="f-q" className="mb-1 block text-xs font-medium uppercase tracking-widest text-mist">Search</label>
          <input id="f-q" name="q" type="search" defaultValue={one(p.q)} placeholder="Model, brand, film, actor…" className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm" />
        </div>}
        {show("movie") && <Select name="movie" label="Movie" value={one(p.movie)} options={c.movies.filter((m) => c.modelsForMovie(m.id).length).sort((a, b) => a.title.localeCompare(b.title)).map((m) => [m.id, m.title])} />}
        {show("actor") && <Select name="actor" label="Actor" value={one(p.actor)} options={c.actors.filter((a) => c.modelsForActor(a.id).length).sort((a, b) => a.name.localeCompare(b.name)).map((a) => [a.id, a.name])} />}
        {show("brand") && <Select name="brand" label="Brand" value={one(p.brand)} options={c.brands.filter((b) => c.modelsForBrand(b.id).length).sort((a, b) => a.name.localeCompare(b.name)).map((b) => [b.id, b.name])} />}
        {show("shape") && <Select name="shape" label="Shape" value={one(p.shape)} options={shapes.map((s) => [s, s[0].toUpperCase() + s.slice(1)])} />}
        {show("color") && <Select name="color" label="Frame colour" value={one(p.color)} options={colors.map((s) => [s, s[0].toUpperCase() + s.slice(1)])} />}
        {show("budget") && <Select name="budget" label="Price band" value={one(p.budget)} options={Object.entries(PRICE_BAND_LABEL)} />}
        {show("match") && <Select name="match" label="Evidence" value={one(p.match)} options={Object.entries(MATCH_LABEL)} />}
        {show("status") && <Select name="status" label="Status" value={one(p.status)} options={[["in_production", "In production"], ["vintage", "Vintage"], ["discontinued", "Discontinued"], ["unknown", "Unverified"]]} />}
        {show("kind") && <Select name="kind" label="Type" value={one(p.kind)} options={[["screen", "Seen on screen"], ["alternative", "Alternatives"]]} />}
        <Select name="sort" label="Sort by" value={one(p.sort)} options={[["featured", "Best evidence"], ["name", "Name A–Z"], ["year", "Newest film"], ["price", "Lowest price"]]} />
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button type="submit" className="js-hide rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-champagne-text">Apply filters</button>
        {active && <Link href={action} className="text-sm text-slate underline">Reset</Link>}
      </div>
    </LiveForm>
  );
}
