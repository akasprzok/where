import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Matrix } from "./Matrix";
import { TX, CA, PROFILE_FIXTURE } from "../data/fixtures";

describe("Matrix", () => {
  it("renders a row per state", () => {
    render(<Matrix states={[TX, CA]} profile={PROFILE_FIXTURE} />);
    expect(screen.getByText("Texas")).toBeInTheDocument();
    expect(screen.getByText("California")).toBeInTheDocument();
  });

  it("renders weighted score column", () => {
    render(<Matrix states={[TX, CA]} profile={PROFILE_FIXTURE} />);
    expect(screen.getByText(/weighted/i)).toBeInTheDocument();
  });
});
