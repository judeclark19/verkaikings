// app/api/getPlaceDetails/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const secret = req.headers.get("x-app-secret");
  const EXPECTED = process.env.NEXT_PUBLIC_APP_SECRET;
  if (secret !== EXPECTED) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");
  const language = searchParams.get("language") || "en";

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  // **Use a server‐only env var** so you’re never exposing this in client bundles
  const apiKey = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  // Call the HTTP/JSON Place Details endpoint:
  // https://developers.google.com/maps/documentation/places/web-service/details
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json"
  );
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("language", language);
  // only pull the fields you actually need:
  url.searchParams.set(
    "fields",
    "address_component,geometry,formatted_address"
  );
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      return NextResponse.json(
        { error: await response.text() },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Places fetch failed:", e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }
}
