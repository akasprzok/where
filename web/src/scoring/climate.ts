import type { StateRecord } from "../data/state.schema";
import type { Profile } from "../data/profile.schema";

const TEMP_RANGE = 50; // °F deviation that maps to 0
const SUN_MAX = 250; // sunny-days reference: "fully sunny" US state
const SNOW_MAX = 200;
const HUMID_MAX = 100;

export function climateScore(state: StateRecord, profile: Profile): number {
  const c = profile.climate;
  const tempPenalty = Math.min(Math.abs(state.climate.avgTempF - c.idealTempF) / TEMP_RANGE, 1);
  const tempScore = (1 - tempPenalty) * 100;

  // Higher sunDaysImportance → reward sunnier states.
  const sunScore = Math.min(state.climate.sunDaysPerYear / SUN_MAX, 1) * 100;
  // Higher snowTolerance means snow doesn't penalize. tolerance=0 → max snow = 0 score.
  const snowPenalty = (1 - c.snowTolerance) * Math.min(state.climate.snowDaysPerYear / SNOW_MAX, 1);
  const snowScore = (1 - snowPenalty) * 100;
  // humidityTolerance: 1 → penalty zeroed; 0 → full penalty if humid.
  const humidPenalty = (1 - c.humidityTolerance) * (state.climate.humidityAvgPct / HUMID_MAX);
  const humidScore = (1 - humidPenalty) * 100;

  const weights = [1, c.sunDaysImportance, 1, 1];
  const scores = [tempScore, sunScore, snowScore, humidScore];
  const wSum = weights.reduce((a, b) => a + b, 0);
  return scores.reduce((acc, s, i) => acc + (s * weights[i]) / wSum, 0);
}
