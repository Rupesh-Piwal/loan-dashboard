"use client";

import dynamic from "next/dynamic";
import { CircleNotch } from "@phosphor-icons/react";

// Dynamically import the map component with SSR disabled.
// Leaflet uses the window object which is undefined on the server.
const MapComponent = dynamic(() => import("./itinerary-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-accent/20 rounded-3xl border border-border/50">
      <CircleNotch className="w-8 h-8 animate-spin text-orange-500 mb-4" />
      <p className="text-muted-foreground text-sm font-medium">Loading interactive map...</p>
    </div>
  ),
});

interface MapWrapperProps {
  days: any[];
  activeDay?: number | null;
  flatActivities?: any[];
  activeActivityIndex?: number | null;
}

export default function MapWrapper({ days, activeDay, flatActivities, activeActivityIndex }: MapWrapperProps) {
  return <MapComponent days={days} activeDay={activeDay ?? null} flatActivities={flatActivities} activeActivityIndex={activeActivityIndex ?? null} />;
}
