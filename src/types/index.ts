export type SourceType = "luma" | "wat2go" | "uw" | "laurier" | "eventbrite";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  location: string;
  image_url: string;
  source: SourceType;
  source_url: string; // the source site's event page
  original_url: string; // the actual signup/ticket link
  tags: string[];
  is_free: boolean;
  affiliation: "uw" | "laurier" | "community" | null;
}

export interface Source {
  id: SourceType;
  name: string;
  description: string;
  logo_url: string;
  url: string;
}
