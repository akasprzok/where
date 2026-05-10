import { describe, expect, it } from "vitest";
import { TX, CA } from "../data/fixtures";
import { lifestyleScore } from "./lifestyle";
import type { Profile } from "../data/profile.schema";

function profileWith(lifestyle: Profile["lifestyle"]): Profile {
  return {
    income: { grossUsd: 100000, filingStatus: "single", dependents: 0 },
    housing: { mode: "rent", rentMonthlyUsd: 2000 },
    spending: { taxableAnnualUsd: 25000 },
    climate: { idealTempF: 65, sunDaysImportance: 0.5, snowTolerance: 0.5, humidityTolerance: 0.5 },
    lifestyle,
    weights: { money: 0.5, climate: 0.3, lifestyle: 0.2 },
  };
}

describe("lifestyleScore", () => {
  it("rewards politics match", () => {
    const wantsRight = profileWith({
      politicsLeanIdeal: 25, urbanIdealPct: 84, outdoorRecImportance: 0, schoolImportance: 0,
    });
    expect(lifestyleScore(TX, wantsRight)).toBeGreaterThan(lifestyleScore(CA, wantsRight));
  });

  it("ranges 0..100", () => {
    const p = profileWith({
      politicsLeanIdeal: 0, urbanIdealPct: 50, outdoorRecImportance: 0.5, schoolImportance: 0.5,
    });
    const s = lifestyleScore(TX, p);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
  });
});
