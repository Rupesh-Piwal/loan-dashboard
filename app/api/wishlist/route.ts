import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { fetchUnsplashImage } from "@/lib/unsplash";

// GET: Fetch all wishlist items for the authenticated user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add a new wishlist item
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { destination, photoUrl } = body;

    if (!destination) {
      return NextResponse.json({ error: "Missing destination" }, { status: 400 });
    }

    // Enhance photoUrl if it's generic, missing, or a low-res fallback
    const isGeneric = !photoUrl || 
                      photoUrl.includes("photo-1500530855697-b586d89ba3ee") || 
                      photoUrl.includes("photo-1469854523086-cc02fe5d8800");

    if (isGeneric) {
      try {
        const dynamicImage = await fetchUnsplashImage(destination);
        if (dynamicImage) {
          photoUrl = dynamicImage;
        }
      } catch (err) {
        console.error("Failed to fetch dynamic image for wishlist:", err);
        // Keep original photoUrl if fetch fails
      }
    }

    // Get the highest sortOrder to append at end
    const lastItem = await prisma.wishlistItem.findFirst({
      where: { userId: session.user.id },
      orderBy: { sortOrder: "desc" },
    });

    const newItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        destination,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
        sortOrder: (lastItem?.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
