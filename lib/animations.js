/* =========================================================
   PROJECT WEB by Ghale — Interactions & GSAP motion
   Ported from the original static js/main.js to an ES module.
   initSite() is called once from app/page.jsx inside useEffect,
   after the markup has mounted in the browser.
   ========================================================= */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function initSite() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  const hasGSAP = true; // gsap is now bundled, always available
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =======================================================
     LENIS SMOOTH SCROLL
     ======================================================= */
  let lenis = null;
  function initLenis() {
    if (prefersReduced) return;
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.lenis = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (hasGSAP && ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---------- Anchor scrolling via Lenis ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeMobileMenu();
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.2 });
        else target.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* =======================================================
     PRELOADER
     ======================================================= */
  function initPreloader(done) {
    const pl = document.getElementById("preloader");
    const countEl = document.getElementById("plCount");
    const bar = document.getElementById("plBar");
    const lines = document.querySelectorAll(".preloader__logo .pl-line");

    // Run the site init at most once, no matter which path triggers it.
    let started = false;
    const go = () => {
      if (started) return;
      started = true;
      if (pl) pl.style.display = "none";
      document.documentElement.classList.remove("lenis-stopped");
      done();
    };
    // Safety net: never let the preloader trap the page if rAF/GSAP stalls.
    const safety = setTimeout(go, 4500);

    if (!pl || prefersReduced || !hasGSAP) {
      clearTimeout(safety);
      go();
      return;
    }

    document.documentElement.classList.add("lenis-stopped");
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(safety);
        go();
      },
    });
    tl.to(lines, { y: 0, duration: 0.9, ease: "power4.out", stagger: 0.08 });
    tl.to(
      { v: 0 },
      {
        v: 100,
        duration: 1.4,
        ease: "power2.inOut",
        onUpdate: function () {
          const val = Math.round(this.targets()[0].v);
          if (countEl) countEl.textContent = val;
          if (bar) bar.style.width = val + "%";
        },
      },
      0.2
    );
    tl.to(
      ".preloader__inner, .preloader__bar",
      { opacity: 0, duration: 0.4 },
      "+=0.1"
    );
    tl.to(pl, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.1");
    tl.add(() => document.documentElement.classList.remove("lenis-stopped"));
  }

  /* =======================================================
     CUSTOM CURSOR
     ======================================================= */
  function initCursor() {
    if (isTouch) return;
    const dot = document.getElementById("cursor");
    const follow = document.getElementById("cursorFollow");
    if (!dot || !follow) return;
    document.body.classList.add("hide-cursor");

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let fx = mx,
      fy = my;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    function loop() {
      fx += (mx - fx) * 0.16;
      fy += (my - fy) * 0.16;
      follow.style.transform = `translate(${fx}px,${fy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('[data-cursor="hover"]').forEach((el) => {
      el.addEventListener("mouseenter", () => follow.classList.add("is-hover"));
      el.addEventListener("mouseleave", () =>
        follow.classList.remove("is-hover")
      );
    });
    document.querySelectorAll('[data-cursor="view"]').forEach((el) => {
      el.addEventListener("mouseenter", () => follow.classList.add("is-view"));
      el.addEventListener("mouseleave", () =>
        follow.classList.remove("is-view")
      );
    });
  }

  /* =======================================================
     MAGNETIC BUTTONS
     ======================================================= */
  function initMagnetic() {
    if (isTouch || !hasGSAP) return;
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * 0.35, y: y * 0.45, duration: 0.5, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });
      });
    });
  }

  /* =======================================================
     NAV (hide on scroll down / show up + scrolled bg)
     ======================================================= */
  function initNav() {
    const nav = document.getElementById("nav");
    const prog = document.getElementById("scrollProgress");
    if (!nav) return;
    let last = 0;
    function onScroll() {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 40);
      if (y > last && y > 400) nav.classList.add("hidden");
      else nav.classList.remove("hidden");
      last = y;
      if (prog) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* =======================================================
     MOBILE MENU
     ======================================================= */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const navEl = document.getElementById("nav");
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("open");
    if (burger) burger.classList.remove("open");
    if (navEl) navEl.classList.remove("menu-open");
    document.body.style.overflow = "";
  }
  function initMobileMenu() {
    if (!burger || !mobileMenu) return;
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", open);
      if (navEl) navEl.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  /* =======================================================
     HERO INTRO ANIMATION
     ======================================================= */
  function animateHero() {
    if (!hasGSAP || prefersReduced) {
      document
        .querySelectorAll(".hero__title .word")
        .forEach((w) => (w.style.transform = "none"));
      return;
    }
    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(".hero__title .word", {
      y: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.06,
    });
    tl.from(
      ".hero__eyebrow",
      { y: 18, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
      "-=0.6"
    );
    tl.from(
      ".hero__lead, .hero__scroll",
      { y: 24, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
      "-=0.5"
    );

    // Parallax blobs
    gsap.to(".blob--1", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".blob--2", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  /* =======================================================
     GENERIC REVEALS
     ======================================================= */
  function initReveals() {
    if (!hasGSAP) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((e) => e.classList.add("is-in"));
      return;
    }
    if (prefersReduced) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((e) => e.classList.add("is-in"));
      return;
    }

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    });

    // Section titles: words rise
    gsap.utils.toArray(".section-head__title, .cta__title").forEach((title) => {
      const lines = title.querySelectorAll(".line");
      if (lines.length) {
        gsap.from(lines, {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: title, start: "top 85%" },
        });
      }
    });
  }

  /* =======================================================
     WORD-BY-WORD STATEMENT (intro)
     ======================================================= */
  function initWordStatement() {
    const target = document.querySelector("[data-reveal-words]");
    if (!target) return;
    // Use pre-built word/image spans if present; otherwise split the text.
    let items = target.querySelectorAll(".word");
    if (!items.length) {
      const words = target.textContent.trim().split(/\s+/);
      target.innerHTML = words
        .map((w) => `<span class="word">${w}</span>`)
        .join(" ");
      items = target.querySelectorAll(".word");
    }
    if (!hasGSAP || prefersReduced) {
      items.forEach((w) => (w.style.opacity = 1));
      return;
    }
    gsap.to(items, {
      opacity: 1,
      stagger: 0.04,
      ease: "none",
      scrollTrigger: {
        trigger: target,
        start: "top 75%",
        end: "bottom 60%",
        scrub: 1,
      },
    });
  }

  /* =======================================================
     COUNTERS
     ======================================================= */
  function initCounters() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = parseFloat(el.getAttribute("data-count"));
      const suffix = el.getAttribute("data-suffix") || "";
      if (!hasGSAP || prefersReduced) {
        el.textContent = end + suffix;
        return;
      }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
        onUpdate: () => (el.textContent = Math.round(obj.v) + suffix),
      });
    });
  }

  /* =======================================================
     SERVICES + STEPS stagger in
     ======================================================= */
  function initListItems() {
    if (!hasGSAP || prefersReduced) return;
    gsap.utils.toArray("[data-service]").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
    gsap.utils.toArray("[data-step]").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
  }

  /* =======================================================
     PROCESS — horizontal scroll-stacked card timeline.
     A tall track pins its inner panel; each card (except the
     first) slides in from the right and lands in a staggered
     pile as scroll progresses through its segment.
     ======================================================= */
  function initProcessTimeline() {
    const scroller = document.getElementById("processScroll");
    const stage = document.getElementById("processCards");
    if (!scroller || !stage) return;
    const cards = Array.from(stage.querySelectorAll(".pcard"));
    if (!cards.length) return;

    // Reduced-motion / no-GSAP: show a plain stacked list (CSS handles layout).
    if (!hasGSAP || !ScrollTrigger || prefersReduced) {
      document.querySelector(".process")?.classList.add("process--static");
      return;
    }

    const n = cards.length;
    const offset = 48; // px each card lands to the right of the previous -> pile

    // Later cards render above earlier ones; all but the first start off-screen.
    cards.forEach((card, i) => {
      gsap.set(card, { zIndex: i, x: i === 0 ? 0 : window.innerWidth });
    });

    // Map overall scroll progress -> each card's x. Card i animates across the
    // segment [i/n, (i+1)/n], mirroring the reference component's timing.
    const place = (p) => {
      const startX = window.innerWidth;
      const seg = 1 / n;
      cards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { x: 0 });
          return;
        }
        let local = (p - i * seg) / seg;
        local = local < 0 ? 0 : local > 1 ? 1 : local;
        gsap.set(card, { x: startX + (offset * i - startX) * local });
      });
    };

    const stRef = ScrollTrigger.create({
      trigger: scroller,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => place(self.progress),
      onRefresh: (self) => place(self.progress),
    });
    place(stRef.progress || 0);
  }

  /* =======================================================
     WORK — sticky left info synced to centered right image
     ======================================================= */
  function initWorkSticky() {
    const right = document.getElementById("workRight");
    if (!right) return;
    const cards = Array.from(right.querySelectorAll(".wk"));
    if (!cards.length) return;

    const catEl = document.getElementById("wkCat");
    const nameEl = document.getElementById("wkName");
    const descEl = document.getElementById("wkDesc");
    const linkEl = document.getElementById("wkLink");
    const curEl = document.getElementById("wkCur");
    const displayEls = [catEl, nameEl, descEl].filter(Boolean);

    const pad2 = (n) => String(n + 1).padStart(2, "0");
    let current = 0;
    let swapTl = null;

    function setActive(i) {
      if (i === current || i < 0 || i >= cards.length) return;
      current = i;
      const c = cards[i];
      cards.forEach((x) => x.classList.remove("is-active"));
      c.classList.add("is-active");
      if (curEl) curEl.textContent = pad2(i);
      if (linkEl) linkEl.setAttribute("href", c.getAttribute("href") || "#");

      const cat = c.dataset.cat || "";
      const name = c.dataset.name || "";
      const desc = c.dataset.desc || "";

      if (!hasGSAP || prefersReduced) {
        if (catEl) catEl.innerHTML = cat;
        if (nameEl) nameEl.innerHTML = name;
        if (descEl) descEl.innerHTML = desc;
        return;
      }
      if (swapTl) swapTl.kill();
      swapTl = gsap.timeline();
      swapTl.to(displayEls, {
        y: -14,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
      });
      swapTl.add(() => {
        if (catEl) catEl.innerHTML = cat;
        if (nameEl) nameEl.innerHTML = name;
        if (descEl) descEl.innerHTML = desc;
      });
      swapTl.fromTo(
        displayEls,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }
      );
    }

    // The pile visuals (parallax + stacking depth) run on every screen size.
    const enableVisual = hasGSAP && ScrollTrigger && !prefersReduced;
    if (!enableVisual) return; // reduced-motion shows a static captioned list

    // The synced left text panel only exists on desktop (hidden < 1200px),
    // so only run its center-detection there.
    const enableSync = window.innerWidth > 1200;

    cards.forEach((card, i) => {
      if (enableSync) {
        // Active sync (left text) — whichever card reached the centre is active.
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          onEnter: () => setActive(i),
          onLeaveBack: () => setActive(i - 1 < 0 ? 0 : i - 1),
        });
      }

      // Zoom-OUT parallax: the image starts larger while entering from below
      // and scales back to its normal size (1.0) exactly when the card reaches
      // its centred/sticky position. "top 9%" matches the card's top:9vh.
      const img = card.querySelector("img");
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.25, yPercent: -5 },
          {
            scale: 1.0,
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top 9%",
              scrub: true,
            },
          }
        );
      }

      // Stacking depth: as the NEXT card rises to cover this one, this card
      // recedes (shrinks + lifts), so the images pile up while scrolling.
      if (i < cards.length - 1) {
        gsap.fromTo(
          card,
          { scale: 1, yPercent: 0 },
          {
            scale: 0.9,
            yPercent: -3,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top center",
              scrub: true,
            },
          }
        );
      }
    });
  }

  /* =======================================================
     SERVICES — purple circle grows from the intro dot into the bg
     ======================================================= */
  function initServicesReveal() {
    const sec = document.querySelector(".services");
    const circle = sec && sec.querySelector(".services__circle");
    const dot = sec && sec.querySelector(".services__dot");
    if (!sec || !circle) return;
    if (!hasGSAP || !ScrollTrigger || prefersReduced) {
      // Static fallback: just show the section on purple.
      sec.classList.add("is-purple");
      circle.style.display = "none";
      return;
    }
    // Anchor the growing circle exactly on the purple dot (the "period").
    function placeCircle() {
      if (!dot) return;
      circle.style.left = dot.offsetLeft + dot.offsetWidth / 2 + "px";
      circle.style.top = dot.offsetTop + dot.offsetHeight / 2 + "px";
    }
    placeCircle();
    // Pin the section so the circle grows as a true full circle (no clipped dome).
    // Scale 0→1 of a large base keeps the edge crisp (never upscaled past 1).
    gsap.fromTo(
      circle,
      { scale: 0 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=85%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: placeCircle,
          onUpdate: (self) => {
            sec.classList.toggle("is-purple", self.progress > 0.42);
          },
        },
      }
    );
  }

  /* =======================================================
     FOOTER — sticky reveal (content scrolls up off the footer)
     ======================================================= */
  function initFooterReveal() {
    const content = document.getElementById("smooth-content");
    const footer = document.querySelector(".footer");
    if (!content || !footer) return;

    let raf = 0;
    function apply() {
      // Only use the fixed-reveal when the footer fits on screen, otherwise
      // a tall (mobile) footer would be clipped — fall back to a normal footer.
      const fits = footer.offsetHeight < window.innerHeight - 16;
      if (fits) {
        footer.classList.add("footer--fixed");
        content.style.marginBottom = footer.offsetHeight + "px";
      } else {
        footer.classList.remove("footer--fixed");
        content.style.marginBottom = "";
      }
      if (hasGSAP && ScrollTrigger) ScrollTrigger.refresh();
    }
    apply();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTimeout(apply, 120));
    });
    window.addEventListener("load", apply);
  }

  /* =======================================================
     MARQUEE auto-scroll (+ direction on scroll velocity)
     ======================================================= */
  function initMarquee() {
    if (!hasGSAP || prefersReduced) return;
    [
      ["#marquee1", 1],
      ["#marquee2", -1],
      ["#techMarquee", -1],
      ["#footerMarquee", 1],
    ].forEach(([sel, dir]) => {
      const track = document.querySelector(sel);
      if (!track) return;
      // Content is duplicated in markup, so animating across 50% loops seamlessly.
      const from = dir > 0 ? 0 : -50;
      const to = dir > 0 ? -50 : 0;
      gsap.set(track, { xPercent: from });
      const tween = gsap.to(track, {
        xPercent: to,
        duration: 24,
        ease: "none",
        repeat: -1,
      });
      ScrollTrigger.create({
        trigger: track,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          tween.timeScale(self.direction === 1 ? 1 : -1);
        },
      });
    });
  }

  /* =======================================================
     INIT
     ======================================================= */
  function start() {
    initLenis();
    initCursor();
    initNav();
    initMobileMenu();
    initAnchors();
    initMagnetic();
    animateHero();
    initWordStatement();
    initReveals();
    initCounters();
    initListItems();
    initServicesReveal();
    initProcessTimeline();
    initWorkSticky();
    initMarquee();
    initFooterReveal();
    if (hasGSAP && ScrollTrigger) ScrollTrigger.refresh();
  }

  // The DOM is already mounted (we run from useEffect), so kick off directly.
  initPreloader(start);

  const onLoad = () => {
    if (hasGSAP && ScrollTrigger) ScrollTrigger.refresh();
  };
  window.addEventListener("load", onLoad);
}
