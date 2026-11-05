import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import build_site  # noqa: E402

FIXTURES = ROOT / "tests" / "fixtures" / "data"


def day(date, mensa, dishes, fixed=False, source="main"):
    return {"schema": 1, "date": date, "mensa": {"id": mensa, "name": {"de": mensa, "en": mensa}}, "fixed": fixed,
            "source": source, "dishes": dishes}


def dish(key, cents=None, tags=()):
    return {"key": key, "name": {"de": key.title(), "en": key}, "tags": [{"key": t, "label": t} for t in tags],
            "prices": dict(zip(build_site.GROUPS, cents)) if cents else {}}


def run(*days):
    data = build_site.aggregate(sorted(days, key=lambda d: (d["date"], d["mensa"]["id"])), "2026-11-05T03:00:00Z")
    return data, {d["key"]: d for d in data["dishes"]}


def records(flat):
    return [tuple(flat[i:i + 4]) for i in range(0, len(flat), 4)]


class Packing(unittest.TestCase):
    """stats/data.json keeps every dish, day and Mensa apart, so the browser can count any selection (see filters_test)."""

    def test_one_record_per_dish_day_and_mensa(self):
        data, dishes = run(
            day("2026-11-02", "a", [dish("x", (300, 450, 600))]),
            day("2026-11-03", "a", [dish("x", (300, 450, 600))]),
            day("2026-11-03", "b", [dish("x", (320, 450, 600)), dish("y")]),
        )
        self.assertEqual(["2026-11-02", "2026-11-03"], data["dates"])
        self.assertEqual(["a", "b"], [m["id"] for m in data["mensen"]])
        self.assertEqual([(0, 0, 0, 2), (1, 0, 0, 2), (1, 1, 1, 2)], records(dishes["x"]["occ"]))
        self.assertEqual([[300, 450, 600], [320, 450, 600]], dishes["x"]["prices"])
        self.assertEqual([(1, 1, -1, 2)], records(dishes["y"]["occ"]))

    def test_the_same_dish_twice_in_one_mensa_on_a_day_is_one_record(self):
        _, dishes = run(day("2026-11-02", "a", [dish("x"), dish("x")]))
        self.assertEqual(1, len(records(dishes["x"]["occ"])))

    def test_dishes_are_matched_by_key_not_by_spelling(self):
        spelled = dish("x")
        spelled["name"] = {"de": "X  anders", "en": "x"}
        _, dishes = run(day("2026-11-02", "a", [dish("x")]), day("2026-11-02", "b", [spelled]))
        self.assertEqual(1, len(dishes))
        self.assertEqual(2, len(records(dishes["x"]["occ"])))

    def test_a_fixed_list_is_kept_apart_from_real_days(self):
        data, dishes = run(day("2026-11-02", "pier", [dish("x")], fixed=True))
        self.assertEqual([], dishes["x"]["occ"])
        self.assertEqual(1, len(records(dishes["x"]["fixed"])))
        self.assertTrue(data["mensen"][0]["fixed"])

    def test_the_kind_is_per_record_and_vegan_wins(self):
        _, dishes = run(
            day("2026-11-02", "a", [dish("x", tags=["vegan", "vegetarisch"])]),
            day("2026-11-02", "b", [dish("x", tags=["vegetarisch"])]),
            day("2026-11-02", "c", [dish("x", tags=["rind"])]),
        )
        self.assertEqual([0, 1, 2], [r[3] for r in records(dishes["x"]["occ"])])
        self.assertEqual(["rind", "vegan", "vegetarisch"], dishes["x"]["tags"])

    def test_the_newest_spelling_is_shown(self):
        old = dish("x")
        new = dish("x")
        new["name"]["de"] = "Neu"
        _, dishes = run(day("2026-11-02", "a", [old]), day("2026-11-03", "a", [new]))
        self.assertEqual("Neu", dishes["x"]["name"]["de"])

    def test_a_missing_group_stays_empty(self):
        partial = dish("x")
        partial["prices"] = {"students": 300}
        _, dishes = run(day("2026-11-02", "a", [partial]))
        self.assertEqual([[300, None, None]], dishes["x"]["prices"])


class Files(unittest.TestCase):
    def test_empty_data_still_builds(self):
        data = build_site.aggregate([], "now")
        self.assertEqual(([], [], []), (data["dishes"], data["dates"], data["mensen"]))

    def test_broken_and_newer_files_are_skipped(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp) / "2026" / "11" / "02"
            folder.mkdir(parents=True)
            (folder / "good.json").write_text(json.dumps(day("2026-11-02", "good", [dish("x")])), encoding="utf-8")
            (folder / "broken.json").write_text("{", encoding="utf-8")
            (folder / "missing.json").write_text('{"schema": 1}', encoding="utf-8")
            newer = day("2026-11-02", "new", [dish("y")])
            newer["schema"] = 99
            (folder / "new.json").write_text(json.dumps(newer), encoding="utf-8")
            self.assertEqual(["good"], [d["mensa"]["id"] for d in build_site.load_days(Path(tmp))])

    def test_fixtures_end_to_end(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "out"
            data = build_site.build(FIXTURES, ROOT / "site", out)
            self.assertTrue((out / "index.html").is_file())
            self.assertTrue((out / "stats.js").is_file())
            read = json.loads((out / "stats" / "data.json").read_text(encoding="utf-8"))
        self.assertEqual(data, read)
        self.assertEqual("2026-10-26", read["dates"][0])
        self.assertEqual(1, read["fallbackFiles"])
        linsen = next(d for d in read["dishes"] if d["key"] == "linsen-dal mit reis")
        self.assertEqual(5, len(records(linsen["occ"])))


if __name__ == "__main__":
    unittest.main()
