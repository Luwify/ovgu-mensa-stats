#!/usr/bin/env python3
"""Builds the static site: copies site/ and writes stats/data.json, the packed data the page counts from.

    python3 scripts/build_site.py [--data data] [--out _site]

Standard library only. The same dish twice on a day in one Mensa (lunch and dinner) is one record. Dishes are matched by
the `key` the scraper wrote, which is the Mensa MD app's favorites key (`Favorites.normalize` in its :core module).
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

SCHEMA = 1
GROUPS = ("students", "staff", "guests")
VEGAN = "vegan"
VEGETARIAN = "vegetarisch"
KIND_VEGAN, KIND_VEGETARIAN, KIND_OTHER = 0, 1, 2


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


def kind_of(dish: dict) -> int:
    tags = {tag["key"] for tag in dish.get("tags", [])}
    return KIND_VEGAN if VEGAN in tags else KIND_VEGETARIAN if VEGETARIAN in tags else KIND_OTHER


def aggregate(days: list[dict], generated: str) -> dict:
    """Packs the day files for the browser, which does all counting (site/stats.js), so any choice of Mensen works.

    Per dish, `occ` holds one record per day and Mensa as four flat numbers: day index, Mensa index, index into the
    dish's `prices` (-1 = none) and kind. Sorted by day, then Mensa. `fixed` has the same records for lists without dates:
    they say what was on offer but are never counted as days. Dishes are matched by `key` only.
    """
    mensen: dict[str, dict] = {}
    for day in days:
        mensen[day["mensa"]["id"]] = {"id": day["mensa"]["id"], "name": day["mensa"]["name"], "fixed": bool(day.get("fixed"))}
    mensa_list = sorted(mensen.values(), key=lambda m: m["name"]["de"].casefold())
    mensa_index = {m["id"]: i for i, m in enumerate(mensa_list)}
    dates = sorted({day["date"] for day in days})
    date_index = {date: i for i, date in enumerate(dates)}

    dishes: dict[str, dict] = {}
    tag_labels: dict[str, Counter] = defaultdict(Counter)
    for day in days:
        seen = set()
        for dish in day["dishes"]:
            key = dish["key"]
            if not key or key in seen:
                continue
            seen.add(key)
            entry = dishes.setdefault(key, {"key": key, "tags": set(), "cake": False, "prices": [], "occ": [], "fixed": []})
            entry["name"] = dish["name"]  # days are sorted, so the newest spelling wins
            entry["cake"] = entry["cake"] or bool(dish.get("cake"))
            for tag in dish.get("tags", []):
                entry["tags"].add(tag["key"])
                tag_labels[tag["key"]][tag.get("label", tag["key"])] += 1
            prices = dish.get("prices") or {}
            price = -1
            if prices:
                row = [prices.get(group) for group in GROUPS]
                if row not in entry["prices"]:
                    entry["prices"].append(row)
                price = entry["prices"].index(row)
            target = entry["fixed"] if day.get("fixed") else entry["occ"]
            target.extend((date_index[day["date"]], mensa_index[day["mensa"]["id"]], price, kind_of(dish)))

    dish_list = [{**e, "tags": sorted(e["tags"])} for e in dishes.values()]
    dish_list.sort(key=lambda d: (d["name"]["de"].casefold(), d["key"]))
    return {
        "generated": generated,
        "fallbackFiles": sum(day.get("source") == "fallback" for day in days),
        "dates": dates,
        "mensen": mensa_list,
        "tags": {key: labels.most_common(1)[0][0] for key, labels in sorted(tag_labels.items())},
        "dishes": dish_list,
    }


def write_json(path: Path, value) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def build(data_dir: Path, site_dir: Path, out_dir: Path) -> dict:
    shutil.rmtree(out_dir, ignore_errors=True)
    shutil.copytree(site_dir, out_dir)
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    data = aggregate(load_days(data_dir), generated)
    (out_dir / "stats").mkdir()
    write_json(out_dir / "stats" / "data.json", data)
    return data


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", type=Path, default=root / "data")
    parser.add_argument("--out", type=Path, default=root / "_site")
    args = parser.parse_args()
    data = build(args.data, root / "site", args.out)
    print(f"{len(data['dishes'])} dishes on {len(data['dates'])} days in {len(data['mensen'])} Mensen")


if __name__ == "__main__":
    main()
