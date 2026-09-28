# CLAUDE.md

Bilingual (ES/EN) interactive dashboard of Colombian theatrical releases and admissions, built from
MinCulturas' public SIREC file "HISTORICO Estrenos Colombia.xlsx". Owner: GitHub `ch-augustedupin`.

- Live site: https://ch-augustedupin.github.io/colombian-films-dashboard/
- Repo: https://github.com/ch-augustedupin/colombian-films-dashboard (public; Pages source = GitHub Actions)

## Layout
- `scripts/update_data.py` — downloads the Excel, validates the `ESTRENOS Consolidado` sheet, joins director + synopsis from
  `TITULOS CLASIFICADOS_REGISTRADOS.xlsx` (sheet `TITULOS REGISTRADOS`, header row 6) by acta number, writes `docs/data/films.json`
- `scripts/tag_topics.py` — tags each synopsis (>= 8 words) with 2–3 codes from `docs/data/taxonomy.json` using the Claude API
  (`claude-sonnet-5`, structured output, effort low). Cache in `docs/data/topics.json` keyed by acta + sha1(synopsis): only new or
  changed synopses are sent. `--estimate` (free), `--limit N --dry-run`, `--batch` (Message Batches API, one-time backfill).
  Refuses to run while taxonomy `status` contains "draft". In CI it needs the `ANTHROPIC_API_KEY` repo secret; the step is
  `continue-on-error` so tagging never blocks the data refresh.
- `.github/workflows/update-and-deploy.yml` — Thursdays 17:00 UTC (12:00 Bogotá) refresh + commit + Pages deploy; also on manual dispatch and push to `main`
- `docs/` — static site: `index.html`, `styles.css`, `app.js` (vanilla JS + ECharts 5 from jsDelivr, no build step)

## Commands
```bash
pip install -r requirements.txt
python scripts/update_data.py          # refresh data (prints "No changes" if identical)
python -m http.server 8765 --directory docs   # preview (also in .claude/launch.json as "dashboard")
```

## Data source (non-obvious)
- Only the **folder** share link works anonymously: `https://mcultura-my.sharepoint.com/:f:/g/personal/sirec_mincultura_gov_co/EvK4Z0jd1G1Mvgu94k1L5YsB4IpRICiX41MTdYZtm8Pk8Q`.
  Visiting it grants a guest `FedAuth` cookie; the file is then read via SharePoint REST
  (`GetFileByServerRelativeUrl(...)/$value`, fallback `GetFileById`). `Doc.aspx` / `download.aspx?SourceUrl=` links redirect to login.
- Sheet header is row 2; 13 fixed columns + a 14th whose header holds the extraction date ("Fecha Descarga dd/mm/yyyy"), shown as "Datos al …".
- The user says the file structure never changes; the script still fails loudly on column mismatch or < 1000 rows.
- `films.json` row keys: `d` date, `t` title, `o` original title, `ty` Largometraje/Cortometraje, `m` minutes, `g` genre,
  `r` rating, `c` countries[], `mc` main country, `p` applicant, `a` admissions, `id` acta, `dir` director, `syn` synopsis.
  `meta.sha256` detects changes. The dashboard hides all topic UI until `topics.json` has entries.
- Estimated cost of tagging (Sonnet 5): backfill of ~1,419 synopses ≈ 244k in / 35k out ≈ $0.84 ($0.42 with --batch);
  weekly increments < $0.01. Changing a taxonomy code does NOT retag old films automatically — clear topics.json to redo them.

## Whole-market data (v3, `docs/data/market.json`, written by `update_data.py`)
- `HISTORICO Exhibicion_Por_Dia.xlsx` → sheet `Historico x Día` (header row 2): daily admissions + revenue (COP millions)
  for ALL films since 2007, updated ~monthly. Aggregated client-side to week/month/quarter/year.
- `HISTORICO Estrenos Total.xlsx` → `ESTRENOS` (all releases, domestic + foreign): feature films only, grouped by
  release year and main producing country (CO / US / OT). `Detalle Largometrajes` (header row 3): screens by exhibition
  year since 2020; 2023–2024 list only Colombian titles → flagged `complete: false`, shown as no data.
- SIREC does NOT publish revenue or weekly figures per film: revenue/weekly views are whole-market; Colombian films
  appear as a share. Shares exclude shorts (they would inflate Colombia to 30–40%; features-only is ~1.6–2%).
- Market failures are non-fatal (previous market.json kept). The market section only follows the period filter.

## Design decisions
- v3: the dashboard opens on feature films (`S.type = "Largometraje"`); shorts via the Duración filter and a closed
  "Largometrajes y cortometrajes" section at the bottom. No rating filter. Period = date inputs + "Todo"/"Este año".
- Light/dark switch (`data-theme` on <html>, saved in localStorage "theme", applied pre-paint in index.html).
- Colors: Colombia `--co` aqua, US `--us` violet, other countries `--ot` neutral gray, whole market `--mk` gray.
- The film table scrolls inside `.table-wrap` (max-height) so its sticky header row stays visible.
- Short films' admissions are ~10x features' (shorts are screened before other films), so "Top films" defaults to
  feature films with a toggle, and "Admisiones por año" starts with shorts hidden. Keep them separated.
- Colors: feature = slot 1 blue (`--s1`), short = slot 2 orange (`--s2`), defined as CSS tokens with dark-mode variants; charts read tokens at render time.
- All UI strings live in `I18N` (es/en) in `app.js`; category values translated via `VALUES_EN`/`COUNTRIES_EN`. Add both languages for any new text.
- Cross-filtering: clicking bars sets filters; breakdown charts ignore their own filter and dim unselected bars.
- Topics are AI-generated: the dashboard shows a note card explaining that (keep it). Synopses are untrusted text —
  render with textContent, and the tagging prompt tells the model to ignore instructions inside them.
- Author credit in the footer: "Simón Moreno Salinas". Subtitle: "Estrenos colombianos en salas de cine nacionales".
- Shell gotcha: in this Bash tool a double backslash inside heredocs collapses to a single one; use the Edit tool
  (or `chr(92)` in Python) for any edit whose text contains backslashes.
- User-requested must-haves: ES/EN switch top right, films-released card, releases-over-time bars, top films by admissions, duración bars, time filter.

## Topic tagging runs on the Claude subscription, not the API
- The user chose not to pay for the API. The backfill (1,419 films) was tagged in a Claude Code session with Sonnet
  subagents via `tag_topics.py --export` → tag → `--import`. No `ANTHROPIC_API_KEY` secret exists, so the Actions tagging
  step just logs a warning and skips.
- New films are tagged by the cloud routine "Weekly topic tagging – Colombian films dashboard"
  (https://claude.ai/code/routines/trig_014vxfFyyL4Yv7vXa3BDJSzf): Thursdays 19:00 UTC, two hours after the data refresh,
  model claude-sonnet-5, tools Bash/Read/Write. It exports pending films, tags them itself, imports, and pushes only
  `docs/data/topics.json` to main (which triggers the Pages deploy). Debug with RemoteTrigger `list_runs` / `get_run_log`.
  Not yet proven: that a routine can push directly to main (the first real run with new films will show it).

## Git
- Local identity is repo-scoped: `ch-augustedupin <ch-augustedupin@users.noreply.github.com>` (keeps the personal email out of the public repo).
- The Actions bot commits weekly `data: weekly refresh …` — `git pull` before editing.
- Open item: the source file was last updated on a Friday; if Thursday runs keep missing new data, move the cron to Friday.
