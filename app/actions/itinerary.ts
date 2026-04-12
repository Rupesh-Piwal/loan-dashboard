"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deductCredits } from "@/lib/credits";
import { redirect } from "next/navigation";

export async function generateItinerary(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const destination = formData.get("destination") as string;
  const days = parseInt(formData.get("duration") as string);
  const budget = formData.get("budget") as string;
  // Vibes are handled separately in real app, simplified here
  
  // STEP 7: Protect usage
  await deductCredits(userId, 1);

  // Simulate generation and DB creation
  const itinerary = await prisma.itinerary.create({
    data: {
      userId,
      destination,
      days,
      budget: budget.toUpperCase() as "BUDGET" | "MID" | "LUXURY", // Map string to enum
      vibe: "ADVENTURE", // Placeholder
      status: "QUEUED",
    },
  });

  redirect(`/dashboard/itinerary/${itinerary.id}`);
}
