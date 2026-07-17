/* SoftApps — motion & interactions.
   Degrades gracefully: if GSAP/Lenis fail to load, reveals still fire via
   IntersectionObserver, and reduced-motion users get a static page.

   The motion libraries (~120KB) are fetched at runtime and only where they
   pay off: wide viewports without a reduced-motion preference. Everywhere
   else the IntersectionObserver path below covers the reveals. */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFine = window.matchMedia("(pointer: fine)").matches;
  const isWide = window.matchMedia("(min-width: 900px)").matches;
  const wantMotion = !reduce && isWide;

  /* ---------- header shrink + scroll progress ---------- */
  const header = document.getElementById("header");
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);

  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuToggle && mobileMenu) {
    const close = () => {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    };
    menuToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ---------- cursor glow ---------- */
  const cursor = document.getElementById("cursor");
  if (cursor && isFine && !reduce) {
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ---------- 3D tilt on cards ---------- */
  if (isFine && !reduce) {
    document.querySelectorAll(".tilt").forEach((card) => {
      const strength = 8;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform =
          `perspective(900px) rotateY(${(px - 0.5) * strength}deg) rotateX(${(0.5 - py) * strength}deg)`;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- hero particle field ---------- */
  const canvas = document.getElementById("hero-canvas");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let w, h, dots, raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const COUNT = window.innerWidth < 640 ? 34 : 70;
    const COLORS = ["#22d3ee", "#7c3aed", "#ec4899"];

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function make() {
      dots = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.c;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const e = dots[j];
          const dx = d.x - e.x, dy = d.y - e.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y); ctx.lineTo(e.x, e.y);
            ctx.strokeStyle = d.c;
            ctx.globalAlpha = (1 - dist / 130) * 0.15;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    const start = () => { resize(); make(); cancelAnimationFrame(raf); frame(); };
    start();
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(start, 200); });
  }

  /* ---------- motion library loading ---------- */
  // async=false keeps execution in insertion order, so ScrollTrigger always
  // sees gsap. A failed fetch resolves anyway — the caller re-checks globals.
  function loadScripts(srcs) {
    return Promise.all(srcs.map((src) => new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = resolve;
      s.onerror = resolve;
      document.head.appendChild(s);
    })));
  }

  let lenis = null;

  // anchor links -> smooth scroll via Lenis once it exists, native until then
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -70 });
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  });

  const reveals = document.querySelectorAll(".reveal");

  function revealFallback() {
    if (!("IntersectionObserver" in window) || reduce) {
      reveals.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));

    // A jump — scroll restoration on reload, or a deep link to #contact — can
    // carry an element from below the viewport to above it without it ever
    // intersecting, so the observer never fires and it stays at opacity 0.
    // Sweep anything already scrolled past, then stop once nothing is pending.
    const sweep = () => {
      let pending = 0;
      reveals.forEach((el) => {
        if (el.classList.contains("in")) return;
        if (el.getBoundingClientRect().bottom < 0) {
          el.classList.add("in");
          io.unobserve(el);
        } else {
          pending++;
        }
      });
      if (!pending) window.removeEventListener("scroll", sweep);
    };
    window.addEventListener("scroll", sweep, { passive: true });
  }

  function initMotion() {
    const hasGSAP = typeof window.gsap !== "undefined" && window.ScrollTrigger;
    const hasLenis = typeof window.Lenis !== "undefined";

    if (hasLenis) {
      lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      if (hasGSAP) {
        lenis.on("scroll", window.ScrollTrigger.update);
        window.gsap.ticker.add((t) => lenis.raf(t * 1000));
        window.gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    }

    if (!hasGSAP) { revealFallback(); return; }

    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);

    reveals.forEach((el) => {
      gsap.fromTo(el, { y: 44, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
      el.classList.add("in"); // safety
    });

    // hero parallax
    gsap.to(".hero-inner", {
      yPercent: 18, opacity: 0.4, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to("#hero-canvas", {
      yPercent: 24, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });

    // card thumbnails rotate on scroll
    gsap.utils.toArray(".card-thumb").forEach((img) => {
      gsap.fromTo(img, { rotate: -14 }, {
        rotate: 8, ease: "none",
        scrollTrigger: { trigger: img.closest(".card"), start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // section headings drift up slightly
    gsap.utils.toArray(".section-head h2").forEach((el) => {
      gsap.fromTo(el, { y: 20 }, {
        y: -10, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
      });
    });
  }

  // Nothing to reveal means nothing for the libs to drive (the 404 page), so
  // don't pay for them.
  if (wantMotion && reveals.length) {
    loadScripts([
      "/vendor/lenis.min.js",
      "/vendor/gsap.min.js",
      "/vendor/ScrollTrigger.min.js",
    ]).then(initMotion);
  } else {
    revealFallback();
  }
})();
