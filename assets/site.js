/* Decrux Tech — shared behaviour. Small, defensive, no dependencies. */
(function () {
  'use strict';
  var staticMode = /[?&]static\b/.test(location.search);

  if (staticMode) document.body.classList.add('loaded');
  setTimeout(function () { document.body.classList.add('loaded'); }, 2500);

  /* reveals */
  var rv = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window && !staticMode) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* mobile nav */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navlinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  /* risk dial */
  var boxes = Array.prototype.slice.call(document.querySelectorAll('#checks input'));
  var arc = document.getElementById('dialArc');
  var val = document.getElementById('scoreVal');
  var note = document.getElementById('scoreNote');
  var CIRC = 308;

  function describe(score) {
    if (score >= 85) return ['Solid', 'A posture that survives an audit. Keep it documented.'];
    if (score >= 55) return ['Uneven', 'The basics are there. The gaps are the expensive part.'];
    if (score >= 25) return ['Exposed', 'Enough missing that one bad email could cost you a week.'];
    return ['Open door', 'Start with MFA and one tested restore. Those two move the needle most.'];
  }
  function redraw() {
    var score = boxes.reduce(function (s, b) { return s + (b.checked ? parseInt(b.dataset.w, 10) : 0); }, 0);
    if (val) val.textContent = String(score);
    if (arc) {
      arc.setAttribute('stroke-dashoffset', String(CIRC - (CIRC * score / 100)));
      arc.setAttribute('stroke', score >= 85 ? '#1E8F63' : score >= 55 ? '#2549C7' : score >= 25 ? '#B4761A' : '#B23A2E');
    }
    var d = describe(score);
    if (note) note.innerHTML = '<b>' + d[0] + '.</b> ' + d[1];
  }
  if (boxes.length) {
    boxes.forEach(function (b) { b.addEventListener('change', redraw); });
    redraw();
  }

  /* calculator */
  var hrs = document.getElementById('hrs');
  var rate = document.getElementById('rate');
  function money(n) { return '$' + Math.round(n).toLocaleString('en-CA'); }
  function calc() {
    if (!hrs || !rate) return;
    var h = parseInt(hrs.value, 10), r = parseInt(rate.value, 10);
    var perYear = Math.round(h * 46);
    var hv = document.getElementById('hrsVal'), rv2 = document.getElementById('rateVal');
    var yo = document.getElementById('yrOut'), vo = document.getElementById('valOut');
    if (hv) hv.textContent = String(h);
    if (rv2) rv2.textContent = String(r);
    if (yo) yo.textContent = String(perYear);
    if (vo) vo.textContent = money(perYear * r);
  }
  if (hrs) hrs.addEventListener('input', calc);
  if (rate) rate.addEventListener('input', calc);
  calc();

  /* under-page nav highlighting */
  var subLinks = Array.prototype.slice.call(document.querySelectorAll('.subnav a[href^="#"]'));
  if (subLinks.length && 'IntersectionObserver' in window) {
    var targets = subLinks.map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        subLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-90px 0px -70% 0px', threshold: 0 });
    targets.forEach(function (t) { seen.observe(t); });
  }

  /* year */
  var y = document.getElementById('yr');
  if (y) y.textContent = String(new Date().getFullYear());
})();
