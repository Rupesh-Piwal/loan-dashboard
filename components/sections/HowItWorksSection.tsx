"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Map, Compass, FileText } from "lucide-react";
import TourTimelineSection from "@/components/sections/TourTimelineSection";

/* ══════════════════════════════════════════════════════════
   VIBE DATA — 3 immersive travel experiences
   ══════════════════════════════════════════════════════════ */
const vibeData = [
  {
    vibe: "Relaxation",
    destination: "Maldives",
    tagline: "Where time dissolves into turquoise",
    video:
      "https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4",
    poster:
      "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920",
    itinerary: [
      "Overwater villa sunrise yoga",
      "Private reef snorkeling",
      "Sunset catamaran cruise",
    ],
    accent: "#1BBCBC",
  },
  {
    vibe: "Adventure",
    destination: "Patagonia",
    tagline: "Chase the edge of the map",
    video:
      "https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4",
    poster:
      "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=1920",
    itinerary: [
      "Torres del Paine sunrise trek",
      "Glacier kayaking expedition",
      "Estancia campfire under stars",
    ],
    accent: "#E67E22",
  },
  {
    vibe: "Cultural",
    destination: "Kyoto",
    tagline: "A thousand years in a single moment",
    video:
      "https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_30fps.mp4",
    poster:
      "https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=1920",
    itinerary: [
      "Fushimi Inari at golden hour",
      "Private tea ceremony in Gion",
      "Bamboo grove meditation walk",
    ],
    accent: "#D4A76A",
  },
];

const featuredCards = [
  {
    icon: Brain,
    title: "Smart AI",
    text: "Your 24/7 personal travel concierge, generating pixel-perfect plans tailored to your vibe.",
  },
  {
    icon: Map,
    title: "Optimized Routes",
    text: "Efficient pathing between all destinations to save you time and maximize exploration.",
  },
  {
    icon: Compass,
    title: "Hidden Gems",
    text: "Curated spots off the beaten path, from local cafes to secret viewpoints.",
  },
  {
    icon: FileText,
    title: "Export & Share",
    text: "Download your full itinerary as a stunning PDF or share it instantly via link.",
  },
];

/* ══════════════════════════════════════════════════════════
   VIBE PANEL — single immersive full-viewport panel
   ══════════════════════════════════════════════════════════ */
function VibePanel({
  data,
  index,
  onInView,
}: {
  data: (typeof vibeData)[0];
  index: number;
  onInView: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track which panel is in view + play/pause videos
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onInView();
          videoRef.current?.play().catch(() => { });
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onInView, isMobile]);

  // Parallax transforms
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  const showVideo = !isMobile && !videoFailed;
  const stagger = (i: number) => ({ delay: 0.15 + i * 0.12 });

  return (
    <div
      ref={panelRef}
      className="relative h-screen w-full overflow-hidden flex items-center"
    >
      {/* ── Background Media with parallax ── */}
      <motion.div
        className="absolute inset-0 w-full h-[125%] -top-[12%]"
        style={{ y: bgY }}
      >
        {showVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 md:max-w-[60%] h-full object-cover scale-105"
            muted
            loop
            playsInline
            preload="none"
            poster={data.poster}
            onError={() => setVideoFailed(true)}
          >
            <source src={data.video} type="video/mp4" />
          </video>
        ) : (
          <motion.img
            src={data.poster}
            alt={data.destination}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ scale: [1, 1.08] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          />
        )}
      </motion.div>

      {/* ── Cinematic overlay stack ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          background: `radial-gradient(ellipse at 30% 70%, ${data.accent}40, transparent 70%)`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.7)]" />
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 w-full max-w-[1200px] mx-auto px-8 md:px-16"
        style={{ y: contentY }}
      >
        <div className="max-w-[620px]">
          {/* Vibe label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={stagger(0)}
            className="flex items-center gap-4 mb-6"
          >
            <div
              className="w-8 h-[2px]"
              style={{ backgroundColor: data.accent }}
            />
            <span
              className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.35em]"
              style={{ color: data.accent }}
            >
              {data.vibe}
            </span>
          </motion.div>

          {/* Destination name */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ ...stagger(1), duration: 0.8 }}
            className="text-sand text-[52px] md:text-[90px] lg:text-[110px] font-[family-name:var(--font-serif)] italic leading-[0.9] tracking-tight mb-4 md:mb-6"
          >
            {data.destination}
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={stagger(2)}
            className="text-sand/50 text-[15px] md:text-[18px] font-inter leading-relaxed mb-10 md:mb-14 max-w-[440px]"
          >
            {data.tagline}
          </motion.p>


        </div>
      </motion.div>


    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN SECTION
   ══════════════════════════════════════════════════════════ */
export default function HowItWorksSection() {
  const [activeVibe, setActiveVibe] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToPanel = (idx: number) => {
    panelRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="how-it-works" className="relative">
      {/* ═══════════════ INTRO PANEL ═══════════════ */}
      <div className="relative w-full overflow-hidden flex items-center justify-center bg-[#060606] py-[30px] md:py-[60px]">

        <div className="relative z-10 text-center px-6 max-w-[800px]">
          {/* Script accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[22px] md:text-[44px] font-bold tracking-[0.15em] text-terracotta mb-4"
            style={{ fontFamily: "var(--font-dancing), cursive" }}
          >
            Discovery
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-6 md:mb-10"
          >
            <div className="h-[1px] bg-sand/15 flex-grow max-w-[120px] md:max-w-[200px] mr-4 md:mr-8" />
            <h2 className="text-sand text-lg md:text-5xl font-serif tracking-[0.15em] uppercase text-center shrink-0 font-thin">
              Choose your world
            </h2>
            <div className="h-[1px] bg-sand/15 flex-grow max-w-[120px] md:max-w-[200px] ml-4 md:ml-8" />
          </motion.div>

        </div>
      </div>

      {/* ═══════════════ TOUR TIMELINE ═══════════════ */}
      <TourTimelineSection />

      {/* ═══════════════ WHAT'S INCLUDED ═══════════════ */}
      <div className="bg-[#060606] py-24 md:py-40 px-6 md:px-[8vw] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-sand/10 to-transparent" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-terracotta/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center mb-14 md:mb-20"
          >
            <h2 className="text-sand text-2xl md:text-4xl font-serif tracking-widest uppercase mr-4 md:mr-8 shrink-0">
              What&apos;s Included
            </h2>
            <div className="h-[1px] bg-sand/15 flex-grow" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 + idx * 0.1 }}
                className="group border border-sand/8 rounded-2xl p-8 bg-sand/[0.02] hover:bg-sand/[0.05] hover:border-terracotta/20 transition-all duration-500"
              >
                <div className="flex items-center gap-3 mb-5">
                  <card.icon className="w-6 h-6 text-terracotta group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-sand text-lg font-medium">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sand/45 text-sm leading-relaxed">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
