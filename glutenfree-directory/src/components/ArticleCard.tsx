import Link from "next/link";
import { Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { blogCategoryLabel } from "@/lib/mock-articles";
import { getLocalizedArticle } from "@/lib/i18n/content-article";
import { getCategoryTheme } from "@/lib/blog-theme";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { blogCoverPhoto, recipeIllustration } from "@/lib/cover-photos";
import CoverPhoto from "./CoverPhoto";
import PlaceholderImage from "./PlaceholderImage";

export default function ArticleCard({ article, compact = false, locale = "it" }: { article: Article; compact?: boolean; locale?: Locale }) {
  const a = getLocalizedArticle(article, locale);
  const t = getDictionary(locale);
  const theme = getCategoryTheme(article.category);
  const illustration = recipeIllustration(a.coverSeed);
  const ratio = compact ? "aspect-[16/10]" : "aspect-[16/9]";
  const tint = { soft: theme.soft, accent: theme.accent, bg1: theme.soft, bg2: theme.soft };
  return (
    <Link href={localeHref(locale, `/blog/${article.slug}`)} className="card card-hover card-soft group flex flex-col overflow-hidden">
      <div className="relative">
        {illustration ? (
          <PlaceholderImage
            seed={a.coverSeed}
            variant={illustration}
            label={a.title}
            ratio={ratio}
            className="transition-transform duration-500 group-hover:scale-105"
            tint={tint}
          />
        ) : (
          <CoverPhoto
            photoUrl={blogCoverPhoto(article.category, a.coverSeed)}
            seed={a.coverSeed}
            variant="default"
            label={a.title}
            ratio={ratio}
            className="transition-transform duration-500 group-hover:scale-105"
            tint={tint}
          />
        )}
        <span className="chip absolute left-3 top-3 backdrop-blur" style={{ background: "rgba(255,255,255,0.9)", color: theme.accent }}>{blogCategoryLabel(a.category, locale)}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-serif text-lg font-semibold text-ink line-clamp-2">{a.title}</h3>
        {!compact && <p className="line-clamp-2 text-sm text-ink-soft">{a.excerpt}</p>}
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted">
          <span>{formatDate(a.publishedAt, locale)}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {a.readingTime} {t.common.minReadShort}</span>
        </div>
      </div>
    </Link>
  );
}
