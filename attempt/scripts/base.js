/* ══════════════════════════════════════════════════════════════════
   HOUSE OF SUDAN — BASE
   Loaded on every page. Handles: nav toggle + staggered mobile
   drawer, iOS-safe viewport height, page-to-page fade transitions,
   and scroll-reveal. Page scripts (home.js, join-network.js,
   employers.js) load after this and only add page-specific behavior.
   ══════════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    /* ── iOS-safe viewport height ──
       100vh is unreliable on mobile Safari because the address bar
       resizes it. We keep a --vh custom property in sync as a
       fallback for anywhere dvh isn't supported. */
    function setViewportHeight() {
        document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
    }
    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);
    window.addEventListener("orientationchange", setViewportHeight);

    /* ── nav toggle / full-screen mobile drawer ── */
    var toggle = document.getElementById("toggle");
    var drawer = document.getElementById("drawer");

    if (toggle && drawer) {
        var drawerLinks = Array.prototype.slice.call(drawer.querySelectorAll("a"));

        function setDrawer(open) {
            drawer.classList.toggle("open", open);
            toggle.classList.toggle("open", open);
            document.body.classList.toggle("drawer-open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            drawerLinks.forEach(function (a, i) {
                a.style.transitionDelay = open ? (i * 0.05 + 0.05) + "s" : "0s";
            });
        }

        toggle.setAttribute("aria-expanded", "false");
        toggle.addEventListener("click", function () {
            setDrawer(!drawer.classList.contains("open"));
        });
        drawerLinks.forEach(function (a) {
            a.addEventListener("click", function () { setDrawer(false); });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setDrawer(false);
        });
    }

    /* ── page fade-in ── */
    // Runs immediately (not on DOMContentLoaded) so the fade starts
    // as early as possible and never shows a flash of unstyled content.
    requestAnimationFrame(function () {
        document.documentElement.classList.add("is-ready");
    });

    /* ── smooth page-to-page transitions ──
       Internal links fade the page out, then navigate, so moving
       between pages never feels like a hard cut. */
    document.addEventListener("click", function (e) {
        var a = e.target.closest("a");
        if (!a) return;

        var href = a.getAttribute("href");
        if (!href || href.charAt(0) === "#") return;
        if (a.target === "_blank" || a.hasAttribute("download")) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        var isInternal = href.indexOf("houseofsudan.com") !== -1 || href.charAt(0) === "/";
        if (!isInternal) return;

        e.preventDefault();
        document.documentElement.classList.add("is-leaving");
        window.setTimeout(function () {
            window.location.href = href;
        }, 220);
    });

    /* ── scroll reveal ──
       Any element marked [data-reveal] fades/lifts in the first time
       it enters the viewport. Add style="--i:1" (etc.) on siblings
       for a staggered group. */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if (revealEls.length) {
        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            revealEls.forEach(function (el) { io.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add("is-visible"); });
        }
    }
})();