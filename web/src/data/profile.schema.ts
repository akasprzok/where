import { z } from "zod";
import { FilingStatus } from "./state.schema";

export const Profile = z.object({
  income: z.object({
    grossUsd: z.number().int().min(0),
    filingStatus: FilingStatus,
    dependents: z.number().int().min(0).default(0),
  }),
  housing: z.object({
    mode: z.enum(["own", "rent"]),
    homePriceUsd: z.number().int().min(0).optional(),
    rentMonthlyUsd: z.number().int().min(0).optional(),
  }),
  spending: z.object({
    taxableAnnualUsd: z.number().int().min(0),
  }),
  climate: z.object({
    idealTempF: z.number(),
    sunDaysImportance: z.number().min(0).max(1),
    snowTolerance: z.number().min(0).max(1),
    humidityTolerance: z.number().min(0).max(1),
  }),
  lifestyle: z.object({
    politicsLeanIdeal: z.number().min(-100).max(100),
    urbanIdealPct: z.number().min(0).max(100),
    outdoorRecImportance: z.number().min(0).max(1),
    schoolImportance: z.number().min(0).max(1),
  }),
  weights: z.object({
    money: z.number().min(0).max(1),
    climate: z.number().min(0).max(1),
    lifestyle: z.number().min(0).max(1),
  }),
});

export type Profile = z.infer<typeof Profile>;
