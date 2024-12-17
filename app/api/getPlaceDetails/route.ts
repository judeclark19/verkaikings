// app/api/getPlaceDetails/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const secret = req.headers.get("x-app-secret");

  if (secret !== process.env.NEXT_PUBLIC_APP_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 } // Return a 401 Unauthorized status
    );
  }

  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");
  const language = searchParams.get("language") || "en";

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&language=${language}&key=${apiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch place details:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}
