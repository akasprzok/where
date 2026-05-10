import json
from pathlib import Path
import pytest
from etl.validate import validate_states

REPO = Path(__file__).resolve().parent.parent.parent


@pytest.mark.parametrize("path", [
    REPO / "data" / "states.json",
    REPO / "data" / "states.golden.json",
])
def test_data_matches_schema(path: Path):
    records = json.loads(path.read_text())
    validate_states(records)


def test_golden_keys_match_current_keys():
    current = json.loads((REPO / "data" / "states.json").read_text())
    golden = json.loads((REPO / "data" / "states.golden.json").read_text())
    assert sorted(r["code"] for r in current) == sorted(r["code"] for r in golden)
