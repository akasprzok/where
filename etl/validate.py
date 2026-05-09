"""JSON schema validation for emitted StateRecords."""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from jsonschema import Draft7Validator

SCHEMA_DIR = Path(__file__).resolve().parent.parent / "schema"


@lru_cache(maxsize=1)
def _state_validator() -> Draft7Validator:
    schema = json.loads((SCHEMA_DIR / "state.schema.json").read_text())
    Draft7Validator.check_schema(schema)
    return Draft7Validator(schema)


def validate_state(record: dict[str, Any]) -> None:
    """Raise jsonschema.ValidationError if record does not match schema."""
    _state_validator().validate(record)


def validate_states(records: list[dict[str, Any]]) -> None:
    for rec in records:
        validate_state(rec)
