import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["it", "en"];
const SKIP = /^\/(_next|assets|api)\b|\.(?:svg|png|jpg|jpeg|webp|avif|ico|txt|xml|json|woff2?)$/i;

/** `/` and any path without a language prefix go to the Italian site, as on the original static site. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (SKIP.test(pathname)) return NextResponse.next();
  const first = pathname.split("/")[1];
  if (first && LOCALES.includes(first)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/it${pathname === "/" ? "/" : pathname}`;
  return NextResponse.redirect(url, pathname === "/" ? 307 : 308);
}
export const config = { matcher: ["/((?!_next/static|_next/image).*)"] };
