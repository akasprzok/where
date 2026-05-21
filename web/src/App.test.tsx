import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { App } from "./App";
import { TX, CA } from "./data/fixtures";

function mockFetch() {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => [TX, CA],
  } as Response);
}

describe("App", () => {
  it("loads states and renders matrix", async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => expect(screen.getByText("Texas")).toBeInTheDocument());
  });

  it("opens detail drawer on row click", async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => expect(screen.getByText("Texas")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Texas"));
    expect(screen.getByRole("heading", { name: "Texas", level: 2 })).toBeInTheDocument();
  });

  it("closes detail drawer when close button clicked", async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => expect(screen.getByText("Texas")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Texas"));
    expect(screen.getByRole("heading", { name: "Texas", level: 2 })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "close" }));
    expect(screen.queryByRole("heading", { name: "Texas", level: 2 })).not.toBeInTheDocument();
  });

  it("swaps detail when a different row is clicked", async () => {
    mockFetch();
    render(<App />);
    await waitFor(() => expect(screen.getByText("Texas")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Texas"));
    expect(screen.getByRole("heading", { name: "Texas", level: 2 })).toBeInTheDocument();
    fireEvent.click(screen.getByText("California"));
    expect(screen.getByRole("heading", { name: "California", level: 2 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Texas", level: 2 })).not.toBeInTheDocument();
  });
});
