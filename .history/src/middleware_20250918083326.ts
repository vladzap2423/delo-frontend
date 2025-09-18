import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  role?: string;
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // если нет токена и не /login → редиректим на /login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      console.log(Э)

      // проверяем exp
      if (!payload.exp || Date.now() >= payload.exp * 1000) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // если токен есть и идём на /login → редиректим на /
      if (req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // проверка роли для /admin
      if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (e) {
      console.error("Ошибка разбора токена:", e);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
