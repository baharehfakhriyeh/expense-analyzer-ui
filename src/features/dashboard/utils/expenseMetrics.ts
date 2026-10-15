import type { Currency, Expense } from "../../expenses/types/expense";
export type CategoryCount = [string, number];
export function getExpenseMetrics(expenses: Expense[]) {
  const counts = new Map<string, number>();
  const totals = new Map<Currency, number>();
  for (const expense of expenses) {
    counts.set(expense.category, (counts.get(expense.category) ?? 0) + 1);
    totals.set(
      expense.currency,
      (totals.get(expense.currency) ?? 0) + expense.amount,
    );
  }
  return {
    categoryCounts: [...counts]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) as CategoryCount[],
    currentTotal: [...totals],
  };
}
