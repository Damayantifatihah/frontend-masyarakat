import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const protectedRoutes =
    pathname.startsWith("/user") ||
    pathname.startsWith("/admin");

  const authRoutes =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  // ❌ belum login
  if (!token && protectedRoutes) {
    return NextResponse.redirect(
      new URL("/auth/login", req.url)
    );
  }

  // ✅ sudah login
  if (token && authRoutes) {
    return NextResponse.redirect(
      new URL("/user", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};