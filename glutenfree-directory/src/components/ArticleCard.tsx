import Link from "next/link";
import { Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDateIt } from "@/lib/format";
import PlaceholderImage from "./PlaceholderImage";

export default function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <Link href={`/blog/${article.slug}`} className="card card-hover card-soft group flex flex-col overflow-hidden">
      <div className="relative">
        <PlaceholderImage seed={article.coverSeed} variant="default" label={article.title} ratio={compact ? "aspect-[16/10]" : "aspect-[16/9]"} className="transition-transform duration-500 group-hover:scale-105" />
        <span className="chip chip-accent absolute left-3 top-3 bg-white/90 backdrop-blur">{article.category}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold text-ink line-clamp-2">{article.title}</h3>
        {!compact && <p className="line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>}
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted">
          <span>{formatDateIt(article.publishedAt)}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {article.readingTime} min</span>
        </div>
      </div>
    </Link>
  );
}
