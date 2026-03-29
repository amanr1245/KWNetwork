import json
import csv
import re
import time
from html.parser import HTMLParser
import urllib.request
import urllib.parse

API_URL = "https://api.hellorubric.com"
SEARCH_REFERER = "https://campus.hellorubric.com/search?country=CA&state=Ontario&type=events&universityid=280&iframe=true&showall=true"
DETAIL_REFERER = "https://campus.hellorubric.com/"

HEADERS = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://campus.hellorubric.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
}


def post(endpoint, details: dict, referer: str) -> dict:
    payload = urllib.parse.urlencode({
        "endpoint": endpoint,
        "details": json.dumps(details),
    }).encode()
    req = urllib.request.Request(API_URL, data=payload, headers={**HEADERS, "Referer": referer})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def strip_html(html: str) -> str:
    """Remove HTML tags and decode entities from a string."""
    class _Stripper(HTMLParser):
        def __init__(self):
            super().__init__()
            self.parts = []
        def handle_data(self, data):
            self.parts.append(data)
    s = _Stripper()
    s.feed(html or "")
    return " ".join("".join(s.parts).split()).strip()


def fetch_all_events() -> list[dict]:
    print("Fetching event list...")
    data = post(
        endpoint="getUnifiedSearch",
        details={
            "firstCall": True,
            "sortType": "Date",
            "desiredType": "events",
            "limit": 200,
            "offset": 0,
            "sortDirection": "ASC",
            "searchQuery": "",
            "countryCode": "CA",
            "state": "Ontario",
            "selectedUniversityId": "280",
            "iframe": True,
            "showall": True,
            "device": "web_portal",
            "version": 4,
        },
        referer=SEARCH_REFERER,
    )
    return data.get("results", [])


def fetch_event_details(event_id: int) -> dict:
    data = post(
        endpoint="https://appserver.getqpay.com:9090/AppServerSwapnil/event/details",
        details={"eventId": event_id, "device": "web_portal", "version": 4},
        referer=DETAIL_REFERER,
    )
    return data.get("eventDetails", {})


def scrape():
    results = fetch_all_events()
    print(f"Found {len(results)} events. Fetching details...")

    events = []
    for i, item in enumerate(results, 1):
        destination = item.get("destination", "")
        match = re.search(r"eid=(\d+)", destination)
        if not match:
            continue
        event_id = int(match.group(1))

        print(f"  [{i}/{len(results)}] eid={event_id} — {item.get('title', '')}")

        try:
            details = fetch_event_details(event_id)
        except Exception as e:
            print(f"    Warning: could not fetch details ({e})")
            details = {}

        events.append({
            "event_id": event_id,
            "event_name": details.get("eventName") or item.get("title"),
            "club_name": details.get("eventOrganizer") or item.get("societyname"),
            "category": item.get("subtitle"),
            "date": f"{item.get('day', '')} {item.get('month', '')}".strip(),
            "start_time": details.get("eventTime"),
            "end_time": details.get("eventEndTime"),
            "address": details.get("eventAddress"),
            "description": strip_html(details.get("eventDescription", "")),
        })

        time.sleep(0.15)  # be polite

    # Save JSON
    with open("events.json", "w", encoding="utf-8") as f:
        json.dump(events, f, indent=2, ensure_ascii=False)

    # Save CSV
    fields = ["event_id", "event_name", "club_name", "category", "date",
              "start_time", "end_time", "address", "description"]
    with open("events.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(events)

    print(f"\nDone — {len(events)} events saved to events.json and events.csv")


if __name__ == "__main__":
    scrape()
