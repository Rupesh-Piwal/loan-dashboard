"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Map as MapIcon,
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import MapWrapper from "@/app/components/itinerary/map-wrapper";
import ExportPdfButton from "@/app/components/itinerary/export-pdf-button";
import AnimatedActivityCard from "@/app/components/itinerary/animated-activity-card";

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

interface ItineraryViewClientProps {
  itinerary: {
    id: string;
    destination: string;
    vibe: string;
    budget: string;
    days: number;
  };
  data: ItineraryData;
  heroImage: string;
}

/**
 * Collect up to 3 photos from a day's activities for the photo grid.
 */
function getDayPhotos(day: Day): string[] {
  return day.activities
    .map((a) => a.image)
    .filter((img): img is string => !!img)
    .slice(0, 3);
}

export default function ItineraryViewClient({
  itinerary,
  data,
  heroImage,
}: ItineraryViewClientProps) {
  const [activeDay, setActiveDay] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto pb-32 px-4 md:px-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="rounded-2xl gap-3 text-muted-foreground hover:text-foreground hover:bg-accent/40 px-6 h-12 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">
              Return to Dashboard
            </span>
          </Button>
        </Link>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="rounded-2xl border-border/60 gap-3 px-6 h-12 font-bold text-sm shadow-sm transition-all hover:bg-accent/40 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            Share Trip
          </Button>
          <ExportPdfButton itineraryId={itinerary.id} />
        </div>
      </div>

      {/* Condensed Hero Section — full width above the split */}
      <section className="relative h-[260px] md:h-[300px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] group print:rounded-none print:h-auto print:mb-8 mb-10">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-[12s] ease-in-out"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-x-6 bottom-6 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            <Badge className="bg-orange-600/20 text-orange-400 border border-orange-500/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              {itinerary.vibe} Exploration
            </Badge>
            <h1 className="text-5xl md:text-6xl font-serif font-black text-white tracking-tighter leading-[0.9] drop-shadow-xl">
              {itinerary.destination}
            </h1>
          </div>
          <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/[0.05] backdrop-blur-[24px] border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Calendar className="w-4 h-4 text-orange-500" />
              {itinerary.days} Days
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
              <Sparkles className="w-4 h-4 text-orange-500" />
              {itinerary.budget}
            </div>
          </div>
        </div>
      </section>

      {/* ===== WANDERLOG-STYLE SPLIT: Timeline LEFT, Map RIGHT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative items-start">
        {/* LEFT COLUMN: Scrollable Timeline */}
        <div className="lg:col-span-7 space-y-12 order-2 lg:order-1">
          {/* Mobile Map Fallback */}
          <section className="lg:hidden h-[350px] w-full rounded-[2.5rem] overflow-hidden shadow-lg border-[6px] border-card relative z-0 print:hidden">
            <MapWrapper days={data.days} activeDay={activeDay} />
          </section>

          {/* Day sections */}
          <div className="space-y-14 pb-10">
            {data.days.map((day) => {
              const photos = getDayPhotos(day);
              const isActive = activeDay === day.day;

              return (
                <div key={day.day} id={`day-${day.day}`} className="scroll-mt-28">
                  {/* ---- Sticky Day Header (clickable → flyTo) ---- */}
                  <button
                    onClick={() =>
                      setActiveDay((prev) =>
                        prev === day.day ? null : day.day
                      )
                    }
                    className="w-full text-left sticky top-[4.5rem] lg:top-24 z-20 bg-background/90 backdrop-blur-xl py-4 mb-6 border-b border-border/50 -mx-4 px-4 md:mx-0 md:px-0 cursor-pointer group/day transition-colors hover:bg-accent/10"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white shadow-[0_5px_15px_-3px_rgba(234,88,12,0.3)] ring-2 transition-all duration-300 ${
                          isActive
                            ? "bg-orange-500 ring-orange-400/40 scale-110"
                            : "bg-orange-600 ring-orange-600/20"
                        }`}
                      >
                        <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80 leading-none mb-0.5">
                          Day
                        </span>
                        <span className="text-xl font-black leading-none">
                          {day.day}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-serif font-bold tracking-tight">
                          {day.title}
                        </h2>
                      </div>
                      <div
                        className={`hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                          isActive
                            ? "text-orange-500"
                            : "text-muted-foreground group-hover/day:text-orange-500"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        {isActive ? "Viewing on map" : "Show on map"}
                      </div>
                    </div>
                  </button>

                  {/* ---- 3-Photo Day Card (Secret Escapes style) ---- */}
                  {photos.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.5 }}
                      className="mb-8"
                    >
                      {photos.length === 1 ? (
                        /* Single hero image */
                        <div className="h-56 w-full rounded-[2rem] overflow-hidden shadow-lg border border-border/30 group/photo">
                          <img
                            src={photos[0]}
                            alt={`${day.title} hero`}
                            className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-700"
                          />
                        </div>
                      ) : photos.length === 2 ? (
                        /* 2 photos side by side */
                        <div className="grid grid-cols-2 gap-3 h-56">
                          {photos.map((photo, i) => (
                            <div
                              key={i}
                              className="rounded-[2rem] overflow-hidden shadow-lg border border-border/30 group/photo"
                            >
                              <img
                                src={photo}
                                alt={`${day.title} photo ${i + 1}`}
                                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-700"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* 3 photos: 1 hero full-width + 2 grid below */
                        <div className="space-y-3">
                          <div className="h-48 w-full rounded-[2rem] overflow-hidden shadow-lg border border-border/30 group/photo">
                            <img
                              src={photos[0]}
                              alt={`${day.title} hero`}
                              className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3 h-32">
                            {photos.slice(1, 3).map((photo, i) => (
                              <div
                                key={i}
                                className="rounded-2xl overflow-hidden shadow-md border border-border/30 group/photo"
                              >
                                <img
                                  src={photo}
                                  alt={`${day.title} photo ${i + 2}`}
                                  className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-700"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ---- Activity Timeline ---- */}
                  <div className="space-y-6 ml-6 pl-8 border-l-[3px] border-dashed border-border/60 relative">
                    {day.activities.map((activity, actIndex) => (
                      <AnimatedActivityCard
                        key={actIndex}
                        activity={activity}
                        index={actIndex}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Offline Save Prompt */}
          <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 rounded-[2.5rem] p-8 text-center shadow-[0_20px_40px_-15px_rgba(234,88,12,0.4)] relative overflow-hidden group print:hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col items-center md:flex-row md:justify-between gap-6">
              <div className="space-y-2 text-left md:max-w-xs">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Ready to travel?
                </h3>
                <p className="text-sm text-orange-50 font-medium">
                  Keep your itinerary with you naturally even when offline.
                </p>
              </div>
              <Button className="w-full md:w-auto px-8 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-2xl h-14 shadow-xl text-md transition-transform hover:scale-105">
                Save Offline Access
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Persistent Sticky Map */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24 h-[calc(100vh-8rem)] rounded-[3rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] border-[8px] border-card z-10 print:hidden transition-all duration-700 order-1 lg:order-2">
          <MapWrapper days={data.days} activeDay={activeDay} />
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
