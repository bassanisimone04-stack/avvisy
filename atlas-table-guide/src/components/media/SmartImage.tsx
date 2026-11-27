import Image from "next/image";
import clsx from "clsx";
import manifest from "@/data/generated/image-manifest.json";

type M = { src: string; width: number; height: number; blurDataURL: string; illustrative: boolean };
const MAN = manifest as Record<string, M>;

export function imageSrc(key: string): M {
  return MAN[key] ?? { src: key.startsWith("/") || key.startsWith("http") ? key : `/images/generated/${key}.webp`, width: 1200, height: 900, blurDataURL: "", illustrative: false };
}

/**
 * next/image wrapper: responsive sizes, blur-up, lazy by default, `priority` for LCP images.
 * `alt` is REQUIRED (pass "" only for decorative images). Shows an "Illustrative image" label when asked.
 */
export function SmartImage({ imageKey, alt, sizes, priority, className, imgClassName, ratio, label, rounded = true }: {
  imageKey: string; alt: string; sizes: string; priority?: boolean; className?: string; imgClassName?: string; ratio?: string; label?: string; rounded?: boolean;
}) {
  const m = imageSrc(imageKey);
  return (
    <div className={clsx("relative overflow-hidden bg-sand", rounded && "rounded-[12px]", className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      <Image
        src={m.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={priority ? 60 : 75}
        fetchPriority={priority ? "high" : undefined}
        placeholder={m.blurDataURL && !priority ? "blur" : "empty"}
        blurDataURL={m.blurDataURL && !priority ? m.blurDataURL : undefined}
        className={clsx("zoom object-cover", imgClassName)}
      />
      {label && m.illustrative && (
        <span className="pointer-events-none absolute bottom-2 left-2 rounded-[4px] bg-ink/70 px-1.5 py-0.5 text-[11px] font-medium text-white">{label}</span>
      )}
    </div>
  );
}
