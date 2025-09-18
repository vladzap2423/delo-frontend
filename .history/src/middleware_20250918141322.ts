import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
  role?: string;
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 1. Нет токена → пускаем только на /login
  if (!token) {
    if (pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    // 2. Токен протух → удаляем cookie и редиректим на /login
    if (!payload.exp || Date.now() >= payload.exp * 1000) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }

    // 3. Авторизован и идёт на /login → редиректим на /
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 4. Проверка роли для /admin
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (e) {
    console.error("Ошибка разбора токена:", e);
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }

  // 5. Всё ок → пускаем дальше
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
У меня такое ошушени