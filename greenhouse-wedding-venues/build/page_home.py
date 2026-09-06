# -*- coding: utf-8 -*-
"""Homepage. Every number on it is computed from data/venues.json."""
from chrome import head, header, footer, ld, BASE, NAME, STATE_NAV
from cards import cards, stats, TYPE_LABEL, unconfirmed_notice
from shared import faq_ld, faq_section, section_heading
import faqs

TITLE = "Greenhouse Wedding Venues | Glasshouse &amp; Conservatory Directory"
DESC = ("A directory of greenhouse, glasshouse and conservatory wedding venues in the US and Italy. "
        "Every listing links to the venue's own events page — including botanical garden wedding "
        "venues and rain-proof, fully enclosed rooms.")


def build(venues):
    st = stats(venues)
    preview = venues[:6]

    website = {
        "@context": "https://schema.org", "@type": "WebSite", "@id": f"{BASE}/#website",
        "url": f"{BASE}/", "name": NAME,
        "description": "Directory of greenhouse, glasshouse and conservatory wedding venues.",
        "inLanguage": "en-US",
        "publisher": {"@id": f"{BASE}/#organization"},
        "potentialAction": {
            "@type": "SearchAction",
            "target": {"@type": "EntryPoint", "urlTemplate": f"{BASE}/venues/?q={{search_term_string}}"},
            "query-input": "required name=search_term_string",
        },
    }
    organization = {
        "@context": "https://schema.org", "@type": "Organization", "@id": f"{BASE}/#organization",
        "name": NAME, "url": f"{BASE}/",
        "logo": {"@type": "ImageObject", "url": f"{BASE}/assets/img/brand/favicon.svg"},
        "description": ("Editorial directory of greenhouse and conservatory wedding venues, "
                        "compiled from venues' own websites."),
        "publishingPrinciples": f"{BASE}/methodology/",
    }

    extra = (ld(website, "Schema: WebSite + sitelinks search box")
             + ld(organization, "Schema: Organization")
             + ld(faq_ld(faqs.HOME), "Schema: FAQPage — mirrors the visible FAQ section verbatim"))

    # --- state cards, counted from the data ---------------------------------
    state_cards = []
    for s in STATE_NAV:
        n = sum(1 for v in venues if v["state_slug"] == s["slug"])
        label = f"{n} listing" if n == 1 else f"{n} listings"
        state_cards.append(f"""        <a href="/venues/{s['slug']}/" class="card-interactive group relative overflow-hidden">
          <div class="relative aspect-[5/3] overflow-hidden bg-botanical-900">
            <img src="/assets/img/patterns/pattern-0{(STATE_NAV.index(s) % 6) + 1}.svg" alt="" aria-hidden="true"
                 width="800" height="600" loading="lazy" decoding="async"
                 class="size-full object-cover opacity-90 transition-transform duration-700 ease-editorial group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-botanical-950/85 via-botanical-950/25 to-transparent"></div>
            <div class="absolute inset-x-0 bottom-0 p-5">
              <h3 class="text-xl text-white">{s['name']}</h3>
              <p class="mt-0.5 text-xs font-semibold uppercase tracking-wider text-champagne-400">{label}</p>
            </div>
          </div>
        </a>""")
    state_cards = "\n".join(state_cards)

    # --- type chips, only for types actually present -------------------------
    present_types = []
    for v in venues:
        if v["type"] not in present_types:
            present_types.append(v["type"])
    type_chips = "".join(
        f'<li><a class="chip" href="/venues/?type={t}">{TYPE_LABEL.get(t, t)} wedding venues</a></li>'
        for t in present_types)

    return head(TITLE, DESC, "/", og_image="/assets/img/patterns/hero.svg", extra=extra) + header("home") + f"""
  <main id="main">

    <!-- ================= HERO ================= -->
    <section class="relative isolate overflow-hidden bg-botanical-900 text-white">
      <div class="absolute inset-0 -z-10">
        <img src="/assets/img/patterns/hero.svg" alt="" aria-hidden="true" width="1600" height="1000"
             fetchpriority="high" decoding="async" class="size-full object-cover opacity-40">
        <div class="absolute inset-0 bg-gradient-to-br from-botanical-950 via-botanical-900/92 to-botanical-800/85"></div>
        <div class="hairline-grid absolute inset-0 opacity-60"></div>
      </div>

      <div class="shell grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p class="eyebrow rule-gold flex-col items-start gap-3 text-champagne-400">
            <span class="flex items-center gap-2">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-3.5" fill="currentColor"><path d="m12 2 2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4z"/></svg>
              Independent &middot; no paid placements
            </span>
          </p>

          <h1 class="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] text-white sm:text-6xl lg:text-[4.1rem]">
            Greenhouse wedding venues,
            <span class="block text-champagne-400">sourced, not scraped.</span>
          </h1>

          <p class="mt-6 max-w-xl text-lg leading-relaxed text-botanical-100/85">
            A directory of <strong class="font-semibold text-white">glasshouse, conservatory and
            botanical garden wedding venues</strong>. Every listing links straight to the venue&rsquo;s
            own events page &mdash; and anything we have not confirmed there is marked unconfirmed
            rather than guessed.
          </p>

          <form action="/venues/" method="get" class="mt-9 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md sm:flex sm:items-end sm:gap-2">
            <div class="flex-1 p-3 sm:p-2">
              <label class="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-champagne-400" for="hero-state">Where</label>
              <select id="hero-state" name="state" class="w-full cursor-pointer border-0 bg-transparent p-0 text-base font-medium text-white focus:outline-none [&>option]:text-ink-900">
                <option value="">Any state</option>
{chr(10).join(f'                <option value="{s["slug"]}">{s["name"]}</option>' for s in STATE_NAV)}
                <option value="italy">Italy (destination)</option>
              </select>
            </div>
            <div class="flex-1 border-t border-white/15 p-3 sm:border-l sm:border-t-0 sm:p-2">
              <label class="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-champagne-400" for="hero-type">Type</label>
              <select id="hero-type" name="type" class="w-full cursor-pointer border-0 bg-transparent p-0 text-base font-medium text-white focus:outline-none [&>option]:text-ink-900">
                <option value="">Any type</option>
{chr(10).join(f'                <option value="{t}">{TYPE_LABEL.get(t, t)}</option>' for t in present_types)}
              </select>
            </div>
            <button type="submit" class="btn-gold mt-2 w-full sm:mt-0 sm:w-auto">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              Search venues
            </button>
          </form>

          <p class="mt-4 text-sm text-botanical-100/60">
            Popular:
            <a class="underline decoration-champagne-500/60 underline-offset-4 transition-colors hover:text-white" href="/venues/?type=conservatory">conservatory wedding venues</a>,
            <a class="underline decoration-champagne-500/60 underline-offset-4 transition-colors hover:text-white" href="/venues/?type=botanical-garden">botanical garden wedding venues</a>,
            <a class="underline decoration-champagne-500/60 underline-offset-4 transition-colors hover:text-white" href="/italy-destination-weddings/">greenhouse wedding venue Italy</a>
          </p>
        </div>

        <div class="relative hidden lg:block">
          <div class="grid grid-cols-2 gap-4">
            <img src="/assets/img/patterns/square-01.svg" alt="" aria-hidden="true"
                 width="800" height="800" fetchpriority="high" decoding="async"
                 class="mt-12 aspect-[3/4] w-full rounded-2xl object-cover shadow-lift">
            <img src="/assets/img/patterns/square-02.svg" alt="" aria-hidden="true"
                 width="800" height="800" fetchpriority="high" decoding="async"
                 class="aspect-[3/4] w-full rounded-2xl object-cover shadow-lift">
          </div>
          <div class="glass-panel absolute -bottom-6 left-1/2 w-[86%] -translate-x-1/2 p-5">
            <dl class="grid grid-cols-3 divide-x divide-white/15 text-center">
              <div class="px-2">
                <dt class="text-[10px] font-bold uppercase tracking-[0.14em] text-champagne-400">Listings</dt>
                <dd class="mt-1 font-display text-2xl text-white">{st['total']}</dd>
              </div>
              <div class="px-2">
                <dt class="text-[10px] font-bold uppercase tracking-[0.14em] text-champagne-400">States &amp; regions</dt>
                <dd class="mt-1 font-display text-2xl text-white">{st['states']}</dd>
              </div>
              <div class="px-2">
                <dt class="text-[10px] font-bold uppercase tracking-[0.14em] text-champagne-400">Paid placements</dt>
                <dd class="mt-1 font-display text-2xl text-white">0</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= WHAT THIS DIRECTORY IS ================= -->
    <section class="border-b border-line bg-shell" aria-label="How this directory works">
      <div class="shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {"".join(f'''
        <div class="flex items-start gap-3">
          <span class="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-botanical-50 text-botanical-700">
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{icon}</svg>
          </span>
          <div>
            <h2 class="font-sans text-sm font-bold text-botanical-900">{t}</h2>
            <p class="mt-1 text-sm leading-relaxed text-ink-500">{d}</p>
          </div>
        </div>''' for t, d, icon in [
          ("Linked to the source",
           "Every listing links to the venue's own events page. That page, not this one, is where pricing and availability live.",
           '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'),
          ("Gaps stay visible",
           "A dash means we have not confirmed that detail yet. It never means small, cheap or unavailable.",
           '<path d="M5 12h14"/>'),
          ("No paid placements",
           "No venue pays to be listed or to rank, and we take no commission on your booking.",
           '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
          ("Corrections welcome",
           "If you run a venue and something here is wrong, tell us and we will fix or remove it.",
           '<path d="M20 6 9 17l-5-5"/>'),
        ])}
      </div>
    </section>

    <!-- ================= VENUES BY STATE ================= -->
    <section class="shell py-20 lg:py-24" aria-labelledby="states-heading">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
{section_heading("Browse the directory", "Greenhouse wedding venues by state",
                 "Start where you are getting married. Each state page lists the glasshouse, "
                 "conservatory and botanical garden wedding venues we have found there.", "states-heading")}
        <a class="btn-outline shrink-0" href="/venues/">Every listing</a>
      </div>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{state_cards}
      </div>
      <p class="mt-6 text-sm text-ink-400">
        Listings outside these states appear in
        <a class="font-medium text-botanical-700 underline decoration-champagne-400 underline-offset-4" href="/venues/">the full directory</a>.
      </p>
    </section>

    <!-- ================= LISTINGS PREVIEW ================= -->
    <section class="bg-shell py-20 lg:py-24" aria-labelledby="listings-heading">
      <div class="shell">
{section_heading("The listings", "Conservatory and glasshouse wedding venues",
                 "Real venues, each linked to its own events page. Capacities and prices appear "
                 "as we confirm them at the source.", "listings-heading")}

        <div class="mt-8">
{unconfirmed_notice(st)}
        </div>

        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{cards(preview, priority_count=3)}        </div>

        <div class="mt-12 text-center">
          <a class="btn-primary" href="/venues/">
            Browse all {st['total']} greenhouse wedding venues
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- ================= BROWSE BY TYPE ================= -->
    <section class="shell py-20 lg:py-24" aria-labelledby="types-heading">
{section_heading("Shortcuts", "Browse by glasshouse type",
                 "&ldquo;Greenhouse&rdquo; covers several quite different buildings. These are the "
                 "types currently represented in the directory.", "types-heading")}
      <ul class="mt-10 flex flex-wrap gap-3">{type_chips}</ul>
    </section>

    <!-- ================= RAIN-PROOF ================= -->
    <section class="bg-botanical-800 py-20 text-white lg:py-24" aria-labelledby="rain-heading">
      <div class="shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="eyebrow text-champagne-400">Why glass</p>
          <h2 id="rain-heading" class="mt-3 text-3xl text-white sm:text-4xl lg:text-[2.75rem]">
            The garden, without the weather decision
          </h2>
          <p class="mt-5 text-[17px] leading-relaxed text-botanical-100/85">
            A fully enclosed glasshouse is the one venue type where rain changes nothing. The
            ceremony, the dinner and the dancing all happen under a solid roof, with the planting
            and the daylight still around you &mdash; so there is no call to make at noon, and no
            marquee held in reserve.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a class="btn-gold" href="/blog/rain-proof-outdoor-wedding-venues/">Rain-proof venues guide</a>
            <a class="btn-ghost-light" href="/blog/greenhouse-wedding-cost/">What it costs</a>
          </div>
        </div>

        <ul class="grid gap-4 sm:grid-cols-2">
          {"".join(f'''
          <li class="glass-panel p-6">
            <h3 class="font-display text-lg text-white">{t}</h3>
            <p class="mt-2 text-sm leading-relaxed text-botanical-100/70">{d}</p>
          </li>''' for t, d in [
            ("Ask about the roof", "Is every part of the day under solid cover, or does the ceremony sit outside?"),
            ("Ask about ventilation", "Opening roof vents, side louvers or mechanical cooling — and what it holds at 4pm."),
            ("Ask about heating", "Included in the hire fee, or billed on top? What temperature will they stand behind?"),
            ("Ask about the floor", "Some rooms need floor protection before anyone dances on them."),
          ])}
        </ul>
      </div>
    </section>

    <!-- ================= ITALY ================= -->
    <section class="shell py-20 lg:py-24" aria-labelledby="italy-heading">
      <div class="card grid overflow-hidden lg:grid-cols-2">
        <div class="order-2 flex flex-col justify-center p-8 sm:p-12 lg:order-1">
          <p class="eyebrow-gold">Destination</p>
          <h2 id="italy-heading" class="mt-3 text-3xl sm:text-4xl">Greenhouse wedding venues in Italy</h2>
          <p class="mt-4 text-[17px] leading-relaxed text-ink-500">
            Italy has built glasshouses since long before anyone put a wedding in one. A
            <em>limonaia</em> is a lemon house: a working building made to overwinter citrus, with
            tall doors and a long glazed wall. Married in one, you are using it as designed.
          </p>
          <p class="mt-4 text-[15px] leading-relaxed text-ink-500">
            Marrying legally in Italy as a US citizen involves consular paperwork and a venue
            licensed by its comune &mdash; start with the embassy checklist, then the venue.
          </p>
          <div class="mt-8">
            <a class="btn-primary" href="/italy-destination-weddings/">Explore Italian glasshouses</a>
          </div>
        </div>
        <div class="order-1 lg:order-2">
          <img src="/assets/img/patterns/wide-01.svg" alt="" aria-hidden="true"
               width="1600" height="900" loading="lazy" decoding="async"
               class="size-full min-h-[16rem] object-cover">
        </div>
      </div>
    </section>

    <!-- ================= FAQ ================= -->
{faq_section(faqs.HOME, heading="Greenhouse wedding FAQs",
             intro="Marked up as FAQPage schema — and every question here appears on the page itself, "
                   "which is the rule Google actually enforces.")}

    <!-- ================= SUBMIT A VENUE ================= -->
    <section class="shell pb-20 lg:pb-24">
      <div class="relative isolate overflow-hidden rounded-card bg-botanical-950 px-8 py-14 text-center sm:px-16">
        <div class="hairline-grid absolute inset-0 -z-10 opacity-70"></div>
        <p class="eyebrow justify-center text-champagne-400">Missing a venue?</p>
        <h2 class="mx-auto mt-4 max-w-2xl text-3xl text-white sm:text-4xl">
          Tell us about a glasshouse we have not listed
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-botanical-100/80">
          Listings are free and editorial. Send the venue&rsquo;s own events page and we will check it
          &mdash; and if something already listed is wrong, tell us and we will correct or remove it.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a class="btn-gold" href="/methodology/#submit">Submit a venue</a>
          <a class="btn-ghost-light" href="/methodology/">How listings are sourced</a>
        </div>
      </div>
    </section>

  </main>
""" + footer(st)
