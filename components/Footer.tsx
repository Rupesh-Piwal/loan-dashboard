import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#060606] pt-[120px] pb-12 px-6 md:px-[8vw] border-t border-sand/5 relative overflow-hidden">

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-terracotta/20 to-transparent" />

      <div className="max-w-[1240px] mx-auto relative z-10">

        {/* LOGO + PATH SYSTEM */}
        <div className="relative flex justify-center items-center py-20">

          {/* LEFT PATH */}
          <div className="absolute left-50 top-1/2 -translate-y-1/2 -translate-x-[65%] opacity-20 hidden xl:block">
            <Image
              src="/graphics/dotted-left.svg"
              alt=""
              width={320}
              height={260}
            />

            {/* ✈️ Plane attached to path */}
            <Image
              src="/graphics/Plane.svg"
              alt="Plane"
              width={28}
              height={28}
              className="absolute top-[-5%] left-[45%] rotate-[-20deg]"
            />
          </div>

          {/* LOGO */}
          <h1 className="font-[var(--font-playfair)] text-[clamp(60px,15vw,200px)] text-sand leading-none uppercase tracking-[0.12em] opacity-20 text-center">
            Nomad<span className="text-terracotta">Go</span>
          </h1>

          {/* RIGHT PATH */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-[10%] opacity-20 hidden xl:block scale-x-[-1]">
            <Image
              src="/graphics/dotted-left.svg"
              alt=""
              width={320}
              height={260}
            />

            {/* 📍 Pin attached to path */}
            <Image
              src="/graphics/map-pin.svg"
              alt="Map Pin"
              width={22}
              height={32}
              className="absolute top-[60%] left-[100%]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}