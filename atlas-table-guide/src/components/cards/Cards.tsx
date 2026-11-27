import Link from "next/link";
import clsx from "clsx";
import { SmartImage } from "@/components/media/SmartImage";

/** Generic editorial photo card: image on top, text BELOW (never overlaid). Whole card is one link. */
export function PhotoCard({ href, imageKey, alt, title, subtitle, ratio = "4 / 3", sizes, meta, badge, priority, titleAs: T = "h3", className, illustrativeLabel }: {
  href: string; imageKey: string; alt: string; title: string; subtitle?: string; ratio?: string; sizes: string; meta?: React.ReactNode; badge?: React.ReactNode; priority?: boolean; titleAs?: "h2" | "h3"; className?: string; illustrativeLabel?: string;
}) {
  return (
    <article className={clsx("card-lift relative", className)}>
      <div className="relative">
        <SmartImage imageKey={imageKey} alt={alt} ratio={ratio} sizes={sizes} priority={priority} label={illustrativeLabel} />
        {badge && <div className="absolute left-2 top-2">{badge}</div>}
      </div>
      <T className="mt-3 font-sans text-base font-bold leading-snug">
        <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:underline">{title}</Link>
      </T>
      {subtitle && <p className="text-sm text-stone">{subtitle}</p>}
      {meta && <div className="mt-1 text-sm">{meta}</div>}
    </article>
  );
}
