import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
    const { destination, photoUrl } = body;

    if (!destination || !photoUrl) {
      return NextResponse.json({ error: "Missing destination or photoUrl" }, { status: 400 });
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
        photoUrl,
        sortOrder: (lastItem?.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
