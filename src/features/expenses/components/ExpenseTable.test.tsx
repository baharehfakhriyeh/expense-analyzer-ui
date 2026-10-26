import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseTable from "./ExpenseTable";
import { expensePage, sampleExpense } from "../../../test/fixtures";

describe("ExpenseTable", () => {
  it("shows a loading state", () => {
    render(
      <ExpenseTable
        page={null}
        expenses={[]}
        loading
        pageIndex={0}
        sort="expenseDate,desc"
        onSortChange={vi.fn()}
        onPageChange={vi.fn()}
        onCreate={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText(/Getting your transactions/)).toBeInTheDocument();
  });

  it("shows an empty state and lets the user start creating an expense", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <ExpenseTable
        page={expensePage([])}
        expenses={[]}
        loading={false}
        pageIndex={0}
        sort="expenseDate,desc"
        onSortChange={vi.fn()}
        onPageChange={vi.fn()}
        onCreate={onCreate}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("No transactions match")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add expense" }));
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it("renders a record and delegates edit, delete, sorting, and pagination", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onSortChange = vi.fn();
    const onPageChange = vi.fn();
    render(
      <ExpenseTable
        page={{ ...expensePage(), first: true, last: false, totalPages: 2 }}
        expenses={[sampleExpense]}
        loading={false}
        pageIndex={0}
        sort="expenseDate,desc"
        onSortChange={onSortChange}
        onPageChange={onPageChange}
        onCreate={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("Weekly groceries")).toBeInTheDocument();
    expect(screen.getByText("food")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Edit Weekly groceries" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Delete Weekly groceries" }),
    );
    await user.click(screen.getByRole("button", { name: /AMOUNT/ }));
    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(onEdit).toHaveBeenCalledWith(sampleExpense);
    expect(onDelete).toHaveBeenCalledWith(sampleExpense);
    expect(onSortChange).toHaveBeenCalledWith("amount,desc");
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
