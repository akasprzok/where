import json
from pathlib import Path
import pytest
from jsonschema import ValidationError
from etl.validate import validate_state, validate_states


FIXTURES = Path(__file__).parent / "fixtures"


def _load(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text())


def test_valid_record_passes():
    rec = _load("state_record_valid.json")
    validate_state(rec)


def test_missing_required_section_fails():
    rec = _load("state_record_invalid_missing.json")
    with pytest.raises(ValidationError) as exc:
        validate_state(rec)
    assert "climate" in str(exc.value)


def test_validate_states_accepts_list():
    rec = _load("state_record_valid.json")
    validate_states([rec, rec])
