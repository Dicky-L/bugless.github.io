#!/usr/bin/env python3
"""Build a public MYDESK opportunity index from safely redacted JSON archives."""
from __future__ import annotations
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "mydesk-data" / "opportunities"
OUTPUT = ROOT / "mydesk-data" / "opportunity-feed.json"
DATE = re.compile(r"\d{4}-\d{2}-\d{2}\.json")
PRIVATE_FIELDS = {"portfolio", "holdings", "account", "amount", "positions", "trade_action", "private_notes"}
BLOCKED_TEXT = re.compile(r"持仓影响：|今日交易截止前：|\b\d{6}\b|<Cite\b|<Link\b", re.I)

def git_blob_sha(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()

def main() -> None:
    entries = []
    for path in sorted(SOURCE.glob("*.json"), reverse=True):
        if not DATE.fullmatch(path.name):
            continue
        raw = path.read_bytes()
        row = json.loads(raw)
        expected = path.stem
        if row.get("schema_version") != 1 or row.get("category") != "intel" or row.get("date") != expected or row.get("id") != "intel-" + expected:
            raise ValueError(f"Invalid MYDESK opportunity record: {path.name}")
        if row.get("privacy") != "public_sanitized":
            raise ValueError(f"Not marked as public-sanitized: {path.name}")
        if PRIVATE_FIELDS.intersection(row.keys()) or BLOCKED_TEXT.search(str(row.get("body", ""))):
            raise ValueError(f"Potential personal information or unsupported markup: {path.name}")
        entries.append({"path": f"mydesk-data/opportunities/{path.name}", "revision": git_blob_sha(raw)})
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    data = {"schema_version": 1, "source": "intel", "count": len(entries), "items": entries}
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"MYDESK opportunity index: {len(entries)} archived briefs")

if __name__ == "__main__":
    main()
