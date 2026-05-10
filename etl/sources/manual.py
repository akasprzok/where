"""Manual CSV source for fields without clean APIs."""
from __future__ import annotations

from pathlib import Path

import pandas as pd

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "manual"


def fetch() -> pd.DataFrame:
    df = pd.read_csv(DATA_DIR / "lifestyle.csv")
    expected = {"code", "politicsLean", "urbanizationPct", "outdoorRecRating", "schoolRating"}
    missing = expected - set(df.columns)
    if missing:
        raise ValueError(f"manual lifestyle.csv missing columns: {missing}")
    return df
