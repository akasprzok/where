import { describe, expect, it } from "vitest";
import { TX, CA } from "../data/fixtures";
import { effectiveIncomeTax, propertyTaxOwed, salesTaxOwed, totalTaxBurden, colAdjustedIncome } from "./money";
import type { Profile } from "../data/profile.schema";

const baseProfile: Profile = {
  income: { grossUsd: 150000, filingStatus: "single", dependents: 0 },
  housing: { mode: "own", homePriceUsd: 500000 },
  spending: { taxableAnnualUsd: 30000 },
  climate: { idealTempF: 65, sunDaysImportance: 0.5, snowTolerance: 0.5, humidityTolerance: 0.5 },
  lifestyle: { politicsLeanIdeal: 0, urbanIdealPct: 50, outdoorRecImportance: 0.5, schoolImportance: 0.5 },
  weights: { money: 0.5, climate: 0.3, lifestyle: 0.2 },
};

describe("effectiveIncomeTax", () => {
  it("returns 0 for state with no brackets (TX)", () => {
    expect(effectiveIncomeTax(TX, baseProfile)).toBe(0);
  });

  it("applies progressive brackets (CA single, $150k)", () => {
    // Brackets: 1% on [0, 10412), 2% on [10412, 1M), 13.3% on [1M, ...)
    // 150_000: 10412*0.01 + (150000-10412)*0.02 = 104.12 + 2791.76 = 2895.88
    const tax = effectiveIncomeTax(CA, baseProfile);
    expect(tax).toBeCloseTo(2895.88, 2);
  });

  it("filters brackets by filing status", () => {
    const married = { ...baseProfile, income: { ...baseProfile.income, filingStatus: "married" as const } };
    // No "married" brackets in CA fixture → 0.
    expect(effectiveIncomeTax(CA, married)).toBe(0);
  });
});

describe("propertyTaxOwed", () => {
  it("rate × home price for owners", () => {
    expect(propertyTaxOwed(TX, baseProfile)).toBeCloseTo(0.0181 * 500000, 2);
  });

  it("0 for renters", () => {
    const renter = { ...baseProfile, housing: { mode: "rent" as const, rentMonthlyUsd: 2000 } };
    expect(propertyTaxOwed(TX, renter)).toBe(0);
  });
});

describe("salesTaxOwed", () => {
  it("(state + local) × spending", () => {
    const expected = (0.0625 + 0.0194) * 30000;
    expect(salesTaxOwed(TX, baseProfile)).toBeCloseTo(expected, 2);
  });
});

describe("totalTaxBurden", () => {
  it("sums income + property + sales", () => {
    const total = totalTaxBurden(TX, baseProfile);
    expect(total).toBeCloseTo(0 + 0.0181 * 500000 + (0.0625 + 0.0194) * 30000, 2);
  });
});

describe("colAdjustedIncome", () => {
  it("(income - burden) / rpp", () => {
    const burden = totalTaxBurden(TX, baseProfile);
    expect(colAdjustedIncome(TX, baseProfile)).toBeCloseTo((150000 - burden) / 0.97, 2);
  });
});
