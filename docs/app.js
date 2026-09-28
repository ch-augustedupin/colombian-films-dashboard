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
      f_period: "Periodo", p_all: "Todo", p_ytd: "Este año",
      f_from: "Desde", f_to: "Hasta", f_type: "Duración", all_f: "Todas", all_m: "Todos",
      f_genre: "Género", f_rating: "Clasificación", f_prod: "Producción", f_search: "Buscar título o director",
      prod_co: "100% colombiana", prod_coprod: "Coproducción internacional",
      search_ph: "Ej.: El Paseo", reset: "Limpiar filtros",
      k_films: "Películas estrenadas", k_adm: "Admisiones de estas películas",
      k_median: "Mediana de admisiones por largometraje",
      k_share: "Cuota del cine colombiano", k_market: "Admisiones de todo el mercado",
      n_share: "de las admisiones de largometrajes estrenados en {y} · EE. UU.: {us}",
      n_share_none: "Sin datos para el periodo", n_market: "Ingresos: {r} · precio promedio {p}",
      s_market: "El mercado de cine en Colombia",
      s_market_hint: "Todas las películas exhibidas en el país, colombianas y extranjeras. Esta sección solo responde al filtro de periodo.",
      m_adm: "Admisiones", m_rev: "Ingresos", m_price: "Precio promedio",
      g_week: "Semana", g_quarter: "Trimestre",
      mk_a: "Admisiones en salas de cine", mk_r: "Ingresos de taquilla (COP)", mk_p: "Precio promedio de la boleta (COP)",
      mk_hint: "Todo el mercado · datos diarios hasta el {d}",
      c_share: "Colombia frente al cine extranjero",
      sh_adm: "Admisiones", sh_titles: "Estrenos", sh_screens: "Pantallas",
      share_hint_a: "Participación en las admisiones de largometrajes, por año de estreno",
      share_hint_n: "Participación en el número de largometrajes estrenados, por año",
      share_hint_s: "Participación en las pantallas ocupadas por largometrajes, por año de exhibición",
      share_stat: "En {y}, el cine colombiano obtuvo el {co} de las admisiones de largometrajes; el estadounidense, el {us}.",
      o_CO: "Colombia", o_US: "Estados Unidos", o_OT: "Otros países", no_data: "Sin datos",
      n_title: "Cómo leer estas cifras",
      s_shorts: "Largometrajes y cortometrajes", s_shorts_hint: "Comparación por duración · clic en una barra para filtrar",
      theme_dark: "Cambiar a modo oscuro", theme_light: "Cambiar a modo claro",
      n_features: "Las cuotas comparan solo largometrajes: las admisiones de los cortometrajes dependen de las películas que acompañan.",
      n_origin: "El origen de cada película es su país de mayor participación en la producción.",
      n_screens: "Pantallas: suma de las pantallas en que se exhibió cada largometraje durante el año, disponible desde 2020. El reporte de 2023 y 2024 solo incluye películas colombianas, por lo que esos años no tienen cuota.",
      n_revenue: "El SIREC no publica ingresos por película; los ingresos corresponden a todo el mercado.",
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
      f_period: "Period", p_all: "All time", p_ytd: "This year",
      f_from: "From", f_to: "To", f_type: "Length", all_f: "All", all_m: "All",
      f_genre: "Genre", f_rating: "Rating", f_prod: "Production", f_search: "Search title or director",
      prod_co: "100% Colombian", prod_coprod: "International co-production",
      search_ph: "E.g. El Paseo", reset: "Clear filters",
      k_films: "Films released", k_adm: "Admissions of these films",
      k_median: "Median admissions per feature film",
      k_share: "Colombian films' share", k_market: "Admissions, whole market",
      n_share: "of admissions to feature films released in {y} · US: {us}",
      n_share_none: "No data for this period", n_market: "Revenue: {r} · average ticket {p}",
      s_market: "The film market in Colombia",
      s_market_hint: "All films shown in the country, Colombian and foreign. This section only responds to the period filter.",
      m_adm: "Admissions", m_rev: "Revenue", m_price: "Average ticket",
      g_week: "Week", g_quarter: "Quarter",
      mk_a: "Cinema admissions", mk_r: "Box-office revenue (COP)", mk_p: "Average ticket price (COP)",
      mk_hint: "Whole market · daily data up to {d}",
      c_share: "Colombia vs. foreign films",
      sh_adm: "Admissions", sh_titles: "Releases", sh_screens: "Screens",
      share_hint_a: "Share of feature-film admissions, by release year",
      share_hint_n: "Share of feature films released, by year",
      share_hint_s: "Share of screens used by feature films, by exhibition year",
      share_stat: "In {y}, Colombian films took {co} of feature-film admissions; US films took {us}.",
      o_CO: "Colombia", o_US: "United States", o_OT: "Other countries", no_data: "No data",
      n_title: "How to read these figures",
      n_features: "Shares compare feature films only: short films' admissions depend on the films they accompany.",
      n_origin: "A film's origin is the country with the largest stake in its production.",
      n_screens: "Screens: the sum of screens each feature film played on during the year, available from 2020. The 2023 and 2024 report only lists Colombian films, so those years have no share.",
      n_revenue: "SIREC does not publish revenue per film; revenue figures cover the whole market.",
      s_shorts: "Feature films and short films", s_shorts_hint: "Comparison by length · click a bar to filter",
      theme_dark: "Switch to dark mode", theme_light: "Switch to light mode",
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

  const LS = { get(k) { try { return localStorage.getItem(k); } catch { return null; } },
               set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // ---------- state ----------
  const S = {
    lang: LS.get("lang") === "en" ? "en" : (LS.get("lang") === "es" ? "es" : (navigator.language || "es").startsWith("es") ? "es" : "en"),
    preset: "all", from: null, to: null,
    // Feature films lead: shorts' admissions ride on the films they precede.
    type: "Largometraje", genre: "", prod: "", topic: "", q: "",
    open: new Set(),
    gran: "year", topN: 10,
    mkMetric: "a", mkGran: "month", share: "a",
    sort: { key: "d", dir: -1 }, shown: 25,
    // Shorts' admissions dwarf features', so this chart opens on features only.
    hiddenAdm: new Set(["Cortometraje"]),
  };
  let MARKET = null;
  const ORIGINS = ["CO", "US", "OT"];
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
  const pct1 = (x) => new Intl.NumberFormat(locale(), { style: "percent", maximumFractionDigits: 1 }).format(x);
  const fmtCOP = (n) => new Intl.NumberFormat(locale(), {
    style: "currency", currency: "COP", notation: n >= 1e5 ? "compact" : "standard", maximumFractionDigits: n >= 1e5 ? 1 : 0,
  }).format(n);
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
    if (skip !== "topic" && S.topic && !f.tp.includes(S.topic)) return false;
    if (S.prod === "co" && f.c.length !== 1) return false;
    if (S.prod === "coprod" && f.c.length < 2) return false;
    if (S.q && !f._s.includes(S.q)) return false;
    return true;
  }
  const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const endDate = () => { const today = iso(new Date()); return MAX_DATE > today ? MAX_DATE : today; };

  // Any period change goes through here; granularities follow the length of the range.
  function setRange(from, to, preset = null) {
    if (from > to) [from, to] = [to, from];
    S.from = from; S.to = to; S.preset = preset;
    const days = (Date.parse(to) - Date.parse(from)) / 864e5;
    S.gran = days <= 800 ? "month" : "year";
    S.mkGran = days <= 120 ? "week" : days <= 1500 ? "month" : days <= 3000 ? "quarter" : "year";
  }
  function applyPreset(p) {
    if (p === "all") setRange(MIN_DATE, endDate(), "all");
    if (p === "ytd") setRange(`${new Date().getFullYear()}-01-01`, endDate(), "ytd");
  }
  const setYears = (a, b) => setRange(`${Math.min(a, b)}-01-01`, `${Math.max(a, b)}-12-31`);

  // ---------- rendering ----------
  function render() {
    const rows = FILMS.filter((f) => passes(f));
    renderControls();
    // Legends list only the lengths currently plotted.
    const legendItems = (S.type ? [S.type] : TYPES).map((ty) => ({ ty, label: tv(ty) }));
    for (const id of ["#legTime", "#legGenre", "#legTopics"]) buildLegend($(id), legendItems, false);
    buildLegend($("#legAdm"), legendItems, !S.type);
    renderKpis(rows);
    renderTime(rows);
    if ($("#shortsSection").open) renderType();
    renderTop(rows);
    renderBreakdown("chGenre", "genre", "g", GENRES);
    renderTopics(rows);
    renderAdm(rows);
    renderMarket();
    renderShare();
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
    fillSelect($("#prod"), [["", t("all_f")], ["co", t("prod_co")], ["coprod", t("prod_coprod")]], S.prod);
    const topicOpts = TOPICS.map((tp) => [tp.code, tp[S.lang]]).sort((a, b) => a[1].localeCompare(b[1], locale()));
    fillSelect($("#topic"), [["", t("all_m")], ...topicOpts], S.topic);
    $("#topicFilter").hidden = !HAS_TOPICS;
    $("#aiBody").textContent = t("ai_body", { n: TOPICS.length });
    $("#legShare").replaceChildren(...ORIGINS.map((o) => {
      const s = document.createElement("span"); const i = document.createElement("i"); i.style.background = originColor(o);
      s.append(i, document.createTextNode(t("o_" + o))); return s;
    }));
    $("#marketHead").hidden = $("#marketGrid").hidden = !MARKET;
    const dark = isDark();
    $("#themeBtn").setAttribute("aria-label", t(dark ? "theme_light" : "theme_dark"));
    $("#themeBtn").title = t(dark ? "theme_light" : "theme_dark");
  }

  const isDark = () => {
    const th = document.documentElement.dataset.theme;
    return th ? th === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  };
  const originColor = (o) => css(o === "CO" ? "--co" : o === "US" ? "--us" : "--ot");

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
    $("#fromDate").value = S.from;
    $("#toDate").value = S.to;
    const pressed = (sel, attr, val) => $$(sel).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset[attr] === String(val))));
    pressed("#typeSeg button", "type", S.type);
    pressed("#granSeg button", "gran", S.gran);
    pressed("#topNSeg button", "n", S.topN);
    pressed("#mkMetricSeg button", "metric", S.mkMetric);
    pressed("#mkGranSeg button", "mgran", S.mkGran);
    pressed("#shareSeg button", "share", S.share);
    $("#genre").value = S.genre; $("#prod").value = S.prod; $("#topic").value = S.topic;
  }

  function renderKpis(rows) {
    const feat = rows.filter((f) => f.ty === "Largometraje");
    const shorts = rows.filter((f) => f.ty === "Cortometraje");
    const sum = (a) => a.reduce((s, f) => s + f.a, 0);
    const admF = sum(feat), admS = sum(shorts);
    $("#kFilms").textContent = fmt(rows.length);
    // The split ignores the length filter, so it still shows how many shorts sit behind the default view.
    const both = FILMS.filter((f) => passes(f, "type"));
    $("#kFilmsNote").textContent = t("n_films", {
      a: fmt(both.filter((f) => f.ty === "Largometraje").length), b: fmt(both.filter((f) => f.ty === "Cortometraje").length),
    });
    $("#kAdm").textContent = fmtC(admF + admS);
    $("#kAdm").title = fmt(admF + admS);
    $("#kAdmNote").textContent = S.type ? t(S.type + "_pl") : t("n_adm", { a: fmtC(admF), b: fmtC(admS) });

    // Market KPIs: whole market, period filter only.
    const years = yearsLabel();
    const sh = shareTotals("a");
    if (sh && sh.total) {
      $("#kShare").textContent = pct1(sh.CO / sh.total);
      $("#kShareNote").textContent = t("n_share", { y: years, us: pct(sh.US, sh.total) });
    } else {
      $("#kShare").textContent = "–"; $("#kShareNote").textContent = t("n_share_none");
    }
    const mk = marketTotals();
    if (mk && mk.a) {
      $("#kMarket").textContent = fmtC(mk.a); $("#kMarket").title = fmt(mk.a);
      $("#kMarketNote").textContent = t("n_market", { r: fmtCOP(mk.r * 1e6), p: fmtCOP(mk.r * 1e6 / mk.a) });
    } else {
      $("#kMarket").textContent = "–"; $("#kMarketNote").textContent = t("n_share_none");
    }

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
    $("#" + id).setAttribute("aria-label", t("c_genre"));
  }

  function renderTop(rows) {
    // Features and shorts are never ranked together ("Todas" ranks features).
    const topType = S.type || "Largometraje";
    const list = rows.filter((f) => f.ty === topType).sort((a, b) => b.a - a.a).slice(0, S.topN);
    $("#topHint").textContent = t("top_hint", { n: S.topN, t: t(topType + "_pl").toLowerCase() });
    $("#topNote").hidden = S.type === "Largometraje";
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

  // ---------- whole market (responds to the period filter only) ----------
  const yearsIn = () => [+S.from.slice(0, 4), +S.to.slice(0, 4)];
  const yearsLabel = () => { const [a, b] = yearsIn(); return a === b ? String(a) : `${a}–${b}`; };
  const marketRows = () => (MARKET ? MARKET.daily.filter((r) => r[0] >= S.from && r[0] <= S.to) : []);
  function marketTotals() {
    if (!MARKET) return null;
    let a = 0, r = 0;
    for (const x of marketRows()) { a += x[1]; r += x[2]; }
    return { a, r };
  }
  // Per-year origin values for a metric: a = admissions, n = releases (by release year), s = screens (by exhibition year).
  function shareYears(metric) {
    if (!MARKET) return [];
    const [a, b] = yearsIn();
    const src = metric === "s" ? MARKET.screens : MARKET.releases;
    return src.filter((x) => x.y >= a && x.y <= b).map((x) => {
      const v = metric === "s" ? (x.complete ? x.s : null) : x[metric];
      // Years with no foreign titles (2003–2004) only list the odd Colombian film: no share to speak of.
      const covered = v && v.US + v.OT > 0;
      return { y: x.y, v: covered ? v : null, total: covered ? v.CO + v.US + v.OT : 0 };
    });
  }
  function shareTotals(metric) {
    const rows = shareYears(metric).filter((r) => r.v);
    if (!rows.length) return null;
    const out = { CO: 0, US: 0, OT: 0, total: 0 };
    for (const r of rows) { for (const o of ORIGINS) out[o] += r.v[o]; out.total += r.total; }
    return out;
  }

  function bucketKey(d, g) {
    if (g === "year") return d.slice(0, 4);
    if (g === "month") return d.slice(0, 7);
    if (g === "quarter") return `${d.slice(0, 4)}-${Math.floor((+d.slice(5, 7) - 1) / 3) + 1}`;
    const dt = new Date(d + "T00:00:00Z");
    dt.setUTCDate(dt.getUTCDate() - ((dt.getUTCDay() + 6) % 7));  // Monday of that week
    return iso(dt);
  }
  function bucketLabel(k, g) {
    if (g === "year") return k;
    if (g === "month") return monthLabel(k);
    if (g === "quarter") return `${S.lang === "es" ? "T" : "Q"}${k.slice(5)} ${k.slice(0, 4)}`;
    return dateFmt(k, { day: "numeric", month: "short", year: "2-digit" });
  }
  function bucketRange(k, g) {
    if (g === "year") return [`${k}-01-01`, `${k}-12-31`];
    if (g === "month") { const [y, m] = k.split("-").map(Number); return [`${k}-01`, iso(new Date(Date.UTC(y, m, 0)))]; }
    if (g === "quarter") {
      const [y, q] = k.split("-").map(Number);
      return [`${y}-${String(q * 3 - 2).padStart(2, "0")}-01`, iso(new Date(Date.UTC(y, q * 3, 0)))];
    }
    const end = new Date(k + "T00:00:00Z"); end.setUTCDate(end.getUTCDate() + 6);
    return [k, iso(end)];
  }

  function renderMarket() {
    if (!MARKET) return;
    const g = S.mkGran, m = S.mkMetric;
    const agg = new Map();
    for (const [d, a, r] of marketRows()) {
      const k = bucketKey(d, g);
      const v = agg.get(k) || { a: 0, r: 0 };
      v.a += a; v.r += r; agg.set(k, v);
    }
    const keys = [...agg.keys()];
    const val = (v) => (m === "a" ? v.a : m === "r" ? v.r * 1e6 : v.a ? (v.r * 1e6) / v.a : null);
    const short = m === "a" ? fmtC : fmtCOP;
    const full = m === "a" ? fmt : (n) => new Intl.NumberFormat(locale(), { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
    const bars = keys.length <= 60;
    const color = css("--mk");
    $("#mkTitle").textContent = t("mk_" + m);
    $("#mkHint").textContent = t("mk_hint", { d: dateFmt(MARKET.meta.daily_last) });
    const c = chart("chMarket");
    c.setOption({
      ...base(),
      tooltip: { ...base().tooltip, trigger: "axis",
        axisPointer: bars ? { type: "shadow", shadowStyle: { color: css("--wash") } } : { type: "line", lineStyle: { color: css("--axis") } },
        formatter: (p) => `<div style="margin-bottom:4px;color:${css("--ink-2")}">${esc(p[0].name)}</div>`
          + `<div>${key(color)}<b>${p[0].value == null ? "–" : full(p[0].value)}</b> <span style="color:${css("--ink-2")}">${esc(t("m_" + (m === "a" ? "adm" : m === "r" ? "rev" : "price")))}</span></div>` },
      xAxis: catAxis(keys.map((k) => bucketLabel(k, g)), { boundaryGap: bars, axisLabel: { color: css("--muted"), fontSize: 11, hideOverlap: true } }),
      yAxis: valueAxis({ scale: m === "p" && !bars, axisLabel: { color: css("--muted"), fontSize: 11, formatter: (v) => short(v) } }),
      series: [bars
        ? { type: "bar", barMaxWidth: 24, data: keys.map((k) => val(agg.get(k))),
            itemStyle: { color, borderRadius: [4, 4, 0, 0] }, emphasis: { itemStyle: { opacity: 0.85 } } }
        : { type: "line", data: keys.map((k) => val(agg.get(k))), showSymbol: false, symbolSize: 8,
            lineStyle: { width: 2, color, cap: "round", join: "round" }, itemStyle: { color },
            areaStyle: { color, opacity: 0.1 } }],
      graphic: keys.length ? [] : [{ type: "text", left: "center", top: "middle", style: { text: t("n_share_none"), fill: css("--muted"), fontSize: 13 } }],
    }, true);
    c.off("click");
    // Clicking a bar narrows the whole dashboard to that bucket (lines are too dense to click).
    if (bars) c.on("click", (p) => { const [a, b] = bucketRange(keys[p.dataIndex], g); setRange(a, b); S.shown = 25; render(); });
    $("#chMarket").setAttribute("aria-label", t("mk_" + m));
  }

  function renderShare() {
    if (!MARKET) return;
    const m = S.share;
    const rows = shareYears(m);
    const series = ORIGINS.map((o, si) => ({
      name: t("o_" + o), type: "bar", stack: "share", barMaxWidth: 28,
      itemStyle: { color: originColor(o), borderColor: css("--surface"), borderWidth: 1,
        borderRadius: si === ORIGINS.length - 1 ? [4, 4, 0, 0] : 0 },
      emphasis: { focus: "none", itemStyle: { opacity: 0.85 } },
      data: rows.map((r) => (r.v ? { value: (r.v[o] / r.total) * 100, raw: r.v[o] } : { value: null, raw: null })),
    }));
    $("#shareHint").textContent = t("share_hint_" + m);
    const c = chart("chShare");
    c.setOption({
      ...base(),
      tooltip: { ...base().tooltip, trigger: "axis", axisPointer: { type: "shadow", shadowStyle: { color: css("--wash") } },
        formatter: (p) => {
          const head = `<div style="margin-bottom:4px;color:${css("--ink-2")}">${esc(p[0].name)}</div>`;
          if (p.every((x) => x.data.raw == null)) return head + `<div>${t("no_data")}</div>`;
          return head + [...p].reverse().map((x) => `<div>${key(x.color)}<b>${pct1(x.value / 100)}</b> `
            + `<span style="color:${css("--ink-2")}">${esc(x.seriesName)} · ${fmtC(x.data.raw)}</span></div>`).join("");
        } },
      xAxis: catAxis(rows.map((r) => String(r.y)), { axisLabel: { color: css("--muted"), fontSize: 11, hideOverlap: true } }),
      yAxis: valueAxis({ max: 100, axisLabel: { color: css("--muted"), fontSize: 11, formatter: (v) => `${v} %` } }),
      series,
      graphic: rows.some((r) => r.v) ? [] : [{ type: "text", left: "center", top: "middle", style: { text: t("n_share_none"), fill: css("--muted"), fontSize: 13 } }],
    }, true);
    $("#chShare").setAttribute("aria-label", t("c_share"));

    // Headline sentence: latest complete release year in the period (the current year is still accumulating).
    const withData = shareYears("a").filter((r) => r.v);
    const done = withData.filter((r) => r.y < new Date().getFullYear());
    const last = (done.length ? done : withData).pop();
    $("#shareStat").textContent = last
      ? t("share_stat", { y: last.y, co: pct1(last.v.CO / last.total), us: pct(last.v.US, last.total) }) : "";
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
    for (const id of ["#fromDate", "#toDate"]) $(id).addEventListener("change", () => {
      const a = $("#fromDate").value || MIN_DATE, b = $("#toDate").value || endDate();
      setRange(a, b); S.shown = 25; render();
    });
    $("#themeBtn").addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      document.documentElement.dataset.theme = next; LS.set("theme", next);
      renderStatic(); render();
    });
    $$("#mkMetricSeg button").forEach((b) => b.addEventListener("click", () => { S.mkMetric = b.dataset.metric; renderControls(); renderMarket(); }));
    $$("#mkGranSeg button").forEach((b) => b.addEventListener("click", () => { S.mkGran = b.dataset.mgran; renderControls(); renderMarket(); }));
    $$("#shareSeg button").forEach((b) => b.addEventListener("click", () => { S.share = b.dataset.share; renderControls(); renderShare(); }));
    // The shorts section starts closed; draw its chart once it has a size.
    $("#shortsSection").addEventListener("toggle", () => { if ($("#shortsSection").open) renderType(); });
    $$("#typeSeg button").forEach((b) => b.addEventListener("click", () => { S.type = b.dataset.type; S.shown = 25; render(); }));
    $$("#granSeg button").forEach((b) => b.addEventListener("click", () => { S.gran = b.dataset.gran; render(); }));
    $$("#topNSeg button").forEach((b) => b.addEventListener("click", () => { S.topN = +b.dataset.n; render(); }));
    for (const id of ["genre", "prod", "topic"]) $("#" + id).addEventListener("change", (e) => { S[id] = e.target.value; S.shown = 25; render(); });
    let timer;
    $("#search").addEventListener("input", (e) => { clearTimeout(timer); timer = setTimeout(() => { S.q = norm(e.target.value.trim()); S.shown = 25; render(); }, 150); });
    $("#reset").addEventListener("click", () => {
      Object.assign(S, { type: "Largometraje", genre: "", prod: "", topic: "", q: "", shown: 25 });
      $("#search").value = ""; applyPreset("all"); render();
    });
    $$("#table th").forEach((th) => th.addEventListener("click", () => {
      const k = th.dataset.sort;
      S.sort = { key: k, dir: S.sort.key === k ? -S.sort.dir : (k === "a" || k === "d" || k === "m" ? -1 : 1) };
      renderTable(FILMS.filter((f) => passes(f)));
    }));
    $("#more").addEventListener("click", () => { S.shown += 50; renderTable(FILMS.filter((f) => passes(f))); });
    $("#csv").addEventListener("click", downloadCsv);
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!document.documentElement.dataset.theme) { renderStatic(); render(); } });
  }

  async function init() {
    renderStatic();
    const getJson = (url) => fetch(url, { cache: "no-cache" }).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
    try {
      // Topics are optional: the dashboard works without them (e.g. before the first tagging run).
      const [data, tax, tags, market] = await Promise.all([
        getJson("data/films.json"),
        getJson("data/taxonomy.json").catch(() => null),
        getJson("data/topics.json").catch(() => null),
        getJson("data/market.json").catch(() => null),
      ]);
      META = data.meta || {};
      MARKET = market?.daily?.length ? market : null;
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
    for (const id of ["#fromDate", "#toDate"]) { $(id).min = MIN_DATE; $(id).max = endDate(); }
    applyPreset("all");
    renderStatic();
    wire();
    render();
    $("#loading").classList.add("hide");
  }

  if (window.echarts) init(); else window.addEventListener("load", init);
})();
