import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/profile", "/me"];
const supabaseCookiePrefix = "sb-";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });
  const hasSupabaseSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith(supabaseCookiePrefix));

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) && !hasSupabaseSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
