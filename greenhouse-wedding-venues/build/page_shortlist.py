# -*- coding: utf-8 -*-
"""
/shortlist/ — a client-only "save & compare" tool.

There is no backend: what a visitor saves lives in their browser's
localStorage (see assets/js/shortlist.js) and is rendered into this page's
placeholders at runtime from /assets/data/venues.json — a public, trimmed
copy of the venue data that build/build.py writes alongside the HTML.

The page therefore has no venue-specific content for a crawler to index — an
empty shell is all any bot will ever see here — so it is marked noindex. It is
a personal tool, not a piece of content competing for search traffic, and
pretending otherwise would just be thin content with someone else's name on it.
"""
from chrome import head, header, footer, breadcrumbs
from cards import stats

HEART_SVG = ('<svg aria-hidden="true" viewBox="0 0 24 24" class="size-6" fill="none" '
             'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
             '<path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.3 5 5.7 5c1.9 0 3.5 1 4.3 2.5'
             'C10.8 6 12.4 5 14.3 5c3.4 0 5.2 3.4 3.7 6.7-2.5 4.7-10 9.3-10 9.3Z"/></svg>')


def build(all_venues):
    st = stats(all_venues)
    title = "Your Shortlist | Glasshouse Weddings"
    desc = ("Venues you have saved while browsing, kept in this browser only, with a tool to "
            "compare their confirmed details side by side.")
    crumbs = [("Home", "/"), ("Your shortlist", None)]

    return head(title, desc, "/shortlist/", og_image="/assets/img/patterns/wide-01.svg",
                robots="noindex,follow") + header() + f"""
  <main id="main">
{breadcrumbs(crumbs)}
    <header class="shell pb-10 pt-8">
      <p class="eyebrow-gold">Saved on this device</p>
      <h1 class="mt-3 max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.08] sm:text-5xl">
        Your shortlist
      </h1>
      <p class="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        Tap the heart on any listing to save it here. Everything on this page lives in this
        browser&rsquo;s storage &mdash; nothing is sent to us, there is no account, and clearing
        your browser data clears this list. It will not follow you to another device or browser.
        Save two to four venues to compare their confirmed details side by side.
      </p>
    </header>

    <section class="shell pb-24" data-shortlist-page>
      <noscript>
        <div class="card p-6 text-sm text-ink-600">
          The shortlist tool needs JavaScript enabled to read what you have saved in this browser.
        </div>
      </noscript>

      <div data-shortlist-empty class="card p-12 text-center">
        <span class="mx-auto grid size-14 place-items-center rounded-full bg-botanical-50 text-botanical-600">
          {HEART_SVG}
        </span>
        <h2 class="mt-5 text-xl">Nothing saved yet</h2>
        <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
          Browse the directory and tap the heart on any listing to save it here.
        </p>
        <a class="btn-primary btn-sm mt-6" href="/venues/">Browse venues</a>
      </div>

      <div data-shortlist-controls hidden class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-ink-500">
          <strong class="font-semibold text-botanical-800" data-shortlist-total>0</strong> saved
        </p>
        <div class="flex gap-2">
          <button type="button" class="btn-outline btn-sm" data-shortlist-copy>
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
            <span data-copy-label>Copy list</span>
          </button>
          <button type="button" class="btn-outline btn-sm" data-shortlist-clear>Clear shortlist</button>
        </div>
      </div>

      <div data-shortlist-grid hidden class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>

      <div data-compare-wrap hidden class="mt-14 border-t border-line pt-14">
        <p class="eyebrow-gold">Side by side</p>
        <h2 class="mt-3 text-2xl">Compare selected venues</h2>
        <p class="mt-2 text-sm text-ink-500" data-compare-hint>
          Check &ldquo;Compare this venue&rdquo; on two to four saved listings above to see them here.
          Only fields confirmed against the venue&rsquo;s own site are shown &mdash; the rest is a dash,
          same as everywhere else on this site.
        </p>
        <div hidden class="mt-6 overflow-x-auto rounded-card border border-line" data-compare-table></div>
      </div>
    </section>
  </main>
""" + footer(st)
