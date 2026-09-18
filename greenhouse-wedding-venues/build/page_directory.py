# -*- coding: utf-8 -*-
"""Directory pages: /venues/, state pages, the Italy hub, and venue detail pages."""
from chrome import head, header, footer, ld, breadcrumbs, BASE, STATE_NAV
from cards import cards, stats, venue_url, TYPE_LABEL, BLEND_SHORT, PRICE_GLYPH, unconfirmed_notice
from shared import faq_ld, faq_section, checklist, shortlist_button
import filters
import faqs


def _collection_ld(path, title, desc, venue_list):
    return {
        "@context": "https://schema.org", "@type": "CollectionPage",
        "@id": f"{BASE}{path}#webpage", "url": f"{BASE}{path}",
        "name": title.replace("&amp;", "&"), "description": desc,
        "isPartOf": {"@id": f"{BASE}/#website"},
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": len(venue_list),
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1,
                 "item": {
                     "@type": "EventVenue",
                     "@id": f"{BASE}{venue_url(v)}#venue",
                     "name": v["name"].replace("&amp;", "&"),
                     "url": f"{BASE}{venue_url(v)}",
                     "sameAs": v["official_url"],
                     "address": {
                         "@type": "PostalAddress",
                         "addressLocality": v["city"],
                         **({"addressRegion": v["state"]} if v["country"] == "US" else {}),
                         "addressCountry": v["country"],
                     },
                     # Capacity and price are intentionally absent: asserting an
                     # unverified figure about a real business in structured data
                     # is worse than omitting it.
                 }}
                for i, v in enumerate(venue_list)
            ],
        },
    }


def _breadcrumb_ld(crumbs):
    return {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": label,
             **({"item": f"{BASE}{href}"} if href else {})}
            for i, (label, href) in enumerate(crumbs)
        ],
    }


def directory_page(*, path, title, desc, h1, kicker, intro, crumbs, venue_list, all_venues,
                   show_state, body_sections, faq_items, nav_key, related):
    st = stats(all_venues)
    extra = (ld(_collection_ld(path, title, desc, venue_list), "Schema: CollectionPage + ItemList")
             + ld(_breadcrumb_ld(crumbs), "Schema: BreadcrumbList — mirrors the visible breadcrumb")
             + ld(faq_ld(faq_items), "Schema: FAQPage"))

    body = "\n".join(f"""        <h2 id="{sid}" class="mt-12 text-2xl sm:text-3xl">{h2}</h2>
{content}""" for sid, h2, content in body_sections)

    related_links = "\n".join(
        f'              <li><a class="chip" href="{href}">{label}</a></li>' for label, href in related)

    return head(title, desc, path, og_image="/assets/img/patterns/wide-01.svg", extra=extra) + header(nav_key) + f"""
  <main id="main">
{breadcrumbs(crumbs)}
    <header class="shell pb-10 pt-8">
      <p class="eyebrow-gold">{kicker}</p>
      <h1 class="mt-3 max-w-4xl font-display text-[2.25rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">{h1}</h1>
      <div class="mt-5 max-w-3xl space-y-4 text-[17px] leading-relaxed text-ink-500 [&_a]:font-medium [&_a]:text-botanical-700 [&_a]:underline [&_a]:decoration-champagne-400 [&_a]:underline-offset-4">
{intro}
      </div>
    </header>

    <section class="shell pb-20" aria-label="Venue directory">
      <div class="mb-8">
{unconfirmed_notice(st)}
      </div>

      <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
{filters.sidebar(all_venues, show_state)}
        <div>
{filters.toolbar()}
          <div class="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" data-venue-grid>
{cards(venue_list, priority_count=3)}          </div>

{filters.empty_state()}
        </div>
      </div>

{filters.drawer(all_venues, show_state)}
    </section>

    <section class="bg-shell py-20">
      <div class="shell grid gap-12 lg:grid-cols-[1fr_320px]">
        <div class="prose-editorial min-w-0 max-w-none">
{body}
        </div>

        <aside class="space-y-6">
          <div class="card sticky top-24 p-6">
            <h2 class="font-sans text-sm font-bold uppercase tracking-[0.14em] text-botanical-800">Keep browsing</h2>
            <ul class="mt-4 flex flex-wrap gap-2">
{related_links}
            </ul>
          </div>
        </aside>
      </div>
    </section>

{faq_section(faq_items, heading="Frequently asked")}

  </main>
""" + footer(st)


# ---------------------------------------------------------------- venue page --
def venue_page(v, similar, all_venues):
    st = stats(all_venues)
    path = venue_url(v)
    plain_name = v["name"].replace("&amp;", "&")
    region = f", {v['state']}" if v["country"] == "US" else f", {v['state']}"
    title = f"{plain_name} | Greenhouse Wedding Venue in {v['city']}"
    if len(title) > 70:
        title = f"{plain_name} | Wedding Venue, {v['city']}"
    if len(title) > 70:
        title = plain_name
    type_label = TYPE_LABEL.get(v["type"], v["type"]).lower()
    desc = (f"{plain_name} in {v['city']}{region} — a {type_label} wedding venue. Listing details, "
            f"what to ask before booking, and a direct link to the venue's own events page.")
    if len(desc) > 165:
        desc = (f"{plain_name} in {v['city']}{region} — a {type_label} wedding venue: what to ask "
                f"before booking, with a link to the venue's own events page.")
    if len(desc) > 165:
        desc = f"{plain_name}: a {type_label} wedding venue in {v['city']}. What to ask before booking."

    crumbs = ([("Home", "/"), ("Venues", "/venues/"), (v["state"], f"/venues/{v['state_slug']}/"), (plain_name, None)]
              if v["country"] == "US" else
              [("Home", "/"), ("Italy", "/italy-destination-weddings/"), (plain_name, None)])

    venue_ld = {
        "@context": "https://schema.org", "@type": ["EventVenue", "LocalBusiness"],
        "@id": f"{BASE}{path}#venue",
        "name": plain_name,
        "url": f"{BASE}{path}",
        "sameAs": v["official_url"],
        "description": v["summary"],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": v["city"],
            **({"addressRegion": v["state"]} if v["country"] == "US" else {}),
            "addressCountry": v["country"],
        },
    }
    # Only assert what the data actually holds.
    if v.get("capacity_seated"):
        venue_ld["maximumAttendeeCapacity"] = v["capacity_seated"]
    if v.get("price_tier"):
        venue_ld["priceRange"] = PRICE_GLYPH[v["price_tier"]]

    faq_items = faqs.venue(v)
    extra = (ld(venue_ld, "Schema: EventVenue + LocalBusiness. Capacity, priceRange, telephone and "
                          "geo are omitted because they are not confirmed at the source; "
                          "aggregateRating/review are omitted because we hold no first-party reviews")
             + ld(_breadcrumb_ld(crumbs), "Schema: BreadcrumbList")
             + ld(faq_ld(faq_items), "Schema: FAQPage"))

    def row(label, value, note):
        shown = value if value else '<span class="text-ink-500">Not confirmed</span>'
        return f"""              <div class="grid gap-1 border-b border-line py-4 last:border-0 sm:grid-cols-[190px_1fr] sm:gap-6">
                <dt class="text-sm font-semibold text-botanical-800">{label}</dt>
                <dd class="text-sm text-ink-500">
                  <span class="font-medium text-ink-900">{shown}</span>
                  <span class="mt-0.5 block text-[13px] text-ink-500">{note}</span>
                </dd>
              </div>"""

    spec_rows = "\n".join([
        row("Venue type", TYPE_LABEL.get(v["type"], v["type"]), "Assigned from the venue&rsquo;s own description"),
        row("Location", f"{v['city']}, {v['state']}", "Full address on the venue&rsquo;s site"),
        row("Seated capacity", v.get("capacity_seated"), "Ask for the figure <em>with</em> a dance floor and planting in place"),
        row("Indoor / outdoor", BLEND_SHORT.get(v.get("blend")), "Whether the whole day can happen under cover"),
        row("Price range", PRICE_GLYPH.get(v.get("price_tier")), "Request the current rate sheet from the venue"),
        row("Catering", None, "Ask whether outside catering is allowed, and any minimum spend"),
        row("Ventilation &amp; heating", None, "Ask what it holds on a hot afternoon, and whether heat is included"),
        row("Accessibility", None, "Ask about step-free routes, parking surface and accessible restrooms"),
    ])

    similar_block = ""
    if similar:
        similar_block = f"""    <section class="bg-shell py-20 mt-20" aria-labelledby="similar-heading">
      <div class="shell">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="eyebrow-gold">Compare</p>
            <h2 id="similar-heading" class="mt-3 text-3xl">Other listings nearby</h2>
          </div>
          <a class="btn-outline" href="/venues/{v['state_slug']}/">All {v['state']} listings</a>
        </div>
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{cards(similar)}        </div>
      </div>
    </section>
"""

    venue_checklist_key = "venue:" + v["slug"]
    venue_copy_intro = (
        "Hi " + plain_name + " team,\n\n"
        "We're considering " + plain_name + " for our wedding and wanted to check a "
        "few things before we get in touch further:"
    )
    venue_checklist_items = [
        ("Seated capacity with a dance floor",
         "With the planting where it will be on the day — glazed rooms lose floor area to beds "
         "and structural piers, so the headline number and the usable one often differ."),
        ("Ventilation, and what it holds",
         "Opening roof vents, side louvers, shade cloth or mechanical cooling — and the "
         "temperature the venue will stand behind on a hot afternoon."),
        ("Heating, and who pays for it",
         "Included in the hire fee or billed separately, and what temperature is guaranteed in "
         "the coldest month you would consider."),
        ("Power and floors",
         "The electrical supply available to your caterer and band, and whether floor protection "
         "is required before anyone dances."),
    ]

    return head(title, desc, path, og_type="article",
                og_image="/assets/img/patterns/wide-02.svg", extra=extra) + header("venues") + f"""
  <main id="main" data-venue-slug="{v['slug']}">
{breadcrumbs(crumbs)}
    <header class="shell pb-8 pt-8">
      <div class="flex flex-wrap items-start justify-between gap-6">
        <div class="max-w-3xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="badge-emerald">{TYPE_LABEL.get(v['type'], v['type'])}</span>
            <span class="badge bg-cream-warm text-ink-500">Details not yet confirmed</span>
          </div>

          <h1 class="mt-4 font-display text-[2.25rem] font-semibold leading-[1.08] sm:text-5xl">{v['name']}</h1>

          <p class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-ink-500">
            <span class="inline-flex items-center gap-1.5">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4 text-champagne-700" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {v['city']}, {v['state']}
            </span>
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <a class="btn-gold" href="{v['official_url']}" rel="noopener nofollow" target="_blank">
            Venue&rsquo;s own events page
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>
          </a>
          <button type="button" class="btn-outline" data-copy-link>
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>
            <span data-copy-label>Share</span>
          </button>
          {shortlist_button(v, cls="!size-11")}
        </div>
      </div>
    </header>

    <section class="shell" aria-label="Venue illustration">
      <figure class="m-0">
        <div class="aspect-[16/9] overflow-hidden rounded-card bg-botanical-900 sm:aspect-[16/7]">
          <img src="/assets/img/patterns/wide-02.svg" alt="" aria-hidden="true"
               width="1600" height="900" fetchpriority="high" decoding="async"
               class="size-full object-cover">
        </div>
        <figcaption class="mt-3 text-[13px] text-ink-500">
          Decorative pattern &mdash; we hold no licensed photography of this venue. Photographs are on
          the <a class="font-medium text-botanical-700 underline decoration-champagne-400 underline-offset-4" href="{v['official_url']}" rel="noopener nofollow" target="_blank">venue&rsquo;s own page</a>.
        </figcaption>
      </figure>
    </section>

    <div class="shell mt-14 grid gap-12 lg:grid-cols-[1fr_360px] lg:items-start">

      <article class="prose-editorial min-w-0 max-w-none">
        <h2 id="about">About this listing</h2>
        <p>{v['summary']}</p>
        <p>
          This is an editorial listing, not a booking page. We do not hold this venue&rsquo;s
          calendar, its rates or its floor plans &mdash; the venue does, on
          <a href="{v['official_url']}" rel="noopener nofollow" target="_blank">its own events page</a>,
          which is where an enquiry should go. What we add is the shortlist: the venue sits alongside
          comparable glasshouses in the same region, described in the same terms.
        </p>

        <h2 id="specs">What we know, and what we do not</h2>
        <p>
          Rows marked <em>not confirmed</em> are fields we have not verified against the
          venue&rsquo;s own material. We would rather leave them empty than publish a figure that
          sends you into a conversation with the wrong expectation.
        </p>
        <dl class="not-prose mt-6 rounded-card border border-line bg-shell px-6">
{spec_rows}
        </dl>

        <h2 id="ask">What to ask before you enquire</h2>
        <p>
          Glasshouses differ from ordinary venues in four specific ways, and these are the questions
          that separate a room that works in your month from one that only photographs well. Check
          them off as {plain_name} answers them, or copy the list to send by email &mdash; it is
          saved in this browser against this venue.
        </p>
{checklist(venue_checklist_items, key=venue_checklist_key, copy_intro=venue_copy_intro)}
        <p>
          Our <a href="/blog/greenhouse-wedding-cost/">cost guide</a> covers the line items those
          answers feed into.
        </p>
      </article>

      <aside class="space-y-6 lg:sticky lg:top-24">
        <section class="card p-6" aria-labelledby="source-heading">
          <h2 id="source-heading" class="font-display text-xl">Go to the source</h2>
          <p class="mt-1.5 text-sm leading-relaxed text-ink-500">
            Availability, pricing and floor plans live with the venue. We link out rather than
            collecting your details.
          </p>
          <a class="btn-gold mt-5 w-full" href="{v['official_url']}" rel="noopener nofollow" target="_blank">
            Open the venue&rsquo;s events page
          </a>
          <p class="mt-3 break-words text-center text-xs text-ink-500">{v['official_url']}</p>
        </section>

        <section class="card border-champagne-200 bg-champagne-50/60 p-6" aria-labelledby="fix-heading">
          <h2 id="fix-heading" class="font-display text-lg text-botanical-900">Is something here wrong?</h2>
          <p class="mt-1.5 text-sm leading-relaxed text-ink-500">
            If you work at this venue, or you have been there and our description is out of date,
            tell us. We will correct it or take the listing down.
          </p>
          <a class="btn-primary mt-4 w-full" href="/methodology/#corrections">Report a correction</a>
        </section>
      </aside>
    </div>

{faq_section(faq_items, heading="Questions about this venue", kicker="Before you enquire", hid="venue-faq")}

{similar_block}
  </main>
""" + footer(st)
