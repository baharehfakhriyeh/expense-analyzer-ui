import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpenseFormDialog from "./ExpenseFormDialog";
import type { ExpenseDraft } from "../types/expense";
import { sampleDraft } from "../../../test/fixtures";
import type { Category } from "../../categories/types/category";

const categories: Category[] = [
  { id: 1, name: "food" },
  { id: 2, name: "dining" },
];

function FormHarness({
  onSubmit,
}: {
  onSubmit: (draft: ExpenseDraft) => void;
}) {
  const [draft, setDraft] = useState(sampleDraft);
  return (
    <ExpenseFormDialog
      mode="create"
      draft={draft}
      categories={categories}
      categoriesLoading={false}
      saving={false}
      onChange={setDraft}
      onClose={vi.fn()}
      onSubmit={onSubmit}
    />
  );
}

describe("ExpenseFormDialog", () => {
  it("shows the supported currency and payer options", () => {
    render(<FormHarness onSubmit={vi.fn()} />);
    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["AMD", "USD", "EUR", "IRR", "User1", "User2"]);
  });

  it("submits the entered expense fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormHarness onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Coffee");
    await user.clear(screen.getByLabelText("Amount"));
    await user.type(screen.getByLabelText("Amount"), "12.50");
    await user.selectOptions(screen.getByLabelText("Currency"), "EUR");
    await user.selectOptions(screen.getByLabelText("Category"), "2");
    await user.selectOptions(screen.getByLabelText("Paid by"), "2");
    await user.click(screen.getByRole("button", { name: "Save expense" }));

    expect(onSubmit).toHaveBeenCalledWith({
      ...sampleDraft,
      description: "Coffee",
      amount: 12.5,
      currency: "EUR",
      categoryId: 2,
      paidBy: 2,
    });
  });

  it("marks required fields as required", () => {
    render(<FormHarness onSubmit={vi.fn()} />);
    expect(screen.getByLabelText("Description")).not.toBeRequired();
    expect(screen.getByLabelText("Amount")).toBeRequired();
    expect(screen.getByLabelText("Date")).toBeRequired();
    expect(screen.getByLabelText("Category")).toBeRequired();
  });
});
