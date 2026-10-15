import { describe, expect, it } from "vitest";
import { getExpenseMetrics } from "./expenseMetrics";
import { sampleExpense } from "../../../test/fixtures";
import type { Expense } from "../../expenses/types/expense";

describe("getExpenseMetrics", () => {
  it("counts categories and keeps totals separated by currency", () => {
    const expenses: Expense[] = [
      sampleExpense,
      {
        ...sampleExpense,
        id: 8,
        description: "Lunch",
        amount: 18.5,
        category: "Food",
      },
      {
        ...sampleExpense,
        id: 9,
        description: "Taxi",
        amount: 4000,
        currency: "AMD",
        category: "Transport",
      },
    ];

    expect(getExpenseMetrics(expenses)).toEqual({
      categoryCounts: [
        ["Food", 2],
        ["Transport", 1],
      ],
      currentTotal: [
        ["USD", 61.25],
        ["AMD", 4000],
      ],
    });
  });

  it("returns no metrics for an empty page", () => {
    expect(getExpenseMetrics([])).toEqual({
      categoryCounts: [],
      currentTotal: [],
    });
  });

  it("limits the category list to the five most frequent categories", () => {
    const expenses = Array.from({ length: 6 }, (_, index) => ({
      ...sampleExpense,
      id: index + 1,
      category: "Category " + index,
    }));
    expect(getExpenseMetrics(expenses).categoryCounts).toHaveLength(5);
  });
});
