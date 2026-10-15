import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "./DashboardPage";
import { server } from "../../test/server";
import { expensePage, sampleExpense } from "../../test/fixtures";
import type {
  Expense,
  ExpenseDraft,
} from "../../features/expenses/types/expense";

const endpoint = "http://localhost/api/v1/expenses";

function mockExpenseApi(seed: Expense[] = [sampleExpense]) {
  let records = [...seed];
  let nextId = Math.max(0, ...records.map((expense) => expense.id)) + 1;

  server.use(
    http.get(endpoint, () => HttpResponse.json(expensePage(records))),
    http.post(endpoint, async ({ request }) => {
      const draft = (await request.json()) as ExpenseDraft;
      const now = "2026-10-15T10:00:00Z";
      const created: Expense = {
        ...draft,
        description: draft.description ?? null,
        id: nextId++,
        createdAt: now,
        updatedAt: now,
      };
      records = [created, ...records];
      return HttpResponse.json(created, { status: 201 });
    }),
    http.put(endpoint + "/:id", async ({ request, params }) => {
      const draft = (await request.json()) as ExpenseDraft;
      const id = Number(params.id);
      const existing = records.find((expense) => expense.id === id);
      if (!existing)
        return HttpResponse.json(
          { message: "Expense not found", details: {} },
          { status: 404 },
        );
      const updated: Expense = {
        ...draft,
        description: draft.description ?? null,
        id,
        createdAt: existing.createdAt,
        updatedAt: "2026-10-15T10:00:00Z",
      };
      records = records.map((expense) =>
        expense.id === id ? updated : expense,
      );
      return HttpResponse.json(updated);
    }),
    http.delete(endpoint + "/:id", ({ params }) => {
      const id = Number(params.id);
      records = records.filter((expense) => expense.id !== id);
      return new HttpResponse(null, { status: 204 });
    }),
  );
}

describe("DashboardPage expense workflows", () => {
  it("creates an expense and reloads it into the table", async () => {
    mockExpenseApi();
    const user = userEvent.setup();
    render(<DashboardPage />);
    expect(await screen.findByText("Weekly groceries")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add expense" }));
    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Coffee");
    await user.clear(screen.getByLabelText("Amount"));
    await user.type(screen.getByLabelText("Amount"), "12.50");
    await user.selectOptions(screen.getByLabelText("Currency"), "AMD");
    await user.clear(screen.getByLabelText("Category"));
    await user.type(screen.getByLabelText("Category"), "Dining");
    await user.selectOptions(screen.getByLabelText("Paid by"), "2");
    await user.click(screen.getByRole("button", { name: "Save expense" }));

    expect(await screen.findByText("Coffee")).toBeInTheDocument();
    expect(await screen.findByText("Expense added")).toBeInTheDocument();
  });

  it("updates an expense from the table", async () => {
    mockExpenseApi();
    const user = userEvent.setup();
    render(<DashboardPage />);
    await screen.findByText("Weekly groceries");

    await user.click(
      screen.getByRole("button", { name: "Edit Weekly groceries" }),
    );
    await user.clear(screen.getByLabelText("Description"));
    await user.type(screen.getByLabelText("Description"), "Market groceries");
    await user.click(screen.getByRole("button", { name: "Save expense" }));

    expect(await screen.findByText("Market groceries")).toBeInTheDocument();
    expect(await screen.findByText("Expense updated")).toBeInTheDocument();
  });

  it("deletes an expense after confirmation", async () => {
    mockExpenseApi();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    render(<DashboardPage />);
    await screen.findByText("Weekly groceries");

    await user.click(
      screen.getByRole("button", { name: "Delete Weekly groceries" }),
    );

    expect(
      await screen.findByText("No transactions match"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Expense deleted")).toBeInTheDocument();
    await waitFor(() => expect(window.confirm).toHaveBeenCalledOnce());
  });
});
