import { NextRequest, NextResponse } from "next/server";
import { verifySession, signSession, setSessionCookie, shouldRefresh } from "@/lib/auth/session";

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/book",
    "/grooming/book",
    "/boarding/book",
    "/api/admin/:path*",
    "/api/appointments/:path*",
    "/api/grooming-bookings/:path*",
    "/api/grooming-bookings",
    "/api/boarding-bookings/:path*",
    "/api/boarding-bookings",
  ],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env.SESSION_COOKIE_NAME ?? "ubasti_session")?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  const session = await verifySession(token);
  if (!session) {
    return redirectToLogin(req);
  }

  // Guard admin routes
  const path = req.nextUrl.pathname;
  if (
    (path.startsWith("/admin") || path.startsWith("/api/admin")) &&
    !session.isAdmin
  ) {
    // Redirect public requests; 403 for API
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Attach identity headers for route handlers
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-user-id", session.sub);
  reqHeaders.set("x-is-admin", String(session.isAdmin));

  const res = NextResponse.next({ request: { headers: reqHeaders } });

  // Sliding refresh
  if (shouldRefresh(session)) {
    const newToken = await signSession({ sub: session.sub, isAdmin: session.isAdmin });
    setSessionCookie(res, newToken);
  }

  return res;
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
