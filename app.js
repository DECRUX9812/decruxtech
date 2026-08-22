/* ══════════════════════════════════════════════════════════
   DECRUX TECH — Experience Engine v3 "Signal"
   Lean motion: constellation canvas, reveals, live widgets.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. CONSTELLATION CANVAS (hero accent) ── */
  function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width, height, dpr;
    const COUNT = 70;                 // capped for perf
    const LINK_DIST = 140;
    const particles = [];
    let frameId = 0;
    let running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function create() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - .5) * .22,
          vy: (Math.random() - .5) * .22,
          r: .8 + Math.random() * 1.4,
        });
      }
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = width + 20; else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20; else if (p.y > height + 20) p.y = -20;
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const t = 1 - Math.sqrt(d2) / LINK_DIST;
            ctx.strokeStyle = `rgba(27,124,255,${(t * .16).toFixed(3)})`;
            ctx.lineWidth = .7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150,205,255,.5)';
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    }

    // Pause when tab is hidden — no background burn
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frameId);
      } else if (!running) {
        running = true;
        draw();
      }
    });

    resize();
    create();
    draw();
    window.addEventListener('resize', () => { resize(); create(); });
    window.addEventListener('pagehide', () => { running = false; cancelAnimationFrame(frameId); });
  }

  /* ── 2. SCROLL PROGRESS ── */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 3. HEADER SCROLL STATE ── */
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 4. MOBILE NAV ── */
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.addEventListener('click', (e) => {
      if (e.target instanceof HTMLAnchorElement) {
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── 5. TYPEWRITER (command panel terminal) ── */
  function initTypewriter() {
    if (reducedMotion) return;
    const el = document.getElementById('typed-output');
    if (!el) return;

    const phrases = [
      'checking identity, backups, website, workflows...',
      'finding quick wins and revenue leaks...',
      'building a prioritized modernization roadmap...'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        el.textContent = phrase.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex >= phrase.length) {
          deleting = true;
          setTimeout(type, 1900);
          return;
        }
        setTimeout(type, 30 + Math.random() * 22);
      } else {
        el.textContent = phrase.slice(0, charIndex);
        charIndex--;
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 320);
          return;
        }
        setTimeout(type, 15);
      }
    }
    type();
  }

  /* ── 6. PANEL TILT (desktop pointer only, subtle) ── */
  function initPanelTilt() {
    if (reducedMotion) return;
    const panel = document.querySelector('.command-panel');
    if (!panel || !window.matchMedia('(hover: hover)').matches) return;

    panel.addEventListener('pointermove', (e) => {
      const rect = panel.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      panel.style.transform = `rotateY(${(x * 4).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg)`;
    });
    panel.addEventListener('pointerleave', () => { panel.style.transform = ''; });
  }

  /* ── 7. SCROLL REVEAL ── */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll(
      '.section-head, .service-card, .roi-card, .case-card, .trust-card, ' +
      '.stat-item, .score-card, .calculator-card, .cta-block, .plan-card'
    );
    if (!targets.length) return;

    // No-JS / reduced-motion safety: CSS only hides when .animate-* present.
    targets.forEach((el, i) => {
      el.classList.add('animate-fade');
      el.style.transitionDelay = `${(i % 6) * 55}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -36px 0px' });

    targets.forEach((t) => observer.observe(t));
  }

  /* ── 8. COUNTERS ── */
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.target, 10);
      counter.textContent = '0';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(counter);

          if (reducedMotion) { counter.textContent = target > 1 ? `${target}+` : String(target); return; }

          const duration = 1400;
          const start = performance.now();

          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            counter.textContent = String(current);
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              counter.textContent = target > 1 ? `${target}+` : String(target);
            }
          }
          requestAnimationFrame(update);
        });
      }, { threshold: .3 });

      observer.observe(counter);
    });
  }

  /* ── 9. RISK SCORE (business logic — unchanged) ── */
  function initRiskScore() {
    const form = document.getElementById('risk-score');
    if (!form) return;

    const scoreValue = document.getElementById('score-value');
    const scoreField = document.getElementById('score-field');
    const ring = document.getElementById('score-ring-progress');
    const circumference = 2 * Math.PI * 68; // r=68

    function updateScore() {
      const checked = [...form.querySelectorAll('[data-score]:checked')];
      const score = Math.min(100, checked.reduce((total, input) => total + Number(input.dataset.score || 0), 50));
      if (scoreValue) scoreValue.textContent = String(score);
      if (scoreField) scoreField.value = String(score);
      if (ring) {
        const offset = circumference - (score / 100) * circumference;
        ring.style.strokeDashoffset = String(offset);
      }
    }

    form.addEventListener('change', updateScore);
    updateScore();
  }

  /* ── 10. SAVINGS CALCULATOR (business logic — unchanged) ── */
  function initSavingsCalculator() {
    const form = document.getElementById('savings-form');
    if (!form) return;

    const hoursInput = document.getElementById('hours-per-week');
    const costInput = document.getElementById('hourly-cost');
    const hoursOutput = document.getElementById('savings-hours');
    const valueOutput = document.getElementById('savings-value');
    const contextField = document.getElementById('savings-context');
    const formatMoney = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

    function update() {
      const weeklyHours = Math.max(0, Number(hoursInput?.value || 0));
      const hourlyCost = Math.max(0, Number(costInput?.value || 0));
      const annualHours = Math.round(weeklyHours * 52 * 0.5);
      const annualValue = annualHours * hourlyCost;
      if (hoursOutput) hoursOutput.textContent = String(annualHours);
      if (valueOutput) valueOutput.textContent = formatMoney.format(annualValue);
      if (contextField) contextField.value = `${weeklyHours} hours/week at ${formatMoney.format(hourlyCost)}/hour; approx ${annualHours} hours/year reviewed`;
    }

    form.addEventListener('input', update);
    update();
  }

  /* ── 11. CONTACT FORM CONTEXT (service select → detail fields + UTM context) ── */
  function initContactFormContext() {
    const select = document.querySelector('[data-service-select]');
    if (!select) return;
    const details = document.querySelectorAll('.service-detail');
    const utmField = document.getElementById('utm-field');

    function updateDetail() {
      details.forEach((d) => d.classList.toggle('is-active', d.dataset.detail === select.value));
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const service = params.get('service');
      if (service) {
        for (const opt of select.options) {
          if (opt.value === service || opt.text === service) { select.value = opt.value; break; }
        }
        if (utmField) utmField.value = `Arrived from: ${service}`;
      }
    } catch (_) { /* noop */ }

    select.addEventListener('change', () => {
      updateDetail();
      if (utmField && select.value) utmField.value = `Selected service: ${select.value}`;
    });
    updateDetail();
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initScrollProgress();
    initHeader();
    initNav();
    initTypewriter();
    initPanelTilt();
    initScrollReveal();
    initCounters();
    initRiskScore();
    initSavingsCalculator();
    initContactFormContext();
  });

})();
