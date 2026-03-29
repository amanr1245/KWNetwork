import json
import csv
import time
from pathlib import Path
import urllib.request
import urllib.parse
from datetime import datetime, timezone

OUT_DIR = Path(__file__).parent.parent / "src" / "events"

BASE = "https://api.lu.ma"
PLACE_ID = "discplace-idpnif8MiNuyYI7"
HEADERS = {
    "Accept": "application/json",
    "Origin": "https://lu.ma",
    "Referer": "https://lu.ma/waterloo_ca",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}


def get(path: str, params: dict) -> dict:
    qs = urllib.parse.urlencode(params)
    req = urllib.request.Request(f"{BASE}{path}?{qs}", headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def extract_text(node: dict) -> str:
    """Recursively extract plain text from a ProseMirror document node."""
    if node.get("type") == "text":
        return node.get("text", "")
    parts = []
    for child in node.get("content", []):
        parts.append(extract_text(child))
    return " ".join(p for p in parts if p)


def format_dt(utc_str: str | None, tz_name: str = "UTC") -> str | None:
    if not utc_str:
        return None
    dt = datetime.fromisoformat(utc_str.replace("Z", "+00:00"))
    return dt.strftime("%a, %d %b %Y %I:%M %p UTC")


def format_price(ticket_info: dict | None) -> str | None:
    if not ticket_info:
        return None
    if ticket_info.get("is_free"):
        return "Free"
    price = ticket_info.get("price") or {}
    cents = price.get("cents")
    currency = (price.get("currency") or "").upper()
    if cents is not None:
        return f"{currency} {cents / 100:.2f}"
    return None


def fetch_all_entries() -> list[dict]:
    print("Fetching Luma events...")
    entries = []
    cursor = None
    while True:
        params = {"discover_place_api_id": PLACE_ID, "pagination_limit": 50}
        if cursor:
            params["pagination_cursor"] = cursor
        data = get("/discover/get-paginated-events", params)
        batch = data.get("entries", [])
        entries.extend(batch)
        print(f"  Got {len(entries)} events so far (has_more={data.get('has_more')})")
        if not data.get("has_more"):
            break
        cursor = data["next_cursor"]
    return entries


def fetch_event_detail(event_api_id: str) -> dict:
    return get("/event/get", {"event_api_id": event_api_id})


def scrape():
    entries = fetch_all_entries()
    print(f"Fetching details for {len(entries)} events...")

    records = []
    for i, entry in enumerate(entries, 1):
        api_id = entry.get("api_id", "")
        ev = entry.get("event") or {}
        cal = entry.get("calendar") or {}
        ticket_info = entry.get("ticket_info")

        name = ev.get("name", "")
        print(f"  [{i}/{len(entries)}] {api_id} — {name}")

        # Fetch per-event detail for description + categories
        description = None
        categories = None
        hosts_str = None
        try:
            detail = fetch_event_detail(api_id)
            desc_mirror = detail.get("description_mirror") or {}
            raw_text = extract_text(desc_mirror)
            description = " ".join(raw_text.split()).strip() or None

            cats = detail.get("categories") or []
            categories = ", ".join(c["name"] for c in cats if c.get("name")) or None

            hosts = detail.get("hosts") or []
            hosts_str = ", ".join(h["name"] for h in hosts if h.get("name")) or None

            # Override ticket_info from detail if available
            ticket_info = detail.get("ticket_info") or ticket_info
        except Exception as e:
            print(f"    Warning: detail fetch failed ({e})")

        geo = ev.get("geo_address_info") or {}

        records.append({
            "event_id": api_id,
            "event_name": name,
            "organizer": cal.get("name") or hosts_str,
            "hosts": hosts_str,
            "categories": categories,
            "start_time": format_dt(ev.get("start_at")),
            "end_time": format_dt(ev.get("end_at")),
            "timezone": ev.get("timezone"),
            "location": geo.get("full_address") or geo.get("short_address"),
            "city": geo.get("city"),
            "price": format_price(ticket_info),
            "is_free": ticket_info.get("is_free") if ticket_info else None,
            "description": description,
            "image_url": ev.get("cover_url"),
            "event_url": f"https://lu.ma/{ev['url']}" if ev.get("url") else None,
        })

        time.sleep(0.15)

    # Save JSON
    with open(OUT_DIR / "luma.json", "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    # Save CSV
    fields = [
        "event_id", "event_name", "organizer", "hosts", "categories",
        "start_time", "end_time", "timezone", "location", "city",
        "price", "is_free", "description", "image_url", "event_url",
    ]
    with open(OUT_DIR / "luma.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)

    print(f"\nDone — {len(records)} events saved to src/events/luma.json and luma.csv")


if __name__ == "__main__":
    scrape()
