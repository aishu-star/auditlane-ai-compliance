import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Auditlane payment flow", () => {
  it("opens checkout and shows the paid customer portal after payment", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /book pilot/i }));

    expect(
      screen.getByRole("heading", { name: /start paid pilot/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /pay \$1,500/i }));

    expect(
      await screen.findByRole("heading", {
        name: /welcome to your auditlane portal/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /what the app looks like after paying/i,
      }),
    ).toBeInTheDocument();
  });

  it("switches between product workspace tabs", async () => {
    const user = userEvent.setup();
    render(<App />);
    const tabs = screen.getByRole("tablist", { name: /workspace view/i });

    await user.click(within(tabs).getByRole("button", { name: /customer roi/i }));

    expect(screen.getByText(/estimated monthly savings/i)).toBeInTheDocument();

    await user.click(within(tabs).getByRole("button", { name: /market os/i }));

    expect(screen.getByText(/charge per packet first/i)).toBeInTheDocument();
  });
});
