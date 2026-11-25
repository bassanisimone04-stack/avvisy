import Link from "next/link";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

export function DemoBanner() {
  const t = useTranslations("Common");
  if (!siteConfig.demoMode) return null;
  return (
    <div className="bg-forest-deep text-[0.75rem] text-ivory/85">
      <div className="container-page flex items-center justify-center gap-2 py-2 text-center">
        <span className="inline-block size-1.5 shrink-0 rounded-full bg-clay" aria-hidden />
        <p>
          {t("demoBanner")}{" "}
          <Link href="/about-this-preview" className="underline underline-offset-2 hover:text-white">
            {t("demoBannerLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}
