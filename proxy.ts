import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Protected routes — require authentication.
 * If unauthenticated, redirect to /login.
 */
const protectedRoutes = ["/dashboard", "/generate", "/wishlist"];

/**
 * Auth routes — if already authenticated, redirect away.
 */
const authRoutes = ["/login"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Check if current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if current path is an auth route (login page)
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Protected route + no session → redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth route + has session → redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

/**
 * Matcher: run middleware on all routes except static files, images, and API internals.
 * Auth API routes (/api/auth/*) are explicitly excluded so OAuth callbacks work.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
