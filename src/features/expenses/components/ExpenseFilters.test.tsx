import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseFilters from "./ExpenseFilters";
import type { ExpenseFilters as Filters } from "../types/expense";
import type { Category } from "../../categories/types/category";

const categories: Category[] = [{ id: 1, name: "food" }, { id: 2, name: "travel" }];
const initialFilters: Filters = { from: "", to: "", categoryId: "", paidBy: "" };

describe("ExpenseFilters", () => {
  it("forwards category ID and payer changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ExpenseFilters
        filters={initialFilters}
        categories={categories}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Filter by category"), "2");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by payer" }),
      "2",
    );

    expect(onChange).toHaveBeenLastCalledWith("paidBy", "2");
    expect(onChange).toHaveBeenCalledWith("categoryId", "2");
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
          categoryId: "1",
          paidBy: "1",
        }}
        categories={categories}
        onChange={vi.fn()}
        onReset={onReset}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
