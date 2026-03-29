"use client";

import { motion } from "framer-motion";
import { Source } from "@/types";
import { MOCK_SOURCES } from "@/lib/mock-data";
import { ExternalLink, ArrowRight } from "lucide-react";

export default function SourceCarousel() {
  // Duplicate for seamless loop
  const sources = [...MOCK_SOURCES, ...MOCK_SOURCES];

  return (
    <section className="py-32 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Powered by the best.</h2>
          <p className="text-lg text-muted-foreground max-w-xl">
            We index events from top platforms and local student communities to ensure you never miss a thing.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          Scroll to explore <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      <div className="relative">
        {/* Gradient overlays for smooth fading */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden group">
          <motion.div
            animate={{
              x: [0, "-50%"],
            }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex gap-6 pr-6 py-4"
          >
            {sources.map((source, idx) => (
              <div
                key={`${source.id}-${idx}`}
                className="w-[320px] flex-shrink-0 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 group-hover:[animation-play-state:paused]"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3">
                    <img 
                      src={source.logo_url} 
                      alt={source.name} 
                      className="h-full w-full object-contain filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" 
                    />
                  </div>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <h3 className="text-xl font-bold mb-3">{source.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {source.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
