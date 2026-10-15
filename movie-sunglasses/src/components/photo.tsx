import type { Photo } from "@/lib/types";
import { LICENSE_LABEL } from "@/lib/photos";

/** An approved photograph with its required credit line. Fixed aspect box so it never shifts the layout. */
export function Figure({ photo, ratio = "16/9", fit = "cover", priority = false, className = "" }: { photo: Photo; ratio?: string; fit?: "cover" | "contain"; priority?: boolean; className?: string }) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl bg-line/40" style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={photo.alt} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} referrerPolicy="no-referrer" className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`} />
      </div>
      <figcaption className="mt-2 text-xs text-mist">
        Photo: {photo.credit} · {LICENSE_LABEL[photo.license] ?? photo.license}
        {photo.licenseUrl && <> · <a className="underline" href={photo.licenseUrl} rel="nofollow noopener noreferrer" target="_blank">rights<span className="sr-only"> (opens in new tab)</span></a></>}
      </figcaption>
    </figure>
  );
}
