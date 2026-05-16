"""Strict-equality completeness tests: all data files cover exactly the 50 US states."""
from __future__ import annotations

import json as _json
from pathlib import Path

import pandas as pd
import pytest

from etl.state_names import STATE_NAMES

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_MANUAL = REPO_ROOT / "data" / "manual"

USPS_50 = frozenset({
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
    "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
    "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
    "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
    "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
})

NO_INCOME_TAX = frozenset({"AK","FL","NH","NV","SD","TN","TX","WA","WY"})


def test_state_names_covers_50_states():
    assert set(STATE_NAMES.keys()) == USPS_50
    assert len(STATE_NAMES) == 50
    for code, name in STATE_NAMES.items():
        assert isinstance(name, str) and name, f"{code} has empty name"


SCHEMA_CSVS = [
    "tax_foundation.csv",
    "climate.csv",
    "rpp.csv",
    "demographics.csv",
    "lifestyle.csv",
]


@pytest.mark.parametrize("filename", SCHEMA_CSVS)
def test_csv_covers_50_states(filename: str):
    df = pd.read_csv(DATA_MANUAL / filename)
    assert "code" in df.columns, f"{filename} missing 'code' column"
    assert len(df) == 50, f"{filename} has {len(df)} rows, expected 50"
    assert set(df["code"]) == USPS_50, f"{filename} codes != USPS_50"


def test_lifestyle_sources_covers_50_states():
    df = pd.read_csv(DATA_MANUAL / "lifestyle_sources.csv")
    expected_cols = {"code", "cookPVI", "publicLandPct", "npsUnits", "naepMath8", "naepRead8"}
    assert expected_cols.issubset(set(df.columns)), f"missing cols: {expected_cols - set(df.columns)}"
    assert len(df) == 50
    assert set(df["code"]) == USPS_50


@pytest.mark.parametrize("code", sorted(NO_INCOME_TAX))
def test_no_income_tax_states_have_empty_brackets(code: str):
    df = pd.read_csv(DATA_MANUAL / "tax_foundation.csv").set_index("code")
    raw = df.at[code, "incomeBracketsJson"]
    parsed = _json.loads(raw)
    assert parsed == [], f"{code} should have empty income brackets, got {parsed}"
