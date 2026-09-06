/**
 * GreenhouseVenues — shortlist & compare.
 *
 * Entirely client-side: the venue slugs a visitor saves live in this
 * browser's localStorage only. Nothing is sent to a server, there is no
 * account, and clearing site data clears the shortlist. That is a deliberate
 * trade, not a missing feature — see /methodology/.
 *
 * Two things run from this one file:
 *   1. On every page: wires up any [data-shortlist-toggle] button (venue
 *      cards, the venue-page header) and keeps the header badge in sync.
 *   2. On /shortlist/ only: fetches the public venue data, renders the saved
 *      venues, and drives the compare-up-to-4 table.
 */
(function () {
  "use strict";

  var KEY = "greenhousevenues:shortlist:v1";

  var TYPE_LABEL = {
    greenhouse: "Greenhouse", conservatory: "Conservatory", "palm-house": "Palm house",
    orangery: "Orangery", atrium: "Atrium", "botanical-garden": "Botanical garden",
    limonaia: "Limonaia"
  };
  var BLEND_LABEL = {
    enclosed: "Fully enclosed", hybrid: "Glass + garden", openair: "Open-air adjacent"
  };
  var PRICE_GLYPH = { 1: "$", 2: "$$", 3: "$$$", 4: "$$$$" };
  var DASH = "&mdash;";
  var HEART = '<svg aria-hidden="true" viewBox="0 0 24 24" class="size-4" fill="none" ' +
    'stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2.3 5 5.7 5c1.9 0 ' +
    '3.5 1 4.3 2.5C10.8 6 12.4 5 14.3 5c3.4 0 5.2 3.4 3.7 6.7-2.5 4.7-10 9.3-10 9.3Z"/></svg>';

  /* ------------------------------------------------------------- storage --- */
  function read() {
    try {
      var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function save(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {
      /* private browsing or a full quota — the UI still updates for this
         page view, it just will not persist across a reload. */
    }
  }

  function has(slug) { return read().indexOf(slug) !== -1; }

  function toggle(slug) {
    var arr = read();
    var i = arr.indexOf(slug);
    if (i === -1) arr.push(slug); else arr.splice(i, 1);
    save(arr);
    return i === -1; // true = now saved
  }

  function remove(slug) { save(read().filter(function (s) { return s !== slug; })); }
  function clearAll() { save([]); }

  /* ------------------------------------------------------------- header --- */
  function updateCounts() {
    var n = read().length;
    document.querySelectorAll("[data-shortlist-count]").forEach(function (el) {
      el.hidden = n === 0;
      el.textContent = String(n);
    });
    document.querySelectorAll("[data-shortlist-link]").forEach(function (el) {
      el.setAttribute("aria-label", n === 0 ? "Your shortlist (empty)" : "Your shortlist (" + n + " saved)");
    });
  }

  /* --------------------------------------------------------- save buttons --- */
  function labelFor(btn, saved) {
    var name = btn.getAttribute("data-shortlist-name") || "this venue";
    return (saved ? "Remove " : "Save ") + name + (saved ? " from" : " to") + " your shortlist";
  }

  function syncButton(btn) {
    var saved = has(btn.getAttribute("data-shortlist-slug"));
    btn.setAttribute("aria-pressed", String(saved));
    btn.setAttribute("aria-label", labelFor(btn, saved));
  }

  function cssEscape(s) {
    return window.CSS && CSS.escape ? CSS.escape(s) : s.replace(/["\\]/g, "\\$&");
  }

  function wireButtons() {
    document.querySelectorAll("[data-shortlist-toggle]").forEach(function (btn) {
      syncButton(btn);
      if (btn.dataset.shortlistWired) return;
      btn.dataset.shortlistWired = "1";
      btn.addEventListener("click", function (e) {
        // Cards wrap their title in a whole-card link; stop it firing too.
        e.preventDefault();
        e.stopPropagation();
        var slug = btn.getAttribute("data-shortlist-slug");
        toggle(slug);
        var sel = '[data-shortlist-toggle][data-shortlist-slug="' + cssEscape(slug) + '"]';
        document.querySelectorAll(sel).forEach(syncButton);
        updateCounts();
        document.dispatchEvent(new CustomEvent("shortlist:change"));
      });
    });
  }

  /* -------------------------------------------------------------- misc --- */
  // NOTE: venue text (name, city, state, summary, official_url) comes from
  // /assets/data/venues.json, which we generate ourselves from data/venues.json
  // — and that file already stores names pre-escaped for HTML (e.g. "Sherman
  // Library &amp; Gardens"), matching the convention every Python template on
  // this site uses. Do not run these fields through an HTML-escaper here: they
  // are not user input, and escaping already-escaped text double-encodes it
  // ("&amp;" becomes "&amp;amp;", which renders as the literal text "&amp;").
  // Values we build ourselves in JS (TYPE_LABEL, BLEND_LABEL, …) are plain
  // ASCII and never need escaping either.

  // The opposite direction from the note above: venues.json stores names
  // HTML-escaped (e.g. "Sherman Library &amp; Gardens"), which is correct
  // when we hand a string to innerHTML but wrong for a plain-text clipboard
  // copy — there, "&amp;" must become the real "&" a person expects to read
  // in an email. A detached <textarea> decodes it using the browser's own
  // HTML parser, safely (it is never attached to the document, so nothing
  // it contains ever executes).
  function decodeEntities(s) {
    var ta = document.createElement("textarea");
    ta.innerHTML = s;
    return ta.value;
  }

  function copyText(text, btn) {
    if (!text) return;
    var label = btn.querySelector("[data-copy-label]") || btn;
    var original = label.textContent;
    var done = function () {
      label.textContent = "Copied";
      setTimeout(function () { label.textContent = original; }, 2000);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }

  /* ---------------------------------------------------- /shortlist/ page --- */
  function initShortlistPage(page) {
    var emptyEl = page.querySelector("[data-shortlist-empty]");
    var controlsEl = page.querySelector("[data-shortlist-controls]");
    var totalEl = page.querySelector("[data-shortlist-total]");
    var gridEl = page.querySelector("[data-shortlist-grid]");
    var compareWrap = page.querySelector("[data-compare-wrap]");
    var compareTable = page.querySelector("[data-compare-table]");
    var compareHint = page.querySelector("[data-compare-hint]");
    var copyBtn = page.querySelector("[data-shortlist-copy]");
    var clearBtn = page.querySelector("[data-shortlist-clear]");

    var ALL = null; // { slug: venue } once /assets/data/venues.json loads
    var compareSet = [];

    fetch("/assets/data/venues.json")
      .then(function (r) { return r.json(); })
      .then(function (list) {
        ALL = {};
        list.forEach(function (v) { ALL[v.slug] = v; });
        render();
      })
      .catch(function () {
        if (gridEl) {
          gridEl.hidden = false;
          gridEl.innerHTML = '<p class="col-span-full text-sm text-ink-500">' +
            "Could not load venue data. Refresh the page to try again.</p>";
        }
        if (emptyEl) emptyEl.hidden = true;
      });

    document.addEventListener("shortlist:change", render);

    if (copyBtn) copyBtn.addEventListener("click", function () {
      var slugs = read().filter(function (s) { return ALL && ALL[s]; });
      var lines = slugs.map(function (s, i) {
        return (i + 1) + ". " + decodeEntities(ALL[s].name) + " — " + ALL[s].official_url;
      });
      copyText(lines.length ? "Our wedding venue shortlist:\n\n" + lines.join("\n") : "", copyBtn);
    });

    if (clearBtn) clearBtn.addEventListener("click", function () {
      if (!read().length) return;
      clearAll();
      compareSet = [];
      updateCounts();
      render();
    });

    function render() {
      if (!ALL) return;
      var slugs = read().filter(function (s) { return ALL[s]; });
      compareSet = compareSet.filter(function (s) { return slugs.indexOf(s) !== -1; });

      var isEmpty = slugs.length === 0;
      if (emptyEl) emptyEl.hidden = !isEmpty;
      if (controlsEl) controlsEl.hidden = isEmpty;
      if (gridEl) gridEl.hidden = isEmpty;
      if (compareWrap) compareWrap.hidden = isEmpty;
      if (isEmpty) return;

      if (totalEl) totalEl.textContent = String(slugs.length);

      if (gridEl) {
        gridEl.innerHTML = slugs.map(function (slug) {
          return renderCard(ALL[slug], compareSet.indexOf(slug) !== -1);
        }).join("");

        gridEl.querySelectorAll("[data-remove]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            remove(btn.getAttribute("data-remove"));
            updateCounts();
            render();
          });
        });
        gridEl.querySelectorAll("[data-compare-check]").forEach(function (cb) {
          cb.addEventListener("change", function () {
            var slug = cb.getAttribute("data-compare-check");
            if (cb.checked) {
              if (compareSet.length >= 4) { cb.checked = false; return; }
              compareSet.push(slug);
            } else {
              compareSet = compareSet.filter(function (s) { return s !== slug; });
            }
            renderCompare();
          });
        });
      }
      renderCompare();
    }

    function renderCompare() {
      if (!compareTable) return;
      if (compareSet.length < 2) {
        compareTable.hidden = true;
        compareTable.innerHTML = "";
        if (compareHint) compareHint.hidden = false;
        return;
      }
      if (compareHint) compareHint.hidden = true;
      compareTable.hidden = false;

      var vs = compareSet.map(function (s) { return ALL[s]; });
      var rows = [
        ["Type", function (v) { return (TYPE_LABEL[v.type] || v.type); }],
        ["Location", function (v) { return (v.city + ", " + v.state); }],
        ["Seated capacity", function (v) { return v.capacity_seated ? String(v.capacity_seated) : DASH; }],
        ["Indoor / outdoor", function (v) { return BLEND_LABEL[v.blend] || DASH; }],
        ["Price range", function (v) { return PRICE_GLYPH[v.price_tier] || DASH; }],
        ["Official page", function (v) {
          return '<a class="font-medium text-botanical-700 underline decoration-champagne-400 underline-offset-4" rel="noopener nofollow" target="_blank" href="' +
            v.official_url + '">Visit site</a>';
        }]
      ];

      var head = '<tr><th scope="col" class="border-b border-line-strong bg-botanical-50 px-4 py-3 text-left"></th>' +
        vs.map(function (v) {
          return '<th scope="col" class="border-b border-line-strong bg-botanical-50 px-4 py-3 text-left font-sans text-sm font-semibold text-botanical-800">' +
            v.name + "</th>";
        }).join("") + "</tr>";

      var body = rows.map(function (r) {
        return '<tr><th scope="row" class="border-b border-line px-4 py-3 text-left font-sans text-xs font-bold uppercase tracking-wider text-ink-500">' +
          r[0] + "</th>" +
          vs.map(function (v) { return '<td class="border-b border-line px-4 py-3 text-sm text-ink-700">' + r[1](v) + "</td>"; }).join("") +
          "</tr>";
      }).join("");

      compareTable.innerHTML =
        '<table class="w-full min-w-[36rem] border-collapse text-left text-sm"><thead>' + head + "</thead><tbody>" + body + "</tbody></table>";
    }

    function renderCard(v, checked) {
      var cap = v.capacity_seated ? v.capacity_seated : "&mdash;";
      var layout = BLEND_LABEL[v.blend] || "&mdash;";
      var price = PRICE_GLYPH[v.price_tier] || "&mdash;";
      var name = v.name;
      return (
        '<article class="card flex flex-col overflow-hidden">' +
        '<div class="relative aspect-[4/3] overflow-hidden bg-botanical-900">' +
        '<img src="/assets/img/patterns/' + v.pattern + '.svg" alt="" aria-hidden="true" width="800" height="600" loading="lazy" decoding="async" class="size-full object-cover">' +
        '<span class="badge-glass absolute left-4 top-4">' + (TYPE_LABEL[v.type] || v.type) + "</span>" +
        '<button type="button" class="shortlist-btn absolute right-3 top-3" data-remove="' + v.slug +
        '" aria-pressed="true" aria-label="Remove ' + name + ' from your shortlist">' + HEART + "</button>" +
        "</div>" +
        '<div class="flex flex-1 flex-col p-5">' +
        '<p class="eyebrow">' + v.city + ", " + v.state + "</p>" +
        '<h3 class="mt-2 text-xl leading-snug"><a class="hover:underline" href="' + v.url + '">' + name + "</a></h3>" +
        '<p class="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">' + v.summary + "</p>" +
        '<dl class="mt-4 grid grid-cols-3 gap-1 border-t border-line pt-4 text-center">' +
        '<div><dt class="text-[10px] font-bold uppercase tracking-wider text-ink-500">Seats</dt><dd class="mt-0.5 text-sm font-semibold text-botanical-800">' + cap + "</dd></div>" +
        '<div class="border-x border-line"><dt class="text-[10px] font-bold uppercase tracking-wider text-ink-500">Layout</dt><dd class="mt-0.5 text-sm font-semibold text-botanical-800">' + layout + "</dd></div>" +
        '<div><dt class="text-[10px] font-bold uppercase tracking-wider text-ink-500">Budget</dt><dd class="mt-0.5 text-sm font-semibold text-botanical-800">' + price + "</dd></div>" +
        "</dl>" +
        '<label class="mt-4 flex items-center gap-2 border-t border-line pt-4 text-sm text-ink-700">' +
        '<input type="checkbox" data-compare-check="' + v.slug + '"' + (checked ? " checked" : "") +
        ' class="size-4 rounded border-line-strong text-botanical-800 focus:outline-none focus:ring-4 focus:ring-botanical-800/10">' +
        "Compare this venue</label>" +
        "</div></article>"
      );
    }
  }

  wireButtons();
  updateCounts();

  var page = document.querySelector("[data-shortlist-page]");
  if (page) initShortlistPage(page);
})();
