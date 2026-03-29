import { Event, SourceType } from "@/types";
import eventsWat2Do from "@/events/wat2do.json";
import eventsNest from "@/events/nest.json";

// Helper to convert "Sat, 28 Mar 2026 12:30 PM UTC" to ISO
function parseDate(dateStr: string | null): string {
  if (!dateStr) return new Date().toISOString();
  try {
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
    image_url: `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800`, // Placeholder
    source: "wat2go" as SourceType, // we map wat2do to wat2go source id
    source_url: ev.source_url || "https://wat2do.ca",
    original_url: ev.source_url || "https://wat2do.ca",
    tags: ev.categories ? ev.categories.split(", ") : ["Social"],
    is_free: ev.price === 0 || !ev.price,
    affiliation: ev.school?.toLowerCase().includes("waterloo") ? "uw" : "laurier"
  }));

  const normalizedNest: Event[] = (eventsNest as any[]).map((ev) => ({
    id: `nest-${ev.event_id}`,
    title: ev.event_name,
    description: ev.description || "",
    date: parseDate(ev.start_time),
    location: ev.address || "Unknown Location",
    image_url: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800`, // Placeholder
    source: "laurier" as SourceType, // nest is primarily laurier
    source_url: `https://campus.hellorubric.com/event-details?eid=${ev.event_id}`,
    original_url: `https://campus.hellorubric.com/event-details?eid=${ev.event_id}`,
    tags: ev.category ? [ev.category] : ["Campus"],
    is_free: true, // mostly free campus events
    affiliation: "laurier"
  }));

  return [...normalizedWat2Do, ...normalizedNest].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
