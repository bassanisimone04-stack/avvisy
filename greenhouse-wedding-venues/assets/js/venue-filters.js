/**
 * Glasshouse Weddings — venue filter component.
 *
 * Filters a server-rendered grid of venue cards in place: no framework, no
 * fetch, no layout shift. The cards are real HTML (crawlable + indexable);
 * this only toggles `hidden` on them, so the page works with JS disabled.
 *
 * Contract — the grid element carries [data-venue-grid] and each card:
 *   data-venue
 *   data-name="Crystal Conservatory"     search text
 *   data-city="Napa"                     search text
 *   data-state="california"              slug
 *   data-capacity="180"                  max seated guests (integer)
 *   data-blend="enclosed|hybrid|openair"
 *   data-price="1|2|3|4"                 $ … $$$$ tier
 *   data-featured="true"                 optional
 *
 * Controls are wired declaratively:
 *   <select data-filter="state">                 single value
 *   <select data-filter="capacity">              any|micro|small|medium|large
 *   <button data-filter-chip="blend" value="…">  multi-select toggle
 *   <button data-filter-chip="price" value="…">  multi-select toggle
 *   <input  data-filter="q">                     free text
 *   <select data-sort>                           featured|capacity-asc|capacity-desc|price-asc
 */
(function () {
  "use strict";

  var grid = document.querySelector("[data-venue-grid]");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-venue]"));
  var countEls = document.querySelectorAll("[data-result-count]");
  var emptyEl = document.querySelector("[data-empty-state]");
  var activeEl = document.querySelector("[data-active-filters]");
  var resetEls = document.querySelectorAll("[data-filter-reset]");

  var CAPACITY = {
    any: null,
    micro: [0, 50],      // "small greenhouse wedding venues" — under 50 guests
    small: [50, 100],
    medium: [100, 200],
    large: [200, Infinity]
  };
  var CAPACITY_LABEL = {
    micro: "Under 50 guests",
    small: "50–100 guests",
    medium: "100–200 guests",
    large: "200+ guests"
  };
  var BLEND_LABEL = {
    enclosed: "Fully enclosed glasshouse",
    hybrid: "Glasshouse + garden",
    openair: "Open-air adjacent"
  };
  var PRICE_LABEL = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };

  var state = { state: "", capacity: "any", blend: [], price: [], q: "", sort: "featured" };

  /* ----------------------------------------------------------- filtering */
  function matches(card) {
    var d = card.dataset;

    if (state.state && d.state !== state.state) return false;

    var range = CAPACITY[state.capacity];
    if (range) {
      var cap = parseInt(d.capacity, 10) || 0;
      if (cap < range[0] || cap > range[1]) return false;
    }

    if (state.blend.length && state.blend.indexOf(d.blend) === -1) return false;
    if (state.price.length && state.price.indexOf(d.price) === -1) return false;

    if (state.q) {
      var haystack = (d.name + " " + d.city + " " + d.state).toLowerCase();
      if (haystack.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  function sortCards(visible) {
    var by = {
      "capacity-asc": function (a, b) { return num(a, "capacity") - num(b, "capacity"); },
      "capacity-desc": function (a, b) { return num(b, "capacity") - num(a, "capacity"); },
      "price-asc": function (a, b) { return num(a, "price") - num(b, "price"); },
      "price-desc": function (a, b) { return num(b, "price") - num(a, "price"); },
      featured: function (a, b) {
        return (b.dataset.featured === "true") - (a.dataset.featured === "true");
      }
    }[state.sort];
    if (by) visible.slice().sort(by).forEach(function (c) { grid.appendChild(c); });
  }

  function num(el, key) { return parseInt(el.dataset[key], 10) || 0; }

  /* ------------------------------------------------------------- chips UI */
  function renderActiveFilters() {
    if (!activeEl) return;
    var pills = [];

    if (state.state) {
      pills.push([
        "state",
        state.state,
        "State: " + titleCase(state.state.replace(/-/g, " "))
      ]);
    }
    if (state.capacity !== "any") {
      pills.push(["capacity", state.capacity, CAPACITY_LABEL[state.capacity]]);
    }
    state.blend.forEach(function (v) { pills.push(["blend", v, BLEND_LABEL[v]]); });
    state.price.forEach(function (v) { pills.push(["price", v, "Budget " + PRICE_LABEL[v]]); });
    if (state.q) pills.push(["q", state.q, '"' + state.q + '"']);

    activeEl.innerHTML = pills
      .map(function (p) {
        return (
          '<button type="button" class="badge badge-emerald hover:bg-botanical-100" ' +
          'data-remove-filter="' + p[0] + '" data-remove-value="' + escapeAttr(p[1]) + '">' +
          escapeHtml(p[2]) +
          '<span class="sr-only"> — remove filter</span>' +
          '<svg aria-hidden="true" viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          "</button>"
        );
      })
      .join("");
    activeEl.parentElement.hidden = pills.length === 0;
  }

  /* ---------------------------------------------------------------- apply */
  function apply(pushUrl) {
    var visible = [];
    cards.forEach(function (card) {
      var ok = matches(card);
      card.hidden = !ok;
      if (ok) visible.push(card);
    });

    sortCards(visible);

    var label = visible.length + (visible.length === 1 ? " venue" : " venues");
    countEls.forEach(function (el) { el.textContent = label; });
    if (emptyEl) emptyEl.hidden = visible.length !== 0;

    renderActiveFilters();
    if (pushUrl !== false) syncUrl();
  }

  /* ------------------------------------------------------------------ URL */
  function syncUrl() {
    var p = new URLSearchParams();
    if (state.state) p.set("state", state.state);
    if (state.capacity !== "any") p.set("capacity", state.capacity);
    if (state.blend.length) p.set("blend", state.blend.join(","));
    if (state.price.length) p.set("price", state.price.join(","));
    if (state.q) p.set("q", state.q);
    if (state.sort !== "featured") p.set("sort", state.sort);
    var qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  function readUrl() {
    var p = new URLSearchParams(location.search);
    state.state = p.get("state") || "";
    state.capacity = CAPACITY.hasOwnProperty(p.get("capacity")) ? p.get("capacity") : "any";
    state.blend = (p.get("blend") || "").split(",").filter(Boolean);
    state.price = (p.get("price") || "").split(",").filter(Boolean);
    state.q = p.get("q") || "";
    state.sort = p.get("sort") || "featured";
    syncControls();
  }

  function syncControls() {
    document.querySelectorAll("[data-filter]").forEach(function (el) {
      var key = el.dataset.filter;
      if (key in state && typeof state[key] === "string") el.value = state[key];
    });
    document.querySelectorAll("[data-sort]").forEach(function (el) { el.value = state.sort; });
    document.querySelectorAll("[data-filter-chip]").forEach(function (btn) {
      var key = btn.dataset.filterChip;
      var on = state[key].indexOf(btn.value) !== -1;
      btn.setAttribute("aria-pressed", String(on));
    });
  }

  /* --------------------------------------------------------------- events */
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (el.matches("[data-filter]")) {
      state[el.dataset.filter] = el.value;
      apply();
    } else if (el.matches("[data-sort]")) {
      state.sort = el.value;
      apply();
    }
  });

  document.addEventListener("input", function (e) {
    if (!e.target.matches("[data-filter='q']")) return;
    clearTimeout(apply._t);
    apply._t = setTimeout(function () {
      state.q = e.target.value.trim();
      apply();
    }, 180);
  });

  document.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-filter-chip]");
    if (chip) {
      var key = chip.dataset.filterChip;
      var i = state[key].indexOf(chip.value);
      if (i === -1) state[key].push(chip.value);
      else state[key].splice(i, 1);
      chip.setAttribute("aria-pressed", String(i === -1));
      apply();
      return;
    }

    var remove = e.target.closest("[data-remove-filter]");
    if (remove) {
      var rk = remove.dataset.removeFilter;
      var rv = remove.dataset.removeValue;
      if (Array.isArray(state[rk])) state[rk].splice(state[rk].indexOf(rv), 1);
      else state[rk] = rk === "capacity" ? "any" : "";
      syncControls();
      apply();
    }
  });

  resetEls.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state = { state: "", capacity: "any", blend: [], price: [], q: "", sort: "featured" };
      syncControls();
      document.querySelectorAll("[data-filter='q']").forEach(function (i) { i.value = ""; });
      apply();
    });
  });

  /* ------------------------------------------------ mobile filter drawer */
  var drawer = document.getElementById("filter-drawer");
  var drawerToggles = document.querySelectorAll("[data-drawer-toggle]");
  if (drawer && drawerToggles.length) {
    var setDrawer = function (open) {
      drawer.hidden = !open;
      document.documentElement.style.overflow = open ? "hidden" : "";
      drawerToggles.forEach(function (t) { t.setAttribute("aria-expanded", String(open)); });
      if (open) {
        var first = drawer.querySelector("select, input, button");
        if (first) first.focus();
      }
    };
    drawerToggles.forEach(function (t) {
      t.addEventListener("click", function () { setDrawer(drawer.hidden); });
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-drawer-close")) setDrawer(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !drawer.hidden) setDrawer(false);
    });
  }

  /* ------------------------------------------------------------- helpers */
  function titleCase(s) {
    return s.replace(/\b\w/g, function (m) { return m.toUpperCase(); });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }

  readUrl();
  apply(false);
})();
