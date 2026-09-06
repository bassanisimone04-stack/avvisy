# -*- coding: utf-8 -*-
"""
The venue filter component: sticky rail on desktop, bottom sheet on mobile.

Four facets were specified — state, capacity, indoor/outdoor blend, price — and
all four are here. Two of them (state, type) filter on data confirmed at the
source today; the other three populate as capacities and rates are verified.
Until then they correctly return nothing rather than pretending.
"""
from chrome import STATE_NAV

CAPACITY_OPTIONS = [
    ("any", "Any guest count"),
    ("micro", "Under 50 — micro-wedding"),
    ("small", "50–100 guests"),
    ("medium", "100–200 guests"),
    ("large", "200+ guests"),
]

TYPE_OPTIONS = [
    ("", "Any type"),
    ("conservatory", "Conservatory"),
    ("palm-house", "Palm house"),
    ("greenhouse", "Greenhouse"),
    ("orangery", "Orangery"),
    ("atrium", "Atrium"),
    ("botanical-garden", "Botanical garden"),
    ("limonaia", "Limonaia (Italy)"),
]

BLENDS = [
    ("enclosed", "Fully enclosed", "Glazed on all sides &mdash; rain-proof year-round"),
    ("hybrid", "Glass + garden", "Glasshouse reception, garden ceremony"),
    ("openair", "Open-air adjacent", "Sides that lift or fold away"),
]

PRICES = [("1", "$"), ("2", "$$"), ("3", "$$$"), ("4", "$$$$")]


def _state_options(venues):
    """Only states that actually have a listing — no empty facets."""
    present = {v["state_slug"] for v in venues}
    opts = [("", "All states")]
    seen = set()
    for s in STATE_NAV:
        if s["slug"] in present:
            opts.append((s["slug"], s["name"]))
            seen.add(s["slug"])
    for v in venues:
        if v["state_slug"] not in seen:
            seen.add(v["state_slug"])
            label = v["state"] + (" (destination)" if v["country"] != "US" else "")
            opts.append((v["state_slug"], label))
    return opts


def _controls(id_prefix, venues, show_state=True):
    state_block = ""
    if show_state:
        opts = "\n".join(f'            <option value="{val}">{label}</option>'
                         for val, label in _state_options(venues))
        state_block = f"""      <div>
        <label class="label" for="{id_prefix}-state">State</label>
        <select id="{id_prefix}-state" class="field-select" data-filter="state">
{opts}
        </select>
      </div>

"""
    type_opts = "\n".join(f'            <option value="{v}">{l}</option>' for v, l in TYPE_OPTIONS)
    cap_opts = "\n".join(f'            <option value="{v}">{l}</option>' for v, l in CAPACITY_OPTIONS)

    blend_chips = "\n".join(
        f"""          <button type="button" class="chip w-full justify-start text-left" data-filter-chip="blend" value="{val}" aria-pressed="false">
            <span class="flex flex-col">
              <span class="font-semibold">{label}</span>
              <span class="text-xs font-normal opacity-70">{hint}</span>
            </span>
          </button>""" for val, label, hint in BLENDS)

    price_chips = "\n".join(
        f"""          <button type="button" class="chip justify-center px-3 py-2.5" data-filter-chip="price" value="{val}" aria-pressed="false">
            <span class="text-sm font-bold">{glyph}</span>
          </button>""" for val, glyph in PRICES)

    return f"""      <div>
        <label class="label" for="{id_prefix}-q">Search</label>
        <div class="relative">
          <svg aria-hidden="true" viewBox="0 0 24 24" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-300" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="{id_prefix}-q" type="search" class="field pl-10" data-filter="q"
                 placeholder="Venue or city" autocomplete="off">
        </div>
      </div>

{state_block}      <div>
        <label class="label" for="{id_prefix}-type">Venue type</label>
        <select id="{id_prefix}-type" class="field-select" data-filter="type">
{type_opts}
        </select>
      </div>

      <div>
        <label class="label" for="{id_prefix}-capacity">
          Capacity
          <span class="font-normal text-ink-500">&middot; confirmed listings only</span>
        </label>
        <select id="{id_prefix}-capacity" class="field-select" data-filter="capacity">
{cap_opts}
        </select>
      </div>

      <fieldset>
        <legend class="label">
          Indoor / outdoor blend
          <span class="font-normal text-ink-500">&middot; confirmed listings only</span>
        </legend>
        <div class="grid gap-2">
{blend_chips}
        </div>
      </fieldset>

      <fieldset>
        <legend class="label">
          Price range
          <span class="font-normal text-ink-500">&middot; confirmed listings only</span>
        </legend>
        <div class="grid grid-cols-4 gap-2">
{price_chips}
        </div>
      </fieldset>

      <button type="button" class="btn-outline btn-sm w-full" data-filter-reset>
        <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
        Reset all filters
      </button>
"""


def sidebar(venues, show_state=True):
    return f"""      <aside class="hidden lg:block" aria-labelledby="filters-heading">
        <form class="card sticky top-24 space-y-5 p-6" role="search"
              aria-label="Filter greenhouse wedding venues" onsubmit="return false;">
          <div class="flex items-center justify-between">
            <h2 id="filters-heading" class="font-sans text-sm font-bold uppercase tracking-[0.14em] text-botanical-800">Filters</h2>
            <span class="badge-gold" data-result-count>&nbsp;</span>
          </div>

{_controls("f", venues, show_state)}
        </form>
      </aside>
"""


def drawer(venues, show_state=True):
    return f"""      <!-- Mobile filter drawer -->
      <div id="filter-drawer" hidden class="fixed inset-0 z-[60] lg:hidden">
        <div class="absolute inset-0 bg-botanical-950/50 backdrop-blur-sm" data-drawer-close></div>
        <div role="dialog" aria-modal="true" aria-label="Filter venues"
             class="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-cream p-6 pb-10 shadow-lift">
          <div class="mx-auto mb-5 h-1 w-10 rounded-full bg-line-strong"></div>
          <div class="mb-5 flex items-center justify-between">
            <h2 class="text-xl">Filter venues</h2>
            <button type="button" class="grid size-9 place-items-center rounded-lg border border-line-strong text-ink-700" data-drawer-close>
              <span class="sr-only">Close filters</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <form class="space-y-5" role="search" aria-label="Filter greenhouse wedding venues (mobile)" onsubmit="return false;">
{_controls("m", venues, show_state)}
          </form>

          <button type="button" class="btn-primary mt-6 w-full" data-drawer-toggle aria-expanded="true">
            Show <span data-result-count>venues</span>
          </button>
        </div>
      </div>
"""


def toolbar():
    return """        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm text-ink-500">
            <strong class="font-semibold text-botanical-800" data-result-count>&nbsp;</strong> match your filters
          </p>

          <div class="flex items-center gap-2">
            <button type="button" class="btn-outline btn-sm lg:hidden" data-drawer-toggle aria-expanded="false" aria-controls="filter-drawer">
              <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
              Filters
            </button>
            <label class="sr-only" for="sort">Sort venues</label>
            <select id="sort" class="field-select w-auto py-2 text-[13px]" data-sort>
              <option value="name">Name A–Z</option>
              <option value="capacity-desc">Largest confirmed capacity</option>
              <option value="capacity-asc">Smallest confirmed capacity</option>
              <option value="price-asc">Lowest confirmed price</option>
            </select>
          </div>
        </div>

        <div hidden class="mt-4">
          <div class="flex flex-wrap gap-2" data-active-filters></div>
        </div>
"""


def empty_state():
    return """        <div hidden data-empty-state class="card mt-6 p-12 text-center">
          <span class="mx-auto grid size-14 place-items-center rounded-full bg-botanical-50 text-botanical-600">
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </span>
          <h3 class="mt-5 text-xl">Nothing matches that combination</h3>
          <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
            Capacity, layout and price filters only match listings whose details we have
            confirmed against the venue&rsquo;s own page &mdash; that work is still in progress, so
            those three filters currently return nothing. State, type and search work on
            every listing.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" class="btn-primary btn-sm" data-filter-reset>Clear filters</button>
            <a class="btn-outline btn-sm" href="/methodology/">How we source listings</a>
          </div>
        </div>
"""
