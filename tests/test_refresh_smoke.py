import json
from pathlib import Path

import pytest

from etl.refresh import run


def test_refresh_writes_states_json(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    out = tmp_path / "states.json"
    meta = tmp_path / "states.meta.json"
    exit_code = run(out_path=out, meta_path=meta)
    assert exit_code == 0
    assert out.exists()
    data = json.loads(out.read_text())
    assert isinstance(data, list)
    codes = {r["code"] for r in data}
    assert {"TX", "CA"}.issubset(codes)
    assert meta.exists()
    meta_data = json.loads(meta.read_text())
    assert "refreshedAt" in meta_data
    assert "sources" in meta_data
