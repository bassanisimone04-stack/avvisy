import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { TOKENS, CONTRAST_PAIRS } from "@/config/tokens";
import { contrast } from "@/lib/contrast";
import { Button, LinkButton, Chip, StatusPill, Notice, EmptyState, Skeleton, DemoBadge } from "@/components/ui/ui";
import { Tabs } from "@/components/ui/Tabs";
import { Logo, SelectionMark } from "@/components/Logo";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { cardInfo } from "@/features/helpers";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await pageCtx(params);
  return buildMetadata({ locale, path: "/design-system/", title: "Design system", description: "Tokens and components of the Red Editorial design system.", noindex: true });
}
export default async function DesignSystem({ params }: P) {
  const { locale, dict, data } = await pageCtx(params);
  const r = data.restaurants[0];
  const input = "min-h-11 w-full rounded-[8px] border border-line bg-white px-3";
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: "Design system", path: `/${locale}/design-system/` }]} title="Design system — Red Editorial" lead="Tokens, components and states. Contrast ratios are computed live and enforced by a unit test.">
      <section aria-labelledby="ds-logo" className="mb-12"><h2 id="ds-logo" className="font-serif text-2xl">Logo & mark</h2>
        <div className="mt-4 flex flex-wrap items-center gap-6"><div className="rounded-[12px] bg-carmine p-5"><Logo variant="light" /></div><div className="rounded-[12px] bg-ivory p-5 border border-line"><Logo variant="dark" /></div><div className="rounded-[12px] border border-line bg-white p-5 text-carmine"><SelectionMark size={40} title="Selection mark" /></div></div>
      </section>
      <section aria-labelledby="ds-tokens" className="mb-12"><h2 id="ds-tokens" className="font-serif text-2xl">Colour tokens</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{Object.entries(TOKENS).map(([k, v]) => <li key={k} className="rounded-[10px] border border-line bg-white p-2 text-xs"><span className="block h-12 rounded-[6px] border border-line" style={{ background: v }} /><span className="mt-1 block font-semibold">{k}</span><span className="text-stone">{v}</span></li>)}</ul>
        <table className="mt-6 w-full max-w-2xl text-sm"><caption className="mb-2 text-left font-semibold">Contrast pairs (WCAG 2.2)</caption><thead><tr className="text-left text-stone"><th scope="col">Text</th><th scope="col">Background</th><th scope="col">Ratio</th><th scope="col">Required</th></tr></thead>
          <tbody>{CONTRAST_PAIRS.map(([fg, bg, min]) => { const c = contrast(TOKENS[fg], TOKENS[bg]); return <tr key={fg + bg} className="border-t border-line"><td><span className="rounded px-2 py-0.5" style={{ color: TOKENS[fg], background: TOKENS[bg] }}>{fg}</span></td><td>{bg}</td><td className="tabular-nums">{c.toFixed(2)}:1</td><td>{min}:1 {c >= min ? "✓" : "✗"}</td></tr>; })}</tbody></table>
      </section>
      <section aria-labelledby="ds-type" className="mb-12"><h2 id="ds-type" className="font-serif text-2xl">Typography</h2>
        <div className="mt-4 space-y-2">{[64, 48, 36, 28, 22].map((s) => <p key={s} className="font-serif" style={{ fontSize: s }}>Playfair {s}px</p>)}{[18, 16, 14, 12].map((s) => <p key={s} style={{ fontSize: s }}>Inter {s}px — The quick brown fox.</p>)}</div>
      </section>
      <section aria-labelledby="ds-buttons" className="mb-12"><h2 id="ds-buttons" className="font-serif text-2xl">Buttons, chips, pills</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3"><Button>Primary</Button><Button variant="secondary">Secondary</Button><LinkButton href={`/${locale}/`} variant="tertiary">Tertiary link</LinkButton><Button disabled>Disabled</Button></div>
        <div className="mt-4 flex flex-wrap gap-2"><Chip href={`/${locale}/restaurants/`}>Chip</Chip><Chip href={`/${locale}/restaurants/`} active>Selected chip</Chip><StatusPill status="verified" label="Verified" /><StatusPill status="estimated" label="Estimated" /><StatusPill status="missing" label="Missing" /><DemoBadge label="Demo data" /></div>
      </section>
      <section aria-labelledby="ds-forms" className="mb-12 max-w-md"><h2 id="ds-forms" className="font-serif text-2xl">Forms</h2>
        <div className="mt-4 space-y-3"><div><label htmlFor="ds-i" className="mb-1 block text-sm font-semibold">Label</label><input id="ds-i" className={input} placeholder="Placeholder" /></div><div><label htmlFor="ds-e" className="mb-1 block text-sm font-semibold">With error</label><input id="ds-e" className={input} aria-invalid aria-describedby="ds-e-msg" /><p id="ds-e-msg" className="mt-1 text-sm text-carmine">Enter a valid email address.</p></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[var(--red-600)]" /> Checkbox</label></div>
      </section>
      <section aria-labelledby="ds-tabs" className="mb-12"><h2 id="ds-tabs" className="font-serif text-2xl">Tabs</h2><div className="mt-4"><Tabs label="Example" tabs={[{ id: "a", label: "First", panel: <p>First panel</p> }, { id: "b", label: "Second", panel: <p>Second panel</p> }]} /></div></section>
      <section aria-labelledby="ds-cards" className="mb-12"><h2 id="ds-cards" className="font-serif text-2xl">Cards</h2>{r && <div className="mt-4 max-w-xs"><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} /></div>}</section>
      <section aria-labelledby="ds-table" className="mb-12"><h2 id="ds-table" className="font-serif text-2xl">Table</h2><table className="mt-4 w-full max-w-lg text-sm"><thead><tr className="border-b border-line text-left"><th scope="col" className="py-2">City</th><th scope="col">Average</th><th scope="col" className="text-right">n</th></tr></thead><tbody><tr className="border-b border-line"><th scope="row" className="py-2 text-left font-medium">Example</th><td>€120</td><td className="text-right">7</td></tr></tbody></table></section>
      <section aria-labelledby="ds-states" className="mb-12"><h2 id="ds-states" className="font-serif text-2xl">Toasts, notices & states</h2>
        <div className="mt-4 space-y-3"><div className="inline-block rounded-[10px] bg-ink px-4 py-2 text-sm text-white">Toast — saved to favourites</div><Notice tone="info">Info notice</Notice><Notice tone="success">Success notice</Notice><Notice tone="warning">Warning notice</Notice><Notice tone="error">Error notice</Notice>
          <EmptyState title="Empty state" body="Nothing matches these filters." /><div className="flex gap-3"><Skeleton className="h-24 w-32" /><Skeleton className="h-24 w-32" /></div></div>
      </section>
    </PageShell>
  );
}
