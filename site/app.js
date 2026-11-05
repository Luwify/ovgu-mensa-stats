"use strict";

const TEXT = {
  de: {
    title: "Mensa-Statistik Magdeburg",
    lead: "Was in den Mensen des Studentenwerks Magdeburg auf dem Speiseplan steht: jeden Tag erfasst, ausgezählt und durchsuchbar.",
    since: (d) => `Die Daten beginnen mit dem ersten Abruf am ${d}. Ältere Speisepläne sind nicht enthalten, die Zahlen wachsen also erst nach und nach.`,
    noData: "Noch keine Daten vorhanden.",
    loadFailed: "Die Daten konnten nicht geladen werden.",
    fallback: (n) => ` ${n} Tagespläne stammen vom Testserver des Studentenwerks, weil die Hauptseite nicht erreichbar war.`,
    themeToggle: "Hell oder dunkel", langSwitch: "Switch to English", overview: "Überblick",
    tileDays: "Tage erfasst", tileDishes: "verschiedene Gerichte", tileEntries: "Einträge im Plan", tileMensen: "Mensen",
    dishes: "Gerichte", search: "Suche", searchHint: "z. B. Currywurst", mensa: "Mensa", allMensen: "Alle Mensen",
    kindFilter: "Art", all: "Alle", vegan: "Vegan", vegetarian: "Vegetarisch", other: "Sonstige",
    topTitle: "Häufigste Gerichte", hits: (n) => `${n} Treffer`, noHits: "Nichts gefunden.",
    more: (n) => `${n} weitere anzeigen`, times: (n) => `${n}×`,
    lastSeen: (d) => `zuletzt ${d}`, inMensen: (n) => `in ${n} ${n === 1 ? "Mensa" : "Mensen"}`, fixedOffer: "Festes Angebot",
    shareTitle: "Vegan und vegetarisch je Mensa", month: "Monat", allMonths: "Gesamter Zeitraum",
    shareHint: "Anteil an allen Gerichten des Speiseplans. Vegan zählt nicht zusätzlich als vegetarisch.",
    shareValue: (a, b, n) => `${a} % vegan · ${b} % vegetarisch · ${n} Gerichte`, shareFixed: "Festes Angebot, jeder Tag gleich",
    mensenTitle: "Mensen", colMensa: "Mensa", colEntries: "Einträge", colDishes: "Gerichte", colFirst: "Erster Tag", colLast: "Letzter Tag",
    aboutTitle: "So wird gezählt",
    about1: "Gezählt wird, wie oft ein Gericht im veröffentlichten Speiseplan steht: einmal je Tag und Mensa, auch für die kommenden Tage. Ein Eintrag im Plan heißt nicht, dass das Gericht wirklich ausgegeben wurde.",
    about2: "Gerichte gelten als gleich, wenn ihr Name bis auf Groß- und Kleinschreibung und Leerzeichen übereinstimmt. Kleine Änderungen im Namen ergeben ein neues Gericht.",
    about3: "PIER 16 hat einen festen Plan ohne Tage. Diese Gerichte stehen als „Festes Angebot“ in der Liste und zählen nicht zur Häufigkeit.",
    about4: "Diese Seite ist keine Allergen-Auskunft.",
    source: "Quelle:", facts: "Hier stehen nur Fakten (Namen, Preise, Kennzeichen), keine übernommenen Texte oder Bilder.",
    affiliation: "Keine Verbindung zur OvGU oder zum Studentenwerk Magdeburg.", code: "Quellcode und Daten",
    built: (d) => `Stand ${d}`, close: "Schließen",
    count: "Im Plan", first: "Zuerst gesehen", last: "Zuletzt gesehen",
    priceHistory: "Preisverlauf", priceNow: "Aktuelle Preise", noPrice: "Für dieses Gericht ist kein Preis je Gruppe bekannt.",
    priceSame: (d) => `Preis unverändert seit ${d}.`, whereTitle: "In welchen Mensen",
    colFrom: "Ab", students: "Studierende", staff: "Bedienstete", guests: "Gäste",
    tags: { vegan: "Vegan", vegetarisch: "Vegetarisch", knoblauch: "Knoblauch", gefluegel: "Geflügel", schwein: "Schwein", fisch: "Fisch", rind: "Rind", alkohol: "Alkohol", suppe: "Suppe", wild: "Wild" },
  },
  en: {
    title: "Mensa statistics Magdeburg",
    lead: "What is on the menu in the canteens of Studentenwerk Magdeburg: recorded every day, counted and searchable.",
    since: (d) => `The data starts with the first scrape on ${d}. Older menus are not included, so the numbers only grow from there.`,
    noData: "No data yet.",
    loadFailed: "The data could not be loaded.",
    fallback: (n) => ` ${n} daily menus come from the Studentenwerk's test server because the main site could not be reached.`,
    themeToggle: "Light or dark", langSwitch: "Auf Deutsch umschalten", overview: "Overview",
    tileDays: "days recorded", tileDishes: "different dishes", tileEntries: "menu entries", tileMensen: "canteens",
    dishes: "Dishes", search: "Search", searchHint: "e.g. curry sausage", mensa: "Canteen", allMensen: "All canteens",
    kindFilter: "Kind", all: "All", vegan: "Vegan", vegetarian: "Vegetarian", other: "Other",
    topTitle: "Most frequent dishes", hits: (n) => `${n} ${n === 1 ? "result" : "results"}`, noHits: "Nothing found.",
    more: (n) => `Show ${n} more`, times: (n) => `${n}×`,
    lastSeen: (d) => `last ${d}`, inMensen: (n) => `in ${n} ${n === 1 ? "canteen" : "canteens"}`, fixedOffer: "Fixed menu",
    shareTitle: "Vegan and vegetarian by canteen", month: "Month", allMonths: "Whole period",
    shareHint: "Share of all dishes on the menu. Vegan dishes are not counted again as vegetarian.",
    shareValue: (a, b, n) => `${a}% vegan · ${b}% vegetarian · ${n} dishes`, shareFixed: "Fixed menu, the same every day",
    mensenTitle: "Canteens", colMensa: "Canteen", colEntries: "Entries", colDishes: "Dishes", colFirst: "First day", colLast: "Last day",
    aboutTitle: "How it is counted",
    about1: "The count is how often a dish is on the published menu: once per day and canteen, including the coming days. An entry on the menu does not mean the dish was really served.",
    about2: "Dishes count as the same when their German names match apart from upper and lower case and spaces. A small change in the name makes a new dish.",
    about3: "PIER 16 has a fixed menu without days. Its dishes appear in the list as “Fixed menu” and don't count towards frequency.",
    about4: "This page is not allergen information.",
    source: "Source:", facts: "Only facts are shown here (names, prices, tags), no copied texts or images.",
    affiliation: "Not affiliated with OvGU or Studentenwerk Magdeburg.", code: "Source code and data",
    built: (d) => `Updated ${d}`, close: "Close",
    count: "On the menu", first: "First seen", last: "Last seen",
    priceHistory: "Price history", priceNow: "Current prices", noPrice: "No price per group is known for this dish.",
    priceSame: (d) => `Price unchanged since ${d}.`, whereTitle: "In which canteens",
    colFrom: "From", students: "Students", staff: "Staff", guests: "Guests",
    tags: { vegan: "Vegan", vegetarisch: "Vegetarian", knoblauch: "Garlic", gefluegel: "Poultry", schwein: "Pork", fisch: "Fish", rind: "Beef", alkohol: "Alcohol", suppe: "Soup", wild: "Game" },
  },
};

const GROUPS = ["students", "staff", "guests"];
const PAGE = 25;
const $ = (id) => document.getElementById(id);

const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* private mode: only this visit */ } },
};

const state = {
  lang: store.get("lang") === "en" ? "en" : "de",
  summary: null, dishes: [], byKey: new Map(),
  query: "", mensa: "", kind: "", shown: PAGE, month: "", openKey: null,
};
const t = () => TEXT[state.lang];

/** Builds an element; all data goes in as text, never as markup. */
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "style") el.style.cssText = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  el.append(...children.flat().filter((c) => c !== null && c !== undefined));
  return el;
}

const locale = () => (state.lang === "de" ? "de-DE" : "en-GB");
const asDate = (iso) => new Date(`${iso}T12:00:00Z`);
const fmtDate = (iso) => new Intl.DateTimeFormat(locale(), { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(asDate(iso));
const fmtMonth = (ym) => new Intl.DateTimeFormat(locale(), { month: "long", year: "numeric", timeZone: "UTC" }).format(asDate(`${ym}-15`));
const fmtNum = (n) => new Intl.NumberFormat(locale()).format(n);
const fmtPrice = (cents) => (cents === null || cents === undefined ? "–" : new Intl.NumberFormat(locale(), { style: "currency", currency: "EUR" }).format(cents / 100));
const nameOf = (text) => text[state.lang] || text.de;
const mensaName = (id) => { const m = state.summary.mensen.find((x) => x.id === id); return m ? nameOf(m.name) : id; };
const tagLabel = (key) => t().tags[key] || state.summary.tags[key] || key;
const fold = (s) => s.toLocaleLowerCase("de").replace(/ß/g, "ss").normalize("NFD").replace(/\p{M}/gu, "");

/* ---------- static text ---------- */

function applyText() {
  document.documentElement.lang = state.lang;
  document.title = t().title;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t()[el.dataset.i18n]; });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t()[el.dataset.i18nPlaceholder]; });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t()[el.dataset.i18nAria]));
  $("lang").textContent = state.lang === "de" ? "EN" : "DE";
  $("lang").setAttribute("aria-label", t().langSwitch);
  $("tiles").setAttribute("aria-label", t().overview);
}

function renderAll() {
  applyText();
  const s = state.summary;
  if (!s) return;
  if (!s.firstDate) { $("since").textContent = t().noData; }
  else $("since").textContent = t().since(fmtDate(s.firstDate)) + (s.fallbackFiles ? t().fallback(s.fallbackFiles) : "");
  $("built").textContent = t().built(fmtDate(s.generated.slice(0, 10)));
  renderTiles();
  renderSelects();
  renderKinds();
  renderList();
  renderShares();
  renderMensen();
  if (state.openKey) renderDetail();
}

function renderTiles() {
  const s = state.summary;
  const tile = (value, label) => h("div", { class: "tile" }, h("b", {}, fmtNum(value)), h("span", {}, label));
  $("tiles").replaceChildren(
    tile(s.days, t().tileDays), tile(s.dishes, t().tileDishes), tile(s.entries, t().tileEntries), tile(s.mensen.length, t().tileMensen),
  );
}

function renderSelects() {
  const s = state.summary;
  $("mensa").replaceChildren(
    h("option", { value: "" }, t().allMensen),
    ...s.mensen.map((m) => h("option", { value: m.id }, nameOf(m.name))),
  );
  $("mensa").value = state.mensa;
  const months = [...new Set(s.shares.map((x) => x.month))].sort().reverse();
  $("month").replaceChildren(
    h("option", { value: "" }, t().allMonths),
    ...months.map((m) => h("option", { value: m }, fmtMonth(m))),
  );
  $("month").value = state.month;
}

function renderKinds() {
  const kinds = [["", t().all], ["vegan", t().vegan], ["vegetarian", t().vegetarian]];
  $("kinds").replaceChildren(...kinds.map(([value, label]) => h("button", {
    type: "button", class: "chip", "aria-pressed": String(state.kind === value),
    onclick: () => { state.kind = value; state.shown = PAGE; renderKinds(); renderList(); },
  }, label)));
}

/* ---------- dish list ---------- */

/** How often the dish counts under the current Mensa filter. */
const countOf = (d) => (state.mensa ? d.mensen[state.mensa] || 0 : d.count);

function matches() {
  const words = fold(state.query).split(/\s+/).filter(Boolean);
  const isFixed = state.mensa && state.summary.mensen.find((m) => m.id === state.mensa)?.fixed;
  const result = state.dishes.filter((d) => {
    if (state.mensa && !d.mensen[state.mensa] && !d.fixedIn.includes(state.mensa)) return false;
    if (state.kind === "vegan" && !d.tags.includes("vegan")) return false;
    if (state.kind === "vegetarian" && !d.tags.includes("vegetarisch") && !d.tags.includes("vegan")) return false;
    // The ranking is about real days; fixed-menu dishes show up when looked for.
    if (!words.length && !isFixed && countOf(d) === 0) return false;
    return words.every((w) => d.search.includes(w));
  });
  return result.sort((a, b) => countOf(b) - countOf(a) || a.name.de.localeCompare(b.name.de, "de"));
}

function renderList() {
  const found = matches();
  $("list-title").textContent = state.query.trim() ? t().hits(found.length) : t().topTitle;
  const max = Math.max(1, ...found.map(countOf));
  const rows = found.slice(0, state.shown).map((d) => {
    const n = countOf(d);
    const where = Object.keys(d.mensen).length;
    const meta = [
      n === 0 ? null : t().lastSeen(fmtDate(d.last)),
      where ? t().inMensen(where) : null,
      d.fixedIn.length ? t().fixedOffer : null,
    ].filter(Boolean).join(" · ");
    return h("li", {}, h("button", { type: "button", class: "dish", onclick: () => openDish(d.key) },
      h("span", { class: "dish-name" }, nameOf(d.name)),
      h("span", { class: "dish-count" }, n ? t().times(n) : ""),
      n ? h("span", { class: "bar", "aria-hidden": "true" }, h("i", { style: `width:${(n / max) * 100}%` })) : null,
      h("span", { class: "dish-meta" }, meta),
    ));
  });
  $("list").replaceChildren(...rows);
  if (!rows.length) $("list").replaceChildren(h("li", {}, h("p", { class: "empty" }, t().noHits)));
  const rest = found.length - state.shown;
  $("more").hidden = rest <= 0;
  $("more").textContent = t().more(Math.min(rest, PAGE));
}

/* ---------- shares ---------- */

function renderShares() {
  const s = state.summary;
  const swatches = [["--vegan", t().vegan], ["--vegetarian", t().vegetarian], ["--other", t().other]];
  $("share-legend").replaceChildren(...swatches.map(([color, label]) => h("li", {},
    h("span", { class: "swatch", style: `background:var(${color})` }), label)));

  const rows = new Map();
  for (const x of s.shares) {
    if (state.month && x.month !== state.month) continue;
    const row = rows.get(x.mensa) || { mensa: x.mensa, vegan: 0, vegetarian: 0, other: 0 };
    row.vegan += x.vegan; row.vegetarian += x.vegetarian; row.other += x.other;
    rows.set(x.mensa, row);
  }
  const list = [...rows.values()].map((r) => ({ ...r, total: r.vegan + r.vegetarian + r.other }))
    .sort((a, b) => (b.vegan + b.vegetarian) / b.total - (a.vegan + a.vegetarian) / a.total);
  $("shares").replaceChildren(...list.map((r) => {
    const pct = (v) => Math.round((v / r.total) * 100);
    const fixed = s.mensen.find((m) => m.id === r.mensa)?.fixed;
    const value = t().shareValue(pct(r.vegan), pct(r.vegetarian), fmtNum(r.total));
    const part = (v, color) => (v ? h("i", { style: `flex:${v} 1 0;background:var(${color})` }) : null);
    return h("li", {},
      h("div", { class: "share-head" }, h("span", {}, mensaName(r.mensa)), h("span", {}, new Intl.NumberFormat(locale(), { style: "percent" }).format((r.vegan + r.vegetarian) / r.total))),
      h("div", { class: "stack", role: "img", "aria-label": value, "data-tip": fixed ? `${value}\n${t().shareFixed}` : value },
        part(r.vegan, "--vegan"), part(r.vegetarian, "--vegetarian"), part(r.other, "--other")),
    );
  }));
}

/* ---------- Mensen ---------- */

function renderMensen() {
  const head = h("thead", {}, h("tr", {},
    h("th", { scope: "col" }, t().colMensa), h("th", { scope: "col", class: "num" }, t().colEntries), h("th", { scope: "col", class: "num" }, t().colDishes),
    h("th", { scope: "col", class: "num" }, t().colFirst), h("th", { scope: "col", class: "num" }, t().colLast)));
  const body = h("tbody", {}, state.summary.mensen.map((m) => h("tr", {},
    h("th", { scope: "row" }, nameOf(m.name)),
    h("td", { class: "num" }, m.fixed ? t().fixedOffer : fmtNum(m.entries)),
    h("td", { class: "num" }, fmtNum(m.dishes)),
    h("td", { class: "num" }, fmtDate(m.first)),
    h("td", { class: "num" }, fmtDate(m.last)))));
  $("mensen").replaceChildren(head, body);
}

/* ---------- dish detail ---------- */

function openDish(key) {
  state.openKey = key;
  if (location.hash !== `#${dishHash(key)}`) history.pushState(null, "", `#${dishHash(key)}`);
  renderDetail();
  if (!$("detail").open) $("detail").showModal();
}

const dishHash = (key) => `dish=${encodeURIComponent(key)}`;

function closeDish() {
  if ($("detail").open) $("detail").close();
}

function renderDetail() {
  const d = state.byKey.get(state.openKey);
  if (!d) return;
  $("detail-name").textContent = nameOf(d.name);
  const fact = (label, value) => h("div", {}, h("dt", {}, label), h("dd", {}, value));
  const where = Object.entries(d.mensen).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...where.map(([, n]) => n));
  const whereRows = where.map(([id, n]) => h("li", {},
    h("span", {}, mensaName(id)), h("b", {}, t().times(n)),
    h("span", { class: "bar", "aria-hidden": "true" }, h("i", { style: `width:${(n / max) * 100}%` }))));
  const fixedRows = d.fixedIn.map((id) => h("li", {}, h("span", {}, mensaName(id)), h("span", {}, t().fixedOffer)));
  $("detail-body").replaceChildren(
    d.tags.length ? h("ul", { class: "tags" }, d.tags.map((k) => h("li", {}, tagLabel(k)))) : "",
    h("dl", { class: "facts" },
      fact(t().count, d.count ? t().times(d.count) : t().fixedOffer),
      fact(t().first, fmtDate(d.first)),
      fact(t().last, fmtDate(d.last))),
    h("h3", {}, t().whereTitle),
    h("ul", { class: "bars" }, whereRows, fixedRows),
    h("h3", {}, t().priceHistory),
    priceSection(d),
  );
}

function priceSection(d) {
  if (!d.prices.length) return h("p", { class: "hint" }, t().noPrice);
  const box = h("div", {});
  const labels = GROUPS.map((g) => t()[g]);
  if (d.prices.length === 1) {
    box.append(h("p", { class: "hint" }, t().priceSame(fmtDate(d.prices[0][0]))));
  } else {
    const legend = h("ul", { class: "legend" }, GROUPS.map((g, i) => h("li", {},
      h("span", { class: "line-swatch", style: `border-color:var(--series-${i + 1});border-top-style:${DASH_CSS[i]}` }), labels[i])));
    box.append(legend, priceChart(d));
  }
  const header = h("tr", {}, h("th", { scope: "col" }, t().colFrom), labels.map((l) => h("th", { scope: "col", class: "num" }, l)));
  const rows = [...d.prices].reverse().map((p) => h("tr", {},
    h("th", { scope: "row" }, fmtDate(p[0])), p.slice(1).map((c) => h("td", { class: "num" }, fmtPrice(c)))));
  box.append(h("div", { class: "table-scroll" }, h("table", { class: "prices" }, h("thead", {}, header), h("tbody", {}, rows))));
  return box;
}

const DASH_CSS = ["solid", "dashed", "dotted"];
const DASH_SVG = [null, "6 4", "2 4"];

/** A step line per price group over time; prices hold until the next change. */
function priceChart(d) {
  const svgNs = "http://www.w3.org/2000/svg";
  const s = (tag, attrs, text) => {
    const el = document.createElementNS(svgNs, tag);
    for (const [k, v] of Object.entries(attrs)) if (v !== null) el.setAttribute(k, v);
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const W = 640, H = 220, L = 52, R = 12, T = 12, B = 26;
  const points = d.prices.map(([date, ...cents]) => ({ time: asDate(date).getTime(), date, cents }));
  const end = Math.max(asDate(d.last).getTime(), points.at(-1).time);
  const x0 = points[0].time;
  const values = points.flatMap((p) => p.cents).filter((c) => c !== null);
  const range = Math.max(...values) - Math.min(...values);
  const step = [10, 20, 50, 100, 200, 500, 1000].find((c) => range / c <= 4) || 2000;
  const lo = Math.floor(Math.min(...values) / step) * step;
  const hi = Math.max(lo + step, Math.ceil(Math.max(...values) / step) * step);
  const x = (time) => L + ((time - x0) / Math.max(1, end - x0)) * (W - L - R);
  const y = (c) => T + (1 - (c - lo) / (hi - lo)) * (H - T - B);

  const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t().priceHistory });
  for (let c = lo; c <= hi; c += step) {
    svg.append(s("line", { class: "grid", x1: L, x2: W - R, y1: y(c), y2: y(c) }), s("text", { x: L - 8, y: y(c) + 4, "text-anchor": "end" }, fmtPrice(c)));
  }
  svg.append(s("text", { x: L, y: H - 6 }, fmtDate(points[0].date)), s("text", { x: W - R, y: H - 6, "text-anchor": "end" }, fmtDate(new Date(end).toISOString().slice(0, 10))));

  GROUPS.forEach((_, g) => {
    let path = "";
    let last = null;
    points.forEach((p) => {
      const c = p.cents[g];
      if (c === null) { last = null; return; }
      path += last === null ? `M${x(p.time)} ${y(c)}` : `H${x(p.time)}V${y(c)}`;
      last = c;
    });
    if (path) svg.append(s("path", { d: `${path}H${x(end)}`, fill: "none", stroke: `var(--series-${g + 1})`, "stroke-width": 2, "stroke-dasharray": DASH_SVG[g], "stroke-linejoin": "round" }));
  });

  const cross = s("line", { class: "cross", y1: T, y2: H - B, visibility: "hidden" });
  svg.append(cross);
  const move = (event) => {
    const box = svg.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * W;
    const time = x0 + ((px - L) / (W - L - R)) * (end - x0);
    const active = [...points].reverse().find((p) => p.time <= time) || points[0];
    cross.setAttribute("x1", x(Math.min(end, Math.max(x0, time))));
    cross.setAttribute("x2", cross.getAttribute("x1"));
    cross.setAttribute("visibility", "visible");
    const lines = GROUPS.map((g, i) => `${t()[g]}: ${fmtPrice(active.cents[i])}`);
    showTip(`${t().colFrom} ${fmtDate(active.date)}\n${lines.join("\n")}`, event.clientX, event.clientY);
  };
  svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerdown", move);
  svg.addEventListener("pointerleave", () => { cross.setAttribute("visibility", "hidden"); hideTip(); });
  return h("div", { class: "chart" }, svg);
}

/* ---------- tooltip ---------- */

function showTip(text, cx, cy) {
  const tip = $("tip");
  // The dialog is in the top layer, so the tip has to live inside it to stay above.
  const host = $("detail").open ? $("detail") : document.body;
  if (tip.parentElement !== host) host.append(tip);
  tip.textContent = text;
  tip.hidden = false;
  const { width, height } = tip.getBoundingClientRect();
  tip.style.left = `${Math.max(8, Math.min(innerWidth - width - 8, cx + 12))}px`;
  tip.style.top = `${Math.max(8, cy - height - 12)}px`;
}
const hideTip = () => { $("tip").hidden = true; };

document.addEventListener("pointerover", (e) => {
  const el = e.target.closest?.("[data-tip]");
  if (el) showTip(el.dataset.tip, e.clientX, e.clientY);
  else if (!e.target.closest?.(".chart")) hideTip();
});
document.addEventListener("pointerdown", (e) => {
  const el = e.target.closest?.("[data-tip]");
  if (el) showTip(el.dataset.tip, e.clientX, e.clientY);
});

/* ---------- wiring ---------- */

function routeFromHash() {
  const match = location.hash.match(/^#dish=(.*)$/);
  const key = match ? decodeURIComponent(match[1]) : null;
  if (key && state.byKey.has(key)) openDish(key);
  else closeDish();
}

function wire() {
  $("q").addEventListener("input", (e) => { state.query = e.target.value; state.shown = PAGE; renderList(); });
  $("mensa").addEventListener("change", (e) => { state.mensa = e.target.value; state.shown = PAGE; renderList(); });
  $("month").addEventListener("change", (e) => { state.month = e.target.value; renderShares(); });
  $("more").addEventListener("click", () => { state.shown += PAGE; renderList(); });
  $("lang").addEventListener("click", () => {
    state.lang = state.lang === "de" ? "en" : "de";
    store.set("lang", state.lang);
    renderAll();
  });
  $("theme").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    store.set("theme", root.dataset.theme);
  });
  $("detail-close").addEventListener("click", closeDish);
  $("detail").addEventListener("click", (e) => { if (e.target === $("detail")) closeDish(); });
  $("detail").addEventListener("close", () => {
    state.openKey = null;
    hideTip();
    document.body.append($("tip"));
    if (location.hash) history.pushState(null, "", location.pathname + location.search);
  });
  addEventListener("hashchange", routeFromHash);
  addEventListener("popstate", routeFromHash);
}

async function main() {
  wire();
  applyText();
  try {
    const [summary, dishes] = await Promise.all(["stats/summary.json", "stats/dishes.json"].map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${url}: ${response.status}`);
      return response.json();
    }));
    dishes.forEach((d) => { d.search = fold(`${d.name.de} ${d.name.en}`); });
    state.summary = summary;
    state.dishes = dishes;
    state.byKey = new Map(dishes.map((d) => [d.key, d]));
  } catch (error) {
    console.error(error);
    $("since").textContent = t().loadFailed;
    return;
  }
  renderAll();
  routeFromHash();
}

main();
