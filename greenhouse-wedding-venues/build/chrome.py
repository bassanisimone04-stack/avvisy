# -*- coding: utf-8 -*-
"""
Shared page chrome: <head>, header, footer, breadcrumbs.

Nothing in here states a fact about a venue, a price or the size of the
directory. Counts that appear in the UI are computed from data/venues.json at
build time, never hard-coded — so the site cannot drift into claiming more than
it lists.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = json.loads((ROOT / "data" / "site.json").read_text(encoding="utf-8"))

NAME = SITE["name"]
BASE = SITE["base_url"].rstrip("/")

# Only routes that actually exist are linked. Adding a page? Add it here too.
STATE_NAV = SITE["nav_states"]


def head(title, description, canonical, *, og_image, og_type="website", extra="",
         robots="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"):
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- ============ PRIMARY SEO ============ -->
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{BASE}{canonical}">
  <meta name="robots" content="{robots}">
  <meta name="theme-color" content="#1B4332">

  <!-- ============ SOCIAL ============ -->
  <meta property="og:site_name" content="{NAME}">
  <meta property="og:type" content="{og_type}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:url" content="{BASE}{canonical}">
  <meta property="og:image" content="{BASE}{og_image}">
  <meta name="twitter:card" content="summary_large_image">

  <!-- ============ FONTS (preconnected, swap, 2 families only) ============ -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">

  <!-- ============ STYLES (one compiled, minified file — no CDN, no FOUC) ============ -->
  <link rel="stylesheet" href="/assets/css/site.css">

  <link rel="icon" href="/assets/img/brand/favicon.svg" type="image/svg+xml">
  <script>document.documentElement.classList.add('js');</script>
  <script defer src="/assets/js/site.js"></script>
{extra}</head>
"""


def _state_links(cls):
    return "\n".join(
        f'              <li><a class="{cls}" href="/venues/{s["slug"]}/">'
        f'Greenhouse wedding venues in {s["name"]}</a></li>'
        for s in STATE_NAV)


def header(active=""):
    def cur(key):
        return ' aria-current="page"' if active == key else ""
    return f"""<body class="bg-cream antialiased">
  <a class="skip-link" href="#main">Skip to main content</a>

  <!-- ================= SITE HEADER ================= -->
  <header data-header class="sticky top-0 z-50 border-b border-line/70 bg-cream/85 backdrop-blur-md transition-shadow duration-300 [&.is-stuck]:shadow-soft">
    <div class="shell flex h-[72px] items-center justify-between gap-6">

      <a href="/" class="flex items-center gap-2.5" aria-label="{NAME} — home">
        <span class="grid size-9 place-items-center rounded-lg bg-botanical-800 text-champagne-500">
          <svg aria-hidden="true" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3 3 10v11h18V10z"/><path d="M12 3v18M3 10h18M7.5 6.5 7.5 21M16.5 6.5V21M3 15.5h18"/>
          </svg>
        </span>
        <span class="font-display text-lg font-bold leading-none text-botanical-900">Glasshouse<span class="text-champagne-600">Weddings</span></span>
      </a>

      <nav class="hidden items-center gap-8 lg:flex" aria-label="Primary">
        <a class="nav-link" href="/venues/"{cur('venues')}>Browse venues</a>

        <div class="group relative">
          <button type="button" class="nav-link inline-flex items-center gap-1" aria-expanded="false" aria-haspopup="true">
            Venues by state
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div class="invisible absolute left-1/2 top-full z-50 w-[19rem] -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <ul class="card p-2">
{_state_links("block rounded-lg px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-botanical-50 hover:text-botanical-800")}
              <li class="mt-1 border-t border-line pt-1"><a class="block rounded-lg px-3 py-2 text-sm font-semibold text-botanical-800 hover:bg-botanical-50" href="/venues/">Every listing &rarr;</a></li>
            </ul>
          </div>
        </div>

        <a class="nav-link" href="/italy-destination-weddings/"{cur('italy')}>Italy</a>
        <a class="nav-link" href="/blog/"{cur('blog')}>Guides</a>
        <a class="nav-link" href="/methodology/"{cur('methodology')}>How we source</a>
      </nav>

      <div class="flex items-center gap-3">
        <a class="hidden btn-gold btn-sm md:inline-flex" href="/venues/">Find a glasshouse</a>

        <button type="button" data-nav-toggle aria-expanded="false" aria-controls="mobile-nav"
                class="grid size-10 place-items-center rounded-lg border border-line-strong text-botanical-800 lg:hidden">
          <span class="sr-only">Open menu</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
    </div>

    <div id="mobile-nav" hidden class="border-t border-line bg-cream lg:hidden">
      <nav class="shell space-y-1 py-5" aria-label="Mobile">
        <a class="block rounded-lg px-3 py-2.5 font-medium text-ink-700 hover:bg-botanical-50" href="/venues/">Browse all venues</a>
        <p class="px-3 pt-4 eyebrow">Venues by state</p>
        <ul class="space-y-1">
{_state_links("block rounded-lg px-3 py-2.5 text-sm text-ink-700 hover:bg-botanical-50")}
        </ul>
        <p class="px-3 pt-4 eyebrow">More</p>
        <a class="block rounded-lg px-3 py-2.5 text-sm text-ink-700 hover:bg-botanical-50" href="/italy-destination-weddings/">Greenhouse wedding venues in Italy</a>
        <a class="block rounded-lg px-3 py-2.5 text-sm text-ink-700 hover:bg-botanical-50" href="/blog/">Planning guides</a>
        <a class="block rounded-lg px-3 py-2.5 text-sm text-ink-700 hover:bg-botanical-50" href="/methodology/">How we source listings</a>
        <div class="pt-4">
          <a class="btn-gold w-full" href="/venues/">Find a glasshouse</a>
        </div>
      </nav>
    </div>
  </header>
"""


def footer(stats):
    """stats: dict from the venue data — every number here is computed, not written."""
    state_items = "\n".join(
        f'            <li><a class="text-botanical-200/85 transition-colors hover:text-white" '
        f'href="/venues/{s["slug"]}/">Greenhouse wedding venues {s["name"]}</a></li>'
        for s in STATE_NAV)

    return f"""
  <!-- ================= FOOTER ================= -->
  <footer class="mt-24 bg-botanical-950 text-botanical-100">
    <div class="shell py-16 lg:py-20">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

        <div>
          <a href="/" class="flex items-center gap-2.5" aria-label="{NAME} — home">
            <span class="grid size-9 place-items-center rounded-lg bg-champagne-500 text-botanical-950">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3 3 10v11h18V10z"/><path d="M12 3v18M3 10h18M7.5 6.5 7.5 21M16.5 6.5V21M3 15.5h18"/>
              </svg>
            </span>
            <span class="font-display text-lg font-bold leading-none text-white">Glasshouse<span class="text-champagne-500">Weddings</span></span>
          </a>
          <p class="mt-5 max-w-sm text-sm leading-relaxed text-botanical-200/80">
            A directory of greenhouse, glasshouse and conservatory wedding venues.
            Listings are compiled from venues&rsquo; own websites, and every detail we
            have not confirmed at the source is marked as unconfirmed rather than guessed.
          </p>
          <p class="mt-4 text-sm">
            <a class="font-medium text-champagne-400 underline decoration-champagne-500/50 underline-offset-4 hover:text-champagne-300" href="/methodology/">
              How we source and verify listings
            </a>
          </p>
        </div>

        <nav aria-labelledby="f-states">
          <h2 id="f-states" class="font-sans text-xs font-bold uppercase tracking-[0.18em] text-champagne-500">By state</h2>
          <ul class="mt-5 space-y-3 text-sm">
{state_items}
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/italy-destination-weddings/">Greenhouse wedding venue Italy</a></li>
          </ul>
        </nav>

        <nav aria-labelledby="f-types">
          <h2 id="f-types" class="font-sans text-xs font-bold uppercase tracking-[0.18em] text-champagne-500">By type</h2>
          <ul class="mt-5 space-y-3 text-sm">
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/venues/?type=conservatory">Conservatory wedding venues</a></li>
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/venues/?type=botanical-garden">Botanical garden wedding venues</a></li>
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/venues/?type=palm-house">Palm house venues</a></li>
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/venues/?type=greenhouse">Working greenhouse venues</a></li>
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/venues/">Every listing</a></li>
          </ul>
        </nav>

        <nav aria-labelledby="f-guides">
          <h2 id="f-guides" class="font-sans text-xs font-bold uppercase tracking-[0.18em] text-champagne-500">Guides</h2>
          <ul class="mt-5 space-y-3 text-sm">
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/blog/greenhouse-wedding-cost/">Greenhouse wedding cost</a></li>
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/blog/rain-proof-outdoor-wedding-venues/">Rain-proof outdoor wedding venues</a></li>
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/blog/">All guides</a></li>
            <li><a class="text-botanical-200/85 transition-colors hover:text-white" href="/methodology/">Editorial standards</a></li>
          </ul>
        </nav>
      </div>

      <div class="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-botanical-200/60 md:flex-row md:items-center md:justify-between">
        <p>
          &copy; <span data-year>2026</span> {NAME}.
          {stats['total']} listings across {stats['states']} states and regions.
          No paid placements.
        </p>
        <p>
          Details are compiled from venue websites and can change &mdash;
          always confirm directly with the venue.
        </p>
      </div>
    </div>
  </footer>

  <script defer src="/assets/js/venue-filters.js"></script>
</body>
</html>
"""


def breadcrumbs(items):
    """items: [(label, href|None)] — the last item is the current page."""
    sep = ('<svg aria-hidden="true" viewBox="0 0 24 24" class="size-3.5 text-ink-300" fill="none" '
           'stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>')
    parts = []
    for label, href in items:
        if href:
            parts.append(f'      <li class="flex items-center gap-2"><a class="transition-colors hover:text-botanical-800" href="{href}">{label}</a>{sep}</li>')
        else:
            parts.append(f'      <li class="font-medium text-botanical-800" aria-current="page">{label}</li>')
    inner = "\n".join(parts)
    return f"""    <nav aria-label="Breadcrumb" class="shell pt-6">
    <ol class="flex flex-wrap items-center gap-2 text-[13px] text-ink-500">
{inner}
    </ol>
    </nav>
"""


def ld(obj, comment):
    return (f'  <!-- {comment} -->\n  <script type="application/ld+json">\n'
            + json.dumps(obj, indent=2, ensure_ascii=False) + "\n  </script>\n")
