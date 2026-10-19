import type { Article } from "@/lib/types";

/**
 * Roundup guides built from the catalogue's evidence-graded records plus sourced research (2026-10-15).
 * Every statement is either a recorded fact with a source, or says plainly that it is unknown.
 */
const D = "2026-10-15";
const base = { createdAt: D, updatedAt: D, publishAt: null, aiGenerated: false, status: "published", reviewed: false, category: "Guides" } as const;

const BUY = `## What to check before you buy

- Match the reference printed on the frame or in the listing to the model page. Sellers often use a film name for a look-alike.
- Compare frame and lens colour with the details on the model page; several designs were sold in more than one colour.
- Treat any listing that promises "the exact film pair" with caution unless it cites a source. This site grades that claim by evidence.
- Prices change daily. Confirm the current price, shipping and returns at the store.`;

const raw: Article[] = [
  {
    ...base, id: "most-iconic-sunglasses-in-movie-history", slug: "most-iconic-sunglasses-in-movie-history",
    title: "Most Iconic Sunglasses in Movie History",
    metaTitle: "Most Iconic Sunglasses in Movie History, Graded",
    metaDescription: "Most iconic sunglasses in movie history: from Breakfast at Tiffany's to Men in Black, each pair graded by evidence, with where to buy.",
    excerpt: "Documented pairs from 1961 to 1997, ordered by how well the evidence supports them, not by popularity.",
    answer: "The most iconic sunglasses in movie history include the Persol 714 in The Thomas Crown Affair, the Oliver Goldsmith Manhattan in Breakfast at Tiffany's, the Ray-Ban Wayfarer and Aviator, the Predator 2 in Men in Black and the Clubmaster in Reservoir Dogs. We order them by strength of evidence because we have no popularity data.",
    targetKeyword: "iconic movie sunglasses", searchIntent: "Informational list with a path to buy",
    modelIds: ["persol-714-steve-mcqueen", "oliver-goldsmith-manhattan", "ray-ban-wayfarer-bl-vintage", "ray-ban-aviator-bl-vintage", "ray-ban-predator-2-rb2027", "ray-ban-clubmaster-rb3016", "gargoyles-classics"],
    movieIds: ["the-thomas-crown-affair-1968", "breakfast-at-tiffanys", "the-blues-brothers", "risky-business", "top-gun", "men-in-black", "reservoir-dogs", "the-terminator"],
    body: `## How we ordered this list

"Iconic" is a judgement, and we have no audience or sales data to rank by. So this list is ordered by how well each identification is supported by the sources we reviewed on ${D}. Pairs whose identification is disputed are listed separately at the end.

## Strongest evidence

- **Persol 714, The Thomas Crown Affair (1968).** Steve McQueen wore the folding Persol 714 with Havana frames and crystal-blue lenses. Accounts differ on whether the pair was his own. Persol sells a Steve McQueen edition, recorded as the [Persol 714 Steve McQueen](/sunglasses/persol-714-steve-mcqueen).
- **Oliver Goldsmith Manhattan, Breakfast at Tiffany's (1961).** Holly Golightly's black wayfarer-style pair, reissued by the brand as the [Manhattan](/sunglasses/oliver-goldsmith-manhattan) for the film's 50th anniversary.
- **Ray-Ban Wayfarer, The Blues Brothers (1980) and Risky Business (1983).** See the [Bausch & Lomb era Wayfarer](/sunglasses/ray-ban-wayfarer-bl-vintage) and its current-production equivalent.
- **Ray-Ban Aviator, Top Gun (1986).** The [Aviator](/sunglasses/ray-ban-aviator-bl-vintage) is tied to Maverick in both Top Gun films.
- **Ray-Ban Predator 2, Men in Black (1997).** The wraparound [Predator 2](/sunglasses/ray-ban-predator-2-rb2027).
- **Ray-Ban Clubmaster, Reservoir Dogs (1992).** Three sources name the [Clubmaster RB3016](/sunglasses/ray-ban-clubmaster-rb3016) for Tim Roth's Mr. Orange.
- **Gargoyles Classics, The Terminator (1984).** Two sources name the [Gargoyles ANSI Classics](/sunglasses/gargoyles-classics). We found no source for Terminator 2.

## Famous, but disputed or unconfirmed

Taxi Driver (Ray-Ban Caravan versus American Optical), The Matrix (custom frames, no model names), F1 (a vintage S.T. Dupont D002 versus unbranded frames) and Fear and Loathing in Las Vegas (aviator-style, brand disputed) are widely discussed. Their grades on this site are Unconfirmed, and each model page shows why.

## Where to go next

Browse every documented pair in the [catalog](/sunglasses), see the cheaper options on the [affordable alternatives](/affordable-alternatives) page, or read how a pair gets its grade in our [methodology](/about).`,
    faq: [
      { q: "What are the most iconic sunglasses in movie history?", a: "Documented candidates include the Persol 714, the Oliver Goldsmith Manhattan, the Ray-Ban Wayfarer, Aviator, Predator 2 and Clubmaster. We order them by evidence, not popularity." },
      { q: "Why is there no ranking by popularity?", a: "We have no audience or sales data. A ranking would be opinion presented as fact." },
      { q: "Which famous pairs are still disputed?", a: "Taxi Driver, The Matrix, F1 and Fear and Loathing in Las Vegas are graded Unconfirmed because sources disagree or name no model." },
    ],
    sources: [
      { title: "Atom Retro: Persol Steve McQueen 714 folding", url: "https://www.atomretro.com/persol-steve-mcqueen-714-folding-sunglasses-black" },
      { title: "SunglassesID: Oliver Goldsmith, Audrey Hepburn, Breakfast at Tiffany's", url: "https://www.sunglassesid.com/node/1969" },
      { title: "Wikipedia: Ray-Ban Wayfarer", url: "https://en.wikipedia.org/wiki/Ray-Ban_Wayfarer" },
      { title: "Fortune/Bloomberg: Top Gun: Maverick and the sunglass industry (2022)", url: "https://fortune.com/europe/2022/07/19/top-gun-maverick-y2k-nostalgia-sunglass-industry" },
      { title: "SunglassesID: Ray-Ban 2027 and 2030 Predator, Men in Black", url: "https://sunglassesid.com/node/1737" },
      { title: "SunglassesID: Ray-Ban 3016 Clubmaster, Tim Roth, Reservoir Dogs", url: "https://www.sunglassesid.com/node/1743" },
      { title: "BAMF Style: The Terminator, Gargoyle sunglasses", url: "https://bamfstyle.com/2023/02/09/terminator-leather/" },
    ],
  },
  {
    ...base, id: "best-movie-inspired-sunglasses-under-100", slug: "best-movie-inspired-sunglasses-under-100",
    title: "Best Movie-Inspired Sunglasses Under $100",
    metaTitle: "Best Movie-Inspired Sunglasses Under $100: What We Verified",
    metaDescription: "Movie-inspired sunglasses under $100: two budget pairs with a price we could source, and the ones we could not verify. Look-alikes, not film pairs.",
    excerpt: "Only two of our budget picks had a price we could source. We say which, and which we could not check.",
    answer: "Two movie-inspired sunglasses under $100 had a price we could source on 2026-10-15: the Knockaround Premiums (listed at $35 by Academy) and the goodr OG (listed at $25 by REI). Other budget picks below are look-alikes whose prices we could not verify, so we do not quote them.",
    targetKeyword: "movie inspired sunglasses under 100", searchIntent: "Commercial: affordable look-alikes with honest prices",
    modelIds: ["knockaround-premiums", "goodr-og", "knockaround-fort-knocks", "knockaround-fast-lanes", "quay-all-in"],
    movieIds: ["risky-business", "the-blues-brothers", "top-gun", "men-in-black", "the-terminator"],
    body: `## What we could verify

On ${D} we checked retailer listings for each pick. Prices are retailer snapshots, not offers, and they change.

- **[Knockaround Premiums](/sunglasses/knockaround-premiums).** Academy lists the standard Premiums at $35 and the Premiums Sport at an MSRP of $38. A wayfarer-inspired shape, close in spirit to the pair in [Risky Business](/movies/risky-business) and [The Blues Brothers](/movies/the-blues-brothers).
- **[Goodr OG](/sunglasses/goodr-og).** REI lists the goodrOGs polarized at $25. A rectangular, dark and light frame that recalls the [Gargoyles Classics](/sunglasses/gargoyles-classics) of The Terminator.

## What we could not verify

We found no source with a price for these, so we do not quote one. Each remains in the editorial "under $100" band until a store listing confirms it.

- [Knockaround Fort Knocks](/sunglasses/knockaround-fort-knocks), an aviator-style look-alike for [Top Gun](/movies/top-gun).
- [Knockaround Fast Lanes](/sunglasses/knockaround-fast-lanes), a wraparound for the look of [Men in Black](/movies/men-in-black).
- [Quay All In](/sunglasses/quay-all-in), a compact aviator. We found no listing for this model; a retailer showed a different Quay style instead.

## What these are, and are not

None of these is the pair worn on screen. They are look-alikes chosen for shape and colour, and the model pages say which original each resembles. For the originals and their reissues, see the [catalog](/sunglasses).

${BUY}

See the full [affordable alternatives](/affordable-alternatives) page for more options by budget band.`,
    faq: [
      { q: "Are these the sunglasses worn in the movies?", a: "No. They are look-alikes chosen for shape and colour, not the film pairs." },
      { q: "What are the cheapest movie-inspired sunglasses you could verify?", a: "The goodr OG at $25 on REI and the Knockaround Premiums at $35 on Academy, as listed on 2026-10-15." },
      { q: "Why don't you list a price for every pair?", a: "We only quote prices we found in a store listing. For the rest, check the store." },
    ],
    sources: [
      { title: "Academy: Knockaround sunglasses", url: "https://www.academy.com/c/shops/all-accessories/sunglasses-and-accessories/knockaround-sunglasses" },
      { title: "REI: sunglasses", url: "https://www.rei.com/c/sunglasses" },
      { title: "Silodrome: Fort Knocks sunglasses", url: "https://silodrome.com/fort-knocks-sunglasses-knockarounds" },
    ],
  },
  {
    ...base, id: "affordable-alternatives-to-famous-movie-sunglasses", slug: "affordable-alternatives-to-famous-movie-sunglasses",
    title: "Affordable Alternatives to Famous Movie Sunglasses",
    metaTitle: "Affordable Alternatives to Famous Movie Sunglasses",
    metaDescription: "Affordable alternatives to famous movie sunglasses: which budget and mid-priced look-alikes match each film pair, and what we could verify.",
    excerpt: "For each famous pair, the look-alikes we match to it, and which price claims we could source.",
    answer: "Affordable alternatives to famous movie sunglasses are look-alikes matched by shape: Knockaround, Oakley and Ray-Ban's current wayfarer for the Wayfarer; Knockaround, Quay and American Optical for the Aviator; and Knockaround or goodr for dark wraps. Price bands are editorial estimates; only two prices were verified.",
    targetKeyword: "affordable alternatives movie sunglasses", searchIntent: "Commercial hub: match a film pair to cheaper options",
    modelIds: ["ray-ban-original-wayfarer-rb2140", "oakley-frogskins", "knockaround-premiums", "knockaround-fort-knocks", "quay-all-in", "american-optical-original-pilot", "knockaround-fast-lanes", "goodr-og", "persol-649", "dita-kudru"],
    movieIds: ["risky-business", "top-gun", "men-in-black", "breakfast-at-tiffanys", "the-thomas-crown-affair-1968", "f1-the-movie"],
    body: `## How matches are made

Each alternative is linked to an original by shape and general look, with the reason recorded on its page. None is the pair worn on screen. Price bands ("Under $50", "Under $100", "Under $200") are editorial estimates; we mark them "(est.)" until a store feed confirms a price.

## By famous pair

- **Wayfarer** ([Risky Business](/movies/risky-business), [The Blues Brothers](/movies/the-blues-brothers)): the current [Ray-Ban Original Wayfarer](/sunglasses/ray-ban-original-wayfarer-rb2140), the [Oakley Frogskins](/sunglasses/oakley-frogskins) and the [Knockaround Premiums](/sunglasses/knockaround-premiums).
- **Oliver Goldsmith Manhattan** ([Breakfast at Tiffany's](/movies/breakfast-at-tiffanys)): the same three wayfarer shapes at lower price bands.
- **Aviator** ([Top Gun](/movies/top-gun)): the [Knockaround Fort Knocks](/sunglasses/knockaround-fort-knocks), the [Quay All In](/sunglasses/quay-all-in) and the [American Optical Original Pilot](/sunglasses/american-optical-original-pilot).
- **Predator 2** ([Men in Black](/movies/men-in-black)): the [Knockaround Fast Lanes](/sunglasses/knockaround-fast-lanes) and the [Goodr OG](/sunglasses/goodr-og), both dark and low-profile.
- **Persol 714** ([The Thomas Crown Affair](/movies/the-thomas-crown-affair-1968)): its non-folding sibling, the [Persol 649](/sunglasses/persol-649), for the same brand at a lower price than a folding edition.
- **F1 aviators** ([F1](/movies/f1-the-movie)): the [Dita Kudru](/sunglasses/dita-kudru), suggested by SunglassesID, and a budget gold aviator.

## Prices we could verify

On ${D}, Academy listed the Knockaround Premiums at $35 and REI listed the goodr OG at $25. We could not source prices for the other alternatives, so we quote none.

## Browse by budget

See every pick grouped by band on the [affordable alternatives](/affordable-alternatives) page.

${BUY}`,
    faq: [
      { q: "Are alternatives the same as the movie pair?", a: "No. They are look-alikes matched by shape and colour." },
      { q: "Which alternatives have a verified price?", a: "Knockaround Premiums at $35 (Academy) and goodr OG at $25 (REI), as listed on 2026-10-15." },
      { q: "What does the price band mean?", a: "It is our editorial estimate. We replace it with a real price only when a store offer is recorded." },
    ],
    sources: [
      { title: "Academy: Knockaround sunglasses", url: "https://www.academy.com/c/shops/all-accessories/sunglasses-and-accessories/knockaround-sunglasses" },
      { title: "REI: sunglasses", url: "https://www.rei.com/c/sunglasses" },
      { title: "SunglassesID: S.T. Dupont D002 6051, Brad Pitt, F1", url: "https://sunglassesid.com/node/2810" },
    ],
  },
  {
    ...base, id: "best-1980s-movie-sunglasses", slug: "best-1980s-movie-sunglasses",
    title: "Best 1980s Movie Sunglasses",
    metaTitle: "Best 1980s Movie Sunglasses: The Documented Pairs",
    metaDescription: "Best 1980s movie sunglasses: the Wayfarer, Aviator and Gargoyles pairs from The Blues Brothers to Top Gun, with evidence grades and sources.",
    excerpt: "The decade that made Ray-Ban a film brand, with what the sources actually say.",
    answer: "The best-documented 1980s movie sunglasses are the Ray-Ban Wayfarers of The Blues Brothers (1980), Risky Business (1983) and Miami Vice (1984), the Gargoyles Classics of The Terminator (1984) and the Ray-Ban Aviators of Top Gun (1986).",
    targetKeyword: "80s movie sunglasses", searchIntent: "Informational list by decade",
    modelIds: ["ray-ban-wayfarer-bl-vintage", "ray-ban-original-wayfarer-rb2140", "ray-ban-aviator-bl-vintage", "ray-ban-aviator-classic-rb3025", "gargoyles-classics"],
    movieIds: ["the-blues-brothers", "risky-business", "the-terminator", "top-gun", "miami-vice"],
    body: `## The decade in short

Wikipedia's history of the Wayfarer reports that Ray-Ban paid a product-placement firm $50,000 a year from 1982 to put its sunglasses in at least 60 films and shows a year. Whatever the cause, the pairs below are the ones sources tie to the 1980s screen.

## 1980: The Blues Brothers

Jake and Elwood wear [Ray-Ban Wayfarers](/sunglasses/ray-ban-wayfarer-bl-vintage). Three retail sources agree. One cites the 5022 reference, which we could not corroborate. Read the full [Blues Brothers guide](/blog/the-blues-brothers-sunglasses).

## 1983: Risky Business

Tom Cruise's Joel Goodsen wears Wayfarers too. The film is widely credited with reviving the model; the most repeated sales figure traces to a single source. See the [Risky Business guide](/blog/tom-cruise-risky-business-sunglasses).

## 1984: The Terminator and Miami Vice

Two sources name the [Gargoyles ANSI Classics](/sunglasses/gargoyles-classics) for the T-800 in [The Terminator](/movies/the-terminator). In [Miami Vice](/movies/miami-vice) the Wayfarer became Sonny Crockett's signature pair from the second episode, per the Miami Vice Wiki; he wore Carrera 5512s in the first.

## 1986: Top Gun

Maverick wears Ray-Ban Aviators. Coverage of the sequel describes the later demand as a repeat of 1986. The 1986 production reference is not documented, so we record it as the [Bausch & Lomb era Aviator](/sunglasses/ray-ban-aviator-bl-vintage). The [Top Gun guide](/blog/top-gun-sunglasses-tom-cruise-aviators) has the details.

## Famous but not branded

Guides also single out Madonna's black D-frame shades in Desperately Seeking Susan (1985) and Michelle Pfeiffer's oversized pink cat-eyes in Scarface (1983). We found no source naming a maker for either, so they are not in our catalog.

## Buying today

For the current-production equivalents, see the [Original Wayfarer](/sunglasses/ray-ban-original-wayfarer-rb2140) and the [Aviator Classic](/sunglasses/ray-ban-aviator-classic-rb3025). Browse [vintage eyewear](/vintage) for period pairs.`,
    faq: [
      { q: "What sunglasses were most famous in 1980s movies?", a: "Ray-Ban Wayfarers and Aviators, plus the Gargoyles Classics in The Terminator." },
      { q: "Which 80s pair is least certain?", a: "The exact reference of the Top Gun Aviators and the 5022 Wayfarer in The Blues Brothers are not corroborated." },
      { q: "Can I still buy 1980s movie sunglasses?", a: "Current Wayfarers and Aviators are sold new. Period Bausch & Lomb pairs appear on the vintage market." },
    ],
    sources: [
      { title: "Wikipedia: Ray-Ban Wayfarer", url: "https://en.wikipedia.org/wiki/Ray-Ban_Wayfarer" },
      { title: "MeTV: A comprehensive history of the iconic Ray-Ban Wayfarer", url: "https://metv.com/stories/a-comprehensive-history-of-the-iconic-ray-ban-wayfarer" },
      { title: "Miami Vice Wiki: Ray-Ban Wayfarers", url: "https://miamivice.fandom.com/wiki/Ray-Ban_Wayfarers" },
      { title: "BAMF Style: The Terminator, Gargoyle sunglasses", url: "https://bamfstyle.com/2023/02/09/terminator-leather/" },
      { title: "Fortune/Bloomberg: Top Gun: Maverick and the sunglass industry (2022)", url: "https://fortune.com/europe/2022/07/19/top-gun-maverick-y2k-nostalgia-sunglass-industry" },
      { title: "Vogue Scandinavia: The 10 most iconic eyewear moments in movie history", url: "https://www.voguescandinavia.com/articles/the-10-most-iconic-eyewear-moments-in-movie-history" },
    ],
  },
  {
    ...base, id: "best-1990s-movie-sunglasses", slug: "best-1990s-movie-sunglasses",
    title: "Best 1990s Movie Sunglasses",
    metaTitle: "Best 1990s Movie Sunglasses: Pairs, Grades and Sources",
    metaDescription: "Best 1990s movie sunglasses: the Clubmaster in Reservoir Dogs, the Predator 2 in Men in Black, plus The Matrix, Léon and more, graded by evidence.",
    excerpt: "From a Clubmaster to custom Matrix frames, with the unknowns spelled out.",
    answer: "The best-documented 1990s movie sunglasses are the Ray-Ban Clubmaster RB3016 in Reservoir Dogs (1992) and the Ray-Ban Predator 2 in Men in Black (1997). The Matrix (1999), Léon (1994) and Thelma & Louise (1991) are famous but less certain.",
    targetKeyword: "90s movie sunglasses", searchIntent: "Informational list by decade",
    modelIds: ["ray-ban-clubmaster-rb3016", "ray-ban-predator-2-rb2027", "blinde-design-matrix-custom", "magnoli-leon-replica", "randolph-engineering-aviator"],
    movieIds: ["reservoir-dogs", "men-in-black", "the-matrix", "leon-the-professional", "thelma-and-louise", "fear-and-loathing-in-las-vegas"],
    body: `## Best documented

- **Reservoir Dogs (1992).** Tim Roth's Mr. Orange wears the [Ray-Ban Clubmaster RB3016](/sunglasses/ray-ban-clubmaster-rb3016), named by SunglassesID, BAMF Style and a retail guide. The gang's look also relied on black suits, white shirts and black ties.
- **Men in Black (1997).** The wraparound [Ray-Ban Predator 2](/sunglasses/ray-ban-predator-2-rb2027), cited as reference 2027 and sometimes 2030. See the [Men in Black guide](/blog/men-in-black-sunglasses-original-models).

## Famous, less certain

- **The Matrix (1999).** Reportedly custom frames by Blinde Design Project for the three leads. No model names are documented, so the grade is Unconfirmed. Read [what Neo wears](/blog/what-sunglasses-does-neo-wear-in-the-matrix).
- **Léon (1994).** The maker of Jean Reno's round, crystal-framed glasses has not been identified. SunglassesID points to a replica by Magnoli Clothiers as the closest known, and one source suggests Junior Gaultier, uncorroborated. See [Léon: The Professional](/movies/leon-the-professional).
- **Thelma & Louise (1991).** One retailer names the Randolph Engineering Aviator T52, matte chrome with grey lenses, for Brad Pitt's J.D. Sources disagree on Susan Sarandon's pair, so we record none. See the [Randolph Aviator](/sunglasses/randolph-engineering-aviator).
- **Fear and Loathing in Las Vegas (1998).** Aviator-style shades whose brand, model and lens colour sources dispute.

## Reading the grades

A pair is graded Exact Match only when no source disputes it and it is backed by a strong source or two independent ones. That is why the most talked-about 1990s pairs are Unconfirmed here.

## Where next

Browse the [catalog](/sunglasses) or compare [vintage eyewear](/vintage).`,
    faq: [
      { q: "What sunglasses does Mr. Orange wear in Reservoir Dogs?", a: "Ray-Ban Clubmaster RB3016, according to three sources." },
      { q: "Are the Matrix sunglasses a known model?", a: "No. They were reportedly custom frames and no model names are documented." },
      { q: "Who made the glasses in Léon?", a: "Not identified. A replica by Magnoli Clothiers is the closest known." },
    ],
    sources: [
      { title: "SunglassesID: Ray-Ban 3016 Clubmaster, Tim Roth, Reservoir Dogs", url: "https://www.sunglassesid.com/node/1743" },
      { title: "BAMF Style: Reservoir Dogs, Mr. Orange", url: "https://bamfstyle.com/2022/10/02/reservoir-dogs-mr-orange/amp/" },
      { title: "SunglassesID: Ray-Ban 2027 and 2030 Predator, Men in Black", url: "https://sunglassesid.com/node/1737" },
      { title: "CheatSheet: The Matrix sunglasses were uniquely made for each cast member", url: "https://www.cheatsheet.com/entertainment/the-matrix-sunglasses-were-uniquely-made-for-each-cast-member.html" },
      { title: "SunglassesID: Léon: The Professional", url: "https://sunglassesid.com/node/3002" },
      { title: "EyeOns: Brad Pitt, Randolph aviator in Thelma & Louise", url: "https://www.eyeons.com/blogs/celebrities/brad-pitt-style-icon-randolph-aviator-sunglasses-in-thelma-louise" },
    ],
  },
  {
    ...base, id: "best-aviator-sunglasses-inspired-by-movies", slug: "best-aviator-sunglasses-inspired-by-movies",
    title: "Best Aviator Sunglasses Inspired by Movies",
    metaTitle: "Best Aviator Sunglasses Inspired by Movies",
    metaDescription: "Best aviator sunglasses inspired by movies: Top Gun, Taxi Driver, Thelma & Louise and F1, which pairs are documented and the aviators to buy.",
    excerpt: "Five films, five aviators, and a clear line between what is documented and what is disputed.",
    answer: "The best movie aviator sunglasses to start from are the Ray-Ban Aviator Classic RB3025 for Top Gun, the American Optical Original Pilot or Ray-Ban Caravan for Taxi Driver (disputed), the Randolph Engineering Aviator for Thelma & Louise (one retailer) and a vintage gold pair for F1 (disputed).",
    targetKeyword: "movie aviator sunglasses", searchIntent: "Commercial roundup by film",
    modelIds: ["ray-ban-aviator-classic-rb3025", "ray-ban-aviator-bl-vintage", "american-optical-original-pilot", "randolph-engineering-aviator", "st-dupont-d002-6051", "knockaround-fort-knocks", "quay-all-in"],
    movieIds: ["top-gun", "top-gun-maverick", "taxi-driver", "thelma-and-louise", "f1-the-movie", "fear-and-loathing-in-las-vegas"],
    body: `## Top Gun: Ray-Ban Aviator

Maverick wears Ray-Ban Aviators in both films. For 2022, three retail guides name the [Aviator Classic RB3025](/sunglasses/ray-ban-aviator-classic-rb3025). We did not find ray-ban.com's price. A price tracker recorded the RB3025 Gold/Blue 62 mm at $191.00 on Amazon US on 9 July 2026, with a lowest-ever of $133.70 in November 2025; treat that as a third-party snapshot. Details in the [Top Gun guide](/blog/top-gun-sunglasses-tom-cruise-aviators).

## Taxi Driver: disputed

Atom Retro names the Ray-Ban Caravan for Travis Bickle; American Optical says its FG-58, now the [Original Pilot](/sunglasses/american-optical-original-pilot), was the pair; style writers use the Randolph Aviator as a reference look. Which pair was used on screen is not settled.

## Thelma & Louise: Randolph T52 (one retailer)

EyeOns names the Randolph Engineering Aviator T52, matte chrome with grey lenses, for Brad Pitt's J.D. It is a single retailer, so the grade is Unconfirmed. See the [Randolph Engineering Aviator](/sunglasses/randolph-engineering-aviator).

## F1: oversized gold, disputed

Two sources name a vintage [S.T. Dupont D002](/sunglasses/st-dupont-d002-6051); a third says the frames are unbranded. Read the [F1 guide](/blog/what-sunglasses-does-brad-pitt-wear-in-f1).

## Fear and Loathing: aviator-style, brand unknown

Retailers name different models and lens colours, so we record only that the character wears aviator-style shades.

## Lower-priced aviators

The [Knockaround Fort Knocks](/sunglasses/knockaround-fort-knocks) and [Quay All In](/sunglasses/quay-all-in) are look-alikes in a lower editorial price band. We could not source a price for either. More in [aviator styles](/styles/aviator).

${BUY}`,
    faq: [
      { q: "Which aviator is the Top Gun pair?", a: "Ray-Ban Aviators. For the 2022 film, retail guides name the Aviator Classic RB3025." },
      { q: "What did Travis Bickle wear in Taxi Driver?", a: "Sources disagree: Ray-Ban Caravan versus American Optical FG-58." },
      { q: "Is the Thelma & Louise aviator confirmed?", a: "No. A single retailer names the Randolph T52." },
    ],
    sources: [
      { title: "Pretavoir: Top Gun: Maverick sunglasses", url: "https://www.pretavoir.co.uk/blogs/news/top-gun-maverick-sunglasses" },
      { title: "CamelCamelCamel: Ray-Ban RB3025 price history", url: "https://camelcamelcamel.com/product/B0FFDR1C1L" },
      { title: "Atom Retro: Ray-Ban icons, the Caravan", url: "https://atomretro.com/blog/ray-ban-icons-the-caravan" },
      { title: "AO Eyewear: Our favorite Robert De Niro sunglasses", url: "https://aoeyewear.com/blog/our-favorite-robert-de-niro-sunglasses" },
      { title: "EyeOns: Brad Pitt, Randolph aviator in Thelma & Louise", url: "https://www.eyeons.com/blogs/celebrities/brad-pitt-style-icon-randolph-aviator-sunglasses-in-thelma-louise" },
      { title: "SunglassesID: S.T. Dupont D002 6051, Brad Pitt, F1", url: "https://sunglassesid.com/node/2810" },
    ],
  },
  {
    ...base, id: "vintage-movie-sunglasses-you-can-still-buy", slug: "vintage-movie-sunglasses-you-can-still-buy",
    title: "Vintage Movie Sunglasses You Can Still Buy",
    metaTitle: "Vintage Movie Sunglasses You Can Still Buy",
    metaDescription: "Vintage movie sunglasses you can still buy: where period Ray-Ban and Persol pairs are sold, how to check a Bausch & Lomb etch and what to avoid.",
    excerpt: "Period pairs do turn up for sale. Here is where we saw them and how to check before you pay.",
    answer: "Vintage movie sunglasses such as Bausch & Lomb era Ray-Ban Wayfarers and Persol 714 folding frames are sold by vintage specialists and marketplaces. Check the lens etch and temple markings against trusted photos, remember that a missing etch alone does not prove a fake, and prefer sellers who accept returns.",
    targetKeyword: "vintage movie sunglasses", searchIntent: "Commercial investigation: find and check vintage pairs",
    modelIds: ["ray-ban-wayfarer-bl-vintage", "ray-ban-aviator-bl-vintage", "persol-714-steve-mcqueen", "oliver-goldsmith-manhattan"],
    movieIds: ["the-blues-brothers", "risky-business", "top-gun", "the-thomas-crown-affair-1968", "breakfast-at-tiffanys"],
    body: `## Where we saw vintage pairs

During our research on ${D} we found period or vintage sunglasses on a vintage-eyewear specialist (Vintage Sunglasses Shop lists a Bausch & Lomb Wayfarer and vintage Persol 714s), on Atom Retro, on 1stDibs (a 1980s Persol) and on eBay. These are examples from our search, not endorsements, and we cannot vouch for any individual seller. As one data point, Vintage Sunglasses Shop listed a vintage black Persol 714 at $485.

## Reissues are not vintage

Some famous pairs have an official reissue. The [Oliver Goldsmith Manhattan](/sunglasses/oliver-goldsmith-manhattan) is the brand's replica of the Breakfast at Tiffany's pair, and Persol sells a [Steve McQueen edition](/sunglasses/persol-714-steve-mcqueen) of the folding 714. One retailer listed a 714SM in Light Havana as out of production, so editions change.

## How to check a Bausch & Lomb Ray-Ban

- **The lens etch.** The Sunglass Fix says older Ray-Bans carry a "BL" etch, usually on the left lens near the outer edge, where newer ones carry "RB". It also notes that a missing etch on a vintage frame does not prove a fake, because lenses get replaced.
- **Temple markings.** A reseller guide suggests looking for a "Bausch & Lomb Ray-Ban USA" mark inside the temple. This guide is less authoritative, so compare against photos from a specialist.
- **Hinges and lenses.** The same guide says period lenses are mineral glass and hinges feel solid. Use these as hints, not proof.

For a valuable pair, compare against verified photos from a vintage specialist before buying.

## eBay's authentication program

We could not confirm that eBay's Authenticity Guarantee covers sunglasses. Look for the badge on the listing or read eBay's help page.

## Period models in our catalog

The [Bausch & Lomb era Wayfarer](/sunglasses/ray-ban-wayfarer-bl-vintage) and [Aviator](/sunglasses/ray-ban-aviator-bl-vintage) are recorded as vintage. See all [vintage eyewear](/vintage).`,
    faq: [
      { q: "Where can I buy vintage movie sunglasses?", a: "Vintage specialists, Atom Retro, 1stDibs and eBay all showed period pairs in our research. We cannot vouch for individual sellers." },
      { q: "How do I check a vintage Ray-Ban?", a: "Look for a BL etch on the left lens and period temple markings, and compare against specialist photos. A missing etch alone does not prove a fake." },
      { q: "Is an official reissue the same as vintage?", a: "No. A reissue is a new product by the same maker, such as the Oliver Goldsmith Manhattan." },
    ],
    sources: [
      { title: "The Sunglass Fix: How to spot fake Ray-Bans", url: "https://www.thesunglassfix.com/fake-ray-bans" },
      { title: "Underpriced: Is Ray-Ban worth reselling", url: "https://www.underpriced.app/blog/is-ray-ban-worth-reselling" },
      { title: "Vintage Sunglasses Shop: Persol 714 95 S3", url: "https://www.vintagesunglassesshop.com/item_vs3183.html" },
      { title: "Atom Retro: Persol Steve McQueen 714 folding", url: "https://www.atomretro.com/persol-steve-mcqueen-714-folding-sunglasses-black" },
      { title: "OPSM: Persol PO0714SM Steve McQueen", url: "https://www.opsm.co.nz/persol-99/po0714sm-714sm-steve-mcqueen/713132341919" },
      { title: "Oliver Goldsmith: Manhattan", url: "https://us.olivergoldsmith.com/products/manhattan" },
    ],
  },
  {
    ...base, id: "famous-sunglasses-worn-by-hollywood-actors", slug: "famous-sunglasses-worn-by-hollywood-actors",
    title: "Famous Sunglasses Worn by Hollywood Actors",
    metaTitle: "Famous Sunglasses Worn by Hollywood Actors, by Evidence",
    metaDescription: "Sunglasses worn by Hollywood actors on screen: Tom Cruise, Steve McQueen, Audrey Hepburn, Will Smith and more, each pair graded by evidence.",
    excerpt: "Which actor wore which pair on screen, and how sure we are.",
    answer: "Famous sunglasses worn by Hollywood actors include Tom Cruise's Ray-Ban Aviators and Wayfarers, Steve McQueen's Persol 714, Audrey Hepburn's Oliver Goldsmith, Will Smith's Ray-Ban Predator 2 and Tim Roth's Ray-Ban Clubmaster. Others, such as Daniel Craig's Tom Fords and Brad Pitt's F1 pair, are not yet confirmed.",
    targetKeyword: "sunglasses worn by hollywood actors", searchIntent: "Informational: actor-first directory",
    modelIds: ["ray-ban-aviator-classic-rb3025", "ray-ban-original-wayfarer-rb2140", "persol-714-steve-mcqueen", "oliver-goldsmith-manhattan", "ray-ban-predator-2-rb2027", "ray-ban-clubmaster-rb3016", "gargoyles-classics"],
    movieIds: ["top-gun", "risky-business", "the-thomas-crown-affair-1968", "breakfast-at-tiffanys", "men-in-black", "reservoir-dogs", "the-terminator"],
    body: `## Well supported

- **Tom Cruise.** Ray-Ban Aviators as Maverick in [Top Gun](/movies/top-gun) and its sequel, and Ray-Ban Wayfarers in [Risky Business](/movies/risky-business). See [Tom Cruise](/actors/tom-cruise).
- **Steve McQueen.** The folding Persol 714 in [The Thomas Crown Affair](/movies/the-thomas-crown-affair-1968).
- **Audrey Hepburn.** Oliver Goldsmith, reissued as the Manhattan, in [Breakfast at Tiffany's](/movies/breakfast-at-tiffanys).
- **Will Smith and Tommy Lee Jones.** The Ray-Ban Predator 2 in [Men in Black](/movies/men-in-black).
- **John Belushi and Dan Aykroyd.** Ray-Ban Wayfarers in [The Blues Brothers](/movies/the-blues-brothers).
- **Tim Roth.** The Ray-Ban Clubmaster RB3016 in [Reservoir Dogs](/movies/reservoir-dogs).
- **Arnold Schwarzenegger.** The Gargoyles ANSI Classics in [The Terminator](/movies/the-terminator).
- **Don Johnson.** The Wayfarer as Sonny Crockett in [Miami Vice](/movies/miami-vice), among other brands.

## Reported, not confirmed

- **Daniel Craig.** A single fan database names Tom Ford models in Quantum of Solace, Skyfall and Spectre.
- **Brad Pitt.** F1 (a vintage S.T. Dupont D002, disputed) and Thelma & Louise (a Randolph Aviator, one retailer).
- **Robert De Niro** in Taxi Driver and **Johnny Depp** in Fear and Loathing in Las Vegas: sources conflict.
- **Keanu Reeves, Carrie-Anne Moss and Laurence Fishburne.** Custom frames in The Matrix; no model names documented.

## How to read this

An actor-first list can make a pair look more certain than it is. Each name above links to a page that shows the sources and the grade. Browse everyone on the [actors](/actors) page.`,
    faq: [
      { q: "Which actor's sunglasses are best documented?", a: "Tom Cruise, Steve McQueen, Audrey Hepburn, Will Smith and Tim Roth, each with a strong or multi-source identification." },
      { q: "What did Daniel Craig wear as James Bond?", a: "A single fan database names Tom Ford models, so we grade them Unconfirmed." },
      { q: "Where do I see the sources?", a: "On each model page, under Seen in, with dates and any disputing source marked." },
    ],
    sources: [
      { title: "Wikipedia: Ray-Ban Wayfarer", url: "https://en.wikipedia.org/wiki/Ray-Ban_Wayfarer" },
      { title: "Fortune/Bloomberg: Top Gun: Maverick and the sunglass industry (2022)", url: "https://fortune.com/europe/2022/07/19/top-gun-maverick-y2k-nostalgia-sunglass-industry" },
      { title: "MiVision: Persol tribute to screen legend", url: "https://mivision.com.au/2010/10/persol-tribute-to-screen-legend/" },
      { title: "SunglassesID: Oliver Goldsmith, Audrey Hepburn, Breakfast at Tiffany's", url: "https://www.sunglassesid.com/node/1969" },
      { title: "SunglassesID: Ray-Ban 3016 Clubmaster, Tim Roth, Reservoir Dogs", url: "https://www.sunglassesid.com/node/1743" },
      { title: "James Bond Lifestyle: Tom Ford sunglasses", url: "https://jamesbondlifestyle.com/tags/tom-ford-sunglasses" },
    ],
  },
  {
    ...base, id: "best-sunglasses-inspired-by-action-movies", slug: "best-sunglasses-inspired-by-action-movies",
    title: "Best Sunglasses Inspired by Action Movies",
    metaTitle: "Best Sunglasses Inspired by Action Movies",
    metaDescription: "Best sunglasses inspired by action movies: Top Gun aviators, the Terminator's Gargoyles, Men in Black wraps and Bond's Tom Fords, graded by evidence.",
    excerpt: "Four action looks, from cockpit aviators to dark wraps, and what is known about each.",
    answer: "The best sunglasses inspired by action movies are the Ray-Ban Aviator from Top Gun, the Gargoyles ANSI Classics from The Terminator, the wraparound Ray-Ban Predator 2 from Men in Black and the Tom Ford frames reported for Daniel Craig's Bond. The Bond identifications rest on one fan database and stay Unconfirmed.",
    targetKeyword: "action movie sunglasses", searchIntent: "Commercial roundup by genre",
    modelIds: ["ray-ban-aviator-classic-rb3025", "gargoyles-classics", "ray-ban-predator-2-rb2027", "tom-ford-snowdon-ft0237", "knockaround-fast-lanes", "goodr-og", "knockaround-fort-knocks"],
    movieIds: ["top-gun", "the-terminator", "men-in-black", "spectre", "skyfall", "quantum-of-solace"],
    body: `## Top Gun: the aviator

Maverick's Ray-Ban Aviators are the best-known action-film pair. The current [Aviator Classic RB3025](/sunglasses/ray-ban-aviator-classic-rb3025) is named for the 2022 sequel by three retail guides. See the [Top Gun guide](/blog/top-gun-sunglasses-tom-cruise-aviators).

## The Terminator: the Gargoyles

Two sources name the [Gargoyles ANSI Classics](/sunglasses/gargoyles-classics): black plastic frame, tinted lenses and thin arms. Sources disagree on whether the brand is still active and whether the model is still sold. We found no source for Terminator 2.

## Men in Black: the wrap

The [Predator 2](/sunglasses/ray-ban-predator-2-rb2027) is a wraparound Ray-Ban cited as reference 2027, sometimes 2030. Both leads wear the same style.

## Bond: Tom Ford, reported

A single fan database names Tom Ford FT108 for [Quantum of Solace](/movies/quantum-of-solace), Marko FT0144 for [Skyfall](/movies/skyfall), and Snowdon FT0237 and Henry FT0248 for [Spectre](/movies/spectre). It also says one pair of Snowdons was auctioned by Christie's in February 2016. We could not corroborate any of this, so each is Unconfirmed. See the [Tom Ford Snowdon](/sunglasses/tom-ford-snowdon-ft0237).

## Look-alikes for the action look

- Dark wrap: [Knockaround Fast Lanes](/sunglasses/knockaround-fast-lanes).
- Dark rectangular: [Goodr OG](/sunglasses/goodr-og).
- Aviator: [Knockaround Fort Knocks](/sunglasses/knockaround-fort-knocks).

These are look-alikes in lower editorial price bands. See [futuristic styles](/styles/futuristic) and the [affordable alternatives](/affordable-alternatives).

${BUY}`,
    faq: [
      { q: "What sunglasses are in Men in Black?", a: "The wraparound Ray-Ban Predator 2, cited as reference 2027 or 2030." },
      { q: "What sunglasses does the Terminator wear?", a: "Two sources name the Gargoyles ANSI Classics for The Terminator (1984)." },
      { q: "Are the James Bond Tom Ford pairs confirmed?", a: "No. They come from a single fan database, so we grade them Unconfirmed." },
    ],
    sources: [
      { title: "SportRx: all the Ray-Ban sunglasses in Top Gun: Maverick", url: "https://www.sportrx.com/blog/these-are-all-the-ray-ban-sunglasses-in-top-gun-maverick/" },
      { title: "BAMF Style: The Terminator, Gargoyle sunglasses", url: "https://bamfstyle.com/2023/02/09/terminator-leather/" },
      { title: "SunglassesID: Gargoyles, Terminator", url: "https://sunglassesid.com/node/1938" },
      { title: "SunglassesID: Ray-Ban 2027 and 2030 Predator, Men in Black", url: "https://sunglassesid.com/node/1737" },
      { title: "James Bond Lifestyle: Tom Ford Snowdon FT0237", url: "https://www.jamesbondlifestyle.com/node/1604" },
    ],
  },
  {
    ...base, id: "movie-sunglasses-for-men", slug: "movie-sunglasses-for-men",
    title: "Movie Sunglasses for Men",
    metaTitle: "Movie Sunglasses for Men: By Look, Not by Hype",
    metaDescription: "Movie sunglasses for men, grouped by look: aviator, wayfarer, browline, folding and wrap, each tied to a documented film pair and its evidence grade.",
    excerpt: "A guide organised by the look you want, with the film that made it and how sure we are.",
    answer: "Movie sunglasses for men fall into five looks: the aviator (Top Gun), the wayfarer (Risky Business, The Blues Brothers), the browline Clubmaster (Reservoir Dogs), the folding Persol 714 (The Thomas Crown Affair) and the wrap (Men in Black). Each is tied to a documented pair and graded by evidence.",
    targetKeyword: "movie sunglasses for men", searchIntent: "Commercial: choose a look by silhouette",
    modelIds: ["ray-ban-aviator-classic-rb3025", "ray-ban-original-wayfarer-rb2140", "ray-ban-clubmaster-rb3016", "persol-714-steve-mcqueen", "ray-ban-predator-2-rb2027", "oakley-frogskins", "knockaround-premiums"],
    movieIds: ["top-gun", "risky-business", "the-blues-brothers", "reservoir-dogs", "the-thomas-crown-affair-1968", "men-in-black"],
    body: `## Choose the look first

This page overlaps with our lists by film and by actor, so it is organised by silhouette instead. Each entry names the documented film pair and what to buy.

## Aviator: Top Gun

Maverick's [Aviator](/sunglasses/ray-ban-aviator-bl-vintage); today's version is the [Aviator Classic RB3025](/sunglasses/ray-ban-aviator-classic-rb3025). See [aviator styles](/styles/aviator).

## Wayfarer: Risky Business and The Blues Brothers

The [Original Wayfarer RB2140](/sunglasses/ray-ban-original-wayfarer-rb2140) continues the design. Lower-priced wayfarer shapes include the [Oakley Frogskins](/sunglasses/oakley-frogskins) and the [Knockaround Premiums](/sunglasses/knockaround-premiums). See [wayfarer styles](/styles/wayfarer).

## Browline: Reservoir Dogs

Three sources name the [Clubmaster RB3016](/sunglasses/ray-ban-clubmaster-rb3016) for Tim Roth's Mr. Orange. We have not verified current availability.

## Folding: The Thomas Crown Affair

Steve McQueen's folding Persol 714 is available as a tribute edition, the [Persol 714 Steve McQueen](/sunglasses/persol-714-steve-mcqueen). It sits in a premium editorial price band; Atom Retro listed the black 714 series at £233.99 in the UK on ${D}.

## Wrap: Men in Black

The [Predator 2](/sunglasses/ray-ban-predator-2-rb2027). We have not verified that it is in current production.

## A note on certainty

Not every famous men's pair is settled. Taxi Driver, Fear and Loathing and James Bond's Tom Fords are Unconfirmed on this site, and each page says why. Read about our [grades](/about).

${BUY}`,
    faq: [
      { q: "What are the best movie sunglasses for men?", a: "It depends on the look: aviator, wayfarer, browline, folding or wrap. Each has a documented film pair." },
      { q: "Which men's pair has the strongest evidence?", a: "The Wayfarer, the Aviator and the Persol 714 each have strong, multi-source support." },
      { q: "Are budget versions the same as the film pairs?", a: "No. They are look-alikes matched by shape." },
    ],
    sources: [
      { title: "Wikipedia: Ray-Ban Wayfarer", url: "https://en.wikipedia.org/wiki/Ray-Ban_Wayfarer" },
      { title: "SunglassesID: Ray-Ban 3016 Clubmaster, Tim Roth, Reservoir Dogs", url: "https://www.sunglassesid.com/node/1743" },
      { title: "MiVision: Persol tribute to screen legend", url: "https://mivision.com.au/2010/10/persol-tribute-to-screen-legend/" },
      { title: "Atom Retro: Persol Steve McQueen 714 folding", url: "https://www.atomretro.com/persol-steve-mcqueen-714-folding-sunglasses-black" },
      { title: "SunglassesID: Ray-Ban 2027 and 2030 Predator, Men in Black", url: "https://sunglassesid.com/node/1737" },
    ],
  },
  {
    ...base, id: "movie-sunglasses-for-women", slug: "movie-sunglasses-for-women",
    title: "Movie Sunglasses for Women",
    metaTitle: "Movie Sunglasses for Women: What Is Documented",
    metaDescription: "Movie sunglasses for women: Audrey Hepburn's Oliver Goldsmith Manhattan, Devil Wears Prada 2 pairs and cat-eye looks, with honest evidence grades.",
    excerpt: "One strongly documented pair, several disputed ones and a set of famous looks no source ties to a maker.",
    answer: "The best-documented movie sunglasses for women are Audrey Hepburn's Oliver Goldsmith in Breakfast at Tiffany's, reissued as the Manhattan. Pairs from The Devil Wears Prada 2 and Thelma & Louise are disputed, and several famous cat-eye looks have no maker recorded in the sources we reviewed.",
    targetKeyword: "movie sunglasses for women", searchIntent: "Commercial: find documented pairs and look-alikes",
    modelIds: ["oliver-goldsmith-manhattan", "barton-perreira-samo", "lgr-karthoum", "jimmy-choo-jc5030u", "ray-ban-original-wayfarer-rb2140"],
    movieIds: ["breakfast-at-tiffanys", "the-devil-wears-prada-2", "thelma-and-louise"],
    body: `## Strongest: Breakfast at Tiffany's

Holly Golightly's black wayfarer-style pair is Oliver Goldsmith, reissued by the brand as the [Manhattan](/sunglasses/oliver-goldsmith-manhattan). On brand sites we saw it listed at CA$595 on the Canadian site and €395 on the Dutch site on ${D}. Those are regional prices in local currency. Read the [full guide](/blog/audrey-hepburn-breakfast-at-tiffanys-sunglasses).

## Disputed: The Devil Wears Prada 2

Retail guides name the [Barton Perreira Samo](/sunglasses/barton-perreira-samo) and [L.G.R Karthoum](/sunglasses/lgr-karthoum) for Anne Hathaway's Andy, and a [Jimmy Choo JC5030U](/sunglasses/jimmy-choo-jc5030u) cat-eye for Miranda Priestly from earlier filming. The guides mix scenes with press events, so all are Unconfirmed. See the [Prada 2 guide](/blog/the-devil-wears-prada-2-sunglasses-guide).

## Thelma & Louise: sources disagree

For Susan Sarandon's pair, sources differ: one says transparent cat-eye shades, another names a Tom Ford model. We record no model for her.

## Famous looks with no maker on record

Guides single out Madonna's black D-frame shades in Desperately Seeking Susan (1985), Michelle Pfeiffer's oversized pink cat-eyes in Scarface (1983), Jane Birkin's tortoiseshell sunglasses with blue lenses in La Piscine (1969) and Anouk Aimée's black cat-eyes in La Dolce Vita (1960). The sources we reviewed do not tie any of them to a verified maker, so we do not list products for them. Browse [cat-eye styles](/styles/cat-eye) for the shape.

## A fair warning

Our catalog skews toward men's films because that is where the documentation is. We would rather say so than invent matches.

${BUY}`,
    faq: [
      { q: "What sunglasses did Audrey Hepburn wear in Breakfast at Tiffany's?", a: "Oliver Goldsmith sunglasses, reissued as the Manhattan." },
      { q: "Are the Devil Wears Prada 2 pairs confirmed?", a: "No. Retail guides disagree, so all are Unconfirmed." },
      { q: "Why so few women's pairs?", a: "Documentation is thinner. We list only pairs tied to a source." },
    ],
    sources: [
      { title: "SunglassesID: Oliver Goldsmith, Audrey Hepburn, Breakfast at Tiffany's", url: "https://www.sunglassesid.com/node/1969" },
      { title: "Oliver Goldsmith: Manhattan (Canada)", url: "https://olivergoldsmith.com/en-ca/products/manhattan" },
      { title: "Oliver Goldsmith: Manhattan (Netherlands/EU)", url: "https://olivergoldsmith.com/nl-eu/products/manhattan" },
      { title: "Pretavoir: The Devil Wears Prada 2 glasses", url: "https://pretavoir.co.uk/blogs/news/the-devil-wears-prada-2-glasses-sunglasses" },
      { title: "Vogue Scandinavia: The 10 most iconic eyewear moments in movie history", url: "https://www.voguescandinavia.com/articles/the-10-most-iconic-eyewear-moments-in-movie-history" },
    ],
  },
  {
    ...base, id: "where-to-buy-famous-movie-sunglasses", slug: "where-to-buy-famous-movie-sunglasses",
    title: "Where to Buy Famous Movie Sunglasses",
    metaTitle: "Where to Buy Famous Movie Sunglasses: Stores and Vintage",
    metaDescription: "Where to buy famous movie sunglasses: brand sites, retailers, marketplaces and vintage specialists, and how to avoid a look-alike sold as the original.",
    excerpt: "Four kinds of place to buy, with real examples we found and the checks to make first.",
    answer: "Buy famous movie sunglasses from the maker for current models, from retailers for budget look-alikes, from vintage specialists or marketplaces for period pairs, and compare listings before you pay. We have no live prices yet, so each model page offers search links without prices.",
    targetKeyword: "where to buy movie sunglasses", searchIntent: "Transactional: choose where to buy and how to avoid mistakes",
    modelIds: ["persol-714-steve-mcqueen", "oliver-goldsmith-manhattan", "ray-ban-original-wayfarer-rb2140", "ray-ban-aviator-classic-rb3025", "knockaround-premiums", "goodr-og"],
    movieIds: ["the-thomas-crown-affair-1968", "breakfast-at-tiffanys", "top-gun", "risky-business"],
    body: `## 1. The maker (current models and reissues)

For models still in production, the brand's own site is the safest start. We saw the [Oliver Goldsmith Manhattan](/sunglasses/oliver-goldsmith-manhattan) on the brand's regional sites, and Persol sells a [Steve McQueen edition](/sunglasses/persol-714-steve-mcqueen). Availability and prices vary by region and edition; one authorised retailer listed a 714SM colour as out of production.

## 2. Retailers (budget look-alikes)

Look-alikes are widely stocked. On ${D}, Academy listed the [Knockaround Premiums](/sunglasses/knockaround-premiums) at $35 and REI listed the [goodr OG](/sunglasses/goodr-og) at $25. These are listings, not deals, and they change.

## 3. Vintage specialists and marketplaces (period pairs)

Vintage Sunglasses Shop, Atom Retro, 1stDibs and eBay all showed period or vintage frames in our research. We cannot vouch for individual sellers. We could not confirm that eBay's Authenticity Guarantee covers sunglasses; check the listing for a badge. Read our [vintage guide](/blog/vintage-movie-sunglasses-you-can-still-buy) for authentication checks.

## 4. Price comparison on this site

We do not show a price unless a merchant or affiliate feed gives us one. Until then, each model page shows plain search links to eBay and Google Shopping. If you buy through a link, we may earn a commission, which never changes a grade. See the [Affiliate Disclosure](/affiliate-disclosure).

## Avoid the common mistake

A listing that says "Top Gun sunglasses" may be any aviator. Match the reference, colours and size to the model page, and prefer sellers with returns. For the Aviator, see the [Aviator Classic](/sunglasses/ray-ban-aviator-classic-rb3025); for the Wayfarer, see the [Original Wayfarer](/sunglasses/ray-ban-original-wayfarer-rb2140).

${BUY}`,
    faq: [
      { q: "Where is the safest place to buy a current model?", a: "The maker's own site or an authorised retailer." },
      { q: "Does this site show prices?", a: "Only when a verified offer exists. Otherwise it shows search links with no price." },
      { q: "Is eBay's authenticity program available for sunglasses?", a: "We could not confirm it. Check the listing for a badge or read eBay's help page." },
    ],
    sources: [
      { title: "Oliver Goldsmith: Manhattan", url: "https://us.olivergoldsmith.com/products/manhattan" },
      { title: "OPSM: Persol PO0714SM Steve McQueen", url: "https://www.opsm.co.nz/persol-99/po0714sm-714sm-steve-mcqueen/713132341919" },
      { title: "Academy: Knockaround sunglasses", url: "https://www.academy.com/c/shops/all-accessories/sunglasses-and-accessories/knockaround-sunglasses" },
      { title: "REI: sunglasses", url: "https://www.rei.com/c/sunglasses" },
      { title: "Vintage Sunglasses Shop: Persol 714 95 S3", url: "https://www.vintagesunglassesshop.com/item_vs3183.html" },
    ],
  },
];

/** Short, data-derived summaries (grades as computed on this site). */
const GLANCE: Record<string, string> = {
  "most-iconic-sunglasses-in-movie-history": `## What the grades mean

- **Exact Match:** the original model is identified, no source disputes it, and it rests on a strong source or two independent ones.
- **Official Reissue:** the maker's own reissue, tribute edition or current production of the same design, under the same rules.
- **Unconfirmed:** thin, single-source or conflicting evidence. The reason is shown on each model page.`,
  "best-1980s-movie-sunglasses": `## At a glance

- 1980, The Blues Brothers: Ray-Ban Wayfarer. Exact Match, three retail sources.
- 1983, Risky Business: Ray-Ban Wayfarer. Exact Match, Wikipedia and Mental Floss.
- 1984, The Terminator: Gargoyles ANSI Classics. Exact Match, two sources.
- 1984, Miami Vice: Ray-Ban Wayfarer. Exact Match, a fan wiki and a retailer.
- 1986, Top Gun: Ray-Ban Aviator. Exact Match, Fortune and Bloomberg coverage.`,
  "best-1990s-movie-sunglasses": `## At a glance

- 1991, Thelma & Louise: Randolph Engineering Aviator. Unconfirmed, one retailer.
- 1992, Reservoir Dogs: Ray-Ban Clubmaster RB3016. Exact Match, three sources.
- 1994, Léon: replica only. Similar Style, original maker not identified.
- 1997, Men in Black: Ray-Ban Predator 2. Exact Match, a fan database and period press.
- 1998, Fear and Loathing in Las Vegas: aviator-style, model disputed. Unconfirmed.
- 1999, The Matrix: custom frames. Unconfirmed, no model names documented.`,
  "famous-sunglasses-worn-by-hollywood-actors": `## At a glance

- Exact Match: Tom Cruise (Aviator, Wayfarer), Will Smith and Tommy Lee Jones (Predator 2), Tim Roth (Clubmaster), John Belushi and Dan Aykroyd (Wayfarer), Arnold Schwarzenegger (Gargoyles Classics).
- Official Reissue: Steve McQueen (Persol 714 edition) and Audrey Hepburn (Oliver Goldsmith Manhattan).
- Unconfirmed: Daniel Craig, Brad Pitt, Robert De Niro, Johnny Depp, Keanu Reeves, Carrie-Anne Moss and Laurence Fishburne.

Grades can change when a new source appears. Each model page shows the date we last checked.`,
  "best-sunglasses-inspired-by-action-movies": `## At a glance

- Top Gun: Ray-Ban Aviator. Exact Match.
- The Terminator: Gargoyles ANSI Classics. Exact Match, with availability unclear.
- Men in Black: Ray-Ban Predator 2. Exact Match.
- Bond (Quantum of Solace, Skyfall, Spectre): Tom Ford models. Unconfirmed, one fan database.`,
  "movie-sunglasses-for-men": `## At a glance

- Aviator, Top Gun: Exact Match.
- Wayfarer, Risky Business and The Blues Brothers: Exact Match.
- Browline, Reservoir Dogs: Exact Match, availability unverified.
- Folding, The Thomas Crown Affair: Official Reissue.
- Wrap, Men in Black: Exact Match, availability unverified.`,
};

export const roundupArticles: Article[] = raw.map((a) => (GLANCE[a.id] ? { ...a, body: a.body + "\n\n" + GLANCE[a.id] } : a));
