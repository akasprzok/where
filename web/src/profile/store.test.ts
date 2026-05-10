import { describe, expect, it, beforeEach } from "vitest";
import { useProfileStore, STORAGE_KEY } from "./store";
import { DEFAULT_PROFILE } from "./defaults";

describe("profile store", () => {
  beforeEach(() => {
    localStorage.clear();
    useProfileStore.setState({ profile: DEFAULT_PROFILE });
  });

  it("starts with defaults", () => {
    expect(useProfileStore.getState().profile).toEqual(DEFAULT_PROFILE);
  });

  it("setProfile replaces and persists", () => {
    const next = { ...DEFAULT_PROFILE, income: { ...DEFAULT_PROFILE.income, grossUsd: 200000 } };
    useProfileStore.getState().setProfile(next);
    expect(useProfileStore.getState().profile.income.grossUsd).toBe(200000);
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(persisted.income.grossUsd).toBe(200000);
  });

  it("update merges shallow section", () => {
    useProfileStore.getState().updateSection("income", { grossUsd: 175000 });
    expect(useProfileStore.getState().profile.income.grossUsd).toBe(175000);
    expect(useProfileStore.getState().profile.income.filingStatus).toBe("single");
  });
});
