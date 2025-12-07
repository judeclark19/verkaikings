import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value; // Access token correctly

  // If no token is found, redirect to /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow request to continue if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/people/:path*",
    "/dashboard/:path*",
    "/notifcations/:path*",
    "/events/:path*",
    "/fundraiser/:path*",
    "/qanda/:path*"
  ] // Routes to protect
};
