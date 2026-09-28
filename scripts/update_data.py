"""Download MinCultura's SIREC Excel files and write docs/data/films.json.

Sources (both in a SharePoint folder shared anonymously, "anyone with the link"):
- "HISTORICO Estrenos Colombia.xlsx": Colombian releases with admissions (the base dataset).
- "TITULOS CLASIFICADOS_REGISTRADOS.xlsx": every classified title, domestic and
  international, with director and synopsis. Joined onto the base by acta number.

Opening the share link grants a guest session cookie, which is then used to read
the files through the SharePoint REST API.

Exit codes: 0 = ok (data written or unchanged), 1 = download/schema error in the
base file. A failure in the titles file only reuses the previous director/synopsis.
"""

from __future__ import annotations

import hashlib
import io
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

import pandas as pd
import requests

SITE = "https://mcultura-my.sharepoint.com/personal/sirec_mincultura_gov_co"
SHARE_LINK = (
    "https://mcultura-my.sharepoint.com/:f:/g/personal/sirec_mincultura_gov_co/"
    "EvK4Z0jd1G1Mvgu94k1L5YsB4IpRICiX41MTdYZtm8Pk8Q"
)
DOCS = "/personal/sirec_mincultura_gov_co/Documents/SIREC - INFORMACION PUBLICA"

# Each source is looked up by path first, then by id (if the folder is renamed).
RELEASES = {
    "path": f"{DOCS}/INFORMACIÓN - DATOS HISTÓRICOS/HISTORICO Estrenos Colombia.xlsx",
    "id": "E3D2B647-A63E-49EF-81CB-679BCE2F032B",
    "sheet": "ESTRENOS Consolidado",
}
TITLES = {
    "path": f"{DOCS}/TITULOS CLASIFICADOS_REGISTRADOS.xlsx",
    "id": "2d27c371-5b5a-44d1-bb45-bb9822982e85",
    "sheet": "TITULOS REGISTRADOS",
}

# Expected headers (row 2 of the releases sheet), whitespace-normalised, in order.
EXPECTED = [
    "AÑO Estreno",
    "Fecha 1ra Exhibición",
    "Acta de Clasificación",
    "Título Local",
    "Titulo original",
    "Duración (Tipo)",
    "Duración (en minutos)",
    "GENERO",
    "Clasificación",
    "Nacionalidad",
    "Nacionalidad (mayor Participación)",
    "Solicitud clasificación por",
    "Admisiones",
]
TITLES_ACTA = "Acta Clasificación/ Cod Exhibición"
TITLES_REQUIRED = [TITLES_ACTA, "Director", "Sinopsis"]

# Whole-market sources (all films shown in Colombia, not only Colombian ones).
DAILY = {
    "path": f"{DOCS}/INFORMACIÓN - DATOS HISTÓRICOS/HISTORICO Exhibicion_Por_Dia.xlsx",
    "id": "7c119af2-df51-4244-95f7-2dd2239e471a",
    "sheet": "Historico x Día",
}
ALL_RELEASES = {
    "path": f"{DOCS}/INFORMACIÓN - DATOS HISTÓRICOS/HISTORICO Estrenos Total.xlsx",
    "id": "5ef51d3f-4ade-408b-ae17-dfd6a483e5c1",
    "sheet": "ESTRENOS",
    "detail_sheet": "Detalle Largometrajes",
}

OUT = Path(__file__).resolve().parent.parent / "docs" / "data" / "films.json"
MARKET_OUT = OUT.with_name("market.json")
UA = {"User-Agent": "Mozilla/5.0 (colombian-films-dashboard updater)"}


def norm(s: object) -> str:
    return re.sub(r"\s+", " ", str(s)).strip()


def text(v: object) -> str:
    return norm(v) if pd.notna(v) else ""


def guest_session() -> requests.Session:
    s = requests.Session()
    s.headers.update(UA)
    r = s.get(SHARE_LINK, timeout=60)
    r.raise_for_status()
    if "FedAuth" not in s.cookies:
        raise RuntimeError("Share link did not grant a guest session (link revoked?)")
    return s


def fetch(s: requests.Session, src: dict) -> tuple[bytes, str | None]:
    """Return (xlsx bytes, SharePoint last-modified ISO string)."""
    api_by_path = f"{SITE}/_api/web/GetFileByServerRelativeUrl('{quote(src['path'])}')"
    api_by_id = f"{SITE}/_api/web/GetFileById('{src['id']}')"
    json_hdr = {"Accept": "application/json;odata=nometadata"}
    for api in (api_by_path, api_by_id):
        meta = s.get(api, headers=json_hdr, timeout=60)
        if meta.status_code != 200:
            continue
        content = s.get(f"{api}/$value", timeout=180)
        if content.status_code == 200 and content.content[:2] == b"PK":
            return content.content, meta.json().get("TimeLastModified")
    raise RuntimeError(f"Could not download {src['path'].rsplit('/', 1)[-1]} by path or by id")


def split_countries(s: str) -> list[str]:
    return [c.strip() for c in s.split(",") if c.strip()]


def parse_releases(xlsx: bytes) -> tuple[list[dict], str | None]:
    df = pd.read_excel(io.BytesIO(xlsx), sheet_name=RELEASES["sheet"], header=1)
    headers = [norm(c) for c in df.columns]
    if headers[: len(EXPECTED)] != EXPECTED:
        raise RuntimeError(f"Unexpected columns in '{RELEASES['sheet']}':\n{headers}")

    # The 14th header carries the extraction date, e.g. "Fecha Descarga 25/09/2026".
    extracted = None
    if len(headers) > len(EXPECTED):
        m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", headers[len(EXPECTED)])
        if m:
            extracted = f"{m[3]}-{int(m[2]):02d}-{int(m[1]):02d}"

    df = df.iloc[:, : len(EXPECTED)]
    df.columns = [
        "year", "date", "acta", "title", "original", "type", "minutes",
        "genre", "rating", "nationality", "main_country", "applicant", "admissions",
    ]
    df = df.dropna(subset=["title", "date"])
    if len(df) < 1000:
        raise RuntimeError(f"Only {len(df)} rows parsed; refusing to overwrite data")

    films = []
    for r in df.itertuples(index=False):
        films.append({
            "id": int(r.acta) if pd.notna(r.acta) else None,
            "d": pd.to_datetime(r.date).strftime("%Y-%m-%d"),
            "t": norm(r.title),
            "o": text(r.original),
            "ty": norm(r.type),
            "m": int(r.minutes) if pd.notna(r.minutes) else None,
            "g": text(r.genre),
            "r": text(r.rating),
            "c": split_countries(text(r.nationality)),
            "mc": text(r.main_country),
            "p": text(r.applicant),
            "a": int(r.admissions) if pd.notna(r.admissions) else 0,
        })
    films.sort(key=lambda f: (f["d"], f["t"]), reverse=True)
    return films, extracted


def parse_titles(xlsx: bytes) -> dict[int, dict]:
    """Map acta -> {"dir", "syn"} from the classified-titles register."""
    df = pd.read_excel(io.BytesIO(xlsx), sheet_name=TITLES["sheet"], header=5)
    df.columns = [norm(c) for c in df.columns]
    missing = [c for c in TITLES_REQUIRED if c not in df.columns]
    if missing:
        raise RuntimeError(f"Missing columns {missing} in '{TITLES['sheet']}': {list(df.columns)}")
    df[TITLES_ACTA] = pd.to_numeric(df[TITLES_ACTA], errors="coerce")
    df = df.dropna(subset=[TITLES_ACTA]).drop_duplicates(TITLES_ACTA, keep="first")
    return {
        int(r[TITLES_ACTA]): {"dir": text(r["Director"]), "syn": text(r["Sinopsis"])}
        for _, r in df.iterrows()
    }


def extraction_date(headers: list[str]) -> str | None:
    for h in headers:
        m = re.search(r"Descarga\s+(\d{1,2})/(\d{1,2})/(\d{4})", h)
        if m:
            return f"{m[3]}-{int(m[2]):02d}-{int(m[1]):02d}"
    return None


def origin(main_country: object) -> str:
    """Group a film by its main producing country: CO, US or OT (other)."""
    c = text(main_country).upper()
    return "CO" if c == "COLOMBIA" else "US" if c == "ESTADOS UNIDOS" else "OT"


def parse_daily(xlsx: bytes) -> dict:
    df = pd.read_excel(io.BytesIO(xlsx), sheet_name=DAILY["sheet"], header=1)
    df.columns = [norm(c) for c in df.columns]
    need = ["Fecha", "Asistencia", "Taquilla (Millones)"]
    if any(c not in df.columns for c in need):
        raise RuntimeError(f"Unexpected columns in '{DAILY['sheet']}': {list(df.columns)}")
    df = df.dropna(subset=["Fecha", "Asistencia"]).sort_values("Fecha")
    if len(df) < 5000:
        raise RuntimeError(f"Only {len(df)} daily rows parsed")
    rows = [[pd.to_datetime(r.Fecha).strftime("%Y-%m-%d"), int(r.Asistencia), round(float(r[2]), 3)]
            for r in df[need].itertuples(index=False)]
    return {"extracted": extraction_date(list(df.columns)), "rows": rows}


def parse_all_releases(xlsx: bytes) -> dict:
    """Feature-film admissions/titles by release year and origin, plus screens by exhibition year."""
    book = pd.ExcelFile(io.BytesIO(xlsx))
    e = pd.read_excel(book, sheet_name=ALL_RELEASES["sheet"], header=1)
    e.columns = [norm(c) for c in e.columns]
    need = ["AÑO ESTRENO", "DURACIÓN (TIPO)", "NACIONALIDAD (MAYOR PARTICIPACIÓN)", "ADMISIONES"]
    if any(c not in e.columns for c in need):
        raise RuntimeError(f"Unexpected columns in '{ALL_RELEASES['sheet']}': {list(e.columns)}")
    # Shorts are excluded: their admissions ride on the features they precede and would inflate shares.
    e = e[e["DURACIÓN (TIPO)"].astype(str).str.strip() == "Largometraje"].dropna(subset=["AÑO ESTRENO"])
    e["o"] = e["NACIONALIDAD (MAYOR PARTICIPACIÓN)"].map(origin)
    by_year = []
    for year, g in e.groupby("AÑO ESTRENO"):
        by_year.append({
            "y": int(year),
            "a": {o: int(g.loc[g.o == o, "ADMISIONES"].fillna(0).sum()) for o in ("CO", "US", "OT")},
            "n": {o: int((g.o == o).sum()) for o in ("CO", "US", "OT")},
        })

    d = pd.read_excel(book, sheet_name=ALL_RELEASES["detail_sheet"], header=2)
    d.columns = [norm(c) for c in d.columns]
    screens_col = "# PANTALLAS DE EXHIBICIÓN"
    need_d = ["Año", "NACION", "NACIONALIDAD", "ADMISIONES", screens_col]
    if any(c not in d.columns for c in need_d):
        raise RuntimeError(f"Unexpected columns in '{ALL_RELEASES['detail_sheet']}': {list(d.columns)}")
    d = d.dropna(subset=["Año"])
    d["o"] = [
        "CO" if text(n) == "Colombiana" else origin(text(nat).split(",")[0])
        for n, nat in zip(d["NACION"], d["NACIONALIDAD"])
    ]
    screens = []
    for year, g in d.groupby("Año"):
        # Some years only list Colombian titles; a share is meaningless there.
        complete = bool((g["NACION"].astype(str).str.strip() == "Extranjera").any())
        screens.append({
            "y": int(year),
            "complete": complete,
            "s": {o: int(g.loc[g.o == o, screens_col].fillna(0).sum()) for o in ("CO", "US", "OT")},
            "a": {o: int(g.loc[g.o == o, "ADMISIONES"].fillna(0).sum()) for o in ("CO", "US", "OT")},
        })
    return {"extracted": extraction_date(list(e.columns)), "releases": by_year, "screens": screens}


def write_market(s: requests.Session) -> None:
    """Whole-market data is optional: on any failure keep the previous market.json."""
    try:
        daily = parse_daily(fetch(s, DAILY)[0])
        rel = parse_all_releases(fetch(s, ALL_RELEASES)[0])
    except Exception as e:  # noqa: BLE001
        print(f"::warning::Market data unavailable, keeping previous market.json: {e}")
        return
    body = {"daily": daily["rows"], "releases": rel["releases"], "screens": rel["screens"]}
    digest = hashlib.sha256(json.dumps(body).encode()).hexdigest()
    if MARKET_OUT.exists() and json.loads(MARKET_OUT.read_text(encoding="utf-8")).get("meta", {}).get("sha256") == digest:
        print("Market data unchanged.")
        return
    payload = {"meta": {
        "daily_extracted": daily["extracted"], "daily_last": daily["rows"][-1][0],
        "releases_extracted": rel["extracted"],
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "sha256": digest,
    }, **body}
    MARKET_OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote market data: {len(daily['rows'])} days, {len(rel['releases'])} release years, "
          f"{len(rel['screens'])} screen years.")


def previous_details() -> dict[int, dict]:
    if not OUT.exists():
        return {}
    old = json.loads(OUT.read_text(encoding="utf-8"))
    return {f["id"]: {"dir": f.get("dir", ""), "syn": f.get("syn", "")}
            for f in old.get("films", []) if f.get("id") is not None}


def main() -> int:
    try:
        s = guest_session()
        xlsx, modified = fetch(s, RELEASES)
        films, extracted = parse_releases(xlsx)
    except Exception as e:  # noqa: BLE001 - surface any failure to the workflow
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    try:
        details = parse_titles(fetch(s, TITLES)[0])
    except Exception as e:  # noqa: BLE001 - keep the refresh going with last known details
        print(f"::warning::Titles register unavailable, reusing previous director/synopsis: {e}")
        details = previous_details()

    for f in films:
        extra = details.get(f["id"], {})
        f["dir"] = extra.get("dir", "")
        f["syn"] = extra.get("syn", "")
    matched = sum(1 for f in films if f["id"] in details)
    print(f"Director/synopsis matched for {matched}/{len(films)} films.")
    write_market(s)

    digest = hashlib.sha256(json.dumps(films, ensure_ascii=False).encode()).hexdigest()
    if OUT.exists():
        old = json.loads(OUT.read_text(encoding="utf-8"))
        if old.get("meta", {}).get("sha256") == digest:
            print(f"No changes ({len(films)} films).")
            return 0

    payload = {
        "meta": {
            "source": "SIREC - Ministerio de las Culturas, las Artes y los Saberes",
            "source_modified": modified,
            "extracted": extracted,
            "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "rows": len(films),
            "sha256": digest,
        },
        "films": films,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {len(films)} films to {OUT} (extracted {extracted}, modified {modified}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
