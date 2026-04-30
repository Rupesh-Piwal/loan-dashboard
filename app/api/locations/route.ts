import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return NextResponse.json({ features: [] });
  }

  // 1. Try Photon (Fast, designed for autocomplete)
  try {
    const response = await fetchWithTimeout(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.warn("Photon API failed or timed out, trying fallback...", error);
  }

  // 2. Fallback to Nominatim (OpenStreetMap standard)
  try {
    const fallbackResponse = await fetchWithTimeout(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
      {
        headers: {
          "User-Agent": "NomadGo-Travel-App", // Nominatim requires a user-agent
        },
      },
      5000 // 5 second timeout for fallback
    );

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      
      // Normalize Nominatim data to Photon format
      const features = data.map((item: any) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
        },
        properties: {
          name: item.display_name.split(",")[0],
          city: item.address?.city || item.address?.town || item.address?.village,
          country: item.address?.country,
          state: item.address?.state,
        },
      }));

      return NextResponse.json({ features });
    }
  } catch (error) {
    console.error("All geocoding services failed:", error);
  }

  // If everything fails, return an empty list instead of a 500
  return NextResponse.json({ features: [] });
}
