/**
 * GreenhouseVenues — recently viewed.
 *
 * Records which venue pages a visitor has opened, in this browser's
 * localStorage only, so a repeat visitor gets a "continue where you left
 * off" rail. Entirely separate from the shortlist — viewing a venue does
 * not save it, and nothing here is sent anywhere; see /methodology/.
 */
(function () {
  "use strict";

  var KEY = "greenhousevenues:recent:v1";
  var MAX_STORED = 12;
  var MAX_SHOWN = 8;

  var TYPE_LABEL = {
    greenhouse: "Greenhouse", conservatory: "Conservatory", "palm-house": "Palm house",
    orangery: "Orangery", atrium: "Atrium", "botanical-garden": "Botanical garden",
    limonaia: "Limonaia"
  };

  function read() {
    try {
      var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function write(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {
      /* private browsing or a full quota — harmless, it just will not
         persist across a reload. */
    }
  }

  function record(slug) {
    var arr = read().filter(function (s) { return s !== slug; });
    arr.unshift(slug);
    write(arr.slice(0, MAX_STORED));
  }

  // Record a view — only venue pages carry this attribute (see
  // build/page_directory.py venue_page()).
  var main = document.querySelector("main[data-venue-slug]");
  if (main) record(main.getAttribute("data-venue-slug"));

  // Render, wherever a page asks for it (see build/page_home.py).
  var grids = document.querySelectorAll("[data-recent-grid]");
  if (!grids.length) return;

  var excludeSlug = main ? main.getAttribute("data-venue-slug") : null;
  var slugs = read().filter(function (s) { return s !== excludeSlug; }).slice(0, MAX_SHOWN);
  if (!slugs.length) return; // nothing to show — the section stays hidden

  fetch("/assets/data/venues.json")
    .then(function (r) { return r.json(); })
    .then(function (list) {
      var bySlug = {};
      list.forEach(function (v) { bySlug[v.slug] = v; });
      // NOTE: v.name etc. are pre-escaped for HTML by build/build.py — do not
      // re-escape here. See the note in shortlist.js for why.
      var venues = slugs.map(function (s) { return bySlug[s]; }).filter(Boolean);
      if (!venues.length) return;

      grids.forEach(function (grid) {
        grid.innerHTML = venues.map(renderMini).join("");
        var section = grid.closest("[data-recent-section]");
        if (section) section.hidden = false;
      });
    })
    .catch(function () {
      /* Data failed to load — leave the section hidden rather than show a
         half-broken rail. */
    });

  function renderMini(v) {
    return (
      '<a href="' + v.url + '" class="card-interactive group relative flex flex-col overflow-hidden">' +
      '<div class="relative aspect-[4/3] overflow-hidden bg-botanical-900">' +
      '<img src="/assets/img/patterns/' + v.pattern + '.svg" alt="" aria-hidden="true" ' +
      'width="800" height="600" loading="lazy" decoding="async" ' +
      'class="size-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105">' +
      '<span class="badge-glass absolute left-3 top-3 text-[10px]">' + (TYPE_LABEL[v.type] || v.type) + "</span>" +
      "</div>" +
      '<div class="flex flex-1 flex-col p-4">' +
      '<p class="eyebrow text-[10px]">' + v.city + ", " + v.state + "</p>" +
      '<h3 class="mt-1 text-base leading-snug text-botanical-900">' + v.name + "</h3>" +
      "</div>" +
      "</a>"
    );
  }

  document.querySelectorAll("[data-recent-clear]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      write([]);
      var section = btn.closest("[data-recent-section]");
      if (section) section.hidden = true;
    });
  });
})();
