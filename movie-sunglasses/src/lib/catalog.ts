import { cache } from "react";
import { listAll } from "./store";
import { bestMatch, effectiveMatch, type EffectiveMatch } from "./evidence";
import type {
  Actor, AffiliateOffer, Article, Brand, Character, Collections, Evidence, MatchType, Merchant, Movie,
  MovieAppearance, Photo, PriceBand, ProductAlternative, SunglassesModel,
} from "./types";
import { STYLES } from "./site";

export interface CatalogData {
  movies: Movie[]; actors: Actor[]; characters: Character[]; brands: Brand[]; models: SunglassesModel[];
  appearances: MovieAppearance[]; evidence: Evidence[]; alternatives: ProductAlternative[];
  merchants: Merchant[]; offers: AffiliateOffer[]; articles: Article[]; photos: Photo[];
}

export const isLive = (a: Article, now = Date.now()) =>
  a.status === "published" || (a.status === "scheduled" && !!a.publishAt && new Date(a.publishAt).getTime() <= now);

export function buildCatalog(d: CatalogData, now = Date.now()) {
  const by = <T extends { id: string }>(rows: T[]) => new Map(rows.map((r) => [r.id, r]));
  const movieById = by(d.movies), actorById = by(d.actors), charById = by(d.characters), brandById = by(d.brands);
  const modelById = by(d.models), merchantById = by(d.merchants), appById = by(d.appearances);
  const evByApp = new Map<string, Evidence[]>();
  for (const e of d.evidence) evByApp.set(e.appearanceId, [...(evByApp.get(e.appearanceId) ?? []), e]);
  const articles = d.articles.filter((a) => isLive(a, now)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const matchOf = (app: MovieAppearance): EffectiveMatch => effectiveMatch(app, evByApp.get(app.id) ?? []);
  const appsForModel = (id: string) => d.appearances.filter((a) => a.modelId === id);
  const approvedPhotos = (modelId: string) => d.photos.filter((p) => p.approved && p.modelId === modelId);

  const modelMatch = (id: string): MatchType => {
    const apps = appsForModel(id);
    // A model with no on-screen appearance is a purchasable look-alike, i.e. "Similar Style".
    return apps.length ? bestMatch(apps.map((a) => matchOf(a).type)) : "similar";
  };
  const offersFor = (id: string) =>
    d.offers.filter((o) => o.modelId === id && merchantById.get(o.merchantId)?.active !== false)
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  const lowestOffer = (id: string) => offersFor(id).find((o) => o.price != null && o.availability !== "out_of_stock");

  /** A band derived from a real offer wins; otherwise the editorial band is returned and flagged as such. */
  const priceBandOf = (m: SunglassesModel): { band: PriceBand | undefined; source: "offer" | "editorial" | "none" } => {
    const o = lowestOffer(m.id);
    if (o && o.price != null && o.currency === "USD") {
      const p = o.price;
      return { band: p < 50 ? "under50" : p < 100 ? "under100" : p < 200 ? "under200" : "over200", source: "offer" };
    }
    return m.priceBand ? { band: m.priceBand, source: "editorial" } : { band: undefined, source: "none" };
  };

  const isAlternativeOnly = (id: string) => appsForModel(id).length === 0;
  const alternativesOf = (id: string) => d.alternatives.filter((a) => a.originalModelId === id)
    .map((a) => ({ alt: a, model: modelById.get(a.alternativeModelId)! })).filter((x) => x.model);
  const originalsOf = (id: string) => d.alternatives.filter((a) => a.alternativeModelId === id)
    .map((a) => ({ alt: a, model: modelById.get(a.originalModelId)! })).filter((x) => x.model);

  return {
    ...d, articles, movieById, actorById, charById, brandById, modelById, merchantById, appById, evByApp,
    matchOf, modelMatch, appsForModel, approvedPhotos, offersFor, lowestOffer, priceBandOf, isAlternativeOnly,
    alternativesOf, originalsOf,
    modelsForMovie: (movieId: string) => [...new Set(d.appearances.filter((a) => a.movieId === movieId).map((a) => a.modelId))].map((i) => modelById.get(i)!).filter(Boolean),
    modelsForActor: (actorId: string) => [...new Set(d.appearances.filter((a) => a.actorId === actorId).map((a) => a.modelId))].map((i) => modelById.get(i)!).filter(Boolean),
    moviesForActor: (actorId: string) => [...new Set(d.characters.filter((c) => c.actorId === actorId).map((c) => c.movieId))].map((i) => movieById.get(i)!).filter(Boolean),
    actorsForMovie: (movieId: string) => [...new Set(d.characters.filter((c) => c.movieId === movieId).map((c) => c.actorId))].map((i) => actorById.get(i)!).filter(Boolean),
    modelsForBrand: (brandId: string) => d.models.filter((m) => m.brandId === brandId),
    modelsForStyle: (slug: string) => { const s = STYLES.find((x) => x.slug === slug); return s ? d.models.filter((m) => s.match(m.shape, m.styleTags)) : []; },
    articlesForModel: (id: string) => articles.filter((a) => a.modelIds.includes(id)),
    articlesForMovie: (id: string) => articles.filter((a) => a.movieIds.includes(id)),
    /** Models that are the target of a documented on-screen appearance (not budget-only alternatives). */
    screenModels: d.models.filter((m) => d.appearances.some((a) => a.modelId === m.id)),
  };
}
export type Catalog = ReturnType<typeof buildCatalog>;

export const getCatalog = cache(async (): Promise<Catalog> => {
  const [movies, actors, characters, brands, models, appearances, evidence, alternatives, merchants, offers, articles, photos] = await Promise.all([
    listAll("movies"), listAll("actors"), listAll("characters"), listAll("brands"), listAll("models"),
    listAll("appearances"), listAll("evidence"), listAll("alternatives"), listAll("merchants"),
    listAll("offers"), listAll("articles"), listAll("photos"),
  ]);
  return buildCatalog({ movies, actors, characters, brands, models, appearances, evidence, alternatives, merchants, offers, articles, photos });
});

export type { Collections };
