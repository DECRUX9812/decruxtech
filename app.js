/* DECRUX TECH v4 — vanilla interaction engine (no dependencies) */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll progress hairline */
  function progress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Mobile nav */
  function nav() {
    var header = document.getElementById('header');
    var toggle = document.querySelector('.nav-toggle');
    if (!header || !toggle) return;
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    header.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    /* Active link */
    var file = (window.location.pathname.split('/').pop() || 'index.html').split('?')[0] || 'index.html';
    header.querySelectorAll('.nav-links a[data-nav]').forEach(function (a) {
      var key = a.getAttribute('data-nav');
      if ((file === 'index.html' && key === 'home') ||
          (file === 'services.html' && key === 'services') ||
          (file === 'industries.html' && key === 'industries') ||
          (file === 'portfolio.html' && key === 'work') ||
          (file === 'insights.html' && key === 'insights')) a.classList.add('active');
    });
  }

  /* Reveal on scroll */
  function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduced) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
    els.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 6) * 60) + 'ms';
      io.observe(el);
    });
  }

  /* Animated counters */
  function counters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (reduced) { el.firstChild.nodeValue = String(target); return; }
      var t0 = performance.now(), dur = 1400;
      var tick = function (t) {
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.firstChild.nodeValue = String(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* Panel bars animate in */
  function bars() {
    var bars = document.querySelectorAll('.bar i[data-w]');
    if (!bars.length) return;
    var run = function () {
      bars.forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
    };
    if (reduced) { run(); return; }
    setTimeout(run, 350);
  }

  /* Terminal typewriter */
  function term() {
    var el = document.getElementById('typed');
    if (!el || reduced) return;
    var phrases = [
      'scan identity → 4 gaps found',
      'scan backups → recovery plan drafted',
      'scan website → 2 conversion leaks found',
      'roadmap ready — 3 quick wins queued'
    ];
    var pi = 0, ci = 0, del = false;
    var type = function () {
      var phrase = phrases[pi];
      if (!del) {
        el.textContent = phrase.slice(0, ci + 1); ci++;
        if (ci >= phrase.length) { del = true; setTimeout(type, 1700); return; }
        setTimeout(type, 28 + Math.random() * 24);
      } else {
        el.textContent = phrase.slice(0, ci); ci--;
        if (ci <= 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 320); return; }
        setTimeout(type, 14);
      }
    };
    type();
  }

  /* Risk score ring */
  function risk() {
    var form = document.getElementById('risk-score');
    if (!form) return;
    var val = document.getElementById('score-value');
    var field = document.getElementById('score-field');
    var ring = document.getElementById('score-ring');
    var C = 2 * Math.PI * 52;
    var update = function () {
      var checked = form.querySelectorAll('[data-score]:checked');
      var score = 50;
      checked.forEach(function (c) { score += Number(c.getAttribute('data-score')); });
      score = Math.min(100, score);
      if (val) val.firstChild.nodeValue = String(score);
      if (field) field.value = String(score);
      if (ring) ring.style.strokeDashoffset = String(C - (score / 100) * C);
    };
    form.addEventListener('change', update);
    update();
  }

  /* Savings calculator */
  function calc() {
    var form = document.getElementById('savings-form');
    if (!form) return;
    var hours = document.getElementById('hours-per-week');
    var cost = document.getElementById('hourly-cost');
    var hOut = document.getElementById('savings-hours');
    var vOut = document.getElementById('savings-value');
    var ctx = document.getElementById('savings-context');
    var fmt = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
    var update = function () {
      var w = Math.max(0, Number(hours && hours.value || 0));
      var c = Math.max(0, Number(cost && cost.value || 0));
      var annual = Math.round(w * 52 * 0.5);
      if (hOut) hOut.firstChild.nodeValue = String(annual);
      if (vOut) vOut.firstChild.nodeValue = fmt.format(annual * c);
      if (ctx) ctx.value = w + ' hrs/wk @ ' + fmt.format(c) + '/hr ≈ ' + annual + ' hrs/yr';
    };
    form.addEventListener('input', update);
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    progress(); nav(); reveal(); counters(); bars(); term(); risk(); calc();
  });
})();
