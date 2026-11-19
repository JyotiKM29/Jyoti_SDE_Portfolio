// Jyoti Kumari — portfolio interactions (no dependencies)
document.documentElement.classList.remove("no-js");
document.body.classList.add("is-loading");

(function () {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hero = document.querySelector(".hero");
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Loader → hero intro ---------- */
  const MIN_SHOW = 1700;           // how long the quote stays
  const start = performance.now();
  let done = false;
  function finishLoading() {
    if (done) return; done = true;
    const wait = Math.max(0, MIN_SHOW - (performance.now() - start));
    setTimeout(() => {
      document.body.classList.add("loaded");
      setTimeout(() => {
        hero.classList.add("ready");
        document.body.classList.remove("is-loading");
      }, 650);
      setTimeout(() => { const l = document.getElementById("loader"); if (l) l.remove(); }, 1600);
    }, wait);
  }
  if (document.readyState === "complete") finishLoading();
  else window.addEventListener("load", finishLoading);
  setTimeout(finishLoading, 4000); // never block on a slow asset

  /* ---------- Split big titles into words ---------- */
  document.querySelectorAll(".split").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w, i) =>
      `<span class="w" aria-hidden="true"><span style="transition-delay:${i * 60}ms">${w}</span></span>`
    ).join(" ");
  });

  /* ---------- Reveal on scroll (each section has its own style) ---------- */
  const animated = document.querySelectorAll(".split, .reveal, .slide, .rise");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      if (entry.target.hasAttribute("data-count")) countUp(entry.target);
      entry.target.querySelectorAll(".scramble").forEach(scramble);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -60px 0px" });
  animated.forEach((el) => io.observe(el));

  // Clipped images have no visible area yet, so watch their parent instead
  const clipIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll(":scope > .clip-reveal").forEach((c) => c.classList.add("in"));
      clipIO.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  new Set([...document.querySelectorAll(".clip-reveal")].map((c) => c.parentElement)).forEach((p) => clipIO.observe(p));

  /* ---------- Counters ---------- */
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400, t0 = performance.now();
    const fmt = (n) => n.toLocaleString("en-IN");
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- Text scramble ---------- */
  const glyphs = "!<>-_\\/[]{}=+*^?#$%&";
  function scramble(el) {
    if (el.dataset.busy) return;
    el.dataset.busy = "1";
    const final = el.dataset.text || el.textContent;
    let frame = 0; const total = 28;
    (function tick() {
      const progress = frame / total;
      let out = "";
      for (let i = 0; i < final.length; i++) {
        out += final[i] === " " ? " " : (i / final.length < progress ? final[i] : glyphs[Math.floor(Math.random() * glyphs.length)]);
      }
      el.textContent = out;
      if (++frame <= total) setTimeout(tick, 32);
      else { el.textContent = final; delete el.dataset.busy; }
    })();
  }
  document.querySelectorAll(".scramble").forEach((el) => el.addEventListener("mouseenter", () => scramble(el)));

  /* ---------- Dark → cream when the arsenal section arrives ---------- */
  const lightSections = document.querySelectorAll("[data-theme='light']");
  const themeIO = new IntersectionObserver(() => {
    const anyLight = [...lightSections].some((s) => {
      const r = s.getBoundingClientRect();
      return r.top < window.innerHeight * 0.55 && r.bottom > 0;
    });
    document.body.classList.toggle("light", anyLight);
  }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
  lightSections.forEach((s) => themeIO.observe(s));
  window.addEventListener("scroll", () => {
    const anyLight = [...lightSections].some((s) => {
      const r = s.getBoundingClientRect();
      return r.top < window.innerHeight * 0.55 && r.bottom > 0;
    });
    document.body.classList.toggle("light", anyLight);
  }, { passive: true });

  /* ---------- Hero parallax (desktop) ---------- */
  const lines = hero.querySelectorAll(".h-line");
  const sides = hero.querySelectorAll(".side-line");
  const drifts = hero.querySelectorAll(".hero-links li");
  let ticking = false;
  function parallax() {
    ticking = false;
    const s = window.scrollY;
    if (s > window.innerHeight * 1.2) return;
    const wide = window.innerWidth >= 1024;
    lines.forEach((l) => { l.style.transform = `translate3d(${s * 0.45 * parseFloat(l.dataset.x)}px,0,0)`; });
    if (!wide) return;
    sides.forEach((el) => { el.style.translate = `0 ${-s * 0.05 * parseFloat(el.dataset.speed)}px`; });
    drifts.forEach((el) => { el.style.translate = `0 ${s * 0.1 * parseFloat(el.dataset.drift)}px`; });
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });

  /* ---------- Drawer menu ---------- */
  const btn = document.querySelector(".menu-btn");
  const drawer = document.getElementById("drawer");
  const setMenu = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  };
  btn.addEventListener("click", () => setMenu(drawer.hidden));
  drawer.querySelector(".drawer-backdrop").addEventListener("click", () => setMenu(false));
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) setMenu(false); });

  /* ---------- Copy email ---------- */
  document.querySelectorAll("[data-copy]").forEach((b) => {
    const label = b.textContent;
    b.addEventListener("click", async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(b.dataset.copy); ok = true; } catch (e) {}
      b.textContent = ok ? "Copied ✓" : b.dataset.copy;
      setTimeout(() => { b.textContent = label; }, 2000);
    });
  });

  /* ---------- Blob cursor + project preview (desktop mouse only) ---------- */
  if (!finePointer) return;
  document.documentElement.classList.add("has-cursor");
  const blob = document.querySelector(".blob");
  const preview = document.querySelector(".cursor-preview");
  const previewImg = preview.querySelector("img");
  let mx = -300, my = -300, bx = -300, by = -300, px = -300, py = -300;

  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener("mouseleave", () => blob.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => blob.classList.remove("is-hidden"));

  (function loop() {
    bx += (mx - bx) * 0.16; by += (my - by) * 0.16;
    px += (mx - px) * 0.1;  py += (my - py) * 0.1;
    blob.style.transform = `translate3d(${bx}px, ${by}px, 0) translate(-50%, -50%)`;
    preview.style.left = px + "px"; preview.style.top = py + "px";
    requestAnimationFrame(loop);
  })();

  const setSize = (size) => {
    blob.classList.remove("is-link", "is-lg", "is-xl");
    if (size) blob.classList.add("is-" + size);
  };
  document.addEventListener("mouseover", (e) => {
    const t = e.target;
    if (t.closest(".drawer")) return setSize(null);
    if (t.closest("a, button")) return setSize("link");
    if (t.closest(".hero-title, .contact-title, .say-hi")) return setSize("xl");
    if (t.closest(".big-title, .dsa-num, .slider")) return setSize("lg");
    setSize(null);
  });

  document.querySelectorAll("[data-preview]").forEach((p) => {
    const src = p.dataset.preview;
    const pre = new Image(); pre.src = src;
    p.addEventListener("mouseenter", () => {
      previewImg.src = src;
      preview.classList.toggle("portrait", p.dataset.previewSize === "portrait");
      preview.classList.add("show");
    });
    p.addEventListener("mouseleave", () => preview.classList.remove("show"));
  });
})();
