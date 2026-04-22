"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deductCredits } from "@/lib/credits";


import { initiateItineraryGeneration } from "@/lib/itinerary/service";
import { Vibe, Budget } from "../../generated/prisma/client";

export async function generateItinerary(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const destination = formData.get("destination") as string;
  const days = parseInt(formData.get("duration") as string);
  const budgetStr = formData.get("budget") as string;
  const vibeStr = formData.get("vibe") as string;

  // Simple mapping
  const budgetMap: Record<string, Budget> = {
    "Budget": Budget.BUDGET,
    "Mid-Range": Budget.MID,
    "Luxury": Budget.LUXURY
  };

  const vibeMap: Record<string, Vibe> = {
    "Adventure": Vibe.ADVENTURE,
    "Foodie": Vibe.FOODIE,
    "Cultural": Vibe.CULTURAL,
    "Relaxation": Vibe.RELAXED,
    "Romantic": Vibe.RELAXED,
    "Photography": Vibe.CULTURAL
  };

  const budget = budgetMap[budgetStr] || Budget.MID;
  const vibe = vibeMap[vibeStr] || Vibe.ADVENTURE;

  try {
    const itinerary = await initiateItineraryGeneration({
      userId,
      destination,
      days,
      vibe,
      budget,
    });

    return { success: true, id: itinerary.id };
  } catch (error: any) {
    console.error("Initiating generation failed:", error);
    
    if (error.message === "Insufficient credits") {
      return { success: false, error: "INSUFFICIENT_CREDITS" };
    }

    return { success: false, error: "GENERIC_ERROR" };
  }
}


