import { Event, Source } from "@/types";

export const MOCK_SOURCES: Source[] = [
  {
    id: "luma",
    name: "Luma",
    description: "The place for curated community events and meetups.",
    logo_url: "https://lu.ma/logo.png",
    url: "https://lu.ma"
  },
  {
    id: "wat2go",
    name: "wat2go",
    description: "The student-run guide to Waterloo student life.",
    logo_url: "https://wat2go.com/favicon.ico",
    url: "https://wat2go.com"
  },
  {
    id: "uw",
    name: "UW Events",
    description: "Official event calendar for the University of Waterloo.",
    logo_url: "https://uwaterloo.ca/favicon.ico",
    url: "https://uwaterloo.ca/events"
  },
  {
    id: "laurier",
    name: "Laurier Events",
    description: "Official event calendar for Wilfrid Laurier University.",
    logo_url: "https://wlu.ca/favicon.ico",
    url: "https://students.wlu.ca/events"
  },
  {
    id: "eventbrite",
    name: "Eventbrite KW",
    description: "Local events and tickets in the Kitchener-Waterloo area.",
    logo_url: "https://www.eventbrite.com/favicon.ico",
    url: "https://www.eventbrite.ca/d/canada--kitchener/events/"
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Startup Weekend Waterloo",
    description: "Build a startup in 54 hours. Mentorship, networking, and high-energy innovation.",
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    location: "Velocity, Waterloo",
    image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    source: "luma",
    source_url: "https://lu.ma/startup-weekend-kw",
    original_url: "https://lu.ma/startup-weekend-kw",
    tags: ["Entrepreneurship", "Social", "Tech"],
    is_free: false,
    affiliation: "community"
  },
  {
    id: "2",
    title: "UW Hackathon 2026",
    description: "The largest student hackathon in the region returns. 36 hours of coding, prizes, and fun.",
    date: new Date(Date.now() + 86400000 * 5).toISOString(),
    location: "E7, University of Waterloo",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    source: "uw",
    source_url: "https://uwaterloo.ca/events/hackathon",
    original_url: "https://uwaterloo.ca/events/hackathon",
    tags: ["Tech", "Academic", "UW"],
    is_free: true,
    affiliation: "uw"
  },
  {
    id: "3",
    title: "Laurier O-Week Concert",
    description: "Kick off the year with an amazing live performance at the University Stadium.",
    date: new Date(Date.now() + 86400000 * 1).toISOString(),
    location: "University Stadium",
    image_url: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800",
    source: "laurier",
    source_url: "https://students.wlu.ca/events/concert",
    original_url: "https://students.wlu.ca/events/concert",
    tags: ["Social", "Arts", "Laurier"],
    is_free: false,
    affiliation: "laurier"
  },
  {
    id: "4",
    title: "KW Night Market",
    description: "Explore local food vendors, artisans, and live music in downtown Kitchener.",
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    location: "DTK, Kitchener",
    image_url: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800",
    source: "eventbrite",
    source_url: "https://eventbrite.ca/kw-night-market",
    original_url: "https://eventbrite.ca/kw-night-market",
    tags: ["Social", "Arts", "Free"],
    is_free: true,
    affiliation: "community"
  },
  {
    id: "5",
    title: "UW A Cappella End of Term Show",
    description: "A showcase of vocal talent from the University of Waterloo's top a cappella groups.",
    date: new Date(Date.now() + 86400000 * 10).toISOString(),
    location: "AL 116, Waterloo",
    image_url: "https://images.unsplash.com/photo-1514525253361-bee8d4884c6c?auto=format&fit=crop&q=80&w=800",
    source: "wat2go",
    source_url: "https://wat2go.com/events/acappella",
    original_url: "https://wat2go.com/events/acappella",
    tags: ["Arts", "UW", "Social"],
    is_free: false,
    affiliation: "uw"
  },
  {
    id: "6",
    title: "Laurier Case Competition",
    description: "Test your business skills in our annual case competition with industry judges.",
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    location: "Lazaridis Hall",
    image_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    source: "laurier",
    source_url: "https://students.wlu.ca/events/case-comp",
    original_url: "https://students.wlu.ca/events/case-comp",
    tags: ["Academic", "Laurier"],
    is_free: true,
    affiliation: "laurier"
  }
];
