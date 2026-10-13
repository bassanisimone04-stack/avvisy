import Link from "next/link";
import { SITE_NAME } from "@/lib/site-config";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-teal">
            🐾
          </span>
          {SITE_NAME}
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-ink-soft md:flex">
          <Link href="/cities" className="hover:text-navy">Browse Cities</Link>
          <Link href="/pricing" className="hover:text-navy">For Groomers</Link>
          <Link href="/faq" className="hover:text-navy">FAQ</Link>
          <Link href="/blog" className="hover:text-navy">Blog</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/claim" className="btn btn-outline btn-sm hidden sm:inline-flex">
            List Your Business
          </Link>
          <Link href="/pricing" className="btn btn-primary btn-sm">
            Claim Listing
          </Link>
        </div>
      </div>
    </header>
  );
}
