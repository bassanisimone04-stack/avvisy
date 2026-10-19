import type { Article, Keyword } from "@/lib/types";
import { roundupArticles } from "./seed-articles-2";

const D = "2026-10-15";
const base = { createdAt: D, updatedAt: D, publishAt: null, aiGenerated: false } as const;

const baseArticles: Article[] = [
  {
    ...base, id: "what-sunglasses-does-brad-pitt-wear-in-f1", slug: "what-sunglasses-does-brad-pitt-wear-in-f1",
    title: "What Sunglasses Does Brad Pitt Wear in F1?",
    metaTitle: "Brad Pitt's Sunglasses in F1 (2025): What We Know",
    metaDescription: "Two sources name a vintage gold S.T. Dupont D002, a third disputes it. Here is the evidence, what is still unconfirmed, and wearable alternatives.",
    excerpt: "A vintage gold aviator is the star accessory of Sonny Hayes. The brand attribution is not settled — here is exactly what the evidence says.",
    answer: "Two sources identify a vintage gold S.T. Dupont D002 (6051) with brown gradient lenses, but one retailer says the aviators are unbranded frames from the costume designer's family. We therefore label this identification Unconfirmed.",
    category: "Guides", targetKeyword: "brad pitt f1 sunglasses", searchIntent: "Informational with commercial follow-up (identify, then buy a lookalike)",
    status: "published", reviewed: false,
    modelIds: ["st-dupont-d002-6051", "dita-kudru", "randolph-engineering-aviator", "quay-all-in"], movieIds: ["f1-the-movie"],
    body: `## What we know

Brad Pitt plays veteran driver Sonny Hayes in [F1](/movies/f1-the-movie). His signature accessory is a pair of oversized gold aviators with brown gradient lenses.

## The case for the S.T. Dupont D002

SunglassesID identifies the pair as a vintage **S.T. Dupont D002 6051** with a gold frame and brown gradient lenses. Retrospectacle, a UK vintage-eyewear retailer, says on its own blog that it supplied the ST Dupont D002 for the film. Two independent sources naming the same model is a meaningful signal. See the full record on the [S.T. Dupont D002 page](/sunglasses/st-dupont-d002-6051).

## The conflicting account

Pretavoir describes Sonny's signature oversized aviators as a personal touch from costume designer Julian Day, saying the unbranded frames once belonged to Day's father, who sponsored F1 cars in the 1970s. That contradicts a branded attribution. Because a source disputes the identification, our system keeps the label at **Unconfirmed** until the conflict is resolved.

## Don't confuse it with the Silverstone pair

Pitt was also photographed at Silverstone in 2024 during filming wearing the Hoorsenbuhs Model V BK. That was off-screen and is not the pair Sonny wears in the film.

## What would settle it

- A statement from the costume department or the film's wardrobe credits.
- An auction or archive listing of the actual prop pair.
- A photograph of the inside temple markings.

## Wearable alternatives

The original is described as hard to find. SunglassesID suggests the [Dita Kudru](/sunglasses/dita-kudru) as an alternative. If you want the look at a lower price, a gold aviator such as the [Quay All In](/sunglasses/quay-all-in) or the [Randolph Engineering Aviator](/sunglasses/randolph-engineering-aviator) gets the silhouette, though not the oversized proportions. Browse more on our [affordable alternatives](/affordable-alternatives) page.`,
    faq: [
      { q: "Are Brad Pitt's F1 sunglasses vintage?", a: "SunglassesID calls the pair vintage S.T. Dupont D002 6051. Another retailer says the frames are unbranded and from the costume designer's family." },
      { q: "Can I buy the exact pair?", a: "Not reliably. The S.T. Dupont D002 is described as hard to find, and the identification itself is disputed." },
      { q: "Are the Hoorsenbuhs glasses from the movie?", a: "No. Pitt wore the Hoorsenbuhs Model V BK at Silverstone during filming in 2024, not as Sonny Hayes on screen." },
    ],
    sources: [
      { title: "SunglassesID — S.T. Dupont D002 6051, Brad Pitt, F1", url: "https://sunglassesid.com/node/2810" },
      { title: "Retrospectacle — F1 APXGP style sunglasses", url: "https://www.retrospectacle.co.uk/blogs/news/apxgp-apex-sunglasses" },
      { title: "Pretavoir — top eyewear moments from F1", url: "https://pretavoir.co.uk/blogs/news/top-eyewear-moments-from-the-of-f1-the-movie" },
      { title: "EyeOns — Brad Pitt at Silverstone in Hoorsenbuhs", url: "https://www.eyeons.com/blogs/celebrities/brad-pitt-fuels-racing-chic-in-silverstone-with-hoorsenbuhs-shades" },
    ],
  },
  {
    ...base, id: "top-gun-sunglasses-tom-cruise-aviators", slug: "top-gun-sunglasses-tom-cruise-aviators",
    title: "Top Gun Sunglasses: Tom Cruise's Iconic Aviators",
    metaTitle: "Top Gun Sunglasses: Tom Cruise's Ray-Ban Aviators",
    metaDescription: "Maverick's Ray-Ban Aviators in Top Gun (1986) and Top Gun: Maverick (2022): what is documented, what is disputed, and affordable alternatives.",
    excerpt: "Maverick wears Ray-Ban Aviators in both films. Here is what the sources actually support, model by model.",
    answer: "Maverick wears Ray-Ban Aviators. For Top Gun: Maverick (2022), three retail guides name the Aviator Classic RB3025 in gold with green lenses; one source describes a custom tint. The 1986 production reference is not documented in the sources we reviewed.",
    category: "Guides", targetKeyword: "top gun sunglasses", searchIntent: "Commercial investigation: identify the model and where to buy it",
    status: "published", reviewed: false,
    modelIds: ["ray-ban-aviator-bl-vintage", "ray-ban-aviator-classic-rb3025", "knockaround-fort-knocks", "quay-all-in", "american-optical-original-pilot"], movieIds: ["top-gun", "top-gun-maverick"],
    body: `## The short version

Tom Cruise's Maverick wears **Ray-Ban Aviators** in [Top Gun](/movies/top-gun) and again in [Top Gun: Maverick](/movies/top-gun-maverick). The current-production equivalent is the [Ray-Ban Aviator Classic RB3025](/sunglasses/ray-ban-aviator-classic-rb3025).

## 1986: the Bausch & Lomb era

Coverage of the sequel, including Bloomberg reporting republished by Fortune, describes the 2022 demand as a repeat of what followed the 1986 film. We list the period pair as the [Ray-Ban Aviator (Bausch & Lomb era)](/sunglasses/ray-ban-aviator-bl-vintage). We have not found a source documenting the exact reference number or lens size used on set, so we do not claim one.

## 2022: Aviator Classic RB3025

Three retail guides (Pretavoir, SportRx and EyeOns) name the Aviator Classic **RB3025** with a gold frame and green lenses. One source describes a custom blue tint, so lens colour is genuinely disputed.

## The supporting cast

SportRx also lists the Ray-Ban Caravan RB3136 for Rooster and the Shooter RB3138 for Iceman. That is a single retail source, so those two identifications stay **Unconfirmed** on this site until corroborated.

## About the sales claims

UK comparison site PriceSpy reported searches for the Aviator rising by as much as 158% in the week after the sequel opened. A "40%" sales increase is also widely repeated, but sources disagree on whether it refers to 1986 or 2022, so we do not rely on it.

## Alternatives

If you want the shape without the price tag, look at the [Knockaround Fort Knocks](/sunglasses/knockaround-fort-knocks) or the [Quay All In](/sunglasses/quay-all-in). For a military-heritage alternative, see the [American Optical Original Pilot](/sunglasses/american-optical-original-pilot). More options are on the [affordable alternatives](/affordable-alternatives) page.`,
    faq: [
      { q: "What sunglasses does Tom Cruise wear in Top Gun?", a: "Ray-Ban Aviators. For the 2022 sequel, retail guides name the Aviator Classic RB3025." },
      { q: "Are Maverick's lenses green?", a: "Most guides say green G-15 style lenses with a gold frame, but one source describes a custom blue tint." },
      { q: "Are there cheaper alternatives?", a: "Yes. Aviator-style options from Knockaround and Quay sit in the lower price bands; check the merchant for the current price." },
    ],
    sources: [
      { title: "Fortune/Bloomberg — Top Gun: Maverick and the sunglass industry (2022)", url: "https://fortune.com/europe/2022/07/19/top-gun-maverick-y2k-nostalgia-sunglass-industry" },
      { title: "PriceSpy UK — The Top Gun effect", url: "https://pricespy.co.uk/articles/the-top-gun-effect-popularity-for-aviator-style-sunnies-soar" },
      { title: "Pretavoir — Top Gun: Maverick sunglasses", url: "https://www.pretavoir.co.uk/blogs/news/top-gun-maverick-sunglasses" },
      { title: "SportRx — all the Ray-Ban sunglasses in Top Gun: Maverick", url: "https://www.sportrx.com/blog/these-are-all-the-ray-ban-sunglasses-in-top-gun-maverick/" },
      { title: "EyeOns — Tom Cruise wears Ray-Ban Aviators in Top Gun: Maverick", url: "https://www.eyeons.com/blogs/releases/return-of-the-legend-tom-cruise-wears-the-iconic-ray-ban-aviators-in-the-top-gun-maverick-movie" },
    ],
  },
  {
    ...base, id: "men-in-black-sunglasses-original-models", slug: "men-in-black-sunglasses-original-models",
    title: "Men in Black Sunglasses: Original Models",
    metaTitle: "Men in Black Sunglasses: The Ray-Ban Predator 2",
    metaDescription: "The wraparound Ray-Ban Predator 2 worn by Agents J and K: reference numbers, what sources agree on, and budget wrap alternatives.",
    excerpt: "Agents J and K wear a wraparound Ray-Ban. Sources cite two reference numbers — here is how they line up.",
    answer: "Sources identify the Ray-Ban Predator 2, cited as reference 2027 (some pages say 2030). Both leads are reported to wear the same style.",
    category: "Guides", targetKeyword: "men in black sunglasses", searchIntent: "Commercial investigation: identify the model and find a current equivalent",
    status: "published", reviewed: false,
    modelIds: ["ray-ban-predator-2-rb2027", "knockaround-fast-lanes", "goodr-og"], movieIds: ["men-in-black"],
    body: `## The model

SunglassesID lists the pair worn by Will Smith's Agent J in [Men in Black](/movies/men-in-black) as the **Ray-Ban Predator**, titled "2027 and 2030". Retail pages today sell the model as the Predator 2 RB2027. See our record: [Ray-Ban Predator 2](/sunglasses/ray-ban-predator-2-rb2027).

## What the sources agree on

- The glasses are a wraparound Ray-Ban Predator.
- Both Agent J and Agent K wear the same style.
- Period press, such as a 1997 Deseret News piece, covered the film's sunglasses.

## What is not settled

- **Reference number.** 2027 versus 2030 appears in different pages. We show both and do not pick one.
- **Sales claims.** A film-listing site says sales of the Predator 2 tripled to about $5 million after release. We have not verified that figure with Ray-Ban and do not rely on it.
- **Availability.** We have not confirmed that the model is in current production; check with a merchant.

## Alternatives

For a similar dark, wraparound look at a budget price, see the [Knockaround Fast Lanes](/sunglasses/knockaround-fast-lanes) or the lightweight [Goodr OG](/sunglasses/goodr-og). Neither is an exact match. Browse [futuristic styles](/styles/futuristic) for more.`,
    faq: [
      { q: "What sunglasses do the Men in Black wear?", a: "A wraparound Ray-Ban Predator, cited as reference 2027 (some pages say 2030)." },
      { q: "Is the Ray-Ban Predator 2 still sold?", a: "Some retailers list it as the RB2027, but we have not verified current availability. Check a merchant." },
      { q: "Did Tommy Lee Jones wear the same pair as Will Smith?", a: "Sources agree the two leads wore the same style." },
    ],
    sources: [
      { title: "SunglassesID — Ray-Ban 2027 and 2030 Predator, Will Smith, Men in Black", url: "https://sunglassesid.com/node/1737" },
      { title: "Deseret News (1997) — Be way cool with hot shades", url: "https://www.deseret.com/1997/6/22/19319570/be-way-cool-with-hot-shades/" },
    ],
  },
  {
    ...base, id: "audrey-hepburn-breakfast-at-tiffanys-sunglasses", slug: "audrey-hepburn-breakfast-at-tiffanys-sunglasses",
    title: "Audrey Hepburn's Breakfast at Tiffany's Sunglasses",
    metaTitle: "Audrey Hepburn's Breakfast at Tiffany's Sunglasses",
    metaDescription: "Holly Golightly's black wayfarer-style sunglasses were Oliver Goldsmith. The Manhattan reissue, its specs, and cheaper wayfarer alternatives.",
    excerpt: "Holly Golightly's sunglasses are one of cinema's most copied accessories. The reissue exists — here is what the brand and the sources say.",
    answer: "Holly wears black wayfarer-style Oliver Goldsmith sunglasses. The brand reissued them as the Manhattan; the Dark Tortoise version with green lenses matches the on-screen pair, according to SunglassesID.",
    category: "Guides", targetKeyword: "breakfast at tiffany's sunglasses", searchIntent: "Commercial: find the exact reissue and cheaper lookalikes",
    status: "published", reviewed: false,
    modelIds: ["oliver-goldsmith-manhattan", "ray-ban-original-wayfarer-rb2140", "oakley-frogskins", "knockaround-premiums"], movieIds: ["breakfast-at-tiffanys"],
    body: `## The pair

In [Breakfast at Tiffany's](/movies/breakfast-at-tiffanys), Audrey Hepburn's Holly Golightly wears black wayfarer-style sunglasses by **Oliver Goldsmith**, per SunglassesID.

## The reissue: Manhattan

Oliver Goldsmith released the **Manhattan** for the film's 50th anniversary in 2011, according to SunglassesID. The brand itself describes it as a replica of the film pair. Per the brand's product page:

- Frames embossed with 1960, the year of original production.
- Made in Italy from cotton acetate.
- Standard 55 mm lens width with a 52 mm option.

SunglassesID adds that the Dark Tortoise version with green lenses matches the pair seen on screen. See the full record: [Oliver Goldsmith Manhattan](/sunglasses/oliver-goldsmith-manhattan). Because the brand's claim comes from the manufacturer, we label it **Official Reissue** rather than claiming it is the original prop.

## Lower-priced wayfarer shapes

The Manhattan sits in the premium band. For the silhouette at a lower price, consider the [Ray-Ban Original Wayfarer](/sunglasses/ray-ban-original-wayfarer-rb2140), the [Oakley Frogskins](/sunglasses/oakley-frogskins) or the budget [Knockaround Premiums](/sunglasses/knockaround-premiums). None is the film pair. See [wayfarer styles](/styles/wayfarer).`,
    faq: [
      { q: "What sunglasses does Audrey Hepburn wear in Breakfast at Tiffany's?", a: "Black wayfarer-style Oliver Goldsmith sunglasses, reissued as the Manhattan." },
      { q: "Is the Oliver Goldsmith Manhattan the original pair?", a: "It is the brand's reissue and replica of the film pair, released for the 50th anniversary in 2011." },
      { q: "Where are the Manhattan frames made?", a: "Italy, from cotton acetate, according to the brand's product page." },
    ],
    sources: [
      { title: "SunglassesID — Oliver Goldsmith, Audrey Hepburn, Breakfast at Tiffany's", url: "https://www.sunglassesid.com/node/1969" },
      { title: "Oliver Goldsmith — Manhattan", url: "https://us.olivergoldsmith.com/products/manhattan" },
    ],
  },
  {
    ...base, id: "the-blues-brothers-sunglasses", slug: "the-blues-brothers-sunglasses",
    title: "The Blues Brothers Sunglasses",
    metaTitle: "The Blues Brothers Sunglasses: Ray-Ban Wayfarers",
    metaDescription: "Jake and Elwood's Ray-Ban Wayfarers: what multiple sources agree on, what one blog claims about the 5022, and wayfarer alternatives.",
    excerpt: "The Wayfarer is the best-documented movie sunglass on this site — with a few details still flagged.",
    answer: "Jake and Elwood wear Ray-Ban Wayfarers. Several sources agree on the model; one retailer blog cites the vintage 5022 reference, which we treat as unconfirmed.",
    category: "Guides", targetKeyword: "blues brothers sunglasses", searchIntent: "Commercial: identify the model and buy the current equivalent",
    status: "published", reviewed: false,
    modelIds: ["ray-ban-wayfarer-bl-vintage", "ray-ban-original-wayfarer-rb2140", "oakley-frogskins", "knockaround-premiums"], movieIds: ["the-blues-brothers"],
    body: `## The pair

[The Blues Brothers](/movies/the-blues-brothers) cemented the Ray-Ban Wayfarer in pop culture. Three retailer sources (Zenni Optical, Atom Retro and Isolani) identify the Wayfarer for Jake and Elwood.

## Origin of the look

According to Atom Retro, Dan Aykroyd said the Blues Brothers image was based on John Lee Hooker wearing black Wayfarers and a black pork pie hat. The same source credits Raymond Stegeman with designing the Wayfarer, patented in 1952.

## What is unconfirmed

- **The 5022 reference.** Zenni Optical cites Wayfarer 5022C15, but we found no second source for that reference.
- **Frame colours.** Zenni says Jake wore brown frames and Elwood black; no other source we reviewed states this.

## Buy the design today

The [Ray-Ban Original Wayfarer RB2140](/sunglasses/ray-ban-original-wayfarer-rb2140) continues the design. The vintage original is documented at [Ray-Ban Wayfarer (Bausch & Lomb era)](/sunglasses/ray-ban-wayfarer-bl-vintage). Alternatives include the [Oakley Frogskins](/sunglasses/oakley-frogskins) and [Knockaround Premiums](/sunglasses/knockaround-premiums). See [vintage eyewear](/vintage).`,
    faq: [
      { q: "What sunglasses do the Blues Brothers wear?", a: "Ray-Ban Wayfarers." },
      { q: "Is it the 5022 model?", a: "One retailer cites 5022C15; we could not corroborate that, so it is unconfirmed." },
      { q: "Can I buy them new?", a: "The Original Wayfarer RB2140 continues the design; vintage pairs are sold on secondary markets." },
    ],
    sources: [
      { title: "Zenni Optical — eyewear in the movies", url: "https://www.zennioptical.com/blog/eyewear-in-the-movies" },
      { title: "Atom Retro — Ray-Ban icons: Wayfarer", url: "https://www.atomretro.com/blog/rayban-icons-wayfarer-sunglasses/" },
      { title: "Isolani — Wayfarer: from the Blues Brothers to today", url: "https://isolani.com/gb/magazine/boutique/wayfarer-from-the-iconic-blues-brothers-to-the-stars-who-wear-them-today" },
    ],
  },
  {
    ...base, id: "tom-cruise-risky-business-sunglasses", slug: "tom-cruise-risky-business-sunglasses",
    title: "Tom Cruise Risky Business Sunglasses",
    metaTitle: "Risky Business Sunglasses: Tom Cruise's Wayfarers",
    metaDescription: "Risky Business sunglasses: Tom Cruise's Ray-Ban Wayfarers, the sales story and its caveats, the underwear-scene myth and alternatives.",
    excerpt: "The film that revived the Wayfarer. What the sources say, what traces back to a single figure, and what to buy today.",
    answer: "The Risky Business sunglasses are Ray-Ban Wayfarers worn by Tom Cruise as Joel Goodsen. The film is widely credited with reviving the model, but the best-known sales figure traces back to one source, so we treat it as reported, not verified.",
    category: "Guides", targetKeyword: "risky business sunglasses", searchIntent: "Commercial investigation: identify the model, then buy the current equivalent",
    status: "published", reviewed: false,
    modelIds: ["ray-ban-wayfarer-bl-vintage", "ray-ban-original-wayfarer-rb2140", "oakley-frogskins", "knockaround-premiums"], movieIds: ["risky-business", "miami-vice"],
    body: `## The short version

In [Risky Business](/movies/risky-business), Tom Cruise's Joel Goodsen wears **Ray-Ban Wayfarers**. Wikipedia's history of the model and a Mental Floss feature both place the Wayfarer in the film. The current-production equivalent is the [Ray-Ban Original Wayfarer RB2140](/sunglasses/ray-ban-original-wayfarer-rb2140); the period design is recorded as the [Ray-Ban Wayfarer (Bausch & Lomb era)](/sunglasses/ray-ban-wayfarer-bl-vintage).

## The revival story, and its caveats

Sources describe the Wayfarer as close to being discontinued, with sales of about 18,000 pairs by 1981. They also report that Ray-Ban paid a product-placement firm \$50,000 a year from 1982, and that roughly 360,000 pairs sold in 1983. That last figure is repeated across sites but traces back to a single CNN Money source, so it is not independent confirmation. Mental Floss adds that a GQ spread lifted sales earlier, to about 200,000 in 1982.

## The underwear-scene myth

The famous dance scene is often remembered with sunglasses on. Mental Floss notes that Cruise wears the Wayfarers elsewhere in the film and on the poster, not in that scene.

## A wave, not a single film

MeTV's history places Wayfarer sales near 1.5 million a year by 1986 and 1987, helped by [Miami Vice](/movies/miami-vice), The Breakfast Club and Top Gun, which boosted the Aviator instead. Treat the numbers as reported.

## Alternatives

For the shape at a lower price band, see the [Oakley Frogskins](/sunglasses/oakley-frogskins) and the [Knockaround Premiums](/sunglasses/knockaround-premiums). Neither is the film pair. More in [wayfarer styles](/styles/wayfarer).`,
    faq: [
      { q: "What sunglasses does Tom Cruise wear in Risky Business?", a: "Ray-Ban Wayfarers, according to Wikipedia's history of the model and a Mental Floss feature." },
      { q: "Does he wear them in the underwear dance scene?", a: "No. Mental Floss notes the scene is often misremembered; he wears them elsewhere and on the poster." },
      { q: "Did Risky Business really save the Wayfarer?", a: "It is widely credited with reviving it, but the best-known sales figure traces to a single source, so we call it reported." },
    ],
    sources: [
      { title: "Wikipedia: Ray-Ban Wayfarer", url: "https://en.wikipedia.org/wiki/Ray-Ban_Wayfarer" },
      { title: "Mental Floss: When Tom Cruise saved the Ray-Ban brand", url: "https://mentalfloss.com/article/643575/tom-cruise-saved-ray-ban-brand" },
      { title: "MeTV: A comprehensive history of the iconic Ray-Ban Wayfarer", url: "https://metv.com/stories/a-comprehensive-history-of-the-iconic-ray-ban-wayfarer" },
    ],
  },
  {
    ...base, id: "what-sunglasses-does-neo-wear-in-the-matrix", slug: "what-sunglasses-does-neo-wear-in-the-matrix",
    title: "What Sunglasses Does Neo Wear in The Matrix?",
    metaTitle: "Neo's Matrix Sunglasses: Custom Blinde Design Frames",
    metaDescription: "Neo Matrix sunglasses: reportedly custom frames by Blinde Design for the three leads. What is documented, what is not, and look-alikes.",
    excerpt: "The Matrix glasses were reportedly made for the cast, not bought off a shelf. Here is what that means for finding a pair.",
    answer: "Neo's Matrix sunglasses were reportedly custom metal frames made by designer Richard Walker of Blinde Design Project for Keanu Reeves, Carrie-Anne Moss and Laurence Fishburne. Individual model names are not documented in the sources we reviewed, so the identification stays Unconfirmed.",
    category: "Guides", targetKeyword: "neo matrix sunglasses", searchIntent: "Informational: what are they, and can I buy them",
    status: "published", reviewed: false,
    modelIds: ["blinde-design-matrix-custom", "knockaround-fast-lanes", "goodr-og"], movieIds: ["the-matrix"],
    body: `## What we know

For [The Matrix](/movies/the-matrix), CheatSheet, citing the Chicago Tribune, reports that Richard Walker of Blinde Design Project made custom sunglasses for each of the three leads. Other write-ups describe distinctive metal frames designed per character. Our record is [Blinde Design custom Matrix frames](/sunglasses/blinde-design-matrix-custom).

## What we do not know

- **Model names.** We found no source that names a specific model for Neo, Trinity or Morpheus, so all three identifications are **Unconfirmed**.
- **The company name.** Sources write both "Blinde Design" and "Blinde Optics".
- **Later films.** One research credit says Trinity and Agent Smith also used Studio Red designs in The Matrix Reloaded. We have not verified that against a primary source.

## The Morpheus detail

Pretavoir reports that Fishburne's pair had no earpieces and stayed on the nose. It is one retailer's account, so we show it as reported.

## Buying a look-alike

Because the originals were made for the film, anything sold today is either an official or replica line or a look-alike. Sources mention that Blinde and Warner Bros sold Matrix-branded lines after the film, but we cannot confirm what is still available. For a dark, narrow wrap look at a budget price band, see the [Knockaround Fast Lanes](/sunglasses/knockaround-fast-lanes) or the [Goodr OG](/sunglasses/goodr-og). See also [futuristic styles](/styles/futuristic).`,
    faq: [
      { q: "What sunglasses does Neo wear in The Matrix?", a: "Reportedly custom frames by Blinde Design Project; no specific model name is documented, so we label it Unconfirmed." },
      { q: "Can I buy Neo's sunglasses?", a: "The originals were reportedly made for the cast. Replica and look-alike pairs exist, but we have not verified current availability." },
      { q: "Is it Blinde Design or Blinde Optics?", a: "Sources use both names. We list the brand as Blinde Design and note the discrepancy." },
    ],
    sources: [
      { title: "CheatSheet: The Matrix sunglasses were uniquely made for each cast member", url: "https://www.cheatsheet.com/entertainment/the-matrix-sunglasses-were-uniquely-made-for-each-cast-member.html" },
      { title: "Pretavoir: The Matrix sunglasses", url: "https://pretavoir.co.uk/blogs/news/the-matrix-sunglasses" },
    ],
  },
  {
    ...base, id: "the-devil-wears-prada-2-sunglasses-guide", slug: "the-devil-wears-prada-2-sunglasses-guide",
    title: "The Devil Wears Prada 2 Sunglasses Guide",
    metaTitle: "The Devil Wears Prada 2 Sunglasses: What We Know",
    metaDescription: "Devil Wears Prada 2 sunglasses: the pairs retail guides name for Andy and Miranda, where they disagree, and what stays unconfirmed.",
    excerpt: "Retail guides name many pairs, and they do not agree. A guide that says which claims are scene-specific and which are not.",
    answer: "The Devil Wears Prada 2 sunglasses are not settled: retail guides name different pairs for Andy and Miranda, mixing scenes from the film with press events. Every identification below is labelled Unconfirmed until a scene-level source confirms it.",
    category: "Guides", targetKeyword: "devil wears prada 2 sunglasses", searchIntent: "Informational and trend: which pairs, and where to find them",
    status: "published", reviewed: false,
    modelIds: ["barton-perreira-samo", "lgr-karthoum", "jimmy-choo-jc5030u"], movieIds: ["the-devil-wears-prada-2"],
    body: `## Why this is hard

Most guides to [The Devil Wears Prada 2](/movies/the-devil-wears-prada-2) mix three things: pairs seen in the film, pairs seen during filming in New York, and pairs worn at premieres and photocalls. Their authors are also retailers. We separate those cases and label every identification **Unconfirmed**.

## Andy Sachs (Anne Hathaway)

- One guide names the L.G.R Karthoum, black with grey lenses and a 1990s feel: [L.G.R Karthoum](/sunglasses/lgr-karthoum).
- Another says the large black Barton Perreira Samo is possibly her most prominent pair: [Barton Perreira Samo](/sunglasses/barton-perreira-samo).
- Further names in guides include a Khaite and Oliver Peoples collaboration, Bvlgari, Celine and Shevoke's Zulu cat-eye.

## Miranda Priestly (Meryl Streep)

One guide lists a marbled beige Tiffany & Co. TF4238U and a black [Jimmy Choo JC5030U](/sunglasses/jimmy-choo-jc5030u) cat-eye from earlier New York filming; another only says Jimmy Choo. At a London photocall Streep wore Emmanuelle Khanh's Cherry cat-eye, which is an event, not a scene.

## Other cast

Guides also place Etnia Barcelona's Deia on Emily Blunt at the photocall, and a Tom Ford TF1129-P on Stanley Tucci's Nigel. Each rests on a single guide.

## How to use this

Treat any shop that sells "the pair from the film" as selling a possible match. Ask which scene a claim refers to. If you like the cat-eye shape, browse [cat-eye styles](/styles/cat-eye). We will update these records as scene-level sources appear.`,
    faq: [
      { q: "What sunglasses does Anne Hathaway wear in The Devil Wears Prada 2?", a: "Guides disagree: the L.G.R Karthoum and the Barton Perreira Samo are both named. We label both Unconfirmed." },
      { q: "What about Miranda Priestly's sunglasses?", a: "One guide names a Jimmy Choo JC5030U cat-eye from earlier filming; her photocall pair was a different, event-only look." },
      { q: "Why are all the identifications Unconfirmed?", a: "Sources are retail guides that disagree and mix scenes with press events. We need a scene-level source to upgrade them." },
    ],
    sources: [
      { title: "Pretavoir: The Devil Wears Prada 2 glasses and sunglasses", url: "https://pretavoir.co.uk/blogs/news/the-devil-wears-prada-2-glasses-sunglasses" },
      { title: "OtticaNet: Sunglasses guide, The Devil Wears Prada 2", url: "https://www.otticanet.it/en/blogs/news/sunglasses-guide-the-devil-wears-prada-2" },
    ],
  },
];

const CHECKLIST = `## What to check before you buy

- Match the reference printed on the frame or in the listing to the model page. Sellers often use a film name for a look-alike.
- Compare frame and lens colour with the details above. Several of these designs were sold in more than one colour.
- For vintage pairs, ask for photos of the temple markings and the lens etching, and prefer sellers who accept returns.
- Be wary of any listing that promises the "exact film pair" without citing a source. This site grades that claim by evidence instead.
- Check size (lens width and bridge) before buying; classic designs often came in several sizes.`;

const EXTRA: Record<string, string> = {
  "what-sunglasses-does-brad-pitt-wear-in-f1": `## Quick facts

- Film: [F1](/movies/f1-the-movie) (2025), Brad Pitt as Sonny Hayes.
- Proposed model: [S.T. Dupont D002](/sunglasses/st-dupont-d002-6051), reference 6051, gold frame, brown gradient lenses.
- Grade on this site: **Unconfirmed**, because one source disputes the brand.
- Alternative named by a source: [Dita Kudru](/sunglasses/dita-kudru).

${CHECKLIST}

## How this answer may change

If a costume-department credit, an auction listing or an interview names the pair, we will update the record, add the new source with its date and re-grade the identification. Until then, treat any shop that sells "the F1 sunglasses" as selling a look-alike. See all [affordable alternatives](/affordable-alternatives) and [vintage eyewear](/vintage).`,
  "top-gun-sunglasses-tom-cruise-aviators": `## Quick facts

- Films: [Top Gun](/movies/top-gun) (1986) and [Top Gun: Maverick](/movies/top-gun-maverick) (2022), Tom Cruise as Maverick.
- 2022 model named by three retail guides: [Ray-Ban Aviator Classic RB3025](/sunglasses/ray-ban-aviator-classic-rb3025), gold frame, green lenses.
- 1986 model: [Ray-Ban Aviator (Bausch & Lomb era)](/sunglasses/ray-ban-aviator-bl-vintage); the exact reference is not documented.
- Supporting-cast pairs (Caravan RB3136, Shooter RB3138) come from a single retailer and stay **Unconfirmed**.

${CHECKLIST}

## Aviator or look-alike?

The Aviator is one of the most copied shapes, so most listings that mention Top Gun are look-alikes. If you want the real design, the RB3025 is the current-production Ray-Ban. If you want the look for less, browse [aviator styles](/styles/aviator) and the [affordable alternatives](/affordable-alternatives).`,
  "men-in-black-sunglasses-original-models": `## Quick facts

- Film: [Men in Black](/movies/men-in-black) (1997), Will Smith as Agent J and Tommy Lee Jones as Agent K.
- Model: [Ray-Ban Predator 2](/sunglasses/ray-ban-predator-2-rb2027), wraparound, black frame, dark lenses.
- References cited: 2027 and 2030 (we show both and pick neither).
- Grade on this site: **Exact Match**, supported by a fan database and period press coverage.

${CHECKLIST}

## Why the reference number matters

Retail pages use "RB2027", "2027" and "2030" interchangeably. When you shop, compare photos of the frame shape and the lens curve instead of relying on the number alone, and confirm availability, because we could not verify that the model is still in production. For other dark wrap styles see [futuristic sunglasses](/styles/futuristic).`,
  "audrey-hepburn-breakfast-at-tiffanys-sunglasses": `## Quick facts

- Film: [Breakfast at Tiffany's](/movies/breakfast-at-tiffanys) (1961), Audrey Hepburn as Holly Golightly.
- Model: [Oliver Goldsmith Manhattan](/sunglasses/oliver-goldsmith-manhattan), the brand's reissue, released for the 50th anniversary in 2011 per SunglassesID.
- Frame: dark tortoise with green lenses matches the on-screen pair, per SunglassesID.
- Grade on this site: **Official Reissue**, supported by the brand and a reference database.

${CHECKLIST}

## Original, reissue or look-alike?

The Manhattan is the maker's own replica, so it is the closest buyable match. Anything else sold as "Audrey Hepburn sunglasses" is a look-alike inspired by the wayfarer shape. Compare more in [wayfarer styles](/styles/wayfarer) and [vintage eyewear](/vintage).`,
  "the-blues-brothers-sunglasses": `## Quick facts

- Film: [The Blues Brothers](/movies/the-blues-brothers) (1980), John Belushi as Jake and Dan Aykroyd as Elwood.
- Model: [Ray-Ban Wayfarer (Bausch & Lomb era)](/sunglasses/ray-ban-wayfarer-bl-vintage); current production is the [Original Wayfarer RB2140](/sunglasses/ray-ban-original-wayfarer-rb2140).
- Reference 5022: reported by one retailer, so **unconfirmed**.
- Grade on this site: **Exact Match** at the model-family level, supported by three retail sources.

${CHECKLIST}

## Which Wayfarer should you buy?

For the shape, the Original Wayfarer in black is the direct modern equivalent. For a period pair, search vintage listings and ask for temple markings. For a lower budget, see [wayfarer styles](/styles/wayfarer) and the [affordable alternatives](/affordable-alternatives).`,
};

EXTRA["tom-cruise-risky-business-sunglasses"] = `## Quick facts

- Film: [Risky Business](/movies/risky-business) (1983), Tom Cruise as Joel Goodsen.
- Model: Ray-Ban Wayfarer; current production is the [Original Wayfarer RB2140](/sunglasses/ray-ban-original-wayfarer-rb2140).
- Grade on this site: **Exact Match** at the model-family level, from Wikipedia and Mental Floss.
- Sales figures: reported, one source behind the best-known number.

${CHECKLIST}`;
EXTRA["what-sunglasses-does-neo-wear-in-the-matrix"] = `## Quick facts

- Film: [The Matrix](/movies/the-matrix) (1999), Keanu Reeves as Neo.
- Maker reported: Blinde Design Project (Richard Walker), custom frames for the leads.
- Grade on this site: **Unconfirmed**, no model names documented.
- Look-alikes: [Knockaround Fast Lanes](/sunglasses/knockaround-fast-lanes), [Goodr OG](/sunglasses/goodr-og).

${CHECKLIST}`;
EXTRA["the-devil-wears-prada-2-sunglasses-guide"] = `## Quick facts

- Film: [The Devil Wears Prada 2](/movies/the-devil-wears-prada-2) (2026).
- Pairs named by guides: L.G.R Karthoum, Barton Perreira Samo, Jimmy Choo JC5030U, among others.
- Grade on this site: **Unconfirmed** for all, because guides disagree.
- Rule of thumb: ask which scene a claim refers to.

${CHECKLIST}`;

const PATCH: Record<string, Partial<Article>> = {
  "what-sunglasses-does-brad-pitt-wear-in-f1": {
    answer: "Brad Pitt's F1 sunglasses are most likely a vintage gold S.T. Dupont D002 (6051) with brown gradient lenses, according to two sources, but one retailer says the aviators are unbranded frames from the costume designer's family. We label the identification Unconfirmed.",
    metaDescription: "Brad Pitt F1 sunglasses: two sources name a vintage gold S.T. Dupont D002, a third disputes it. See the evidence and wearable alternatives.",
  },
  "top-gun-sunglasses-tom-cruise-aviators": {
    answer: "The Top Gun sunglasses are Ray-Ban Aviators. For Top Gun: Maverick (2022), three retail guides name the Aviator Classic RB3025 in gold with green lenses; one source describes a custom tint. The 1986 production reference is not documented in the sources we reviewed.",
    metaDescription: "Top Gun sunglasses: Maverick's Ray-Ban Aviators in 1986 and 2022. What is documented, what is disputed and affordable alternatives.",
  },
  "men-in-black-sunglasses-original-models": {
    answer: "The Men in Black sunglasses are the wraparound Ray-Ban Predator 2, cited as reference 2027 (some pages say 2030). Both leads are reported to wear the same style.",
    metaDescription: "Men in Black sunglasses: the wraparound Ray-Ban Predator 2 worn by Agents J and K, its reference numbers and budget wrap alternatives.",
  },
  "audrey-hepburn-breakfast-at-tiffanys-sunglasses": {
    metaDescription: "Breakfast at Tiffany's sunglasses: Holly Golightly's black wayfarer-style Oliver Goldsmith, the Manhattan reissue and cheaper alternatives.",
  },
  "the-blues-brothers-sunglasses": {
    answer: "The Blues Brothers sunglasses are Ray-Ban Wayfarers worn by Jake and Elwood. Several sources agree on the model; one retailer blog cites the vintage 5022 reference, which we treat as unconfirmed.",
    metaDescription: "Blues Brothers sunglasses: Jake and Elwood's Ray-Ban Wayfarers, what sources agree on, the unconfirmed 5022 reference and alternatives.",
  },
};

export const fullArticles: Article[] = [...baseArticles, ...roundupArticles].map((a) => ({ ...a, ...(PATCH[a.id] ?? {}), body: a.body + "\n\n" + (EXTRA[a.id] ?? "") }));

type B = [slug: string, title: string, kw: string, cat: string, intent: string, movies: string[], models: string[], angle: string];
const BRIEFS: B[] = [
  ["what-sunglasses-does-brad-pitt-wear-in-f1", "What Sunglasses Does Brad Pitt Wear in F1?", "brad pitt f1 sunglasses", "Guides", "Informational", ["f1-the-movie"], [], ""],
  ["top-gun-sunglasses-tom-cruise-aviators", "Top Gun Sunglasses: Tom Cruise's Iconic Aviators", "top gun sunglasses", "Guides", "Commercial investigation", ["top-gun"], [], ""],
  ["the-devil-wears-prada-2-sunglasses-guide", "The Devil Wears Prada 2 Sunglasses Guide", "devil wears prada 2 sunglasses", "Guides", "Informational / trend", ["the-devil-wears-prada-2"], ["barton-perreira-samo", "lgr-karthoum", "jimmy-choo-jc5030u"], "Scene-by-scene guide; guides currently disagree, so every pair must be tied to a specific scene or press event."],
  ["what-sunglasses-does-neo-wear-in-the-matrix", "What Sunglasses Does Neo Wear in The Matrix?", "neo matrix sunglasses", "Guides", "Informational", ["the-matrix"], ["blinde-design-matrix-custom"], "Explain custom Blinde Design frames, separate official Matrix merchandise from film props."],
  ["tom-cruise-risky-business-sunglasses", "Tom Cruise Risky Business Sunglasses", "risky business sunglasses", "Guides", "Commercial investigation", ["risky-business"], ["ray-ban-wayfarer-bl-vintage", "ray-ban-original-wayfarer-rb2140"], "Cover the Wayfarer revival; correct the underwear-scene myth; verify the 360,000 figure against its CNN Money origin."],
  ["men-in-black-sunglasses-original-models", "Men in Black Sunglasses: Original Models", "men in black sunglasses", "Guides", "Commercial investigation", ["men-in-black"], [], ""],
  ["audrey-hepburn-breakfast-at-tiffanys-sunglasses", "Audrey Hepburn Breakfast at Tiffany's Sunglasses", "breakfast at tiffany's sunglasses", "Guides", "Commercial", ["breakfast-at-tiffanys"], [], ""],
  ["the-blues-brothers-sunglasses", "The Blues Brothers Sunglasses", "blues brothers sunglasses", "Guides", "Commercial", ["the-blues-brothers"], [], ""],
  ["most-iconic-sunglasses-in-movie-history", "Most Iconic Sunglasses in Movie History", "iconic movie sunglasses", "Lists", "Informational list", [], ["ray-ban-original-wayfarer-rb2140", "ray-ban-aviator-classic-rb3025", "persol-714-steve-mcqueen"], "Ranked editorial list; ranking method must be disclosed."],
  ["best-movie-inspired-sunglasses-under-100", "Best Movie-Inspired Sunglasses Under $100", "movie inspired sunglasses under 100", "Roundups", "Commercial", [], ["knockaround-premiums", "knockaround-fort-knocks", "quay-all-in"], "Needs live prices from approved merchants before publishing; no price claims without offers."],
  ["affordable-alternatives-to-famous-movie-sunglasses", "Affordable Alternatives to Famous Movie Sunglasses", "affordable alternatives movie sunglasses", "Roundups", "Commercial", [], [], "Hub page linking to /affordable-alternatives."],
  ["best-1980s-movie-sunglasses", "Best 1980s Movie Sunglasses", "80s movie sunglasses", "Lists", "Informational list", ["top-gun", "risky-business", "the-terminator", "the-blues-brothers"], [], "Decade list; confirm release years and model evidence per entry."],
  ["best-1990s-movie-sunglasses", "Best 1990s Movie Sunglasses", "90s movie sunglasses", "Lists", "Informational list", ["men-in-black", "the-matrix", "leon-the-professional"], [], "Decade list; Léon and Matrix entries need stronger sources."],
  ["best-aviator-sunglasses-inspired-by-movies", "Best Aviator Sunglasses Inspired by Movies", "movie aviator sunglasses", "Roundups", "Commercial", ["top-gun"], ["ray-ban-aviator-classic-rb3025", "knockaround-fort-knocks"], "Group by film; separate exact models from lookalikes."],
  ["vintage-movie-sunglasses-you-can-still-buy", "Vintage Movie Sunglasses You Can Still Buy", "vintage movie sunglasses", "Guides", "Commercial investigation", [], ["ray-ban-wayfarer-bl-vintage", "ray-ban-aviator-bl-vintage"], "Needs verified marketplace listings; explain authentication risks."],
  ["famous-sunglasses-worn-by-hollywood-actors", "Famous Sunglasses Worn by Hollywood Actors", "sunglasses worn by hollywood actors", "Lists", "Informational list", [], [], "Actor-first list linking to /actors."],
  ["best-sunglasses-inspired-by-action-movies", "Best Sunglasses Inspired by Action Movies", "action movie sunglasses", "Roundups", "Commercial", ["top-gun", "the-terminator", "men-in-black"], [], "Action-film roundup."],
  ["movie-sunglasses-for-men", "Movie Sunglasses for Men", "movie sunglasses for men", "Roundups", "Commercial", [], [], "Check whether this query differs enough from the main hub to justify a page."],
  ["movie-sunglasses-for-women", "Movie Sunglasses for Women", "movie sunglasses for women", "Roundups", "Commercial", ["breakfast-at-tiffanys", "the-devil-wears-prada-2"], ["oliver-goldsmith-manhattan", "jimmy-choo-jc5030u"], "Needs more women-led film entries before publishing."],
  ["where-to-buy-famous-movie-sunglasses", "Where to Buy Famous Movie Sunglasses", "where to buy movie sunglasses", "Guides", "Transactional", [], [], "Merchant comparison; requires live programme data."],
];
const full = new Set(fullArticles.map((a) => a.id));
const briefs: Article[] = BRIEFS.filter((b) => !full.has(b[0])).map(([slug, title, kw, cat, intent, movieIds, modelIds, angle]) => ({
  ...base, id: slug, slug, title, metaTitle: "", metaDescription: "", excerpt: "", answer: "", faq: [], sources: [],
  modelIds, movieIds, category: cat, targetKeyword: kw, searchIntent: intent, status: "brief" as const, reviewed: false,
  body: `## SEO brief\n\n**Target keyword:** ${kw}\n\n**Intent:** ${intent}\n\n**Angle:** ${angle || "Answer the query in the first two sentences, then back it with sourced model records."}\n\n**Before writing:** check search volume and SERP competitors in Semrush/Ahrefs/Keyword Planner; do not assume demand.\n\n**Required:** immediate answer, linked model records, affordable alternatives, FAQ, sources with dates, internal links.`,
}));

export const articles: Article[] = [...fullArticles, ...briefs];

export const keywords: Keyword[] = BRIEFS.map(([slug, , kw, , intent]) => ({
  id: `kw-${kw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`, term: kw, volume: null, difficulty: null, intent, cluster: kw.split(" ")[0], source: "editorial plan (volume unverified)", articleId: slug, targetUrl: `/blog/${slug}`,
}));
