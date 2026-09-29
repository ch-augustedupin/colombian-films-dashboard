"""One-time build of docs/data/colombia-departments.geo.json (department outlines for the map).

Source: John Guerra's public Colombia.geo.json gist, derived from DANE's geostatistical framework.
The raw file is ~1.5 MB; this simplifies each department and keeps only the DANE code and name.
The output is committed, so the weekly job never needs this script (or shapely).

    pip install shapely
    python scripts/build_geo.py
"""

from __future__ import annotations

import json
from pathlib import Path

import requests
from shapely.geometry import mapping, shape

SOURCE = (
    "https://gist.githubusercontent.com/john-guerra/43c7656821069d00dcbc/raw/"
    "be6a6e239cd5b5b803c6e7c2ec405b793a9064dd/Colombia.geo.json"
)
OUT = Path(__file__).resolve().parent.parent / "docs" / "data" / "colombia-departments.geo.json"
TOLERANCE = 0.01  # degrees (~1 km): invisible at dashboard size
DECIMALS = 3

# Display names (the source uses old or long forms for a few departments).
NAMES = {
    "11": "Bogotá D.C.", "88": "San Andrés y Providencia", "05": "Antioquia", "08": "Atlántico",
    "13": "Bolívar", "15": "Boyacá", "17": "Caldas", "18": "Caquetá", "19": "Cauca", "20": "Cesar",
    "23": "Córdoba", "25": "Cundinamarca", "27": "Chocó", "41": "Huila", "44": "La Guajira",
    "47": "Magdalena", "50": "Meta", "52": "Nariño", "54": "Norte de Santander", "63": "Quindío",
    "66": "Risaralda", "68": "Santander", "70": "Sucre", "73": "Tolima", "76": "Valle del Cauca",
    "81": "Arauca", "85": "Casanare", "86": "Putumayo", "91": "Amazonas", "94": "Guainía",
    "95": "Guaviare", "97": "Vaupés", "99": "Vichada",
}


def rounded(coords):
    if isinstance(coords[0], (int, float)):
        return [round(coords[0], DECIMALS), round(coords[1], DECIMALS)]
    return [rounded(c) for c in coords]


def main() -> None:
    src = requests.get(SOURCE, timeout=120).json()
    features = []
    for f in src["features"]:
        code = str(f["properties"]["DPTO"]).zfill(2)
        geom = shape(f["geometry"]).simplify(TOLERANCE, preserve_topology=True)
        g = mapping(geom)
        features.append({
            "type": "Feature",
            "properties": {"code": code, "name": NAMES.get(code, f["properties"]["NOMBRE_DPT"].title())},
            "geometry": {"type": g["type"], "coordinates": rounded(g["coordinates"])},
        })
    features.sort(key=lambda f: f["properties"]["code"])
    OUT.write_text(json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":")),
                   encoding="utf-8")
    print(f"Wrote {len(features)} departments to {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
