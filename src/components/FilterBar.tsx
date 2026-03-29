"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Today", "This Weekend", "Free", "UW", "Laurier", "Arts", "Sports", "Social", "Academic"];

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  eventCount: number;
}

export default function FilterBar({ activeFilter, onFilterChange, eventCount }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-xl border-b border-white/5 py-4 mb-8">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeFilter === filter
                  ? "bg-white text-black"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground font-medium min-w-max">
          {eventCount} upcoming events
        </div>
      </div>
    </div>
  );
}
