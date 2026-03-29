"use client";

import { useState, useMemo, useEffect } from "react";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import EventCard from "@/components/EventCard";
import SourceCarousel from "@/components/SourceCarousel";
import Footer from "@/components/Footer";
import EventModal from "@/components/EventModal";
import { Event } from "@/types";
import { getNormalizedEvents } from "@/lib/events";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load and normalize events
    const data = getNormalizedEvents();
    setEvents(data);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Filter by tag/category
      const matchesFilter = activeFilter === "All" || 
        (activeFilter === "Free" && event.is_free) ||
        (activeFilter === "UW" && event.affiliation === "uw") ||
        (activeFilter === "Laurier" && event.affiliation === "laurier") ||
        (activeFilter === "Today" && new Date(event.date).toDateString() === new Date().toDateString()) ||
        event.tags.some(tag => tag.includes(activeFilter));

      // Filter by search query
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesFilter && matchesSearch;
    });
  }, [events, activeFilter, searchQuery]);

  // Group events by date
  const groupedEvents = useMemo(() => {
    const groups: Record<string, Event[]> = {};
    filteredEvents.forEach(event => {
      const date = new Date(event.date).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    return groups;
  }, [filteredEvents]);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 86400000).toDateString();

    if (dateStr === today) return "Today";
    if (dateStr === tomorrow) return "Tomorrow";

    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <Hero 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Events Section */}
      <section className="relative z-10 pb-24">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          eventCount={filteredEvents.length}
        />

        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Scrollable Container */}
          <div className="max-h-[1100px] overflow-y-auto pr-4 custom-scrollbar rounded-3xl pb-32">
            {Object.entries(groupedEvents).map(([date, events]) => (
              <div key={date} className="mb-12">
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md py-4 mb-6 border-b border-white/5">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    {formatDateHeader(date)}
                  </h3>
                </div>
                
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {events.map((event) => (
                      <motion.div
                        key={event.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <EventCard
                          event={event}
                          onClick={setSelectedEvent}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            ))}

            {filteredEvents.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-xl text-muted-foreground">No events found matching this filter.</p>
              </div>
            )}
          </div>

          {/* Bottom Fade Gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
        </div>
      </section>

      {/* Sources Carousel */}
      <SourceCarousel />

      {/* Footer */}
      <Footer />

      {/* Event Details Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </main>
  );
}
