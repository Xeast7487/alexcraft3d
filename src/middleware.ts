import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/suivi", "/api/login", "/api/devis"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/suivi") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/devis") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/manifest") ||
    /\.(jpg|jpeg|png|svg|ico|webp|webmanifest|json)$/.test(pathname);

  if (isPublic) return NextResponse.next();

  const auth = req.cookies.get("ac3d_auth")?.value;
  if (!auth) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
