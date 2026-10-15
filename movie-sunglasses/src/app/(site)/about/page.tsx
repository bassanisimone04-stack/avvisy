import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { MATCH_HELP, MATCH_LABEL } from "@/lib/site";
import { Breadcrumbs, Container, MatchBadge } from "@/components/ui";
import type { MatchType } from "@/lib/types";

export const metadata = buildMetadata({ title: "About & Methodology: How We Identify Movie Sunglasses", description: "Our evidence rules for labelling movie sunglasses, how we handle disputed sources, and how we make money.", path: "/about" });

export default function About() {
  return (
    <Container className="pt-10">
      <Breadcrumbs items={[{ name: "About" }]} />
      <article className="mx-auto max-w-3xl">
        <p className="eyebrow mb-3">About</p>
        <h1 className="font-display text-5xl font-semibold leading-[0.95] sm:text-6xl">Identification you can check</h1>
        <div className="prose-article mt-8">
          <p>Screenshade is a directory of the sunglasses worn on screen. Most sites say “these are the glasses” and move on. We show who says so, when we checked, and who disagrees.</p>
          <h2>How labels are assigned</h2>
          <p>Editors propose a label; the site then enforces our rule automatically. A pair keeps <strong>Exact Match</strong> or <strong>Official Reissue</strong> only if no recorded source disputes it and it is backed by at least one primary, brand, press or reference source — or by two independent websites. Otherwise it is shown as <strong>Unconfirmed</strong>, with the reason.</p>
        </div>
        <dl className="my-8 space-y-5">{(Object.keys(MATCH_LABEL) as MatchType[]).map((t) => <div key={t}><dt><MatchBadge type={t} /></dt><dd className="mt-2 text-slate">{MATCH_HELP[t]}</dd></div>)}</dl>
        <div className="prose-article">
          <h2>Prices</h2>
          <p>We never invent prices. Until a store feed is connected, product pages show plain search links with no price. Price bands (“Under $50”) are editorial estimates and are labelled as such.</p>
          <h2>Images</h2>
          <p>We use no film stills. Illustrations are generated from each model’s recorded shape and colours. Authorised photographs, with credit and licence, are added only when we hold the rights.</p>
          <h2>How we make money</h2>
          <p>Affiliate commissions when you buy from a linked store. See the <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>. Commission never changes a label.</p>
          <h2>Corrections</h2>
          <p>Think we got one wrong? <Link href="/contact">Tell us</Link> and include a source.</p>
        </div>
      </article>
    </Container>
  );
}
