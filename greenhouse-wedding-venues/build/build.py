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

from chrome import BASE, STATE_NAV
import cards as C
import faqs
from page_directory import directory_page, venue_page
import page_home
import page_content

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


def state_body(name):
    """Body copy for a state page. Everything here is true of the venue category
    anywhere — the state name localises the page without inventing local facts."""
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
        </p>"""),

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
            body_sections=state_body(name),
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
    write("methodology/index.html", page_content.methodology(VENUES))

    # ----------------------------------------------------------- sitemap -----
    urls = ["/", "/venues/", "/italy-destination-weddings/", "/blog/",
            "/blog/greenhouse-wedding-cost/", "/blog/rain-proof-outdoor-wedding-venues/",
            "/methodology/"]
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

    st = C.stats(VENUES)
    print(f"\n{len(urls)} pages · {st['total']} listings · {st['states']} states and regions")
    print(f"confirmed capacity: {st['with_capacity']}/{st['total']} · "
          f"confirmed pricing: {st['with_price']}/{st['total']}")


if __name__ == "__main__":
    build_all()
