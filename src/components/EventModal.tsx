"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, ExternalLink, Ticket, Share2, Check } from "lucide-react";
import { Event } from "@/types";
import { formatDate } from "@/lib/utils";

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(event.original_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
        >
          {/* Header Image */}
          <div className="relative h-64 w-full">
            <img
              src={event.image_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 -mt-12 relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white uppercase tracking-wider">
                {event.source}
              </span>
              {event.is_free && (
                <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/20 text-xs font-medium text-green-300">
                  FREE
                </span>
              )}
            </div>

            <h2 className="text-3xl font-bold mb-6">{event.title}</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Date & Time</p>
                  <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-10">
              {event.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={event.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all active:scale-[0.98]"
              >
                <Ticket className="h-5 w-5" />
                Sign up on {event.source}
              </a>
              <button 
                onClick={handleCopyLink}
                className="h-14 px-6 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Check className="h-5 w-5 text-green-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="share"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span>{copied ? "Copied" : "Share"}</span>
              </button>
            </div>
            
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mt-8">
              You will be redirected to the original event page
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
