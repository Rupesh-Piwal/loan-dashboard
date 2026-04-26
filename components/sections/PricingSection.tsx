"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Voyager",
    price: 5,
    credits: 30,
    description: "Light top-up for occasional trips.",
    features: [
      "Up to 6 itineraries (5 credits each)",
      "Basic geo-pins",
      "Standard itinerary view",
    ],
    cta: "Buy 30 credits",
    featured: false,
  },
  {
    name: "Pathfinder",
    price: 20,
    credits: 100,
    description: "Best for frequent travel planning.",
    features: [
      "Up to 20 itineraries",
      "PDF export (5 credits each)",
      "Advanced map insights",
    ],
    cta: "Buy 100 credits",
    featured: true,
  },
  {
    name: "Globalist",
    price: 49,
    credits: 300,
    description: "For power users and heavy planners.",
    features: [
      "Up to 60 itineraries",
      "Unlimited PDF exports",
      "Advanced travel insights",
    ],
    cta: "Buy 300 credits",
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#F5EFE0] py-[160px] px-6 md:px-[8vw]">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center mb-24">
          <div
            className="text-[20px] md:text-[40px] font-bold tracking-[0.6em] text-terracotta"
            style={{ fontFamily: "var(--font-dancing), cursive" }}
          >
            Memberships
          </div>

          <h2 className="font-serif font-medium text-[clamp(40px,5vw,72px)] text-navy leading-none tracking-tight">
            Invest in your <span className="text-terracotta">discoveries.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {TIERS.map((tier) => {
            const pricePerCredit = (tier.price / tier.credits).toFixed(2);

            return (
              <motion.div
                key={tier.name}
                whileHover={{ y: -10 }}
                className={`p-10 rounded-[40px] flex flex-col transition-all duration-500 ${
                  tier.featured
                    ? "bg-navy text-sand shadow-[0_50px_100px_-20px_rgba(15,25,35,0.3)]"
                    : "bg-sand text-navy border border-navy/5 shadow-[0_20px_60px_rgba(15,25,35,0.03)]"
                }`}
              >
                {/* Plan Name */}
                <div className="text-terracotta text-[12px] font-bold uppercase tracking-[0.3em] mb-4">
                  {tier.name}
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="font-serif italic text-[64px] leading-none">
                    ${tier.price}
                  </span>
                  <span
                    className={`ml-2 text-[14px] font-medium ${
                      tier.featured ? "text-sand/50" : "text-navy/40"
                    }`}
                  >
                    one-time
                  </span>
                </div>

                {/* Credits Info */}
                <div
                  className={`text-[14px] mb-6 ${
                    tier.featured ? "text-sand/60" : "text-navy/50"
                  }`}
                >
                  {tier.credits} credits · ${pricePerCredit} per credit
                </div>

                {/* Description */}
                <p
                  className={`text-[15px] mb-8 ${
                    tier.featured ? "text-sand/70" : "text-navy/60"
                  }`}
                >
                  {tier.description}
                </p>

                <div className="h-[1px] w-full bg-current opacity-10 mb-8" />

                {/* Features */}
                <div className="flex flex-col gap-5 mb-10">
                  {tier.features.map((f) => (
                    <div key={f} className="flex gap-3 items-center">
                      <Check className="w-4 h-4 text-terracotta shrink-0" />
                      <span
                        className={`text-[14px] ${
                          tier.featured ? "text-sand/70" : "text-navy/60"
                        }`}
                      >
                        {f}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  className={`w-full py-4 rounded-[20px] font-bold uppercase text-[13px] tracking-widest mt-auto ${
                    tier.featured
                      ? "bg-terracotta text-sand"
                      : "bg-navy text-sand"
                  }`}
                >
                  {tier.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
