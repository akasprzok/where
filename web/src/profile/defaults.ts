import type { Profile } from "../data/profile.schema";

export const DEFAULT_PROFILE: Profile = {
  income: { grossUsd: 100000, filingStatus: "single", dependents: 0 },
  housing: { mode: "rent", rentMonthlyUsd: 2000 },
  spending: { taxableAnnualUsd: 25000 },
  climate: { idealTempF: 65, sunDaysImportance: 0.5, snowTolerance: 0.5, humidityTolerance: 0.5 },
  lifestyle: { politicsLeanIdeal: 0, urbanIdealPct: 50, outdoorRecImportance: 0.5, schoolImportance: 0.5 },
  weights: { money: 0.5, climate: 0.3, lifestyle: 0.2 },
};
