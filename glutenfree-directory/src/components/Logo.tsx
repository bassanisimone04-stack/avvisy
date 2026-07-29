import Link from "next/link";
import BrandLeaf from "./BrandLeaf";
import { localeHref, type Locale } from "@/lib/i18n/locale";

export default function Logo({ className = "", locale = "it" }: { className?: string; locale?: Locale }) {
  return (
    <Link href={localeHref(locale, "/")} className={`flex items-center gap-2 ${className}`} aria-label="Mappa Senza Glutine, torna alla home">
      <BrandLeaf size={34} />
      <span className="font-display text-lg font-bold leading-none text-ink">
        Mappa<span className="text-brand"> Senza Glutine</span>
      </span>
    </Link>
  );
}
