#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Site build. Renders every page from data/venues.json + data/site.json.

    python3 build/build.py        (or: npm run build:html)

Nothing here writes a fact that is not in the data files or generally true of the
venue category. Counts, facets and listings all derive from the data, so the site
cannot claim more than it holds.
"""
import sys, os, json
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from chrome import BASE, NAME, STATE_NAV
import cards as C
import faqs
from page_directory import directory_page, venue_page
import page_home
import page_content
import page_shortlist

ROOT = Path(__file__).resolve().parent.parent
VENUES = C.load()


def write(rel, html):
    out = ROOT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"  ✓ /{rel}")


def state_name(slug):
    for v in VENUES:
        if v["state_slug"] == slug:
            return v["state"]
    for s in STATE_NAV:
        if s["slug"] == slug:
            return s["name"]
    return slug.replace("-", " ").title()


RELATED_ALL = [(s["name"], f"/venues/{s['slug']}/") for s in STATE_NAV] + [
    ("Italy", "/italy-destination-weddings/"),
    ("All listings", "/venues/"),
    ("Cost guide", "/blog/greenhouse-wedding-cost/"),
]


# One extra sentence per state, appended to the "reading" section below. Each is a
# real, generally-known climate or seasonal fact — never a claim about a specific
# venue we have not confirmed — used only where it genuinely changes what to ask.
STATE_CLIMATE_NOTE = {
    "california": ("California&rsquo;s coastal fog and dry inland heat sit only a short drive apart, "
                    "so ventilation is what decides whether a glasshouse works in July, not the "
                    "state&rsquo;s reputation for good weather &mdash; ask what a venue&rsquo;s roof "
                    "vents and shade systems hold at midday."),
    "texas": ("Texas summers push glasshouse ventilation to its limit, so ask specifically about "
              "opening roof vents, side louvers and backup mechanical cooling before booking a "
              "summer date."),
    "florida": ("Florida&rsquo;s hurricane season runs June through November, which makes a "
                "venue&rsquo;s storm and rain-contingency policy worth asking about alongside the "
                "usual ventilation and heating questions."),
}


def state_body(name, slug=None):
    """Body copy for a state page. Everything here is true of the venue category
    anywhere — the state name localises the page without inventing local facts."""
    climate_note = STATE_CLIMATE_NOTE.get(slug, "")
    return [
        ("types", f"The kinds of greenhouse wedding venue you will find in {name}",
         f"""        <p>
          &ldquo;Greenhouse&rdquo; covers several quite different buildings, and the difference
          shapes your whole day. A <strong>working greenhouse</strong> is a growing structure, built
          for plants rather than people: usually smaller, usually the cheapest way to marry under a
          transparent roof, and the most likely to need power, heating or floor protection brought
          in. A <strong>conservatory</strong> is a glazed room attached to a building. An
          <strong>orangery</strong> is its masonry relative &mdash; solid piers between tall glazed
          openings, and far easier to heat. A <strong>palm house</strong> is the tall domed type
          found in public gardens, and an <strong>atrium</strong> its modern equivalent.
        </p>
        <p>
          <strong>Botanical garden</strong> venues in {name} may be any of these, wrapped in a
          collection that usually also gives you a ceremony lawn. They tend to offer the largest
          glazed rooms available locally, in exchange for approved-caterer lists, fixed load-in
          windows and public opening hours.
        </p>"""),

        ("reading", "How to read these listings",
         f"""        <p>
          Each listing links to the venue&rsquo;s own events page, and that page &mdash; not this one
          &mdash; is where pricing and availability live. Where you see a dash on a listing, we have
          not yet confirmed that detail against the venue&rsquo;s own material. It does not mean the
          room is small or cheap; it means we do not know yet.
        </p>
        <p>
          That is a deliberate trade. A directory that guesses a capacity sends you into a
          conversation with the wrong expectation, and a directory that repeats a price from a
          third-party listing site is usually quoting something out of date. See
          <a href="/methodology/">how we source listings</a>.
        </p>{f'''
        <p>
          {climate_note}
        </p>''' if climate_note else ''}"""),

        ("ask", f"What to ask a {name} venue before you book",
         """        <p>
          Glass buildings differ from ordinary venues in four specific ways. These questions
          separate a room that works in your month from one that only photographs well:
        </p>
        <ul>
          <li><strong>Seated capacity with a dance floor</strong>, with the planting where it will be on the day. Glazed rooms lose floor area to beds and structural piers.</li>
          <li><strong>Ventilation, and what it holds.</strong> Opening roof vents, side louvers, shade cloth or mechanical cooling — and the temperature the venue will stand behind on a hot afternoon. A glass roof gains heat fast; ventilation is what makes the difference, not the local climate.</li>
          <li><strong>Heating, and who pays for it.</strong> Included in the hire fee or billed separately, and what is guaranteed in the coldest month you would consider.</li>
          <li><strong>Catering policy and minimum spend.</strong> Usually a bigger lever on the total than the hire fee itself — see the <a href="/blog/greenhouse-wedding-cost/">cost guide</a>.</li>
        </ul>"""),
    ]


def build_all():
    print("Building pages…")

    # ---------------------------------------------------------------- home ---
    write("index.html", page_home.build(VENUES))

    # ------------------------------------------------------------ /venues/ ---
    write("venues/index.html", directory_page(
        path="/venues/", title="Browse Greenhouse &amp; Conservatory Wedding Venues | Directory",
        desc=("Every greenhouse, glasshouse and conservatory wedding venue in the directory, "
              "filterable by state and type. Each listing links to the venue's own events page."),
        h1="Browse every greenhouse wedding venue",
        kicker=f"{len(VENUES)} listings",
        intro="""        <p>Every glasshouse, conservatory, orangery, palm house and botanical
        garden wedding venue currently in the directory. Filter by state and type, then follow any
        listing through to the venue&rsquo;s own events page.</p>""",
        crumbs=[("Home", "/"), ("Venues", None)],
        venue_list=VENUES, all_venues=VENUES, show_state=True,
        body_sections=[
            ("what-counts", "What counts as a greenhouse wedding venue",
             """        <p>
          Six quite different buildings share the label. A <strong>working greenhouse</strong> is a
          growing structure released for events. A <strong>conservatory</strong> is a glazed room
          attached to a building, historically for overwintering tender plants. An
          <strong>orangery</strong> is its masonry cousin: solid piers, tall arched glazing, much
          easier to heat. A <strong>palm house</strong> is the tall domed Victorian type inside
          public gardens, an <strong>atrium</strong> its modern steel-and-glass equivalent, and a
          <strong>limonaia</strong> the Italian lemon house built to overwinter citrus.
        </p>
        <p>
          The label describes the architecture. What decides your day is whether the room is fully
          enclosed and how it is ventilated &mdash; so ask those two questions of every venue,
          whatever it calls itself.
        </p>"""),
            ("reading", "How to read these listings",
             """        <p>
          Listings are compiled from venues&rsquo; own websites and link straight back to them. A
          dash means a detail we have not confirmed at the source, not a small room or a cheap one.
          The capacity, layout and price filters only match confirmed listings, so they currently
          return little &mdash; state, type and search work across everything.
        </p>
        <p>
          The alternative would be to fill the gaps with plausible numbers, which is how most
          directories work and why so few of them are worth trusting.
          <a href="/methodology/">Our sourcing rules</a> explain the trade in full.
        </p>"""),
        ],
        faq_items=faqs.HUB, nav_key="venues", related=RELATED_ALL))

    # ------------------------------------------------------- state pages -----
    state_slugs = []
    for v in VENUES:
        if v["country"] == "US" and v["state_slug"] not in state_slugs:
            state_slugs.append(v["state_slug"])

    for slug in state_slugs:
        name = state_name(slug)
        vs = [v for v in VENUES if v["state_slug"] == slug]
        n = len(vs)
        write(f"venues/{slug}/index.html", directory_page(
            path=f"/venues/{slug}/",
            title=f"Greenhouse Wedding Venues in {name} | Glasshouses &amp; Conservatories",
            desc=(f"Greenhouse, glasshouse and conservatory wedding venues in {name}. "
                  f"{n} listing{'s' if n != 1 else ''}, each linked to the venue's own events page, "
                  f"plus what to ask before booking a glass venue."),
            h1=f"Greenhouse wedding venues in {name}",
            kicker=f"{n} listing{'s' if n != 1 else ''} in {name}",
            intro=f"""        <p>The glasshouse, conservatory and botanical garden wedding venues we
            have found in {name}, each linked to its own events page. This is a growing list rather
            than a complete one &mdash; if we are missing a venue, <a href="/methodology/#submit">tell
            us</a> and we will check it.</p>""",
            crumbs=[("Home", "/"), ("Venues", "/venues/"), (name, None)],
            venue_list=vs, all_venues=VENUES, show_state=False,
            body_sections=state_body(name, slug),
            faq_items=faqs.state(name, slug), nav_key="venues",
            related=[r for r in RELATED_ALL if r[1] != f"/venues/{slug}/"]))

    # ------------------------------------------------------------- Italy -----
    italy = [v for v in VENUES if v["state_slug"] == "italy"]
    write("italy-destination-weddings/index.html", directory_page(
        path="/italy-destination-weddings/",
        title="Greenhouse Wedding Venue Italy | Limonaie &amp; Glasshouses",
        desc=("Greenhouse and limonaia wedding venues in Italy for US couples, with what a "
              "legally binding civil ceremony actually requires and where to check the current "
              "paperwork."),
        h1="Greenhouse wedding venues in Italy",
        kicker="Destination collection",
        intro="""        <p>Italy has built glasshouses since long before anyone put a wedding in
        one. A <em>limonaia</em> is a lemon house: a working building made to overwinter citrus in
        terracotta pots, with tall doors, deep sills and a long glazed wall. Married in one, you are
        using the building as it was designed to be used.</p>
        <p>This is a small collection, and deliberately so &mdash; Italian venues rarely publish
        tariffs or capacities, so we list the ones we can point you to and leave the numbers to the
        venue.</p>""",
        crumbs=[("Home", "/"), ("Italy destination weddings", None)],
        venue_list=italy, all_venues=VENUES, show_state=False,
        body_sections=[
            ("legal", "Getting legally married in Italy",
             """        <p>
          Two different things are often confused. A <strong>civil ceremony</strong> performed by an
          Italian official is legally binding, but it has to happen in a venue licensed by its
          comune and it requires consular paperwork prepared in advance &mdash; including a
          <em>Nulla Osta</em> obtained through the US consulate. A <strong>symbolic ceremony</strong>
          can happen anywhere, and many couples pair one with a civil ceremony at home.
        </p>
        <p>
          Requirements and processing times change, and they differ by comune, so treat any
          checklist you read online &mdash; including this one &mdash; as a starting point rather
          than an authority. Confirm the current requirements with the
          <a href="https://it.usembassy.gov/" rel="noopener">US Embassy &amp; Consulates in Italy</a>
          and with the comune where you intend to marry, before you book anything.
        </p>"""),
            ("what-to-ask", "What to ask an Italian venue",
             """        <p>
          Italian venues generally quote per event rather than publishing a tariff, so a written
          quote is the only reliable number. Ask it to cover:
        </p>
        <ul>
          <li><strong>Exclusivity</strong> — the whole property or one space, and for how long.</li>
          <li><strong>Catering</strong> — in-house, a named list, or open, and any minimum.</li>
          <li><strong>Civil ceremony licensing</strong> — whether the venue itself is licensed, or whether the legal ceremony must happen elsewhere.</li>
          <li><strong>Accommodation</strong> — how many rooms on site, and whether they are required.</li>
          <li><strong>Local costs</strong> — comune fees, and whether a planner is required by the venue.</li>
        </ul>
        <p>
          A planner is worth budgeting for on a destination wedding conducted in a second language,
          with local vendor contracts and municipal filings. Our
          <a href="/blog/greenhouse-wedding-cost/">cost guide</a> covers how to structure the
          comparison.
        </p>"""),
        ],
        faq_items=faqs.ITALY, nav_key="italy",
        related=[("All listings", "/venues/"), ("Cost guide", "/blog/greenhouse-wedding-cost/"),
                 ("Rain-proof venues", "/blog/rain-proof-outdoor-wedding-venues/"),
                 ("How we source", "/methodology/")]))

    # ------------------------------------------------------ venue pages ------
    for v in VENUES:
        similar = [x for x in VENUES
                   if x["state_slug"] == v["state_slug"] and x["slug"] != v["slug"]][:3]
        if len(similar) < 3:
            similar += [x for x in VENUES
                        if x["type"] == v["type"] and x["slug"] != v["slug"]
                        and x not in similar][:3 - len(similar)]
        rel = C.venue_url(v).strip("/") + "/index.html"
        write(rel, venue_page(v, similar, VENUES))

    # ----------------------------------------------------------- content -----
    write("blog/index.html", page_content.blog_index(VENUES))
    write("blog/greenhouse-wedding-cost/index.html", page_content.cost_guide(VENUES))
    write("blog/rain-proof-outdoor-wedding-venues/index.html", page_content.rainproof_guide(VENUES))
    write("blog/small-greenhouse-wedding-venues/index.html", page_content.small_venues_guide(VENUES))
    write("blog/conservatory-vs-greenhouse/index.html", page_content.types_guide(VENUES))
    write("blog/botanical-garden-wedding-rules/index.html", page_content.botanical_garden_guide(VENUES))
    write("blog/greenhouse-ventilation-heating/index.html", page_content.ventilation_guide(VENUES))
    write("blog/winter-greenhouse-wedding/index.html", page_content.winter_guide(VENUES))
    write("blog/summer-greenhouse-wedding/index.html", page_content.summer_guide(VENUES))
    write("blog/greenhouse-wedding-catering/index.html", page_content.catering_guide(VENUES))
    write("blog/how-far-in-advance-book-greenhouse-venue/index.html", page_content.timing_guide(VENUES))
    write("blog/greenhouse-elopement-micro-ceremony/index.html", page_content.elopement_guide(VENUES))
    write("blog/vendor-logistics-glass-venues/index.html", page_content.vendor_logistics_guide(VENUES))
    write("blog/greenhouse-wedding-venue-checklist/index.html", page_content.checklist_guide(VENUES))
    write("methodology/index.html", page_content.methodology(VENUES))
    write("privacy/index.html", page_content.privacy_policy(VENUES))
    write("terms/index.html", page_content.terms_of_use(VENUES))

    # 404.html at the repo root (not a directory) — GitHub Pages, Netlify,
    # Cloudflare Pages and S3 all serve this file automatically for any
    # unmatched path. It is deliberately noindex and left out of the sitemap.
    write("404.html", page_content.not_found_page(VENUES))

    # -------------------------------------------------- shortlist & compare --
    # A client-only tool (see build/page_shortlist.py + assets/js/shortlist.js).
    # It needs a public copy of the venue data to hydrate from — trimmed to the
    # fields the UI actually uses, nothing internal (no notes, no schema comments).
    write("shortlist/index.html", page_shortlist.build(VENUES))

    public_fields = ("slug", "name", "city", "state", "state_slug", "country", "type",
                      "capacity_seated", "price_tier", "blend", "official_url",
                      "summary", "pattern")
    public_venues = []
    for v in VENUES:
        row = {k: v.get(k) for k in public_fields}
        row["url"] = C.venue_url(v)
        public_venues.append(row)
    write("assets/data/venues.json", json.dumps(public_venues, ensure_ascii=False, indent=2) + "\n")

    # ----------------------------------------------------------- sitemap -----
    urls = ["/", "/venues/", "/italy-destination-weddings/", "/blog/",
            "/blog/greenhouse-wedding-cost/", "/blog/rain-proof-outdoor-wedding-venues/",
            "/blog/small-greenhouse-wedding-venues/",
            "/blog/conservatory-vs-greenhouse/", "/blog/botanical-garden-wedding-rules/",
            "/blog/greenhouse-ventilation-heating/", "/blog/winter-greenhouse-wedding/",
            "/blog/summer-greenhouse-wedding/", "/blog/greenhouse-wedding-catering/",
            "/blog/how-far-in-advance-book-greenhouse-venue/",
            "/blog/greenhouse-elopement-micro-ceremony/", "/blog/vendor-logistics-glass-venues/",
            "/blog/greenhouse-wedding-venue-checklist/",
            "/methodology/", "/privacy/", "/terms/"]
    urls += [f"/venues/{s}/" for s in state_slugs]
    urls += [C.venue_url(v) for v in VENUES]
    body = "\n".join(f"""  <url>
    <loc>{BASE}{u}</loc>
    <changefreq>{'daily' if u in ('/', '/venues/') else 'weekly'}</changefreq>
    <priority>{'1.0' if u == '/' else '0.8'}</priority>
  </url>""" for u in urls)
    write("sitemap.xml", f"""<?xml version="1.0" encoding="UTF-8"?>
<!--
  Generated by build/build.py — do not edit by hand.
  Only canonical, indexable URLs belong here. lastmod is deliberately omitted
  rather than stamped with a build date that would not reflect real changes.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{body}
</urlset>
""")

    # ------------------------------------------------------------ robots.txt -
    # Generated (not hand-maintained) so it can never point at a stale domain
    # — BASE comes from the same data/site.json the rest of the site does.
    write("robots.txt", f"""# {NAME} — {BASE}/
User-agent: *
Allow: /

# The venue filters (state, type, capacity, blend, price, search, sort) are
# all client-side query-string params on /venues/ — every combination serves
# the identical HTML, so letting crawlers wander through them wastes budget
# on thin duplicates instead of the canonical /venues/ and /venues/{{state}}/
# pages, which already cover the same content deliberately.
Disallow: /venues/*?*state=
Disallow: /venues/*?*type=
Disallow: /venues/*?*capacity=
Disallow: /venues/*?*blend=
Disallow: /venues/*?*price=
Disallow: /venues/*?*q=
Disallow: /venues/*?*sort=
Disallow: /*?utm_

# /shortlist/ is a personal, client-only tool (see /methodology/) with
# nothing for a crawler to index — it is already noindex, this just saves
# the fetch. /api/ has no GET routes; see the venue-suggestion form on
# /methodology/ for what it is for.
Disallow: /shortlist/
Disallow: /api/

Sitemap: {BASE}/sitemap.xml
""")

    # ------------------------------------------------------ web app manifest -
    # Lets mobile browsers add a home-screen icon with the right name/colors.
    # Icons are pre-rendered PNGs in assets/img/brand/ (see icon-192.png,
    # icon-512.png) — regenerate them from favicon.svg if the mark changes.
    write("site.webmanifest", json.dumps({
        "name": f"{NAME} — Greenhouse & Conservatory Wedding Venues",
        "short_name": NAME,
        "start_url": "/",
        "display": "standalone",
        "background_color": "#F8F9FA",
        "theme_color": "#1B4332",
        "icons": [
            {"src": "/assets/img/brand/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/assets/img/brand/icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }, ensure_ascii=False, indent=2) + "\n")

    st = C.stats(VENUES)
    print(f"\n{len(urls)} pages · {st['total']} listings · {st['states']} states and regions")
    print(f"confirmed capacity: {st['with_capacity']}/{st['total']} · "
          f"confirmed pricing: {st['with_price']}/{st['total']}")


if __name__ == "__main__":
    build_all()
