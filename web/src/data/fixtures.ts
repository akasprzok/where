import type { StateRecord } from "./state.schema";
import type { Profile } from "./profile.schema";

export const TX: StateRecord = {
  code: "TX", name: "Texas",
  tax: { incomeBrackets: [], salesRate: 0.0625, avgLocalSalesRate: 0.0194, effectivePropertyRate: 0.0181 },
  climate: { avgTempF: 65, sunDaysPerYear: 230, snowDaysPerYear: 2, humidityAvgPct: 64 },
  col: { rpp: 0.97 },
  demographics: { population: 30000000, densityPerSqMi: 115, medianAge: 35.4 },
  lifestyle: { politicsLean: 25, urbanizationPct: 84, outdoorRecRating: 70, schoolRating: 60 },
};

export const CA: StateRecord = {
  code: "CA", name: "California",
  tax: {
    incomeBrackets: [
      { filingStatus: "single", rateBps: 100, thresholdUsd: 0 },
      { filingStatus: "single", rateBps: 200, thresholdUsd: 10412 },
      { filingStatus: "single", rateBps: 1330, thresholdUsd: 1000000 },
    ],
    salesRate: 0.0725, avgLocalSalesRate: 0.0131, effectivePropertyRate: 0.0073,
  },
  climate: { avgTempF: 59, sunDaysPerYear: 258, snowDaysPerYear: 1, humidityAvgPct: 61 },
  col: { rpp: 1.13 },
  demographics: { population: 39000000, densityPerSqMi: 253, medianAge: 37.3 },
  lifestyle: { politicsLean: -30, urbanizationPct: 95, outdoorRecRating: 85, schoolRating: 70 },
};

export const PROFILE_FIXTURE: Profile = {
  income: { grossUsd: 150000, filingStatus: "single", dependents: 0 },
  housing: { mode: "own", homePriceUsd: 500000 },
  spending: { taxableAnnualUsd: 30000 },
  climate: { idealTempF: 65, sunDaysImportance: 0.7, snowTolerance: 0.3, humidityTolerance: 0.4 },
  lifestyle: { politicsLeanIdeal: -20, urbanIdealPct: 70, outdoorRecImportance: 0.8, schoolImportance: 0.4 },
  weights: { money: 0.5, climate: 0.3, lifestyle: 0.2 },
};
