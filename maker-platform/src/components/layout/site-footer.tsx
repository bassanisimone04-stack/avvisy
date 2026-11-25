import Link from "next/link";
import { useTranslations } from "next-intl";
import { footerNav, legalNav } from "@/config/navigation";
import { locales } from "@/config/markets";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";

export function SiteFooter() {
  const t = useTranslations("Footer");
  return (
    <footer className="mt-24 bg-forest text-ivory/80 md:mt-32">
      <div className="container-page pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div className="max-w-sm">
            <Logo tone="ivory" />
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ivory/70">{t("tagline")}</p>
            <div className="mt-8">
              <label htmlFor="locale-select" className="mb-2 block text-[0.6875rem] font-semibold tracking-[0.14em] text-ivory/70 uppercase">
                {t("language")}
              </label>
              <select
                id="locale-select"
                defaultValue="en-US"
                className="h-10 w-56 rounded-sm border border-ivory/20 bg-forest-deep px-3 text-sm text-ivory"
                aria-describedby="locale-note"
              >
                {locales.map((l) => (
                  <option key={l.code} value={l.code} disabled={l.status !== "active"}>
                    {l.label}
                    {l.status !== "active" ? " — planned" : ""}
                  </option>
                ))}
              </select>
              <p id="locale-note" className="mt-2 max-w-xs text-xs leading-relaxed text-ivory/70">
                {t("languageNote")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h2 className="mb-4 font-sans text-[0.6875rem] font-semibold tracking-[0.14em] text-ivory/70 uppercase">{col.title}</h2>
                <ul className="space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-underline text-ivory/80 hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/12 pt-6 text-xs text-ivory/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {siteConfig.name}. {t("rights")} <span className="text-ivory/60">·</span> {t("legalDraft")}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
