# data/manual/

Vendored per-state inputs for the ETL. Each CSV has one row per USPS code,
exactly the 50 US states (no DC, no territories).

## Files

| File | Purpose |
|------|---------|
| `tax_foundation.csv` | Sales rate (state + local), effective property rate, single-filer income brackets. |
| `climate.csv` | Annual temperature, sun days, snow days, humidity. |
| `rpp.csv` | BEA Regional Price Parities (all items), decimal. |
| `demographics.csv` | Population, density, median age. |
| `lifestyle.csv` | Derived ratings: politicsLean, urbanizationPct, outdoorRecRating, schoolRating. |
| `lifestyle_sources.csv` | Audit trail of the inputs that derive `lifestyle.csv`. |
| `sources.yaml` | Citations: source name, URL, vintage, date pulled. |

## Lifestyle derivation

Subjective lifestyle fields are not hand-rated. They are derived from
cited proxy datasets and stored as integers.

### politicsLean ∈ [-100, 100]

Signed Cook PVI. `R+N` → `+N`, `D+N` → `-N`, `EVEN` → `0`. Clamped to `[-100, 100]`.

Source: Cook Political Report PVI 2023 cycle.

### urbanizationPct ∈ [0, 100]

Census 2020 urban-area population share, %, rounded to whole number.

### outdoorRecRating ∈ [0, 100]

```
m1 = max(publicLandPct over all 50 states)
m2 = max(npsUnits over all 50 states)
outdoorRecRating_i = round(50 * (publicLandPct_i / m1)
                         + 50 * (npsUnits_i / m2))
```

Sources: USGS PAD-US 3.0 (public-land percent); NPS 2024 unit counts.

### schoolRating ∈ [0, 100]

```
composite_i = naepMath8_i + naepRead8_i
schoolRating_i = round(100 * (composite_i - min(composite))
                            / (max(composite) - min(composite)))
```

Source: NAEP 2024 Grade-8 Math + Reading state mean scale scores.

### Rebuild

To regenerate `lifestyle.csv` after editing `lifestyle_sources.csv`,
re-run the derivation logic in the implementation plan
(`docs/superpowers/plans/2026-05-10-fill-50-states.md`, Task 8).
