import { NextResponse, type NextRequest } from "next/server";
import { STATIC_REDIRECTS } from "@/config/redirects";

const LOCALES = ["en", "it"];
const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|webp|avif|ico|txt|xml|json|webmanifest|woff2?)$/i;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Redirect manager (301/410) — static list; DB-backed `redirects` table is applied by the same map at build/ISR.
  const r = STATIC_REDIRECTS[pathname];
  if (r) {
    if (r.status === 410) return new NextResponse("Gone", { status: 410, headers: { "X-Robots-Tag": "noindex" } });
    return NextResponse.redirect(new URL(r.to!, req.url), r.status);
  }
  if (
    pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/admin") || pathname.startsWith("/go/") ||
    pathname.startsWith("/sitemaps/") || pathname.startsWith("/images/") || PUBLIC_FILE.test(pathname)
  ) return NextResponse.next();
  const seg = pathname.split("/")[1];
  if (seg && LOCALES.includes(seg)) return NextResponse.next();
  const accept = req.headers.get("accept-language") ?? "";
  const locale = /^it\b|,\s*it\b/i.test(accept) && !/^en\b/i.test(accept) ? "it" : "en";
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "/" : pathname}`;
  return NextResponse.redirect(url, pathname === "/" ? 307 : 308);
}

export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
