import { Activity, CreditCard, Wallet } from "lucide-react";
import type { ExpenseSummary } from "../types/expense";
import { formatMoney } from "../utils/formatters";
interface Props {
  summary: ExpenseSummary | null;
  loading: boolean;
  hasError: boolean;
}
export default function ExpenseSummaryCards({
  summary,
  loading,
  hasError,
}: Props) {
  const totalCount = summary?.totals.reduce((sum, total) => sum + total.expenseCount, 0) ?? 0;
  return (
    <section className="summary-dashboards" aria-label="Expense totals by date range">
      <article className="summary-card highlight summary-overall-card">
        <div className="summary-top">
          <span className="summary-label">TOTAL EXPENSES</span>
          <span className="summary-icon violet">
            <Wallet size={18} />
          </span>
        </div>
        <div className="summary-currency-totals">
          {loading ? (
            <span>Loading totals…</span>
          ) : hasError ? (
            <span>Totals unavailable</span>
          ) : summary?.totals.length ? (
            summary.totals.map((total) => (
              <span key={total.currency}>{formatMoney(total.amount, total.currency)}</span>
            ))
          ) : (
            <span>No expenses in this period</span>
          )}
        </div>
        <div className="summary-foot">
          <span className="foot-pill"><Activity size={13} /> {loading ? "—" : totalCount} records</span>
          <span>all matching expenses</span>
        </div>
      </article>
      {summary?.payers.map((payer) => (
        <article className="summary-card payer-summary-card" key={payer.paidBy}>
          <div className="summary-top">
            <span className="summary-label">PAID BY USER {payer.paidBy}</span>
            <span className="summary-icon mint"><CreditCard size={18} /></span>
          </div>
          <div className="summary-currency-totals">
            {payer.totals.map((total) => (
              <span key={total.currency}>{formatMoney(total.amount, total.currency)}</span>
            ))}
          </div>
          <div className="summary-foot">
            <span className="subtle-dot" />
            {payer.totals.reduce((sum, total) => sum + total.expenseCount, 0)} expenses
          </div>
        </article>
      ))}
    </section>
  );
}
