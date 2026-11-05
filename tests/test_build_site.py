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
    summary, dishes = build_site.aggregate(sorted(days, key=lambda d: d["date"]), "2026-11-05T03:00:00Z")
    return summary, {d["key"]: d for d in dishes}


class Frequency(unittest.TestCase):
    def test_counts_per_day_and_mensa_with_first_and_last_seen(self):
        summary, dishes = run(
            day("2026-11-02", "a", [dish("x")]),
            day("2026-11-03", "a", [dish("x")]),
            day("2026-11-03", "b", [dish("x"), dish("y")]),
        )
        x = dishes["x"]
        self.assertEqual(3, x["count"])
        self.assertEqual({"a": 2, "b": 1}, x["mensen"])
        self.assertEqual(("2026-11-02", "2026-11-03"), (x["first"], x["last"]))
        self.assertEqual(4, summary["entries"])
        self.assertEqual(2, summary["days"])
        self.assertEqual(2, summary["dishes"])

    def test_the_same_dish_twice_on_a_day_counts_once(self):
        _, dishes = run(day("2026-11-02", "a", [dish("x"), dish("x")]))
        self.assertEqual(1, dishes["x"]["count"])

    def test_most_frequent_first_then_by_name(self):
        _, dishes = build_site.aggregate([
            day("2026-11-02", "a", [dish("b"), dish("a"), dish("c")]),
            day("2026-11-03", "a", [dish("c")]),
        ], "now")
        self.assertEqual(["c", "a", "b"], [d["key"] for d in dishes])

    def test_a_fixed_list_is_on_offer_but_not_counted(self):
        summary, dishes = run(
            day("2026-11-02", "pier", [dish("x")], fixed=True),
            day("2026-11-03", "pier", [dish("x")], fixed=True),
        )
        self.assertEqual(0, dishes["x"]["count"])
        self.assertEqual(["pier"], dishes["x"]["fixedIn"])
        self.assertEqual({}, dishes["x"]["mensen"])
        self.assertEqual(0, summary["days"])
        self.assertEqual(0, summary["entries"])

    def test_the_newest_spelling_is_shown(self):
        old = dish("x")
        new = dish("x")
        new["name"]["de"] = "Neu"
        _, dishes = run(day("2026-11-02", "a", [old]), day("2026-11-03", "a", [new]))
        self.assertEqual("Neu", dishes["x"]["name"]["de"])


class Prices(unittest.TestCase):
    def test_only_changes_are_kept(self):
        _, dishes = run(
            day("2026-11-02", "a", [dish("x", (300, 450, 600))]),
            day("2026-11-03", "a", [dish("x", (300, 450, 600))]),
            day("2026-11-04", "a", [dish("x", (320, 470, 620))]),
            day("2026-11-05", "a", [dish("x", (320, 470, 620))]),
        )
        self.assertEqual([["2026-11-02", 300, 450, 600], ["2026-11-04", 320, 470, 620]], dishes["x"]["prices"])

    def test_on_one_day_the_middle_price_of_the_mensen_counts(self):
        _, dishes = run(
            day("2026-11-02", "a", [dish("x", (300, 450, 600))]),
            day("2026-11-02", "b", [dish("x", (320, 450, 600))]),
            day("2026-11-02", "c", [dish("x", (900, 450, 600))]),
        )
        self.assertEqual([["2026-11-02", 320, 450, 600]], dishes["x"]["prices"])
        self.assertEqual([900, 450, 600], dishes["x"]["latest"]["c"])

    def test_no_prices_give_an_empty_history(self):
        _, dishes = run(day("2026-11-02", "a", [dish("x")]))
        self.assertEqual([], dishes["x"]["prices"])

    def test_a_missing_group_stays_empty(self):
        partial = dish("x")
        partial["prices"] = {"students": 300}
        _, dishes = run(day("2026-11-02", "a", [partial]))
        self.assertEqual([["2026-11-02", 300, None, None]], dishes["x"]["prices"])


class Shares(unittest.TestCase):
    def test_per_mensa_and_month_vegan_wins_over_vegetarian(self):
        summary, _ = run(
            day("2026-10-30", "a", [dish("v", tags=["vegan", "vegetarisch"]), dish("g", tags=["vegetarisch"]), dish("m", tags=["rind"])]),
            day("2026-11-02", "a", [dish("v", tags=["vegan"])]),
            day("2026-11-02", "b", [dish("m")]),
        )
        self.assertEqual([
            {"mensa": "a", "month": "2026-10", "vegan": 1, "vegetarian": 1, "other": 1},
            {"mensa": "a", "month": "2026-11", "vegan": 1, "vegetarian": 0, "other": 0},
            {"mensa": "b", "month": "2026-11", "vegan": 0, "vegetarian": 0, "other": 1},
        ], summary["shares"])


class Files(unittest.TestCase):
    def test_empty_data_still_builds(self):
        summary, dishes = build_site.aggregate([], "now")
        self.assertEqual([], dishes)
        self.assertIsNone(summary["firstDate"])
        self.assertEqual(0, summary["days"])

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
            summary = build_site.build(FIXTURES, ROOT / "site", out)
            self.assertTrue((out / "index.html").is_file())
            dishes = json.loads((out / "stats" / "dishes.json").read_text(encoding="utf-8"))
            read = json.loads((out / "stats" / "summary.json").read_text(encoding="utf-8"))
        self.assertEqual(summary, read)
        self.assertEqual("2026-10-26", read["firstDate"])
        self.assertEqual(1, read["fallbackFiles"])
        self.assertEqual("linsen-dal mit reis", dishes[0]["key"])
        self.assertEqual(5, dishes[0]["count"])
        self.assertEqual({"alpha": 4, "beta": 1}, dishes[0]["mensen"])
        self.assertEqual([["2026-10-26", 250, 400, 550], ["2026-11-02", 290, 440, 590]], dishes[0]["prices"])


if __name__ == "__main__":
    unittest.main()
