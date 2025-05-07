import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login";
  
  const token = request.cookies.get("user")?.value || "";
  
  // Redirect to login if accessing protected route without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // Redirect to dashboard if accessing login with token
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

// Only run middleware on these paths
export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};