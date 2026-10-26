import { useCallback, useEffect, useRef, useState } from "react";
import { getExpenseSummary } from "../api/expensesApi";
import type { ExpenseSummary } from "../types/expense";

export function useExpenseSummary(from: string, to: string) {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequest.current;
    if (from && to && from > to) {
      setSummary(null);
      setError("From date must be on or before To date.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setSummary(null);
    setError("");
    try {
      const result = await getExpenseSummary(from, to);
      if (requestId === latestRequest.current) setSummary(result);
    } catch (cause) {
      if (requestId === latestRequest.current) {
        setError(cause instanceof Error ? cause.message : "Could not load expense totals");
      }
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { summary, loading, error, refresh };
}
