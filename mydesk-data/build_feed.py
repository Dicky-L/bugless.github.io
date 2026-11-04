#!/usr/bin/env python3
"""Deterministic MYDESK index of public, dated gig radar reports."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATTERN = re.compile(r"\d{4}-\d{2}-\d{2}-(noon|evening)\.json")

def blob_sha(path: Path) -> str:
    body = path.read_bytes()
    return hashlib.sha1(b"blob " + str(len(body)).encode() + b"\0" + body).hexdigest()

def main() -> None:
    files = sorted((x for x in (ROOT / "mydesk-data" / "gigs").glob("*.json") if PATTERN.fullmatch(x.name)), reverse=True)
    items = [{"path": f"mydesk-data/gigs/{p.name}", "revision": blob_sha(p)} for p in files]
    result = {"schema_version": 1, "source": "gig", "count": len(items), "items": items}
    dest = ROOT / "mydesk-data" / "feed.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"MYDESK: indexed {len(items)} gig report(s)")

if __name__ == "__main__":
    main()
