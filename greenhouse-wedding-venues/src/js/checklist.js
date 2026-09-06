/**
 * GreenhouseVenues — interactive quote checklist.
 *
 * Used on the cost guide and on every venue page (see build/shared.py
 * `checklist()`). Checked state is saved per checklist key in this browser's
 * localStorage only, so a couple juggling quotes from several venues can
 * track which questions they have actually asked each one — without an
 * account, and without anything being sent to us.
 */
(function () {
  "use strict";

  function keyFor(el) { return "greenhousevenues:checklist:" + el.getAttribute("data-checklist-key"); }

  function read(el) {
    try {
      var obj = JSON.parse(localStorage.getItem(keyFor(el)) || "{}");
      return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
      return {};
    }
  }

  function write(el, obj) {
    try { localStorage.setItem(keyFor(el), JSON.stringify(obj)); } catch (e) {
      /* private browsing or a full quota — checks still work for this view. */
    }
  }

  document.querySelectorAll("[data-checklist]").forEach(function (root) {
    var boxes = Array.prototype.slice.call(root.querySelectorAll("[data-checklist-item]"));
    var state = read(root);
    var progress = root.querySelector("[data-checklist-progress]");
    var copyBtn = root.querySelector("[data-checklist-copy]");
    var resetBtn = root.querySelector("[data-checklist-reset]");

    function markRow(box) {
      var row = box.closest("[data-checklist-row]");
      if (row) row.setAttribute("data-checked", String(box.checked));
    }

    function updateProgress() {
      if (!progress) return;
      var n = boxes.filter(function (b) { return b.checked; }).length;
      progress.textContent = n + " of " + boxes.length + " checked";
    }

    boxes.forEach(function (box, i) {
      box.checked = !!state[i];
      markRow(box);
      box.addEventListener("change", function () {
        state[i] = box.checked;
        write(root, state);
        markRow(box);
        updateProgress();
      });
    });
    updateProgress();

    if (copyBtn) copyBtn.addEventListener("click", function () {
      var intro = root.getAttribute("data-checklist-copy-intro") ||
        "Questions to ask before booking a greenhouse or conservatory wedding venue:";
      var lines = boxes.map(function (box, i) {
        var row = box.closest("[data-checklist-row]");
        var q = row ? row.querySelector("[data-checklist-question]") : null;
        return (i + 1) + ". " + (q ? q.textContent.trim() : "");
      });
      var text = intro + "\n\n" + lines.join("\n");
      var label = copyBtn.querySelector("[data-copy-label]") || copyBtn;
      var original = label.textContent;
      var done = function () {
        label.textContent = "Copied";
        setTimeout(function () { label.textContent = original; }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
      else done();
    });

    if (resetBtn) resetBtn.addEventListener("click", function () {
      state = {};
      write(root, state);
      boxes.forEach(function (box) { box.checked = false; markRow(box); });
      updateProgress();
    });
  });
})();
