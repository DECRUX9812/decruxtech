const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const revealTargets = document.querySelectorAll('.card, .section-head, .checkup, .contact-strip, .industry, .feature-card, .form-card, .info-panel, .success-card, .plan-card, .case-card, .score-card, .roi-row');
revealTargets.forEach((target) => target.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const commandPanel = document.querySelector('.command-3d');
if (commandPanel && !reducedMotion) {
  commandPanel.addEventListener('pointermove', (event) => {
    const rect = commandPanel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    commandPanel.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  commandPanel.addEventListener('pointerleave', () => {
    commandPanel.style.transform = '';
  });
}

const typedOutput = document.querySelector('#typed-output');
if (typedOutput && !reducedMotion) {
  const phrases = [
    'checking identity, backups, website, workflows...',
    'finding quick wins and revenue leaks...',
    'building a prioritized modernization roadmap...'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  const type = () => {
    const phrase = phrases[phraseIndex];
    typedOutput.textContent = phrase.slice(0, charIndex + 1);
    charIndex += 1;
    if (charIndex >= phrase.length) {
      setTimeout(() => {
        charIndex = 0;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        type();
      }, 1400);
      return;
    }
    setTimeout(type, 38);
  };
  type();
}

const riskScore = document.querySelector('#risk-score');
if (riskScore) {
  const scoreValue = document.querySelector('#score-value');
  const scoreField = document.querySelector('#score-field');
  const updateScore = () => {
    const checked = [...riskScore.querySelectorAll('[data-score]:checked')];
    const score = checked.reduce((total, input) => total + Number(input.dataset.score || 0), 50);
    if (scoreValue) scoreValue.textContent = String(score);
    if (scoreField) scoreField.value = String(score);
    riskScore.style.setProperty('--score', `${score}%`);
  };
  riskScore.addEventListener('change', updateScore);
  updateScore();
}

const serviceSelect = document.querySelector('[data-service-select]');
const serviceDetails = document.querySelectorAll('.service-detail');
if (serviceSelect) {
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('service');
  if (requestedService) {
    const matchingOption = [...serviceSelect.options].find((option) => option.text === requestedService || option.value === requestedService);
    if (matchingOption) serviceSelect.value = matchingOption.value || matchingOption.text;
  }
  const syncDetails = () => {
    serviceDetails.forEach((detail) => detail.classList.toggle('is-active', detail.dataset.detail === serviceSelect.value));
  };
  serviceSelect.addEventListener('change', syncDetails);
  syncDetails();
}

const utmField = document.querySelector('#utm-field');
if (utmField) {
  const params = new URLSearchParams(window.location.search);
  const context = [...params.entries()].map(([key, value]) => `${key}=${value}`).join('&');
  if (context) utmField.value = context;
}

const savingsForm = document.querySelector('#savings-calculator-form');
if (savingsForm) {
  const hoursInput = document.querySelector('#hours-per-week');
  const costInput = document.querySelector('#hourly-cost');
  const hoursOutput = document.querySelector('#savings-hours');
  const valueOutput = document.querySelector('#savings-value');
  const contextField = document.querySelector('#savings-context');
  const formatMoney = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
  const updateSavings = () => {
    const weeklyHours = Math.max(0, Number(hoursInput?.value || 0));
    const hourlyCost = Math.max(0, Number(costInput?.value || 0));
    const annualHours = Math.round(weeklyHours * 52 * 0.5);
    const annualValue = annualHours * hourlyCost;
    if (hoursOutput) hoursOutput.textContent = String(annualHours);
    if (valueOutput) valueOutput.textContent = formatMoney.format(annualValue);
    if (contextField) contextField.value = `${weeklyHours} hours/week at ${formatMoney.format(hourlyCost)}/hour; approx ${annualHours} hours/year reviewed`;
  };
  savingsForm.addEventListener('input', updateSavings);
  updateSavings();
}

const particleCanvas = document.querySelector('.hero-particles');
if (particleCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = particleCanvas.getContext('2d');
  const particles = [];
  let width = 0;
  let height = 0;
  let frame;

  const resizeParticles = () => {
    const rect = particleCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    particleCanvas.width = Math.floor(width * ratio);
    particleCanvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles.length = 0;
    const count = Math.max(34, Math.min(86, Math.floor(width / 18)));
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 1.7 + 0.7,
      });
    }
  };

  const drawParticles = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(184,255,115,.72)';
      ctx.fill();
      for (let j = index + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 115) {
          ctx.strokeStyle = `rgba(83,183,255,${(1 - distance / 115) * 0.24})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });
    frame = requestAnimationFrame(drawParticles);
  };

  resizeParticles();
  drawParticles();
  window.addEventListener('resize', resizeParticles);
  window.addEventListener('pagehide', () => cancelAnimationFrame(frame));
}
