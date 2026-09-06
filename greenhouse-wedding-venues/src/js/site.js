/**
 * GreenhouseVenues — site behaviour.
 * Vanilla, dependency-free, ~4 KB. Loaded with `defer` so it never blocks paint.
 * Every enhancement is progressive: with JS off the pages stay fully readable.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- header */
  // Elevate the sticky header once the page scrolls off the hero.
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ mobile nav */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navPanel = document.getElementById("mobile-nav");
  if (navToggle && navPanel) {
    var setNav = function (open) {
      navToggle.setAttribute("aria-expanded", String(open));
      navPanel.hidden = !open;
      document.documentElement.style.overflow = open ? "hidden" : "";
    };
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
    navPanel.addEventListener("click", function (e) {
      if (e.target.closest("a") || e.target.hasAttribute("data-nav-close")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* --------------------------------------------------------- scroll reveal */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if (!("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = (entry.target.dataset.revealDelay || 0) + "ms";
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ------------------------------------------------------------- lightbox */
  // Venue gallery: click a thumb to promote it into the main frame.
  var gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    var stage = gallery.querySelector("[data-gallery-stage]");
    gallery.addEventListener("click", function (e) {
      var thumb = e.target.closest("[data-gallery-thumb]");
      if (!thumb || !stage) return;
      var img = thumb.querySelector("img");
      stage.src = img.getAttribute("data-full") || img.src;
      stage.alt = img.alt;
      gallery.querySelectorAll("[data-gallery-thumb]").forEach(function (t) {
        t.setAttribute("aria-current", String(t === thumb));
      });
    });
  }

  /* ---------------------------------------------------- reading progress */
  var progress = document.querySelector("[data-reading-progress]");
  var articleBody = document.querySelector("[data-article-body]");
  if (progress && articleBody) {
    var tick = function () {
      var rect = articleBody.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      progress.style.transform = "scaleX(" + done.toFixed(4) + ")";
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
  }

  /* -------------------------------------------------------- TOC scrollspy */
  var toc = document.querySelector("[data-toc]");
  if (toc && articleBody && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
    var headings = links
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute(
            "aria-current",
            String(a.getAttribute("href") === "#" + entry.target.id)
          );
        });
      });
    }, { rootMargin: "-96px 0px -70% 0px" });
    headings.forEach(function (h) { spy.observe(h); });
  }

  /* ------------------------------------------------------------ share row */
  document.querySelectorAll("[data-copy-link]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.dataset.copyLink || window.location.href;
      var done = function () {
        var label = btn.querySelector("[data-copy-label]") || btn;
        var original = label.textContent;
        label.textContent = "Link copied";
        setTimeout(function () { label.textContent = original; }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () {});
      else done();
    });
  });

  /* ---------------------------------------------------------- year stamp */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
