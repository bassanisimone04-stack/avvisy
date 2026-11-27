import Link from "next/link";
import { getDict } from "@/i18n";
import { Chip } from "@/components/ui/ui";
import { SearchIcon } from "@/components/ui/icons";
import { cities } from "@/data/demo/geo";

/** Branded 404. Synchronous on purpose so it renders in the server HTML shell. */
export default function NotFound() {
  const locale = "en" as const; // not-found receives no params
  const dict = getDict(locale);
  return (
    <div className="container-page py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-2xl md:text-3xl">{dict.notFound.title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-stone">{dict.notFound.body}</p>
      <form action={`/${locale}/restaurants/`} method="get" role="search" className="mx-auto mt-8 flex max-w-lg gap-2">
        <label htmlFor="nf-q" className="sr-only">{dict.search.placeholder}</label>
        <input id="nf-q" name="q" type="search" placeholder={dict.search.placeholder} className="min-h-11 flex-1 rounded-[8px] border border-line bg-white px-3" />
        <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-[8px] bg-carmine px-4 text-sm font-semibold text-white"><SearchIcon size={16} />{dict.nav.search}</button>
      </form>
      <p className="mt-8 eyebrow">{dict.directory.suggestions}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">{cities.map((c) => <li key={c.slug}><Chip href={`/${locale}/restaurants/${c.countrySlug}/${c.slug}/`}>{c.name.en}</Chip></li>)}</ul>
      <Link href={`/${locale}/`} className="mt-8 inline-block font-semibold text-carmine underline-offset-4 hover:underline">{dict.notFound.home}</Link>
    </div>
  );
}
