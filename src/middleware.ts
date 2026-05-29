import { withAuth } from "next-auth/middleware";

import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: any) {
    const token =
      req.nextauth.token;

    const pathname =
      req.nextUrl.pathname;

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
      // SUPERADMIN
      if (
        token.role ===
        "superadmin"
      ) {
        return NextResponse.redirect(
          new URL(
            "/superadmin/dashboard",
            req.url
          )
        );
      }

      // ADMIN
      if (
        token.role === "admin"
      ) {
        return NextResponse.redirect(
          new URL(
            "/admin/dashboard",
            req.url
          )
        );
      }

      // USER
      return NextResponse.redirect(
        new URL("/user", req.url)
      );
    }

    // =========================
    // USER PROTECTION
    // =========================

    if (
      token?.role ===
        "user" &&
      (isAdminRoute ||
        isSuperAdminRoute)
    ) {
      return NextResponse.redirect(
        new URL("/user", req.url)
      );
    }

    // =========================
    // ADMIN PROTECTION
    // =========================

    if (
      token?.role ===
        "admin" &&
      (isUserRoute ||
        isSuperAdminRoute)
    ) {
      return NextResponse.redirect(
        new URL(
          "/admin/dashboard",
          req.url
        )
      );
    }

    // =========================
    // SUPERADMIN PROTECTION
    // =========================

    if (
      token?.role ===
        "superadmin" &&
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
  },

  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/user/:path*",

    "/admin/:path*",

    "/superadmin/:path*",

    "/auth/login",

    "/auth/register",
  ],
};