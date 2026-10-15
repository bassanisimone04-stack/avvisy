import type { Catalog } from "./catalog";
import { MATCH_LABEL, SITE, STYLES } from "./site";
import { truncate } from "./format";
import type { Actor, Brand, FaqItem, Movie, SunglassesModel } from "./types";

const SUFFIX = ` | ${SITE.name}`;

/** Keeps titles within 60 characters: appends the brand only when it fits, else trims at a word boundary. */
export function fitTitle(core: string): string {
  if ((core + SUFFIX).length <= 60) return core + SUFFIX;
  if (core.length <= 60) return core;
  const cut = core.slice(0, 59);
  return cut.slice(0, cut.lastIndexOf(" ") > 30 ? cut.lastIndexOf(" ") : 59).replace(/[\s,:;(–—-]+$/, "") + "…";
}
const desc = (s: string) => truncate(s.replace(/\s+/g, " ").trim(), 155);
const uniq = <T,>(a: T[]) => [...new Set(a)];
const shortName = (m: SunglassesModel) => m.name.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
const codeOf = (m: SunglassesModel) => (m.modelCode && /^[A-Z0-9 -]{3,12}$/.test(m.modelCode) && !m.name.includes(m.modelCode) ? m.modelCode : "");

export function modelSeo(c: Catalog, m: SunglassesModel) {
  const apps = c.appsForModel(m.id);
  const films = uniq(apps.map((a) => c.movieById.get(a.movieId)!).filter(Boolean));
  const name = shortName(m);
  const code = codeOf(m);
  let core: string, description: string;
  if (films.length) {
    const first = films[0];
    const film = first.title;
    const bare = film.replace(/^(The|A|An) /, "");
    const candidates = [
      `${name}${code ? ` ${code}` : ""} – ${film} Sunglasses`, `${name} – ${film} Sunglasses`,
      `${name}${code ? ` ${code}` : ""} – ${bare} Sunglasses`, `${name} – ${bare} Sunglasses`, `${name} – ${film}`, `${name} – ${bare}`, `${name} Sunglasses`,
    ];
    core = candidates.find((x) => x.length <= 60) ?? candidates[candidates.length - 1];
    const ac = c.actorById.get(apps[0].actorId)?.name;
    const label = MATCH_LABEL[c.modelMatch(m.id)];
    description = `${name}${code ? ` (${code})` : ""}: sunglasses linked to ${ac} in ${first.title} (${first.year}). Grade: ${label}. Sources, alternatives, where to buy.`;
    if (description.length > 155) description = `${name}: sunglasses linked to ${ac} in ${first.title} (${first.year}). Grade: ${label}. Sources and alternatives.`;
  } else {
    const orig = c.originalsOf(m.id)[0]?.model;
    core = orig ? `${name}: Look-Alike of ${shortName(orig)}` : `${name}: Specs & Where to Buy`;
    description = `${name}${code ? ` (${code})` : ""}: ${m.shape} sunglasses${orig ? ` recommended as a similar style to ${shortName(orig)}` : ""}. Specs, editorial price band and where to find listings.`;
  }
  return { title: fitTitle(core), description: desc(description), faq: modelFaq(c, m) };
}

function modelFaq(c: Catalog, m: SunglassesModel): FaqItem[] {
  const faq: FaqItem[] = [];
  const name = shortName(m);
  for (const a of c.appsForModel(m.id).slice(0, 3)) {
    const em = c.matchOf(a), mv = c.movieById.get(a.movieId)!, ac = c.actorById.get(a.actorId)!, ch = c.charById.get(a.characterId)!;
    const n = c.evByApp.get(a.id)?.filter((e) => e.stance !== "disputes").length ?? 0;
    faq.push({
      q: `What sunglasses does ${ac.name} wear in ${mv.title}?`,
      a: em.type === "unconfirmed"
        ? `The pair has not been confirmed. Sources point to the ${name}, but the identification is graded Unconfirmed: ${em.downgraded ? em.reason.toLowerCase() : "the evidence is thin or conflicting."}`
        : em.type === "similar"
          ? `The original maker has not been identified; the ${name} is the closest known look-alike for ${ch.name}.`
          : `${ac.name} as ${ch.name} wears the ${name} (${MATCH_LABEL[em.type]}, ${n} supporting source${n === 1 ? "" : "s"}).`,
    });
  }
  const status = m.status === "in_production" ? `We list the ${name} as in production; confirm current availability with a store.`
    : m.status === "vintage" || m.status === "discontinued" ? `The ${name} is listed as ${m.status === "vintage" ? "vintage" : "discontinued"}; look for official reissues or secondary-market listings.`
    : `We could not verify whether the ${name} is still sold; sources disagree.`;
  faq.push({ q: `Is the ${name} still available?`, a: status });
  const alts = c.alternativesOf(m.id).slice(0, 3);
  if (alts.length) faq.push({ q: `What are cheaper alternatives to the ${name}?`, a: `Similar styles include ${alts.map((x) => shortName(x.model)).join(", ")}. These are look-alikes, not what was worn on screen, and price bands are editorial estimates.` });
  const low = c.lowestOffer(m.id);
  faq.push({ q: `Where can I buy the ${name}?`, a: low?.price != null ? `The lowest verified offer we have is $${low.price.toFixed(2)} at ${c.merchantById.get(low.merchantId)?.name} (checked ${low.lastChecked}). Compare all offers above.` : "We have no verified offers yet, so we show no price. Use the listing links above to search current stores." });
  return faq;
}

export function movieSeo(c: Catalog, mv: Movie) {
  const models = c.modelsForMovie(mv.id);
  const apps = c.appearances.filter((a) => a.movieId === mv.id);
  const core = `${mv.title} (${mv.year}) Sunglasses: Brands & Models`;
  const names = models.slice(0, 2).map(shortName).join(" and ");
  const description = models.length
    ? `What sunglasses are worn in ${mv.title}? ${names}${models.length > 2 ? " and more" : ""}, with evidence grades, sources and affordable alternatives.`
    : `Sunglasses worn in ${mv.title} (${mv.year}): identification in progress, with sources and where to look.`;
  const faq: FaqItem[] = [];
  for (const a of apps.slice(0, 4)) {
    const m = c.modelById.get(a.modelId)!, ac = c.actorById.get(a.actorId)!, ch = c.charById.get(a.characterId)!, em = c.matchOf(a);
    faq.push({ q: `What sunglasses does ${ch.name} wear in ${mv.title}?`, a: em.type === "unconfirmed" ? `${ac.name}'s pair is not confirmed. Sources point to the ${shortName(m)}, graded Unconfirmed.` : `${ac.name} as ${ch.name} wears the ${shortName(m)} (${MATCH_LABEL[em.type]}).` });
  }
  if (models.length) faq.push({ q: `Can I buy the sunglasses from ${mv.title}?`, a: "Check each model page for availability, official reissues and cheaper look-alikes. We never show a price we have not verified." });
  return { title: fitTitle(core), description: desc(description), faq };
}

export function actorSeo(c: Catalog, a: Actor) {
  const models = c.modelsForActor(a.id);
  const films = c.moviesForActor(a.id);
  const description = models.length
    ? `Sunglasses worn by ${a.name}: ${models.slice(0, 2).map(shortName).join(", ")}${models.length > 2 ? " and more" : ""}, across ${films.length} title${films.length === 1 ? "" : "s"}, with sources and alternatives.`
    : `${a.name} on screen: titles and characters we track for sunglasses.`;
  const faq: FaqItem[] = [];
  if (models.length) faq.push({ q: `What sunglasses has ${a.name} worn in movies?`, a: c.appearances.filter((x) => x.actorId === a.id).slice(0, 5).map((x) => `${shortName(c.modelById.get(x.modelId)!)} in ${c.movieById.get(x.movieId)!.title} (${MATCH_LABEL[c.matchOf(x).type]})`).join("; ") + "." });
  return { title: fitTitle(`${a.name} Sunglasses in Movies: Models & Brands`), description: desc(description), faq };
}

export function brandSeo(c: Catalog, b: Brand) {
  const n = c.modelsForBrand(b.id).filter((m) => !c.isAlternativeOnly(m.id)).length;
  return { title: fitTitle(`${b.name} Movie Sunglasses: Models Seen On Screen`), description: desc(`${b.name} sunglasses in film and TV: ${n} documented on-screen model${n === 1 ? "" : "s"} with evidence grades, sources and alternatives. ${b.description}`) };
}

export function styleSeo(slug: string) {
  const s = STYLES.find((x) => x.slug === slug)!;
  const n = s.name.replace(" & Round", "");
  return { title: fitTitle(`${n} Sunglasses in Movies: Famous Models`), description: desc(`${s.blurb} Famous ${n.toLowerCase()} sunglasses from film and TV, with cheaper alternatives.`) };
}
