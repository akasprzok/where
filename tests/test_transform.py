import pandas as pd
import pytest
from etl.transform import join_sources

STATE_NAMES = {"TX": "Texas", "CA": "California"}


def _frames() -> dict[str, pd.DataFrame]:
    return {
        "tax_foundation": pd.DataFrame([
            {"code": "TX", "salesRate": 0.0625, "avgLocalSalesRate": 0.0194,
             "effectivePropertyRate": 0.0181, "incomeBrackets": []},
            {"code": "CA", "salesRate": 0.0725, "avgLocalSalesRate": 0.0131,
             "effectivePropertyRate": 0.0073,
             "incomeBrackets": [{"filingStatus": "single", "rateBps": 100, "thresholdUsd": 0}]},
        ]),
        "climate": pd.DataFrame([
            {"code": "TX", "avgTempF": 65, "sunDaysPerYear": 230, "snowDaysPerYear": 2, "humidityAvgPct": 64},
            {"code": "CA", "avgTempF": 59, "sunDaysPerYear": 258, "snowDaysPerYear": 1, "humidityAvgPct": 61},
        ]),
        "rpp": pd.DataFrame([{"code": "TX", "rpp": 0.97}, {"code": "CA", "rpp": 1.13}]),
        "demographics": pd.DataFrame([
            {"code": "TX", "population": 30000000, "densityPerSqMi": 115, "medianAge": 35.4},
            {"code": "CA", "population": 39000000, "densityPerSqMi": 253, "medianAge": 37.3},
        ]),
        "lifestyle": pd.DataFrame([
            {"code": "TX", "politicsLean": 25, "urbanizationPct": 84, "outdoorRecRating": 70, "schoolRating": 60},
            {"code": "CA", "politicsLean": -30, "urbanizationPct": 95, "outdoorRecRating": 85, "schoolRating": 70},
        ]),
    }


def test_join_produces_state_records():
    records = join_sources(_frames(), STATE_NAMES)
    assert len(records) == 2
    tx = next(r for r in records if r["code"] == "TX")
    assert tx["name"] == "Texas"
    assert tx["tax"]["salesRate"] == 0.0625
    assert tx["climate"]["avgTempF"] == 65
    assert tx["col"]["rpp"] == 0.97
    assert tx["demographics"]["population"] == 30000000
    assert tx["lifestyle"]["politicsLean"] == 25


def test_missing_source_raises():
    frames = _frames()
    del frames["climate"]
    with pytest.raises(KeyError):
        join_sources(frames, STATE_NAMES)


def test_unknown_state_code_dropped():
    frames = _frames()
    frames["lifestyle"] = pd.concat([
        frames["lifestyle"],
        pd.DataFrame([{"code": "ZZ", "politicsLean": 0, "urbanizationPct": 0,
                       "outdoorRecRating": 0, "schoolRating": 0}]),
    ], ignore_index=True)
    records = join_sources(frames, STATE_NAMES)
    assert {r["code"] for r in records} == {"TX", "CA"}
