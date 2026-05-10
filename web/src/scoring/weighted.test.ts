import { describe, expect, it } from "vitest";
import { TX, CA } from "../data/fixtures";
import { computeWeighted } from "./weighted";
import type { Profile } from "../data/profile.schema";

const profile: Profile = {
  income: { grossUsd: 150000, filingStatus: "single", dependents: 0 },
  housing: { mode: "own", homePriceUsd: 200000 },
  spending: { taxableAnnualUsd: 30000 },
  climate: { idealTempF: 65, sunDaysImportance: 0.7, snowTolerance: 0.3, humidityTolerance: 0.4 },
  lifestyle: { politicsLeanIdeal: 0, urbanIdealPct: 70, outdoorRecImportance: 0.8, schoolImportance: 0.4 },
  weights: { money: 0.5, climate: 0.3, lifestyle: 0.2 },
};

describe("computeWeighted", () => {
  it("returns one entry per state", () => {
    const out = computeWeighted([TX, CA], profile);
    expect(out).toHaveLength(2);
    expect(out.map((r) => r.code).sort()).toEqual(["CA", "TX"]);
  });

  it("includes money/climate/lifestyle subscores 0..100", () => {
    const [tx] = computeWeighted([TX, CA], profile);
    for (const k of ["moneyScore", "climateScore", "lifestyleScore", "weightedScore"] as const) {
      expect(tx[k]).toBeGreaterThanOrEqual(0);
      expect(tx[k]).toBeLessThanOrEqual(100);
    }
  });

  it("respects weights — weights {money:1, others:0} → weightedScore == moneyScore", () => {
    const out = computeWeighted([TX, CA], { ...profile, weights: { money: 1, climate: 0, lifestyle: 0 } });
    out.forEach((r) => expect(r.weightedScore).toBeCloseTo(r.moneyScore, 6));
  });

  it("min-max normalizes money: lower burden → higher money score", () => {
    const out = computeWeighted([TX, CA], profile);
    const tx = out.find((r) => r.code === "TX")!;
    const ca = out.find((r) => r.code === "CA")!;
    // TX has no income tax, lower property + similar sales; CA has income tax. TX should score higher.
    expect(tx.moneyScore).toBeGreaterThan(ca.moneyScore);
  });
});
