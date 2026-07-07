import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "avvisy_session";

/** Protegge l'area gestore: senza sessione si viene rimandati al login.
 * Accetta la sessione demo (cookie avvisy_session) oppure quella reale di
 * Supabase (cookie sb-...-auth-token). Nessuna chiamata di rete: solo cookie. */
export function middleware(req: NextRequest) {
  const hasDemo = !!req.cookies.get(SESSION_COOKIE);
  const hasSupabase = req.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));

  if (!hasDemo && !hasSupabase) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
