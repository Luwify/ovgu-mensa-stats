# Mensa-Statistik Magdeburg

Statistics about the menus of the Studentenwerk Magdeburg canteens: how often a dish appears, first and last seen, price
history, which dishes appear in which canteen, the most frequent dishes and the vegan/vegetarian share per canteen and
month.

**Site: https://luwify.github.io/ovgu-mensa-stats/**

Not affiliated with OvGU or Studentenwerk Magdeburg. The data starts with the first scrape; older menus are not available.

## How it works

1. `.github/workflows/scrape.yml` runs every morning (03:17 UTC, so 04:17 or 05:17 in Europe/Berlin). It checks out
   [Luwify/ovgu-mensa](https://github.com/Luwify/ovgu-mensa) at its latest release tag, builds the `:scraper` CLI and
   commits the new files in `data/`. The CLI uses the app's own parser and host fallback; there is no second parser here.
   Until a release contains the CLI, the workflow uses the commit in `SCRAPER_FALLBACK_REF`.
2. After a commit with new data, the same run calls `.github/workflows/pages.yml`: aggregation tests, build, deploy to
   GitHub Pages. The call is needed because a push made with the job's token starts no other workflow. The Playwright
   smoke test runs on every push of code, not on the daily data commit.

A run is idempotent. The files hold no time of the fetch, so an unchanged menu gives identical bytes and no commit. A
Mensa that fails is retried once and then shows as a warning on the run page; the others go through. The run only fails
when no Mensa gave any dishes (site down, or its HTML changed; in a closure of all canteens too).

### Keeping the schedule alive

GitHub disables scheduled workflows in public repositories "when no repository activity has occurred in 60 days". The
docs don't define activity, so whether the bot's data commits count is unknown, and in long holidays there may be no
commits anyway. So the workflow doesn't rely on them:

- Every run calls the API to enable itself (`PUT .../actions/workflows/scrape.yml/enable`). This is harmless when it is
  already enabled. A workflow that is already disabled can't do this, so this step only helps before the limit.
- When the last commit is older than 30 days, the run commits `.keepalive`. That covers holidays and a site that stays
  down.

If it still gets disabled, GitHub shows a banner on the Actions tab: enable it there and the next run continues. Menus of
the days in between are lost, apart from the ones still on the site.

## Data

`data/YYYY/MM/DD/<mensa>.json`, one file per day and canteen:

```json
{
  "schema": 1,
  "date": "2026-11-06",
  "mensa": { "id": "stendal", "name": { "de": "Stendal", "en": "Stendal" } },
  "fixed": false,
  "source": "main",
  "dishes": [
    {
      "key": "normalized german name",
      "name": { "de": "…", "en": "…" },
      "labels": [{ "de": "…", "en": "…" }],
      "prices": { "students": 370, "staff": 540, "guests": 680 },
      "unassignedPrices": [],
      "tags": [{ "key": "vegan", "label": "vegan" }],
      "codes": ["1", "a1"],
      "dinner": false,
      "cake": false,
      "section": null
    }
  ]
}
```

- Prices are cents. `unassignedPrices` holds prices the page doesn't assign to a group.
- `key` is the favorites key of the Mensa MD app; it is what identifies a dish across days and canteens.
- `source` is `main`, or `fallback` for the Studentenwerk's test server, used when the main site fails. Fallback data
  never replaces main-site data and adds no past days.
- `fixed` marks PIER 16, which has a list without dates. Each working day stores a snapshot; the statistics treat it as
  "on offer", not as days served.
- A day's file is replaced when the plan changes, up to the last scrape that still sees that day. The files are what was
  planned, not proof of what was served.

**Data note:** the files contain facts from the public menus of [Studentenwerk Magdeburg](https://www.studentenwerk-magdeburg.de/)
(names, prices, tags, codes), no copied texts or images. They are not official and may be wrong or incomplete; don't use
them as allergen information. The GPL below covers the code. The data is not placed under it and no rights in it are
claimed.

## Develop

Python 3 only; the build uses the standard library.

```bash
python3 scripts/build_site.py                 # data/ -> _site/
python3 -m http.server -d _site               # http://localhost:8000
python3 -m unittest tests.test_build_site     # aggregation
pip install -r tests/requirements.txt && python3 -m playwright install chromium
python3 -m unittest tests.smoke_test          # the page in a real browser
python3 tests/make_fixtures.py                # rewrite the made-up test data
```

CLI tests live with the CLI in the app repository (`scraper/src/test`).

## License

GPL-3.0-or-later, like the app. See `LICENSE`.
