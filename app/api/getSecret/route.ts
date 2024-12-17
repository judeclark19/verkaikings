import { NextResponse } from "next/server";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://verkaikings.netlify.app"] // Production URL
    : ["http://localhost:3000"]; // Development URL

export async function GET(req: Request) {
  const referer = req.headers.get("referer");

  if (
    !referer ||
    !allowedOrigins.some((origin) => referer.startsWith(origin))
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    sharedSecret: process.env.NEXT_PUBLIC_APP_SECRET
  });
}
