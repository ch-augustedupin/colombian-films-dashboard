/* Colombian films box-office dashboard. Data: data/films.json (built weekly by scripts/update_data.py). */
(() => {
  "use strict";

  // ---------- i18n ----------
  const I18N = {
    es: {
      title: "Cine colombiano en taquilla",
      subtitle: "Estrenos colombianos en salas de cine nacionales",
      author: "Dashboard creado por Simón Moreno Salinas",
      asof: "Datos al {d}",
      f_period: "Periodo", p_all: "Todo", p_12m: "Últimos 12 meses", p_ytd: "Este año", p_5y: "Últimos 5 años",
      f_from: "Desde", f_to: "Hasta", f_type: "Duración", all_f: "Todas", all_m: "Todos",
      f_genre: "Género", f_rating: "Clasificación", f_prod: "Producción", f_search: "Buscar título o director",
      prod_co: "100% colombiana", prod_coprod: "Coproducción internacional",
      search_ph: "Ej.: El Paseo", reset: "Limpiar filtros",
      k_films: "Películas estrenadas", k_adm: "Admisiones totales", k_features: "Largometrajes",
      k_shorts: "Cortometrajes", k_median: "Mediana de admisiones por largometraje",
      n_films: "{a} largometrajes · {b} cortometrajes", n_adm: "Largometrajes: {a} · Cortometrajes: {b}",
      n_feat: "{p} de los estrenos · {a} admisiones", n_short: "{p} de los estrenos · {a} admisiones",
      n_median: "Promedio: {a}", n_none: "Sin largometrajes en la selección",
      c_time: "Estrenos en el tiempo", c_time_hint: "Haga clic en una barra para filtrar ese periodo",
      g_year: "Año", g_month: "Mes",
      c_type: "Películas por duración", c_type_hint: "Clic para filtrar", c_typeadm: "Admisiones por duración",
      c_top: "Películas con más admisiones", top_hint: "Top {n} {t} por admisiones acumuladas a la fecha",
      c_genre: "Películas por género", c_rating: "Películas por clasificación",
      c_admtime: "Admisiones por año de estreno",
      c_admtime_hint: "Admisiones acumuladas hasta la fecha, según el año en que se estrenó cada película",
      c_table: "Detalle de películas", table_hint: "{n} películas · ordenar haciendo clic en los encabezados",
      csv: "Descargar CSV", more: "Mostrar más", empty: "Ninguna película coincide con los filtros.",
      th_title: "Título", th_date: "Estreno", th_type: "Duración", th_min: "Min.", th_genre: "Género",
      th_rating: "Clasificación", th_country: "Nacionalidad", th_adm: "Admisiones",
      short_note: "Los cortometrajes suelen proyectarse antes de otras películas en las salas, por lo que sus admisiones reflejan esas funciones. Compárelos por separado de los largometrajes.",
      source: "Fuente", refresh: "Actualización automática cada jueves", generated: "Última actualización: {d}",
      loading: "Cargando datos…", load_error: "No se pudieron cargar los datos.",
      films_word: "películas", adm_word: "admisiones", total: "Total", released: "Estreno",
      Largometraje: "Largometraje", Cortometraje: "Cortometraje",
      Largometraje_pl: "Largometrajes", Cortometraje_pl: "Cortometrajes",
      f_topic: "Tema", c_topics: "Temas más frecuentes",
      c_topics_hint: "Temas identificados en la sinopsis de cada película · clic para filtrar",
      ai_title: "¿De dónde salen los temas?",
      ai_body: "Cada sinopsis del registro de títulos clasificados del SIREC fue leída por un modelo de inteligencia artificial (Claude, de Anthropic), que eligió entre 2 y 3 temas evidentes de una lista cerrada de {n} temas. Es una clasificación automática y puede contener errores; las películas sin sinopsis o con sinopsis muy breves no tienen temas.",
      ai_stats: "{a} de {b} películas en la selección tienen temas.",
      topics_pending: "Los temas se mostrarán cuando termine la clasificación de las sinopsis.",
      th_dir: "Dirección", th_topics: "Temas", syn: "Sinopsis", syn_none: "Sin sinopsis disponible.",
      d_original: "Título original", d_min: "Duración", d_applicant: "Solicitado por", minutes: "{n} min",
      expand: "Ver sinopsis y detalles",
    },
    en: {
      title: "Colombian films at the box office",
      subtitle: "Colombian releases in national movie theaters",
      author: "Dashboard by Simón Moreno Salinas",
      asof: "Data as of {d}",
      f_period: "Period", p_all: "All time", p_12m: "Last 12 months", p_ytd: "This year", p_5y: "Last 5 years",
      f_from: "From", f_to: "To", f_type: "Length", all_f: "All", all_m: "All",
      f_genre: "Genre", f_rating: "Rating", f_prod: "Production", f_search: "Search title or director",
      prod_co: "100% Colombian", prod_coprod: "International co-production",
      search_ph: "E.g. El Paseo", reset: "Clear filters",
      k_films: "Films released", k_adm: "Total admissions", k_features: "Feature films",
      k_shorts: "Short films", k_median: "Median admissions per feature film",
      n_films: "{a} features · {b} shorts", n_adm: "Features: {a} · Shorts: {b}",
      n_feat: "{p} of releases · {a} admissions", n_short: "{p} of releases · {a} admissions",
      n_median: "Average: {a}", n_none: "No feature films in the selection",
      c_time: "Releases over time", c_time_hint: "Click a bar to filter that period",
      g_year: "Year", g_month: "Month",
      c_type: "Films by length", c_type_hint: "Click to filter", c_typeadm: "Admissions by length",
      c_top: "Top films by admissions", top_hint: "Top {n} {t} by admissions to date",
      c_genre: "Films by genre", c_rating: "Films by rating",
      c_admtime: "Admissions by release year",
      c_admtime_hint: "Admissions to date, grouped by the year each film was released",
      c_table: "Film details", table_hint: "{n} films · click a header to sort",
      csv: "Download CSV", more: "Show more", empty: "No films match the filters.",
      th_title: "Title", th_date: "Release", th_type: "Length", th_min: "Min.", th_genre: "Genre",
      th_rating: "Rating", th_country: "Nationality", th_adm: "Admissions",
      short_note: "Short films are often screened before other films in theaters, so their admissions reflect those screenings. Compare them separately from feature films.",
      source: "Source", refresh: "Updated automatically every Thursday", generated: "Last refreshed: {d}",
      loading: "Loading data…", load_error: "The data could not be loaded.",
      films_word: "films", adm_word: "admissions", total: "Total", released: "Released",
      Largometraje: "Feature film", Cortometraje: "Short film",
      Largometraje_pl: "Feature films", Cortometraje_pl: "Short films",
      f_topic: "Topic", c_topics: "Most frequent topics",
      c_topics_hint: "Topics identified in each film's synopsis · click to filter",
      ai_title: "Where do the topics come from?",
      ai_body: "Each synopsis in SIREC's register of classified titles was read by an AI model (Claude, by Anthropic), which picked 2 to 3 evident topics from a closed list of {n}. It is an automatic classification and may contain mistakes; films with no synopsis or a very short one have no topics.",
      ai_stats: "{a} of {b} films in the selection have topics.",
      topics_pending: "Topics will appear once the synopses have been classified.",
      th_dir: "Director", th_topics: "Topics", syn: "Synopsis", syn_none: "No synopsis available.",
      d_original: "Original title", d_min: "Running time", d_applicant: "Submitted by", minutes: "{n} min",
      expand: "Show synopsis and details",
    },
  };
  const VALUES_EN = {
    "Ficción": "Fiction", "Documental": "Documentary", "Animación": "Animation",
    "Todos": "All ages", "+7 Años": "7+", "+12 Años": "12+", "+15 Años": "15+", "+18 Años": "18+",
  };
  const COUNTRIES_EN = {
    COLOMBIA: "Colombia", FRANCIA: "France", ESPAÑA: "Spain", MEXICO: "Mexico", "ESTADOS UNIDOS": "United States",
    ALEMANIA: "Germany", BRASIL: "Brazil", "PERÚ": "Peru", "CANADÁ": "Canada", "PANAMÁ": "Panama", NORUEGA: "Norway",
    "REPÚBLICA DOMINICANA": "Dominican Republic", BELGICA: "Belgium", ITALIA: "Italy", HOLANDA: "Netherlands",
    SUECIA: "Sweden", SUIZA: "Switzerland", RUMANIA: "Romania", DINAMARCA: "Denmark", LUXEMBURGO: "Luxembourg",
    LITUANIA: "Lithuania", "REPÚBLICA CHECA": "Czech Republic", TAILANDIA: "Thailand", "REINO UNIDO": "United Kingdom",
    GRECIA: "Greece", "HUNGRÍA": "Hungary", POLONIA: "Poland",
  };
  const TYPES = ["Largometraje", "Cortometraje"];
  const GENRES = ["Ficción", "Documental", "Animación"];
  const RATINGS = ["Todos", "+7 Años", "+12 Años", "+15 Años", "+18 Años"];

  const LS = { get(k) { try { return localStorage.getItem(k); } catch { return null; } },
               set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // ---------- state ----------
  const S = {
    lang: LS.get("lang") === "en" ? "en" : (LS.get("lang") === "es" ? "es" : (navigator.language || "es").startsWith("es") ? "es" : "en"),
    preset: "all", from: null, to: null,
    type: "", genre: "", rating: "", prod: "", topic: "", q: "",
    open: new Set(),
    gran: "year", topType: "Largometraje", topN: 10,
    sort: { key: "d", dir: -1 }, shown: 25,
    // Shorts' admissions dwarf features', so this chart opens on features only.
    hiddenAdm: new Set(["Cortometraje"]),
  };
  let FILMS = [], META = {}, TOPICS = [], HAS_TOPICS = false, MIN_DATE, MAX_DATE, MIN_YEAR, MAX_YEAR;
  const charts = {};

  const t = (k, vars) => {
    let s = (I18N[S.lang][k] ?? I18N.es[k] ?? k);
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
    return s;
  };
  const tv = (v) => (S.lang === "en" ? (I18N.en[v] || VALUES_EN[v] || v) : v);
  const titleCase = (s) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
  const country = (c) => (S.lang === "en" && COUNTRIES_EN[c]) || titleCase(c);
  const locale = () => (S.lang === "es" ? "es-CO" : "en-US");
  const fmt = (n) => new Intl.NumberFormat(locale()).format(Math.round(n));
  const fmtC = (n) => new Intl.NumberFormat(locale(), { notation: "compact", maximumFractionDigits: 1 }).format(n);
  const pct = (a, b) => (b ? new Intl.NumberFormat(locale(), { style: "percent", maximumFractionDigits: 0 }).format(a / b) : "–");
  const dateFmt = (iso, opts = { day: "numeric", month: "short", year: "numeric" }) =>
    new Intl.DateTimeFormat(locale(), { ...opts, timeZone: "UTC" }).format(new Date(iso + "T00:00:00Z"));
  const monthLabel = (ym) => dateFmt(ym + "-01", { month: "short", year: "2-digit" });
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const typeColor = (ty) => css(ty === "Largometraje" ? "--s1" : "--s2");
  const iso = (d) => d.toISOString().slice(0, 10);
  const topicLabel = (code) => { const tp = TOPICS.find((x) => x.code === code); return tp ? tp[S.lang] : code; };

  // ---------- filtering ----------
  function passes(f, skip = "") {
    if (skip !== "period" && (f.d < S.from || f.d > S.to)) return false;
    if (skip !== "type" && S.type && f.ty !== S.type) return false;
    if (skip !== "genre" && S.genre && f.g !== S.genre) return false;
    if (skip !== "rating" && S.rating && f.r !== S.rating) return false;
    if (skip !== "topic" && S.topic && !f.tp.includes(S.topic)) return false;
    if (S.prod === "co" && f.c.length !== 1) return false;
    if (S.prod === "coprod" && f.c.length < 2) return false;
    if (S.q && !f._s.includes(S.q)) return false;
    return true;
  }
  const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function applyPreset(p) {
    S.preset = p;
    const today = new Date();
    const end = MAX_DATE > iso(today) ? MAX_DATE : iso(today);
    if (p === "all") { S.from = MIN_DATE; S.to = end; }
    if (p === "12m") { const d = new Date(today); d.setUTCFullYear(d.getUTCFullYear() - 1); d.setUTCDate(d.getUTCDate() + 1); S.from = iso(d); S.to = end; S.gran = "month"; }
    if (p === "ytd") { S.from = `${today.getFullYear()}-01-01`; S.to = end; S.gran = "month"; }
    if (p === "5y") { S.from = `${today.getFullYear() - 4}-01-01`; S.to = end; S.gran = "year"; }
    if (p === "all") S.gran = "year";
  }
  function setYears(a, b) {
    if (a > b) [a, b] = [b, a];
    S.preset = null; S.from = `${a}-01-01`; S.to = `${b}-12-31`;
    if (a === b) S.gran = "month";
  }

  // ---------- rendering ----------
  function render() {
    const rows = FILMS.filter((f) => passes(f));
    renderControls();
    renderKpis(rows);
    renderTime(rows);
    renderType();
    renderTop(rows);
    renderBreakdown("chGenre", "genre", "g", GENRES);
    renderBreakdown("chRating", "rating", "r", RATINGS);
    renderTopics(rows);
    renderAdm(rows);
    renderTable(rows);
  }

  function renderStatic() {
    document.documentElement.lang = S.lang;
    document.title = t("title");
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === S.lang)));
    $("#search").placeholder = t("search_ph");
    $("#asof").textContent = META.extracted ? t("asof", { d: dateFmt(META.extracted) }) : "";
    $("#generated").textContent = META.generated ? t("generated", { d: dateFmt(META.generated.slice(0, 10)) }) : "";
    fillSelect($("#genre"), [["", t("all_m")], ...GENRES.map((g) => [g, tv(g)])], S.genre);
    fillSelect($("#rating"), [["", t("all_f")], ...RATINGS.map((r) => [r, tv(r)])], S.rating);
    fillSelect($("#prod"), [["", t("all_f")], ["co", t("prod_co")], ["coprod", t("prod_coprod")]], S.prod);
    const topicOpts = TOPICS.map((tp) => [tp.code, tp[S.lang]]).sort((a, b) => a[1].localeCompare(b[1], locale()));
    fillSelect($("#topic"), [["", t("all_m")], ...topicOpts], S.topic);
    $("#topicFilter").hidden = !HAS_TOPICS;
    $("#aiBody").textContent = t("ai_body", { n: TOPICS.length });
    const legendHtml = TYPES.map((ty) => ({ ty, label: tv(ty) }));
    for (const id of ["#legTime", "#legGenre", "#legTopics"]) buildLegend($(id), legendHtml, false);
    buildLegend($("#legAdm"), legendHtml, true);
  }

  function fillSelect(sel, opts, value) {
    sel.replaceChildren(...opts.map(([v, label]) => { const o = document.createElement("option"); o.value = v; o.textContent = label; return o; }));
    sel.value = value;
  }

  function buildLegend(el, items, toggle) {
    el.replaceChildren(...items.map(({ ty, label }) => {
      const s = document.createElement(toggle ? "button" : "span");
      if (toggle) {
        s.type = "button"; s.className = "legbtn";
        s.setAttribute("aria-pressed", String(!S.hiddenAdm.has(ty)));
        s.style.cssText = "border:0;background:none;padding:0;cursor:pointer;display:inline-flex;align-items:center;gap:6px;color:inherit;font:inherit";
        if (S.hiddenAdm.has(ty)) s.style.opacity = "0.4";
        s.addEventListener("click", () => { S.hiddenAdm.has(ty) ? S.hiddenAdm.delete(ty) : S.hiddenAdm.add(ty); buildLegend(el, items, true); renderAdm(FILMS.filter((f) => passes(f))); });
      }
      const i = document.createElement("i"); i.style.background = typeColor(ty);
      s.append(i, document.createTextNode(label));
      return s;
    }));
  }

  function renderControls() {
    $$("#presets button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.preset === S.preset)));
    $("#fromYear").value = S.from.slice(0, 4);
    $("#toYear").value = String(Math.min(+S.to.slice(0, 4), MAX_YEAR));
    $$("#typeSeg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.type === S.type)));
    $$("#granSeg button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.gran === S.gran)));
    if (S.type) S.topType = S.type;
    $$("#topTypeSeg button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.top === S.topType));
      b.disabled = !!S.type && b.dataset.top !== S.type;
      b.style.opacity = b.disabled ? "0.4" : "";
    });
    $$("#topNSeg button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.n === S.topN)));
    $("#genre").value = S.genre; $("#rating").value = S.rating; $("#prod").value = S.prod; $("#topic").value = S.topic;
  }

  function renderKpis(rows) {
    const feat = rows.filter((f) => f.ty === "Largometraje");
    const shorts = rows.filter((f) => f.ty === "Cortometraje");
    const sum = (a) => a.reduce((s, f) => s + f.a, 0);
    const admF = sum(feat), admS = sum(shorts);
    $("#kFilms").textContent = fmt(rows.length);
    $("#kFilmsNote").textContent = t("n_films", { a: fmt(feat.length), b: fmt(shorts.length) });
    $("#kAdm").textContent = fmtC(admF + admS);
    $("#kAdm").title = fmt(admF + admS);
    $("#kAdmNote").textContent = t("n_adm", { a: fmtC(admF), b: fmtC(admS) });
    $("#kFeat").textContent = fmt(feat.length);
    $("#kFeatNote").textContent = t("n_feat", { p: pct(feat.length, rows.length), a: fmtC(admF) });
    $("#kShort").textContent = fmt(shorts.length);
    $("#kShortNote").textContent = t("n_short", { p: pct(shorts.length, rows.length), a: fmtC(admS) });
    if (feat.length) {
      const v = feat.map((f) => f.a).sort((a, b) => a - b);
      const m = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
      $("#kMedian").textContent = fmt(m);
      $("#kMedianNote").textContent = t("n_median", { a: fmt(admF / feat.length) });
    } else {
      $("#kMedian").textContent = "–";
      $("#kMedianNote").textContent = t("n_none");
    }
  }

  // Shared chart chrome.
  function base() {
    return {
      animationDuration: 300,
      textStyle: { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", color: css("--ink-2") },
      grid: { left: 8, right: 16, top: 12, bottom: 4, containLabel: true },
      tooltip: {
        backgroundColor: css("--surface"), borderColor: css("--border"), borderWidth: 1,
        textStyle: { color: css("--ink"), fontSize: 12 }, extraCssText: "box-shadow:0 4px 16px rgba(0,0,0,.12);border-radius:8px;",
        confine: true,
      },
    };
  }
  const axisCommon = () => ({
    axisLine: { lineStyle: { color: css("--axis") } }, axisTick: { show: false },
    axisLabel: { color: css("--muted"), fontSize: 11 },
    splitLine: { lineStyle: { color: css("--grid"), width: 1 } },
  });
  const valueAxis = (extra = {}) => ({ type: "value", ...axisCommon(), axisLine: { show: false },
    axisLabel: { color: css("--muted"), fontSize: 11, formatter: (v) => fmtC(v) }, ...extra });
  const catAxis = (data, extra = {}) => ({ type: "category", data, ...axisCommon(), splitLine: { show: false }, ...extra });

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const key = (color) => `<span style="display:inline-block;width:10px;height:2px;background:${color};vertical-align:middle;margin-right:6px"></span>`;
  function stackTooltip(params, header) {
    const list = Array.isArray(params) ? params : [params];
    let total = 0;
    const lines = list.filter((p) => p.value != null).map((p) => {
      const v = typeof p.value === "object" ? p.value.value : p.value; total += v || 0;
      return `<div>${key(p.color)}<b>${fmt(v || 0)}</b> <span style="color:${css("--ink-2")}">${esc(p.seriesName)}</span></div>`;
    });
    const tot = list.length > 1 ? `<div style="margin-top:4px"><b>${fmt(total)}</b> <span style="color:${css("--ink-2")}">${t("total")}</span></div>` : "";
    return `<div style="margin-bottom:4px;color:${css("--ink-2")}">${esc(header)}</div>${lines.join("")}${tot}`;
  }

  // Stacked series with a rounded end only on the outermost non-zero segment.
  function stackedSeries(cats, valueOf, horizontal, types = TYPES) {
    const radius = horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0];
    const vals = types.map((ty) => cats.map((c) => valueOf(ty, c)));
    return types.map((ty, si) => ({
      name: tv(ty), type: "bar", stack: "s", barMaxWidth: 24,
      itemStyle: { color: typeColor(ty), borderColor: css("--surface"), borderWidth: 1 },
      emphasis: { focus: "none", itemStyle: { opacity: 0.85 } },
      data: vals[si].map((v, ci) => {
        const top = vals.findLastIndex((row) => row[ci] > 0) === si;
        return { value: v, itemStyle: top ? { borderRadius: radius } : undefined };
      }),
    }));
  }

  function chart(id) {
    if (!charts[id]) {
      charts[id] = echarts.init(document.getElementById(id), null, { renderer: "svg" });
      new ResizeObserver(() => charts[id].resize()).observe(document.getElementById(id));
    }
    return charts[id];
  }

  function periodBuckets() {
    const out = [];
    if (S.gran === "year") {
      for (let y = +S.from.slice(0, 4); y <= Math.min(+S.to.slice(0, 4), MAX_YEAR); y++) out.push(String(y));
    } else {
      let [y, m] = S.from.slice(0, 7).split("-").map(Number);
      const end = S.to.slice(0, 7) > MAX_DATE.slice(0, 7) ? MAX_DATE.slice(0, 7) : S.to.slice(0, 7);
      while (`${y}-${String(m).padStart(2, "0")}` <= end) { out.push(`${y}-${String(m).padStart(2, "0")}`); if (++m > 12) { m = 1; y++; } }
    }
    return out;
  }

  function renderTime(rows) {
    const buckets = periodBuckets();
    const len = S.gran === "year" ? 4 : 7;
    const counts = {};
    for (const f of rows) { const k = f.ty + f.d.slice(0, len); counts[k] = (counts[k] || 0) + 1; }
    const labels = S.gran === "year" ? buckets : buckets.map(monthLabel);
    const types = S.type ? [S.type] : TYPES;
    const c = chart("chTime");
    c.setOption({
      ...base(),
      tooltip: { ...base().tooltip, trigger: "axis", axisPointer: { type: "shadow", shadowStyle: { color: css("--wash") } },
        formatter: (p) => stackTooltip(p, p[0].name) },
      xAxis: catAxis(labels, { axisLabel: { color: css("--muted"), fontSize: 11, hideOverlap: true } }),
      yAxis: valueAxis({ minInterval: 1 }),
      series: stackedSeries(buckets, (ty, b) => counts[ty + b] || 0, false, types),
    }, true);
    c.off("click");
    c.on("click", (p) => {
      const b = buckets[p.dataIndex];
      if (S.gran === "year") setYears(+b, +b);
      else { const [y, m] = b.split("-").map(Number); S.preset = null; S.from = `${b}-01`; S.to = iso(new Date(Date.UTC(y, m, 0))); }
      S.shown = 25; render();
    });
    $("#chTime").setAttribute("aria-label", t("c_time"));
  }

  function renderType() {
    const rows = FILMS.filter((f) => passes(f, "type"));
    typeBars("chType", TYPES.map((ty) => rows.filter((f) => f.ty === ty).length), "films_word", fmt, "c_type");
    typeBars("chTypeAdm", TYPES.map((ty) => rows.reduce((s, f) => s + (f.ty === ty ? f.a : 0), 0)), "adm_word", fmtC, "c_typeadm");
  }

  function typeBars(id, counts, word, labelFmt, title) {
    const total = counts[0] + counts[1];
    const c = chart(id);
    c.setOption({
      ...base(),
      grid: { left: 8, right: 80, top: 8, bottom: 8, containLabel: true },
      tooltip: { ...base().tooltip, trigger: "item",
        formatter: (p) => `${esc(p.name)}<br><b>${fmt(p.value)}</b> ${t(word)} (${pct(p.value, total)})` },
      xAxis: valueAxis({ show: false }),
      yAxis: catAxis(TYPES.map(tv), { inverse: true, axisLine: { show: false }, axisLabel: { color: css("--ink-2"), fontSize: 12 } }),
      series: [{
        type: "bar", barMaxWidth: 24,
        data: TYPES.map((ty, i) => ({ value: counts[i], itemStyle: { color: typeColor(ty), borderRadius: [0, 4, 4, 0], opacity: !S.type || S.type === ty ? 1 : 0.3 } })),
        label: { show: true, position: "right", color: css("--ink"), fontSize: 12, formatter: (p) => `${labelFmt(p.value)} · ${pct(p.value, total)}` },
        emphasis: { itemStyle: { opacity: 0.85 } },
      }],
    }, true);
    c.off("click");
    c.on("click", (p) => { const ty = TYPES[p.dataIndex]; S.type = S.type === ty ? "" : ty; S.shown = 25; render(); });
    $("#" + id).setAttribute("aria-label", t(title));
  }

  function renderBreakdown(id, stateKey, field, cats) {
    const rows = FILMS.filter((f) => passes(f, stateKey));
    const types = S.type ? [S.type] : TYPES;
    const c = chart(id);
    const series = stackedSeries(cats, (ty, cat) => rows.filter((f) => f.ty === ty && f[field] === cat).length, true, types);
    if (S[stateKey]) series.forEach((s) => s.data.forEach((d, i) => { d.itemStyle = { ...(d.itemStyle || {}), opacity: cats[i] === S[stateKey] ? 1 : 0.3 }; }));
    c.setOption({
      ...base(),
      grid: { left: 8, right: 16, top: 4, bottom: 4, containLabel: true },
      tooltip: { ...base().tooltip, trigger: "axis", axisPointer: { type: "shadow", shadowStyle: { color: css("--wash") } },
        formatter: (p) => stackTooltip(p, p[0].name) },
      xAxis: valueAxis({ minInterval: 1, splitNumber: 3 }),
      yAxis: catAxis(cats.map(tv), { inverse: true, axisLine: { show: false }, axisLabel: { color: css("--ink-2"), fontSize: 12 } }),
      series,
    }, true);
    c.off("click");
    c.on("click", (p) => { const v = cats[p.dataIndex]; S[stateKey] = S[stateKey] === v ? "" : v; S.shown = 25; render(); });
    $("#" + id).setAttribute("aria-label", t(stateKey === "genre" ? "c_genre" : "c_rating"));
  }

  function renderTop(rows) {
    const list = rows.filter((f) => f.ty === S.topType).sort((a, b) => b.a - a.a).slice(0, S.topN);
    $("#topHint").textContent = t("top_hint", { n: S.topN, t: t(S.topType + "_pl").toLowerCase() });
    const el = $("#chTop");
    el.style.height = Math.max(160, list.length * 34 + 30) + "px";
    const c = chart("chTop");
    const trunc = (s) => (s.length > 34 ? s.slice(0, 33) + "…" : s);
    c.setOption({
      ...base(),
      grid: { left: 8, right: 64, top: 4, bottom: 4, containLabel: true },
      tooltip: { ...base().tooltip, trigger: "item", formatter: (p) => {
        const f = list[p.dataIndex];
        return `<div style="font-weight:600;margin-bottom:2px">${esc(f.t)}</div>`
          + `<div><b>${fmt(f.a)}</b> <span style="color:${css("--ink-2")}">${t("adm_word")}</span></div>`
          + `<div style="color:${css("--ink-2")}">${t("released")}: ${dateFmt(f.d)} · ${esc(tv(f.g))} · ${esc(tv(f.r))}</div>`;
      } },
      xAxis: valueAxis({ splitNumber: 4 }),
      yAxis: catAxis(list.map((f) => trunc(f.t)), { inverse: true, axisLine: { show: false }, axisLabel: { color: css("--ink-2"), fontSize: 12 } }),
      series: [{
        type: "bar", barMaxWidth: 20,
        data: list.map((f) => ({ value: f.a, itemStyle: { color: typeColor(f.ty), borderRadius: [0, 4, 4, 0] } })),
        label: { show: true, position: "right", color: css("--ink"), fontSize: 11, formatter: (p) => fmtC(p.value) },
        emphasis: { itemStyle: { opacity: 0.85 } },
      }],
      graphic: list.length ? [] : [{ type: "text", left: "center", top: "middle", style: { text: t("empty"), fill: css("--muted"), fontSize: 13 } }],
    }, true);
    el.setAttribute("aria-label", t("c_top"));
  }

  function renderAdm(rows) {
    const years = [];
    for (let y = +S.from.slice(0, 4); y <= Math.min(+S.to.slice(0, 4), MAX_YEAR); y++) years.push(String(y));
    const sums = {};
    for (const f of rows) { const k = f.ty + f.d.slice(0, 4); sums[k] = (sums[k] || 0) + f.a; }
    const types = S.type ? [S.type] : TYPES.filter((ty) => !S.hiddenAdm.has(ty));
    const c = chart("chAdm");
    c.setOption({
      ...base(),
      tooltip: { ...base().tooltip, trigger: "axis", axisPointer: { type: "shadow", shadowStyle: { color: css("--wash") } },
        formatter: (p) => stackTooltip(p, p[0].name) },
      xAxis: catAxis(years, { axisLabel: { color: css("--muted"), fontSize: 11, hideOverlap: true } }),
      yAxis: valueAxis(),
      series: stackedSeries(years, (ty, y) => sums[ty + y] || 0, false, types),
    }, true);
    c.off("click");
    c.on("click", (p) => { setYears(+years[p.dataIndex], +years[p.dataIndex]); S.shown = 25; render(); });
    $("#chAdm").setAttribute("aria-label", t("c_admtime"));
  }

  function renderTopics(rows) {
    $("#topicsCard").hidden = !HAS_TOPICS;
    $("#aiCard").hidden = !HAS_TOPICS;
    if (!HAS_TOPICS) return;
    const tagged = rows.filter((f) => f.tp.length).length;
    $("#aiStats").textContent = t("ai_stats", { a: fmt(tagged), b: fmt(rows.length) });

    // Like the other breakdowns, this chart ignores its own filter and dims the other bars.
    const pool = FILMS.filter((f) => passes(f, "topic"));
    const counts = {};
    for (const f of pool) for (const c of f.tp) counts[c] = (counts[c] || 0) + 1;
    const cats = TOPICS.map((x) => x.code).filter((c) => counts[c]).sort((a, b) => counts[b] - counts[a]).slice(0, 15);
    if (S.topic && counts[S.topic] && !cats.includes(S.topic)) cats.push(S.topic);
    const types = S.type ? [S.type] : TYPES;
    const series = stackedSeries(cats, (ty, c) => pool.filter((f) => f.ty === ty && f.tp.includes(c)).length, true, types);
    if (S.topic) series.forEach((s) => s.data.forEach((d, i) => { d.itemStyle = { ...(d.itemStyle || {}), opacity: cats[i] === S.topic ? 1 : 0.3 }; }));
    const el = $("#chTopics");
    el.style.height = Math.max(120, cats.length * 26 + 30) + "px";
    const c = chart("chTopics");
    c.setOption({
      ...base(),
      grid: { left: 8, right: 16, top: 4, bottom: 4, containLabel: true },
      tooltip: { ...base().tooltip, trigger: "axis", axisPointer: { type: "shadow", shadowStyle: { color: css("--wash") } },
        formatter: (p) => stackTooltip(p, p[0].name) },
      xAxis: valueAxis({ minInterval: 1, splitNumber: 4 }),
      yAxis: catAxis(cats.map(topicLabel), { inverse: true, axisLine: { show: false }, axisLabel: { color: css("--ink-2"), fontSize: 12 } }),
      series,
      graphic: cats.length ? [] : [{ type: "text", left: "center", top: "middle", style: { text: t("empty"), fill: css("--muted"), fontSize: 13 } }],
    }, true);
    c.off("click");
    c.on("click", (p) => { const v = cats[p.dataIndex]; S.topic = S.topic === v ? "" : v; S.shown = 25; render(); });
    el.setAttribute("aria-label", t("c_topics"));
  }

  function sortRows(rows) {
    const { key: k, dir } = S.sort;
    const val = (f) => (k === "c" ? f.c.join(",") : k === "tp" ? (f.tp.length ? topicLabel(f.tp[0]) : null)
      : k === "dir" ? (f.dir || null) : k === "ty" || k === "g" || k === "r" ? tv(f[k]) : f[k]);
    return [...rows].sort((a, b) => {
      const x = val(a), y = val(b);
      if (x == null) return 1; if (y == null) return -1;
      return (typeof x === "number" ? x - y : String(x).localeCompare(String(y), locale())) * dir;
    });
  }

  function renderTable(rows) {
    const sorted = sortRows(rows);
    $("#tableHint").textContent = t("table_hint", { n: fmt(rows.length) });
    $$("#table th").forEach((th) => {
      th.setAttribute("aria-sort", th.dataset.sort === S.sort.key ? (S.sort.dir > 0 ? "ascending" : "descending") : "none");
    });
    const tb = $("#table tbody");
    const COLS = 7;
    if (!rows.length) {
      const tr = document.createElement("tr"); const td = document.createElement("td");
      td.colSpan = COLS; td.className = "empty"; td.textContent = t("empty"); tr.append(td); tb.replaceChildren(tr);
    } else {
      tb.replaceChildren(...sorted.slice(0, S.shown).flatMap((f) => {
        const open = S.open.has(f.id);
        const tr = document.createElement("tr");
        tr.className = "row" + (open ? " open" : "");
        const cell = (text, cls) => { const td = document.createElement("td"); td.textContent = text; if (cls) td.className = cls; return td; };

        const titleCell = cell("");
        const btn = document.createElement("button");
        btn.type = "button"; btn.className = "expander"; btn.textContent = open ? "▾" : "▸";
        btn.setAttribute("aria-expanded", String(open)); btn.setAttribute("aria-label", t("expand"));
        titleCell.append(btn, document.createTextNode(f.t));

        const tyCell = cell(""); const dot = document.createElement("span"); dot.className = "dot"; dot.style.background = typeColor(f.ty);
        tyCell.append(dot, document.createTextNode(tv(f.ty)));

        const tpCell = cell("", "chips-cell");
        for (const code of f.tp) {
          const chip = document.createElement("span"); chip.className = "chip"; chip.textContent = topicLabel(code);
          tpCell.append(chip);
        }
        if (!f.tp.length) tpCell.textContent = "–";

        tr.append(titleCell, cell(dateFmt(f.d)), tyCell, cell(f.dir || "–", "dir"), cell(tv(f.g)), tpCell, cell(fmt(f.a), "num"));
        tr.addEventListener("click", () => {
          S.open.has(f.id) ? S.open.delete(f.id) : S.open.add(f.id);
          renderTable(FILMS.filter((x) => passes(x)));
        });
        if (!open) return [tr];

        const dr = document.createElement("tr"); dr.className = "detail";
        const td = document.createElement("td"); td.colSpan = COLS;
        const h = document.createElement("h3"); h.textContent = t("syn");
        const syn = document.createElement("p"); syn.className = "syn"; syn.textContent = f.syn || t("syn_none");
        const meta = document.createElement("p"); meta.className = "meta";
        meta.textContent = [
          f.o && f.o !== f.t ? `${t("d_original")}: ${f.o}` : "",
          f.m ? `${t("d_min")}: ${t("minutes", { n: f.m })}` : "",
          `${t("th_rating")}: ${tv(f.r)}`,
          `${t("th_country")}: ${f.c.map(country).join(", ")}`,
          f.p ? `${t("d_applicant")}: ${f.p}` : "",
        ].filter(Boolean).join(" · ");
        td.append(h, syn, meta); dr.append(td);
        return [tr, dr];
      }));
    }
    $("#more").hidden = S.shown >= rows.length;
  }

  function downloadCsv() {
    const rows = sortRows(FILMS.filter((f) => passes(f)));
    const head = ["th_title", "th_date", "th_type", "th_min", "th_dir", "th_genre", "th_rating", "th_country", "th_topics", "th_adm", "syn"].map(t);
    const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [head.map(q).join(",")].concat(rows.map((f) =>
      [f.t, f.d, tv(f.ty), f.m, f.dir, tv(f.g), tv(f.r), f.c.map(country).join(", "), f.tp.map(topicLabel).join("; "), f.a, f.syn]
        .map(q).join(",")));
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = S.lang === "es" ? "estrenos-colombianos.csv" : "colombian-releases.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---------- wiring ----------
  function wire() {
    $$(".lang button").forEach((b) => b.addEventListener("click", () => { S.lang = b.dataset.lang; LS.set("lang", S.lang); renderStatic(); render(); }));
    $$("#presets button").forEach((b) => b.addEventListener("click", () => { applyPreset(b.dataset.preset); S.shown = 25; render(); }));
    $("#fromYear").addEventListener("change", () => { setYears(+$("#fromYear").value, +$("#toYear").value); render(); });
    $("#toYear").addEventListener("change", () => { setYears(+$("#fromYear").value, +$("#toYear").value); render(); });
    $$("#typeSeg button").forEach((b) => b.addEventListener("click", () => { S.type = b.dataset.type; S.shown = 25; render(); }));
    $$("#granSeg button").forEach((b) => b.addEventListener("click", () => { S.gran = b.dataset.gran; render(); }));
    $$("#topTypeSeg button").forEach((b) => b.addEventListener("click", () => { S.topType = b.dataset.top; render(); }));
    $$("#topNSeg button").forEach((b) => b.addEventListener("click", () => { S.topN = +b.dataset.n; render(); }));
    for (const id of ["genre", "rating", "prod", "topic"]) $("#" + id).addEventListener("change", (e) => { S[id] = e.target.value; S.shown = 25; render(); });
    let timer;
    $("#search").addEventListener("input", (e) => { clearTimeout(timer); timer = setTimeout(() => { S.q = norm(e.target.value.trim()); S.shown = 25; render(); }, 150); });
    $("#reset").addEventListener("click", () => {
      Object.assign(S, { type: "", genre: "", rating: "", prod: "", topic: "", q: "", shown: 25, topType: "Largometraje" });
      $("#search").value = ""; applyPreset("all"); render();
    });
    $$("#table th").forEach((th) => th.addEventListener("click", () => {
      const k = th.dataset.sort;
      S.sort = { key: k, dir: S.sort.key === k ? -S.sort.dir : (k === "a" || k === "d" || k === "m" ? -1 : 1) };
      renderTable(FILMS.filter((f) => passes(f)));
    }));
    $("#more").addEventListener("click", () => { S.shown += 50; renderTable(FILMS.filter((f) => passes(f))); });
    $("#csv").addEventListener("click", downloadCsv);
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { renderStatic(); render(); });
  }

  async function init() {
    renderStatic();
    const getJson = (url) => fetch(url, { cache: "no-cache" }).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
    try {
      // Topics are optional: the dashboard works without them (e.g. before the first tagging run).
      const [data, tax, tags] = await Promise.all([
        getJson("data/films.json"),
        getJson("data/taxonomy.json").catch(() => null),
        getJson("data/topics.json").catch(() => null),
      ]);
      META = data.meta || {};
      TOPICS = tax?.topics || [];
      const known = new Set(TOPICS.map((x) => x.code));
      const tagOf = (id) => (tags?.films?.[id]?.t || []).filter((c) => known.has(c));
      FILMS = data.films.map((f) => ({
        ...f, dir: f.dir || "", syn: f.syn || "", tp: tagOf(f.id),
        _s: norm(`${f.t} ${f.o} ${f.dir || ""}`),
      }));
      HAS_TOPICS = FILMS.some((f) => f.tp.length);
    } catch (e) {
      const l = $("#loading"); l.textContent = t("load_error"); l.classList.add("error");
      return;
    }
    MIN_DATE = FILMS.reduce((m, f) => (f.d < m ? f.d : m), "9999");
    MAX_DATE = FILMS.reduce((m, f) => (f.d > m ? f.d : m), "0000");
    MIN_YEAR = +MIN_DATE.slice(0, 4); MAX_YEAR = Math.max(+MAX_DATE.slice(0, 4), new Date().getFullYear());
    const years = []; for (let y = MIN_YEAR; y <= MAX_YEAR; y++) years.push([String(y), String(y)]);
    fillSelect($("#fromYear"), years, String(MIN_YEAR));
    fillSelect($("#toYear"), years, String(MAX_YEAR));
    applyPreset("all");
    renderStatic();
    wire();
    render();
    $("#loading").classList.add("hide");
  }

  if (window.echarts) init(); else window.addEventListener("load", init);
})();
