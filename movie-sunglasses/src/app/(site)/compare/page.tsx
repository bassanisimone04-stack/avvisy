import Link from "next/link";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { COMPARE_LIMIT, compareRows, parseCompareIds } from "@/lib/compare";
import { one, type Params } from "@/lib/filter";
import { buildMetadata } from "@/lib/seo";
import { GlassesArt } from "@/components/glasses";
import { Breadcrumbs, Container, MatchBadge, PageHeader } from "@/components/ui";
import { CompareFromStorage } from "./from-storage";

export const metadata: Metadata = buildMetadata({ title: "Compare Movie Sunglasses", description: "Compare up to three movie sunglasses side by side: evidence grade, films, shape, colours, price band and alternatives.", path: "/compare", noindex: true });

export default async function ComparePage({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const c = await getCatalog();
  const ids = parseCompareIds(c, one(p.ids), one(p.add));
  const models = ids.map((i) => c.modelById.get(i)!);
  const rows = compareRows(c, models);
  const options = [...c.models].filter((m) => !ids.includes(m.id)).sort((a, b) => a.name.localeCompare(b.name));
  const without = (id: string) => `/compare?ids=${ids.filter((x) => x !== id).join(",")}`;
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "Compare" }]} />
      <PageHeader eyebrow="Side by side" title="Compare sunglasses" intro={`Pick up to ${COMPARE_LIMIT} models. Rows that differ are highlighted. Evidence grades follow the same rules as everywhere on the site.`} />
      {models.length === 0 ? (
        <CompareFromStorage />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[640px] table-fixed text-left text-sm">
              <caption className="sr-only">Comparison of {models.map((m) => m.name).join(", ")}</caption>
              <thead>
                <tr className="border-b border-line align-top">
                  <th scope="col" className="w-36 p-4"><span className="sr-only">Attribute</span></th>
                  {models.map((m) => (
                    <th key={m.id} scope="col" className="p-4 font-normal">
                      <div className="rounded-xl bg-gradient-to-b from-paper to-[#efece4] p-3"><GlassesArt shape={m.shape} frame={m.frameColor} lens={m.lensColor} className="mx-auto w-full max-w-[220px]" /></div>
                      <Link href={`/sunglasses/${m.slug}`} className="mt-3 block font-display text-2xl font-semibold leading-tight hover:underline">{m.name}</Link>
                      <div className="mt-2"><MatchBadge type={c.modelMatch(m.id)} /></div>
                      <Link href={without(m.id)} className="mt-2 inline-block text-xs text-slate underline">Remove</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className={`border-b border-line/70 last:border-0 ${r.differs ? "bg-champagne-light/30" : ""}`}>
                    <th scope="row" className="p-4 text-xs font-medium uppercase tracking-widest text-mist"><div className="flex flex-wrap items-center gap-x-2 gap-y-1">{r.label}{r.differs && models.length > 1 && <span className="rounded bg-champagne-light px-1.5 py-0.5 text-[0.6rem] text-champagne-text">differs</span>}</div></th>
                    {r.values.map((v, i) => <td key={i} className="p-4 align-top">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {models.length < COMPARE_LIMIT && (
            <form action="/compare" method="get" className="mt-6 flex flex-wrap items-end gap-3">
              <input type="hidden" name="ids" value={ids.join(",")} />
              <div><label htmlFor="add" className="mb-1 block text-xs font-medium uppercase tracking-widest text-mist">Add a model</label>
                <select id="add" name="add" className="rounded-lg border border-line bg-white px-3 py-2 text-sm">{options.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
              <button className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white hover:bg-champagne-text">Add</button>
            </form>
          )}
        </>
      )}
    </Container>
  );
}
