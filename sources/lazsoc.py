import json
import csv
from pathlib import Path
import urllib.request

OUT_DIR = Path(__file__).parent.parent / "src" / "events"

SHOPIFY_URL = "https://lazaridis-students-society-2.myshopify.com/api/2023-10/graphql.json"
STOREFRONT_TOKEN = "3ba9a63766a1ae0ae326a50a33305c23"
COLLECTION_HANDLE = "event-tickets"

HEADERS = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}

QUERY = """
query GetEvents($handle: String!, $first: Int!, $after: String) {
  collection(handle: $handle) {
    title
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          availableForSale
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges {
              node { url altText }
            }
          }
          variants(first: 10) {
            edges {
              node {
                title
                price { amount currencyCode }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
}
"""


def graphql(query: str, variables: dict) -> dict:
    body = json.dumps({"query": query, "variables": variables}).encode()
    req = urllib.request.Request(SHOPIFY_URL, data=body, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def format_price(price_range: dict) -> str | None:
    lo = price_range.get("minVariantPrice") or {}
    hi = price_range.get("maxVariantPrice") or {}
    lo_amt = lo.get("amount")
    hi_amt = hi.get("amount")
    currency = (lo.get("currencyCode") or hi.get("currencyCode") or "").upper()
    if not lo_amt:
        return None
    lo_str = f"{currency} {float(lo_amt):.2f}"
    if hi_amt and hi_amt != lo_amt:
        return f"{lo_str} – {currency} {float(hi_amt):.2f}"
    return lo_str


def shopify_id_to_int(gid: str) -> str:
    """Extract numeric ID from Shopify GID like gid://shopify/Product/12345"""
    return gid.split("/")[-1]


def fetch_all_products() -> list[dict]:
    print("Fetching Lazsoc events from Shopify...")
    products = []
    cursor = None
    while True:
        variables = {"handle": COLLECTION_HANDLE, "first": 50}
        if cursor:
            variables["after"] = cursor
        data = graphql(QUERY, variables)
        collection = (data.get("data") or {}).get("collection") or {}
        products_data = collection.get("products") or {}
        edges = products_data.get("edges", [])
        products.extend(e["node"] for e in edges)
        page_info = products_data.get("pageInfo", {})
        print(f"  Got {len(products)} events so far (hasNextPage={page_info.get('hasNextPage')})")
        if not page_info.get("hasNextPage"):
            break
        cursor = page_info["endCursor"]
    return products


def scrape():
    products = fetch_all_products()
    print(f"Processing {len(products)} events...")

    records = []
    for p in products:
        image_edges = (p.get("images") or {}).get("edges", [])
        image_url = image_edges[0]["node"]["url"] if image_edges else None

        variant_edges = (p.get("variants") or {}).get("edges", [])
        variant_names = ", ".join(
            e["node"]["title"] for e in variant_edges
            if e["node"]["title"] and e["node"]["title"].lower() != "default title"
        ) or None

        tags = p.get("tags") or []

        records.append({
            "event_id": shopify_id_to_int(p.get("id", "")),
            "event_name": p.get("title"),
            "club_name": "Lazaridis Students' Society",
            "product_type": p.get("productType"),
            "tags": ", ".join(tags) if tags else None,
            "variants": variant_names,
            "price": format_price(p.get("priceRange") or {}),
            "available": p.get("availableForSale"),
            "description": p.get("description") or None,
            "image_url": image_url,
        })

    # Save JSON
    with open(OUT_DIR / "lazsoc.json", "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    # Save CSV
    fields = [
        "event_id", "event_name", "club_name", "product_type", "tags",
        "variants", "price", "available", "description", "image_url",
    ]
    with open(OUT_DIR / "lazsoc.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(records)

    print(f"\nDone — {len(records)} events saved to src/events/lazsoc.json and lazsoc.csv")


if __name__ == "__main__":
    scrape()
