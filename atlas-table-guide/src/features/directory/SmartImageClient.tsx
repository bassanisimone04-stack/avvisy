"use client";
import Image from "next/image";
import clsx from "clsx";
import manifest from "@/data/generated/image-manifest.json";

const MAN = manifest as Record<string, { src: string; blurDataURL: string }>;
export function SmartImageClient({ imageKey, alt, className }: { imageKey: string; alt: string; className?: string }) {
  const m = MAN[imageKey] ?? { src: `/images/generated/${imageKey}.webp`, blurDataURL: "" };
  return (
    <div className={clsx("relative overflow-hidden rounded-[8px] bg-sand", className)}>
      <Image src={m.src} alt={alt} fill sizes="112px" className="object-cover" placeholder={m.blurDataURL ? "blur" : "empty"} blurDataURL={m.blurDataURL || undefined} />
    </div>
  );
}
