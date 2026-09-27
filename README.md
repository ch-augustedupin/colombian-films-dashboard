# Cine colombiano en taquilla · Colombian films at the box office

Interactive, bilingual (ES/EN) dashboard of Colombian theatrical releases and their admissions,
built from MinCulturas' public SIREC file **HISTORICO Estrenos Colombia.xlsx**.

## How it works

| Piece | What it does |
|---|---|
| `scripts/update_data.py` | Opens the public SIREC SharePoint folder link (guest session), downloads the Excel via the SharePoint REST API, validates the `ESTRENOS Consolidado` columns and writes `docs/data/films.json`. Exits non-zero on any download/schema problem. |
| `.github/workflows/update-and-deploy.yml` | Every **Thursday 17:00 UTC (12:00 Bogotá)** runs the script, commits the data if it changed, and deploys `docs/` to GitHub Pages. Also runs on manual dispatch and on pushes to `main`. |
| `docs/` | Static dashboard (HTML/CSS/JS + ECharts from jsDelivr). |

## Run locally

```bash
pip install -r requirements.txt
python scripts/update_data.py
python -m http.server 8765 --directory docs
```

Then open http://localhost:8765.

## One-time GitHub setup

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. **Actions → Update data and deploy dashboard → Run workflow** for the first deploy.

If a scheduled run fails (e.g. the share link is revoked), GitHub emails the repo owner.
