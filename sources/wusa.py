import json
import csv
import urllib.request
import urllib.parse
from datetime import datetime, timedelta, timezone
from html.parser import HTMLParser

BASE = "https://wusa.ca/wp-json/tribe/events/v1/events"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json",
}


def get(url: str) -> dict:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def strip_html(html: str) -> str:
    class _S(HTMLParser):
        def __init__(self):
            super().__init__()
            self.parts = []
        def handle_data(self, d):
            self.parts.append(d)
    s = _S()
    s.feed(html or "")
    return " ".join("".join(s.parts).split()).strip()


def fetch_events(start_date: str, end_date: str) -> list[dict]:
    print(f"Fetching events from {start_date} to {end_date}...")
    events = []
    page = 1
    while True:
        params = urllib.parse.urlencode({
            "start_date": start_date,
            "end_date": end_date,
            "per_page": 50,
            "page": page,
            "status": "publish",
        })
        data = get(f"{BASE}?{params}")
        events.extend(data.get("events", []))
        print(f"  Page {page}/{data.get('total_pages', 1)} — {len(events)} events so far")
        if page >= data.get("total_pages", 1):
            break
        page += 1
    return events


def parse_event(ev: dict) -> dict:
    venue = ev.get("venue") or {}
    if isinstance(venue, list):
        venue = venue[0] if venue else {}
    venue_parts = [
        venue.get("venue"),
        venue.get("address"),
        venue.get("city"),
        venue.get("province") or venue.get("stateprovince"),
        venue.get("zip"),
        venue.get("country"),
    ]
    venue_str = ", ".join(p for p in venue_parts if p) or None

    organizers = ev.get("organizer") or []
    organizer_names = ", ".join(o["organizer"] for o in organizers if o.get("organizer")) or None
    organizer_emails = ", ".join(o["email"] for o in organizers if o.get("email")) or None

    categories = ev.get("categories") or []
    category_names = ", ".join(c["name"] for c in categories if c.get("name")) or None

    tags = ev.get("tags") or []
    tag_names = ", ".join(t["name"] for t in tags if t.get("name")) or None

    tz = ev.get("timezone_abbr", "")
    start = ev.get("start_date", "")
    end = ev.get("end_date", "")

    return {
        "event_id": ev.get("id"),
        "title": strip_html(ev.get("title", "")),
        "organizer": organizer_names,
        "organizer_email": organizer_emails,
        "categories": category_names,
        "tags": tag_names,
        "start_date": start,
        "end_date": end,
        "timezone": tz,
        "all_day": ev.get("all_day"),
        "venue": venue_str,
        "cost": ev.get("cost") or None,
        "is_virtual": ev.get("is_virtual"),
        "description": strip_html(ev.get("description", "")),
        "url": ev.get("url"),
    }


def scrape():
    today = datetime.now(timezone.utc).date()
    two_weeks = today + timedelta(weeks=2)
    start_date = today.strftime("%Y-%m-%d")
    end_date = two_weeks.strftime("%Y-%m-%d")

    raw = fetch_events(start_date, end_date)
    records = [parse_event(ev) for ev in raw]

    with open("events_wusa.json", "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    fields = [
        "event_id", "title", "organizer", "organizer_email", "categories", "tags",
        "start_date", "end_date", "timezone", "all_day",
        "venue", "cost", "is_virtual", "description", "url",
    ]
    with open("events_wusa.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)

    print(f"\nDone — {len(records)} events saved to events_wusa.json and events_wusa.csv")


if __name__ == "__main__":
    scrape()
