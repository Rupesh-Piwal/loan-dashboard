import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET: Fetch all itineraries for the authenticated user
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const itineraries = await prisma.itinerary.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      destination: true,
      days: true,
      budget: true,
      vibe: true,
      status: true,
      createdAt: true,
      lastUsedAt: true,
    },
  });

  return NextResponse.json(itineraries);
}
