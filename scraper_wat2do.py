import json
import csv
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone

BASE = "https://api.wat2do.ca/api"
HEADERS = {
    "Origin": "https://wat2do.ca",
    "Referer": "https://wat2do.ca/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


def get(path: str) -> dict | list:
    req = urllib.request.Request(f"{BASE}{path}", headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def format_dt(utc_str: str | None) -> str | None:
    """Convert UTC ISO string to a readable local-ish string."""
    if not utc_str:
        return None
    dt = datetime.fromisoformat(utc_str.replace("Z", "+00:00"))
    return dt.strftime("%a, %d %b %Y %I:%M %p UTC")


# ── 1. Load clubs for ig_handle → club_name lookup ──────────────────────────

def fetch_clubs() -> dict[str, str]:
    """Returns {ig_handle: club_name}"""
    print("Fetching clubs...")
    lookup: dict[str, str] = {}
    cursor = None
    while True:
        qs = "?limit=200"
        if cursor:
            qs += f"&cursor={urllib.parse.quote(str(cursor))}"
        data = get(f"/clubs/{qs}")
        for club in data.get("results", []):
            ig = club.get("ig")
            if ig:
                lookup[ig.lower()] = club["club_name"]
        if not data.get("hasMore", False):
            break
        cursor = data["nextCursor"]
    print(f"  Loaded {len(lookup)} clubs with Instagram handles.")
    return lookup


# ── 2. Paginate through all events ──────────────────────────────────────────

def fetch_all_events() -> list[dict]:
    print("Fetching all events...")
    events = []
    cursor = None
    while True:
        qs = "?limit=100"
        if cursor:
            qs += f"&cursor={urllib.parse.quote(cursor)}"
        data = get(f"/events/{qs}")
        events.extend(data.get("results", []))
        if not data.get("hasMore"):
            break
        cursor = data["nextCursor"]
    print(f"  Got {len(events)} events.")
    return events


# ── 3. Fetch per-event detail (for categories) ───────────────────────────────

def fetch_event_detail(event_id: int) -> dict:
    return get(f"/events/{event_id}/")


# ── 4. Main ──────────────────────────────────────────────────────────────────

def scrape():
    club_lookup = fetch_clubs()
    raw_events = fetch_all_events()

    print(f"Fetching details for {len(raw_events)} events...")
    records = []

    for i, ev in enumerate(raw_events, 1):
        event_id = ev["id"]
        ig = (ev.get("ig_handle") or "").lower()
        club_name = club_lookup.get(ig) or ev.get("display_handle")

        print(f"  [{i}/{len(raw_events)}] id={event_id} — {ev['title']}")
        try:
            detail = fetch_event_detail(event_id)
            categories = detail.get("categories", [])
            status = detail.get("status")
        except Exception as e:
            print(f"    Warning: detail fetch failed ({e})")
            categories = []
            status = None

        records.append({
            "event_id": event_id,
            "title": ev["title"],
            "club_name": club_name,
            "categories": ", ".join(categories) if categories else None,
            "start_time": format_dt(ev.get("dtstart_utc")),
            "end_time": format_dt(ev.get("dtend_utc")),
            "location": ev.get("location"),
            "price": ev.get("price"),
            "food": ev.get("food"),
            "registration_required": ev.get("registration"),
            "status": status,
            "description": ev.get("description"),
            "school": ev.get("school"),
            "club_type": ev.get("club_type"),
            "ig_handle": ev.get("ig_handle"),
            "source_url": ev.get("source_url"),
        })

        time.sleep(0.1)

    # Save JSON
    with open("events_wat2do.json", "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    # Save CSV
    fields = [
        "event_id", "title", "club_name", "categories",
        "start_time", "end_time", "location", "price",
        "food", "registration_required", "status",
        "description", "school", "club_type", "ig_handle", "source_url",
    ]
    with open("events_wat2do.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)

    print(f"\nDone — {len(records)} events saved to events_wat2do.json and events_wat2do.csv")


if __name__ == "__main__":
    scrape()
