"""Every schema leaf field must be cited in data/manual/sources.yaml."""
from __future__ import annotations

import json
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMA_PATH = REPO_ROOT / "schema" / "state.schema.json"
SOURCES_PATH = REPO_ROOT / "data" / "manual" / "sources.yaml"

NON_DATA_FIELDS = {"code", "name"}


def _leaf_fields(schema: dict) -> set[str]:
    """Collect leaf field names from one level of nested objects under state.schema.json."""
    out: set[str] = set()
    for name, sub in schema["properties"].items():
        if name in NON_DATA_FIELDS:
            continue
        if sub.get("type") == "object":
            out.update(sub["properties"].keys())
        else:
            out.add(name)
    return out


def test_every_schema_field_has_a_source():
    schema = json.loads(SCHEMA_PATH.read_text())
    sources = yaml.safe_load(SOURCES_PATH.read_text())
    cited: set[str] = set()
    for entry in sources:
        cited.update(entry.get("fields", []))
    expected = _leaf_fields(schema)
    missing = expected - cited
    assert not missing, f"schema fields without a citation: {sorted(missing)}"


def test_sources_yaml_entries_well_formed():
    sources = yaml.safe_load(SOURCES_PATH.read_text())
    required = {"id", "name", "url", "vintage", "pulled", "fields"}
    seen_ids: set[str] = set()
    for entry in sources:
        missing = required - set(entry)
        assert not missing, f"entry missing keys: {missing} in {entry}"
        assert entry["id"] not in seen_ids, f"duplicate id: {entry['id']}"
        seen_ids.add(entry["id"])
        assert isinstance(entry["fields"], list) and entry["fields"], f"empty fields: {entry['id']}"
