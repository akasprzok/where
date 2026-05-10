import { describe, expect, it } from "vitest";
import { profileToYaml, yamlToProfile } from "./yaml";
import { DEFAULT_PROFILE } from "./defaults";

describe("yaml roundtrip", () => {
  it("encodes and parses back", () => {
    const yaml = profileToYaml(DEFAULT_PROFILE);
    expect(yamlToProfile(yaml)).toEqual(DEFAULT_PROFILE);
  });

  it("rejects malformed yaml", () => {
    expect(() => yamlToProfile("not: a: profile")).toThrow();
  });
});
