"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, CircleNotch, Sparkle, Globe, CaretRight, User, Compass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationSuggestion {
  name: string;
  city?: string;
  country: string;
  lat: number;
  lng: number;
  image?: string;
  isFeatured?: boolean;
}

interface LocationInputProps {
  defaultValue?: string;
  onSelect?: (location: LocationSuggestion) => void;
  disabled?: boolean;
  dropdownClassName?: string;
}

const FEATURED_DESTINATIONS: LocationSuggestion[] = [
  {
    name: "Bali", country: "Indonesia", lat: -8.3405, lng: 115.092, isFeatured: true,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "New York", country: "USA", lat: 40.7128, lng: -74.006, isFeatured: true,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, isFeatured: true,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Santorini", country: "Greece", lat: 36.3932, lng: 25.4615, isFeatured: true,
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=200&h=200&auto=format&fit=crop"
  },
];

export default function LocationInput({ defaultValue = "", onSelect, disabled, dropdownClassName }: LocationInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipSearch = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }

    if (query.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/locations?q=${encodeURIComponent(query)}`, {
          signal: controller.signal
        });
        
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();

        if (data.features) {
          const results = data.features.map((f: any) => ({
            name: f.properties.name || f.properties.city || f.properties.state,
            city: f.properties.city,
            country: f.properties.country,
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
          })).filter((s: any) => s.name);

          setSuggestions(results);
          setIsOpen(true);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (s: LocationSuggestion) => {
    const fullName = s.isFeatured ? `${s.name}, ${s.country}` : `${s.name}${s.city ? `, ${s.city}` : ""}, ${s.country}`;
    skipSearch.current = true;
    setQuery(fullName);
    setSuggestions([]);
    setIsOpen(false);
    onSelect?.(s);
  };

  const showFeatured = isOpen && query.length === 0;
  const showResults = isOpen && suggestions.length > 0;

  return (
    <div className="relative group" ref={containerRef}>
      <div className="relative">
        <MapPin className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors z-10",
          isOpen ? "text-primary" : "text-muted-foreground group-focus-within:text-primary"
        )} />
        <Input
          id="destination"
          name="destination"
          placeholder="Explore a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          className="pl-12 h-14 bg-accent/20 border-border/50 focus:bg-accent/40 focus:ring-1 focus:ring-primary/20 transition-all rounded-2xl placeholder:text-muted-foreground/50 shadow-sm placeholder:text-[18px] placeholder:font-light"
          required
          disabled={disabled}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <CircleNotch className="w-4 h-4 text-primary animate-spin" />
          </div>
        )}
      </div>

      {(showFeatured || showResults) && (
        <div className={cn(
          "absolute top-full left-0 w-full mt-4 bg-transparent border border-white/10 rounded-[8px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] z-50 overflow-hidden backdrop-blur-3xl backdrop-saturate-[2] animate-in fade-in zoom-in-95 duration-500 origin-top",
          dropdownClassName
        )}>

          {showFeatured && (
            <div className="py-7">
              <div className="px-8 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-2xl bg-terracotta/20 flex items-center justify-center border border-terracotta/10">
                    <Compass size={24} weight="light" className="text-terracotta" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-white/90">
                      Destinations
                    </span>
                    <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-medium mt-0.5">
                      Explore a city
                    </span>
                  </div>
                </div>
                <div className="h-px bg-white/5 flex-1 ml-10" />
              </div>

              <div className="flex flex-row gap-5 px-8 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
                {FEATURED_DESTINATIONS.map((s, i) => (
                  <button
                    key={`featured-${i}`}
                    type="button"
                    className="flex-shrink-0 w-[58px] group/card text-left outline-none"
                    onClick={() => handleSelect(s)}
                  >
                    <div className="relative w-full aspect-[3/4] rounded-[8px] overflow-hidden mb-3 shadow-2xl border border-white/5 transition-all duration-700 group-hover/card:scale-[1.02] group-hover/card:-translate-y-1">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-full h-full object-cover grayscale-[0.3] group-hover/card:grayscale-0 transition-all duration-700 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-60 transition-opacity" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white font-bold text-[10px] tracking-tight leading-tight">{s.name}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">

                          <p className="text-white/50 text-[6px] uppercase font-black tracking-widest">{s.country}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showResults && (
            <div className="py-4">
              <div className="px-6 py-2 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white/40" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Search Results</span>
                </div>
                <div className="h-px bg-white/10 flex-1 ml-6" />
              </div>

              <div className="px-3 pb-2">
                {suggestions.map((s, i) => {
                  const isAirport = s.name.toLowerCase().includes("airport");
                  const isStation = s.name.toLowerCase().includes("station") || s.name.toLowerCase().includes("terminus");

                  return (
                    <button
                      key={`result-${i}`}
                      type="button"
                      className="w-full text-left px-5 py-4 hover:bg-white/5 rounded-2xl transition-all duration-200 flex items-center gap-4 group/row"
                      onClick={() => handleSelect(s)}
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover/row:bg-white/10 group-hover/row:scale-110 transition-all border border-white/5 shadow-sm text-lg">
                        {isAirport ? "🛫" : isStation ? "🚉" : "📍"}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[15px] font-bold text-white leading-tight truncate group-hover/row:text-orange-400 transition-colors">
                          {s.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                            {s.city ? `${s.city}` : s.country}
                          </span>
                          {s.city && (
                            <>
                              <div className="w-1 h-1 rounded-full bg-white/20" />
                              <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
                                {s.country}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <CaretRight className="w-5 h-5 text-white/0 group-hover/row:text-white/40 group-hover/row:translate-x-1 transition-all mr-2" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
