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

  /* ── v5: glass header on scroll ── */
  function headerState() {
    var header = document.getElementById('header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 24);
      var top = document.getElementById('toTop');
      if (top) top.classList.toggle('show', window.scrollY > 900);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── v5: fullscreen drawer ── */
  function drawer() {
    var header = document.getElementById('header');
    var toggle = document.querySelector('.nav-toggle');
    var dr = document.getElementById('drawer');
    if (!header || !toggle || !dr) return;
    // rewire toggle (v4 handler removed by replacing node)
    var fresh = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(fresh, toggle);
    fresh.addEventListener('click', function () {
      var open = document.body.classList.toggle('drawer-open');
      header.classList.toggle('open', open);
      fresh.setAttribute('aria-expanded', String(open));
      dr.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    dr.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('drawer-open');
        header.classList.remove('open');
        fresh.setAttribute('aria-expanded', 'false');
        dr.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('drawer-open')) fresh.click();
    });
  }

  /* ── v5: kinetic word split ── */
  function splitWords() {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      var frag = document.createDocumentFragment();
      var i = 0;
      var addWords = function (node) {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var wi = document.createElement('span'); wi.className = 'wi';
            wi.textContent = part; wi.style.transitionDelay = (0.08 + (i++) * 0.07) + 's';
            w.appendChild(wi); frag.appendChild(w);
          });
        } else if (node.nodeType === 1) {
          var w = document.createElement('span'); w.className = 'w';
          var wi = document.createElement('span'); wi.className = 'wi';
          wi.style.transitionDelay = (0.08 + (i++) * 0.07) + 's';
          wi.appendChild(node.cloneNode(true)); w.appendChild(wi); frag.appendChild(w);
        }
      };
      Array.prototype.slice.call(el.childNodes).forEach(addWords);
      el.innerHTML = ''; el.appendChild(frag);
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      document.body.classList.add('loaded');
    }); });
  }

  /* ── v5: magnetic buttons (fine pointers only) ── */
  function magnetic() {
    if (reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.magnetic, .hero-actions .btn, .cta-inner .btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = 'translate(' + (x * 6).toFixed(1) + 'px,' + (y * 5).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ── v5: cursor glow ── */
  function glow() {
    if (reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;
    var g = document.createElement('div'); g.id = 'glow';
    document.body.appendChild(g);
    var tx = 0, ty = 0, x = 0, y = 0, shown = false;
    document.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; g.style.opacity = '1'; }
    }, { passive: true });
    (function loop() {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      g.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ── v5: marquee duplication ── */
  function marquee() {
    document.querySelectorAll('.marquee').forEach(function (m) {
      if (m.dataset.dup) return;
      m.dataset.dup = '1';
      m.innerHTML += m.innerHTML;
      m.setAttribute('aria-hidden', 'false');
    });
  }

  /* ── v5: scrollspy (index sections) ── */
  function spy() {
    var links = document.querySelectorAll('.nav-links a[data-nav]');
    if (!links.length) return;
    var map = { services: 'services', offers: 'services', diagnostic: 'services', process: 'services' };
    var secs = ['diagnostic', 'offers', 'process'].map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!secs.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('spy', a.getAttribute('data-nav') === map[e.target.id]);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* ── v5: tilt cards (fine pointers only) ── */
  function tilt() {
    if (reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.bento .card, .plans .card').forEach(function (card) {
      card.classList.add('tilt');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 5).toFixed(2) + 'deg) rotateX(' + (-y * 5).toFixed(2) + 'deg) translateY(-2px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ── v5: back to top ── */
  function toTop() {
    var b = document.createElement('button');
    b.id = 'toTop'; b.setAttribute('aria-label', 'Back to top'); b.textContent = '↑';
    document.body.appendChild(b);
    b.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ── v5: aurora canvas ── */
  function aurora() {
    var cv = document.getElementById('aurora');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, mx = 0.5, my = 0.4, t = 0, running = true;
    var blobs = [
      { hue: 235, s: 0.55, r: 0.42, sp: 0.00022, ph: 0.0, amp: 0.16 },
      { hue: 265, s: 0.6, r: 0.36, sp: 0.00017, ph: 2.1, amp: 0.2 },
      { hue: 215, s: 0.65, r: 0.3, sp: 0.00026, ph: 4.2, amp: 0.14 },
      { hue: 160, s: 0.4, r: 0.22, sp: 0.00013, ph: 5.3, amp: 0.12 }
    ];
    var resize = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var rect = cv.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var paint = function () {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      blobs.forEach(function (b, i) {
        var px = W * (0.5 + Math.sin(t * b.sp + b.ph) * b.amp * 2 + (mx - 0.5) * 0.12 * (i + 1));
        var py = H * (0.42 + Math.cos(t * b.sp * 1.3 + b.ph * 1.7) * b.amp + (my - 0.4) * 0.1 * (i + 1));
        var r = Math.max(W, H) * b.r;
        var g = ctx.createRadialGradient(px, py, 0, px, py, r);
        g.addColorStop(0, 'hsla(' + b.hue + ',85%,62%,' + b.s * 0.5 + ')');
        g.addColorStop(1, 'hsla(' + b.hue + ',85%,62%,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });
    };
    var frame = function () {
      if (!running) return;
      t += 16.7; paint();
      requestAnimationFrame(frame);
    };
    document.addEventListener('pointermove', function (e) {
      var rect = cv.getBoundingClientRect();
      if (e.clientY < rect.bottom + 200) {
        mx = e.clientX / window.innerWidth; my = e.clientY / Math.max(rect.height, 1);
      }
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        var vis = entries[0].isIntersecting;
        if (vis && !running) { running = true; frame(); }
        running = vis;
      }).observe(cv);
    }
    window.addEventListener('resize', resize);
    resize(); paint();
    if (!reduced) frame(); else running = false;
  }

  /* Static preview mode (?static): fully revealed, final values — for screenshots/SEO */
  if (/[?&]static/.test(window.location.search)) {
    document.body.classList.add('loaded');
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
      document.querySelectorAll('[data-count]').forEach(function (el) {
        el.firstChild.nodeValue = el.getAttribute('data-count');
      });
      document.querySelectorAll('.bar i[data-w]').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    progress(); nav(); headerState(); drawer(); splitWords(); reveal(); counters(); bars(); term(); risk(); calc();
    magnetic(); glow(); marquee(); spy(); tilt(); toTop(); aurora();
  });
})();
