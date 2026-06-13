# Decrux Tech Website

Static marketing website for Decrux Tech.

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/index.html`.

## Deployment

This repo is ready for static hosting. The included `CNAME` points the production domain to `decruxtech.com`, and `netlify.toml` publishes the repository root for Netlify-style static deploys.

Recommended production flow:

1. Merge reviewed changes into `main`.
2. Point the production host at `main` or the chosen production branch.
3. Confirm DNS for `decruxtech.com` points at the host.
4. Run the checks below before publishing.

## Pre-deploy checks

```bash
python3 - <<'PY'
from html.parser import HTMLParser
from pathlib import Path
class P(HTMLParser): pass
for path in Path('.').glob('*.html'):
    parser=P(); parser.feed(path.read_text()); print(f'parsed {path}')
PY
```

```bash
git diff --check
```
