"""ETL entrypoint. Pulls all sources, transforms, validates, writes data/states.json."""
from __future__ import annotations

import datetime as dt
import json
import logging
import sys
from pathlib import Path
from typing import Callable

import pandas as pd

from etl.sources import bea_col, census_demographics, manual, noaa_climate, tax_foundation
from etl.state_names import STATE_NAMES
from etl.transform import join_sources
from etl.validate import validate_states

log = logging.getLogger("etl.refresh")

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = REPO_ROOT / "data" / "states.json"
DEFAULT_META = REPO_ROOT / "data" / "states.meta.json"

SOURCES: dict[str, Callable[[], pd.DataFrame]] = {
    "tax_foundation": tax_foundation.fetch,
    "climate": noaa_climate.fetch,
    "rpp": bea_col.fetch,
    "demographics": census_demographics.fetch,
    "lifestyle": manual.fetch,
}

CORE_SOURCE = "tax_foundation"


def _atomic_write(path: Path, payload: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(payload)
    tmp.replace(path)


def run(out_path: Path = DEFAULT_OUT, meta_path: Path = DEFAULT_META) -> int:
    """Run refresh pipeline. Return exit code: 0 ok, 1 partial, 2 core failure."""
    frames: dict[str, pd.DataFrame] = {}
    failures: dict[str, str] = {}
    for name, fetch in SOURCES.items():
        try:
            frames[name] = fetch()
            log.info("source ok: %s rows=%d", name, len(frames[name]))
        except Exception as exc:  # noqa: BLE001
            failures[name] = repr(exc)
            log.warning("source FAIL: %s: %s", name, exc)

    if CORE_SOURCE in failures:
        log.error("core source %s failed; aborting write", CORE_SOURCE)
        return 2

    records = join_sources(frames, STATE_NAMES)
    validate_states(records)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    _atomic_write(out_path, json.dumps(records, indent=2, sort_keys=True))
    _atomic_write(
        meta_path,
        json.dumps({
            "refreshedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
            "sources": {n: ("ok" if n in frames else f"fail: {failures[n]}") for n in SOURCES},
            "stateCount": len(records),
        }, indent=2, sort_keys=True),
    )
    return 1 if failures else 0


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    return run()


if __name__ == "__main__":
    sys.exit(main())
