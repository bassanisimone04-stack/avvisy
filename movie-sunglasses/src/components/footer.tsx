import Link from "next/link";
import { SITE } from "@/lib/site";
import { ManageCookiesButton } from "./consent";

export function Footer() {
  return (
    <footer className="on-dark mt-28 bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-semibold text-white">Screen<span className="text-champagne">shade</span></p>
          <p className="mt-3 max-w-md text-sm leading-relaxed">{SITE.description}</p>
          <p className="mt-5 max-w-md text-xs leading-relaxed text-white/50">
            Affiliate disclosure: some outbound links to stores may earn us a commission at no extra cost to you. Identification labels follow our published evidence rules, never commission rates. See <Link className="underline" href="/affiliate-disclosure">Affiliate Disclosure</Link>.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-sm">
            {[["/movies", "Movies & TV"], ["/actors", "Actors"], ["/sunglasses", "All sunglasses"], ["/brands", "Brands"], ["/styles", "Styles"], ["/affordable-alternatives", "Affordable alternatives"], ["/vintage", "Vintage & rare"], ["/blog", "Guides"]].map(([h, l]) => <li key={h}><Link className="hover:text-white hover:underline" href={h}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Company</p>
          <ul className="space-y-2 text-sm">
            {[["/about", "About & methodology"], ["/contact", "Contact"], ["/privacy-policy", "Privacy Policy"], ["/cookie-policy", "Cookie Policy"], ["/terms", "Terms of Use"], ["/affiliate-disclosure", "Affiliate Disclosure"]].map(([h, l]) => <li key={h}><Link className="hover:text-white hover:underline" href={h}>{l}</Link></li>)}
            <li><ManageCookiesButton /></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/40 sm:px-8">
        © {new Date().getFullYear()} {SITE.name}. All trademarks belong to their owners. Not affiliated with any film studio or eyewear brand mentioned.
      </div>
    </footer>
  );
}
