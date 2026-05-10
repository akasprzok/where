import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { App } from "./App";
import { TX, CA } from "./data/fixtures";

describe("App", () => {
  it("loads states and renders matrix", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [TX, CA],
    } as Response);
    render(<App />);
    await waitFor(() => expect(screen.getByText("Texas")).toBeInTheDocument());
  });
});
