import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { inter } from "./fonts";
import { BRAND } from "@/config/brand";
import { Logo } from "@/components/Logo";
import { cities } from "@/data/demo/geo";
import { getDict } from "@/i18n";

export const metadata: Metadata = { title: `Page not found | ${BRAND.name}`, robots: { index: false, follow: true } };

/** Global 404 for URLs that match no route (root layout lives under the dynamic [locale] segment). */
export default function GlobalNotFound() {
  const dict = getDict("en");
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-ivory text-ink antialiased">
        <header className="on-dark bg-carmine text-ivory"><div className="container-page flex h-[var(--header-h)] items-center"><Link href="/en/" aria-label={BRAND.name}><Logo variant="light" /></Link></div></header>
        <main id="main" className="container-page py-20 text-center">
          <p className="eyebrow">404</p>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl">{dict.notFound.title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-stone">{dict.notFound.body}</p>
          <form action="/en/restaurants/" method="get" role="search" className="mx-auto mt-8 flex max-w-lg gap-2">
            <label htmlFor="gnf-q" className="sr-only">{dict.search.placeholder}</label>
            <input id="gnf-q" name="q" type="search" placeholder={dict.search.placeholder} className="min-h-11 flex-1 rounded-[8px] border border-line bg-white px-3" />
            <button type="submit" className="min-h-11 rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white">{dict.nav.search}</button>
          </form>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">{cities.map((c) => <li key={c.slug}><Link className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3 text-sm hover:border-carmine" href={`/en/restaurants/${c.countrySlug}/${c.slug}/`}>{c.name.en}</Link></li>)}</ul>
          <Link href="/en/" className="mt-8 inline-block font-semibold text-carmine underline-offset-4 hover:underline">{dict.notFound.home}</Link>
        </main>
      </body>
    </html>
  );
}
