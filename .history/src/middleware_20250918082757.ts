
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // если нет токена и не на /login → редиректим на /login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // если токен есть и идём на /login → редиректим на /
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
