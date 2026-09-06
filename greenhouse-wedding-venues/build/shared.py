# -*- coding: utf-8 -*-
"""Small shared renderers used by more than one page builder."""

HEART_SVG = ('<svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" '
             'stroke="currentColor" stroke-width="2">'
             '<path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.3 5 5.7 5c1.9 0 3.5 1 4.3 2.5'
             'C10.8 6 12.4 5 14.3 5c3.4 0 5.2 3.4 3.7 6.7-2.5 4.7-10 9.3-10 9.3Z"/></svg>')


def escape_attr(s):
    return (s.replace("&", "&amp;").replace('"', "&quot;")
             .replace("<", "&lt;").replace(">", "&gt;"))


def shortlist_button(v, *, cls="absolute right-3 top-3"):
    """
    A save/heart toggle, wired up client-side by assets/js/shortlist.js.

    It always renders unpressed from the server — there is no session, so the
    server cannot know what a visitor has saved. JS reads localStorage on load
    and corrects aria-pressed before the button is interacted with, which is
    also why the button must not be the only way to reach a venue (it never
    gates content, only bookmarks it).
    """
    name = escape_attr(v["name"])
    return (f'<button type="button" class="shortlist-btn {cls}" data-shortlist-toggle '
            f'data-shortlist-slug="{v["slug"]}" data-shortlist-name="{name}" '
            f'aria-pressed="false" aria-label="Save {name} to your shortlist">{HEART_SVG}</button>')


def checklist(items, *, key, copy_intro=None):
    """
    An interactive, localStorage-backed checklist (assets/js/checklist.js).

    `items` is a list of (question, why) pairs — the same content a static
    list would carry, just checkable, with progress saved per `key` and a
    "copy as list" button that builds a plain-text version of the questions
    (never the "why" — that explanation is for the couple, not the venue).
    Nothing here is sent anywhere; see /methodology/.
    """
    intro_attr = f' data-checklist-copy-intro="{escape_attr(copy_intro)}"' if copy_intro else ""
    rows = []
    for i, (q, why) in enumerate(items):
        rows.append(f"""          <li data-checklist-row class="checklist-row flex items-start gap-3 p-5">
            <input type="checkbox" data-checklist-item id="cl-{key}-{i}"
                   class="mt-0.5 size-4 shrink-0 rounded border-line-strong text-botanical-800 focus:outline-none focus:ring-4 focus:ring-botanical-800/10">
            <label for="cl-{key}-{i}" class="flex-1 cursor-pointer">
              <span data-checklist-question class="checklist-q block text-sm font-semibold text-botanical-900">{q}</span>
              <span class="mt-0.5 block text-[13px] leading-relaxed text-ink-500">{why}</span>
            </label>
          </li>""")
    return f"""        <div class="not-prose mt-6 overflow-hidden rounded-card border border-line bg-shell" data-checklist data-checklist-key="{key}"{intro_attr}>
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-botanical-50/40 p-5">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-botanical-600">Interactive checklist</p>
              <p class="mt-1 text-sm text-ink-500" data-checklist-progress>0 of {len(items)} checked</p>
            </div>
            <div class="flex shrink-0 gap-2">
              <button type="button" class="btn-outline btn-sm" data-checklist-copy>
                <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="1.5"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                <span data-copy-label>Copy as list</span>
              </button>
              <button type="button" class="btn-outline btn-sm" data-checklist-reset>Reset</button>
            </div>
          </div>
          <ul class="divide-y divide-line">
{chr(10).join(rows)}
          </ul>
          <p class="border-t border-line bg-botanical-50/30 px-5 py-3 text-xs text-ink-400">
            Checked state is saved in this browser only &mdash;
            <a class="font-medium text-botanical-700 underline decoration-champagne-400 underline-offset-4" href="/methodology/">how we handle data</a>.
          </p>
        </div>
"""


def faq_accordion(items, *, size="md"):
    """Visible FAQ. The FAQPage JSON-LD is generated from the SAME list, so the
    two can never disagree — see scripts/check-faq-parity.mjs."""
    text = "text-[17px]" if size == "md" else "text-lg"
    out = []
    for i, (q, a) in enumerate(items):
        out.append(f"""          <details class="card group p-0" {'open' if i == 0 else ''}>
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display {text} text-botanical-900 marker:hidden">
              {q}
              <span class="grid size-7 shrink-0 place-items-center rounded-full bg-botanical-50 text-botanical-700 transition-transform duration-300 group-open:rotate-45">
                <svg aria-hidden="true" viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </span>
            </summary>
            <div class="px-5 pb-5 text-[15px] leading-relaxed text-ink-500 [&_a]:font-medium [&_a]:text-botanical-700 [&_a]:underline [&_a]:decoration-champagne-400 [&_a]:underline-offset-4">
              <p>{a}</p>
            </div>
          </details>""")
    return "\n".join(out)


def faq_ld(items):
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in items
        ],
    }


def faq_section(items, *, heading, kicker="Answers", intro="", hid="faq-heading"):
    intro_html = f'\n          <p class="mt-4 text-[15px] leading-relaxed text-ink-500">{intro}</p>' if intro else ""
    return f"""    <section class="shell py-20" aria-labelledby="{hid}">
      <div class="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p class="eyebrow-gold">{kicker}</p>
          <h2 id="{hid}" class="mt-3 text-3xl">{heading}</h2>{intro_html}
        </div>
        <div class="space-y-3">
{faq_accordion(items)}
        </div>
      </div>
    </section>
"""


def ad_slot(label, min_h, *, cls="", tag="aside"):
    """An empty, reserved advertising container. Reserving the height keeps late
    creative from shifting the layout (CLS)."""
    return f"""        <{tag} class="ad-slot {cls}" aria-label="Advertisement">
          <span class="ad-label">Advertising slot</span>
          <div class="grid place-items-center text-sm text-ink-400" style="min-height:{min_h}px">
            {label} &mdash; unsold
          </div>
        </{tag}>
"""


def section_heading(kicker, title, body="", hid=""):
    body_html = f'\n          <p class="mt-4 text-[17px] leading-relaxed text-ink-500">{body}</p>' if body else ""
    id_attr = f' id="{hid}"' if hid else ""
    return f"""        <div class="max-w-2xl">
          <p class="eyebrow-gold">{kicker}</p>
          <h2{id_attr} class="mt-3 text-3xl sm:text-4xl">{title}</h2>{body_html}
        </div>
"""
