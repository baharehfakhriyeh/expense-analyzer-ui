import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import ExpenseSummaryCards from "./ExpenseSummaryCards";
import type { ExpenseSummary } from "../types/expense";

const summary: ExpenseSummary = {
  totals: [{ currency: "USD", amount: 15, expenseCount: 3 }],
  sharedTotals: [{ currency: "USD", amount: 10, expenseCount: 2 }],
  personalTotals: [{ currency: "USD", amount: 5, expenseCount: 1 }],
  payers: [
    {
      paidBy: 1,
      totals: [{ currency: "USD", amount: 9, expenseCount: 2 }],
      sharedTotals: [{ currency: "USD", amount: 4, expenseCount: 1 }],
      personalTotals: [{ currency: "USD", amount: 5, expenseCount: 1 }],
    },
  ],
};

describe("ExpenseSummaryCards", () => {
  it("shows shared, personal, and combined totals for the overall and payer dashboards", () => {
    render(<ExpenseSummaryCards summary={summary} loading={false} hasError={false} />);

    const [overall, payer] = screen.getAllByRole("article");
    expect(within(overall).getByText("Shared")).toBeInTheDocument();
    expect(within(overall).getByText("Personal")).toBeInTheDocument();
    expect(within(overall).getByText("Total")).toBeInTheDocument();
    expect(within(overall).getByText("$10.00")).toBeInTheDocument();
    expect(within(overall).getByText("$5.00")).toBeInTheDocument();
    expect(within(overall).getByText("$15.00")).toBeInTheDocument();

    expect(within(payer).getByText("PAID BY USER 1")).toBeInTheDocument();
    expect(within(payer).getByText("Shared")).toBeInTheDocument();
    expect(within(payer).getByText("Personal")).toBeInTheDocument();
    expect(within(payer).getByText("Total")).toBeInTheDocument();
    expect(within(payer).getByText("$4.00")).toBeInTheDocument();
    expect(within(payer).getByText("$5.00")).toBeInTheDocument();
    expect(within(payer).getByText("$9.00")).toBeInTheDocument();
  });
});
