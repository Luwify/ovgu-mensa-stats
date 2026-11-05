"""The two filters, in a real browser.

`Reference` counts straight from the raw day files, the plainest way possible. site/stats.js must give the same numbers for
every selection: that is the test of the dedup rule and the Mensa selection, on the fixtures and on the real data.
"""
import functools
import http.server
import itertools
import json
import sys
import tempfile
import threading
import unittest
from collections import defaultdict
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import build_site  # noqa: E402

FIXTURES = ROOT / "tests" / "fixtures" / "data"
GROUPS = ("students", "staff", "guests")


class Reference:
    def __init__(self, data_dir):
        self.days = build_site.load_days(data_dir)

    def entries(self, ids, fixed):
        seen = set()
        for day in self.days:
            if bool(day.get("fixed")) != fixed or (ids and day["mensa"]["id"] not in ids):
                continue
            for dish in day["dishes"]:
                mark = (day["date"], day["mensa"]["id"], dish["key"])
                if mark not in seen:
                    seen.add(mark)
                    yield day["date"], day["mensa"]["id"], dish

    @staticmethod
    def kind(dish):
        tags = {t["key"] for t in dish.get("tags", [])}
        return 0 if "vegan" in tags else 1 if "vegetarisch" in tags else 2

    def counts(self, ids, once):
        result = {}
        for date, mensa, dish in self.entries(ids, False):
            result.setdefault(dish["key"], []).append(date)
        return {key: len(set(dates)) if once else len(dates) for key, dates in result.items()}

    def seen(self, ids):
        dates = defaultdict(list)
        for fixed in (False, True):
            for date, _, dish in self.entries(ids, fixed):
                dates[dish["key"]].append(date)
        return {key: [min(v), max(v)] for key, v in dates.items()}

    def combined_shares(self, ids, once):
        """{month: [vegan, vegetarian, other]}; counted once, a dish takes the most plant-based tag of that day."""
        kinds = defaultdict(list)
        for date, mensa, dish in self.entries(ids, False):
            kinds[(date, dish["key"])].append(self.kind(dish))
        result = defaultdict(lambda: [0, 0, 0])
        for (date, _), values in kinds.items():
            for kind in [min(values)] if once else values:
                result[date[:7]][kind] += 1
        return dict(result)

    def prices(self, ids, key):
        """Lowest price per group on each day, only the days it changes."""
        per_day = defaultdict(list)
        for fixed in (False, True):
            for date, _, dish in self.entries(ids, fixed):
                if dish["key"] == key and dish.get("prices"):
                    per_day[date].append([dish["prices"].get(g) for g in GROUPS])
        result = []
        previous = None
        for date in sorted(per_day):
            row = [min((r[i] for r in per_day[date] if r[i] is not None), default=None) for i in range(3)]
            if row != previous:
                result.append([date, *row])
            previous = row
        return result


COMPUTE = """([ids, once]) => {
  const data = state.data;
  const flags = MensaStats.mask(data, ids);
  const view = MensaStats.compute(data, flags, once);
  const shares = {};
  data.months.forEach((month, i) => {
    const share = MensaStats.shareOf(data, view, null, i);
    if (share.some(Boolean)) shares[month] = share;
  });
  return {
    counts: Object.fromEntries(view.ranked.filter((r) => r.count).map((r) => [r.dish.key, r.count])),
    seen: Object.fromEntries(view.ranked.map((r) => [r.dish.key, [data.dates[r.first], data.dates[r.last]]])),
    entries: view.entries, distinct: view.distinct, days: view.days, shares,
    prices: Object.fromEntries(view.ranked.map((r) => [r.dish.key, MensaStats.detail(data, r.dish, flags, once).prices])),
    detailCounts: Object.fromEntries(view.ranked.filter((r) => r.count).map((r) => [r.dish.key, MensaStats.detail(data, r.dish, flags, once).count])),
  };
}"""


class Base(unittest.TestCase):
    data_dir = FIXTURES

    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        site = Path(cls.tmp.name) / "site"
        build_site.build(cls.data_dir, ROOT / "site", site)
        handler = type("Quiet", (http.server.SimpleHTTPRequestHandler,), {"log_message": lambda *a: None})
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(handler, directory=site))
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.url = f"http://127.0.0.1:{cls.server.server_port}/"
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch()

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.tmp.cleanup()

    def open(self, path="", **context):
        page = self.browser.new_context(locale="de-DE", **context).new_page()
        page.goto(self.url + path)
        expect(page.locator("#tiles .tile").first).to_be_visible()
        return page


class SameNumbersAsTheRawFiles(Base):
    def check(self, page, ids):
        reference = Reference(self.data_dir)
        for once in (True, False):
            with self.subTest(ids=ids, once=once):
                got = page.evaluate(COMPUTE, [ids, once])
                wanted = reference.counts(ids, once)
                self.assertEqual(wanted, got["counts"])
                self.assertEqual(sum(wanted.values()), got["entries"])
                self.assertEqual(reference.seen(ids), got["seen"])
                self.assertEqual(reference.combined_shares(ids, once), got["shares"])
                self.assertEqual(wanted, got["detailCounts"])
                for key, prices in got["prices"].items():
                    self.assertEqual(reference.prices(ids, key), prices, key)

    def test_every_combination_of_the_fixture_mensen(self):
        page = self.open()
        ids = [m["id"] for m in page.evaluate("state.data.mensen")]
        for size in range(0, len(ids) + 1):
            for chosen in itertools.combinations(ids, size):
                self.check(page, list(chosen))

    def test_real_data(self):
        real = ROOT / "data"
        if not any(real.glob("*/*/*/*.json")):
            self.skipTest("no data yet")
        type(self).data_dir = real
        self.tearDownClass()
        self.setUpClass()
        try:
            page = self.open()
            ids = sorted(m["id"] for m in page.evaluate("state.data.mensen"))
            for chosen in [[], ids[:1], ids[:2], ids[2:5], ids]:
                self.check(page, chosen)
        finally:
            type(self).data_dir = FIXTURES


class DedupRule(Base):
    def test_a_dish_in_two_mensen_on_a_day_is_one_occurrence(self):
        page = self.open()
        self.assertEqual(4, page.evaluate(COMPUTE, [[], True])["counts"]["linsen-dal mit reis"])
        self.assertEqual(5, page.evaluate(COMPUTE, [[], False])["counts"]["linsen-dal mit reis"])

    def test_it_only_looks_at_the_selected_mensen(self):
        page = self.open()
        self.assertEqual(4, page.evaluate(COMPUTE, [["alpha"], True])["counts"]["linsen-dal mit reis"])
        self.assertEqual(4, page.evaluate(COMPUTE, [["alpha"], False])["counts"]["linsen-dal mit reis"])

    def test_the_most_plant_based_tag_of_the_day_counts(self):
        # Käsespätzle on 2.11.: untagged in Alpha, vegetarian in Beta.
        page = self.open()
        self.assertEqual([2, 1, 1], page.evaluate(COMPUTE, [[], True])["shares"]["2026-11"])
        self.assertEqual([2, 1, 2], page.evaluate(COMPUTE, [[], False])["shares"]["2026-11"])

    def test_prices_take_the_lowest_of_the_selected_mensen(self):
        page = self.open()
        both = page.evaluate(COMPUTE, [["alpha", "beta"], True])["prices"]["linsen-dal mit reis"]
        self.assertEqual([["2026-10-26", 250, 400, 550], ["2026-10-27", 230, 380, 530], ["2026-11-02", 290, 440, 590]], both)
        alpha = page.evaluate(COMPUTE, [["alpha"], True])["prices"]["linsen-dal mit reis"]
        self.assertEqual([["2026-10-26", 250, 400, 550], ["2026-11-02", 290, 440, 590]], alpha)


class Filters(Base):
    def chip(self, page, name):
        return page.locator("#mensa-chips").get_by_role("button", name=name, exact=True)

    def tile(self, page, index):
        return page.locator("#tiles .tile b").nth(index)

    def test_default_is_all_mensen_counted_once(self):
        page = self.open()
        expect(self.chip(page, "Alle")).to_have_attribute("aria-pressed", "true")
        expect(page.locator("#once")).to_be_checked()
        expect(page.locator("#list .dish").first).to_contain_text("4×")
        self.assertNotIn("?", page.url)

    def test_any_combination_can_be_selected(self):
        page = self.open()
        self.chip(page, "Beta-Mensa").click()
        expect(self.chip(page, "Alle")).to_have_attribute("aria-pressed", "false")
        expect(self.tile(page, 3)).to_have_text("1")
        expect(page.locator("#list")).not_to_contain_text("Testschnitzel")
        expect(page.locator("#mensen tbody tr")).to_have_count(1)
        self.chip(page, "Alpha-Mensa").click()
        expect(self.tile(page, 3)).to_have_text("2")
        expect(page.locator("#list")).to_contain_text("Testschnitzel")
        self.assertIn("m=alpha,beta", page.url.replace("%2C", ","))
        self.chip(page, "Alle").click()
        expect(self.tile(page, 3)).to_have_text("3")
        self.assertNotIn("m=", page.url)

    def test_removing_the_last_mensa_goes_back_to_all(self):
        page = self.open()
        self.chip(page, "Beta-Mensa").click()
        self.chip(page, "Beta-Mensa").click()
        expect(self.chip(page, "Alle")).to_have_attribute("aria-pressed", "true")

    def test_search_stays_inside_the_selection(self):
        page = self.open()
        self.chip(page, "Beta-Mensa").click()
        page.fill("#q", "Testschnitzel")
        expect(page.locator("#list")).to_contain_text("Nichts gefunden")

    def test_the_toggle_changes_every_number(self):
        page = self.open()
        entries = self.tile(page, 2)
        expect(entries).to_have_text("9")
        page.locator("#once").uncheck()
        expect(entries).to_have_text("11")
        expect(page.locator("#list .dish").first).to_contain_text("5×")
        self.assertIn("once=0", page.url)
        first_share = page.locator("#shares li").first
        expect(first_share).to_contain_text("Auswahl gesamt")

    def test_detail_follows_the_selection(self):
        page = self.open()
        self.chip(page, "Alpha-Mensa").click()
        page.locator("#list .dish", has_text="Linsen-Dal").click()
        dialog = page.locator("#detail")
        expect(dialog).to_contain_text("Alpha-Mensa")
        expect(dialog).not_to_contain_text("Beta-Mensa")
        expect(dialog.locator("table.prices tbody tr")).to_have_count(2)

    def test_a_dish_outside_the_selection_says_so(self):
        page = self.open("?m=beta#dish=testschnitzel%2C%20pommes")
        expect(page.locator("#detail")).to_contain_text("nicht im Plan")

    def test_days_without_a_menu_are_named(self):
        page = self.open()
        expect(page.locator("#gaps")).to_contain_text("3 Werktagen")
        expect(page.locator("#gaps")).to_contain_text("28.10.2026")
        self.chip(page, "Beta-Mensa").click()
        expect(page.locator("#gaps")).to_contain_text("5 Werktagen")

    def test_a_link_reproduces_the_view(self):
        page = self.open("?m=alpha,beta&once=0&kind=vegan&month=2026-10&q=linsen")
        expect(self.chip(page, "Alpha-Mensa")).to_have_attribute("aria-pressed", "true")
        expect(self.chip(page, "Beta-Mensa")).to_have_attribute("aria-pressed", "true")
        expect(self.chip(page, "Festmensa")).to_have_attribute("aria-pressed", "false")
        expect(page.locator("#once")).not_to_be_checked()
        expect(page.locator("#q")).to_have_value("linsen")
        expect(page.locator("#month")).to_have_value("2026-10")
        expect(page.locator("#list .dish")).to_have_count(1)
        expect(page.locator("#list .dish")).to_contain_text("5×")
        expect(page.locator("#kinds").get_by_role("button", name="Vegan")).to_have_attribute("aria-pressed", "true")

    def test_unknown_values_in_a_link_are_ignored(self):
        page = self.open("?m=gibtsnicht&kind=fisch&month=1999-01")
        expect(self.chip(page, "Alle")).to_have_attribute("aria-pressed", "true")
        expect(page.locator("#month")).to_have_value("")

    def test_the_filters_are_remembered_but_a_link_wins(self):
        context = self.browser.new_context(locale="de-DE")
        page = context.new_page()
        page.goto(self.url)
        self.chip(page, "Beta-Mensa").click()
        page.locator("#once").uncheck()
        page.goto(self.url)
        expect(self.chip(page, "Beta-Mensa")).to_have_attribute("aria-pressed", "true")
        expect(page.locator("#once")).not_to_be_checked()
        self.assertIn("m=beta", page.url)
        page.goto(self.url + "?m=alpha")
        expect(self.chip(page, "Beta-Mensa")).to_have_attribute("aria-pressed", "false")
        expect(self.chip(page, "Alpha-Mensa")).to_have_attribute("aria-pressed", "true")
        expect(page.locator("#once")).to_be_checked()

    def test_phone_width(self):
        page = self.open(viewport={"width": 360, "height": 740}, has_touch=True, is_mobile=True)
        self.chip(page, "Beta-Mensa").tap()
        expect(self.tile(page, 3)).to_have_text("1")
        overflow = "document.documentElement.scrollWidth - document.documentElement.clientWidth"
        self.assertLessEqual(page.evaluate(overflow), 0)


if __name__ == "__main__":
    unittest.main()
