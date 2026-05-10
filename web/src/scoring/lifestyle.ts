import type { StateRecord } from "../data/state.schema";
import type { Profile } from "../data/profile.schema";

export function lifestyleScore(state: StateRecord, profile: Profile): number {
  const l = profile.lifestyle;
  const politicsScore = (1 - Math.abs(state.lifestyle.politicsLean - l.politicsLeanIdeal) / 200) * 100;
  const urbanScore = (1 - Math.abs(state.lifestyle.urbanizationPct - l.urbanIdealPct) / 100) * 100;
  const outdoorScore = state.lifestyle.outdoorRecRating;
  const schoolScore = state.lifestyle.schoolRating;

  const weights = [1, 1, l.outdoorRecImportance, l.schoolImportance];
  const scores = [politicsScore, urbanScore, outdoorScore, schoolScore];
  const wSum = weights.reduce((a, b) => a + b, 0) || 1;
  return scores.reduce((acc, s, i) => acc + (s * weights[i]) / wSum, 0);
}
