import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ItineraryViewClient from "@/app/components/itinerary/itinerary-view-client";

interface Activity {
  title: string;
  description: string;
  image: string | null;
  lat: number;
  lng: number;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface ItineraryData {
  destination: string;
  days: Day[];
}

export default async function ItineraryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const itinerary = await prisma.itinerary.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!itinerary || !itinerary.data) {
    notFound();
  }

  const destination = await prisma.destination.findUnique({
    where: { name: itinerary.destination }
  });

  const data = itinerary.data as unknown as ItineraryData;
  const heroImage = destination?.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop";

  return (
    <ItineraryViewClient
      itinerary={{
        id: resolvedParams.id,
        destination: itinerary.destination,
        vibe: itinerary.vibe,
        budget: itinerary.budget,
        days: itinerary.days,
      }}
      data={data}
      heroImage={heroImage}
    />
  );
}
