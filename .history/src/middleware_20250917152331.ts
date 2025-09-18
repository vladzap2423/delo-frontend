import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // если токен кладёшь в cookie

  // Если нет токена и не /login → редиректим на /login
  if (!token && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Если есть токен и идём на /login → редиректим на главную
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// где проверять
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"],
};
