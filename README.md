# Decrux Tech Website

Static marketing website for Decrux Tech — "Afterhours" design system:
cinematic dark, ember→violet fire accents, Space Grotesk display,
canvas aurora hero, glass nav + mobile drawer, interactive risk score
and automation savings calculator.

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`.

Pages: `index`, `services`, `industries`, `portfolio` (Work),
`insights`, `contact-form`, `thanks`. Shared `styles.css` + `app.js`
(vanilla JS, no dependencies). Contact form posts via FormSubmit to
`info@decruxtech.com` and redirects to `thanks.html`.

## Design sketches (local only, never deployed)

`sketches/` holds disposable direction mockups (A/B/C round winner: B).
Ignored by git via `.gitignore`.

## Deployment

Static hosting. `CNAME` points the production domain to `decruxtech.com`;
`netlify.toml` publishes the repository root for Netlify-style deploys.

Production flow:

1. Merge reviewed changes into `main`.
2. Point the production host at `main`.
3. Confirm DNS for `decruxtech.com` points at the host.
4. Run the checks below before publishing.

## Pre-deploy checks

```bash
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
class P(HTMLParser): pass
for path in sorted(Path('.').glob('*.html')):
    parser=P(); parser.feed(path.read_text()); print(f'parsed {path}')
PY
```

```bash
node --check app.js && git diff --check
```
