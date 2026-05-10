"""Join per-source DataFrames into list[StateRecord] matching schema/state.schema.json."""
from __future__ import annotations

from typing import Any

import pandas as pd

REQUIRED_SOURCES = ("tax_foundation", "climate", "rpp", "demographics", "lifestyle")


def join_sources(
    frames: dict[str, pd.DataFrame],
    state_names: dict[str, str],
) -> list[dict[str, Any]]:
    for src in REQUIRED_SOURCES:
        if src not in frames:
            raise KeyError(f"missing required source frame: {src}")

    tax = frames["tax_foundation"].set_index("code")
    climate = frames["climate"].set_index("code")
    rpp = frames["rpp"].set_index("code")
    demo = frames["demographics"].set_index("code")
    life = frames["lifestyle"].set_index("code")

    records: list[dict[str, Any]] = []
    for code in sorted(state_names.keys()):
        if code not in tax.index:
            continue
        records.append({
            "code": code,
            "name": state_names[code],
            "tax": {
                "incomeBrackets": tax.at[code, "incomeBrackets"],
                "salesRate": float(tax.at[code, "salesRate"]),
                "avgLocalSalesRate": float(tax.at[code, "avgLocalSalesRate"]),
                "effectivePropertyRate": float(tax.at[code, "effectivePropertyRate"]),
            },
            "climate": {
                "avgTempF": float(climate.at[code, "avgTempF"]),
                "sunDaysPerYear": int(climate.at[code, "sunDaysPerYear"]),
                "snowDaysPerYear": int(climate.at[code, "snowDaysPerYear"]),
                "humidityAvgPct": float(climate.at[code, "humidityAvgPct"]),
            },
            "col": {"rpp": float(rpp.at[code, "rpp"])},
            "demographics": {
                "population": int(demo.at[code, "population"]),
                "densityPerSqMi": float(demo.at[code, "densityPerSqMi"]),
                "medianAge": float(demo.at[code, "medianAge"]),
            },
            "lifestyle": {
                "politicsLean": float(life.at[code, "politicsLean"]),
                "urbanizationPct": float(life.at[code, "urbanizationPct"]),
                "outdoorRecRating": int(life.at[code, "outdoorRecRating"]),
                "schoolRating": int(life.at[code, "schoolRating"]),
            },
        })
    return records
