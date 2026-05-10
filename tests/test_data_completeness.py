"""Strict-equality completeness tests: all data files cover exactly the 50 US states."""
from __future__ import annotations

import json
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
