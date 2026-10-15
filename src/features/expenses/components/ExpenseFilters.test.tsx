import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseFilters from "./ExpenseFilters";
import type { ExpenseFilters as Filters } from "../types/expense";

const initialFilters: Filters = { from: "", to: "", category: "", paidBy: "" };

describe("ExpenseFilters", () => {
  it("forwards category, date, and payer changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExpenseFilters
        filters={initialFilters}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: "Filter category" }),
      "Food",
    );
    await user.type(screen.getByLabelText("From date"), "2026-10-01");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by payer" }),
      "2",
    );

    expect(onChange).toHaveBeenLastCalledWith("paidBy", "2");
    expect(onChange).toHaveBeenCalledWith("category", "F");
    expect(onChange).toHaveBeenCalledWith("from", "2026-10-01");
    expect(onChange).toHaveBeenCalledWith("paidBy", "2");
  });

  it("offers reset for all active filters", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <ExpenseFilters
        filters={{
          from: "2026-10-01",
          to: "2026-10-31",
          category: "Food",
          paidBy: "1",
        }}
        onChange={vi.fn()}
        onReset={onReset}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
