#!/usr/bin/env python3
"""Writes tests/fixtures/data: made-up dishes in the scraper's file format. Run after a format change."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "fixtures" / "data"
NAMES = {
    "alpha": {"de": "Alpha-Mensa", "en": "Alpha canteen"},
    "beta": {"de": "Beta-Mensa", "en": "Beta canteen"},
    "fest": {"de": "Festmensa", "en": "Festmensa"},
}


def dish(de, en, cents=None, tags=(), **extra):
    return {
        "key": de.lower(),
        "name": {"de": de, "en": en},
        "labels": [],
        "prices": dict(zip(("students", "staff", "guests"), cents)) if cents else {},
        "unassignedPrices": [],
        "tags": [{"key": t, "label": t} for t in tags],
        "codes": [],
        "dinner": False,
        "cake": False,
        "section": None,
        **extra,
    }


def write(date, mensa, dishes, fixed=False, source="main"):
    year, month, day = date.split("-")
    path = ROOT / year / month / day / f"{mensa}.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    body = {"schema": 1, "date": date, "mensa": {"id": mensa, "name": NAMES[mensa]}, "fixed": fixed, "source": source, "dishes": dishes}
    path.write_text(json.dumps(body, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


LINSEN = ("Linsen-Dal mit Reis", "Lentil dal with rice")
SCHNITZEL = ("Testschnitzel, Pommes", "Test schnitzel, fries")
KAESE = ("Käsespätzle", "Cheese spaetzle")
SUPPE = ("Tomatensuppe", "Tomato soup")

write("2026-10-26", "alpha", [dish(*LINSEN, (250, 400, 550), ["vegan"]), dish(*SCHNITZEL, (380, 550, 690), ["schwein"])])
write("2026-10-27", "alpha", [dish(*LINSEN, (250, 400, 550), ["vegan"]), dish(*KAESE, (300, 450, 600), ["vegetarisch"])])
# Same day, other spelling and a lower price than Alpha; the key is what makes it the same dish.
write("2026-10-27", "beta", [dish("LINSEN-DAL  mit Reis", "Lentil dal with rice", (230, 380, 530), ["vegan"], key=LINSEN[0].lower()),
                             dish(*SUPPE, (180, 300, 420), ["vegan", "neuertag"])])
# Tagged in one Mensa only: the tag counts when the same dish is counted once.
write("2026-11-02", "alpha", [dish(*LINSEN, (290, 440, 590), ["vegan"]), dish(*SCHNITZEL, (380, 550, 690), ["schwein"]),
                              dish(*KAESE, (300, 450, 600))])
write("2026-11-02", "beta", [dish(*KAESE, (300, 450, 600), ["vegetarisch"])])
write("2026-11-03", "alpha", [dish(*LINSEN, (290, 440, 590), ["vegan"])], source="fallback")
write("2026-11-03", "fest", [dish("Festes Testgericht", "Fixed test dish", (420, 590, 730)),
                             dish("Zwei Preise Teller", "Two prices plate", None, unassignedPrices=[420, 590])], fixed=True)
