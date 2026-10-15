import Link from "next/link";
import type { Catalog } from "@/lib/catalog";
import type { Actor, Article, Brand, Movie, SunglassesModel } from "@/lib/types";
import { PRICE_BAND_LABEL } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { GlassesArt } from "./glasses";
import { MatchBadge } from "./ui";

const STATUS: Record<string, string> = { in_production: "In production", discontinued: "Discontinued", vintage: "Vintage", unknown: "Availability unverified" };

export function ModelCard({ c, m }: { c: Catalog; m: SunglassesModel }) {
  const brand = c.brandById.get(m.brandId);
  const films = [...new Set(c.appsForModel(m.id).map((a) => c.movieById.get(a.movieId)?.title).filter(Boolean))];
  const { band, source } = c.priceBandOf(m);
  const lowest = c.lowestOffer(m.id);
  return (
    <Link href={`/sunglasses/${m.slug}`} className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-b from-paper to-[#efece4] p-6">
        <GlassesArt shape={m.shape} frame={m.frameColor} lens={m.lensColor} className="w-full max-w-[260px] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2" />
        <div className="absolute left-3 top-3"><MatchBadge type={c.modelMatch(m.id)} /></div>
        {m.status === "vintage" && <span className="absolute right-3 top-3 eyebrow">Vintage</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="eyebrow">{brand?.name}</p>
        <h3 className="font-display text-2xl font-semibold leading-tight">{m.name}</h3>
        {films.length > 0 && <p className="text-sm text-slate">As seen in {films.slice(0, 2).join(", ")}{films.length > 2 ? ` +${films.length - 2}` : ""}</p>}
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-slate">
          <span>{STATUS[m.status]}</span>
          <span className="font-medium text-ink">
            {lowest?.price != null ? `From $${lowest.price.toFixed(0)}` : band ? `${PRICE_BAND_LABEL[band]}${source === "editorial" ? " (est.)" : ""}` : "Price: see stores"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function MovieCard({ c, movie }: { c: Catalog; movie: Movie }) {
  const models = c.modelsForMovie(movie.id);
  const first = models[0];
  return (
    <Link href={`/movies/${movie.slug}`} className="card-lift group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-2xl border border-ink bg-ink p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(201,170,113,.35),transparent_60%)] opacity-70 transition-opacity group-hover:opacity-100" aria-hidden />
      <div className="relative">
        <p className="eyebrow !text-champagne">{movie.kind === "series" ? "TV series" : movie.genre} · {movie.year}</p>
        <h3 className="mt-3 font-display text-4xl font-semibold leading-[0.95]">{movie.title}</h3>
      </div>
      <div className="relative">
        {first && <GlassesArt shape={first.shape} frame={first.frameColor} lens={first.lensColor} className="mx-auto w-4/5 opacity-95 transition-transform duration-700 group-hover:scale-110" />}
        <p className="mt-3 text-xs uppercase tracking-widest text-white/60">{models.length} {models.length === 1 ? "model" : "models"}</p>
      </div>
    </Link>
  );
}

export function ActorCard({ c, actor }: { c: Catalog; actor: Actor }) {
  const initials = actor.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const films = c.moviesForActor(actor.id).length, models = c.modelsForActor(actor.id).length;
  return (
    <Link href={`/actors/${actor.slug}`} className="card-lift flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
      <span aria-hidden className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink font-display text-2xl text-champagne">{initials}</span>
      <span>
        <span className="block font-display text-2xl font-semibold leading-tight">{actor.name}</span>
        <span className="text-sm text-slate">{films} {films === 1 ? "title" : "titles"} · {models} {models === 1 ? "model" : "models"}</span>
      </span>
    </Link>
  );
}

export function BrandCard({ c, brand }: { c: Catalog; brand: Brand }) {
  const n = c.modelsForBrand(brand.id).length;
  return (
    <Link href={`/brands/${brand.slug}`} className="card-lift flex h-full flex-col rounded-2xl border border-line bg-white p-6">
      <p className="font-display text-3xl font-semibold">{brand.name}</p>
      <p className="mt-2 line-clamp-3 text-sm text-slate">{brand.description}</p>
      <p className="mt-auto pt-4 text-xs uppercase tracking-widest text-champagne-text">{n} {n === 1 ? "model" : "models"}</p>
    </Link>
  );
}

export function ArticleCard({ a, c }: { a: Article; c: Catalog }) {
  const model = a.modelIds.map((i) => c.modelById.get(i)).find(Boolean);
  return (
    <Link href={`/blog/${a.slug}`} className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex aspect-[16/9] items-center justify-center bg-ink p-6">
        {model ? <GlassesArt shape={model.shape} frame={model.frameColor} lens={model.lensColor} className="w-2/3 transition-transform duration-700 group-hover:scale-110" /> : <span className="font-display text-3xl text-champagne">Guide</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{a.category}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">{a.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate">{a.excerpt || a.answer}</p>
        <p className="mt-auto pt-4 text-xs text-mist">Updated {formatDate(a.updatedAt)}</p>
      </div>
    </Link>
  );
}

export function Grid({ children, cols = 3 }: { children: React.ReactNode; cols?: 2 | 3 | 4 }) {
  const map = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" } as const;
  return <div className={`grid grid-cols-1 gap-5 ${map[cols]}`}>{children}</div>;
}
