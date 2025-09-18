import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  role?: string;
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // если токена нет → всегда редиректим на /login
  if (!token) {
    if (req.nextUrl.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    // токен протух → удаляем cookie и редиректим
    if (token) {
      try {
        const payload = jwtDecode<JwtPayload>(token);

        if (!payload.exp || Date.now() >= payload.exp * 1000) {
          const res = NextResponse.redirect(new URL("/login", req.url));
          res.cookies.delete("token");
          return res;
        }

        // ⚡️ если токен валидный и пользователь идёт на /login → редиректим на /
        if (req.nextUrl.pathname === "/login") {
          return NextResponse.redirect(new URL("/", req.url));
        }

        // проверка роли для /admin
        if (req.nextUrl.pathname.startsWith("/admin") && payload.role !== "admin") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } catch (e) {
        console.error("Ошибка разбора токена:", e);
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete("token");
        return res;
      }
    }


    return NextResponse.next();
  }

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
