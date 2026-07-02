import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, isValidSessionToken } from "@/features/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = await isValidSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (pathname === "/login") {
    if (authenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
