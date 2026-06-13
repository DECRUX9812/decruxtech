/* ══════════════════════════════════════════════════════════
   DECRUX TECH — Immersive Experience Engine v2
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ────────────────────────────
     1. 3D PARTICLE COSMOS (Canvas)
     ──────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width, height, centerX, centerY;
    const particles = [];
    const PARTICLE_COUNT = 160;
    const CONNECTION_DIST = 150;
    let mouse = { x: 0, y: 0, vx: 0, vy: 0 };
    let frameId;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      centerX = width / 2;
      centerY = height / 2;
    }

    function createParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 60 + Math.random() * (Math.min(width, height) * 0.35);
        particles.push({
          x: centerX + radius * Math.sin(phi) * Math.cos(theta),
          y: centerY + radius * Math.cos(phi),
          z: radius * Math.sin(phi) * Math.sin(theta),
          r: 0.6 + Math.random() * 1.6,
          speedZ: 0.0002 + Math.random() * 0.0004,
          speedAngle: (Math.random() - 0.5) * 0.002,
          theta: theta,
          phi: phi,
          radius: radius,
          baseAlpha: 0.3 + Math.random() * 0.5,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Sort by z for depth
      particles.sort((a, b) => a.z - b.z);

      // Mouse influence
      const mdx = mouse.vx * 0.0003;
      const mdy = mouse.vy * 0.0003;

      const projected = [];

      for (const p of particles) {
        // Rotate
        p.theta += p.speedAngle + mdx;
        p.phi += 0.0003 + mdy;

        // Sphere position
        const r = p.radius;
        const sx = r * Math.sin(p.phi) * Math.cos(p.theta);
        const sy = r * Math.cos(p.phi);
        const sz = r * Math.sin(p.phi) * Math.sin(p.theta);

        p.x = centerX + sx;
        p.y = centerY + sy;
        p.z = sz;

        // Depth-based sizing and alpha
        const depthNorm = (p.z + r) / (2 * r);
        const size = p.r * (0.4 + 0.6 * depthNorm);
        const alpha = p.baseAlpha * (0.3 + 0.7 * depthNorm);

        projected.push({ x: p.x, y: p.y, size, alpha, idx: projected.length });
      }

      // Draw connections (only between close particles in 2D)
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECTION_DIST) {
            const connAlpha = (1 - dist / CONNECTION_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(90, 180, 255, ${connAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of projected) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 240, 255, ${p.alpha})`;
        ctx.fill();

        // Glow
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(101, 209, 66, ${p.alpha * 0.08})`;
          ctx.fill();
        }
      }

      // Decay mouse velocity
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;

      frameId = requestAnimationFrame(draw);
    }

    // Track mouse for parallax
    document.addEventListener('mousemove', (e) => {
      mouse.vx += (e.clientX - mouse.x) * 0.01;
      mouse.vy += (e.clientY - mouse.y) * 0.01;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pagehide', () => cancelAnimationFrame(frameId));
  }

  /* ────────────────────────────
     2. CUSTOM CURSOR
     ──────────────────────────── */
  function initCursor() {
    // Hide cursor entirely on touch devices — no half-working hybrid
    if (reducedMotion || window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches) {
      const glow = document.querySelector('.cursor-glow');
      const dot = document.querySelector('.cursor-dot');
      if (glow) glow.style.display = 'none';
      if (dot) dot.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    const glow = document.querySelector('.cursor-glow');
    const dot = document.querySelector('.cursor-dot');
    if (!glow || !dot) return;

    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let dx = window.innerWidth / 2, dy = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      gx = e.clientX;
      gy = e.clientY;
    });

    function animateCursor() {
      // Faster lerp (0.25 vs 0.08) — cursor keeps up with mouse
      dx += (gx - dx) * 0.25;
      dy += (gy - dy) * 0.25;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, .service-card, .roi-card, .case-card, .trust-card, .score-option, .nav-toggle, .plan-card, .industry, .feature-card, .trust-engine-card');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
    });
  }

  /* ────────────────────────────
     3. SCROLL PROGRESS
     ──────────────────────────── */
  function initScrollProgress() {
    if (reducedMotion) return;
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;

    function update() {
      const scroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${(scroll / height) * 100}%`;
      requestAnimationFrame(update);
    }
    update();
  }

  /* ────────────────────────────
     4. HEADER SCROLL EFFECT
     ──────────────────────────── */
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

  /* ────────────────────────────
     5. MOBILE NAV TOGGLE
     ──────────────────────────── */
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

  /* ────────────────────────────
     6. TYPEWRITER / TERMINAL
     ──────────────────────────── */
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
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 32 + Math.random() * 20);
      } else {
        el.textContent = phrase.slice(0, charIndex);
        charIndex--;
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 300);
          return;
        }
        setTimeout(type, 16);
      }
    }
    type();
  }

  /* ────────────────────────────
     7. COMMAND PANEL 3D TILT
     ──────────────────────────── */
  function initPanelTilt() {
    if (reducedMotion) return;
    const panel = document.querySelector('.command-panel');
    if (!panel) return;

    panel.addEventListener('pointermove', (e) => {
      const rect = panel.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      panel.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });

    panel.addEventListener('pointerleave', () => {
      panel.style.transform = '';
    });
  }

  /* ────────────────────────────
     8. SCROLL REVEAL ANIMATIONS
     ──────────────────────────── */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const selectors = [
      '.section-head', '.service-card', '.roi-card', '.case-card',
      '.trust-card', '.stat-item', '.score-card', '.calculator-card',
      '.cta-block', '.hero-copy', '.command-panel'
    ];
    const targets = document.querySelectorAll(selectors.join(','));
    if (!targets.length) return;

    // Add animation classes
    targets.forEach((el, i) => {
      if (el.classList.contains('hero-copy') || el.classList.contains('command-panel')) return;
      el.classList.add('animate-fade');
      el.style.transitionDelay = `${(i % 8) * 50}ms`;
    });

    // Animate hero elements directly
    const heroEls = document.querySelectorAll('.hero-copy > *');
    heroEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });

    // Fade in hero immediately
    setTimeout(() => {
      heroEls.forEach((el, i) => {
        el.style.transition = `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.6s ease ${0.1 + i * 0.08}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 200);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((target) => {
      if (target.classList.contains('hero-copy') || target.classList.contains('command-panel')) return;
      observer.observe(target);
    });
  }

  /* ────────────────────────────
     9. ANIMATED COUNTERS
     ──────────────────────────── */
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

          if (reducedMotion) {
            counter.textContent = target;
            return;
          }

          const duration = 1500 + Math.random() * 800;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            if (target <= 3) {
              counter.textContent = current;
            } else {
              counter.textContent = current;
              // Add + suffix for some
              if (current >= target && target > 1) counter.textContent = `${target}+`;
            }

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              counter.textContent = target > 1 ? `${target}+` : String(target);
            }
          }
          requestAnimationFrame(update);
        });
      }, { threshold: 0.3 });

      observer.observe(counter);
    });
  }

  /* ────────────────────────────
     10. RISK SCORE
     ──────────────────────────── */
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

  /* ────────────────────────────
     11. SAVINGS CALCULATOR
     ──────────────────────────── */
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

  /* ────────────────────────────
     INIT
     ──────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursor();
    initScrollProgress();
    initHeader();
    initNav();
    initTypewriter();
    initPanelTilt();
    initScrollReveal();
    initCounters();
    initRiskScore();
    initSavingsCalculator();
  });

})();