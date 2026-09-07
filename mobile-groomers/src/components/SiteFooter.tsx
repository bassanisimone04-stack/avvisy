import Link from "next/link";
import { FEATURED_CITIES, SITE_NAME } from "@/lib/site-config";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-navy text-slate-200">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-extrabold text-white">{SITE_NAME}</div>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            The US directory for van-based, at-home dog &amp; cat grooming.
            Compare mobile groomers by zip code and book stress-free care.
          </p>
        </div>

        <nav aria-label="Popular locations">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Popular Locations
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {FEATURED_CITIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/cities/${c.slug}`} className="text-slate-300 hover:text-teal">
                  Mobile Groomers in {c.city}, {c.state}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="For groomers">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            For Groomers
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/claim" className="text-slate-300 hover:text-teal">Claim Your Listing</Link></li>
            <li><Link href="/pricing" className="text-slate-300 hover:text-teal">Pricing Plans</Link></li>
            <li><Link href="/for-groomers" className="text-slate-300 hover:text-teal">Groomer Resources</Link></li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/blog" className="text-slate-300 hover:text-teal">Blog</Link></li>
            <li><Link href="/about" className="text-slate-300 hover:text-teal">About</Link></li>
            <li><Link href="/privacy" className="text-slate-300 hover:text-teal">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-slate-300 hover:text-teal">Terms of Service</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {SITE_NAME}. All rights reserved.</p>
          <p>
            Listings are informational only. Verify licensing, insurance, and pricing directly with each business.
          </p>
        </div>
      </div>
    </footer>
  );
}
