import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(
  req: NextRequest
) {
  const token =
    req.cookies.get("token")
      ?.value;

  const role =
    req.cookies.get("role")
      ?.value;

  const { pathname } =
    req.nextUrl;

  // =========================
  // ROUTES
  // =========================

  const isUserRoute =
    pathname.startsWith(
      "/user"
    );

  const isAdminRoute =
    pathname.startsWith(
      "/admin"
    );

  const isSuperAdminRoute =
    pathname.startsWith(
      "/superadmin"
    );

  const isAuthRoute =
    pathname.startsWith(
      "/auth/login"
    ) ||
    pathname.startsWith(
      "/auth/register"
    );

  // =========================
  // BELUM LOGIN
  // =========================

  if (
    !token &&
    (isUserRoute ||
      isAdminRoute ||
      isSuperAdminRoute)
  ) {
    return NextResponse.redirect(
      new URL(
        "/auth/login",
        req.url
      )
    );
  }

  // =========================
  // SUDAH LOGIN
  // =========================

  if (token && isAuthRoute) {
    // redirect sesuai role

    if (role === "admin") {
      return NextResponse.redirect(
        new URL(
          "/admin/dashboard",
          req.url
        )
      );
    }

    if (
      role === "superadmin"
    ) {
      return NextResponse.redirect(
        new URL(
          "/superadmin/dashboard",
          req.url
        )
      );
    }

    return NextResponse.redirect(
      new URL("/user", req.url)
    );
  }

  // =========================
  // ROLE PROTECTION
  // =========================

  // USER buka admin
  if (
    role === "user" &&
    (isAdminRoute ||
      isSuperAdminRoute)
  ) {
    return NextResponse.redirect(
      new URL("/user", req.url)
    );
  }

  // ADMIN buka user
  if (
    role === "admin" &&
    (isUserRoute ||
      isSuperAdminRoute)
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin",
        req.url
      )
    );
  }

  // SUPERADMIN buka selain superadmin
  if (
    role === "superadmin" &&
    (isUserRoute ||
      isAdminRoute)
  ) {
    return NextResponse.redirect(
      new URL(
        "/superadmin/dashboard",
        req.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};