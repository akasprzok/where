"""BEA Regional Price Parities — vendored CSV."""
from pathlib import Path
import pandas as pd

CSV = Path(__file__).resolve().parent.parent.parent / "data" / "manual" / "rpp.csv"


def fetch() -> pd.DataFrame:
    return pd.read_csv(CSV)
