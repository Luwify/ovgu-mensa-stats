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
    filterTitle: "Auswahl", once: "Gleiches Gericht am selben Tag nur einmal zählen",
    dishes: "Gerichte", search: "Suche", searchHint: "z. B. Currywurst", mensa: "Mensen", allMensen: "Alle",
    kindFilter: "Art", all: "Alle", vegan: "Vegan", vegetarian: "Vegetarisch", other: "Sonstige",
    topTitle: "Häufigste Gerichte", hits: (n) => `${n} Treffer`, noHits: "Nichts gefunden.",
    more: (n) => `${n} weitere anzeigen`, times: (n) => `${n}×`,
    lastSeen: (d) => `zuletzt ${d}`, inMensen: (n) => `in ${n} ${n === 1 ? "Mensa" : "Mensen"}`, fixedOffer: "Festes Angebot",
    shareTitle: "Vegan und vegetarisch je Mensa", month: "Monat", allMonths: "Gesamter Zeitraum",
    shareHint: "Anteil an allen Gerichten des Speiseplans der ausgewählten Mensen. Vegan zählt nicht zusätzlich als vegetarisch.",
    shareTotal: "Auswahl gesamt",
    noMenus: (n, list) => `An ${n} ${n === 1 ? "Werktag" : "Werktagen"} steht für diese Auswahl nichts im Speiseplan (geschlossen, Feiertag oder nicht erfasst): ${list}`,
    notInSelection: "In dieser Auswahl nicht im Plan.",
    shareValue: (a, b, n) => `${a} % vegan · ${b} % vegetarisch · ${n} Gerichte`, shareFixed: "Festes Angebot, jeder Tag gleich",
    mensenTitle: "Mensen", colMensa: "Mensa", colEntries: "Einträge", colDishes: "Gerichte", colFirst: "Erster Tag", colLast: "Letzter Tag",
    aboutTitle: "So wird gezählt",
    about1: "Gezählt wird, wie oft ein Gericht im veröffentlichten Speiseplan der ausgewählten Mensen steht, auch für die kommenden Tage. Ist „Gleiches Gericht am selben Tag nur einmal zählen“ an, zählt ein Gericht in mehreren Mensen am selben Tag einmal, sonst je Mensa. Hat es dann nur in einer davon die Kennzeichnung vegan oder vegetarisch, gilt diese. Ein Eintrag im Plan heißt nicht, dass das Gericht wirklich ausgegeben wurde.",
    about2: "Gerichte gelten als gleich, wenn ihr Name wie bei den Favoriten der App übereinstimmt: Groß- und Kleinschreibung, Leerzeichen, Satzzeichen am Anfang und Ende und vorangestellte Hinweise zählen nicht. Andere Änderungen im Namen ergeben ein neues Gericht.",
    aboutPrice: "Der Preisverlauf zeigt einen Wert je Tag. Unterscheiden sich die Preise zwischen den ausgewählten Mensen, gilt je Gruppe der niedrigste.",
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
    filterTitle: "Selection", once: "Count the same dish on the same day only once",
    dishes: "Dishes", search: "Search", searchHint: "e.g. curry sausage", mensa: "Canteens", allMensen: "All",
    kindFilter: "Kind", all: "All", vegan: "Vegan", vegetarian: "Vegetarian", other: "Other",
    topTitle: "Most frequent dishes", hits: (n) => `${n} ${n === 1 ? "result" : "results"}`, noHits: "Nothing found.",
    more: (n) => `Show ${n} more`, times: (n) => `${n}×`,
    lastSeen: (d) => `last ${d}`, inMensen: (n) => `in ${n} ${n === 1 ? "canteen" : "canteens"}`, fixedOffer: "Fixed menu",
    shareTitle: "Vegan and vegetarian by canteen", month: "Month", allMonths: "Whole period",
    shareHint: "Share of all dishes on the menus of the selected canteens. Vegan dishes are not counted again as vegetarian.",
    shareTotal: "Selection overall",
    noMenus: (n, list) => `On ${n} ${n === 1 ? "weekday" : "weekdays"} this selection has nothing on the menu (closed, holiday or not recorded): ${list}`,
    notInSelection: "Not on the menu in this selection.",
    shareValue: (a, b, n) => `${a}% vegan · ${b}% vegetarian · ${n} dishes`, shareFixed: "Fixed menu, the same every day",
    mensenTitle: "Canteens", colMensa: "Canteen", colEntries: "Entries", colDishes: "Dishes", colFirst: "First day", colLast: "Last day",
    aboutTitle: "How it is counted",
    about1: "The count is how often a dish is on the published menus of the selected canteens, including the coming days. With “Count the same dish on the same day only once” on, a dish in several canteens on one day counts once, otherwise once per canteen. If only one of them tags it vegan or vegetarian, that tag counts. An entry on the menu does not mean the dish was really served.",
    about2: "Dishes count as the same when their German names match like the favorites of the app: upper and lower case, spaces, punctuation at the ends and leading labels don't matter. Any other change in the name makes a new dish.",
    aboutPrice: "The price history shows one value per day. If prices differ between the selected canteens, the lowest per group counts.",
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
  data: null, byKey: new Map(), flags: null, view: null,
  mensen: [], once: true, // the filters every statistic follows; no Mensen = all
  query: "", kind: "", shown: PAGE, month: "", openKey: null,
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
const tagLabel = (key) => t().tags[key] || state.data.tags[key] || key;
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
  const d = state.data;
  if (!d) return;
  const first = d.dates[0];
  if (!first) $("since").textContent = t().noData;
  else $("since").textContent = t().since(fmtDate(first)) + (d.fallbackFiles ? t().fallback(d.fallbackFiles) : "");
  $("built").textContent = t().built(fmtDate(d.generated.slice(0, 10)));
  renderFilters();
  renderView();
}

/** Everything that depends on the selection. */
function renderView() {
  renderTiles();
  renderGaps();
  renderMonths();
  renderKinds();
  renderList();
  renderShares();
  renderMensen();
  if (state.openKey) renderDetail();
}

/* ---------- filters ---------- */

/** After a change of Mensen or the toggle: one pass over the data, then every view reads from the result. */
function recompute() {
  state.flags = MensaStats.mask(state.data, state.mensen);
  state.view = MensaStats.compute(state.data, state.flags, state.once);
}

function selectionChanged() {
  state.shown = PAGE;
  recompute();
  saveFilters();
  renderFilters();
  renderView();
}

function toggleMensa(id) {
  state.mensen = state.mensen.includes(id) ? state.mensen.filter((m) => m !== id) : [...state.mensen, id];
  // Every Mensa picked is the same as all, and keeps the link short.
  if (state.mensen.length === state.data.mensen.length) state.mensen = [];
  selectionChanged();
}

function renderFilters() {
  const chip = (label, pressed, onclick, id) => h("button", {
    type: "button", class: "chip", "aria-pressed": String(pressed), "data-mensa": id, onclick,
  }, label);
  $("mensa-chips").replaceChildren(
    chip(t().allMensen, !state.mensen.length, () => { state.mensen = []; selectionChanged(); }, ""),
    ...state.data.mensen.map((m) => chip(nameOf(m.name), state.mensen.includes(m.id), () => toggleMensa(m.id), m.id)),
  );
  $("once").checked = state.once;
}

/** The URL says what is shown, so a link reproduces the view; the browser remembers it for the next visit. */
function saveFilters() {
  const query = new URLSearchParams();
  if (state.mensen.length) query.set("m", state.data.mensen.filter((m) => state.mensen.includes(m.id)).map((m) => m.id).join(","));
  if (!state.once) query.set("once", "0");
  if (state.kind) query.set("kind", state.kind);
  if (state.month) query.set("month", state.month);
  if (state.query.trim()) query.set("q", state.query.trim());
  const text = query.toString().replace(/%2C/g, ",");
  history.replaceState(history.state, "", `${location.pathname}${text ? `?${text}` : ""}${location.hash}`);
  store.set("filters", JSON.stringify({ m: state.mensen, once: state.once, kind: state.kind, month: state.month }));
}

function loadFilters() {
  const query = new URLSearchParams(location.search);
  const fromUrl = ["m", "once", "kind", "month", "q"].some((k) => query.has(k));
  let saved = {};
  try { saved = JSON.parse(store.get("filters")) || {}; } catch { /* unreadable: defaults */ }
  const known = new Set(state.data.mensen.map((m) => m.id));
  const list = fromUrl ? (query.get("m") || "").split(",") : Array.isArray(saved.m) ? saved.m : [];
  state.mensen = [...new Set(list)].filter((id) => known.has(id));
  if (state.mensen.length === known.size) state.mensen = [];
  state.once = fromUrl ? query.get("once") !== "0" : saved.once !== false;
  const kind = fromUrl ? query.get("kind") : saved.kind;
  state.kind = kind === "vegan" || kind === "vegetarian" ? kind : "";
  const month = fromUrl ? query.get("month") : saved.month;
  state.month = state.data.months.includes(month) ? month : "";
  state.query = query.get("q") || "";
  $("q").value = state.query;
}

function renderTiles() {
  const v = state.view;
  const tile = (value, label) => h("div", { class: "tile" }, h("b", {}, fmtNum(value)), h("span", {}, label));
  $("tiles").replaceChildren(
    tile(v.days, t().tileDays), tile(v.distinct, t().tileDishes), tile(v.entries, t().tileEntries), tile(v.selected, t().tileMensen),
  );
}

function renderGaps() {
  const days = state.view.noMenuDays;
  $("gaps").hidden = !days.length;
  if (!days.length) return;
  const shown = days.slice(-6).map(fmtDate).join(", ");
  $("gaps").textContent = t().noMenus(days.length, days.length > 6 ? `… ${shown}` : shown);
}

function renderMonths() {
  $("month").replaceChildren(
    h("option", { value: "" }, t().allMonths),
    ...[...state.data.months].reverse().map((m) => h("option", { value: m }, fmtMonth(m))),
  );
  $("month").value = state.month;
}

function renderKinds() {
  const kinds = [["", t().all], ["vegan", t().vegan], ["vegetarian", t().vegetarian]];
  $("kinds").replaceChildren(...kinds.map(([value, label]) => h("button", {
    type: "button", class: "chip", "aria-pressed": String(state.kind === value),
    onclick: () => { state.kind = value; state.shown = PAGE; saveFilters(); renderKinds(); renderList(); },
  }, label)));
}

/* ---------- dish list ---------- */

function matches() {
  const words = fold(state.query).split(/\s+/).filter(Boolean);
  const onlyFixed = state.view.mensen.every((m) => m.fixed);
  return state.view.ranked.filter(({ dish: d, count }) => {
    if (state.kind === "vegan" && !d.tags.includes("vegan")) return false;
    if (state.kind === "vegetarian" && !d.tags.includes("vegetarisch") && !d.tags.includes("vegan")) return false;
    // The ranking is about real days; fixed-menu dishes show up when looked for.
    if (!words.length && !onlyFixed && count === 0) return false;
    return words.every((w) => d.search.includes(w));
  });
}

function renderList() {
  const found = matches();
  $("list-title").textContent = state.query.trim() ? t().hits(found.length) : t().topTitle;
  const max = Math.max(1, ...found.map((r) => r.count));
  const rows = found.slice(0, state.shown).map(({ dish: d, count: n, last, fixedHere }) => {
    const meta = [n === 0 ? null : t().lastSeen(fmtDate(state.data.dates[last])), fixedHere ? t().fixedOffer : null].filter(Boolean).join(" · ");
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

function shareRow(label, [vegan, vegetarian, other], tip, total) {
  const sum = vegan + vegetarian + other;
  const pct = (v) => Math.round((v / sum) * 100);
  const value = t().shareValue(pct(vegan), pct(vegetarian), fmtNum(sum));
  const part = (v, color) => (v ? h("i", { style: `flex:${v} 1 0;background:var(${color})` }) : null);
  return h("li", { class: total ? "total" : null },
    h("div", { class: "share-head" }, h("span", {}, label),
      h("span", {}, new Intl.NumberFormat(locale(), { style: "percent" }).format((vegan + vegetarian) / sum))),
    h("div", { class: "stack", role: "img", "aria-label": value, "data-tip": tip ? `${value}\n${tip}` : value },
      part(vegan, "--vegan"), part(vegetarian, "--vegetarian"), part(other, "--other")),
  );
}

function renderShares() {
  const swatches = [["--vegan", t().vegan], ["--vegetarian", t().vegetarian], ["--other", t().other]];
  $("share-legend").replaceChildren(...swatches.map(([color, label]) => h("li", {},
    h("span", { class: "swatch", style: `background:var(${color})` }), label)));

  const month = state.month ? state.data.months.indexOf(state.month) : null;
  const plant = ([a, b, c]) => (a + b) / (a + b + c);
  const rows = state.view.mensen
    .map((m) => ({ m, share: MensaStats.shareOf(state.data, state.view, m.index, month) }))
    .filter((r) => r.share.some(Boolean))
    .sort((a, b) => plant(b.share) - plant(a.share));
  const all = MensaStats.shareOf(state.data, state.view, null, month);
  $("shares").replaceChildren(
    rows.length > 1 && all.some(Boolean) ? shareRow(t().shareTotal, all, null, true) : "",
    ...rows.map((r) => shareRow(nameOf(r.m.name), r.share, r.m.fixed ? t().shareFixed : null, false)),
  );
}

/* ---------- Mensen ---------- */

function renderMensen() {
  const head = h("thead", {}, h("tr", {},
    h("th", { scope: "col" }, t().colMensa), h("th", { scope: "col", class: "num" }, t().colEntries), h("th", { scope: "col", class: "num" }, t().colDishes),
    h("th", { scope: "col", class: "num" }, t().colFirst), h("th", { scope: "col", class: "num" }, t().colLast)));
  const body = h("tbody", {}, state.view.mensen.map((m) => h("tr", {},
    h("th", { scope: "row" }, nameOf(m.name)),
    h("td", { class: "num" }, m.fixed ? t().fixedOffer : fmtNum(m.entries)),
    h("td", { class: "num" }, fmtNum(m.dishes)),
    h("td", { class: "num" }, m.first ? fmtDate(m.first) : "–"),
    h("td", { class: "num" }, m.last ? fmtDate(m.last) : "–"))));
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
  const dish = state.byKey.get(state.openKey);
  if (!dish) return;
  const d = MensaStats.detail(state.data, dish, state.flags, state.once);
  $("detail-name").textContent = nameOf(dish.name);
  const fact = (label, value) => h("div", {}, h("dt", {}, label), h("dd", {}, value));
  const max = Math.max(1, ...d.where.map((w) => w.count));
  const whereRows = d.where.map((w) => h("li", {},
    h("span", {}, nameOf(w.mensa.name)), h("b", {}, t().times(w.count)),
    h("span", { class: "bar", "aria-hidden": "true" }, h("i", { style: `width:${(w.count / max) * 100}%` }))));
  const fixedRows = d.fixedIn.map((m) => h("li", {}, h("span", {}, nameOf(m.name)), h("span", {}, t().fixedOffer)));
  const nowhere = !d.first;
  $("detail-body").replaceChildren(
    dish.tags.length ? h("ul", { class: "tags" }, dish.tags.map((k) => h("li", {}, tagLabel(k)))) : "",
    nowhere ? h("p", { class: "hint" }, t().notInSelection) : "",
    nowhere ? "" : h("dl", { class: "facts" },
      fact(t().count, d.count ? t().times(d.count) : t().fixedOffer),
      fact(t().first, fmtDate(d.first)),
      fact(t().last, fmtDate(d.last))),
    nowhere ? "" : h("h3", {}, t().whereTitle),
    nowhere ? "" : h("ul", { class: "bars" }, whereRows, fixedRows),
    nowhere ? "" : h("h3", {}, t().priceHistory),
    nowhere ? "" : priceSection(d),
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
  $("q").addEventListener("input", (e) => { state.query = e.target.value; state.shown = PAGE; saveFilters(); renderList(); });
  $("once").addEventListener("change", (e) => { state.once = e.target.checked; selectionChanged(); });
  $("month").addEventListener("change", (e) => { state.month = e.target.value; saveFilters(); renderShares(); });
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
    const response = await fetch("stats/data.json");
    if (!response.ok) throw new Error(`data.json: ${response.status}`);
    const data = MensaStats.prepare(await response.json());
    data.dishes.forEach((d) => { d.search = fold(`${d.name.de} ${d.name.en}`); });
    state.data = data;
    state.byKey = new Map(data.dishes.map((d) => [d.key, d]));
  } catch (error) {
    console.error(error);
    $("since").textContent = t().loadFailed;
    return;
  }
  loadFilters();
  recompute();
  saveFilters();
  renderAll();
  routeFromHash();
}

main();
