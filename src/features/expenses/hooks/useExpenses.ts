import { useCallback, useEffect, useState } from "react";
import { listExpenses } from "../api/expensesApi";
import type {
  ExpenseFilters,
  ExpensePage,
  ExpenseSort,
} from "../types/expense";
const initialFilters: ExpenseFilters = {
  from: "",
  to: "",
  categoryId: "",
  paidBy: "",
};
export function useExpenses() {
  const [page, setPage] = useState<ExpensePage | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>(initialFilters);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<ExpenseSort>("expenseDate,desc");
  const refresh = useCallback(async () => {
    if (filters.from && filters.to && filters.from > filters.to) {
      setPage(null);
      setError("From date must be on or before To date.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setPage(await listExpenses(filters, pageIndex, sort));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load expenses",
      );
    } finally {
      setLoading(false);
    }
  }, [filters, pageIndex, sort]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return {
    page,
    expenses: page?.content ?? [],
    filters,
    setFilters,
    pageIndex,
    setPageIndex,
    loading,
    error,
    setError,
    sort,
    setSort,
    refresh,
  };
}
