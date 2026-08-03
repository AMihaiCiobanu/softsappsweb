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
  const critters = document.getElementById("critters");
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
    let w = 0, h = 0, dots, raf;
    const COUNT = window.innerWidth < 640 ? 34 : 70;
    const COLORS = ["#22d3ee", "#7c3aed", "#ec4899"];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // While the stylesheet is still pending the canvas is a plain in-flow box
      // that takes its layout size *from* its backing store, so writing
      // width/height grows the element, which re-triggers the observer. Clamping
      // to the viewport makes that settle at a fixed point instead of doubling.
      w = Math.min(rect.width, window.innerWidth);
      h = Math.min(rect.height, window.innerHeight * 2);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
    // Never draw against a box the canvas doesn't actually have. On a cold load
    // this deferred script can run before the stylesheet is applied, and an
    // unstyled canvas measures its intrinsic 300x150 — the field then gets
    // stretched ~6x by CSS and reads as a dense mesh of fat dots until a reload
    // (warm CSS) makes the first measurement correct.
    const start = () => {
      resize();
      if (w < 1 || h < 1) return; // no layout yet — the observer calls back
      make(); cancelAnimationFrame(raf); frame();
    };

    let rt;
    const restart = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        // Sub-pixel jitter (font swap, scrollbar) isn't worth reshuffling for.
        if (dots && Math.abs(rect.width - w) < 2 && Math.abs(rect.height - h) < 2) return;
        start();
      }, 200);
    };

    if ("ResizeObserver" in window) {
      new ResizeObserver(() => (dots ? restart() : start())).observe(canvas);
    } else {
      start();
      window.addEventListener("resize", restart);
      window.addEventListener("load", start);
    }
  }

  /* ---------- critter strip ---------- */
  // Cats, dogs and small robots patrolling the bottom edge of the viewport.
  // Drawn as vectors rather than sprites: no extra request, crisp at any DPR,
  // and tintable with the brand triad. The canvas only exists on the homepage,
  // and that element check is the entire page gate.
  if (critters && !reduce) {
    const g = critters.getContext("2d");
    // One mascot per shipped project — waiter for the restaurant site, planner
    // for the appointments app, book for the kids' learning app, mirror for the
    // beauty studio — plus a few animals for company.
    const MASCOTS = ["waiter", "planner", "book", "mirror"];
    const PETS = ["cat", "dog", "bot"];
    const TYPES = MASCOTS.concat(PETS);
    const TINTS = ["#22d3ee", "#7c3aed", "#ec4899"];
    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];

    let sw = 0, sh = 0, crew = [], loopId = 0, last = 0;
    let ptrX = -1e4, ptrNear = false;

    /* --- population --- */
    // Everything except position and heading, so a critter that walks off one
    // edge can come back as a different animal instead of the same one forever.
    function reroll(c) {
      c.type = pick(TYPES);
      c.color = pick(TINTS);
      c.speed = rand(0.45, 0.95);
      // Tallest art is ~46px; cap the scale so nobody's head leaves the band
      // mid-hop on the shorter mobile strip.
      c.scale = rand(0.85, Math.max(0.85, Math.min(1.25, (sh - 22) / 46)));
      c.state = "walk";
      c.timer = rand(180, 480);
      c.hopIn = rand(360, 720);
      c.hopT = -1;
      c.look = 0;
      c.flee = 0;
      c.spark = 0;
      c.seed = rand(0, 100);
      return c;
    }
    const spawn = (x, dir) => reroll({ x, dir, phase: rand(0, 6.28), idle: rand(0, 6.28) });

    function populate() {
      const n = sw < 640 ? 3 : 5;
      // Deal the project mascots first, shuffled, so the cast on screen at the
      // first paint is the portfolio rather than whatever chance hands out.
      const deck = MASCOTS.slice();
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      crew = Array.from({ length: n }, (_, i) => {
        const c = spawn((sw * (i + 0.5)) / n + rand(-40, 40), Math.random() < 0.5 ? -1 : 1);
        if (i < deck.length) c.type = deck[i];
        return c;
      });
    }

    /* --- drawing helpers (local space: origin at the feet, facing +x) --- */
    // roundRect() is still too new to lean on, and arcTo is everywhere.
    function rrect(x, y, bw, bh, r) {
      g.beginPath();
      g.moveTo(x + r, y);
      g.arcTo(x + bw, y, x + bw, y + bh, r);
      g.arcTo(x + bw, y + bh, x, y + bh, r);
      g.arcTo(x, y + bh, x, y, r);
      g.arcTo(x, y, x + bw, y, r);
      g.closePath();
    }
    function dot(c, x, y, r) {
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fillStyle = c.color;
      g.fill();
    }
    // The whole gait in one path: each leg is a two-segment polyline whose foot
    // swings on the walk phase and lifts through the forward half of the step.
    function legs(xs, top, len, phase, spread) {
      g.beginPath();
      for (let i = 0; i < xs.length; i++) {
        const p = phase + (i * Math.PI * 2) / xs.length;
        const swing = Math.sin(p) * spread;
        const lift = Math.max(0, Math.sin(p)) * 2.5;
        g.moveTo(xs[i], top);
        g.lineTo(xs[i] + swing * 0.5, top + len * 0.55);
        g.lineTo(xs[i] + swing, top + len - lift);
      }
      g.stroke();
    }

    function drawCat(c) {
      legs([-11, -6, 8, 13], -13, 13, c.phase, 4);
      g.beginPath(); // arched back
      g.moveTo(-15, -13);
      g.quadraticCurveTo(-5, -27, 9, -22);
      g.quadraticCurveTo(16, -20, 16, -14);
      g.quadraticCurveTo(3, -8, -15, -13);
      g.stroke();
      const sway = Math.sin(c.idle * 2) * 4 + c.look * 6;
      g.beginPath(); // tail curls up and sways
      g.moveTo(-15, -15);
      g.quadraticCurveTo(-26, -18 - sway, -22, -30 - sway);
      g.stroke();
      g.beginPath(); // head + pointy ears
      g.arc(20, -26, 6.5, 0, Math.PI * 2);
      g.moveTo(15.5, -30); g.lineTo(15, -37); g.lineTo(20, -32);
      g.moveTo(21, -32); g.lineTo(26, -37); g.lineTo(25.5, -30);
      g.stroke();
      dot(c, 22, -26.5, 1.6);
    }

    function drawDog(c) {
      legs([-13, -8, 9, 14], -13, 13, c.phase, 4.5);
      g.beginPath(); // longer, boxier body
      g.moveTo(-17, -13);
      g.quadraticCurveTo(-19, -24, -7, -24);
      g.lineTo(8, -24);
      g.quadraticCurveTo(18, -24, 18, -15);
      g.quadraticCurveTo(3, -8, -17, -13);
      g.stroke();
      const wag = Math.sin(c.idle * 7) * 6; // ~3x the cat's tail
      g.beginPath();
      g.moveTo(-17, -20);
      g.quadraticCurveTo(-24, -24, -26 + wag * 0.3, -31 + wag);
      g.stroke();
      g.beginPath(); // head, muzzle, floppy ear
      g.arc(21, -27, 7, 0, Math.PI * 2);
      g.moveTo(26, -27);
      g.quadraticCurveTo(33, -26, 32, -22);
      g.quadraticCurveTo(29, -21, 26, -22);
      g.moveTo(18, -33);
      g.quadraticCurveTo(13, -32, 14, -25);
      g.quadraticCurveTo(17, -24, 18, -27);
      g.stroke();
      dot(c, 23, -28, 1.6);
      dot(c, 32, -24, 1.2);
    }

    function drawBot(c, now) {
      legs([-5, 5], -13, 13, c.phase, 3);
      rrect(-11, -31, 22, 18, 5);
      g.stroke();
      rrect(-7, -27, 14, 7, 3);
      g.stroke();
      const scan = Math.sin(c.idle * 1.6 + c.seed) * 3.5;
      const blink = Math.sin(now * 0.004 + c.seed) > 0.94 ? 0.15 : 1;
      const alpha = g.globalAlpha;
      g.globalAlpha = alpha * blink;
      dot(c, scan, -23.5, 2);
      g.globalAlpha = alpha;
      const arm = Math.sin(c.phase) * 4;
      const bob = Math.sin(c.idle * 3 + c.seed) * 2;
      g.beginPath();
      g.moveTo(-11, -27); g.lineTo(-15, -19 + arm);
      g.moveTo(11, -27); g.lineTo(15, -19 - arm);
      g.moveTo(0, -31); g.lineTo(2, -39 + bob);
      g.stroke();
      dot(c, 2, -40 + bob, 2.2);
    }

    /* --- project mascots --- */
    // Popasul Drumețului (restaurant)
    function drawWaiter(c) {
      legs([-5, 5], -13, 13, c.phase, 3);
      g.beginPath(); // torso, shoulders wider than waist
      g.moveTo(-7, -13); g.lineTo(-9, -30); g.lineTo(9, -30); g.lineTo(7, -13);
      g.closePath();
      g.stroke();
      g.beginPath();
      g.arc(1, -37, 6, 0, Math.PI * 2);
      g.stroke();
      g.beginPath(); // bow tie
      g.moveTo(-3.5, -32); g.lineTo(0, -30.5); g.lineTo(3.5, -32);
      g.lineTo(3.5, -29); g.lineTo(0, -30.5); g.lineTo(-3.5, -29);
      g.closePath();
      g.stroke();
      const swing = Math.sin(c.phase) * 3;
      const bob = Math.sin(c.phase * 2) * 0.8;
      g.beginPath();
      g.moveTo(-9, -28); g.lineTo(-12, -19 + swing); // free arm
      g.moveTo(9, -28); g.lineTo(14, -36); // tray arm, held steady
      g.moveTo(5, -37 + bob); g.lineTo(23, -37 + bob); // tray
      g.moveTo(18, -37 + bob); g.lineTo(18, -42 + bob); // and a glass on it
      g.moveTo(15, -42 + bob); g.lineTo(21, -42 + bob);
      g.stroke();
      dot(c, 3.5, -38, 1.4);
    }

    // Appointments & Reports — spiral planner with a running clock on the cover
    function drawPlanner(c) {
      legs([-4, 4], -13, 13, c.phase, 3);
      rrect(-11, -37, 22, 24, 3);
      g.stroke();
      const swing = Math.sin(c.phase) * 3;
      g.beginPath();
      for (let i = 0; i < 3; i++) { g.moveTo(-14, -32 + i * 6); g.lineTo(-8, -32 + i * 6); }
      g.moveTo(-11, -25); g.lineTo(-15, -18 + swing);
      g.moveTo(11, -25); g.lineTo(15, -18 - swing);
      g.stroke();
      g.beginPath();
      g.arc(1, -25, 7, 0, Math.PI * 2);
      g.stroke();
      const hand = c.idle * 1.2 + c.seed;
      g.beginPath();
      g.moveTo(1, -25); g.lineTo(1 + Math.cos(hand) * 5, -25 + Math.sin(hand) * 5);
      g.moveTo(1, -25); g.lineTo(1 + Math.cos(hand * 0.3) * 3.4, -25 + Math.sin(hand * 0.3) * 3.4);
      g.stroke();
    }

    // Istețel — an open book: two page blocks meeting at the spine, breathing
    function drawBook(c) {
      legs([-5, 5], -13, 13, c.phase, 3);
      const flap = Math.sin(c.idle * 3) * 1.5;
      g.beginPath();
      g.moveTo(-17, -14);
      g.lineTo(-17, -29 - flap);
      g.quadraticCurveTo(-9, -33 - flap, 0, -29);
      g.lineTo(0, -14);
      g.quadraticCurveTo(-9, -18, -17, -14);
      g.closePath();
      g.moveTo(17, -14);
      g.lineTo(17, -29 + flap);
      g.quadraticCurveTo(9, -33 + flap, 0, -29);
      g.lineTo(0, -14);
      g.quadraticCurveTo(9, -18, 17, -14);
      g.closePath();
      g.stroke();
      g.beginPath(); // lines of text
      g.moveTo(-13, -25); g.lineTo(-4, -24);
      g.moveTo(-13, -21); g.lineTo(-4, -20);
      g.moveTo(4, -24); g.lineTo(13, -25);
      g.moveTo(4, -20); g.lineTo(13, -21);
      g.stroke();
    }

    // Silvia Skin Studio — hand mirror with a sparkle drifting across the glass
    function drawMirror(c) {
      legs([-4, 4], -13, 13, c.phase, 3);
      g.beginPath();
      g.moveTo(0, -13); g.lineTo(0, -22);
      g.stroke();
      g.beginPath();
      g.arc(0, -32, 10, 0, Math.PI * 2);
      g.stroke();
      g.beginPath();
      g.arc(0, -32, 6.5, 0, Math.PI * 2);
      g.stroke();
      const s = Math.sin(c.idle * 2 + c.seed) * 3;
      const swing = Math.sin(c.phase) * 3;
      g.beginPath();
      g.moveTo(s - 3, -32); g.lineTo(s + 3, -32);
      g.moveTo(s, -35); g.lineTo(s, -29);
      g.moveTo(-8, -26); g.lineTo(-13, -20 + swing);
      g.moveTo(8, -26); g.lineTo(13, -20 - swing);
      g.stroke();
    }

    const ART = {
      cat: drawCat, dog: drawDog, bot: drawBot,
      waiter: drawWaiter, planner: drawPlanner, book: drawBook, mirror: drawMirror,
    };

    function draw(c, now) {
      const hop = c.hopT >= 0 ? Math.sin(c.hopT * Math.PI) * 14 : 0;
      const ground = sh - 6;

      // contact shadow — sells that they're standing on the very bottom edge
      g.globalAlpha = 0.22 * (1 - hop / 16);
      g.fillStyle = c.color;
      g.beginPath();
      g.ellipse(c.x, ground + 2, 15 * c.scale, 2.6, 0, 0, Math.PI * 2);
      g.fill();

      g.save();
      g.translate(c.x, ground - hop);
      g.scale(c.dir * c.scale, c.scale);
      g.rotate(-0.16 * c.look); // rears back to look up at the cursor
      g.globalAlpha = 1;
      g.strokeStyle = c.color;
      g.shadowColor = c.color;
      g.shadowBlur = 6;
      g.lineWidth = 2;
      g.lineJoin = "round";
      g.lineCap = "round";

      (ART[c.type] || drawCat)(c, now);

      if (c.spark > 0) {
        g.globalAlpha = c.spark;
        g.beginPath();
        g.moveTo(0, -46); g.lineTo(0, -40);
        g.stroke();
        dot(c, 0, -37, 1.4);
      }
      g.restore();
    }

    /* --- behaviour --- */
    function step(c, dt) {
      const near = ptrNear && Math.abs(c.x - ptrX) < 120 ? 1 : 0;
      c.look += (near - c.look) * 0.1 * dt;
      c.idle += 0.02 * dt;
      c.timer -= dt;

      if (c.flee > 0) {
        c.flee -= dt;
        c.spark = Math.max(0, c.spark - 0.02 * dt);
      } else if (c.state === "walk" && c.timer <= 0) {
        c.state = "pause";
        c.timer = rand(60, 150);
      } else if (c.state === "pause" && c.timer <= 0) {
        if (Math.random() < 0.3) c.dir *= -1;
        c.state = "walk";
        c.timer = rand(180, 480);
      }

      if (c.hopT >= 0) {
        c.hopT += 0.045 * dt;
        if (c.hopT >= 1) c.hopT = -1;
      } else {
        c.hopIn -= dt;
        if (c.hopIn <= 0 && c.state === "walk" && c.flee <= 0) {
          c.hopT = 0;
          c.hopIn = rand(360, 720);
        }
      }

      const sp = c.flee > 0 ? c.speed * 3.2 : c.speed * (1 - c.look * 0.95);
      const dx = c.flee > 0 || c.state === "walk" ? sp * c.dir * dt : 0;
      c.x += dx;
      // Gait advances with distance, not time, so the steps line up with the
      // speed whatever the scale or the flee multiplier.
      c.phase += Math.abs(dx) * 0.3;

      if (c.x < -60) { reroll(c); c.x = sw + 60; }
      else if (c.x > sw + 60) { reroll(c); c.x = -60; }
    }

    function frame(now) {
      const dt = last ? Math.min((now - last) / 16.667, 3) : 1;
      last = now;
      g.clearRect(0, 0, sw, sh);
      for (let i = 0; i < crew.length; i++) {
        step(crew[i], dt);
        draw(crew[i], now);
      }
      g.globalAlpha = 1;
      g.shadowBlur = 0;
      loopId = requestAnimationFrame(frame);
    }

    /* --- sizing & lifecycle --- */
    function measure() {
      const rect = critters.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sw = rect.width;
      sh = rect.height;
      critters.width = Math.round(sw * dpr);
      critters.height = Math.round(sh * dpr);
      // Draw in CSS pixels; the backing-store scale lives in the transform.
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const run = () => {
      cancelAnimationFrame(loopId);
      last = 0; // a stale timestamp would produce one huge dt
      loopId = requestAnimationFrame(frame);
    };

    let rt;
    const remeasure = () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        const prev = sw;
        measure();
        if (sw < 1 || sh < 1) return;
        if (!crew.length) { populate(); return; }
        // Keep the cast on stage rather than respawning it — rotating a phone
        // shouldn't teleport everyone back to the start.
        if (prev > 0 && sw !== prev) {
          const k = sw / prev;
          crew.forEach((c) => (c.x = Math.max(-40, Math.min(sw + 40, c.x * k))));
        }
      }, 200);
    };

    measure();
    populate();
    run();

    if ("ResizeObserver" in window) new ResizeObserver(remeasure).observe(critters);
    else window.addEventListener("resize", remeasure);

    // Don't burn a RAF loop in a background tab.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(loopId);
      else run();
    });

    // The canvas stays pointer-events:none so it can never swallow a click
    // meant for the page — proximity is hit-tested against window coordinates
    // instead. Strip is full-width at left:0, so clientX is already local x.
    if (isFine) {
      window.addEventListener("mousemove", (e) => {
        ptrNear = e.clientY > window.innerHeight - sh - 40;
        ptrX = e.clientX;
      }, { passive: true });
      document.addEventListener("mouseleave", () => { ptrNear = false; });
      window.addEventListener("click", (e) => {
        if (e.clientY < window.innerHeight - sh - 20) return;
        crew.forEach((c) => {
          if (Math.abs(c.x - e.clientX) > 90) return;
          c.dir = c.x < e.clientX ? -1 : 1;
          c.flee = 60;
          c.spark = 1;
          c.look = 0;
          c.state = "walk";
        });
      });
    }
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
