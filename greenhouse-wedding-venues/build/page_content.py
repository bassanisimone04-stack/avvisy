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
        desc=("What drives the cost of a greenhouse or conservatory wedding venue — catering model, "
              "date, what the hire fee includes — with a checklist to compare quotes honestly."),
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

        <figure class="my-10">
          <img src="/assets/img/blog/rainproof-guide-inline-2.jpg"
               alt="Wedding guests seated under a covered glass pergola, with columns and a chandelier overhead."
               width="1200" height="750" loading="lazy" decoding="async"
               class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Cover the whole chain, not just the ceremony &mdash; guests notice the gap
          between the aisle and the drinks table more than the couple does.</figcaption>
        </figure>

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
        desc=("What \"rain-proof\" should actually mean for an outdoor wedding venue, where rain "
              "finds the gaps in a guest journey, and how glasshouses compare with a marquee."),
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
        desc=("Finding a small greenhouse wedding venue for under 50 guests: what makes a glasshouse "
              "work at a small size, and where micro-wedding rooms hide inside larger gardens."),
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
        related=[("/blog/wedding-venue-capacity-planning/", "How many guests actually fit", "Planning"),
                 ("/blog/rain-proof-outdoor-wedding-venues/", "Rain-proof outdoor wedding venues", "Planning"),
                 ("/venues/?capacity=micro", "Browse under-50 listings", "Directory")],
        keywords=["small greenhouse wedding venues", "greenhouse wedding venues",
                  "botanical garden wedding venues"],
        words=1050, all_venues=all_venues, image="/assets/img/blog/small-venues-guide.jpg",
        image_alt="A bride in a veil during an intimate ceremony under string lights in a small glasshouse.")


# ==================================================== CONSERVATORY VS TYPES ==
def types_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>The label tells you about the architecture; what decides your day is whether the room is fully enclosed and how it is ventilated.</li>
            <li>Greenhouse = built for plants. Conservatory = built to be lived in. Orangery = a conservatory with a solid roof. Palm house / atrium = the tall, grand version.</li>
            <li>A limonaia is the Italian version: a lemon house, built to overwinter citrus.</li>
            <li>Ask what the room actually is, not just what the venue calls it &mdash; the words are used loosely.</li>
          </ul>
        </aside>

        <h2 id="why-it-matters">Why the label is worth untangling</h2>
        <p>
          &ldquo;Greenhouse wedding venue&rdquo; is the search term, but it covers at least six
          genuinely different kinds of building, and couples often tour one expecting the character of
          another. A working greenhouse and a Victorian orangery are both &ldquo;glass buildings,&rdquo;
          but they behave, heat and price very differently. Knowing the difference before you tour saves
          a wasted visit.
        </p>

        <h2 id="greenhouse">Greenhouse</h2>
        <p>
          A growing structure, built for plants rather than people. Usually the cheapest way to marry
          under glass, and the most likely to need power, heating, restrooms or floor protection brought
          in for the day, since none of that was the building&rsquo;s original job. Expect a dirt or
          gravel floor in some cases, and ask specifically what infrastructure exists versus what a
          rental company needs to supply.
        </p>

        <h2 id="conservatory">Conservatory</h2>
        <p>
          A glazed room attached to a building, historically used to overwinter tender plants and, later,
          to sit in. Finished conservatories usually already have heating, power, flooring and restrooms
          nearby, which is why they cost more to hire than a working greenhouse but need less brought in.
        </p>

        <h2 id="orangery">Orangery</h2>
        <p>
          A conservatory&rsquo;s masonry relative: solid brick or stone piers between tall glazed
          openings, with a roof that is partly or fully solid rather than all glass. That solid roof
          traps less summer heat and holds winter heat far better, which is why an orangery is often the
          glasshouse-adjacent room a garden keeps bookable latest into the year.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-02.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>The label describes the architecture &mdash; ask about enclosure and ventilation
          separately, whatever the room is called.</figcaption>
        </figure>

        <h2 id="palm-house">Palm house and atrium</h2>
        <p>
          A palm house is the tall, domed Victorian type built to hold full-grown palms, usually found
          in public botanical gardens rather than private estates. An atrium is its modern equivalent
          &mdash; steel and glass, and more often part of a larger building than freestanding. Both tend
          to be taller and larger than a private conservatory, which changes how the acoustics and the
          light behave at an event.
        </p>

        <h2 id="limonaia">Limonaia (and botanical garden glasshouses)</h2>
        <p>
          A limonaia is the Italian tradition: a lemon house, built with tall doors and a long glazed
          wall to overwinter citrus trees in terracotta pots. See our
          <a href="/italy-destination-weddings/">Italy destination collection</a> if that is the
          direction you are considering. Separately, a <strong>botanical garden</strong> venue may be
          any of the types above, wrapped inside a public collection that usually also offers a ceremony
          lawn &mdash; see our <a href="/blog/greenhouse-wedding-cost/">cost guide</a> for how that
          changes pricing.
        </p>

        <h2 id="ask">What actually matters, whatever it is called</h2>
        <ol>
          <li><strong>Is it fully enclosed, or glass on some sides only?</strong> The name does not guarantee full weather coverage.</li>
          <li><strong>How is it ventilated?</strong> Opening vents, louvers or mechanical cooling — this decides comfort more than the architectural style does.</li>
          <li><strong>What is already there versus what needs to be brought in?</strong> Power, heat, flooring, restrooms.</li>
          <li><strong>What is the glazing?</strong> Single-glazed historic glass and modern double glazing hold temperature very differently.</li>
        </ol>
"""
    return _article_shell(
        path="/blog/conservatory-vs-greenhouse/",
        title="Conservatory vs. Greenhouse vs. Orangery: A Field Guide",
        desc=("What actually separates a greenhouse, a conservatory, an orangery, a palm house and a "
              "limonaia — and which questions to ask regardless of what a venue calls itself."),
        h1="Conservatory vs. greenhouse vs. orangery: a field guide",
        dek=("Six words get used for the same kind of venue search. Here is what each one actually "
             "means, and why the difference is worth knowing before you tour."),
        section="Types", read=7,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-it-matters", "Why the label matters"),
             ("greenhouse", "Greenhouse"),
             ("conservatory", "Conservatory"),
             ("orangery", "Orangery"),
             ("palm-house", "Palm house & atrium"),
             ("limonaia", "Limonaia & botanical gardens"),
             ("ask", "What actually matters")],
        body=body, faq_items=faqs.BLOG_TYPES,
        faq_heading="Glasshouse type FAQs",
        related=[("/blog/greenhouse-wedding-cost/", "Greenhouse wedding cost", "Costs"),
                 ("/venues/", "Browse every listing", "Directory"),
                 ("/italy-destination-weddings/", "Greenhouse wedding venue Italy", "Destination")],
        keywords=["conservatory wedding venues", "greenhouse wedding venues", "orangery wedding venue",
                  "palm house wedding venue"],
        words=900, all_venues=all_venues)


# ==================================================== BOTANICAL GARDEN RULES =
def botanical_garden_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Approved-caterer lists and fixed load-in windows are the two rules that show up almost everywhere.</li>
            <li>Full-property exclusivity is rare — most rentals cover a specific room or section only.</li>
            <li>Public gardens price as a rental fee, not a market rate, which is usually where the savings actually come from.</li>
            <li>Ask what happens to your event if the garden is open to visitors during part of your rental window.</li>
          </ul>
        </aside>

        <h2 id="why-different">Why botanical gardens play by different rules</h2>
        <p>
          A private estate conservatory answers to one couple at a time. A public botanical garden
          answers to members, daily visitors, a horticultural collection that needs specific care, and a
          board or city department &mdash; a wedding rental is one more thing layered on top of an
          organization with other jobs to do. That is the source of almost every rule that surprises
          couples who have only toured private venues before.
        </p>

        <h2 id="caterer-lists">Approved-caterer lists</h2>
        <p>
          The most common rule of all. Gardens vet a set of caterers for kitchen access, insurance and
          load-in familiarity, and you choose from that list rather than bringing in your own. Some
          gardens allow a buy-out fee to bring an outside caterer; most do not. Ask for the list itself,
          not just confirmation that one exists &mdash; it tells you the price range and style you are
          actually choosing from.
        </p>

        <h2 id="load-in">Fixed load-in windows and public hours</h2>
        <p>
          Because the garden stays open to the public on its normal schedule, vendors often load in and
          out within a narrow window tied to closing time, sharing paths with visitors until then. Ask
          exactly when your vendors can arrive, and whether an early load-in is available for an
          additional fee &mdash; it is a common paid add-on that is not always mentioned upfront.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-01.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Most botanical garden rentals cover one room or section, not the whole
          property &mdash; confirm exactly which area your fee includes.</figcaption>
        </figure>

        <h2 id="exclusivity">What &ldquo;exclusive use&rdquo; actually means</h2>
        <p>
          Rarely the entire garden. Most rentals are for a specific conservatory, pavilion or section,
          with the rest of the grounds open to members or the public until the garden&rsquo;s normal
          closing time. Full-property buyouts exist at some venues but are usually a separate, higher
          package &mdash; ask precisely which paths, restrooms and views your guests will and will not
          share with other visitors.
        </p>

        <h2 id="pricing">Why they are often cheaper &mdash; and what that trades away</h2>
        <p>
          A public garden charges a rental fee rather than a market rate, and weekday or off-season dates
          are frequently discounted further. See our <a href="/blog/greenhouse-wedding-cost/">cost
          guide</a> for the full structure. What you trade for the lower price is flexibility: fixed
          hours, a caterer list, and public visitors nearby until closing.
        </p>

        <h2 id="ask">Questions worth asking a botanical garden specifically</h2>
        <ol>
          <li><strong>Which exact area does the rental cover, and is the rest of the garden open to visitors during my event?</strong></li>
          <li><strong>What is the approved-caterer list, and can I request a buy-out to bring my own?</strong></li>
          <li><strong>What are the load-in and load-out windows, and is an early load-in available?</strong></li>
          <li><strong>Is there a curfew or amplified-sound restriction tied to nearby residential areas?</strong></li>
        </ol>
        <p>
          Browse <a href="/venues/?type=botanical-garden">botanical garden wedding venues</a> in the
          directory, each linked to its own rental page.
        </p>
"""
    return _article_shell(
        path="/blog/botanical-garden-wedding-rules/",
        title="Botanical Garden Weddings: Rules, Catering and What to Ask",
        desc=("The rules that show up almost everywhere at botanical garden wedding venues — "
              "approved-caterer lists, fixed load-in windows, and what exclusive use actually covers."),
        h1="Botanical garden weddings: rules, catering and what to ask",
        dek=("A public garden answers to more than one couple at a time. Here is what that means for "
             "your rental, and the questions that get you a straight answer."),
        section="Planning", read=7,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-different", "Why the rules differ"),
             ("caterer-lists", "Approved-caterer lists"),
             ("load-in", "Load-in windows"),
             ("exclusivity", "What 'exclusive use' means"),
             ("pricing", "Why they're often cheaper"),
             ("ask", "Questions to ask")],
        body=body, faq_items=faqs.BLOG_BOTANICAL,
        faq_heading="Botanical garden wedding FAQs",
        related=[("/blog/wedding-insurance-permits-glass-venues/", "Wedding insurance and permits", "Planning"),
                 ("/venues/?type=botanical-garden", "Browse botanical garden venues", "Directory"),
                 ("/methodology/", "How we source listings", "About")],
        keywords=["botanical garden wedding venues", "greenhouse wedding venues",
                  "conservatory wedding venues"],
        words=850, all_venues=all_venues)


# ======================================================= VENTILATION/HEATING =
def ventilation_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Ventilation decides comfort more than the local climate does — a glass roof traps heat everywhere.</li>
            <li>Ask what the room holds at 4pm in the hottest month you are considering, not just whether it has &ldquo;cooling.&rdquo;</li>
            <li>Heating is frequently billed separately from the hire fee — confirm before you budget.</li>
            <li>Single glazing and double glazing behave very differently in both directions; ask which the venue has.</li>
          </ul>
        </aside>

        <h2 id="why">Why this is the real question, not the weather</h2>
        <p>
          Couples researching glasshouse venues often ask about the local climate &mdash; will it be too
          hot, too cold. The building answers that question more than the climate does. A glass roof
          traps solar heat regardless of the outdoor temperature, so a well-ventilated room in a warm
          climate can be more comfortable than a poorly ventilated one somewhere mild. Ask about the
          building&rsquo;s systems before worrying about the season.
        </p>

        <h2 id="summer">Ventilation: what actually cools a glasshouse</h2>
        <ul>
          <li><strong>Opening roof vents.</strong> The single most effective feature — hot air rises and needs somewhere to go.</li>
          <li><strong>Side louvers.</strong> Cross-ventilation at guest height, working with roof vents rather than instead of them.</li>
          <li><strong>Shade cloth or external blinds.</strong> Reduces solar gain before it becomes heat inside the room at all.</li>
          <li><strong>Mechanical cooling.</strong> Rare in historic glasshouses, more common in modern purpose-built event spaces.</li>
        </ul>
        <p>
          Ask specifically what temperature the room holds at 4pm in the hottest month you are
          considering. A venue that answers with a number has tested it; a venue that answers with
          reassurance alone has probably not.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-02.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Opening roof vents do more for comfort than any other single feature —
          ask whether a venue has them before asking about the season.</figcaption>
        </figure>

        <h2 id="winter">Heating: what to confirm before you budget</h2>
        <p>
          Heating is one of the most commonly billed-separately items on a glasshouse rental. Ask
          whether it is included in the hire fee, what fuel or system the room uses, and what minimum
          temperature the venue actually guarantees rather than promises to aim for. A guaranteed number
          is something you can hold a venue to; a general assurance is not.
        </p>

        <h2 id="glazing">Single glazing vs. double glazing</h2>
        <p>
          Historic single-glazed glass &mdash; the kind found in many Victorian-era conservatories and
          palm houses &mdash; loses heat quickly in winter and gains it quickly in summer. Modern
          double-glazed rooms and orangeries with a partly solid roof hold temperature in both
          directions far better. Ask what the glazing actually is, since two rooms that look similar in
          photographs can behave very differently.
        </p>

        <h2 id="checklist">A short checklist for any season</h2>
        <ol>
          <li>What ventilation does the room have, and is it manual or automated?</li>
          <li>What temperature does it hold at the most extreme point of the day, in the month you are booking?</li>
          <li>Is heating included in the hire fee, and what is the guaranteed minimum temperature?</li>
          <li>Is the glazing single or double, and how old is the structure?</li>
        </ol>
"""
    return _article_shell(
        path="/blog/greenhouse-ventilation-heating/",
        title="Ventilation and Heating: Will Your Glasshouse Actually Work?",
        desc=("The ventilation and heating questions that decide whether a greenhouse or conservatory "
              "wedding venue is comfortable — more than the local climate ever will."),
        h1="Ventilation and heating: the questions that decide if a glasshouse works",
        dek=("The local climate matters less than you think. Here is what to ask about ventilation and "
             "heating before you book a glass venue for any season."),
        section="Planning", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why", "Why this is the real question"),
             ("summer", "What actually cools a glasshouse"),
             ("winter", "Heating: what to confirm"),
             ("glazing", "Single vs. double glazing"),
             ("checklist", "A short checklist")],
        body=body, faq_items=faqs.BLOG_VENTILATION,
        faq_heading="Ventilation and heating FAQs",
        related=[("/blog/rain-proof-outdoor-wedding-venues/", "Rain-proof outdoor wedding venues", "Planning"),
                 ("/blog/greenhouse-wedding-cost/", "Greenhouse wedding cost", "Costs"),
                 ("/venues/", "Browse every listing", "Directory")],
        keywords=["greenhouse wedding venues", "conservatory wedding venues", "glasshouse ventilation"],
        words=800, all_venues=all_venues)


# ================================================================ WINTER =====
def winter_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Winter is usually the cheapest season to book a glasshouse — demand drops outside spring and summer.</li>
            <li>Heating and glazing type matter more than the outdoor temperature.</li>
            <li>Daylight hours shrink fast in December and January; plan your timeline around it.</li>
            <li>Some gardens reduce glasshouse hours or close to rentals outside their main season — confirm winter availability directly.</li>
          </ul>
        </aside>

        <h2 id="why-winter">Why a winter glasshouse wedding works</h2>
        <p>
          Glass is the one venue category where winter genuinely plays to the building&rsquo;s
          strengths: the daylight and the planting stay in view exactly when a garden or marquee wedding
          would be at its least appealing. It is also, for the same reason of lower demand, frequently
          the cheapest season on a venue&rsquo;s calendar &mdash; see our
          <a href="/blog/greenhouse-wedding-cost/">cost guide</a> for how season interacts with price.
        </p>

        <h2 id="heating">Heating is the whole question</h2>
        <p>
          A winter glasshouse wedding lives or dies on heating, not on how pretty the frost looks
          through the glass. Ask whether heating is included in the hire fee, what system the venue
          uses, and what minimum temperature is actually guaranteed. Ask, too, how early the room needs
          to be heated before guests arrive &mdash; a cold glass structure can take longer to warm than
          a conventional room, and a venue that starts heating an hour before doors is a different
          experience than one that starts the night before.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-01.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Single-glazed historic glass is harder to heat than modern double glazing —
          ask which one you are booking.</figcaption>
        </figure>

        <h2 id="daylight">Daylight and your timeline</h2>
        <p>
          Many parts of the country lose useful daylight by mid-to-late afternoon in December and
          January. If natural light through the glass is part of why you chose the venue, build your
          ceremony and photography timing around actual sunset for your date and location, not a
          general sense of &ldquo;afternoon.&rdquo; A venue that hosts winter weddings regularly should
          be able to tell you exactly what the light does at 3pm and at 5pm.
        </p>

        <h2 id="condensation">Condensation, and why it is not just cosmetic</h2>
        <p>
          Warm, humid air inside meeting cold glass can produce visible condensation or dripping from
          the roof structure &mdash; ask the venue how they manage it, particularly for a room full of
          dancing guests generating heat and moisture over several hours. It is a legitimate logistics
          question, not an aesthetic one.
        </p>

        <h2 id="availability">Confirm winter availability directly</h2>
        <p>
          Some public gardens reduce their glasshouse&rsquo;s rental hours, or close it to private
          events entirely, outside their main growing or display season. Do not assume a venue you saw
          in summer photographs is bookable for a December date &mdash; ask specifically.
        </p>
"""
    return _article_shell(
        path="/blog/winter-greenhouse-wedding/",
        title="Planning a Winter Greenhouse Wedding",
        desc=("What actually makes a winter greenhouse or conservatory wedding work: heating, glazing, "
              "shrinking daylight, and the availability question most couples skip."),
        h1="Planning a winter greenhouse wedding",
        dek=("Winter is where glass venues play to their strengths — and where heating stops being a "
             "detail and becomes the whole plan."),
        section="Planning", read=7,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-winter", "Why winter works"),
             ("heating", "Heating is the whole question"),
             ("daylight", "Daylight and your timeline"),
             ("condensation", "Condensation"),
             ("availability", "Confirm availability")],
        body=body, faq_items=faqs.BLOG_WINTER,
        faq_heading="Winter greenhouse wedding FAQs",
        related=[("/blog/greenhouse-ventilation-heating/", "Ventilation and heating", "Planning"),
                 ("/blog/fall-greenhouse-wedding/", "Planning a fall greenhouse wedding", "Planning"),
                 ("/venues/", "Browse every listing", "Directory")],
        keywords=["winter wedding venue", "greenhouse wedding venues", "conservatory wedding venues"],
        words=800, all_venues=all_venues)


# ================================================================ SUMMER =====
def summer_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Ventilation, not the outdoor temperature, decides whether a glasshouse is usable in summer.</li>
            <li>Morning or early-evening ceremonies avoid the hottest hours of solar gain.</li>
            <li>Shade cloth, blinds or tinted glazing help — ask whether the venue has any of them.</li>
            <li>Summer dates cost more mainly because it is peak wedding season generally, not because of the glass.</li>
          </ul>
        </aside>

        <h2 id="why-ask">Why summer is the season to interrogate, not assume</h2>
        <p>
          A glass roof gains solar heat fast, which makes summer the one season where a badly-ventilated
          glasshouse can become genuinely uncomfortable rather than just warm. The good news is that this
          is entirely a building question, not a climate one &mdash; a well-ventilated room in a hot
          state can outperform a poorly ventilated one somewhere mild. See our
          <a href="/blog/greenhouse-ventilation-heating/">ventilation and heating guide</a> for the full
          breakdown of what to ask.
        </p>

        <h2 id="timing">Timing your day around solar gain</h2>
        <p>
          Morning ceremonies and early-evening receptions that continue into a cooler night are the most
          common way venues and planners handle a summer glasshouse booking. Ask the venue two specific
          things: whether the room actually cools once the sun is off it, and what it holds during the
          hottest stretch of a typical afternoon in your month.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/square-01.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>A ceremony timed around solar gain rather than convention is a common way
          venues handle a summer booking.</figcaption>
        </figure>

        <h2 id="shade">Shade cloth, blinds and tinted glazing</h2>
        <p>
          Where a venue has any of these installed, they meaningfully reduce heat gain compared with
          clear glass alone. Ask whether the venue has shade cloth, external blinds or tinted glazing,
          or whether comfort relies entirely on ventilation &mdash; the answer tells you how much margin
          the room has on a genuinely hot day.
        </p>

        <h2 id="cost">Does summer cost more at a glasshouse specifically?</h2>
        <p>
          Mostly for the same reason it costs more everywhere: summer is peak wedding season generally.
          Weekday and shoulder-season dates are the lever that actually moves price at most venues, glass
          or otherwise &mdash; see the <a href="/blog/greenhouse-wedding-cost/">cost guide</a> for the
          full structure.
        </p>

        <h2 id="ask">What to ask before booking a summer date</h2>
        <ol>
          <li>What ventilation does the room have, and what does it hold at the hottest point of the afternoon?</li>
          <li>Does the room cool down meaningfully after sunset, for an evening reception?</li>
          <li>Is there shade cloth, blinds, or tinted glazing, or does comfort rely on ventilation alone?</li>
          <li>Is a weekday or shoulder-month date available at a lower rate?</li>
        </ol>
"""
    return _article_shell(
        path="/blog/summer-greenhouse-wedding/",
        title="Planning a Summer Greenhouse Wedding",
        desc=("Whether a greenhouse or conservatory wedding works in summer heat comes down to "
              "ventilation, timing and shade — not the local climate. Here is what to ask."),
        h1="Planning a summer greenhouse wedding",
        dek=("A glass roof gains heat fast — here is what actually keeps a summer glasshouse wedding "
             "comfortable, and the questions that tell you in advance."),
        section="Planning", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-ask", "Why summer needs asking about"),
             ("timing", "Timing around solar gain"),
             ("shade", "Shade cloth and blinds"),
             ("cost", "Does summer cost more?"),
             ("ask", "What to ask")],
        body=body, faq_items=faqs.BLOG_SUMMER,
        faq_heading="Summer greenhouse wedding FAQs",
        related=[("/blog/greenhouse-ventilation-heating/", "Ventilation and heating", "Planning"),
                 ("/blog/spring-greenhouse-wedding/", "Planning a spring greenhouse wedding", "Planning"),
                 ("/venues/", "Browse every listing", "Directory")],
        keywords=["summer wedding venue", "greenhouse wedding venues", "conservatory wedding venues"],
        words=800, all_venues=all_venues)


# =============================================================== CATERING ====
def catering_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Private estate conservatories more often require in-house catering; public gardens more often use an approved-caterer list.</li>
            <li>The catering policy usually moves your total budget more than the venue&rsquo;s hire fee does.</li>
            <li>An approved-caterer list is not the same as open outside catering — confirm which you are getting.</li>
            <li>Alcohol policy is worth confirming separately from food catering.</li>
          </ul>
        </aside>

        <h2 id="why-first">Why catering policy is the first thing to confirm</h2>
        <p>
          Of everything that separates two otherwise similar glasshouse venues, the catering policy
          usually has the biggest effect on your total spend &mdash; more than the hire fee itself. It
          is worth confirming before you fall in love with a room, not after.
        </p>

        <h2 id="in-house">In-house catering and minimum spend</h2>
        <p>
          Private estate conservatories more often require catering through the venue or a small
          in-house list, tied to a minimum spend per guest. That minimum is effectively part of the
          venue&rsquo;s price, even though it is billed separately &mdash; add it to the hire fee before
          comparing two venues.
        </p>

        <h2 id="approved-list">Approved-caterer lists</h2>
        <p>
          Common at public gardens and municipal glasshouses: a set of caterers the venue has already
          vetted for kitchen access and insurance, and you choose from that list. This is not the same
          as open outside catering &mdash; ask for the list itself before assuming it includes a style
          or price point you want.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-02.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Catering policy usually moves your total budget more than the venue&rsquo;s
          hire fee does &mdash; confirm it before touring further.</figcaption>
        </figure>

        <h2 id="outside">Fully open outside catering</h2>
        <p>
          Working greenhouses and some municipal venues without their own kitchen infrastructure are the
          most likely to allow any licensed outside caterer. This usually means more choice and often a
          lower total cost, but confirm what kitchen or prep space actually exists on site, since fully
          open catering sometimes means fully absent infrastructure too.
        </p>

        <h2 id="alcohol">Alcohol, separately from food</h2>
        <p>
          Some venues allow you to bring your own alcohol, especially public gardens without a liquor
          license of their own; others require it through an in-house or preferred caterer for liability
          reasons. This does not always follow the same policy as food catering, so ask about it
          specifically rather than assuming.
        </p>

        <h2 id="ask">Questions to ask about catering, in writing</h2>
        <ol>
          <li>Is catering fully in-house, an approved list, or fully open?</li>
          <li>If there is a minimum spend, what is it, and does it include service and tax?</li>
          <li>Is there a working kitchen or prep space, or does a caterer need to bring everything?</li>
          <li>What is the alcohol policy, separately from the food catering policy?</li>
        </ol>
"""
    return _article_shell(
        path="/blog/greenhouse-wedding-catering/",
        title="Catering at a Greenhouse Wedding: BYO vs. In-House",
        desc=("How catering policy works at greenhouse and conservatory wedding venues — in-house "
              "minimums, approved-caterer lists, and fully open outside catering explained."),
        h1="Catering at a greenhouse wedding: BYO vs. in-house, explained",
        dek=("The catering policy usually moves your budget more than the hire fee does. Here is how "
             "it actually works at glasshouse venues, and what to ask."),
        section="Planning", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-first", "Why this comes first"),
             ("in-house", "In-house catering & minimums"),
             ("approved-list", "Approved-caterer lists"),
             ("outside", "Fully open catering"),
             ("alcohol", "Alcohol policy"),
             ("ask", "Questions to ask")],
        body=body, faq_items=faqs.BLOG_CATERING,
        faq_heading="Greenhouse wedding catering FAQs",
        related=[("/blog/greenhouse-wedding-cost/", "Greenhouse wedding cost", "Costs"),
                 ("/blog/botanical-garden-wedding-rules/", "Botanical garden wedding rules", "Planning"),
                 ("/venues/", "Browse every listing", "Directory")],
        keywords=["greenhouse wedding venues", "conservatory wedding venues", "wedding catering policy"],
        words=800, all_venues=all_venues)


# ================================================================= TIMING ====
def timing_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Popular glasshouses in spring and autumn often book 12 to 18 months ahead.</li>
            <li>Winter and weekday dates, and smaller side rooms, tend to have shorter lead times.</li>
            <li>Public gardens sometimes open their booking calendar on a fixed annual date rather than year-round.</li>
            <li>Ask about date-change policy before you sign, not after.</li>
          </ul>
        </aside>

        <h2 id="lead-time">How far ahead to actually plan</h2>
        <p>
          Spring and autumn suit glass buildings best &mdash; enough daylight for the glass to earn its
          keep, without high summer&rsquo;s solar gain &mdash; which makes those the most contested
          dates too. A popular glasshouse booked for a weekend in those seasons often fills 12 to 18
          months out. Winter dates, weekdays, and smaller side rooms inside larger gardens generally
          have more room to book closer in.
        </p>

        <h2 id="off-peak">Where the shorter lead times are</h2>
        <ul>
          <li><strong>Winter.</strong> Lower demand at most glasshouse venues, particularly single-glazed ones that are harder to heat — see our <a href="/blog/winter-greenhouse-wedding/">winter wedding guide</a>.</li>
          <li><strong>Weekdays.</strong> Friday, Sunday and weekday dates are discounted almost everywhere and booked later, on average, than Saturdays.</li>
          <li><strong>Side rooms.</strong> A smaller room inside a larger garden — an orchid room, a fern house — is often overlooked in favor of the main hall, and can have availability the headline space does not.</li>
        </ul>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-01.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Smaller side rooms inside a larger garden often have shorter lead times than
          the main hall.</figcaption>
        </figure>

        <h2 id="calendars">Booking calendars work differently at public gardens</h2>
        <p>
          Some botanical gardens run wedding bookings on a rolling annual calendar tied to their fiscal
          or growing year, opening a booking window on a fixed date each year rather than accepting
          inquiries at any time. Ask a public garden specifically when its window opens, rather than
          assuming it behaves like a private venue that will simply hold a date the moment you ask.
        </p>

        <h2 id="changes">Date changes and cancellation policy</h2>
        <p>
          Policies vary widely: some venues allow a date change with enough notice, others treat a
          change as a cancellation and a fresh booking. Ask before you sign the contract, and get the
          answer written into it &mdash; a verbal assurance during a tour is not something you can hold
          a venue to a year later.
        </p>

        <h2 id="checklist">A short timing checklist</h2>
        <ol>
          <li>How far ahead does this specific venue typically book out for my season and day of week?</li>
          <li>Does the venue have a fixed annual booking-window date, or does it accept inquiries year-round?</li>
          <li>What is the date-change and cancellation policy, in writing?</li>
          <li>Is there a smaller room with shorter lead times if my first-choice space is unavailable?</li>
        </ol>
"""
    return _article_shell(
        path="/blog/how-far-in-advance-book-greenhouse-venue/",
        title="How Far in Advance to Book a Greenhouse Wedding Venue",
        desc=("Typical lead times for greenhouse and conservatory wedding venues, where the shorter "
              "booking windows are, and how public-garden calendars work differently."),
        h1="How far in advance to book a greenhouse wedding venue",
        dek=("Popular glasshouses in the best seasons book out fast. Here is where the lead time is "
             "shorter, and how public-garden calendars actually work."),
        section="Planning", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("lead-time", "How far ahead to plan"),
             ("off-peak", "Where lead times are shorter"),
             ("calendars", "How public-garden calendars work"),
             ("changes", "Date changes & cancellation"),
             ("checklist", "A short checklist")],
        body=body, faq_items=faqs.BLOG_TIMING,
        faq_heading="Booking timeline FAQs",
        related=[("/blog/spring-greenhouse-wedding/", "Planning a spring greenhouse wedding", "Planning"),
                 ("/blog/fall-greenhouse-wedding/", "Planning a fall greenhouse wedding", "Planning"),
                 ("/blog/winter-greenhouse-wedding/", "Planning a winter greenhouse wedding", "Planning")],
        keywords=["greenhouse wedding venues", "wedding venue booking", "conservatory wedding venues"],
        words=750, all_venues=all_venues)


# ============================================================== ELOPEMENT ====
def elopement_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>A room built small reads as generous for an elopement; a room built large can feel empty even at a discount.</li>
            <li>Many gardens keep a separate elopement or micro-ceremony package, not always advertised with the main wedding page.</li>
            <li>Some public gardens allow a small ceremony within general admission hours for a modest fee — worth asking about directly.</li>
            <li>Confirm exactly what space, time and privacy a small package actually includes.</li>
          </ul>
        </aside>

        <h2 id="why-glass">Why glass suits an elopement particularly well</h2>
        <p>
          A room designed for 200 can feel like a warehouse with ten people in it. A propagation house,
          fern room or side conservatory built with a small footprint in mind reads as generous, not
          empty, at the same guest count &mdash; because it was designed for it. See our
          <a href="/blog/small-greenhouse-wedding-venues/">small greenhouse wedding venues guide</a> for
          more on finding rooms built at this scale.
        </p>

        <h2 id="packages">Ask about a separate elopement package</h2>
        <p>
          Many gardens keep a distinct elopement or micro-ceremony package &mdash; priced and staffed
          differently from the full wedding offering, for roughly 2 to 20 guests &mdash; that is not
          always advertised alongside the main wedding page. Ask directly rather than assuming the full
          wedding package, with its higher minimums, is the only option.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/square-02.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>A small elopement package is often priced and run differently from the full
          wedding offering — and not always on the main page.</figcaption>
        </figure>

        <h2 id="general-admission">Marrying within general admission hours</h2>
        <p>
          A few gardens allow a very small ceremony within their normal public opening hours for a
          modest fee, rather than a full private-event rental. This is worth asking about specifically
          if your guest count is very small, since it can be substantially cheaper than a standard
          wedding rental &mdash; the trade-off is that other visitors will be present.
        </p>

        <h2 id="what-included">What a small package should actually include</h2>
        <p>
          At minimum, confirm exactly which space you get access to and for how long, whether other
          visitors will be present during your ceremony, and whether photography time is included or
          billed separately. Small packages sometimes leave these details unstated where a full wedding
          contract would spell them out &mdash; ask rather than assume.
        </p>

        <h2 id="ask">Questions to ask before booking a small ceremony</h2>
        <ol>
          <li>Is there a dedicated elopement or micro-ceremony package, separate from the full wedding offering?</li>
          <li>Is a small ceremony available within general admission hours, at a lower fee?</li>
          <li>Exactly which space and how much time does the package include?</li>
          <li>Will other visitors be present, and is photography time included?</li>
        </ol>
"""
    return _article_shell(
        path="/blog/greenhouse-elopement-micro-ceremony/",
        title="Elopements and Micro-Ceremonies in a Glasshouse",
        desc=("Planning a small greenhouse or conservatory elopement: separate micro-ceremony "
              "packages, general-admission options, and what a small package should include."),
        h1="Elopements and micro-ceremonies in a glasshouse",
        dek=("A room built small reads as generous for a handful of guests. Here is how to find and "
             "book one for an elopement or micro-ceremony."),
        section="Micro-weddings", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-glass", "Why glass suits an elopement"),
             ("packages", "Ask about a separate package"),
             ("general-admission", "Marrying within admission hours"),
             ("what-included", "What a package should include"),
             ("ask", "Questions to ask")],
        body=body, faq_items=faqs.BLOG_ELOPEMENT,
        faq_heading="Elopement & micro-ceremony FAQs",
        related=[("/blog/small-greenhouse-wedding-venues/", "Small greenhouse wedding venues", "Micro-weddings"),
                 ("/blog/greenhouse-wedding-cost/", "Greenhouse wedding cost", "Costs"),
                 ("/venues/?capacity=micro", "Browse under-50 listings", "Directory")],
        keywords=["greenhouse elopement", "small greenhouse wedding venues", "micro wedding venue"],
        words=750, all_venues=all_venues)


# =============================================================== VENDORS =====
def vendor_logistics_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Narrow doors and planting-lined paths can make a standard load-in route unworkable — confirm access, not just capacity.</li>
            <li>Ask about the electrical supply before assuming a standard catering or band setup will work.</li>
            <li>Some historic glasshouses restrict what can be attached to the glass or ironwork.</li>
            <li>Glass and hard floors carry sound differently than a carpeted ballroom.</li>
          </ul>
        </aside>

        <h2 id="why-share">Why glass venues need a different vendor briefing</h2>
        <p>
          A glasshouse is rarely built with catering trucks and stage rigs in mind, and it is often
          shared with public visitors until closing. Share the venue&rsquo;s specific logistics with
          every vendor in advance, rather than assuming standard venue conventions apply &mdash; it
          saves a difficult conversation on the day.
        </p>

        <h2 id="caterers">Caterers: power, kitchen access, load-in route</h2>
        <p>
          Confirm the electrical supply available on site, whether there is a working prep kitchen or
          just a serving space, and the actual load-in route &mdash; glasshouses often have narrow doors
          or paths through planting that a standard truck route does not anticipate. Ask the venue
          directly, and pass the answer to your caterer before the day, not on it.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-02.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Narrow doors and planting-lined paths can make a standard load-in route
          unworkable &mdash; confirm access specifically, not just capacity.</figcaption>
        </figure>

        <h2 id="florists">Florists: what can and cannot touch the glass</h2>
        <p>
          Ask whether real flame, loose petals, or hanging installations are allowed near the glazing
          and structure, and what the venue&rsquo;s policy is on attaching anything to glass or historic
          ironwork. Some older glasshouses restrict adhesives or clips that could mark original frames
          &mdash; a restriction a florist used to standard ballrooms may not expect.
        </p>

        <h2 id="bands">Music, sound and curfews</h2>
        <p>
          Ask about the venue&rsquo;s amplified-sound policy and any curfew: glasshouses inside public
          gardens are frequently close to residential streets and enforce an earlier cutoff than a
          standalone event venue would. Glass and hard floors also carry sound differently than a
          carpeted ballroom &mdash; a band unfamiliar with the room may want to hear that directly from
          the venue rather than the couple.
        </p>

        <h2 id="briefing">A short logistics briefing to send every vendor</h2>
        <ol>
          <li>Load-in and load-out windows, and the actual route to the room.</li>
          <li>Electrical supply and any restrictions on generators or extension runs.</li>
          <li>What can and cannot be attached to glass, ironwork or planting.</li>
          <li>Amplified-sound policy and curfew.</li>
        </ol>
"""
    return _article_shell(
        path="/blog/vendor-logistics-glass-venues/",
        title="Vendor Logistics at Glass Venues: A Briefing for Caterers & Florists",
        desc=("What caterers, florists and bands need to know before working a greenhouse or "
              "conservatory wedding — power, load-in routes, glass restrictions and curfews."),
        h1="Vendor logistics at glass venues: what caterers, florists and bands need to know",
        dek=("Glasshouses are rarely built with vendor logistics in mind. Here is the briefing worth "
             "sending every vendor before the day."),
        section="Logistics", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-share", "Why a different briefing"),
             ("caterers", "Caterers: power & load-in"),
             ("florists", "Florists: what can touch the glass"),
             ("bands", "Music, sound & curfews"),
             ("briefing", "A short briefing to send")],
        body=body, faq_items=faqs.BLOG_VENDORS + faqs.BLOG_LOGISTICS_GUESTS,
        faq_heading="Vendor logistics FAQs",
        related=[("/blog/wedding-insurance-permits-glass-venues/", "Wedding insurance and permits", "Planning"),
                 ("/blog/greenhouse-ventilation-heating/", "Ventilation and heating", "Planning"),
                 ("/venues/", "Browse every listing", "Directory")],
        keywords=["greenhouse wedding venues", "wedding vendor logistics", "conservatory wedding venues"],
        words=750, all_venues=all_venues)


# ============================================================== CHECKLIST ====
def checklist_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Whether the whole day can happen under solid cover is the one question every other question supports.</li>
            <li>Get answers in writing where you can — verbal reassurance is easy to misremember a month later.</li>
            <li>Use the same checklist at every venue you tour, so the answers are actually comparable.</li>
            <li>This checklist is interactive below — check items off and it saves your progress in this browser.</li>
          </ul>
        </aside>

        <h2 id="why-checklist">Why a checklist, not a gut feeling</h2>
        <p>
          Glasshouse venues raise questions a generic wedding checklist does not: ventilation, heating,
          glazing, catering policy, load-in access. A single tour rarely surfaces all of them on its
          own, and the answers from one venue are easy to conflate with another by the time you have
          seen three or four. A written checklist, used the same way at every venue, fixes both
          problems.
        </p>

        <h2 id="core">The core question everything else supports</h2>
        <p>
          Can the ceremony, dinner and dancing all happen under solid cover without moving anything on
          the day? Every other item below is really a way of pressure-testing that one answer &mdash;
          see our <a href="/blog/rain-proof-outdoor-wedding-venues/">rain-proof venues guide</a> for the
          full reasoning.
        </p>

        <h2 id="checklist-items">The 20 questions</h2>
        <ol>
          <li>Can the ceremony, dinner and dancing all happen under solid cover?</li>
          <li>What ventilation does the room have, and what does it hold on a hot afternoon?</li>
          <li>Is heating included in the hire fee, and what is the guaranteed minimum temperature?</li>
          <li>Is the glazing single or double, and how old is the structure?</li>
          <li>What is the seated capacity with a dance floor, with planting in place?</li>
          <li>Is catering in-house, an approved list, or fully open?</li>
          <li>If there is a minimum spend, what does it include?</li>
          <li>What is the alcohol policy?</li>
          <li>What is the load-in and load-out window, and the actual route?</li>
          <li>What is the electrical supply available to caterers and bands?</li>
          <li>What can and cannot be attached to the glass or ironwork?</li>
          <li>Is there an amplified-sound curfew?</li>
          <li>Will other visitors be present during a public-garden rental?</li>
          <li>What exact area does the rental cover — is it full exclusivity?</li>
          <li>Is there a minimum guest count as well as a maximum?</li>
          <li>Is floor protection required for dancing?</li>
          <li>What is the date-change and cancellation policy, in writing?</li>
          <li>Is there a rain or weather contingency for any outdoor portion?</li>
          <li>How far in advance does this venue typically book out for your date?</li>
          <li>What happens if a wedding runs over its booked time?</li>
        </ol>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-01.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Use the same 20 questions at every venue you tour — the answers only become
          useful when they are comparable.</figcaption>
        </figure>

        <h2 id="use-it">Using the checklist</h2>
        <p>
          Check items off as you get answers, or copy the list to send by email ahead of a tour so the
          venue can prepare written responses. Your progress on this page is saved in this browser, so
          you can come back to it per venue.
        </p>
##CHECKLIST_WIDGET##
"""
    body = body.replace(
        "##CHECKLIST_WIDGET##",
        checklist(
            [("Can the ceremony, dinner and dancing all happen under solid cover?",
              "The question every other item on this list supports — see the rain-proof venues guide."),
             ("What ventilation does the room have, and what does it hold on a hot afternoon?",
              "Passive vents behave differently from a full climate system on a warm, still day."),
             ("Is heating included in the hire fee, and what is the guaranteed minimum temperature?",
              "A rented patio heater is a different promise than a built-in system covered in the contract."),
             ("Is the glazing single or double, and how old is the structure?",
              "Older single glazing loses heat faster and can affect comfort in shoulder seasons."),
             ("What is the seated capacity with a dance floor, with planting in place?",
              "Brochure capacity figures rarely subtract the floor space plants and a dance floor actually take."),
             ("Is catering in-house, an approved list, or fully open?",
              "This changes your budget conversation more than almost any other line item."),
             ("If there is a minimum spend, what does it include?",
              "Minimums can bundle service and rentals very differently between venues."),
             ("What is the alcohol policy?",
              "Some venues require licensed in-house bar service; others allow you to supply your own."),
             ("What is the load-in and load-out window, and the actual route?",
              "A narrow door or a long carry from parking affects every vendor's timeline and quote."),
             ("What is the electrical supply available to caterers and bands?",
              "A band or a warming kitchen can trip a circuit a small venue never expected to carry."),
             ("What can and cannot be attached to the glass or ironwork?",
              "Historic structures often restrict tape, pins, and hanging weight on glass and frames."),
             ("Is there an amplified-sound curfew?",
              "Public gardens and residential-adjacent venues often cut amplified sound earlier than expected."),
             ("Will other visitors be present during a public-garden rental?",
              "Some botanical gardens only close a wing or path to the public, not the whole grounds."),
             ("What exact area does the rental cover — is it full exclusivity?",
              "\"The greenhouse\" in a listing can mean one room or an entire glasshouse complex."),
             ("Is there a minimum guest count as well as a maximum?",
              "Some venues set a minimum spend or headcount that rules out a very small wedding."),
             ("Is floor protection required for dancing?",
              "Historic tile or stone floors sometimes require a rented dance floor or protective covering."),
             ("What is the date-change and cancellation policy, in writing?",
              "Verbal reassurance on a tour is easy to misremember by the time you sign a contract."),
             ("Is there a rain or weather contingency for any outdoor portion?",
              "Cocktail hours and photos often happen outside the glass structure itself."),
             ("How far in advance does this venue typically book out for your date?",
              "Popular glasshouse dates, especially spring and fall Saturdays, can book a year or more out."),
             ("What happens if a wedding runs over its booked time?",
              "Overtime fees and hard stop times vary widely and are worth knowing before the day.")],
            key="venue-checklist"))
    return _article_shell(
        path="/blog/greenhouse-wedding-venue-checklist/",
        title="The Greenhouse Wedding Venue Checklist: 20 Questions",
        desc=("20 questions to ask any greenhouse or conservatory wedding venue before you book — "
              "ventilation, catering, logistics and cover, all in one checklist."),
        h1="The greenhouse wedding venue checklist: 20 questions to ask before you book",
        dek=("Every question a glasshouse venue raises that a generic wedding checklist does not, "
             "collected in one place — with an interactive version you can save."),
        section="Planning", read=8,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-checklist", "Why a checklist"),
             ("core", "The core question"),
             ("checklist-items", "The 20 questions"),
             ("use-it", "Using the checklist")],
        body=body, faq_items=faqs.BLOG_CHECKLIST + faqs.BLOG_ACCESSIBILITY,
        faq_heading="Venue checklist FAQs",
        related=[("/blog/wedding-venue-capacity-planning/", "How many guests actually fit", "Planning"),
                 ("/blog/wedding-insurance-permits-glass-venues/", "Wedding insurance and permits", "Planning"),
                 ("/venues/", "Browse every listing", "Directory")],
        keywords=["greenhouse wedding venues", "wedding venue checklist", "conservatory wedding venues"],
        words=900, all_venues=all_venues)


def insurance_permits_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Most public gardens and estate venues require a one-day liability policy naming the venue as additional insured, separate from any coverage a caterer already carries.</li>
            <li>$1 million per occurrence / $2 million aggregate is a common baseline, though the specific venue sets its own minimum.</li>
            <li>A public garden or municipal glasshouse may also require a separate use permit, with its own lead time.</li>
            <li>Basic coverage is inexpensive and quick to buy — the risk is forgetting to ask until a venue requests proof close to the date.</li>
          </ul>
        </aside>

        <h2 id="what-it-is">What "event insurance" actually means here</h2>
        <p>
          A one-day special event liability policy is a short-term insurance certificate that covers a
          single date, protecting the policyholder (usually the couple, sometimes a vendor) against
          claims like a guest injury or property damage during the event. It is separate from a
          caterer&rsquo;s or florist&rsquo;s own business liability insurance, which covers their
          operations generally, not your specific wedding date.
        </p>
        <p>
          Public gardens, museums and historic estates ask for it more consistently than a standard
          rented hall, largely because the building or grounds they are protecting are harder and more
          expensive to replace.
        </p>

        <h2 id="how-much">How much coverage venues typically ask for</h2>
        <p>
          $1 million per occurrence and $2 million aggregate is a common figure for outdoor and
          public-venue weddings in the US, and it is what most one-day policies default to. Some city-
          or county-run gardens set a higher minimum. The venue&rsquo;s own rental packet is the source
          that matters here &mdash; a generic figure from a blog post, including this one, is a starting
          point for the conversation, not a substitute for asking.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/pattern-01.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Insurance and permits rarely show up on a venue&rsquo;s highlight reel, but they belong on the same checklist as ventilation and catering.</figcaption>
        </figure>

        <h2 id="cost-timing">Cost and timing</h2>
        <p>
          Basic one-day liability policies commonly run well under $200, with higher coverage limits or
          weather-cancellation add-ons costing more. Most insurers let you buy coverage right up until
          shortly before the event, which makes it easy to postpone &mdash; buy it once your date and
          headcount are confirmed rather than leaving it for the final week, since some venues want the
          certificate on file in advance, not on the wedding day itself.
        </p>

        <h2 id="permits">Permits are a separate question from insurance</h2>
        <p>
          At public botanical gardens and municipal glasshouses, a use or event permit is often required
          on top of the rental fee and the insurance certificate, with its own application and sometimes
          a longer lead time than either. See our
          <a href="/blog/botanical-garden-wedding-rules/">botanical garden rules guide</a> for what else
          differs about renting inside a public institution.
        </p>

        <h2 id="who-pays">Who is responsible: the couple or the vendors?</h2>
        <p>
          It genuinely varies. Some venues only require the couple&rsquo;s own policy; others require
          every vendor on site &mdash; caterer, florist, band or DJ &mdash; to carry and prove their own
          coverage as well. Get the specific requirement in writing from the venue rather than assuming
          one party&rsquo;s insurance covers the whole event; see our
          <a href="/blog/vendor-logistics-glass-venues/">vendor logistics guide</a> for what caterers and
          florists specifically need to know.
        </p>
"""
    return _article_shell(
        path="/blog/wedding-insurance-permits-glass-venues/",
        title="Wedding Insurance and Permits for Greenhouse and Garden Venues",
        desc=("What one-day wedding liability insurance actually covers, how much coverage venues "
              "typically ask for, and when a public garden also requires a separate permit."),
        h1="Wedding insurance and permits for greenhouse and garden venues",
        dek=("The paperwork side of booking a glasshouse or botanical garden venue: what coverage "
             "venues ask for, who is responsible for it, and how permits fit in."),
        section="Planning", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("what-it-is", "What event insurance means"),
             ("how-much", "How much coverage"),
             ("cost-timing", "Cost and timing"),
             ("permits", "Permits"),
             ("who-pays", "Who is responsible")],
        body=body, faq_items=faqs.BLOG_INSURANCE,
        faq_heading="Insurance and permits FAQs",
        related=[("/blog/greenhouse-wedding-venue-checklist/", "The venue checklist", "Planning"),
                 ("/blog/botanical-garden-wedding-rules/", "Botanical garden wedding rules", "Planning"),
                 ("/blog/vendor-logistics-glass-venues/", "Vendor logistics at glass venues", "Logistics")],
        keywords=["greenhouse wedding venues", "wedding venue checklist", "botanical garden wedding venues"],
        words=800, all_venues=all_venues)


def capacity_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Plan roughly 12&ndash;15 sq ft per guest for a seated dinner, plus 2&ndash;4 sq ft per guest if there is a dance floor.</li>
            <li>A venue&rsquo;s published "maximum capacity" is often a standing-room or fire-code figure, not a seated-dinner figure.</li>
            <li>Ceremony and reception capacity are usually two different numbers for the same room.</li>
            <li>This directory only publishes a capacity figure once it is confirmed on the venue&rsquo;s own page — a dash means unconfirmed, not small.</li>
          </ul>
        </aside>

        <h2 id="the-math">The rough math</h2>
        <p>
          As a general planning figure &mdash; not specific to any listed venue &mdash; a seated dinner
          at round tables needs about 12 to 15 square feet per guest, covering the table, chairs and
          room to move between them. A dance floor adds roughly 2 to 4 square feet per guest on top of
          that, and a band, DJ booth, bar or photo backdrop each take a bite out of the room before a
          single guest arrives.
        </p>
        <p>
          None of this is specific to glasshouses, but it matters more in one: a genuinely beautiful
          100-person room can turn out to seat 70 once a dance floor, bar and planting are accounted for.
        </p>

        <h2 id="two-numbers">Why ceremony and reception capacity differ</h2>
        <p>
          A ceremony layout &mdash; rows of chairs facing one point &mdash; uses floor space far more
          efficiently than a reception layout with round tables and a dance floor. The same room can
          genuinely hold close to twice as many people for a ceremony as it can for a seated dinner.
          Ask a venue for both figures specifically; a single "capacity" number on a listing page is
          almost always one or the other, not both.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/square-01.svg" alt="" aria-hidden="true" width="800" height="800"
               loading="lazy" decoding="async" class="aspect-square w-full rounded-card object-cover">
          <figcaption>Planting, a dance floor and a band each take real floor space that a headline capacity figure does not always subtract.</figcaption>
        </figure>

        <h2 id="planting">Does planting reduce usable capacity?</h2>
        <p>
          Often, yes, and it is easy to miss. A working greenhouse&rsquo;s listed square footage does
          not always account for permanent benches, raised beds or large potted specimens that stay in
          place during an event. Ask whether a quoted capacity already assumes the room as it normally
          looks, or an empty shell.
        </p>

        <h2 id="how-full">Should you book right at the maximum?</h2>
        <p>
          Generally not. A common rule of thumb among planners is to target around 80% of a venue&rsquo;s
          maximum for a comfortable guest experience, leaving room for walkways, a gift table,
          accessibility needs and vendor space. A room that is technically large enough on paper can
          still feel genuinely packed at full capacity &mdash; see our
          <a href="/blog/greenhouse-wedding-venue-checklist/">venue checklist</a> for the rest of the
          questions worth asking on a tour.
        </p>
"""
    return _article_shell(
        path="/blog/wedding-venue-capacity-planning/",
        title="How Many Guests Actually Fit? Capacity Planning for Glass Venues",
        desc=("The square-footage math behind wedding venue capacity, why ceremony and reception "
              "numbers differ, and why a published maximum can overstate what comfortably fits."),
        h1="How many guests actually fit? Capacity planning for glass venues",
        dek=("A venue&rsquo;s headline capacity figure is rarely the number that matters for your "
             "actual layout — here is the math behind it, and the questions to ask instead."),
        section="Planning", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("the-math", "The rough math"),
             ("two-numbers", "Ceremony vs. reception"),
             ("planting", "Does planting reduce capacity"),
             ("how-full", "Booking at the maximum")],
        body=body, faq_items=faqs.BLOG_CAPACITY,
        faq_heading="Capacity planning FAQs",
        related=[("/blog/small-greenhouse-wedding-venues/", "Small greenhouse wedding venues", "Micro-weddings"),
                 ("/blog/greenhouse-wedding-venue-checklist/", "The venue checklist", "Planning"),
                 ("/venues/", "Browse every listing", "Directory")],
        keywords=["greenhouse wedding venues", "small greenhouse wedding venues", "conservatory wedding venues"],
        words=750, all_venues=all_venues)


def spring_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Spring is, alongside autumn, one of the two seasons glasshouse venues book out furthest in advance.</li>
            <li>Mild temperatures make ventilation easier to manage than summer heat.</li>
            <li>Spring is also peak bloom and peak pollen in most of the US &mdash; worth a mention to allergy-prone guests.</li>
            <li>A fully enclosed glasshouse is a common spring choice specifically because spring rain is common too.</li>
          </ul>
        </aside>

        <h2 id="why-spring">Why spring suits a glasshouse wedding</h2>
        <p>
          Spring pairs two things a glass building is genuinely good at: mild outdoor temperatures,
          which make ventilation and comfort easier to manage than in high summer, and peak seasonal
          bloom, which fills the room and the grounds around it without any decorating effort. Public
          gardens in particular tend to look their fullest in spring, since it is when most flowering
          displays are timed to peak.
        </p>

        <h2 id="still-need-rain-plan">Spring weather still means a rain plan</h2>
        <p>
          Spring is one of the wetter seasons across much of the US, which is part of why a fully
          enclosed glasshouse is such a common choice for a spring wedding in the first place. See our
          <a href="/blog/rain-proof-outdoor-wedding-venues/">rain-proof venues guide</a> for what the
          phrase should actually mean before you assume a venue qualifies.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/wide-02.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Spring plantings fill a glasshouse without any additional decor budget &mdash; the trade-off is a booking calendar that fills just as fast.</figcaption>
        </figure>

        <h2 id="pollen">Pollen and allergies in spring</h2>
        <p>
          Spring is peak pollen season in most of the US, and a greenhouse or botanical garden is, by
          definition, full of the flowering plants that produce it. It is rarely a reason to rule a
          venue out, but it is worth mentioning to any guest with known seasonal allergies, and worth
          asking the venue what will actually be in bloom on your date.
        </p>

        <h2 id="booking-window">How far ahead to book a spring date</h2>
        <p>
          Spring and autumn are, together, the two seasons that book out furthest for popular
          glasshouses &mdash; commonly 12 to 18 months ahead, per our
          <a href="/blog/how-far-in-advance-book-greenhouse-venue/">booking timeline guide</a>. A
          specific weekend at peak bloom tends to be the first thing to go.
        </p>
"""
    return _article_shell(
        path="/blog/spring-greenhouse-wedding/",
        title="Planning a Spring Greenhouse Wedding",
        desc=("Why spring suits a glasshouse wedding, why a rain plan still matters, and what peak "
              "bloom season means for pollen and booking windows."),
        h1="Planning a spring greenhouse wedding",
        dek=("The season glasshouse venues book out fastest for &mdash; what makes spring work, and "
             "what to plan around before you commit to a date."),
        section="Planning", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-spring", "Why spring works"),
             ("still-need-rain-plan", "Still need a rain plan"),
             ("pollen", "Pollen and allergies"),
             ("booking-window", "How far ahead to book")],
        body=body, faq_items=faqs.BLOG_SPRING,
        faq_heading="Spring wedding FAQs",
        related=[("/blog/how-far-in-advance-book-greenhouse-venue/", "How far in advance to book", "Planning"),
                 ("/blog/rain-proof-outdoor-wedding-venues/", "Rain-proof outdoor wedding venues", "Planning"),
                 ("/blog/fall-greenhouse-wedding/", "Planning a fall greenhouse wedding", "Planning")],
        keywords=["greenhouse wedding venues", "botanical garden wedding venues", "rain-proof outdoor wedding venues"],
        words=700, all_venues=all_venues)


def fall_guide(all_venues):
    body = """        <aside class="not-prose rounded-card border-l-2 border-champagne-500 bg-champagne-50/60 p-6" data-key-takeaways aria-labelledby="takeaways-heading">
          <h2 id="takeaways-heading" class="font-sans text-xs font-bold uppercase tracking-[0.16em] text-champagne-700">In short</h2>
          <ul class="mt-4 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Autumn is, alongside spring, one of the two seasons glasshouse venues book out furthest in advance.</li>
            <li>The same day can need both ventilation in the afternoon and heating after sunset — ask about both.</li>
            <li>Daylight saving time can shift usable daylight by an hour between two dates a few weeks apart.</li>
            <li>Peak-foliage weekends tend to book first, the same way peak-bloom spring weekends do.</li>
          </ul>
        </aside>

        <h2 id="why-fall">Why autumn suits a glasshouse wedding</h2>
        <p>
          Mild daytime temperatures make ventilation easier to manage than a summer afternoon, and
          low, golden late-day light is particularly flattering through glass &mdash; a large part of
          why photographers often name autumn as a favorite season for glasshouse weddings. Many public
          gardens are also still in active bloom well into early autumn, depending on climate and
          region.
        </p>

        <h2 id="both-ends">A day that can need both ventilation and heat</h2>
        <p>
          Autumn is the season most likely to need both ends of a glasshouse&rsquo;s climate system on
          the same day: an early-autumn afternoon can still run warm enough to need ventilation, while
          the same evening after sunset can turn cold enough to need heat. Ask about both, the same way
          you would for a winter date &mdash; see our
          <a href="/blog/greenhouse-ventilation-heating/">ventilation and heating guide</a> for the
          specific questions.
        </p>

        <figure class="my-10">
          <img src="/assets/img/patterns/pattern-02.svg" alt="" aria-hidden="true" width="1600" height="900"
               loading="lazy" decoding="async" class="aspect-[16/10] w-full rounded-card object-cover">
          <figcaption>Low autumn light through glass is a large part of why photographers often name it a favorite wedding season.</figcaption>
        </figure>

        <h2 id="daylight">Daylight saving time can move your timeline</h2>
        <p>
          Clocks changing partway through autumn in the US means a date in early October and a date in
          early November can have a meaningfully different sunset time, even though they feel like the
          "same season." Check the actual sunset time for your specific date rather than assuming it
          matches an earlier autumn wedding you attended, especially if outdoor photos or a cocktail
          hour are planned around golden hour.
        </p>

        <h2 id="booking-window">How far ahead to book a fall date</h2>
        <p>
          Autumn and spring are, together, the two seasons that book out furthest for popular
          glasshouses &mdash; commonly 12 to 18 months ahead, per our
          <a href="/blog/how-far-in-advance-book-greenhouse-venue/">booking timeline guide</a>. Peak
          foliage weekends in particular tend to be the first dates to go.
        </p>
"""
    return _article_shell(
        path="/blog/fall-greenhouse-wedding/",
        title="Planning a Fall Greenhouse Wedding",
        desc=("Why autumn suits a glasshouse wedding, why the same day can need both ventilation and "
              "heat, and how daylight saving time can shift your photo and ceremony timeline."),
        h1="Planning a fall greenhouse wedding",
        dek=("Golden light and mild afternoons make autumn a favorite glasshouse season &mdash; here is "
             "what else to plan around before you book a date."),
        section="Planning", read=6,
        published="2026-09-18T09:00:00-04:00", modified="2026-09-18T09:00:00-04:00",
        toc=[("why-fall", "Why autumn works"),
             ("both-ends", "Ventilation and heat, same day"),
             ("daylight", "Daylight saving time"),
             ("booking-window", "How far ahead to book")],
        body=body, faq_items=faqs.BLOG_FALL,
        faq_heading="Autumn wedding FAQs",
        related=[("/blog/spring-greenhouse-wedding/", "Planning a spring greenhouse wedding", "Planning"),
                 ("/blog/greenhouse-ventilation-heating/", "Ventilation and heating", "Planning"),
                 ("/blog/how-far-in-advance-book-greenhouse-venue/", "How far in advance to book", "Planning")],
        keywords=["greenhouse wedding venues", "conservatory wedding venues", "botanical garden wedding venues"],
        words=700, all_venues=all_venues)


# ============================================================= BLOG INDEX ====
def blog_index(all_venues):
    st = stats(all_venues)
    path = "/blog/"
    title = "Greenhouse Wedding Planning Guides | Costs, Venues &amp; Logistics"
    desc = ("Practical guides to getting married under glass: real costs, rain-proof venues, "
            "small and micro weddings, ventilation, catering, timing and a booking checklist.")

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
        ("/blog/conservatory-vs-greenhouse/",
         "Conservatory vs. greenhouse vs. orangery: a field guide",
         "The three words get used interchangeably in venue listings. Here is what actually separates them and why it matters for your booking.",
         "Types", "7 min", "2026-09-18", "/assets/img/patterns/wide-01.svg",
         "Decorative botanical pattern"),
        ("/blog/botanical-garden-wedding-rules/",
         "Botanical garden weddings: rules, catering and what to ask",
         "A botanical garden is a public institution first and an event venue second. That order shapes almost every rule you will run into.",
         "Planning", "7 min", "2026-09-18", "/assets/img/patterns/wide-02.svg",
         "Decorative botanical pattern"),
        ("/blog/greenhouse-ventilation-heating/",
         "Ventilation and heating: will your glasshouse actually work?",
         "Glass concentrates heat and traps humidity. The questions that tell you whether a venue has actually solved this or just hopes for a mild day.",
         "Planning", "6 min", "2026-09-18", "/assets/img/patterns/pattern-01.svg",
         "Decorative botanical pattern"),
        ("/blog/winter-greenhouse-wedding/",
         "Planning a winter greenhouse wedding",
         "Glass and low winter light are a genuinely good match. What to check before you book a cold-season date.",
         "Planning", "7 min", "2026-09-18", "/assets/img/patterns/pattern-02.svg",
         "Decorative botanical pattern"),
        ("/blog/summer-greenhouse-wedding/",
         "Planning a summer greenhouse wedding",
         "The season with the most daylight is also the one where glass heat becomes a real planning problem. How to avoid the July afternoon mistake.",
         "Planning", "6 min", "2026-09-18", "/assets/img/patterns/pattern-03.svg",
         "Decorative botanical pattern"),
        ("/blog/greenhouse-wedding-catering/",
         "Catering at a greenhouse wedding: BYO vs. in-house",
         "Whether you can bring your own caterer changes the whole budget conversation. What to ask before you fall in love with a venue.",
         "Planning", "6 min", "2026-09-18", "/assets/img/patterns/pattern-04.svg",
         "Decorative botanical pattern"),
        ("/blog/how-far-in-advance-book-greenhouse-venue/",
         "How far in advance to book a greenhouse wedding venue",
         "Glasshouses are a small category with an outsized following. What that does to the booking calendar.",
         "Planning", "6 min", "2026-09-18", "/assets/img/patterns/pattern-05.svg",
         "Decorative botanical pattern"),
        ("/blog/greenhouse-elopement-micro-ceremony/",
         "Elopements and micro-ceremonies in a glasshouse",
         "A small glasshouse can be the entire wedding, not a consolation prize. What changes when the guest list is under 20.",
         "Micro-weddings", "6 min", "2026-09-18", "/assets/img/patterns/pattern-06.svg",
         "Decorative botanical pattern"),
        ("/blog/vendor-logistics-glass-venues/",
         "Vendor logistics at glass venues: a briefing for caterers and florists",
         "The questions your caterer and florist actually need answered before they quote on a glasshouse booking.",
         "Logistics", "6 min", "2026-09-18", "/assets/img/patterns/square-01.svg",
         "Decorative botanical pattern"),
        ("/blog/greenhouse-wedding-venue-checklist/",
         "The greenhouse wedding venue checklist: 20 questions",
         "Every question from every guide on this site, in one interactive checklist you can work through on a tour.",
         "Planning", "8 min", "2026-09-18", "/assets/img/patterns/square-02.svg",
         "Decorative botanical pattern"),
        ("/blog/wedding-insurance-permits-glass-venues/",
         "Wedding insurance and permits for greenhouse and garden venues",
         "What one-day liability insurance actually covers, how much venues typically ask for, and when a permit is a separate requirement.",
         "Planning", "6 min", "2026-09-18", "/assets/img/patterns/pattern-01.svg",
         "Decorative botanical pattern"),
        ("/blog/wedding-venue-capacity-planning/",
         "How many guests actually fit? Capacity planning for glass venues",
         "The square-footage math behind venue capacity, and why a published maximum can overstate what comfortably fits.",
         "Planning", "6 min", "2026-09-18", "/assets/img/patterns/square-01.svg",
         "Decorative botanical pattern"),
        ("/blog/spring-greenhouse-wedding/",
         "Planning a spring greenhouse wedding",
         "Why spring suits a glasshouse wedding, why a rain plan still matters, and what peak bloom means for booking windows.",
         "Planning", "6 min", "2026-09-18", "/assets/img/patterns/wide-02.svg",
         "Decorative botanical pattern"),
        ("/blog/fall-greenhouse-wedding/",
         "Planning a fall greenhouse wedding",
         "Why autumn suits a glasshouse wedding, why the same day can need both ventilation and heat, and how daylight saving time shifts your timeline.",
         "Planning", "6 min", "2026-09-18", "/assets/img/patterns/pattern-02.svg",
         "Decorative botanical pattern"),
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
            <img src="{img if img.startswith('/') else f'/assets/img/blog/{img}'}" alt="{alt}" width="1600" height="900"
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
        Practical guides to getting married under glass. Seventeen published so far &mdash; we would
        rather publish seventeen we can stand behind than a hundred padded with numbers we cannot source.
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
    desc = ("The sourcing rules behind this venue directory: where listings come from, what an "
            "unconfirmed field means, and how to request a correction or removal.")
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

    return head(title, desc, path, og_image="/assets/img/blog/blog-index.jpg", extra=extra) + header("methodology") + f"""
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
              directly &mdash; mail isn&rsquo;t set up on this address yet, so treat it as a placeholder for now.
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

    return head(title, desc, path, og_image="/assets/img/blog/blog-index.jpg", extra=extra) + header() + f"""
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

    return head(title, desc, path, og_image="/assets/img/blog/blog-index.jpg", extra=extra) + header() + f"""
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

    return head(title, desc, "/404.html", og_image="/assets/img/blog/blog-index.jpg",
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
