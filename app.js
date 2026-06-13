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
