import type { StateRecord } from "../data/state.schema";
import type { Profile } from "../data/profile.schema";

export function effectiveIncomeTax(state: StateRecord, profile: Profile): number {
  const brackets = state.tax.incomeBrackets
    .filter((b) => b.filingStatus === profile.income.filingStatus)
    .sort((a, b) => a.thresholdUsd - b.thresholdUsd);
  if (brackets.length === 0) return 0;

  const income = profile.income.grossUsd;
  let owed = 0;
  for (let i = 0; i < brackets.length; i++) {
    const lower = brackets[i].thresholdUsd;
    const upper = i + 1 < brackets.length ? brackets[i + 1].thresholdUsd : Infinity;
    if (income <= lower) break;
    const slice = Math.min(income, upper) - lower;
    owed += slice * (brackets[i].rateBps / 10000);
  }
  return owed;
}

export function propertyTaxOwed(state: StateRecord, profile: Profile): number {
  if (profile.housing.mode !== "own") return 0;
  const price = profile.housing.homePriceUsd ?? 0;
  return state.tax.effectivePropertyRate * price;
}

export function salesTaxOwed(state: StateRecord, profile: Profile): number {
  return (state.tax.salesRate + state.tax.avgLocalSalesRate) * profile.spending.taxableAnnualUsd;
}

export function totalTaxBurden(state: StateRecord, profile: Profile): number {
  return effectiveIncomeTax(state, profile) + propertyTaxOwed(state, profile) + salesTaxOwed(state, profile);
}

export function colAdjustedIncome(state: StateRecord, profile: Profile): number {
  return (profile.income.grossUsd - totalTaxBurden(state, profile)) / state.col.rpp;
}
