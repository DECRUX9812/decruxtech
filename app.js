/* DECRUX Afterhours — slim interaction engine (vanilla, perf-guarded) */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(hover: none)').matches;

  function progress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var f = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    addEventListener('scroll', f, { passive: true }); f();
  }

  function header() {
    var h = document.getElementById('header');
    if (!h) return;
    addEventListener('scroll', function () {
      h.classList.toggle('scrolled', scrollY > 30);
    }, { passive: true });
    h.classList.toggle('scrolled', scrollY > 30);
    var file = (location.pathname.split('/').pop() || 'index.html').split('?')[0] || 'index.html';
    var key = { 'services.html': 'services', 'industries.html': 'industries', 'portfolio.html': 'work', 'insights.html': 'insights' }[file];
    if (key) h.querySelectorAll('.nav-links a').forEach(function (a) {
      if (a.dataset.nav === key) a.classList.add('active');
    });
  }

  function drawer() {
    var t = document.querySelector('.nav-toggle'), dr = document.getElementById('drawer');
    if (!t || !dr) return;
    t.addEventListener('click', function () {
      var open = document.body.classList.toggle('drawer-open');
      t.setAttribute('aria-expanded', String(open));
      dr.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    dr.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('drawer-open');
        t.setAttribute('aria-expanded', 'false');
        dr.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) t.click();
    });
  }

  function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || reduced) {
      els.forEach(function (el) { el.classList.add('in'); }); return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 6) * 60) + 'ms'; io.observe(el);
    });
  }

  function counters() {
    var nums = document.querySelectorAll('.count[data-t]');
    if (!nums.length) return;
    var run = function (el) {
      var T = +el.dataset.t;
      if (reduced) { el.textContent = T; return; }
      var t0 = performance.now();
      var tick = function (t) {
        var p = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * T);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  function magnetic() {
    if (reduced || coarse) return;
    document.querySelectorAll('.hero-actions .btn, .final .btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (((e.clientX - r.left - r.width / 2) / r.width) * 7).toFixed(1) + 'px,' + (((e.clientY - r.top - r.height / 2) / r.height) * 6).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  function spotlight() {
    if (reduced || coarse) return;
    document.querySelectorAll('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  function marquee() {
    document.querySelectorAll('.marquee').forEach(function (m) {
      if (!m.dataset.dup) { m.dataset.dup = '1'; m.innerHTML += m.innerHTML; }
    });
  }

  function term() {
    var el = document.getElementById('typed');
    if (!el || reduced) return;
    var phrases = ['scan identity → 4 gaps found', 'scan backups → untested since March', 'scan website → 2 conversion leaks', 'roadmap ready — 3 quick wins queued'];
    var pi = 0, ci = 0, del = false;
    (function type() {
      var ph = phrases[pi];
      if (!del) {
        el.textContent = ph.slice(0, ci + 1); ci++;
        if (ci >= ph.length) { del = true; setTimeout(type, 1700); return; }
        setTimeout(type, 30 + Math.random() * 22);
      } else {
        el.textContent = ph.slice(0, ci); ci--;
        if (ci <= 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(type, 320); return; }
        setTimeout(type, 14);
      }
    })();
  }

  function risk() {
    var form = document.getElementById('risk-score');
    if (!form) return;
    var val = document.getElementById('score-value'), field = document.getElementById('score-field'), ring = document.getElementById('score-ring');
    var C = 2 * Math.PI * 52;
    var update = function () {
      var s = 50;
      form.querySelectorAll('[data-score]:checked').forEach(function (c) { s += +c.dataset.score; });
      s = Math.min(100, s);
      if (val) val.firstChild.nodeValue = s;
      if (field) field.value = s;
      if (ring) ring.style.strokeDashoffset = C - (s / 100) * C;
    };
    form.addEventListener('change', update); update();
  }

  function calc() {
    var form = document.getElementById('savings-form');
    if (!form) return;
    var h = document.getElementById('hours-per-week'), c = document.getElementById('hourly-cost');
    var ho = document.getElementById('savings-hours'), vo = document.getElementById('savings-value'), ctx = document.getElementById('savings-context');
    var fmt = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
    var update = function () {
      var w = Math.max(0, +(h && h.value || 0)), pay = Math.max(0, +(c && c.value || 0));
      var annual = Math.round(w * 52 * 0.5);
      if (ho) ho.firstChild.nodeValue = annual;
      if (vo) vo.firstChild.nodeValue = fmt.format(annual * pay);
      if (ctx) ctx.value = w + ' hrs/wk @ ' + fmt.format(pay) + '/hr';
    };
    form.addEventListener('input', update); update();
  }

  /* Aurora: DPR-capped, paused offscreen/hidden; CSS fallback covers touch/motion */
  function aurora() {
    var cv = document.getElementById('sky');
    if (!cv || reduced || coarse) return;
    var cx = cv.getContext('2d');
    var W = 0, H = 0, t = 0, mx = 0.5, running = true;
    var blobs = [
      { h: 265, s: 0.6, r: 0.45, sp: 0.00022, ph: 0 },
      { h: 20, s: 0.55, r: 0.4, sp: 0.00017, ph: 2 },
      { h: 300, s: 0.5, r: 0.34, sp: 0.00026, ph: 4 }
    ];
    var rs = function () {
      var rect = cv.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      var d = Math.min(devicePixelRatio || 1, 1.25);
      cv.width = W * d; cv.height = H * d;
      cx.setTransform(d, 0, 0, d, 0, 0);
    };
    var paint = function () {
      if (!isFinite(W) || !isFinite(H) || W < 2 || H < 2) return;
      cx.clearRect(0, 0, W, H);
      cx.globalCompositeOperation = 'lighter';
      blobs.forEach(function (b, i) {
        var px = W * (0.5 + Math.sin(t * b.sp + b.ph) * 0.32 + (mx - 0.5) * 0.1 * (i + 1));
        var py = H * (0.4 + Math.cos(t * b.sp * 1.3 + b.ph) * 0.2);
        var r = Math.max(W, H) * b.r;
        if (![px, py, r].every(isFinite) || r <= 0) return;
        var g = cx.createRadialGradient(px, py, 0, px, py, r);
        g.addColorStop(0, 'hsla(' + b.h + ',85%,60%,' + (b.s * 0.42) + ')');
        g.addColorStop(1, 'hsla(0,0%,0%,0)');
        cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      });
    };
    var frame = function () {
      if (!running) return;
      t += 16.7; paint(); requestAnimationFrame(frame);
    };
    document.addEventListener('pointermove', function (e) {
      mx = e.clientX / innerWidth;
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var vis = es[0].isIntersecting;
        if (vis && !running) { running = true; frame(); }
        running = vis;
      }).observe(cv);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) running = false;
      else if (!running) { running = true; frame(); }
    });
    addEventListener('resize', rs);
    rs(); frame();
  }

  if (/[?&]static/.test(location.search)) {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('loaded');
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      document.querySelectorAll('.count[data-t]').forEach(function (el) { el.textContent = el.dataset.t; });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('loaded');
    progress(); header(); drawer(); reveal(); counters();
    magnetic(); spotlight(); marquee(); term(); risk(); calc(); aurora();
  });
  setTimeout(function () { document.body.classList.add('loaded'); }, 2500);
})();
