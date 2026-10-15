import { cache } from "react";
import { listAll, storeVersion } from "./store";
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

  // Indexes built once per catalog: every lookup below is O(1) instead of scanning whole tables per card.
  const group = <T,>(rows: T[], key: (r: T) => string) => {
    const m = new Map<string, T[]>();
    for (const r of rows) { const k = key(r); const l = m.get(k); if (l) l.push(r); else m.set(k, [r]); }
    return m;
  };
  const EMPTY: never[] = [];
  const appsByModel = group(d.appearances, (a) => a.modelId);
  const appsByMovie = group(d.appearances, (a) => a.movieId);
  const appsByActor = group(d.appearances, (a) => a.actorId);
  const charsByActor = group(d.characters, (c) => c.actorId);
  const charsByMovie = group(d.characters, (c) => c.movieId);
  const modelsByBrand = group(d.models, (m) => m.brandId);
  const offersByModel = group(d.offers, (o) => o.modelId);
  const altsByOriginal = group(d.alternatives, (a) => a.originalModelId);
  const altsByAlternative = group(d.alternatives, (a) => a.alternativeModelId);
  const livePhotos = d.photos.filter((p) => p.approved);
  const photosByModel = group(livePhotos.filter((p) => p.modelId && p.kind !== "scene"), (p) => p.modelId!);
  const scenesByModel = group(livePhotos.filter((p) => p.modelId && p.kind === "scene"), (p) => p.modelId!);
  const photosByMovie = group(livePhotos.filter((p) => p.movieId), (p) => p.movieId!);
  const photosByArticle = group(livePhotos.filter((p) => p.articleId), (p) => p.articleId!);
  const uniqModels = (apps: MovieAppearance[]) => [...new Set(apps.map((a) => a.modelId))].map((i) => modelById.get(i)!).filter(Boolean);

  const matchCache = new Map<string, EffectiveMatch>();
  const matchOf = (app: MovieAppearance): EffectiveMatch => {
    let m = matchCache.get(app.id);
    if (!m) { m = effectiveMatch(app, evByApp.get(app.id) ?? []); matchCache.set(app.id, m); }
    return m;
  };
  const appsForModel = (id: string): MovieAppearance[] => appsByModel.get(id) ?? EMPTY;
  /** Approved product photos for a model (packshots). */
  const approvedPhotos = (modelId: string) => photosByModel.get(modelId) ?? EMPTY;
  const scenePhotosForModel = (modelId: string) => scenesByModel.get(modelId) ?? EMPTY;
  const photosForMovie = (movieId: string) => photosByMovie.get(movieId) ?? EMPTY;
  const photosForArticle = (articleId: string) => photosByArticle.get(articleId) ?? EMPTY;

  const modelMatchCache = new Map<string, MatchType>();
  const modelMatch = (id: string): MatchType => {
    let t = modelMatchCache.get(id);
    if (!t) {
      const apps = appsForModel(id);
      // A model with no on-screen appearance is a purchasable look-alike, i.e. "Similar Style".
      t = apps.length ? bestMatch(apps.map((a) => matchOf(a).type)) : "similar";
      modelMatchCache.set(id, t);
    }
    return t;
  };
  const offersCache = new Map<string, AffiliateOffer[]>();
  const offersFor = (id: string) => {
    let l = offersCache.get(id);
    if (!l) {
      l = (offersByModel.get(id) ?? []).filter((o) => merchantById.get(o.merchantId)?.active !== false).sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      offersCache.set(id, l);
    }
    return l;
  };
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
  const alternativesOf = (id: string) => (altsByOriginal.get(id) ?? [])
    .map((a) => ({ alt: a, model: modelById.get(a.alternativeModelId)! })).filter((x) => x.model);
  const originalsOf = (id: string) => (altsByAlternative.get(id) ?? [])
    .map((a) => ({ alt: a, model: modelById.get(a.originalModelId)! })).filter((x) => x.model);

  return {
    ...d, articles, movieById, actorById, charById, brandById, modelById, merchantById, appById, evByApp,
    matchOf, modelMatch, appsForModel, approvedPhotos, scenePhotosForModel, photosForMovie, photosForArticle, offersFor, lowestOffer, priceBandOf, isAlternativeOnly,
    alternativesOf, originalsOf,
    modelsForMovie: (movieId: string) => uniqModels(appsByMovie.get(movieId) ?? []),
    modelsForActor: (actorId: string) => uniqModels(appsByActor.get(actorId) ?? []),
    moviesForActor: (actorId: string) => [...new Set((charsByActor.get(actorId) ?? []).map((c) => c.movieId))].map((i) => movieById.get(i)!).filter(Boolean),
    actorsForMovie: (movieId: string) => [...new Set((charsByMovie.get(movieId) ?? []).map((c) => c.actorId))].map((i) => actorById.get(i)!).filter(Boolean),
    modelsForBrand: (brandId: string) => modelsByBrand.get(brandId) ?? EMPTY,
    modelsForStyle: (slug: string) => { const s = STYLES.find((x) => x.slug === slug); return s ? d.models.filter((m) => s.match(m.shape, m.styleTags)) : []; },
    articlesForModel: (id: string) => articles.filter((a) => a.modelIds.includes(id)),
    articlesForMovie: (id: string) => articles.filter((a) => a.movieIds.includes(id)),
    /** Models that are the target of a documented on-screen appearance (not budget-only alternatives). */
    screenModels: d.models.filter((m) => appsByModel.has(m.id)),
  };
}
export type Catalog = ReturnType<typeof buildCatalog>;

const TTL = 30_000;
let shared: { version: string; at: number; catalog: Catalog } | null = null;

/**
 * One catalog (with its indexes) is shared across requests and rebuilt only when the store changes
 * (file mtime / admin write) or after 30 s (so scheduled articles go live and other instances catch up).
 * `cache()` still dedupes within a single render.
 */
export const getCatalog = cache(async (): Promise<Catalog> => {
  const version = storeVersion();
  if (shared && shared.version === version && Date.now() - shared.at < TTL) return shared.catalog;
  const [movies, actors, characters, brands, models, appearances, evidence, alternatives, merchants, offers, articles, photos] = await Promise.all([
    listAll("movies"), listAll("actors"), listAll("characters"), listAll("brands"), listAll("models"),
    listAll("appearances"), listAll("evidence"), listAll("alternatives"), listAll("merchants"),
    listAll("offers"), listAll("articles"), listAll("photos"),
  ]);
  const catalog = buildCatalog({ movies, actors, characters, brands, models, appearances, evidence, alternatives, merchants, offers, articles, photos });
  shared = { version, at: Date.now(), catalog };
  return catalog;
});

export type { Collections };
