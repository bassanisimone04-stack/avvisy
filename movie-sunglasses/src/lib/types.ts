export type MatchType = "exact" | "official_reissue" | "similar" | "unconfirmed";
export type ModelStatus = "in_production" | "discontinued" | "vintage" | "unknown";
export type PriceBand = "under50" | "under100" | "under200" | "over200";
export type Availability = "in_stock" | "limited" | "out_of_stock" | "unknown";
export type SourceType = "press" | "brand" | "retailer" | "fan_database" | "reference" | "primary";
export type ArticleStatus = "brief" | "draft" | "in_review" | "scheduled" | "published";

export interface Movie {
  id: string; slug: string; title: string; year: number; kind: "film" | "series";
  genre: string; synopsis: string; imageUrl?: string; imageCredit?: string;
}
export interface Actor { id: string; slug: string; name: string; bio?: string; imageUrl?: string; imageCredit?: string }
export interface Character { id: string; name: string; actorId: string; movieId: string }
export interface Brand { id: string; slug: string; name: string; country: string; description: string; website?: string }
export interface SpecItem { label: string; value: string }
export interface SunglassesModel {
  id: string; slug: string; name: string; brandId: string; modelCode?: string;
  shape: string; styleTags: string[]; frameColor: string; lensColor: string;
  status: ModelStatus; priceBand?: PriceBand; description: string; specs: SpecItem[];
  /** Always null in seed: authorised photographs are added in the admin (see Photo). */
  imageUrl?: string; imageCredit?: string;
  reviewed: boolean; verifiedAt: string | null;
}
export interface MovieAppearance {
  id: string; modelId: string; movieId: string; actorId: string; characterId: string;
  matchType: MatchType; notes: string;
}
export interface Evidence {
  id: string; appearanceId: string; sourceType: SourceType; sourceTitle: string;
  sourceUrl: string; checkedAt: string; supports: string;
  /** "disputes" = this source contradicts the identification; it blocks Exact/Reissue labels. */
  stance?: "supports" | "disputes";
}
export interface ProductAlternative { id: string; originalModelId: string; alternativeModelId: string; reason: string }
export interface Merchant {
  id: string; slug: string; name: string; network: string; domain: string;
  /** URL template with {q}; used for honest, price-free "search" links until real feed offers exist. */
  searchUrlTemplate?: string;
  /** Appended as query string on outbound links (e.g. "campid=123&customid=x"). Configure when the affiliate programme approves you. */
  affiliateParams?: string;
  /** Editorial assumption of earnings per click (USD). Used ONLY for the "estimated" revenue line. */
  estimatedEpc?: number;
  active: boolean;
}
export interface AffiliateOffer {
  id: string; modelId: string; merchantId: string; price: number | null; currency: string;
  availability: Availability; shipping: string; url: string; lastChecked: string;
}
export interface FaqItem { q: string; a: string }
export interface SourceRef { title: string; url: string }
export interface Article {
  id: string; slug: string; title: string; metaTitle: string; metaDescription: string;
  excerpt: string; answer: string; body: string; faq: FaqItem[]; sources: SourceRef[];
  modelIds: string[]; movieIds: string[]; category: string; targetKeyword: string;
  searchIntent: string; status: ArticleStatus; publishAt: string | null;
  createdAt: string; updatedAt: string; reviewed: boolean; aiGenerated: boolean;
}
export interface Keyword {
  id: string; term: string; volume: number | null; difficulty: number | null;
  intent: string; cluster: string; source: string; articleId?: string;
  /** Page this keyword is meant to rank for (one keyword → one URL avoids cannibalisation). */
  targetUrl?: string;
}
export interface ClickEvent { id: string; at: string; merchantId: string; modelId: string; offerId?: string; src: string; kind: "offer" | "search" }
export interface ViewCount { id: string; type: "model" | "article" | "movie"; refId: string; date: string; count: number }
export interface RevenueEntry { id: string; merchantId: string; periodStart: string; periodEnd: string; amount: number; kind: "reported" | "estimated"; note: string }
export interface Redirect { id: string; from: string; to: string; permanent: boolean }
export interface ContactMessage { id: string; at: string; name: string; email: string; subject: string; body: string; handled: boolean }
export type PhotoLicense = "owned" | "licensed" | "press" | "cc" | "public_domain" | "affiliate_feed";
export interface Photo {
  id: string; url: string; alt: string; credit: string;
  /** How the right to publish was obtained. Anything other than "owned" needs proof (licenseUrl) before approval. */
  license: PhotoLicense | string; licenseUrl?: string; sourceUrl?: string;
  /** "product" = packshot used on cards and as the main image; "scene" = still or on-set photo shown with the film/guide. */
  kind?: "product" | "scene";
  modelId?: string; movieId?: string; articleId?: string; approved: boolean;
}

export interface Collections {
  movies: Movie; actors: Actor; characters: Character; brands: Brand;
  models: SunglassesModel; appearances: MovieAppearance; evidence: Evidence;
  alternatives: ProductAlternative; merchants: Merchant; offers: AffiliateOffer;
  articles: Article; keywords: Keyword; clicks: ClickEvent; views: ViewCount;
  revenue: RevenueEntry; redirects: Redirect; messages: ContactMessage; photos: Photo;
}
export type CollectionName = keyof Collections;
export const COLLECTION_NAMES: CollectionName[] = [
  "movies", "actors", "characters", "brands", "models", "appearances", "evidence",
  "alternatives", "merchants", "offers", "articles", "keywords", "clicks", "views",
  "revenue", "redirects", "messages", "photos",
];
