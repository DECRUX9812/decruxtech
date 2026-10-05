# DESIGN.md — Decrux Tech

Direction for all Decrux Tech web work. Agents: apply `antislop` as the filter on top of this direction. This file supplies the identity the filter cannot.

## Identity

Decrux Tech is a Regina (Saskatchewan) IT, security, web, and AI-automation partner for small local businesses (typically 1 to 50 people). The brand voice is the calm local expert: plain language, no hype, no invented numbers, one accountable partner.

## Visual language: "Afterhours"

Cinematic dark system, established in the existing codebase and kept deliberately:

- **Palette (R-29 compliant):** near-black base `#060609`, panel `#0b0b12`, text `#f4f4f8` / `#a1a1b3` / `#6e6e80`, plus ONE brand gradient: ember `#ea580c` → violet `#9333ea` ("fire"). Neutral surfaces are white at 2.5 to 5 percent opacity.
- **Why the gradient (R-01):** it is the established brand identity, used as the single accent on primary buttons, the scroll-progress bar, and the active-nav underline. It is never a page background and never headline text.
- **Typography (R-06):** Space Grotesk for display (geometric, technical but warm, fits an IT brand), Inter for body (neutral readability at small sizes), JetBrains Mono for labels, phone numbers, and metadata (the "systems people" register). Chosen for brand character, not AI defaults.
- **Radius scale (R-11):** buttons 12px, cards 20 to 22px, inputs 10px, pills only in the marquee strip. Kept consistent.
- **Elevation (R-12):** shadows only on the fixed header and primary buttons (focus accent). Cards separate with 1px lines, not floating shadows.
- **Glassmorphism dose (R-10):** nav bar and mobile drawer only.
- **Background:** canvas aurora in the hero (with static fallback, honors reduced motion), no grids, no dot patterns elsewhere.

## Dials

`ENERGY 2 / RHYTHM 2 / MOTION 2`

Trust-first local B2B: calm and predictable, with a few deliberate breaks (the marquee strip, the interactive diagnostic tools). Motion is entrance transitions and hover states only; no parallax, no scroll hijacking, no template animation stacks.

## Copy rules (site-specific)

- Em dashes are banned; use commas, colons, periods, or parentheses (R-02).
- No fabricated numbers. Only claims Decrux can verify: "1 partner, whole stack", "30-min free checkup", "1-day max response" (R-17, R-36).
- CTAs name the real action: "Start my free checkup", "Book CyberShield" (R-15).
- No fake terminal windows, fake scans, or invented product output (R-05, R-38). The risk-score and calculator forms are real and functional; show real tools only.
- Eyebrow labels: at most one per three sections. Hero, marquee strip, and final CTA carry the only ones.
- Middle dot (`·`): maximum one per line.

## Section rhythm (R-05)

Home page order follows the customer's actual decision path: hero (what you are) > who it is for > what you run (services) > try the tools (diagnostic) > how it works (process) > ways to engage (offers) > FAQ > final CTA. Vary composition between adjacent sections; do not repeat the same head + grid pattern twice in a row.

## Decision log (R-31)

- Dark theme: the audience buys vigilance (security, IT); a dark, precise interface reads as competence, and it is the established brand. Reason recorded per R-21.
- One accent gradient, not five colors: local SMB buyers need to remember one thing about the brand.
- Real interactive tools (risk score, calculator) instead of a hero product shot: the service is invisible, so the tools ARE the demo.
- Stats strip holds policies, not metrics: the company is too small for adoption numbers, and fake ones would cost trust (R-17).
