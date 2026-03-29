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

        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
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

          {filteredEvents.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-xl text-muted-foreground">No events found matching this filter.</p>
            </div>
          )}
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
