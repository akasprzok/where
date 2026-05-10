import type { StateRecord } from "../data/state.schema";
import type { Profile } from "../data/profile.schema";
import { totalTaxBurden, effectiveIncomeTax, propertyTaxOwed, salesTaxOwed, colAdjustedIncome } from "./money";
import { climateScore } from "./climate";
import { lifestyleScore } from "./lifestyle";

export interface ScoredRow {
  code: string;
  effectiveIncomeTax: number;
  propertyTaxOwed: number;
  salesTaxOwed: number;
  totalTaxBurden: number;
  colAdjustedIncome: number;
  moneyScore: number;
  climateScore: number;
  lifestyleScore: number;
  weightedScore: number;
}

function normalizeMoney(burdens: number[]): number[] {
  const min = Math.min(...burdens);
  const max = Math.max(...burdens);
  if (max === min) return burdens.map(() => 100);
  return burdens.map((b) => ((max - b) / (max - min)) * 100);
}

export function computeWeighted(states: StateRecord[], profile: Profile): ScoredRow[] {
  const burdens = states.map((s) => totalTaxBurden(s, profile));
  const moneyScores = normalizeMoney(burdens);

  return states.map((s, i) => {
    const climate = climateScore(s, profile);
    const lifestyle = lifestyleScore(s, profile);
    const money = moneyScores[i];

    const w = profile.weights;
    const wSum = w.money + w.climate + w.lifestyle || 1;
    const weighted = (money * w.money + climate * w.climate + lifestyle * w.lifestyle) / wSum;

    return {
      code: s.code,
      effectiveIncomeTax: effectiveIncomeTax(s, profile),
      propertyTaxOwed: propertyTaxOwed(s, profile),
      salesTaxOwed: salesTaxOwed(s, profile),
      totalTaxBurden: burdens[i],
      colAdjustedIncome: colAdjustedIncome(s, profile),
      moneyScore: money,
      climateScore: climate,
      lifestyleScore: lifestyle,
      weightedScore: weighted,
    };
  });
}
