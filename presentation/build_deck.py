"""Build the "Colombian Film Industry – 2026 YTD" PDF deck from the live dashboard.

1. Opens the published dashboard in Edge (via Playwright), sets filters, and screenshots cards.
2. Lays the screenshots out as 16:9 slides (slides.html) and prints them to PDF.

    pip install playwright
    python presentation/build_deck.py

Slide titles are written for the September 2026 edition; review them before rebuilding later.
"""

from __future__ import annotations

import html
from pathlib import Path

from playwright.sync_api import sync_playwright

URL = "https://ch-augustedupin.github.io/colombian-films-dashboard/"
HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
SHOTS = OUT / "shots"
PDF = OUT / "Colombian-Film-Industry-2026-YTD.pdf"

YTD = {"from": "2026-01-01", "to": "2026-09-30"}

# Page-side helper: apply a dashboard state through its own controls, like a user would.
SET_STATE = """
async (o) => {
  const $ = (s) => document.querySelector(s);
  const click = (s) => { const el = $(s); if (!el) throw new Error('missing ' + s); el.click(); };
  if (o.from) {
    $('#fromDate').value = o.from; $('#fromDate').dispatchEvent(new Event('change'));
    $('#toDate').value = o.to; $('#toDate').dispatchEvent(new Event('change'));
  }
  if (o.type !== undefined) click(`#typeSeg [data-type="${o.type}"]`);
  if (o.gran) click(`#granSeg [data-gran="${o.gran}"]`);
  if (o.mkMetric) click(`#mkMetricSeg [data-metric="${o.mkMetric}"]`);
  if (o.mkGran) click(`#mkGranSeg [data-mgran="${o.mkGran}"]`);
  if (o.share) click(`#shareSeg [data-share="${o.share}"]`);
  if (o.dim) click(`#scrDimSeg [data-dim="${o.dim}"]`);
  await new Promise((r) => setTimeout(r, 1200));  // let ECharts finish its animation
}
"""

# name, dashboard state, element to capture
SHOTS_PLAN = [
    ("kpis", {**YTD, "type": "Largometraje"}, ".kpis"),
    ("releases", {**YTD, "type": "", "gran": "month"}, "#chTime"),
    ("genres", {**YTD, "type": "Largometraje"}, "#chGenre"),
    ("top", {**YTD, "type": "Largometraje"}, "#chTop"),
    ("topics", {**YTD, "type": "Largometraje"}, "#chTopics"),
    ("market", {"from": "2025-01-01", "to": YTD["to"], "mkMetric": "a", "mkGran": "month"}, "#chMarket"),
    ("share", {"from": "2019-01-01", "to": YTD["to"], "share": "a"}, "#chShare"),
    ("screens_share", {"from": "2020-01-01", "to": YTD["to"], "share": "s"}, "#chShare"),
    ("regions", {**YTD, "dim": "dep"}, "#regionsGrid"),
]

# Big figures shown under a screenshot that leaves room (keyed by image name): value, label.
STATS = {
    "kpis": [
        ("117", "Colombian releases, Jan 1 – Sep 25 (118 in the same period of 2025)"),
        ("+9%", "cinema admissions for the whole market vs. 2025, Jan 1 – Sep 6"),
        ("0.6%", "of 2026 feature-film admissions went to Colombian films (US: 85%)"),
    ],
}

SOURCE = "Source: SIREC – Ministerio de las Culturas, las Artes y los Saberes (Colombia)"
LINK = "ch-augustedupin.github.io/colombian-films-dashboard"

# (kicker, action title, subtitle, image, footnote)
SLIDES = [
    ("Colombian releases at a glance",
     "60 Colombian feature films and 57 shorts premiered by late September — the same pace as 2025",
     "Headline indicators for 2026 to date, feature films view", "kpis",
     "117 Colombian releases vs. 118 in the same period of 2025. Admissions are cumulative to date, so recent films are still adding viewers."),
    ("Release calendar",
     "May was the busiest month, with 18 Colombian premieres",
     "Colombian releases per month in 2026, feature films and shorts", "releases", ""),
    ("Genres",
     "Documentaries now outnumber fiction among Colombian feature releases",
     "Colombian feature films released in 2026, by genre", "genres",
     "32 documentaries vs. 28 fiction films in 2026 to date; in the same period of 2025 fiction led 31 to 24."),
    ("Audiences",
     "“Lactar” leads 2026 with 36,572 admissions — no Colombian feature has reached 40,000",
     "Top 10 Colombian feature films of 2026 by admissions to date", "top", ""),
    ("Themes",
     "Urban life, identity, family and women’s stories are the most common themes",
     "Most frequent topics in the synopses of 2026 Colombian feature films", "topics",
     "Topics assigned by AI (Claude) from each film’s official synopsis, using a fixed list of 31 themes."),
    ("The whole market",
     "Cinema attendance in Colombia is up 9% year-to-date, and box-office revenue 23%",
     "Monthly admissions for all films shown in Colombia, January 2025 – September 2026", "market",
     "Jan 1–Sep 6: 38.4M admissions in 2026 vs. 35.2M in 2025; revenue COP 548bn vs. 446bn; average ticket COP 14,280 vs. 12,686."),
    ("Colombia vs. foreign films",
     "US films take more than 80% of feature-film admissions every year; Colombia’s share is 0.6% in 2026",
     "Share of feature-film admissions by country of origin and release year", "share",
     "Feature films only. Colombia took 1.7% in 2025 and 1.6% in 2024; 2026 films are still accumulating admissions."),
    ("Screens",
     "Colombian films get 3.3% of screens but only 0.6% of admissions",
     "Share of screens used by feature films, by country of origin and exhibition year", "screens_share",
     "No share for 2023–2024: SIREC’s report for those years lists only Colombian titles."),
    ("The regions",
     "Bogotá generates 32% of 2026 admissions and has 30% of the country’s cinema screens",
     "Admissions by department in 2026 (all films) and active cinema screens today", "regions",
     "Screens come from the current cinema registry (1,116 active screens). Chocó, Quindío and Risaralda show admissions but no registered cinemas."),
]


def capture() -> None:
    SHOTS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge")
        page = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=2, color_scheme="light")
        page.add_init_script("try { localStorage.setItem('lang','en'); localStorage.setItem('theme','light'); } catch (e) {}")
        page.goto(URL, wait_until="networkidle")
        page.wait_for_selector("#loading.hide", state="attached", timeout=60000)
        # The sticky filter bar would cover the top of captured cards.
        page.add_style_tag(content=".filters{position:static !important}")
        for name, state, selector in SHOTS_PLAN:
            page.evaluate(SET_STATE, state)
            el = page.locator(selector)
            if selector.startswith("#ch"):
                el = el.locator("xpath=ancestor::article[1]")
            el.screenshot(path=str(SHOTS / f"{name}.png"))
            print("captured", name)
        browser.close()


def slides_html() -> str:
    e = html.escape
    pages = [f"""
<section class="slide cover">
  <div class="bar"></div>
  <p class="eyebrow">Colombian Film Industry</p>
  <h1>2026 Year-to-Date Overview</h1>
  <p class="lead">Colombian releases, audiences and the market they compete in, January – September 2026</p>
  <div class="meta">
    <p><strong>Simón Moreno Salinas</strong></p>
    <p>Built on the Colombian box-office dashboard · {e(LINK)}</p>
    <p class="muted">Data: SIREC, Ministry of Culture of Colombia · Colombian releases to Sep 25, 2026 · market data to Sep 6, 2026</p>
  </div>
</section>"""]
    for i, (kicker, title, sub, img, note) in enumerate(SLIDES, start=2):
        stats = "".join(f"<div><strong>{e(v)}</strong><span>{e(l)}</span></div>" for v, l in STATS.get(img, []))
        pages.append(f"""
<section class="slide">
  <header><p class="kicker">{e(kicker)}</p><h2>{e(title)}</h2><p class="sub">{e(sub)}</p></header>
  <figure{' class="strip"' if stats else ''}><img src="shots/{img}.png" alt="{e(sub)}"></figure>
  {f'<div class="stats">{stats}</div>' if stats else ''}
  <footer><span>{e(note)}</span><span class="src">{e(SOURCE)} · {i}</span></footer>
</section>""")
    pages.append(f"""
<section class="slide closing">
  <header><p class="kicker">About this overview</p><h2>One live dashboard, updated automatically every week</h2></header>
  <ul>
    <li>All figures come from six public SIREC files published by Colombia’s Ministry of Culture, refreshed by an automated pipeline every Thursday.</li>
    <li>“Colombian films” are titles whose main producing country is Colombia. Shares compare feature films only, because short films’ admissions depend on the features they accompany.</li>
    <li>Admissions per film are cumulative to date: films released recently are still adding viewers.</li>
    <li>Market, revenue and regional figures cover all films shown in Colombia; SIREC does not publish revenue per film.</li>
  </ul>
  <p class="cta">Explore the interactive dashboard (ES/EN): <strong>{e(LINK)}</strong></p>
  <p class="muted">Simón Moreno Salinas · Personal project on the Colombian film industry</p>
</section>""")
    css = """
@page { size: 1280px 720px; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #f9f9f7; }
body { font-family: "Segoe UI", system-ui, sans-serif; color: #0b0b0b; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.slide { width: 1280px; height: 720px; padding: 40px 56px 28px; display: flex; flex-direction: column;
  page-break-after: always; break-after: page; background: #f9f9f7; position: relative; overflow: hidden; }
.slide:last-child { page-break-after: auto; break-after: auto; }
header .kicker, .eyebrow { margin: 0 0 6px; color: #2a78d6; font-weight: 600; font-size: 14px; letter-spacing: .06em; text-transform: uppercase; }
header h2 { margin: 0; font-size: 30px; line-height: 1.2; font-weight: 650; letter-spacing: -.01em; max-width: 1120px; text-wrap: balance; }
header .sub { margin: 8px 0 0; color: #52514e; font-size: 15px; }
figure { flex: 1; margin: 18px 0 12px; display: flex; align-items: center; justify-content: center; min-height: 0; }
figure img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06); }
figure.strip { flex: 0 0 auto; margin: 36px 0 28px; }
.stats { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-content: center; margin-bottom: 16px; }
.stats div { border-left: 4px solid #2a78d6; padding: 6px 0 6px 20px; }
.stats strong { display: block; font-size: 56px; line-height: 1.05; font-weight: 700; letter-spacing: -.02em; color: #0d366b; }
.stats span { display: block; margin-top: 8px; font-size: 16px; color: #52514e; line-height: 1.4; }
footer { display: flex; justify-content: space-between; gap: 24px; font-size: 11.5px; color: #6b6a64; border-top: 1px solid #e1e0d9; padding-top: 10px; }
footer span:first-child { max-width: 780px; }
footer .src { text-align: right; white-space: nowrap; }
.cover { justify-content: center; padding: 72px 96px; background: #0d366b; color: #fff; }
.cover .bar { position: absolute; left: 0; top: 0; bottom: 0; width: 14px; background: #86b6ef; }
.cover .eyebrow { color: #9ec5f4; font-size: 16px; }
.cover h1 { font-size: 60px; line-height: 1.05; margin: 0 0 18px; font-weight: 700; letter-spacing: -.02em; }
.cover .lead { font-size: 22px; color: #cde2fb; margin: 0 0 56px; max-width: 900px; }
.cover .meta p { margin: 0 0 6px; font-size: 16px; color: #e6eefb; }
.cover .muted { color: #9ec5f4; font-size: 13px !important; }
.closing ul { margin: 28px 0 0; padding-left: 22px; font-size: 19px; line-height: 1.5; color: #2b2a28; max-width: 1080px; }
.closing li { margin-bottom: 12px; }
.closing .cta { margin-top: auto; font-size: 20px; }
.closing .muted, .muted { color: #6b6a64; font-size: 14px; }
"""
    return f"<!doctype html><html lang='en'><head><meta charset='utf-8'><title>Colombian Film Industry – 2026 YTD</title><style>{css}</style></head><body>{''.join(pages)}</body></html>"


def build_pdf() -> None:
    doc = OUT / "slides.html"
    doc.write_text(slides_html(), encoding="utf-8")
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge")
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        page.goto(doc.as_uri(), wait_until="load")
        page.pdf(path=str(PDF), width="1280px", height="720px", print_background=True, prefer_css_page_size=True)
        browser.close()
    print(f"Wrote {PDF} ({PDF.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    capture()
    build_pdf()
