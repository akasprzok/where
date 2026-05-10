import { z } from "zod";

export const FilingStatus = z.enum(["single", "married", "hoh"]);

export const IncomeBracket = z.object({
  filingStatus: FilingStatus,
  rateBps: z.number().int().min(0).max(10000),
  thresholdUsd: z.number().int().min(0),
});

export const StateRecord = z.object({
  code: z.string().regex(/^[A-Z]{2}$/),
  name: z.string(),
  tax: z.object({
    incomeBrackets: z.array(IncomeBracket),
    salesRate: z.number().min(0).max(0.2),
    avgLocalSalesRate: z.number().min(0).max(0.1),
    effectivePropertyRate: z.number().min(0).max(0.05),
  }),
  climate: z.object({
    avgTempF: z.number(),
    sunDaysPerYear: z.number().int().min(0).max(366),
    snowDaysPerYear: z.number().int().min(0).max(366),
    humidityAvgPct: z.number().min(0).max(100),
  }),
  col: z.object({ rpp: z.number().min(0.5).max(2.0) }),
  demographics: z.object({
    population: z.number().int().min(0),
    densityPerSqMi: z.number().min(0),
    medianAge: z.number().min(0).max(120),
  }),
  lifestyle: z.object({
    politicsLean: z.number().min(-100).max(100),
    urbanizationPct: z.number().min(0).max(100),
    outdoorRecRating: z.number().int().min(0).max(100),
    schoolRating: z.number().int().min(0).max(100),
  }),
});

export type StateRecord = z.infer<typeof StateRecord>;
export type FilingStatus = z.infer<typeof FilingStatus>;
