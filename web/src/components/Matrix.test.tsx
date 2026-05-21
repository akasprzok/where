import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it("invokes onRowClick with state code when row clicked", () => {
    const onRowClick = vi.fn();
    render(<Matrix states={[TX, CA]} profile={PROFILE_FIXTURE} onRowClick={onRowClick} />);
    fireEvent.click(screen.getByText("Texas"));
    expect(onRowClick).toHaveBeenCalledWith("TX");
  });
});
