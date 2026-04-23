"use client";

import DestinationsCarousel from "@/components/DestinationsCarousel";

export default function ExploreSection() {
  return (
    <section id="explore" className="bg-[#F5EFE0] py-[30px] md:py-[60px] overflow-hidden relative">
      <div className="max-w-[1240px] mx-auto relative z-10">
        {/* Heading */}
        <div className="flex flex-col items-center text-center px-6 max-w-[900px] mx-auto">

          {/* EXPLORE — smaller, wider, airy, italic, sexy tension */}
          <div className="text-[20px] md:text-[40px] font-bold tracking-[0.6em] text-terracotta"
            style={{ fontFamily: 'var(--font-dancing), cursive' }}>
            Explore
          </div>

          {/* Headline — dramatic scale jump, ultra-light + bold contrast */}
          <h2 className="text-[62px] md:text-[60px] font-semibold tracking-tight text-navy opacity-85">
            Timeless destinations
          </h2>
        </div>

        {/* Carousel */}
        <div className="px-6 md:px-0">
          <DestinationsCarousel />
        </div>
      </div>


    </section>
  );
}
