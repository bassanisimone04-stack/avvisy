import Link from "next/link";
import { Leaf } from "lucide-react";
import { localeHref, type Locale } from "@/lib/i18n/locale";

export default function Logo({ className = "", locale = "it" }: { className?: string; locale?: Locale }) {
  return (
    <Link href={localeHref(locale, "/")} className={`flex items-center gap-2 ${className}`} aria-label="Mappa Senza Glutine, torna alla home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-solid text-white">
        <Leaf size={19} strokeWidth={2.2} />
      </span>
      <span className="font-display text-lg font-bold leading-none text-ink">
        Mappa<span className="text-brand"> Senza Glutine</span>
      </span>
    </Link>
  );
}
