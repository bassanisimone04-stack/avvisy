# -*- coding: utf-8 -*-
"""Small shared renderers used by more than one page builder."""


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
