import Link from "next/link";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { SITE } from "@/config/site";
import { fmt } from "@/i18n";
import { t } from "@/db/types";
import { pageCtx } from "./_ctx";
import { buildMetadata } from "@/seo/metadata";
import { SmartImage } from "@/components/media/SmartImage";
import { PhotoCard } from "@/components/cards/Cards";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { LinkButton, SectionHeader, Divider, Notice } from "@/components/ui/ui";
import { Tabs } from "@/components/ui/Tabs";
import { HeroSearch } from "@/features/home/HeroSearch";
import { NewsletterForm } from "@/features/forms/Forms";
import { Price } from "@/features/Price";
import { buildAlt } from "@/lib/alt";
import { cardInfo } from "@/features/helpers";
import { collectionMembers, isVerified } from "@/db/queries";
import { collections } from "@/data/collections";
import { lowestEUR } from "@/lib/filters";
import { statsBy, lunchDinnerRatio, cheapestRecognised } from "@/lib/price-index";
import { formatDate } from "@/lib/format";
import { formatMoney } from "@/lib/price";
import { SelectionMark } from "@/components/Logo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/", title: fmt(dict.meta.homeTitle, { brand: BRAND.name }), description: dict.meta.homeDescription });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, dict, data, rates } = await pageCtx(params);
  const h = dict.home;
  const L = (p: string) => `/${locale}${p}`;
  const country = (slug: string) => t(data.countries.find((c) => c.slug === slug)?.name, locale);
  const featured = (level: number) => data.restaurants.filter((r) => r.recognition.level === level).sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 4);
  const budget = [50, 100, 150, 250].map((n) => {
    const c = collections.find((x) => x.slug === `tasting-menus-under-${n}`)!;
    const members = collectionMembers(data, c, rates);
    return { n, slug: c.slug, count: members.length, from: Math.min(...members.map((r) => lowestEUR(r, rates) ?? Infinity)) };
  });
  const exceptional = data.restaurants.filter((r) => r.recognition.level === 3);
  const dineStay = data.restaurants.filter((r) => r.features.rooms).slice(0, 3);
  const cityStats = statsBy(data.restaurants, { kind: "tasting", service: "dinner", groupBy: (r) => r.citySlug, label: (k) => t(data.cities.find((c) => c.slug === k)?.name, locale), minSample: SITE.priceIndexMinSample });
  const ratio = lunchDinnerRatio(data.restaurants, SITE.priceIndexMinSample);
  const cheapest = cheapestRecognised(data.restaurants, rates, 3);
  const totalVerified = data.restaurants.flatMap((r) => r.menus).filter((m) => m.status === "verified" && m.kind === "tasting").length;
  const articles = [...data.articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const [lead, ...rest] = articles;
  const tuscany = data.itineraries.find((i) => i.slug === "gastronomic-journey-tuscany") ?? data.itineraries[0];
  const others = data.itineraries.filter((i) => i !== tuscany).slice(0, 3);
  const anyDemo = data.restaurants.some((r) => r.isDemo);

  return (
    <>
      {/* 1. HERO — Carmine frame, inset rounded image, H1 BELOW the image */}
      <section className="on-dark bg-carmine pb-12 text-ivory md:pb-16" aria-labelledby="hero-title">
        <div className="mx-auto max-w-[1232px] px-4">
          <div className="relative">
            <SmartImage imageKey="hero-mediterranean" alt={buildAlt({ subject: "terrace" }, { name: "a coastal restaurant", city: "the Mediterranean", locale })} sizes="(min-width:1232px) 1200px, 100vw" priority className="aspect-[4/3] md:aspect-[21/9]" label={dict.common.illustrative} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 rounded-b-[12px] bg-gradient-to-t from-ink/25 to-transparent" />
          </div>
          <div className="mt-8 text-center">
            <h1 id="hero-title" className="font-serif text-[28px] font-semibold text-ivory md:text-[44px]">{locale === "it" ? BRAND.taglineIt : BRAND.tagline}</h1>
            <p className="mt-2 text-base text-ivory/80">{h.heroSubtitle}</p>
          </div>
          <div className="mt-6">
            <HeroSearch locale={locale} labels={{ placeholder: h.searchPlaceholder, explore: h.explore, destination: h.destination, experienceType: h.experienceType, date: h.date, guests: h.guests, any: h.anyExperience }}
              cities={data.cities.map((c) => ({ value: `${c.countrySlug}/${c.slug}`, label: t(c.name, locale) }))}
              cuisines={data.cuisines.map((c) => ({ value: c.slug, label: t(c.name, locale) }))} />
          </div>
          <ul className="scroll-snap-x mx-auto mt-5 flex max-w-[860px] gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-center" aria-label={dict.directory.filters}>
            {[[h.chips.one, "?rec=1"], [h.chips.two, "?rec=2"], [h.chips.three, "?rec=3"], [h.chips.under100, "?dinner=-100"], [h.chips.dineStay, "?feat=rooms"], [h.chips.romantic, "?feat=romantic"]].map(([label, q], i) => (
              <li key={q} className="shrink-0">
                <Link href={L(`/restaurants/${q}`)} title={i < 3 ? h.chipTooltip : undefined} className="inline-flex min-h-10 items-center rounded-full border border-ivory/90 px-4 text-sm text-ivory transition-colors hover:bg-ivory hover:text-carmine">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {anyDemo && (
        <div className="container-page pt-6"><Notice tone="info">{dict.common.demoNotice}</Notice></div>
      )}

      {/* 2. EXPLORE CULINARY DESTINATIONS */}
      <section className="section-y" aria-labelledby="dest-title">
        <div className="container-page">
          <SectionHeader eyebrow={h.destEyebrow} title={h.destTitle} id="dest-title" />
          <ul className="scroll-snap-x -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 xl:grid-cols-4">
            {data.cities.map((c, i) => {
              const verified = data.restaurants.filter((r) => r.citySlug === c.slug && isVerified(r)).length;
              return (
                <li key={c.slug} className="w-[78%] shrink-0 sm:w-[45%] md:w-auto">
                  <PhotoCard href={L(`/restaurants/${c.countrySlug}/${c.slug}/`)} imageKey={c.image.key} alt={buildAlt(c.image, { city: t(c.name, locale), locale })} ratio="3 / 4"
                    sizes="(min-width:1280px) 280px, (min-width:768px) 33vw, 78vw" title={t(c.name, locale)} priority={i < 2 && false}
                    subtitle={`${country(c.countrySlug)}${verified > 0 ? ` · ${fmt(h.restaurantsCount, { n: verified })}` : ""}`} illustrativeLabel={dict.common.illustrative} />
                </li>
              );
            })}
          </ul>
          <div className="mt-8"><Divider /></div>
          <div className="mt-3 flex justify-end"><Link href={L("/destinations/")} className="inline-flex min-h-11 items-center text-sm font-semibold text-carmine underline-offset-4 hover:underline">{h.viewAllDestinations} →</Link></div>
        </div>
      </section>

      {/* 3. EXCEPTIONAL RESTAURANTS */}
      <section className="section-y bg-sand defer-render" aria-labelledby="exc-title">
        <div className="container-page">
          <SectionHeader title={h.exceptionalTitle} sub={h.exceptionalSub} id="exc-title" action={<Link href={L("/restaurants/")} className="text-sm font-semibold text-carmine hover:underline">{dict.common.viewAll} →</Link>} />
          <Tabs label={dict.directory.f.recognition} tabs={[3, 2, 1].map((lvl) => ({
            id: `lvl-${lvl}`, label: fmt(h.level, { n: lvl }),
            panel: (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featured(lvl).map((r) => <li key={r.slug}><RestaurantCard r={r} locale={locale} dict={dict} {...cardInfo(data, r, locale)} /></li>)}
              </ul>
            ),
          }))} />
        </div>
      </section>

      {/* 4. FINE DINING FOR EVERY BUDGET */}
      <section className="section-y defer-render" aria-labelledby="budget-title">
        <div className="container-page">
          <SectionHeader title={h.budgetTitle} sub={h.budgetSub} id="budget-title" />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {budget.map((b) => (
              <li key={b.n}>
                <Link href={L(`/collections/${b.slug}/`)} className="card-lift flex h-full flex-col rounded-[12px] border border-line bg-white p-5 hover:border-carmine">
                  <span className="font-serif text-2xl text-carmine">{fmt(h.under, { n: b.n })}</span>
                  <span className="mt-2 text-sm text-stone">{fmt(h.venues, { n: b.count })}</span>
                  {Number.isFinite(b.from) && <span className="mt-1 text-sm">{fmt(h.from, { price: formatMoney(b.from, "EUR", locale) })}</span>}
                </Link>
              </li>
            ))}
            <li className="col-span-2 md:col-span-1">
              <Link href={L("/collections/three-recognition-restaurants/")} className="card-lift flex h-full flex-col rounded-[12px] bg-garnet p-5 text-ivory hover:bg-red-700">
                <span className="font-serif text-2xl">{h.exceptional}</span>
                <span className="mt-2 text-sm text-sand">{fmt(h.venues, { n: exceptional.length })}</span>
              </Link>
            </li>
          </ul>
          {rates.source !== "live" && <p className="mt-3 text-xs text-stone">{rates.source === "demo-reference" ? dict.prefs.fxDemo : dict.prefs.fxNone}</p>}
        </div>
      </section>

      {/* 5. FIND YOUR NEXT EXPERIENCE */}
      <section className="section-y pt-0 defer-render" aria-labelledby="next-title">
        <div className="container-page">
          <SectionHeader title={h.nextTitle} id="next-title" />
          <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2">
            {([["tasting", "tasting-menu", L("/collections/restaurants-with-wine-pairing/"), "dish"], ["dineStay", "dine-and-stay", L("/collections/restaurants-with-rooms/"), "hotel"], ["lastMinute", "restaurant-interior", L("/concierge/"), "interior"], ["gift", "gift-card", L("/gifts/"), "gift"]] as const).map(([k, img, href, subject]) => (
              <li key={k}>
                <PhotoCard href={href} imageKey={img} alt={buildAlt({ subject }, { name: h.cards[k][0], city: "", locale })} title={h.cards[k][0]!} subtitle={h.cards[k][1]} sizes="(min-width:768px) 560px, 100vw" illustrativeLabel={dict.common.illustrative} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. DINE & STAY split screen */}
      <section className="bg-sand defer-render" aria-labelledby="ds-title">
        <div className="container-page grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
          <SmartImage imageKey="luxury-hotel" alt={buildAlt({ subject: "hotel" }, { name: "A hotel with its own restaurant", city: "dusk", locale })} sizes="(min-width:768px) 560px, 100vw" ratio="4 / 3" label={dict.common.illustrative} />
          <div>
            <h2 id="ds-title" className="font-serif text-2xl md:text-3xl">{h.dineStayTitle}</h2>
            <p className="mt-3 text-stone">{h.dineStaySub}</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {dineStay.map((r) => (
                <li key={r.slug} className="flex items-center justify-between gap-3 py-3">
                  <Link href={L(`/restaurant/${r.slug}/`)} className="font-semibold hover:underline">{r.name}</Link>
                  <span className="text-sm text-stone">{cardInfo(data, r, locale).city}</span>
                </li>
              ))}
            </ul>
            <LinkButton href={L("/collections/restaurants-with-rooms/")} className="mt-6">{h.dineStayCta}</LinkButton>
          </div>
        </div>
      </section>

      {/* 7. TRAVEL FOR TASTE / CULINARY JOURNEYS */}
      {tuscany && (
        <section className="section-y defer-render" aria-labelledby="travel-title">
          <div className="container-page">
            <SectionHeader title={h.travelTitle} id="travel-title" action={<Link href={L("/travel/")} className="text-sm font-semibold text-carmine hover:underline">{dict.common.viewAll} →</Link>} />
            <PhotoCard href={L(`/travel/${tuscany.slug}/`)} imageKey={tuscany.image.key} alt={buildAlt(tuscany.image, { name: t(tuscany.title, locale), city: "Tuscany", locale })} ratio="16 / 7" sizes="(min-width:1232px) 1136px, 100vw" title={t(tuscany.title, locale)} subtitle={t(tuscany.summary, locale)} illustrativeLabel={dict.common.illustrative} />
            <h3 className="mt-12 mb-4 font-serif text-xl">{h.journeysTitle}</h3>
            <ul className="scroll-snap-x -mx-4 flex gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:px-0">
              {others.map((it) => (
                <li key={it.slug} className="w-[78%] shrink-0 md:w-auto">
                  <PhotoCard href={L(`/travel/${it.slug}/`)} imageKey={it.image.key} alt={buildAlt(it.image, { name: t(it.title, locale), city: t(data.cities.find((c) => c.slug === it.citySlugs[0])?.name, locale), locale })} sizes="(min-width:768px) 360px, 78vw" title={t(it.title, locale)} subtitle={t(it.summary, locale)} illustrativeLabel={dict.common.illustrative} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 8. PRICE INDEX */}
      <section className="section-y bg-sand defer-render" aria-labelledby="pi-title">
        <div className="container-page">
          <SectionHeader title={h.priceIndexTitle} sub={h.priceIndexSub} id="pi-title" action={<Link href={L("/price-index/")} className="text-sm font-semibold text-carmine hover:underline">{dict.common.viewAll} →</Link>} />
          <div className="grid gap-6 lg:grid-cols-3">
            <figure className="rounded-[12px] border border-line bg-white p-5 lg:col-span-2">
              <figcaption className="mb-4 font-semibold">{dict.profile.dinner} — {dict.directory.f.city}</figcaption>
              <table className="w-full text-sm">
                <thead className="sr-only"><tr><th scope="col">{dict.directory.f.city}</th><th scope="col">{dict.px.average}</th><th scope="col">n</th></tr></thead>
                <tbody>
                  {cityStats.slice(0, 6).map((s) => (
                    <tr key={`${s.key}-${s.currency}`} className="border-b border-line last:border-0">
                      <th scope="row" className="py-2 pr-3 text-left font-medium">{s.label}</th>
                      <td className="py-2">{s.suppressed ? <span className="text-stone">{dict.px.notEnough}</span> : formatMoney(s.avg!, s.currency, locale)}</td>
                      <td className="py-2 text-right text-stone">n = {s.n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-stone">{dict.px.verifiedOnly} · n ≥ {SITE.priceIndexMinSample} · {formatDate(cityStats[0]?.collectedAt ?? undefined, locale)} · <Link href={L("/methodology/")} className="underline">{dict.footer.methodology}</Link></p>
            </figure>
            <div className="space-y-4">
              <div className="rounded-[12px] border border-line bg-white p-5">
                <p className="text-sm text-stone">{dict.px.lunchDinnerShort}</p>
                <p className="font-serif text-3xl text-carmine">{ratio.suppressed ? "—" : `${Math.round(ratio.ratio! * 100)}%`}</p>
                <p className="text-xs text-stone">{ratio.suppressed ? dict.px.notEnough : `n = ${ratio.n} · ${formatDate(ratio.collectedAt ?? undefined, locale)}`}</p>
              </div>
              <div className="rounded-[12px] border border-line bg-white p-5">
                <p className="mb-2 text-sm text-stone">{dict.px.accessibleShort}</p>
                <ol className="space-y-1 text-sm">
                  {cheapest.map((c) => <li key={c.r.slug} className="flex justify-between gap-2"><Link href={L(`/restaurant/${c.r.slug}/`)} className="hover:underline">{c.r.name}</Link><Price amount={c.amount} currency={c.currency} locale={locale} /></li>)}
                </ol>
                <p className="mt-2 text-xs text-stone">{fmt(dict.px.verifiedMenus, { n: totalVerified })}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. MAGAZINE */}
      {lead && (
        <section className="section-y defer-render" aria-labelledby="mag-title">
          <div className="container-page">
            <SectionHeader title={h.magazineTitle} sub={h.magazineSub} id="mag-title" action={<Link href={L("/magazine/")} className="text-sm font-semibold text-carmine hover:underline">{dict.common.viewAll} →</Link>} />
            <div className="grid gap-8 lg:grid-cols-2">
              <PhotoCard href={L(`/magazine/${lead.slug}/`)} imageKey={lead.image.key} alt={buildAlt({ subject: "dish" }, { name: t(lead.title, locale), city: "", locale })} title={t(lead.title, locale)} subtitle={t(lead.excerpt, locale)} sizes="(min-width:1024px) 560px, 100vw" illustrativeLabel={dict.common.illustrative} />
              <ul className="grid grid-cols-2 gap-6">
                {rest.slice(0, 4).map((a) => (
                  <li key={a.slug}><PhotoCard href={L(`/magazine/${a.slug}/`)} imageKey={a.image.key} alt={buildAlt({ subject: "dish" }, { name: t(a.title, locale), city: "", locale })} title={t(a.title, locale)} subtitle={a.sponsored ? dict.common.sponsored : a.category.replace(/-/g, " ")} sizes="(min-width:1024px) 270px, 45vw" /></li>
                ))}
              </ul>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {[...new Set(data.articles.map((a) => a.category))].map((c) => <li key={c}><Link href={L(`/magazine/${c}/`)} className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3 text-sm capitalize hover:border-carmine">{c.replace(/-/g, " ")}</Link></li>)}
            </ul>
          </div>
        </section>
      )}

      {/* 10. CLUB */}
      <section className="on-dark bg-garnet text-ivory defer-render" aria-labelledby="club-title">
        <div className="container-page grid gap-8 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow !text-gold">{BRAND.shortName}</p>
            <h2 id="club-title" className="mt-2 font-serif text-3xl">{h.clubTitle}</h2>
            <p className="mt-2 text-sand">{h.clubSub}</p>
            <LinkButton href={L("/club/")} variant="ghostLight" className="mt-6">{h.clubCta}</LinkButton>
          </div>
          <ul className="space-y-3">
            {h.clubBenefits.map((b) => <li key={b} className="flex gap-3"><SelectionMark size={18} className="mt-0.5 shrink-0 text-gold" /><span>{b}</span></li>)}
          </ul>
        </div>
      </section>

      {/* 11. NEWSLETTER */}
      <section className="section-y defer-render" aria-labelledby="nl-title">
        <div className="container-page max-w-3xl">
          <SectionHeader title={h.newsletterTitle} sub={h.newsletterSub} id="nl-title" />
          <NewsletterForm locale={locale} d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }} entity={BRAND.legalEntity} privacyHref={L("/legal/privacy/")} cities={data.cities.map((c) => ({ slug: c.slug, name: t(c.name, locale) }))} />
        </div>
      </section>
    </>
  );
}
