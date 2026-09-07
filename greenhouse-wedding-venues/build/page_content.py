# -*- coding: utf-8 -*-
"""Editorial pages: the guides hub, two guides, and the methodology page."""
from chrome import head, header, footer, ld, breadcrumbs, BASE, NAME
from cards import stats
from shared import faq_ld, faq_section, checklist
import faqs

AUTHOR = f"{NAME} editorial"
LAST_UPDATED = "September 7, 2026"


def _breadcrumb_ld(crumbs):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "name": label,
                 **({"item": f"{BASE}{href}"} if href else {})}
                for i, (label, href) in enumerate(crumbs)]}


def _posting_ld(*, path, headline, desc, published, modified, section, keywords, words, minutes, image):
    return {
        "@context": "https://schema.org", "@type": "BlogPosting",
        "@id": f"{BASE}{path}#article",
        "isPartOf": {"@id": f"{BASE}/#website"},
        "mainEntityOfPage": {"@type": "WebPage", "@id": f"{BASE}{path}"},
        "url": f"{BASE}{path}",
        "headline": headline,
        "description": desc,
        "image": {"@type": "ImageObject", "url": f"{BASE}{image}", "width": 1600, "height": 900},
        "datePublished": published, "dateModified": modified,
        # A named person would be a fiction until a real byline exists; the
        # organisation is the accountable publisher either way.
        "author": {"@type": "Organization", "name": NAME, "url": f"{BASE}/"},
        "publisher": {"@id": f"{BASE}/#organization"},
        "inLanguage": "en-US", "articleSection": section, "keywords": keywords,
        "wordCount": words, "timeRequired": f"PT{minutes}M",
    }


def _article_shell(*, path, title, desc, h1, dek, section, read, published, modified,
                   toc, body, faq_items, faq_heading, related, keywords, words, all_venues,
                   image="/assets/img/patterns/wide-01.svg", image_alt=""):
    st = stats(all_venues)
    crumbs = [("Home", "/"), ("Guides", "/blog/"), (h1.split(":")[0], None)]
    extra = (ld(_posting_ld(path=path, headline=h1, desc=desc, published=published, modified=modified,
                            section=section, keywords=keywords, words=words,
                            minutes=read, image=image), "Schema: BlogPosting")
             + ld(_breadcrumb_ld(crumbs), "Schema: BreadcrumbList")
             + ld(faq_ld(faq_items), "Schema: FAQPage — mirrors the visible FAQ"))

    toc_links = "\n".join(
        f'            <li><a class="block rounded-lg px-3 py-2 text-[13px] leading-snug text-ink-500 '
        f'transition-colors hover:bg-botanical-50 hover:text-botanical-800 '
        f'aria-[current=true]:bg-botanical-50 aria-[current=true]:font-semibold '
        f'aria-[current=true]:text-botanical-800" href="#{sid}">{label}</a></li>'
        for sid, label in toc)

    related_items = "\n".join(f"""            <li>
              <a class="group flex gap-3" href="{href}">
                <span class="mt-1 size-1.5 shrink-0 rounded-full bg-champagne-500"></span>
                <span>
                  <span class="block text-[10px] font-bold uppercase tracking-wider text-champagne-700">{cat}</span>
                  <span class="block text-sm font-medium leading-snug text-ink-700 transition-colors group-hover:text-botanical-800">{label}</span>
                </span>
              </a>
            </li>""" for href, label, cat in related)

    return head(title, desc, path, og_type="article", og_image=image, extra=extra) + header("blog") + f"""
  <div class="sticky top-[72px] z-40 h-0.5 w-full bg-transparent" aria-hidden="true">
    <div data-reading-progress class="h-full origin-left scale-x-0 bg-champagne-500 transition-transform duration-150"></div>
  </div>

  <main id="main">
{breadcrumbs(crumbs)}
    <header class="shell pb-10 pt-8">
      <div class="max-w-3xl">
        <div class="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em]">
          <span class="text-champagne-700">{section}</span>
          <span class="text-ink-500">{read} min read</span>
        </div>

        <h1 class="mt-4 font-display text-[2.25rem] font-semibold leading-[1.06] sm:text-5xl lg:text-[3.4rem]">{h1}</h1>

        <p class="mt-5 text-xl leading-relaxed text-ink-500">{dek}</p>

        <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6 text-sm">
          <p class="font-semibold text-botanical-900">By {AUTHOR}</p>
          <p class="text-ink-500">
            Published <time datetime="{published[:10]}">{published[:10]}</time> &middot;
            Updated <time datetime="{modified[:10]}">{modified[:10]}</time>
          </p>
          <button type="button" class="btn-outline btn-sm ml-auto" data-copy-link>
            <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>
            <span data-copy-label>Share</span>
          </button>
        </div>
      </div>
    </header>

    <figure class="shell m-0">
      <img src="{image}" alt="{image_alt}"{' aria-hidden="true"' if not image_alt else ''} width="1600" height="900"
           fetchpriority="high" decoding="async"
           class="aspect-[16/9] w-full rounded-card object-cover sm:aspect-[16/6]">
    </figure>

    <div class="shell mt-14 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)_300px] lg:items-start">

      <nav class="hidden min-w-0 lg:block lg:sticky lg:top-24" data-toc aria-labelledby="toc-heading">
        <h2 id="toc-heading" class="px-3 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-botanical-800">On this page</h2>
        <ol class="mt-3 space-y-0.5">
{toc_links}
        </ol>
        <div class="mt-6 border-t border-line px-3 pt-5">
          <a class="btn-gold btn-sm w-full" href="/venues/">Browse venues</a>
        </div>
      </nav>

      <article class="prose-editorial min-w-0 max-w-none" data-article-body>
{body}
      </article>

      <aside class="space-y-6 lg:sticky lg:top-24">
        <div class="card p-6">
          <h2 class="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-botanical-800">Keep reading</h2>
          <ul class="mt-4 space-y-4">
{related_items}
          </ul>
        </div>

        <div class="card bg-botanical-900 p-6 text-white">
          <h2 class="font-display text-lg text-white">Browse the directory</h2>
          <p class="mt-2 text-sm leading-relaxed text-botanical-100/80">
            {st['total']} glasshouse, conservatory and botanical garden venues, each linked to its
            own events page.
          </p>
          <a class="btn-gold mt-4 w-full" href="/venues/">See the listings</a>
        </div>
      </aside>
    </div>

{faq_section(faq_items, heading=faq_heading, kicker="Quick answers", hid="article-faq")}

    <section class="shell mt-4 pb-8">
      <div class="card flex flex-col gap-5 p-8 sm:flex-row sm:items-center">
        <span class="grid size-12 shrink-0 place-items-center rounded-full bg-botanical-800 text-champagne-400">
          <svg aria-hidden="true" viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 10v11h18V10z"/><path d="M12 3v18M3 10h18"/></svg>
        </span>
        <div>
          <p class="eyebrow-gold">About this guide</p>
          <p class="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-500">
            Written by the {NAME} editorial team. It deliberately contains no averages or median
            prices: we have not surveyed enough venues to publish one honestly, and a number that
            does not match your market is worse than no number at all. What it gives you instead is
            the structure to get a real figure from the venues on your shortlist.
            <a class="font-medium text-botanical-700 underline decoration-champagne-400 underline-offset-4" href="/methodology/">Our editorial standards</a>.
          </p>
        </div>
      </div>
    </section>

  </main>
""" + footer(st)


# ============================================================ COST GUIDE =====
def cost_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>The catering model usually moves the total more than the hire fee does.</li>
            <li>A glasshouse hire fee and a marquee hire fee are not comparable numbers &mdash; price the whole marquee build.</li>
            <li>Working greenhouses are cheap to hire and can be expensive to service; finished conservatories are the reverse.</li>
            <li>Ask what the building <em>needs</em> before you ask what it <em>costs</em>: power, heat, floor protection.</li>
          </ul>
        </aside>

        <h2 id="no-average">Why there is no average price on this page</h2>
        <p>
          Every directory will happily tell you what a greenhouse wedding &ldquo;costs on average&rdquo;.
          We will not, because the category has no meaningful average. A municipal glasshouse that
          hires by the hour and a private estate conservatory booked for a weekend are both
          &ldquo;greenhouse wedding venues&rdquo;, and the gap between them is larger than the gap
          between a village hall and a hotel ballroom.
        </p>
        <p>
          A national median would also be stale the moment it was published, and would tell you
          nothing about your city or your month. So this guide does something more useful: it sets
          out the structure of the cost, so that three quotes from three venues become comparable.
        </p>

        <h2 id="drivers">The five things that actually move the number</h2>
        <h3>1. The catering model</h3>
        <p>
          This is the big one. A venue that permits outside catering lets you buy food at market
          rate. A venue with in-house catering and a minimum spend sets a floor on your budget that
          has nothing to do with the room. Two venues quoting a similar hire fee can differ by a
          factor of two once catering is included, so establish the model before you fall for
          the building.
        </p>
        <h3>2. The day and the season</h3>
        <p>
          Saturday in peak season is the most expensive slot at essentially every venue. Fridays,
          Sundays and weekdays are discounted, often substantially, and off-peak months more so.
          Glasshouses have a particular quirk here: a heated glazed room is genuinely good in
          winter, when demand and prices are lowest.
        </p>
        <h3>3. Who owns the building</h3>
        <p>
          Municipal, university and botanical-garden glasshouses generally charge a hire rate set by
          an institution. Private estates charge what their market bears. Neither is better value in
          the abstract &mdash; institutional venues come with approved-caterer lists, load-in windows
          and public opening hours that constrain the day.
        </p>
        <h3>4. What the hire fee already includes</h3>
        <p>
          Tables, chairs, a ceremony set-up, staffing, cleaning, and the hours you actually get.
          Two quotes are not comparable until you know which of these sit inside each one. Ask for
          the access time, not just the event time: a caterer who cannot get in until 3pm changes
          what is possible.
        </p>
        <h3>5. What the building needs that a hall would not</h3>
        <p>
          This is the part specific to glass, and the part couples miss:
        </p>
        <ul>
          <li><strong>Heating or cooling</strong> that may be billed separately from the hire fee.</li>
          <li><strong>Power.</strong> Growing structures are wired for irrigation, not for a band and a caterer's ovens. Ask for the available amperage in writing and give the figure to your caterer.</li>
          <li><strong>Floor protection,</strong> where the floor is gravel, brick or packed earth.</li>
          <li><strong>Restrooms,</strong> which a working greenhouse on a garden site may not have nearby.</li>
        </ul>

        <h2 id="checklist">The quote checklist</h2>
        <p>
          Send the same list to every venue on your shortlist. The answers, not the headline fee,
          are what you compare. Check items off as you get them, or copy the list to send by email
          &mdash; your progress is saved in this browser so you can come back to it per venue.
        </p>
##COST_CHECKLIST##
        <figure class="my-10">
          <img src="/assets/img/blog/cost-guide-inline.jpg"
               alt="A gardener tending trays of seedlings inside a working greenhouse."
               width="1200" height="750" loading="lazy" decoding="async"
               class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>A working greenhouse, built for propagation rather than events &mdash; the
          cheapest way to marry under glass, and the one most likely to need power, heat and floor
          protection brought in.</figcaption>
        </figure>

        <h2 id="vs-tent">Comparing a glasshouse with a marquee</h2>
        <p>
          The comparison couples usually make &mdash; venue hire against tent hire &mdash; is the
          wrong one. A marquee is not a venue; it is the first item in a build. To reach what a
          glazed room already offers, it needs flooring, lighting, heating or cooling, power,
          restrooms, and somewhere for guests to stand while it rains.
        </p>
        <blockquote>
          Price the whole marquee build, then compare. That is the only version of the comparison
          that tells you anything.
        </blockquote>
        <p>
          There is one more line that belongs on the glasshouse side of the ledger: the contingency
          you no longer carry. An outdoor wedding budget usually holds money back against weather. A
          fully enclosed room retires it &mdash; the argument we make in
          <a href="/blog/rain-proof-outdoor-wedding-venues/">rain-proof outdoor wedding venues</a>.
        </p>

        <figure class="my-10">
          <img src="/assets/img/blog/cost-guide-inline-2.jpg"
               alt="An outdoor wedding ceremony under a white marquee tent, with rows of chairs and an aisle."
               width="1200" height="750" loading="lazy" decoding="async"
               class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>A marquee is not a venue on its own &mdash; it is the first item in a build
          that a glazed room already includes.</figcaption>
        </figure>

        <h2 id="cheaper">Where the savings actually are</h2>
        <ol>
          <li><strong>Move off Saturday.</strong> The largest single lever at almost every venue.</li>
          <li><strong>Consider a heated room off-peak.</strong> Glass is one of the few venue types that improves in bad weather.</li>
          <li><strong>Prioritise open or approved-list catering</strong> if the budget is tight.</li>
          <li><strong>Cut the guest list before the venue.</strong> Smaller rooms exist inside most large glasshouses and price differently.</li>
          <li><strong>Use the planting.</strong> A room full of mature ferns needs far less floral installation than an empty hall.</li>
          <li><strong>Negotiate the minimum, not the fee.</strong> Hire fees are usually fixed; minimum spends often are not, especially off-peak.</li>
        </ol>

        <h2 id="worksheet">Build your own estimate</h2>
        <p>
          Take the hire fee for your actual date, not the headline weekend rate. Add catering at the
          venue&rsquo;s minimum, or at a real quote if catering is open. Add anything from the
          checklist above that the venue confirmed is <em>not</em> included &mdash; heat, power,
          floor. Subtract any weather contingency you were carrying, if the whole day is under cover.
        </p>
        <p>
          Do that for three venues and you will have three numbers that can honestly be compared,
          which is more than any national average would have given you. Start with the
          <a href="/venues/">listings</a>, or narrow by state:
          <a href="/venues/california/">California</a>,
          <a href="/venues/texas/">Texas</a>,
          <a href="/venues/florida/">Florida</a>,
          <a href="/venues/new-york/">New York</a>,
          <a href="/venues/north-carolina/">North Carolina</a>.
        </p>
"""
    cost_checklist_items = [
        ("Hire fee, by day of week and month", "The same room can differ by half between Saturday and Thursday."),
        ("Catering: in-house, approved list or open?", "Usually the single largest line in the budget."),
        ("Minimum spend, and what counts toward it", "Sets a floor independent of your guest count."),
        ("Access and exit times", "Decides whether you pay for extra vendor hours."),
        ("Is heating or cooling included?", "Glazed rooms are the venue type where this is most often extra."),
        ("Available power supply", "Determines whether you need a generator."),
        ("Floor protection for dancing", "Common on gravel, brick and earth floors."),
        ("Seated capacity with a dance floor", "Planting beds and piers reduce usable area."),
        ("Curfew and noise limits", "Shapes the timeline, and sometimes the band contract."),
        ("Deposit, cancellation and postponement terms", "The clause you will care about most if anything changes."),
    ]
    body = body.replace("##COST_CHECKLIST##", checklist(cost_checklist_items, key="cost-guide"))
    return _article_shell(
        path="/blog/greenhouse-wedding-cost/",
        title="Greenhouse Wedding Cost: How to Work Out Your Real Number",
        desc=("What drives the cost of a greenhouse, glasshouse or conservatory wedding venue — the "
              "catering model, the date, what the hire fee includes, and what a glass building needs "
              "that a hall does not. With a quote checklist to compare venues honestly."),
        h1="Greenhouse wedding cost: how to work out your real number",
        dek=("No national average, because the category does not have a useful one. Here is the "
             "structure of the cost instead — and the checklist that makes three quotes comparable."),
        section="Costs", read=11,
        published="2026-09-06T09:00:00-04:00", modified="2026-09-06T09:00:00-04:00",
        toc=[("no-average", "Why there is no average here"),
             ("drivers", "The five things that move the number"),
             ("checklist", "The quote checklist"),
             ("vs-tent", "Glasshouse vs. marquee"),
             ("cheaper", "Where the savings are"),
             ("worksheet", "Build your own estimate")],
        body=body, faq_items=faqs.BLOG_COST,
        faq_heading="Greenhouse wedding cost FAQs",
        related=[("/blog/rain-proof-outdoor-wedding-venues/", "Rain-proof outdoor wedding venues", "Planning"),
                 ("/venues/", "Browse every listing", "Directory"),
                 ("/methodology/", "How we source listings", "About")],
        keywords=["greenhouse wedding cost", "conservatory wedding venues",
                  "botanical garden wedding venues", "glasshouse wedding venue"],
        words=1450, all_venues=all_venues, image="/assets/img/blog/cost-guide.jpg",
        image_alt="A long reception table set for a wedding dinner inside a glass-roofed conservatory.")


# ======================================================== RAIN-PROOF GUIDE ===
def rainproof_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>&ldquo;Rain-proof&rdquo; means no decision has to be made on the day &mdash; not that a plan B exists.</li>
            <li>Cover the whole chain: arrival, ceremony, drinks, dinner, dancing, smokers, vendors.</li>
            <li>A glazed room keeps the daylight and the planting that made you want to be outdoors.</li>
            <li>Ask whether moving the ceremony indoors costs anything, and how long the re-set takes.</li>
          </ul>
        </aside>

        <h2 id="what-it-means">What &ldquo;rain-proof&rdquo; should mean</h2>
        <p>
          Most venues marketed as having a wet-weather option are not rain-proof; they are
          reversible. There is an outdoor plan and an indoor plan, and someone &mdash; usually you,
          usually at about eleven in the morning &mdash; has to choose between them while looking at
          a forecast.
        </p>
        <p>
          A rain-proof venue removes the decision. Every part of the day already happens under a
          solid roof, so rain becomes weather rather than a problem. That is the practical case for
          glasshouses, conservatories and orangeries: they give you the daylight and the planting
          that made you want to be outside, without the contingency that being outside requires.
        </p>

        <h2 id="the-chain">Cover the whole chain, not just the dinner</h2>
        <p>
          Rain finds the gaps between spaces. When you walk a venue, walk the whole guest journey and
          ask what happens to each link in it if it is raining hard:
        </p>
        <ul>
          <li><strong>Arrival.</strong> Where do guests get out of cars, and how far is that from cover?</li>
          <li><strong>Ceremony.</strong> Indoors by default, or moved indoors by decision?</li>
          <li><strong>Drinks.</strong> Often the weakest link — the space between ceremony and dinner is frequently the one outdoors.</li>
          <li><strong>Dinner and dancing.</strong> Usually covered; check whether a re-set is needed between them.</li>
          <li><strong>Photographs.</strong> A glazed room is unusually good here, because the light stays even when the sky does not.</li>
          <li><strong>Vendors.</strong> Caterers and bands loading in across wet grass is how timelines slip.</li>
        </ul>

        <h2 id="options">The three ways to be dry</h2>
        <h3>A glazed venue</h3>
        <p>
          A conservatory, palm house, orangery or working greenhouse where the whole day sits under
          glass. You keep daylight and planting, and the roof, floor, power and restrooms are already
          there. The trade-off is climate: glass gains heat quickly, so ventilation matters more here
          than anywhere else.
        </p>
        <h3>A marquee</h3>
        <p>
          Flexible and available anywhere, but it is a build, not a venue. Flooring, lighting,
          heating or cooling, power, restrooms and guest arrival all have to be solved and paid for
          separately &mdash; which is why the honest cost comparison is against the whole build, as
          set out in our <a href="/blog/greenhouse-wedding-cost/">cost guide</a>.
        </p>
        <h3>An indoor venue with a view</h3>
        <p>
          Entirely dry and usually the cheapest to run. What it does not give you is the thing that
          drew you outdoors in the first place: overhead daylight, and being among planting rather
          than looking at it.
        </p>

        <figure class="my-10">
          <img src="/assets/img/blog/rainproof-guide-inline.jpg"
               alt="Empty wooden chairs set out for an outdoor garden ceremony among flowering plants."
               width="1200" height="750" loading="lazy" decoding="async"
               class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>An outdoor ceremony paired with a glazed reception room: a same-day fallback,
          not the full weather independence of a fully enclosed glasshouse.</figcaption>
        </figure>

        <h2 id="ask">What to ask the venue</h2>
        <ol>
          <li><strong>Can the ceremony, dinner and dancing all happen under solid cover?</strong> If not, which part cannot?</li>
          <li><strong>If the ceremony moves indoors, does it cost anything?</strong> Some venues charge for the re-set; some set both from the morning.</li>
          <li><strong>By when must the call be made?</strong> If there is a decision, there is a deadline — know it before the day.</li>
          <li><strong>Is the glazed room heated, and is heat included?</strong> Rain in April is a different problem from rain in July.</li>
          <li><strong>How is the room ventilated?</strong> A sealed glass box in summer solves rain and creates heat.</li>
          <li><strong>Where do guests arrive under cover?</strong> The car-to-door walk is the detail most often missed.</li>
        </ol>

        <h2 id="find">Finding one</h2>
        <p>
          Filter the directory by venue type &mdash; conservatories, palm houses and orangeries are
          the most likely to be fully enclosed &mdash; then check each venue&rsquo;s own page for
          whether every part of the day can happen inside. We mark the indoor/outdoor blend on a
          listing once we have confirmed it at the source.
        </p>
        <p>
          Start with <a href="/venues/">every listing</a>, or go by state:
          <a href="/venues/california/">California</a>,
          <a href="/venues/texas/">Texas</a>,
          <a href="/venues/florida/">Florida</a>,
          <a href="/venues/new-york/">New York</a>,
          <a href="/venues/north-carolina/">North Carolina</a>.
        </p>
"""
    return _article_shell(
        path="/blog/rain-proof-outdoor-wedding-venues/",
        title="Rain-Proof Outdoor Wedding Venues: The Garden Without the Gamble",
        desc=("How to find a genuinely rain-proof outdoor wedding venue: what the phrase should mean, "
              "the gaps rain finds in a guest journey, and how glasshouse and conservatory wedding "
              "venues compare with a marquee."),
        h1="Rain-proof outdoor wedding venues: the garden without the weather decision",
        dek=("Most 'wet weather options' are a decision waiting to be made. Here is what genuinely "
             "rain-proof looks like, and the questions that tell the two apart."),
        section="Planning", read=8,
        published="2026-09-06T09:00:00-04:00", modified="2026-09-06T09:00:00-04:00",
        toc=[("what-it-means", "What rain-proof should mean"),
             ("the-chain", "Cover the whole chain"),
             ("options", "The three ways to be dry"),
             ("ask", "What to ask the venue"),
             ("find", "Finding one")],
        body=body, faq_items=faqs.BLOG_RAINPROOF,
        faq_heading="Rain-proof venue FAQs",
        related=[("/blog/greenhouse-wedding-cost/", "Greenhouse wedding cost", "Costs"),
                 ("/venues/?type=conservatory", "Conservatory wedding venues", "Directory"),
                 ("/methodology/", "How we source listings", "About")],
        keywords=["rain-proof outdoor wedding venues", "greenhouse wedding venues",
                  "conservatory wedding venues"],
        words=1050, all_venues=all_venues, image="/assets/img/blog/rainproof-guide.jpg",
        image_alt="The glass roof of a Victorian greenhouse against a cloudy sky, with one roof vent open.")


# ===================================================== SMALL VENUES GUIDE ====
def small_venues_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>&ldquo;Small&rdquo; is about the room, not just the guest count &mdash; a propagation house built for 40 beats a ballroom half-filled.</li>
            <li>Municipal and university glasshouses release small rooms and weekday dates more often than private estates do.</li>
            <li>Ask about a minimum guest count as well as a maximum: some venues will not book below a certain number.</li>
            <li>A side room inside a larger conservatory is often cheaper than the same conservatory&rsquo;s main hall.</li>
          </ul>
        </aside>

        <h2 id="what-counts">What &ldquo;small&rdquo; actually means here</h2>
        <p>
          There is no industry-standard cutoff, so this directory uses under 50 guests as the useful
          line for a small or micro-wedding &mdash; small enough that the room itself becomes part of
          the decision, not just the price. A glasshouse built to seat 200 can feel like a warehouse at
          40 people. A propagation house or fern room built for 30 to 60 reads as generous at that
          size, because it was designed for it.
        </p>
        <p>
          That distinction matters more for glasshouses than for most venue types. Planting beds,
          potting benches and structural piers take up floor area that a plain hall would not lose,
          so a room&rsquo;s <em>character</em> at 40 guests depends heavily on whether 40 was ever the
          number it was built around.
        </p>

        <h2 id="where">Where small greenhouse wedding venues actually are</h2>
        <p>
          Three patterns show up repeatedly:
        </p>
        <ul>
          <li><strong>Municipal and university glasshouses.</strong> Built for teaching and propagation rather than events, they are usually smaller than a private estate conservatory, and they release weekday dates more readily because the calendar is not driven by wedding demand alone.</li>
          <li><strong>The side room inside a larger garden.</strong> Many botanical gardens with a grand main conservatory also have a smaller attached house &mdash; an orchid room, a fern house, a working greenhouse &mdash; that is not always on the main wedding page. It is worth asking about directly.</li>
          <li><strong>An off-peak booking of a normally-large room.</strong> A hall built for 200 is not architecturally small, but a weekday morning micro-wedding there can be priced and run like one, with a simplified setup and a fraction of the usual minimum spend.</li>
        </ul>

        <figure class="my-10">
          <img src="/assets/img/blog/small-venues-guide-inline.jpg"
               alt="A small, quiet sitting room inside a rustic conservatory, with wicker chairs and a glazed door."
               width="1200" height="750" loading="lazy" decoding="async"
               class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>A side room inside a larger garden &mdash; the kind of space worth asking about
          directly, since it is not always on the main wedding page.</figcaption>
        </figure>

        <h2 id="cost">Do small venues actually cost less?</h2>
        <p>
          Usually, but not because of the guest count alone. Two things do the real work: who owns the
          building, and which day you book. A municipal or university glasshouse charges a hire rate
          rather than a market price, and a weekday or off-season date is discounted almost everywhere
          &mdash; both apply more easily to a small wedding than a large one, since a 40-guest booking
          is easier to fit into a quiet Tuesday than a 200-guest one is. The building itself being
          small is a smaller factor than either. Our
          <a href="/blog/greenhouse-wedding-cost/">cost guide</a> covers how to structure that
          comparison venue by venue.
        </p>

        <h2 id="ask">What to ask that a large-wedding checklist will not cover</h2>
        <ol>
          <li><strong>Is there a minimum guest count, not just a maximum?</strong> Some private venues will not book under a set number regardless of how the room reads at that size, because their pricing model assumes a minimum spend per head.</li>
          <li><strong>Is the small room a stand-alone booking?</strong> A side room inside a larger conservatory may come with shared access, shared restrooms, or public visitors passing through during the day &mdash; ask what exclusivity actually means for that specific space.</li>
          <li><strong>What does a weekday or off-season date actually save?</strong> Ask for the number, not a general assurance of &ldquo;a discount&rdquo; &mdash; venues that are used to micro-weddings usually have a specific weekday rate already worked out.</li>
          <li><strong>Is there an elopement or micro-wedding package that is not on the main wedding page?</strong> Several gardens keep one separate from their full-buyout wedding offering, priced and staffed differently.</li>
        </ol>

        <figure class="my-10">
          <img src="/assets/img/blog/small-venues-guide-inline-2.jpg"
               alt="A small wedding table set for a handful of guests, with candles and a flower arrangement."
               width="1200" height="750" loading="lazy" decoding="async"
               class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>A table set for a handful of guests, not a hall built for a hundred &mdash;
          the room should match the number, not the other way around.</figcaption>
        </figure>

        <h2 id="find">Finding one</h2>
        <p>
          Filter the directory to <a href="/venues/?capacity=micro">under 50 guests</a> once a
          listing&rsquo;s capacity is confirmed, or filter by
          <a href="/venues/?type=greenhouse">working greenhouse</a> and
          <a href="/venues/?type=botanical-garden">botanical garden</a> venue types, which is where
          most of the smaller rooms above turn up. Then ask the four questions above directly &mdash;
          they will tell you more than the headline capacity will.
        </p>
        <p>
          Start with <a href="/venues/">every listing</a>, or go by state:
          <a href="/venues/california/">California</a>,
          <a href="/venues/texas/">Texas</a>,
          <a href="/venues/florida/">Florida</a>,
          <a href="/venues/new-york/">New York</a>,
          <a href="/venues/north-carolina/">North Carolina</a>.
        </p>
"""
    return _article_shell(
        path="/blog/small-greenhouse-wedding-venues/",
        title="Small Greenhouse Wedding Venues: What to Ask and Where to Look",
        desc=("Finding a small greenhouse wedding venue for under 50 guests: what actually makes a "
              "glasshouse work at a small size, where micro-wedding rooms hide inside larger gardens, "
              "and the questions a large-wedding checklist will not cover."),
        h1="Small greenhouse wedding venues: what to ask and where to look",
        dek=("A room built for 200 does not become intimate just because fewer people show up. Here "
             "is what actually makes a small greenhouse wedding work, and how to find one."),
        section="Micro-weddings", read=8,
        published="2026-09-06T09:00:00-04:00", modified="2026-09-06T09:00:00-04:00",
        toc=[("what-counts", "What 'small' actually means"),
             ("where", "Where small venues actually are"),
             ("cost", "Do small venues cost less?"),
             ("ask", "What to ask"),
             ("find", "Finding one")],
        body=body, faq_items=faqs.BLOG_SMALL_VENUES,
        faq_heading="Small greenhouse wedding venue FAQs",
        related=[("/blog/greenhouse-wedding-cost/", "Greenhouse wedding cost", "Costs"),
                 ("/blog/rain-proof-outdoor-wedding-venues/", "Rain-proof outdoor wedding venues", "Planning"),
                 ("/venues/?capacity=micro", "Browse under-50 listings", "Directory")],
        keywords=["small greenhouse wedding venues", "greenhouse wedding venues",
                  "botanical garden wedding venues"],
        words=1050, all_venues=all_venues, image="/assets/img/blog/small-venues-guide.jpg",
        image_alt="A bride in a veil during an intimate ceremony under string lights in a small glasshouse.")


# ============================================================= BLOG INDEX ====
def blog_index(all_venues):
    st = stats(all_venues)
    path = "/blog/"
    title = "Greenhouse Wedding Planning Guides | Costs, Rain-Proof &amp; Small Venues"
    desc = ("Planning guides for greenhouse, glasshouse and conservatory weddings: how venue costs "
            "are actually built, how to find a genuinely rain-proof venue, and where small greenhouse "
            "wedding venues for under 50 guests actually are.")

    posts = [
        ("/blog/greenhouse-wedding-cost/", "Greenhouse wedding cost: how to work out your real number",
         "No national average — the structure of the cost, and a checklist that makes three quotes comparable.",
         "Costs", "11 min", "2026-09-06", "cost-guide.jpg",
         "A long reception table set for a wedding dinner inside a glass-roofed conservatory."),
        ("/blog/rain-proof-outdoor-wedding-venues/",
         "Rain-proof outdoor wedding venues: the garden without the weather decision",
         "What the phrase should mean, the gaps rain finds in a guest journey, and how glass compares with a marquee.",
         "Planning", "8 min", "2026-09-06", "rainproof-guide.jpg",
         "The glass roof of a Victorian greenhouse against a cloudy sky, with one roof vent open."),
        ("/blog/small-greenhouse-wedding-venues/",
         "Small greenhouse wedding venues: what to ask and where to look",
         "What actually makes a glasshouse work at a small size, and where micro-wedding rooms hide inside larger gardens.",
         "Micro-weddings", "8 min", "2026-09-06", "small-venues-guide.jpg",
         "A bride in a veil during an intimate ceremony under string lights in a small glasshouse."),
    ]

    blog_ld = {
        "@context": "https://schema.org", "@type": "Blog", "@id": f"{BASE}{path}#blog",
        "url": f"{BASE}{path}", "name": f"{NAME} — planning guides",
        "description": desc, "inLanguage": "en-US",
        "publisher": {"@id": f"{BASE}/#organization"},
        "blogPost": [{"@type": "BlogPosting", "headline": t, "url": f"{BASE}{h}",
                      "datePublished": d, "articleSection": c,
                      "author": {"@type": "Organization", "name": NAME}}
                     for h, t, _, c, _, d, _, _ in posts],
    }
    crumbs = [("Home", "/"), ("Guides", None)]
    extra = (ld(blog_ld, "Schema: Blog + blogPost list")
             + ld(_breadcrumb_ld(crumbs), "Schema: BreadcrumbList")
             + ld(faq_ld(faqs.BLOG_INDEX), "Schema: FAQPage — mirrors the visible FAQ below"))

    cards_html = "\n".join(f"""        <article class="card-interactive group relative flex flex-col overflow-hidden">
          <div class="aspect-[16/10] overflow-hidden bg-botanical-900">
            <img src="/assets/img/blog/{img}" alt="{alt}" width="1600" height="900"
                 loading="lazy" decoding="async"
                 class="size-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105">
          </div>
          <div class="flex flex-1 flex-col p-6">
            <div class="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em]">
              <span class="text-champagne-700">{cat}</span>
              <span class="text-ink-500">{read} read</span>
            </div>
            <h2 class="mt-3 text-xl leading-snug">
              <a href="{href}" class="after:absolute after:inset-0 after:content-['']">{t}</a>
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-ink-500">{dek}</p>
            <p class="mt-4 text-xs text-ink-500">Updated <time datetime="{d}">{d}</time></p>
          </div>
        </article>""" for href, t, dek, cat, read, d, img, alt in posts)

    return head(title, desc, path, og_image="/assets/img/blog/blog-index.jpg", extra=extra) + header("blog") + f"""
  <main id="main">
{breadcrumbs(crumbs)}
    <header class="shell pb-10 pt-8">
      <p class="eyebrow-gold">The journal</p>
      <h1 class="mt-3 max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
        Greenhouse wedding planning guides
      </h1>
      <p class="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        Practical guides to getting married under glass. Three published so far &mdash; we would
        rather publish three we can stand behind than thirty padded with numbers we cannot source.
      </p>
    </header>

    <section class="shell" aria-label="All guides">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
{cards_html}
      </div>
    </section>

{faq_section(faqs.BLOG_INDEX, heading="Greenhouse wedding questions", kicker="Start here",
             intro="Short answers. Each links to the guide that covers it properly.", hid="blog-faq")}

  </main>
""" + footer(st)


# ============================================================= METHODOLOGY ===
def methodology(all_venues):
    st = stats(all_venues)
    path = "/methodology/"
    title = "How We Source and Verify Venue Listings | Editorial Standards"
    desc = ("The sourcing rules behind this greenhouse and conservatory wedding venue directory: "
            "where listings come from, what an unconfirmed field means, and how to request a "
            "correction or removal.")
    crumbs = [("Home", "/"), ("How we source listings", None)]

    page_ld = {
        "@context": "https://schema.org", "@type": "WebPage",
        "@id": f"{BASE}{path}#webpage", "url": f"{BASE}{path}",
        "name": title, "description": desc,
        "isPartOf": {"@id": f"{BASE}/#website"},
        "about": {"@id": f"{BASE}/#organization"},
    }
    extra = ld(page_ld, "Schema: WebPage — referenced as the Organization's publishingPrinciples") \
        + ld(_breadcrumb_ld(crumbs), "Schema: BreadcrumbList")

    return head(title, desc, path, og_image="/assets/img/patterns/wide-02.svg", extra=extra) + header("methodology") + f"""
  <main id="main">
{breadcrumbs(crumbs)}
    <header class="shell pb-10 pt-8">
      <p class="eyebrow-gold">Editorial standards</p>
      <h1 class="mt-3 max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.08] sm:text-5xl">
        How we source and verify listings
      </h1>
      <p class="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        A directory is only worth reading if you know where its facts come from. Here is exactly
        where ours do, and what we do when we do not know something.
      </p>
    </header>

    <div class="shell grid gap-12 pb-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <article class="prose-editorial min-w-0 max-w-none">
        <h2 id="sourcing">The sourcing rule</h2>
        <p>
          A field is filled in only when it is stated on the venue&rsquo;s own website. Not on a
          listing marketplace, not on a photographer&rsquo;s blog, not from a review aggregator.
          Those sources go stale, disagree with each other, and are how directories end up telling
          couples something untrue about a real business.
        </p>
        <p>
          Every listing links to the venue&rsquo;s own events page. That link is the point of the
          listing: we are a shortlist and a set of comparable descriptions, not a booking system.
        </p>

        <h2 id="unconfirmed">What a dash means</h2>
        <p>
          Where you see a dash or &ldquo;not confirmed&rdquo;, we have not verified that detail at
          the source. It does not mean the room is small, cheap, unavailable or unsuitable. It means
          we do not know yet, and would rather say so.
        </p>
        <p>
          Right now that applies to most capacity, layout and price fields:
          <strong>{st['with_capacity']} of {st['total']}</strong> listings have a confirmed capacity and
          <strong>{st['with_price']} of {st['total']}</strong> a confirmed price range. The capacity, blend and
          price filters only match confirmed listings, which is why they currently return little or
          nothing. We would rather ship an honest empty filter than a populated dishonest one.
        </p>

        <h2 id="what-we-dont">What we do not do</h2>
        <ul>
          <li><strong>No paid placements.</strong> No venue pays to be listed or to rank, and we take no commission on bookings.</li>
          <li><strong>No invented ratings.</strong> We hold no first-party reviews, so we publish no star ratings and no <code>aggregateRating</code> in our structured data. A fabricated rating is both a Google spam-policy violation and a lie about someone&rsquo;s business.</li>
          <li><strong>No scraped prices.</strong> If a venue does not publish a rate, we do not estimate one.</li>
          <li><strong>No borrowed photography.</strong> The images on this site are generated decorative patterns, marked as such. Venue photographs belong to the venues and their photographers.</li>
        </ul>

        <h2 id="corrections">Corrections and removals</h2>
        <p>
          If you work at a listed venue and something here is wrong or out of date, tell us and we
          will correct it. If you would rather not be listed at all, tell us and we will remove the
          listing &mdash; no negotiation, no upsell.
        </p>

        <h2 id="submit">Suggesting a venue</h2>
        <p>
          Send the venue&rsquo;s own events page. We check that the venue exists, hosts weddings, and
          has glazed space, then add it with whatever its site confirms.
        </p>

        <form class="not-prose mt-6 grid gap-4 rounded-card border border-line bg-shell p-6 sm:grid-cols-2"
              name="venue-suggestion" method="POST" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="venue-suggestion">
          <p class="hidden" aria-hidden="true">
            <label>Leave this field blank: <input name="bot-field" tabindex="-1" autocomplete="off"></label>
          </p>
          <div class="sm:col-span-2">
            <label class="label" for="s-url">Venue&rsquo;s events page URL <span class="text-champagne-700">*</span></label>
            <input class="field" id="s-url" name="url" type="url" required placeholder="https://">
          </div>
          <div>
            <label class="label" for="s-name">Venue name</label>
            <input class="field" id="s-name" name="venue" type="text">
          </div>
          <div>
            <label class="label" for="s-email">Your email</label>
            <input class="field" id="s-email" name="email" type="email" autocomplete="email">
          </div>
          <div class="sm:col-span-2">
            <label class="label" for="s-msg">Anything we should know</label>
            <textarea class="field min-h-24 resize-y" id="s-msg" name="message" rows="3"
                      placeholder="A correction, a removal request, or a venue to add"></textarea>
          </div>
          <div class="sm:col-span-2">
            <button type="submit" class="btn-primary">Send</button>
            <p class="mt-3 text-xs text-ink-500">
              Submits as a <a class="underline decoration-champagne-400 underline-offset-4"
              href="https://docs.netlify.com/manage/forms/setup/" rel="noopener">Netlify Form</a> if this
              site is deployed on Netlify &mdash; entries land in your site&rsquo;s Forms dashboard, no
              backend to run yourself. Deploying elsewhere? Point this form at your own handler instead.
              Prefer email? Write to
              <a class="underline decoration-champagne-400 underline-offset-4"
                 href="mailto:hello@greenhousevenues.com?subject=Venue%20suggestion">hello&commat;greenhousevenues.com</a>
              directly &mdash; a placeholder address until the domain is live.
            </p>
          </div>
        </form>
      </article>

      <aside class="space-y-6 lg:sticky lg:top-24">
        <div class="card p-6">
          <h2 class="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-botanical-800">Directory at a glance</h2>
          <dl class="mt-4 space-y-3 text-sm">
            <div class="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <dt class="text-ink-500">Listings</dt><dd class="font-semibold text-botanical-800">{st['total']}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <dt class="text-ink-500">States &amp; regions</dt><dd class="font-semibold text-botanical-800">{st['states']}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <dt class="text-ink-500">Confirmed capacity</dt><dd class="font-semibold text-botanical-800">{st['with_capacity']}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <dt class="text-ink-500">Confirmed pricing</dt><dd class="font-semibold text-botanical-800">{st['with_price']}</dd>
            </div>
            <div class="flex items-baseline justify-between gap-3">
              <dt class="text-ink-500">Paid placements</dt><dd class="font-semibold text-botanical-800">0</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  </main>
""" + footer(st)


def privacy_policy(all_venues):
    """What actually happens to a visitor's data — no more, no less. Every claim here
    is checked against the codebase: no server, no cookies, no analytics, no ad
    network wired up yet. If that changes, this page has to change with it."""
    st = stats(all_venues)
    path = "/privacy/"
    title = "Privacy Policy | " + NAME
    desc = ("What this site collects (almost nothing) and what it does not: no accounts, "
            "no cookies, no analytics, and no data leaves your browser.")
    crumbs = [("Home", "/"), ("Privacy policy", None)]

    page_ld = {
        "@context": "https://schema.org", "@type": "WebPage",
        "@id": f"{BASE}{path}#webpage", "url": f"{BASE}{path}",
        "name": title, "description": desc,
        "isPartOf": {"@id": f"{BASE}/#website"},
    }
    extra = ld(page_ld, "Schema: WebPage") + ld(_breadcrumb_ld(crumbs), "Schema: BreadcrumbList")

    return head(title, desc, path, og_image="/assets/img/patterns/wide-02.svg", extra=extra) + header() + f"""
  <main id="main">
{breadcrumbs(crumbs)}
    <header class="shell pb-10 pt-8">
      <p class="eyebrow-gold">Legal</p>
      <h1 class="mt-3 max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.08] sm:text-5xl">
        Privacy policy
      </h1>
      <p class="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        This is a static directory with no user accounts and no server-side database of
        visitors. Here is exactly what that means in practice, not a template.
      </p>
    </header>

    <div class="shell pb-16">
      <article class="prose-editorial mx-auto max-w-2xl">
        <h2 id="what-we-collect">What this site collects</h2>
        <p>
          Almost nothing, and only if you choose to send it. There is no account to create,
          no visitor database, and no analytics or tracking script loaded on any page &mdash;
          check the page source if you want to confirm that yourself. The one place you can
          type something in is the <a href="/methodology/#submit">venue suggestion form</a>: a
          venue&rsquo;s URL, a name, an optional email and a message. If this site is deployed
          on Netlify, that form submits as a Netlify Form and its entries live in that
          dashboard, visible only to whoever runs the site &mdash; we do not use it for
          marketing, and we do not sell or share it. Emailing us directly instead sends your
          message the same way any email does: to our inbox, nowhere else.
        </p>

        <h2 id="local-storage">What your browser stores for you</h2>
        <p>
          A few features &mdash; your <a href="/shortlist/">shortlist</a>, the venue-comparison
          table, the booking checklists on guide pages, and the &ldquo;recently viewed&rdquo;
          row on the homepage &mdash; save small pieces of data using your browser&rsquo;s
          <code>localStorage</code>. That data:
        </p>
        <ul>
          <li>never leaves your device or reaches us in any form;</li>
          <li>is not a cookie, and is not shared across websites;</li>
          <li>persists only in the browser you used, until you clear it yourself (each
              feature has a &ldquo;clear&rdquo; control, or you can clear your browser&rsquo;s
              site data); and</li>
          <li>disappears entirely in a private/incognito window once that window closes.</li>
        </ul>

        <h2 id="cookies">Cookies</h2>
        <p>
          This site does not set any cookies of its own.
        </p>

        <h2 id="advertising">Advertising</h2>
        <p>
          The site currently carries reserved, unsold advertising space and no active ad
          network. If that changes, an ad provider may set its own cookies or use its own
          tracking to serve and measure ads &mdash; and this policy will be rewritten to name
          that provider and explain your choices before it happens, not after.
        </p>

        <h2 id="outbound-links">Links to venue websites</h2>
        <p>
          Every listing links out to a venue&rsquo;s own website, which is a separate business
          we do not control. Their privacy practices are their own &mdash; check their policy
          before sharing anything with them directly.
        </p>

        <h2 id="children">Children&rsquo;s privacy</h2>
        <p>
          This site is about wedding venues and is not directed at children. We do not
          knowingly collect information from anyone, of any age, because we do not collect
          information from visitors at all.
        </p>

        <h2 id="changes">Changes to this policy</h2>
        <p>
          If what this site collects ever changes further &mdash; an analytics tool, an ad
          network &mdash; this page will be rewritten to say so plainly, with a new date below,
          before that change ships.
        </p>
        <p class="text-sm text-ink-500">Last updated: {LAST_UPDATED}.</p>
      </article>
    </div>
  </main>
""" + footer(st)


def terms_of_use(all_venues):
    """Plain terms for a free editorial directory: what the content is, what it isn't,
    and the same no-liability-for-third-party-venues position already stated on
    /methodology/, restated here in the form a terms page is expected to take."""
    st = stats(all_venues)
    path = "/terms/"
    title = "Terms of Use | " + NAME
    desc = ("The terms for using this free wedding venue directory: what the listings are, "
            "what they are not, and where responsibility for a booking sits.")
    crumbs = [("Home", "/"), ("Terms of use", None)]

    page_ld = {
        "@context": "https://schema.org", "@type": "WebPage",
        "@id": f"{BASE}{path}#webpage", "url": f"{BASE}{path}",
        "name": title, "description": desc,
        "isPartOf": {"@id": f"{BASE}/#website"},
    }
    extra = ld(page_ld, "Schema: WebPage") + ld(_breadcrumb_ld(crumbs), "Schema: BreadcrumbList")

    return head(title, desc, path, og_image="/assets/img/patterns/wide-02.svg", extra=extra) + header() + f"""
  <main id="main">
{breadcrumbs(crumbs)}
    <header class="shell pb-10 pt-8">
      <p class="eyebrow-gold">Legal</p>
      <h1 class="mt-3 max-w-3xl font-display text-[2.25rem] font-semibold leading-[1.08] sm:text-5xl">
        Terms of use
      </h1>
      <p class="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        Short, because the site is simple: a free directory, not a booking platform.
      </p>
    </header>

    <div class="shell pb-16">
      <article class="prose-editorial mx-auto max-w-2xl">
        <h2 id="what-this-is">What this site is</h2>
        <p>
          {NAME} is a free, editorial directory of greenhouse, glasshouse and conservatory
          wedding venues. Listings are compiled from each venue&rsquo;s own website, as
          described on <a href="/methodology/">how we source and verify listings</a>. Using
          this site does not create any agreement between you and us beyond these terms.
        </p>

        <h2 id="not-a-booking-platform">This is not a booking platform</h2>
        <p>
          We do not take bookings, payments, deposits or commissions, and we are not a party
          to any contract between you and a venue. Every listing links to the venue&rsquo;s
          own events page; availability, pricing and terms come from the venue directly, and
          only the venue can confirm them.
        </p>

        <h2 id="accuracy">Accuracy of listings</h2>
        <p>
          We source every fact we publish from a venue&rsquo;s own website and mark anything
          unconfirmed as a dash rather than a guess &mdash; see
          <a href="/methodology/">our sourcing rules</a>. Venues change their offerings,
          pricing and policies without telling us, so always confirm directly with the venue
          before relying on anything you read here.
        </p>

        <h2 id="no-warranty">No warranty</h2>
        <p>
          This site is provided as-is, without warranty of any kind. We do our best to keep
          listings current and correct, but we make no guarantee that any listing is accurate,
          complete or up to date at the moment you read it.
        </p>

        <h2 id="liability">Limitation of liability</h2>
        <p>
          To the extent permitted by law, {NAME} is not liable for any loss or damage arising
          from your use of this site or your dealings with any listed venue, including
          decisions made on the basis of information published here.
        </p>

        <h2 id="your-content">Content you send us</h2>
        <p>
          If you submit a correction, a removal request or a venue suggestion through the
          <a href="/methodology/#submit">form on our methodology page</a>, you are giving us
          permission to use that information to maintain the directory. Do not send us
          anything confidential.
        </p>

        <h2 id="changes-terms">Changes to these terms</h2>
        <p>
          We may update these terms as the site changes. The date below reflects the last
          revision.
        </p>
        <p class="text-sm text-ink-500">Last updated: {LAST_UPDATED}.</p>
      </article>
    </div>
  </main>
""" + footer(st)


def not_found_page(all_venues):
    """The 404 page. Most static hosts (GitHub Pages, Netlify, Cloudflare Pages, S3)
    serve a root-level 404.html automatically for any unmatched path — see build.py."""
    st = stats(all_venues)
    title = "Page Not Found | " + NAME
    desc = "This page does not exist. Browse the directory or search by state and venue type."

    return head(title, desc, "/404.html", og_image="/assets/img/patterns/wide-02.svg",
                robots="noindex,follow") + header() + f"""
  <main id="main">
    <section class="shell flex flex-col items-center py-24 text-center sm:py-32">
      <p class="eyebrow-gold">404</p>
      <h1 class="mt-3 max-w-xl font-display text-[2.25rem] font-semibold leading-[1.08] sm:text-5xl">
        We couldn&rsquo;t find that page
      </h1>
      <p class="mt-5 max-w-md text-[17px] leading-relaxed text-ink-500">
        The link may be old, or the listing may have been removed &mdash; we take venues out
        of the directory when we can no longer confirm they host weddings.
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a class="btn-primary" href="/">Back to the homepage</a>
        <a class="btn-outline" href="/venues/">Browse every listing</a>
      </div>
    </section>
  </main>
""" + footer(st)
