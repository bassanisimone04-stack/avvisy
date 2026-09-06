# -*- coding: utf-8 -*-
"""
Venue data loading + the card component.

The card renders three states for every fact: a confirmed value, or an explicit
"Not published" with a link to the venue's own page. It never fills a gap with a
plausible-looking number — an empty field on a directory is a small problem, a
wrong one about a real business is a large one.
"""
import json
from pathlib import Path

from shared import shortlist_button

ROOT = Path(__file__).resolve().parent.parent

PRICE_GLYPH = {1: "$", 2: "$$", 3: "$$$", 4: "$$$$"}
PRICE_HINT = {1: "Lowest published tier", 2: "Mid-lower tier",
              3: "Mid-upper tier", 4: "Highest published tier"}
BLEND_SHORT = {"enclosed": "Fully enclosed", "hybrid": "Glass + garden",
               "openair": "Open-air adjacent"}
TYPE_LABEL = {
    "greenhouse": "Greenhouse", "conservatory": "Conservatory",
    "palm-house": "Palm house", "orangery": "Orangery", "atrium": "Atrium",
    "botanical-garden": "Botanical garden", "limonaia": "Limonaia",
}

# The illustrations shipped in /assets/img are generated patterns, not
# photographs of these venues. They are decorative (alt="") and the card says so,
# so nobody can mistake one for a picture of the room.
PATTERNS = [f"pattern-{i:02d}" for i in range(1, 7)]


def load():
    data = json.loads((ROOT / "data" / "venues.json").read_text(encoding="utf-8"))
    venues = data["venues"]
    for i, v in enumerate(venues):
        v["pattern"] = PATTERNS[i % len(PATTERNS)]
    return venues


def venue_url(v):
    if v["state_slug"] == "italy":
        return f"/italy-destination-weddings/{v['slug']}/"
    return f"/venues/{v['state_slug']}/{v['slug']}/"


def stats(venues):
    return {
        "total": len(venues),
        "states": len({v["state_slug"] for v in venues}),
        "verified": sum(1 for v in venues if v.get("last_verified")),
        "with_capacity": sum(1 for v in venues if v.get("capacity_seated")),
        "with_price": sum(1 for v in venues if v.get("price_tier")),
    }


def _fact(label, value):
    """A single fact cell — real value, or an honest gap."""
    if value:
        return (f'<dt class="text-[10px] font-bold uppercase tracking-wider text-ink-300">{label}</dt>'
                f'<dd class="mt-0.5 text-sm font-semibold text-botanical-800">{value}</dd>')
    return (f'<dt class="text-[10px] font-bold uppercase tracking-wider text-ink-300">{label}</dt>'
            f'<dd class="mt-0.5 text-sm font-medium text-ink-300" title="Not published by the venue">&mdash;</dd>')


def card(v, *, priority=False):
    loading = 'loading="eager" fetchpriority="high"' if priority else 'loading="lazy"'
    cap = v.get("capacity_seated")
    price = v.get("price_tier")
    blend = v.get("blend")

    return f"""        <article data-venue
                 data-name="{v['name']}"
                 data-city="{v['city']}"
                 data-state="{v['state_slug']}"
                 data-type="{v['type']}"
                 data-capacity="{cap or ''}"
                 data-blend="{blend or ''}"
                 data-price="{price or ''}"
                 class="card-interactive group relative flex flex-col overflow-hidden">
          <div class="relative aspect-[4/3] overflow-hidden bg-botanical-900">
            <img src="/assets/img/patterns/{v['pattern']}.svg"
                 alt="" aria-hidden="true"
                 width="800" height="600" {loading} decoding="async"
                 class="size-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]">
            <span class="badge-glass absolute left-4 top-4">{TYPE_LABEL.get(v['type'], v['type'])}</span>
            {shortlist_button(v)}
            <span class="pointer-events-none absolute bottom-3 right-3 rounded-pill bg-botanical-950/55 px-2.5 py-1 text-[10px] font-medium text-white/80 backdrop-blur-sm">
              No photo on file
            </span>
          </div>

          <div class="flex flex-1 flex-col p-5">
            <p class="eyebrow">{v['city']}, {v['state']}</p>
            <h3 class="mt-2 text-xl leading-snug">
              <a href="{venue_url(v)}" class="after:absolute after:inset-0 after:content-['']">{v['name']}</a>
            </h3>
            <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-500">{v['summary']}</p>

            <dl class="mt-auto grid grid-cols-3 gap-1 border-t border-line pt-4 text-center">
              <div>{_fact('Seats', cap)}</div>
              <div class="border-x border-line">{_fact('Layout', BLEND_SHORT.get(blend))}</div>
              <div>{_fact('Budget', PRICE_GLYPH.get(price))}</div>
            </dl>
          </div>
        </article>
"""


def cards(vs, priority_count=0):
    return "".join(card(v, priority=(i < priority_count)) for i, v in enumerate(vs))


def unconfirmed_notice(stats_, *, compact=False):
    """The banner that keeps the directory honest about what it does and does not know."""
    pad = "p-4" if compact else "p-5"
    return f"""        <aside class="rounded-card border border-champagne-300 bg-champagne-50/70 {pad}" aria-label="About these listings">
          <div class="flex gap-3">
            <svg aria-hidden="true" viewBox="0 0 24 24" class="mt-0.5 size-5 shrink-0 text-champagne-700" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>
            </svg>
            <p class="text-[13px] leading-relaxed text-ink-600">
              <strong class="font-semibold text-botanical-900">Capacities and prices are not filled in yet.</strong>
              Each listing here is a real venue with a link to its own events page, but we only publish
              a capacity, a layout or a price once it has been confirmed against that page &mdash;
              {stats_['with_capacity']} of {stats_['total']} so far. A dash means &ldquo;not confirmed&rdquo;, never
              &ldquo;small&rdquo; or &ldquo;cheap&rdquo;.
              <a class="font-medium text-botanical-700 underline decoration-champagne-400 underline-offset-4" href="/methodology/">How we source listings</a>.
            </p>
          </div>
        </aside>
"""
