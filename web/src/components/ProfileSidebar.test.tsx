import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileSidebar } from "./ProfileSidebar";
import { useProfileStore } from "../profile/store";
import { DEFAULT_PROFILE } from "../profile/defaults";

describe("ProfileSidebar", () => {
  it("renders income field with current value", () => {
    useProfileStore.setState({ profile: DEFAULT_PROFILE });
    render(<ProfileSidebar />);
    const input = screen.getByLabelText(/gross income/i) as HTMLInputElement;
    expect(input.value).toBe(String(DEFAULT_PROFILE.income.grossUsd));
  });

  it("updates store on input change", () => {
    useProfileStore.setState({ profile: DEFAULT_PROFILE });
    render(<ProfileSidebar />);
    const input = screen.getByLabelText(/gross income/i);
    fireEvent.change(input, { target: { value: "200000" } });
    expect(useProfileStore.getState().profile.income.grossUsd).toBe(200000);
  });
});
