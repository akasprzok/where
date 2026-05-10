import { describe, expect, it } from "vitest";
import { parseStates } from "./states";
import { TX, CA } from "./fixtures";

describe("parseStates", () => {
  it("accepts valid records", () => {
    const result = parseStates([TX, CA]);
    expect(result.map((r) => r.code)).toEqual(["TX", "CA"]);
  });

  it("throws on bad data", () => {
    expect(() => parseStates([{ ...TX, code: "Texas" }])).toThrow();
  });
});
