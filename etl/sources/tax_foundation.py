"""Tax Foundation source — vendored annual CSV."""
from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

CSV = Path(__file__).resolve().parent.parent.parent / "data" / "manual" / "tax_foundation.csv"


def fetch() -> pd.DataFrame:
    df = pd.read_csv(CSV)
    df["incomeBrackets"] = df["incomeBracketsJson"].apply(json.loads)
    return df.drop(columns=["incomeBracketsJson"])
