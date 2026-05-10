import { describe, expect, it } from "vitest";
import { TX, CA } from "../data/fixtures";
import { climateScore } from "./climate";
import type { Profile } from "../data/profile.schema";

const idealTexas: Profile["climate"] = {
  idealTempF: 65, sunDaysImportance: 1, snowTolerance: 1, humidityTolerance: 1,
};

describe("climateScore", () => {
  it("perfect match scores ~100", () => {
    expect(climateScore(TX, { ...basePrefs(), climate: idealTexas })).toBeGreaterThan(95);
  });

  it("differs from ideal yields lower score", () => {
    const tx = climateScore(TX, { ...basePrefs(), climate: idealTexas });
    const ca = climateScore(CA, { ...basePrefs(), climate: idealTexas });
    expect(tx).toBeGreaterThan(ca);
  });

  it("ranges 0..100", () => {
    const score = climateScore(TX, { ...basePrefs(), climate: idealTexas });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

function basePrefs(): Profile {
  return {
    income: { grossUsd: 100000, filingStatus: "single", dependents: 0 },
    housing: { mode: "rent", rentMonthlyUsd: 2000 },
    spending: { taxableAnnualUsd: 25000 },
    climate: { idealTempF: 65, sunDaysImportance: 0.5, snowTolerance: 0.5, humidityTolerance: 0.5 },
    lifestyle: { politicsLeanIdeal: 0, urbanIdealPct: 50, outdoorRecImportance: 0.5, schoolImportance: 0.5 },
    weights: { money: 0.5, climate: 0.3, lifestyle: 0.2 },
  };
}
