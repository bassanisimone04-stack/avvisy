import Image from "next/image";

/** Optimised photo in a fixed-ratio frame (ratio and radius come from the surrounding CSS). */
export function Photo({ name, alt = "", priority = false, sizes = "(min-width: 1100px) 380px, (min-width: 661px) 33vw, 100vw" }: { name: string; alt?: string; priority?: boolean; sizes?: string }) {
  return (
    <span className="photo">
      <Image src={`/assets/${name}.webp`} alt={alt} fill sizes={sizes} priority={priority} quality={75} />
    </span>
  );
}
