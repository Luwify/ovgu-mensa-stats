#!/usr/bin/env python3
"""Builds the static site: copies site/ and writes the aggregated JSON the page reads.

    python3 scripts/build_site.py [--data data] [--out _site]

Standard library only. A "day entry" below is one dish on one day in one Mensa, the same dish twice on a day (lunch and
dinner) counts once. Dishes are matched by the `key` the scraper wrote, which is the Mensa MD app's favorites key.
"""
from __future__ import annotations

import argparse
import json
import shutil
import statistics
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = 1
GROUPS = ("students", "staff", "guests")
VEGAN = "vegan"
VEGETARIAN = "vegetarisch"


def load_days(data_dir: Path) -> list[dict]:
    """Every readable day file, oldest first. A broken file is reported and skipped, the rest of the site still builds."""
    days = []
    for path in sorted(data_dir.glob("[0-9][0-9][0-9][0-9]/[0-9][0-9]/[0-9][0-9]/*.json")):
        try:
            day = json.loads(path.read_text(encoding="utf-8"))
            if day["schema"] > SCHEMA:
                raise ValueError(f"schema {day['schema']}")
            day["date"], day["mensa"]["id"], day["dishes"]  # the fields everything relies on
        except (OSError, ValueError, KeyError, TypeError) as error:
            print(f"::warning::skipped {path}: {error}", file=sys.stderr)
            continue
        days.append(day)
    days.sort(key=lambda d: (d["date"], d["mensa"]["id"]))
    return days


def price_row(prices: dict) -> tuple:
    return tuple(prices.get(group) for group in GROUPS)


def typical_price(rows: list[tuple]) -> tuple:
    """Per group the middle price of a day's Mensen; always a price that really was on a menu."""
    result = []
    for i in range(len(GROUPS)):
        values = [row[i] for row in rows if row[i] is not None]
        result.append(statistics.median_low(values) if values else None)
    return tuple(result)


def price_changes(by_date: dict[str, list[tuple]]) -> list[list]:
    """[date, students, staff, guests] for the first day and every day the typical price differs from the day before."""
    changes: list[list] = []
    previous = None
    for date in sorted(by_date):
        row = typical_price(by_date[date])
        if row != previous:
            changes.append([date, *row])
            previous = row
    return changes


def aggregate(days: list[dict], generated: str) -> tuple[dict, list[dict]]:
    """Returns (summary, dishes). Fixed lists count as "on offer", never as day entries (they have no real days)."""
    dishes: dict[str, dict] = {}
    mensen: dict[str, dict] = {}
    shares: dict[tuple[str, str], Counter] = defaultdict(Counter)
    tag_labels: dict[str, Counter] = defaultdict(Counter)
    dated_days = set()
    fallback_files = 0

    for day in days:
        date, mensa_id = day["date"], day["mensa"]["id"]
        fixed = bool(day.get("fixed"))
        fallback_files += day.get("source") == "fallback"
        mensa = mensen.setdefault(mensa_id, {
            "id": mensa_id, "fixed": fixed, "entries": 0, "keys": set(), "first": date, "last": date,
        })
        mensa["name"] = day["mensa"]["name"]  # days are sorted, so the newest spelling wins
        mensa["last"] = date
        if not fixed:
            dated_days.add(date)

        seen = set()
        for dish in day["dishes"]:
            key = dish["key"]
            if not key or key in seen:
                continue
            seen.add(key)
            entry = dishes.setdefault(key, {
                "key": key, "count": 0, "first": date, "last": date, "mensen": Counter(), "fixedIn": set(),
                "tags": set(), "cake": False, "byDate": defaultdict(list), "latest": {},
            })
            entry["name"] = dish["name"]
            entry["last"] = date
            entry["cake"] = entry["cake"] or bool(dish.get("cake"))
            tags = {tag["key"] for tag in dish.get("tags", [])}
            entry["tags"] |= tags
            for tag in dish.get("tags", []):
                tag_labels[tag["key"]][tag.get("label", tag["key"])] += 1
            prices = dish.get("prices") or {}
            if prices:
                row = price_row(prices)
                entry["byDate"][date].append(row)
                entry["latest"][mensa_id] = list(row)
            mensa["keys"].add(key)
            mensa["entries"] += 0 if fixed else 1
            if fixed:
                entry["fixedIn"].add(mensa_id)
            else:
                entry["count"] += 1
                entry["mensen"][mensa_id] += 1
            kind = "vegan" if VEGAN in tags else "vegetarian" if VEGETARIAN in tags else "other"
            shares[(mensa_id, date[:7])][kind] += 1

    dish_list = [{
        "key": e["key"],
        "name": e["name"],
        "count": e["count"],
        "first": e["first"],
        "last": e["last"],
        "mensen": dict(sorted(e["mensen"].items())),
        "fixedIn": sorted(e["fixedIn"]),
        "tags": sorted(e["tags"]),
        "cake": e["cake"],
        "prices": price_changes(e["byDate"]),
        "latest": dict(sorted(e["latest"].items())),
    } for e in dishes.values()]
    dish_list.sort(key=lambda d: (-d["count"], d["name"]["de"].casefold(), d["key"]))

    summary = {
        "generated": generated,
        "firstDate": days[0]["date"] if days else None,
        "lastDate": days[-1]["date"] if days else None,
        "days": len(dated_days),
        "entries": sum(d["count"] for d in dish_list),
        "dishes": len(dish_list),
        "fallbackFiles": fallback_files,
        "mensen": sorted(({
            "id": m["id"], "name": m["name"], "fixed": m["fixed"], "entries": m["entries"], "dishes": len(m["keys"]),
            "first": m["first"], "last": m["last"],
        } for m in mensen.values()), key=lambda m: m["name"]["de"].casefold()),
        "shares": [{
            "mensa": mensa_id, "month": month, "vegan": c["vegan"], "vegetarian": c["vegetarian"], "other": c["other"],
        } for (mensa_id, month), c in sorted(shares.items())],
        "tags": {key: labels.most_common(1)[0][0] for key, labels in sorted(tag_labels.items())},
    }
    return summary, dish_list


def write_json(path: Path, value) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def build(data_dir: Path, site_dir: Path, out_dir: Path) -> dict:
    shutil.rmtree(out_dir, ignore_errors=True)
    shutil.copytree(site_dir, out_dir)
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    summary, dishes = aggregate(load_days(data_dir), generated)
    (out_dir / "stats").mkdir()
    write_json(out_dir / "stats" / "summary.json", summary)
    write_json(out_dir / "stats" / "dishes.json", dishes)
    return summary


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=root / "data")
    parser.add_argument("--out", type=Path, default=root / "_site")
    args = parser.parse_args()
    summary = build(args.data, root / "site", args.out)
    print(f"{summary['dishes']} dishes, {summary['entries']} day entries, {summary['firstDate']} to {summary['lastDate']}")


if __name__ == "__main__":
    main()
