import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/config/brand";
import { SITE } from "@/config/site";
import { fmt, LOCALES } from "@/i18n";
import { isFallback, t, type MenuPrice } from "@/db/types";
import { pageCtx } from "../../_ctx";
import { getDataset } from "@/db/repository";
import { buildMetadata } from "@/seo/metadata";
import { buildFaqJsonLd, buildRestaurantJsonLd } from "@/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Gallery } from "@/features/restaurant/Gallery";
import { Sparkline } from "@/features/restaurant/Sparkline";
import { MiniMap } from "@/features/restaurant/MiniMap";
import { Price } from "@/features/Price";
import { FavouriteButton } from "@/features/FavouriteButton";
import { CompareToggle } from "@/features/CompareToggle";
import { MessageForm } from "@/features/forms/Forms";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { PhotoCard } from "@/components/cards/Cards";
import { RecognitionText } from "@/components/cards/Recognition";
import { DemoBadge, Notice, StatusPill } from "@/components/ui/ui";
import { ExternalIcon, PinIcon } from "@/components/ui/icons";
import { buildAlt } from "@/lib/alt";
import { combinedEstimate, menuPrice, priceBand, priceFrom, priceRangeLabel, usable } from "@/lib/price";
import { lowestEUR } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import { cardInfo } from "@/features/helpers";
import { chefOf, cityOf, countryOf, cuisineName, effectiveVerification, itinerariesFeaturing, nearby, similarRestaurants } from "@/db/queries";
import { imageSrc } from "@/components/media/SmartImage";

export const revalidate = 3600;
export const dynamicParams = false; // unknown slugs → real 404; publishing triggers revalidation/redeploy
export async function generateStaticParams() {
  const d = await getDataset();
  return LOCALES.flatMap((locale) => d.restaurants.map((r) => ({ locale, slug: r.slug })));
}

async function load(params: Promise<{ locale: string; slug: string }>) {
  const ctx = await pageCtx(params);
  const { slug } = await params;
  const r = ctx.data.restaurants.find((x) => x.slug === slug);
  if (!r) notFound();
  return { ...ctx, r };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, data, r } = await load(params);
  const city = t(cityOf(data, r.citySlug)?.name, locale);
  const country = t(countryOf(data, r.countrySlug)?.name, locale);
  const pf = priceFrom(r);
  const desc = `${r.name}, ${city} (${country}): ${t(r.style, locale)}. ${pf ? `Tasting menu from ${pf.amount} ${pf.currency}.` : ""} ${t(r.description, locale)}`.replace(/\s+/g, " ").slice(0, 158);
  return buildMetadata({ locale, path: `/restaurant/${r.slug}/`, title: `${r.name} — ${city}, ${country}`, description: desc, image: imageSrc(r.images[0]!.key).src });
}

export default async function RestaurantPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, dict, data, rates, r } = await load(params);
  const P = dict.profile;
  const L = (p: string) => `/${locale}${p}`;
  const city = cityOf(data, r.citySlug)!;
  const country = countryOf(data, r.countrySlug)!;
  const cityName = t(city.name, locale);
  const countryName = t(country.name, locale);
  const chef = chefOf(data, r.chefSlug);
  const cuisines = r.cuisines.map((c) => cuisineName(data, c, locale));
  const ver = effectiveVerification(r);
  const pf = priceFrom(r);
  const est = combinedEstimate(r);
  const band = priceBand(lowestEUR(r, rates));
  const images = r.images.map((im) => ({ key: im.key, alt: buildAlt(im, { name: r.name, city: cityName, locale }) }));
  const hotels = [...data.hotels.filter((h) => h.restaurantSlugs.includes(r.slug)), ...nearby(data.hotels, r, 40, 3)].filter((h, i, a) => a.findIndex((x) => x.slug === h.slug) === i).slice(0, 3);
  const exps = nearby(data.experiences, r, 60, 3);
  const similar = similarRestaurants(data, r, 3);
  const its = itinerariesFeaturing(data, r.slug);
  const yesNo = (b: boolean) => (b ? dict.common.yes : dict.common.no);
  const statusLabel = (s: MenuPrice["status"]) => (s === "verified" ? dict.common.verified : s === "estimated" ? dict.common.estimated : dict.common.missing);
  const lunch = menuPrice(r, "tasting", "lunch");
  const dinner = menuPrice(r, "tasting", "dinner");
  const wine = menuPrice(r, "wine_pairing");
  const recText = r.awards.length ? `, ${fmt(dict.recognition.recognisedBy, { body: r.awards[0]!.body, title: r.awards[0]!.title, year: r.awards[0]!.year })}` : r.recognition.kind === "demo" ? ` — ${fmt(dict.recognition.demo, { n: r.recognition.level })}` : "";
  const answer = fmt(P.answer, { name: r.name, style: t(r.style, locale), city: cityName, country: countryName, rec: recText, price: pf ? fmt(P.answerPrice, { price: `${pf.amount.toLocaleString(locale)} ${pf.currency}` }) : P.answerNoPrice, date: formatDate(r.lastVerifiedAt, locale) || dict.common.notVerified });
  const faq = [
    { q: fmt(P.faqQ.price, { name: r.name }), a: pf ? `${[lunch, dinner].filter((m) => m && usable(m)).map((m) => `${t(m!.name, locale)}: ${m!.amount!.toLocaleString(locale)} ${m!.currency} (${statusLabel(m!.status).toLowerCase()}, ${formatDate(m!.collectedAt, locale)})`).join("; ")}.` : P.answerNoPrice },
    { q: fmt(P.faqQ.veg, { name: r.name }), a: `${dict.directory.diet.vegetarian}: ${yesNo(r.dietary.vegetarian)} · ${dict.directory.diet.vegan}: ${yesNo(r.dietary.vegan)} · ${dict.directory.diet.glutenFree}: ${yesNo(r.dietary.glutenFree)}.` },
    { q: fmt(P.faqQ.book, { name: r.name }), a: `${dict.directory.reservation[r.reservation.method]}. ${t(r.reservation.instructions, locale)}` },
    { q: fmt(P.faqQ.dress, { name: r.name }), a: t(r.dressCode, locale) },
  ];
  const reserveHref = r.reservation.providerUrl;
  const priceCard = (title: string, m: MenuPrice | undefined | null, extra?: React.ReactNode) => (
    <div className="flex flex-col rounded-[12px] border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-2"><h3 className="font-sans text-sm font-semibold text-stone">{title}</h3>{m && <StatusPill status={m.status} label={statusLabel(m.status)} />}</div>
      {m && m.amount != null && m.status !== "missing" ? (
        <>
          <p className="mt-2 font-serif text-2xl"><Price amount={m.amount} currency={m.currency} locale={locale} /></p>
          <p className="mt-1 text-xs text-stone">{m.courses ? `${fmt(P.courses, { n: m.courses })} · ` : ""}{fmt(P.collected, { date: formatDate(m.collectedAt, locale) })}{m.sourceUrl && <> · <a href={m.sourceUrl} rel="nofollow noopener" target="_blank" className="underline">{dict.common.sourceLink}</a></>}</p>
          <Sparkline points={m.history} label={`${P.history} — ${title}`} />
        </>
      ) : (
        <p className="mt-2 text-sm text-stone">{P.noPrice}</p>
      )}
      {extra}
    </div>
  );
  const glance: [string, string][] = [
    [P.cuisine, cuisines.join(", ")], [P.style, t(r.style, locale)], [P.priceBand, band ? `${priceRangeLabel(band)} (EUR)` : dict.common.notProvided],
    [P.duration, `${Math.floor(r.durationMinutes / 60)} h ${r.durationMinutes % 60 ? `${r.durationMinutes % 60} min` : ""}`.trim()], [P.dressCode, t(r.dressCode, locale)],
    [P.dietary, [r.dietary.vegetarian && dict.directory.diet.vegetarian, r.dietary.vegan && dict.directory.diet.vegan, r.dietary.glutenFree && dict.directory.diet.glutenFree].filter(Boolean).join(", ") || dict.common.notProvided],
    [P.languages, r.languages.join(", ")], [P.atmosphere, t(r.atmosphere, locale)],
    [P.seating, [r.features.terrace && dict.directory.features.terrace, r.features.privateDining && dict.directory.features.privateDining, r.features.chefsTable && dict.directory.features.chefsTable, r.features.seaView && dict.directory.features.seaView].filter(Boolean).join(", ") || "—"],
    [P.accessibility, yesNo(r.features.accessible)], [P.parking, yesNo(r.features.parking)], [P.family, t(r.familyPolicy, locale)], [P.cancellation, t(r.cancellationPolicy, locale)],
    [P.reservations, `${dict.directory.reservation[r.reservation.method]} — ${t(r.reservation.instructions, locale)}`], [P.occasions, r.features.romantic ? dict.directory.features.romantic : "—"],
  ];
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
  const dayName = (d: string) => new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-GB", { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + DAYS.indexOf(d as (typeof DAYS)[number]))));

  return (
    <>
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ name: dict.common.home, path: L("/") }, { name: dict.nav.restaurants, path: L("/restaurants/") }, { name: countryName, path: L(`/restaurants/${country.slug}/`) }, { name: cityName, path: L(`/restaurants/${country.slug}/${city.slug}/`) }, { name: r.name, path: L(`/restaurant/${r.slug}/`) }]} />
        {r.isDemo && <div className="mt-4"><Notice tone="warning">{dict.common.demoNotice}</Notice></div>}
        <div className="mt-4"><Gallery images={images} labels={{ open: P.openGallery, photoOf: P.photoOf, close: dict.common.close, prev: dict.common.previous, next: dict.common.next, illustrative: dict.common.illustrative, gallery: P.gallery }} /></div>
      </div>

      <div className="container-page grid gap-10 pb-28 pt-8 lg:grid-cols-12 lg:pb-16">
        <article className="lg:col-span-8">
          <header>
            <div className="flex flex-wrap items-center gap-2">{r.isDemo && <DemoBadge label={dict.common.demoData} />}<StatusPill status={ver === "verified" ? "verified" : ver === "stale" ? "stale" : "pending"} label={ver === "verified" ? fmt(dict.common.lastVerified, { date: formatDate(r.lastVerifiedAt, locale) }) : ver === "stale" ? `${dict.common.stale} · ${formatDate(r.lastVerifiedAt, locale)}` : dict.common.notVerified} />{r.sourceUrl && <a href={r.sourceUrl} rel="nofollow noopener" target="_blank" className="text-xs text-stone underline">{dict.common.source}</a>}</div>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl">{r.name}</h1>
            <p className="mt-2 flex items-center gap-1 text-stone"><PinIcon size={16} /> {cityName}, {countryName} · {cuisines.join(" · ")}</p>
            <p className="mt-2 text-sm"><RecognitionText r={r} dict={dict} /></p>
            {chef && <p className="mt-1 text-sm">{P.chef}: <Link href={L(`/chefs/${chef.slug}/`)} className="font-semibold underline-offset-4 hover:underline">{chef.name}</Link></p>}
            <p className="mt-5 rounded-[10px] border border-line bg-white p-4 text-sm leading-relaxed" data-answer-first>{answer}</p>
          </header>

          <section aria-labelledby="prices" className="mt-10">
            <h2 id="prices" className="font-serif text-2xl">{P.priceDashboard}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {priceCard(P.lunch, lunch)}
              {priceCard(P.dinner, dinner)}
              {priceCard(P.wine, wine)}
              <div className="flex flex-col rounded-[12px] border border-line bg-sand p-4">
                <div className="flex items-start justify-between gap-2"><h3 className="font-sans text-sm font-semibold text-stone">{P.combined}</h3><StatusPill status={est ? "estimated" : "missing"} label={est ? dict.common.estimated : dict.common.missing} /></div>
                {est ? <p className="mt-2 font-serif text-2xl"><Price amount={est.amount} currency={est.currency} locale={locale} /> <span className="text-sm font-sans text-stone">{dict.common.perPerson}</span></p> : <p className="mt-2 text-sm text-stone">{P.noPrice}</p>}
                <p className="mt-1 text-xs text-stone">{P.combinedHelp}</p>
              </div>
            </div>
            {rates.source !== "live" && <p className="mt-2 text-xs text-stone">{rates.source === "demo-reference" ? `* ${dict.prefs.fxDemo}` : dict.prefs.fxNone}</p>}
          </section>

          <section aria-labelledby="about" className="mt-12">
            <h2 id="about" className="font-serif text-2xl">{P.about}</h2>
            <div lang={isFallback(r.description, locale) ? "en" : undefined} className="mt-3 leading-relaxed">
              <p>{t(r.description, locale)}</p>
              {isFallback(r.description, locale) && <p className="mt-2 text-xs text-stone" lang={locale}>{dict.common.translationPending}</p>}
            </div>
          </section>

          <section aria-labelledby="glance" className="mt-12">
            <h2 id="glance" className="font-serif text-2xl">{P.glance}</h2>
            <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {glance.map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-line py-2.5 text-sm"><dt className="text-stone">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
            </dl>
          </section>

          <section aria-labelledby="menus" className="mt-12">
            <h2 id="menus" className="font-serif text-2xl">{P.menuDetails}</h2>
            <ul className="mt-4 divide-y divide-line rounded-[12px] border border-line bg-white">
              {r.menus.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <div><p className="font-semibold">{t(m.name, locale)}</p><p className="text-sm text-stone">{m.service !== "any" ? (m.service === "lunch" ? P.lunch : P.dinner) : ""}{m.courses ? ` · ${fmt(P.courses, { n: m.courses })}` : ""}{m.season ? ` · ${m.season.from} → ${m.season.to}` : ""}</p></div>
                  <div className="flex items-center gap-2">{m.amount != null && m.status !== "missing" && <Price amount={m.amount} currency={m.currency} locale={locale} className="font-semibold" />}<StatusPill status={m.status} label={statusLabel(m.status)} /></div>
                </li>
              ))}
            </ul>
          </section>

          {chef && (
            <section aria-labelledby="chef" className="mt-12">
              <h2 id="chef" className="font-serif text-2xl">{P.chef}</h2>
              <p className="mt-3"><Link href={L(`/chefs/${chef.slug}/`)} className="font-semibold underline-offset-4 hover:underline">{chef.name}</Link>{chef.isDemo && <span className="text-sm text-stone"> ({dict.common.demoData})</span>}</p>
              <p className="mt-1 leading-relaxed text-stone" lang={isFallback(chef.bio, locale) ? "en" : undefined}>{t(chef.bio, locale)}</p>
            </section>
          )}

          <section aria-labelledby="loc" className="mt-12">
            <h2 id="loc" className="font-serif text-2xl">{P.location}</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <MiniMap lat={r.lat} lng={r.lng} name={r.name} styleUrl={SITE.mapStyleUrl} unavailable={dict.directory.mapUnavailable.split(".")[0] + "."} />
              <div className="text-sm">
                <p className="font-semibold">{P.address}</p>
                <address className="not-italic text-stone">{r.address.street}<br />{r.address.postalCode} {r.address.locality}<br />{countryName}</address>
                <a href={`https://www.openstreetmap.org/directions?to=${r.lat}%2C${r.lng}`} target="_blank" rel="noopener" className="mt-2 inline-flex min-h-11 items-center gap-1 font-semibold text-carmine underline-offset-4 hover:underline">{P.directions} <ExternalIcon size={14} /></a>
                <p className="mt-4 font-semibold">{P.hours}</p>
                <ul className="text-stone">
                  {DAYS.map((d) => { const slots = r.hours.filter((h) => h.days.includes(d)); return <li key={d} className="flex justify-between gap-3 border-b border-line py-1"><span className="capitalize">{dayName(d)}</span><span>{slots.length ? slots.map((s) => `${s.opens}–${s.closes}`).join(", ") : P.closed}</span></li>; })}
                </ul>
                {r.specialHours.length > 0 && <p className="mt-2 text-xs text-stone">{P.closures}: {r.specialHours.map((s) => `${formatDate(s.date, locale)}${s.note ? ` (${s.note})` : ""}`).join(", ")}</p>}
                <p className="mt-4 font-semibold">{P.contact}</p>
                <p className="text-stone">{r.phone ?? dict.common.notProvided}{r.email ? ` · ${r.email}` : ""}</p>
              </div>
            </div>
          </section>

          {hotels.length > 0 && (
            <section aria-labelledby="hotels" className="mt-12">
              <h2 id="hotels" className="font-serif text-2xl">{P.nearbyHotels}</h2>
              <ul className="mt-4 grid gap-6 sm:grid-cols-3">{hotels.map((h) => <li key={h.slug}><PhotoCard href={L(`/hotel/${h.slug}/`)} imageKey={h.images[0]!.key} alt={buildAlt(h.images[0]!, { name: h.name, city: t(cityOf(data, h.citySlug)?.name, locale), locale })} title={h.name} subtitle={t(cityOf(data, h.citySlug)?.name, locale)} sizes="(min-width:768px) 240px, 100vw" /></li>)}</ul>
            </section>
          )}
          {exps.length > 0 && (
            <section aria-labelledby="exps" className="mt-12">
              <h2 id="exps" className="font-serif text-2xl">{P.nearbyExperiences}</h2>
              <ul className="mt-4 grid gap-6 sm:grid-cols-3">{exps.map((x) => <li key={x.slug}><PhotoCard href={L(`/experience/${x.slug}/`)} imageKey={x.images[0]!.key} alt={buildAlt(x.images[0]!, { name: x.name, city: t(cityOf(data, x.citySlug)?.name, locale), locale })} title={x.name} subtitle={`${x.durationHours} h`} sizes="(min-width:768px) 240px, 100vw" /></li>)}</ul>
            </section>
          )}
          {its.length > 0 && (
            <section aria-labelledby="its" className="mt-12">
              <h2 id="its" className="font-serif text-2xl">{P.itineraries}</h2>
              <ul className="mt-3 list-disc pl-5">{its.map((i) => <li key={i.slug}><Link href={L(`/travel/${i.slug}/`)} className="underline-offset-4 hover:underline">{t(i.title, locale)}</Link></li>)}</ul>
            </section>
          )}

          <section aria-labelledby="faq" className="mt-12">
            <h2 id="faq" className="font-serif text-2xl">{P.faq}</h2>
            <dl className="mt-3 divide-y divide-line">{faq.map((q) => <div key={q.q} className="py-3"><dt className="font-semibold">{q.q}</dt><dd className="mt-1 text-stone">{q.a}</dd></div>)}</dl>
          </section>

          <section aria-labelledby="similar" className="mt-12">
            <h2 id="similar" className="font-serif text-2xl">{P.similar}</h2>
            <ul className="mt-4 grid gap-6 sm:grid-cols-3">{similar.map((s) => <li key={s.slug}><RestaurantCard r={s} locale={locale} dict={dict} {...cardInfo(data, s, locale)} /></li>)}</ul>
          </section>

          <section aria-labelledby="report" className="mt-12 rounded-[12px] border border-line bg-white p-6">
            <h2 id="report" className="font-serif text-2xl">{dict.common.reportIncorrect}</h2>
            <div className="mt-4"><MessageForm kind="correction" subjectRef={`restaurant:${r.slug}`} d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }} fields={["email", "message"]} messageLabel={dict.forms.field} /></div>
          </section>
        </article>

        {/* Sticky booking/price card (desktop) */}
        <aside className="lg:col-span-4" aria-label={dict.common.reserve}>
          <div className="sticky top-[calc(var(--header-h)+16px)] hidden rounded-[12px] border border-line bg-white p-5 shadow-card lg:block">
            {pf ? <p className="text-sm text-stone">{dict.common.from} <Price amount={pf.amount} currency={pf.currency} locale={locale} className="font-serif text-2xl text-ink" /></p> : <p className="text-sm text-stone">{P.noPrice}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5">{[lunch, dinner, wine].filter(Boolean).map((m) => <StatusPill key={m!.id} status={m!.status} label={`${t(m!.name, locale)}: ${statusLabel(m!.status)}`} />)}</div>
            <div className="mt-5 space-y-2">
              {reserveHref ? (
                <a href={reserveHref} target="_blank" rel="noopener" className="flex min-h-12 w-full items-center justify-center rounded-[8px] bg-carmine font-semibold text-white hover:bg-red-700">{dict.common.reserve}</a>
              ) : (
                <>
                  <Link href={L(`/concierge/?restaurant=${r.slug}`)} className="flex min-h-12 w-full items-center justify-center rounded-[8px] bg-carmine font-semibold text-white hover:bg-red-700">{P.requestConcierge}</Link>
                  <p className="text-xs text-stone">{P.reserveUnavailable} {P.contactVenue}</p>
                </>
              )}
              <div className="grid grid-cols-2 gap-2">
                <CompareToggle slug={r.slug} name={r.name} label={dict.common.compare} fullMsg={dict.compare.full} variant="inline" className="justify-center" />
                <FavouriteButton itemKey={`restaurant:${r.slug}`} name={r.name} variant="inline" className="justify-center" labels={{ add: dict.favourites.add, remove: dict.favourites.remove, saved: dict.common.saved, save: dict.common.save }} />
              </div>
              {r.features.giftCard && <Link href={L(`/gifts/?restaurant=${r.slug}`)} className="flex min-h-11 w-full items-center justify-center rounded-[8px] border border-carmine text-sm font-semibold text-carmine hover:bg-blush">{P.buyGift}</Link>}
              {r.website && <a href={r.website} target="_blank" rel="noopener nofollow" className="flex min-h-11 w-full items-center justify-center gap-1 text-sm font-semibold text-carmine underline-offset-4 hover:underline">{dict.common.website} <ExternalIcon size={14} /></a>}
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky bottom CTA (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 text-sm">{pf ? <><span className="text-stone">{dict.common.from} </span><Price amount={pf.amount} currency={pf.currency} locale={locale} className="font-semibold" /></> : <span className="text-stone">{P.noPrice}</span>}</div>
          <FavouriteButton itemKey={`restaurant:${r.slug}`} name={r.name} variant="overlay" className="!shadow-none border border-line" labels={{ add: dict.favourites.add, remove: dict.favourites.remove, saved: dict.common.saved, save: dict.common.save }} />
          {reserveHref
            ? <a href={reserveHref} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white">{dict.common.reserve}</a>
            : <Link href={L(`/concierge/?restaurant=${r.slug}`)} className="inline-flex min-h-11 items-center rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white">{P.requestConcierge}</Link>}
        </div>
      </div>

      <JsonLd data={buildRestaurantJsonLd(r, { locale: locale as Locale, city, country, chef, cuisineNames: cuisines, imageUrls: r.images.map((i) => imageSrc(i.key).src), eurLowest: lowestEUR(r, rates) })} />
      <JsonLd data={buildFaqJsonLd(faq)} />
    </>
  );
}
