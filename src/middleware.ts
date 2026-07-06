import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "avvisy_session";

/** Protegge l'area gestore: senza sessione si viene rimandati al login. */
export function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE);
  if (!session) {
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
