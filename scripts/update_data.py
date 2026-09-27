"""Download MinCultura's "HISTORICO Estrenos Colombia.xlsx" and write docs/data/films.json.

The file lives in a SharePoint folder shared anonymously ("anyone with the link").
Opening the share link grants a guest session cookie, which is then used to read
the file through the SharePoint REST API.

Exit codes: 0 = ok (data written or unchanged), 1 = download/schema error.
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
FILE_PATH = (
    "/personal/sirec_mincultura_gov_co/Documents/SIREC - INFORMACION PUBLICA/"
    "INFORMACIÓN - DATOS HISTÓRICOS/HISTORICO Estrenos Colombia.xlsx"
)
# Fallback if the folder path is renamed but the file itself is kept.
FILE_ID = "E3D2B647-A63E-49EF-81CB-679BCE2F032B"
SHEET = "ESTRENOS Consolidado"

# Expected headers (row 2 of the sheet), whitespace-normalised, in order.
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

OUT = Path(__file__).resolve().parent.parent / "docs" / "data" / "films.json"
UA = {"User-Agent": "Mozilla/5.0 (colombian-films-dashboard updater)"}


def norm(s: object) -> str:
    return re.sub(r"\s+", " ", str(s)).strip()


def fetch() -> tuple[bytes, str | None]:
    """Return (xlsx bytes, SharePoint last-modified ISO string)."""
    s = requests.Session()
    s.headers.update(UA)
    r = s.get(SHARE_LINK, timeout=60)
    r.raise_for_status()
    if "FedAuth" not in s.cookies:
        raise RuntimeError("Share link did not grant a guest session (link revoked?)")

    api_by_path = f"{SITE}/_api/web/GetFileByServerRelativeUrl('{quote(FILE_PATH)}')"
    api_by_id = f"{SITE}/_api/web/GetFileById('{FILE_ID}')"
    json_hdr = {"Accept": "application/json;odata=nometadata"}
    for api in (api_by_path, api_by_id):
        meta = s.get(api, headers=json_hdr, timeout=60)
        if meta.status_code != 200:
            continue
        content = s.get(f"{api}/$value", timeout=120)
        if content.status_code == 200 and content.content[:2] == b"PK":
            return content.content, meta.json().get("TimeLastModified")
    raise RuntimeError("Could not download the Excel file by path or by id")


def split_countries(s: str) -> list[str]:
    return [c.strip() for c in s.split(",") if c.strip()]


def parse(xlsx: bytes) -> tuple[list[dict], str | None]:
    df = pd.read_excel(io.BytesIO(xlsx), sheet_name=SHEET, header=1)
    headers = [norm(c) for c in df.columns]
    if headers[: len(EXPECTED)] != EXPECTED:
        raise RuntimeError(f"Unexpected columns in '{SHEET}':\n{headers}")

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
        date = pd.to_datetime(r.date)
        countries = split_countries(norm(r.nationality)) if pd.notna(r.nationality) else []
        films.append({
            "d": date.strftime("%Y-%m-%d"),
            "t": norm(r.title),
            "o": norm(r.original) if pd.notna(r.original) else "",
            "ty": norm(r.type),
            "m": int(r.minutes) if pd.notna(r.minutes) else None,
            "g": norm(r.genre) if pd.notna(r.genre) else "",
            "r": norm(r.rating) if pd.notna(r.rating) else "",
            "c": countries,
            "mc": norm(r.main_country) if pd.notna(r.main_country) else "",
            "p": norm(r.applicant) if pd.notna(r.applicant) else "",
            "a": int(r.admissions) if pd.notna(r.admissions) else 0,
        })
    films.sort(key=lambda f: (f["d"], f["t"]), reverse=True)
    return films, extracted


def main() -> int:
    try:
        xlsx, modified = fetch()
        films, extracted = parse(xlsx)
    except Exception as e:  # noqa: BLE001 - surface any failure to the workflow
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

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
