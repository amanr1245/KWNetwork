import { Event, SourceType } from "@/types";
import eventsWat2Do from "@/events/wat2do.json";
import eventsNest from "@/events/nest.json";
import eventsLuma from "@/events/luma.json";
import eventsWusa from "@/events/wusa.json";
import eventsLazSoc from "@/events/lazsoc.json";

// Helper to convert non-standard dates to ISO
function parseDate(dateStr: string | null): string {
  if (!dateStr) return new Date().toISOString();
  try {
    // Handle "2026-03-29 00:00:00" format
    if (dateStr.includes("-") && dateStr.includes(":")) {
       return new Date(dateStr.replace(" ", "T")).toISOString();
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function getNormalizedEvents(): Event[] {
  const normalizedWat2Do: Event[] = (eventsWat2Do as any[]).map((ev) => ({
    id: `wat2do-${ev.event_id}`,
    title: ev.title,
    description: ev.description || "",
    date: parseDate(ev.start_time),
    location: ev.location || "Unknown Location",
    image_url: `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800`, // Fallback
    source: "wat2do" as SourceType,
    source_url: ev.source_url || "https://wat2do.ca",
    original_url: ev.source_url || "https://wat2do.ca",
    tags: ev.categories ? ev.categories.split(", ") : ["Social"],
    is_free: ev.price === 0 || !ev.price || ev.price === "0.0",
    affiliation: "uw"
  }));

  const normalizedNest: Event[] = (eventsNest as any[]).map((ev) => ({
    id: `nest-${ev.event_id}`,
    title: ev.event_name,
    description: ev.description || "",
    date: parseDate(ev.start_time),
    location: ev.address || "Unknown Location",
    image_url: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800`, // Fallback
    source: "laurier" as SourceType,
    source_url: `https://campus.hellorubric.com/event-details?eid=${ev.event_id}`,
    original_url: `https://campus.hellorubric.com/event-details?eid=${ev.event_id}`,
    tags: ev.category ? [ev.category] : ["Campus"],
    is_free: true,
    affiliation: "laurier"
  }));

  const normalizedLuma: Event[] = (eventsLuma as any[]).map((ev) => ({
    id: `luma-${ev.event_id}`,
    title: ev.event_name,
    description: ev.description || "",
    date: parseDate(ev.start_time),
    location: ev.location || "Kitchener-Waterloo",
    image_url: ev.image_url || `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800`,
    source: "luma" as SourceType,
    source_url: ev.event_url || "https://lu.ma",
    original_url: ev.event_url || "https://lu.ma",
    tags: ev.categories ? ev.categories.split(", ") : ["Community"],
    is_free: ev.is_free ?? true,
    affiliation: "community"
  }));

  const normalizedWusa: Event[] = (eventsWusa as any[]).map((ev) => ({
    id: `wusa-${ev.event_id}`,
    title: ev.title,
    description: ev.description || "",
    date: parseDate(ev.start_date),
    location: ev.venue || "UW Campus",
    image_url: ev.image_url || `https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800`,
    source: "wusa" as SourceType,
    source_url: ev.url || "https://wusa.ca/events",
    original_url: ev.url || "https://wusa.ca/events",
    tags: ev.categories ? ev.categories.split(", ") : ["UW", "Student Life"],
    is_free: !ev.cost || ev.cost.includes("0.00"),
    affiliation: "uw"
  }));

  const normalizedLazSoc: Event[] = (eventsLazSoc as any[]).map((ev) => ({
    id: `lazsoc-${ev.event_id}`,
    title: ev.event_name,
    description: ev.description || "",
    date: new Date().toISOString(), // Lazsoc doesn't have start date in the snippet, defaulting to now
    location: "Lazaridis Hall",
    image_url: ev.image_url || `https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800`,
    source: "lazsoc" as SourceType,
    source_url: "https://lazsoc.ca",
    original_url: "https://lazsoc.ca",
    tags: ev.product_type ? [ev.product_type] : ["Business", "Academic"],
    is_free: ev.price?.includes("0.00"),
    affiliation: "laurier"
  }));

  return [...normalizedWat2Do, ...normalizedNest, ...normalizedLuma, ...normalizedWusa, ...normalizedLazSoc].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
