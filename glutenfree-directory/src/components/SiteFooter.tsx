"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Instagram, Facebook, Twitter } from "lucide-react";
import { CATEGORIES, categoryLabelPlural } from "@/lib/categories";
import { BLOG_CATEGORIES, blogCategoryLabel } from "@/lib/mock-articles";
import { slugify } from "@/lib/format";
import { SITE_NAME } from "@/lib/site-config";
import { useDictionary } from "@/lib/i18n/useLocale";
import { localeHref } from "@/lib/i18n/locale";
import NewsletterForm from "./NewsletterForm";

export default function SiteFooter() {
  const pathname = usePathname();
  const { locale, t } = useDictionary();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="section-dark mt-16">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Link href={localeHref(locale, "/")} className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-solid text-white">
                <Leaf size={19} />
              </span>
              <span className="font-display text-lg font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">{t.footer.description}</p>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><Instagram size={16} /></a>
              <a href="https://facebook.com" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><Facebook size={16} /></a>
              <a href="https://twitter.com" aria-label="Twitter/X" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><Twitter size={16} /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">{t.footer.categories}</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}><Link href={localeHref(locale, `/directory?categoria=${c.slug}`)} className="hover:text-white">{categoryLabelPlural(c, locale)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">{t.footer.blog}</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {BLOG_CATEGORIES.slice(0, 6).map((c) => (
                <li key={c}><Link href={localeHref(locale, `/blog?categoria=${slugify(c)}`)} className="hover:text-white">{blogCategoryLabel(c, locale)}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">{t.footer.company}</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href={localeHref(locale, "/chi-siamo")} className="hover:text-white">{t.footer.about}</Link></li>
              <li><Link href={localeHref(locale, "/contatti")} className="hover:text-white">{t.footer.contact}</Link></li>
              <li><Link href={localeHref(locale, "/per-le-aziende")} className="hover:text-white">{t.footer.addBusiness}</Link></li>
              <li><Link href={localeHref(locale, "/privacy")} className="hover:text-white">{t.footer.privacy}</Link></li>
              <li><Link href={localeHref(locale, "/cookie")} className="hover:text-white">{t.footer.cookie}</Link></li>
              <li><Link href={localeHref(locale, "/termini")} className="hover:text-white">{t.footer.terms}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">{t.footer.newsletter}</h3>
            <p className="mb-3 text-sm text-white/60">{t.footer.newsletterBlurb}</p>
            <NewsletterForm dark />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. {t.footer.rights}</p>
          <p>{t.footer.demoNote}</p>
        </div>
      </div>
    </footer>
  );
}
