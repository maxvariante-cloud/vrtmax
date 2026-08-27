/* =========================================================
   VRT Climatização — interações
   ========================================================= */
(function () {
  "use strict";

  /* ---- Configuração do WhatsApp (edite aqui) ---- */
  const phoneNumber = "5511995935810";
  const message = "Olá! Vim pelo site e quero solicitar um orçamento.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });

  /* ---- Preloader: carregando por 3 segundos (animado via JS) ---- */
  const preloader = document.getElementById("preloader");
  if (preloader) {
    const bar = preloader.querySelector(".preloader-bar i");
    const fan = preloader.querySelector(".preloader-fan");
    const DURATION = 3000;
    const t0 = performance.now();
    const hidePreloader = () => preloader.classList.add("done");

    const step = (now) => {
      const p = Math.min((now - t0) / DURATION, 1);
      const eased = 1 - Math.pow(1 - p, 3); // desacelera no fim
      if (bar) bar.style.transform = "scaleX(" + eased + ")";
      if (fan) fan.style.transform = "rotate(" + p * 1080 + "deg)"; // 3 voltas
      if (p < 1) requestAnimationFrame(step);
      else hidePreloader();
    };
    requestAnimationFrame(step);

    // fallback de segurança, caso algo trave
    setTimeout(hidePreloader, DURATION + 800);
  }

  /* ---- Ano no rodapé ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header + barra de progresso ---- */
  const header = document.querySelector("[data-header]");
  const progress = document.getElementById("scrollProgress");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("is-scrolled", y > 10);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu mobile ---- */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  const closeMobile = () => {
    if (!mobileNav) return;
    mobileNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobile));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobile();
    });
  }

  /* ---- Nav ativo conforme a seção visível ---- */
  const navLinks = Array.from(document.querySelectorAll(".desktop-nav a"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---- Contadores animados (suporta decimais) ---- */
  const animateCounter = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = "true";
    const target = Number(el.dataset.count || 0);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.textContent.replace(/[\d.,\s]/g, "");
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = (target * eased).toFixed(decimals);
      el.textContent = (decimals ? val.replace(".", ",") : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (decimals ? target.toFixed(decimals).replace(".", ",") : target) + suffix;
    };
    requestAnimationFrame(tick);
  };

  /* ---- Reveal on scroll + disparo de gráficos/contadores ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
        if (entry.target.matches("[data-count]")) animateCounter(entry.target);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );
  // cascata clean: cada item surge em sequência dentro do seu próprio grupo
  document.querySelectorAll(".reveal").forEach((el) => {
    const group = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    const idx = Math.max(0, group.indexOf(el));
    el.style.transitionDelay = `${Math.min(idx * 90, 360)}ms`;
    revealObserver.observe(el);
  });
  // contadores dentro do hero (que aparecem de imediato)
  document.querySelectorAll(".hero [data-count]").forEach(animateCounter);

  /* ---- FAQ: fecha os outros ao abrir ---- */
  document.querySelectorAll("details").forEach((d) => {
    d.addEventListener("toggle", () => {
      if (!d.open) return;
      document.querySelectorAll("details[open]").forEach((o) => {
        if (o !== d) o.open = false;
      });
    });
  });

  /* ---- Botões magnéticos ---- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.12;
        const y = (e.clientY - r.top - r.height / 2) * 0.12;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ---- Slider Antes/Depois ---- */
  const slider = document.getElementById("baSlider");
  if (slider) {
    const before = document.getElementById("baBefore");
    const handle = document.getElementById("baHandle");
    let dragging = false;
    // mantém a imagem "antes" na largura total do slider (alinhada com a "depois")
    const syncWidth = () => slider.style.setProperty("--ba-w", slider.clientWidth + "px");
    syncWidth();
    window.addEventListener("resize", syncWidth);
    const setPos = (clientX) => {
      const r = slider.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      before.style.width = pct + "%";
      handle.style.left = pct + "%";
      handle.setAttribute("aria-valuenow", Math.round(pct));
    };
    const start = () => (dragging = true);
    const stop = () => (dragging = false);
    slider.addEventListener("pointerdown", (e) => {
      start();
      setPos(e.clientX);
    });
    window.addEventListener("pointermove", (e) => dragging && setPos(e.clientX));
    window.addEventListener("pointerup", stop);
    handle.addEventListener("keydown", (e) => {
      const cur = Number(handle.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") {
        const r = slider.getBoundingClientRect();
        setPos(r.left + (r.width * (cur - 4)) / 100);
      } else if (e.key === "ArrowRight") {
        const r = slider.getBoundingClientRect();
        setPos(r.left + (r.width * (cur + 4)) / 100);
      }
    });
  }

  /* ---- Partículas de "ar" no hero (canvas leve) ---- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, particles, raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(70, Math.floor(w / 22));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.6,
        vx: -(Math.random() * 0.5 + 0.15),
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) { p.x = w + 10; p.y = Math.random() * h; }
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126, 211, 255, ${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    // pausa quando o hero sai da tela (economia)
    const heroObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { if (!raf) draw(); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    });
    heroObs.observe(canvas);
  }
})();
