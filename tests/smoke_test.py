"""Playwright smoke test: the page built from the fixtures, in a real browser, at desktop and phone size."""
import functools
import http.server
import sys
import tempfile
import threading
import unittest
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import build_site  # noqa: E402


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class Smoke(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        site = Path(cls.tmp.name) / "site"
        build_site.build(ROOT / "tests" / "fixtures" / "data", ROOT / "site", site)
        cls.server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=site))
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

    def open(self, **context):
        page = self.browser.new_context(**context).new_page()
        self.errors = []
        page.on("console", lambda m: self.errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: self.errors.append(str(e)))
        page.goto(self.url)
        expect(page.locator("#list .dish").first).to_be_visible()
        return page

    def tearDown(self):
        self.assertEqual([], self.errors)

    def test_page_shows_the_data_and_where_it_starts(self):
        page = self.open(locale="de-DE")
        expect(page.locator("#since")).to_contain_text("26.10.2026")
        expect(page.locator("#since")).to_contain_text("ersten Abruf")
        expect(page.locator("#tiles .tile")).to_have_count(4)
        expect(page.locator("#list-title")).to_have_text("Häufigste Gerichte")
        expect(page.locator("#list .dish").first).to_contain_text("Linsen-Dal mit Reis")
        expect(page.locator("#list .dish").first).to_contain_text("4×")
        expect(page.locator("#shares li")).to_have_count(4)  # selection overall + 3 Mensen
        expect(page.locator("#mensen tbody tr")).to_have_count(3)

    def test_footer_says_source_and_no_affiliation(self):
        page = self.open()
        footer = page.locator("footer")
        expect(footer).to_contain_text("Studentenwerk Magdeburg")
        expect(footer).to_contain_text("Keine Verbindung zur OvGU oder zum Studentenwerk Magdeburg")
        expect(footer).to_contain_text("GPL-3.0")

    def test_search_filters_and_ignores_case_and_accents(self):
        page = self.open()
        page.fill("#q", "KASESPATZLE")
        expect(page.locator("#list .dish")).to_have_count(1)
        expect(page.locator("#list .dish")).to_contain_text("Käsespätzle")
        expect(page.locator("#list-title")).to_have_text("1 Treffer")
        page.fill("#q", "gibt es nicht")
        expect(page.locator("#list")).to_contain_text("Nichts gefunden")

    def test_fixed_menu_dishes_are_found_but_not_ranked(self):
        page = self.open()
        expect(page.locator("#list")).not_to_contain_text("Festes Testgericht")
        page.fill("#q", "festes")
        expect(page.locator("#list .dish")).to_contain_text("Festes Angebot")

    def test_kind_filter(self):
        page = self.open()
        page.locator("#kinds").get_by_role("button", name="Vegetarisch").click()
        expect(page.locator("#list")).not_to_contain_text("Testschnitzel")
        expect(page.locator("#list")).to_contain_text("Käsespätzle")
        expect(page.locator("#list")).to_contain_text("Linsen-Dal")

    def test_dish_detail_shows_history_and_mensen_and_has_a_link(self):
        page = self.open()
        page.locator("#list .dish", has_text="Linsen-Dal").click()
        dialog = page.locator("#detail")
        expect(dialog).to_be_visible()
        expect(dialog.locator("h2")).to_have_text("Linsen-Dal mit Reis")
        expect(dialog).to_contain_text("26.10.2026")
        expect(dialog).to_contain_text("Alpha-Mensa")
        expect(dialog).to_contain_text("Beta-Mensa")
        expect(dialog.locator(".chart svg path")).to_have_count(3)
        expect(dialog.locator("table.prices tbody tr")).to_have_count(3)
        expect(dialog.locator("table.prices tbody tr").first).to_contain_text("2,90")
        dialog.locator(".chart svg").hover()
        expect(page.locator("#tip")).to_contain_text("Studierende")
        self.assertIn("#dish=", page.url)
        link = page.url
        page.locator("#detail-close").click()
        expect(dialog).to_be_hidden()
        page.goto(link)
        page.reload()
        expect(page.locator("#detail h2")).to_have_text("Linsen-Dal mit Reis")

    def test_shares_follow_the_month(self):
        page = self.open()
        page.select_option("#month", "2026-10")
        first = page.locator("#shares li").first
        expect(first).to_contain_text("Auswahl gesamt")
        expect(page.locator("#shares li", has_text="Beta-Mensa")).to_contain_text("100")
        page.select_option("#month", "2026-11")
        expect(page.locator("#shares li", has_text="Festmensa")).to_have_count(1)

    def test_english_toggle_is_remembered(self):
        page = self.open()
        page.locator("#lang").click()
        expect(page.locator("html")).to_have_attribute("lang", "en")
        expect(page.locator("#list-title")).to_have_text("Most frequent dishes")
        expect(page.locator("#list .dish").first).to_contain_text("Lentil dal with rice")
        expect(page.locator("footer")).to_contain_text("Not affiliated with OvGU or Studentenwerk Magdeburg")
        expect(page.locator("#since")).to_contain_text("first scrape")
        page.reload()
        expect(page.locator("#list-title")).to_have_text("Most frequent dishes")

    def test_theme_follows_the_system_and_the_toggle(self):
        page = self.open(color_scheme="dark")
        background = "getComputedStyle(document.body).backgroundColor"
        self.assertEqual("rgb(13, 11, 9)", page.evaluate(background))
        page.locator("#theme").click()
        self.assertEqual("rgb(247, 241, 230)", page.evaluate(background))
        page.reload()
        self.assertEqual("rgb(247, 241, 230)", page.evaluate(background))

    def test_phone_width_has_no_horizontal_scroll(self):
        page = self.open(viewport={"width": 360, "height": 740}, has_touch=True, is_mobile=True)
        overflow = "document.documentElement.scrollWidth - document.documentElement.clientWidth"
        self.assertLessEqual(page.evaluate(overflow), 0)
        page.locator("#list .dish").first.tap()
        expect(page.locator("#detail")).to_be_visible()
        self.assertLessEqual(page.evaluate(overflow), 0)
        width = page.locator("#detail").bounding_box()["width"]
        self.assertLessEqual(width, 360)


if __name__ == "__main__":
    unittest.main()
