"use strict";

/**
 * All counting of the site, for any choice of Mensen. Pure: no DOM, so tests can call it in the page. One pass over the
 * records of data.json (see aggregate() in scripts/build_site.py), which a phone does in a few milliseconds.
 */
const MensaStats = (() => {
  const KINDS = 3; // vegan, vegetarian, other
  const STRIDE = 4; // day, mensa, price, kind

  /** Adds what every view needs; call once after loading. */
  function prepare(data) {
    const months = [...new Set(data.dates.map((d) => d.slice(0, 7)))].sort();
    const monthIndex = new Map(months.map((m, i) => [m, i]));
    data.months = months;
    data.dayMonth = Uint16Array.from(data.dates, (d) => monthIndex.get(d.slice(0, 7)));
    let from = Infinity;
    let to = -1;
    data.dishes.forEach((dish) => {
      for (let i = 0; i < dish.occ.length; i += STRIDE) {
        if (dish.occ[i] < from) from = dish.occ[i];
        if (dish.occ[i] > to) to = dish.occ[i];
      }
    });
    data.datedRange = to < 0 ? null : [from, to];
    return data;
  }

  /** A flag per Mensa; no ids (or none known) means all of them. */
  function mask(data, ids) {
    const flags = new Uint8Array(data.mensen.length);
    data.mensen.forEach((m, i) => { if (ids.includes(m.id)) flags[i] = 1; });
    if (!flags.some(Boolean)) flags.fill(1);
    return flags;
  }

  function compute(data, flags, once) {
    const mensen = data.mensen.length;
    const months = data.months.length;
    const perMensa = new Uint32Array(mensen * months * KINDS);
    const combined = new Uint32Array(months * KINDS);
    const mensaEntries = new Uint32Array(mensen);
    const mensaDishes = new Uint32Array(mensen);
    const mensaFirst = new Int32Array(mensen).fill(-1);
    const mensaLast = new Int32Array(mensen).fill(-1);
    const stamp = new Int32Array(mensen).fill(-1);
    const activeDay = new Uint8Array(data.dates.length);
    const ranked = [];
    let entries = 0;
    let distinct = 0;

    const touch = (m, day, index) => {
      if (mensaFirst[m] < 0 || day < mensaFirst[m]) mensaFirst[m] = day;
      if (day > mensaLast[m]) mensaLast[m] = day;
      if (stamp[m] !== index) { stamp[m] = index; mensaDishes[m]++; }
    };

    data.dishes.forEach((dish, index) => {
      let count = 0;
      let first = -1;
      let last = -1;
      const add = (day, kind) => {
        count++;
        activeDay[day] = 1;
        combined[data.dayMonth[day] * KINDS + kind]++;
      };
      let groupDay = -1; // the day being collected while counting once
      let groupKind = 0;
      const occ = dish.occ;
      for (let i = 0; i < occ.length; i += STRIDE) {
        const day = occ[i];
        const m = occ[i + 1];
        if (!flags[m]) continue;
        const kind = occ[i + 3];
        if (first < 0) first = day;
        last = day;
        mensaEntries[m]++;
        perMensa[(m * months + data.dayMonth[day]) * KINDS + kind]++;
        touch(m, day, index);
        if (!once) add(day, kind);
        else if (day !== groupDay) {
          if (groupDay >= 0) add(groupDay, groupKind);
          groupDay = day;
          groupKind = kind;
        } else if (kind < groupKind) groupKind = kind; // the most plant-based tag of that day
      }
      if (once && groupDay >= 0) add(groupDay, groupKind);

      const fixed = dish.fixed;
      let fixedHere = false;
      for (let i = 0; i < fixed.length; i += STRIDE) {
        const day = fixed[i];
        const m = fixed[i + 1];
        if (!flags[m]) continue;
        fixedHere = true;
        if (first < 0 || day < first) first = day;
        if (day > last) last = day;
        perMensa[(m * months + data.dayMonth[day]) * KINDS + fixed[i + 3]]++;
        touch(m, day, index);
      }

      if (first < 0) return; // not in this selection
      distinct++;
      entries += count;
      ranked.push({ dish, count, first, last, fixedHere });
    });

    ranked.sort((a, b) => b.count - a.count || a.dish.name.de.localeCompare(b.dish.name.de, "de"));
    return {
      ranked,
      entries,
      distinct,
      days: activeDay.reduce((sum, v) => sum + v, 0),
      selected: flags.reduce((sum, v) => sum + v, 0),
      mensen: data.mensen.map((m, i) => ({
        ...m, index: i, entries: mensaEntries[i], dishes: mensaDishes[i],
        first: mensaFirst[i] < 0 ? null : data.dates[mensaFirst[i]],
        last: mensaLast[i] < 0 ? null : data.dates[mensaLast[i]],
      })).filter((m) => flags[m.index]),
      perMensa,
      combined,
      noMenuDays: noMenuDays(data, activeDay),
    };
  }

  /** Mondays to Fridays between the first and the last dated day of all data with no menu in this selection. */
  function noMenuDays(data, activeDay) {
    if (!data.datedRange) return [];
    const known = new Map(data.dates.map((d, i) => [d, i]));
    const [from, to] = data.datedRange;
    const result = [];
    const end = Date.parse(`${data.dates[to]}T00:00:00Z`);
    for (let t = Date.parse(`${data.dates[from]}T00:00:00Z`); t <= end; t += 86400000) {
      const date = new Date(t);
      const weekday = date.getUTCDay();
      const iso = date.toISOString().slice(0, 10);
      if (weekday === 0 || weekday === 6) continue;
      if (!known.has(iso) || !activeDay[known.get(iso)]) result.push(iso);
    }
    return result;
  }

  /** [vegan, vegetarian, other] of a Mensa (or all combined, [mensa] null) in month index [month], or all months if null. */
  function shareOf(data, view, mensa, month) {
    const totals = [0, 0, 0];
    const months = data.months.length;
    for (let m = 0; m < months; m++) {
      if (month !== null && m !== month) continue;
      for (let k = 0; k < KINDS; k++) {
        totals[k] += mensa === null ? view.combined[m * KINDS + k] : view.perMensa[(mensa * months + m) * KINDS + k];
      }
    }
    return totals;
  }

  /** What the detail view shows for one dish in this selection. */
  function detail(data, dish, flags, once) {
    const counts = new Map();
    const fixedIn = new Set();
    const days = new Map(); // day -> lowest price per group
    const seenDays = new Set();
    let first = -1;
    let last = -1;
    const walk = (records, fixed) => {
      for (let i = 0; i < records.length; i += STRIDE) {
        const day = records[i];
        const m = records[i + 1];
        const price = records[i + 2];
        if (!flags[m]) continue;
        if (first < 0 || day < first) first = day;
        if (day > last) last = day;
        if (fixed) fixedIn.add(m);
        else {
          counts.set(m, (counts.get(m) || 0) + 1);
          seenDays.add(day);
        }
        if (price < 0) continue;
        const row = dish.prices[price];
        const low = days.get(day);
        days.set(day, low ? low.map((c, g) => (c === null ? row[g] : row[g] === null ? c : Math.min(c, row[g]))) : [...row]);
      }
    };
    walk(dish.occ, false);
    walk(dish.fixed, true);

    const prices = [];
    let previous = null;
    [...days.keys()].sort((a, b) => a - b).forEach((day) => {
      const row = days.get(day);
      if (previous === null || row.some((c, g) => c !== previous[g])) prices.push([data.dates[day], ...row]);
      previous = row;
    });
    const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
    return {
      count: once ? seenDays.size : total,
      first: first < 0 ? null : data.dates[first],
      last: last < 0 ? null : data.dates[last],
      where: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([m, n]) => ({ mensa: data.mensen[m], count: n })),
      fixedIn: [...fixedIn].map((m) => data.mensen[m]),
      prices,
    };
  }

  return { prepare, mask, compute, shareOf, detail };
})();
