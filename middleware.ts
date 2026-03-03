import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { cookies, nextUrl } = req;
  const token = cookies.get("sb:token")?.value;
  const url = nextUrl.clone();

  // allow auth routes
  if (url.pathname.startsWith("/login")) {
    if (token) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // for other routes, require token
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
