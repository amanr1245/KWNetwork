"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { Event } from "@/types";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const sourceColors = {
    luma: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    wat2go: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    uw: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    laurier: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    eventbrite: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => onClick(event)}
      className="group relative cursor-pointer bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
    >
      {/* Image Wrapper */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Source Badge */}
        <div className={cn(
          "absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md",
          sourceColors[event.source]
        )}>
          <span className="capitalize">via {event.source}</span>
        </div>

        {/* Free Tag */}
        {event.is_free && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 backdrop-blur-md text-xs font-medium">
            FREE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {event.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-white transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors flex items-center gap-1">
            Details <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
