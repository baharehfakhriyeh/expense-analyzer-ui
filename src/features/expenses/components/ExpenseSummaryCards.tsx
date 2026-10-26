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

  function renderAmounts(totals: ExpenseSummary["totals"]) {
    if (totals.length === 0) return <span>—</span>;
    return totals.map((total) => (
      <span key={total.currency}>{formatMoney(total.amount, total.currency)}</span>
    ));
  }

  function renderBreakdown(
    sharedTotals: ExpenseSummary["totals"],
    personalTotals: ExpenseSummary["totals"],
    totals: ExpenseSummary["totals"],
  ) {
    if (loading) return <p className="summary-state">Loading totals…</p>;
    if (hasError) return <p className="summary-state">Totals unavailable</p>;
    if (totals.length === 0) return <p className="summary-state">No expenses in this period</p>;

    return (
      <dl className="summary-breakdown">
        <div className="summary-breakdown-row">
          <dt>Shared</dt><dd>{renderAmounts(sharedTotals)}</dd>
        </div>
        <div className="summary-breakdown-row">
          <dt>Personal</dt><dd>{renderAmounts(personalTotals)}</dd>
        </div>
        <div className="summary-breakdown-row summary-breakdown-total">
          <dt>Total</dt><dd>{renderAmounts(totals)}</dd>
        </div>
      </dl>
    );
  }

  return (
    <section className="summary-dashboards" aria-label="Expense totals by date range">
      <article className="summary-card highlight summary-overall-card">
        <div className="summary-top">
          <span className="summary-label">TOTAL EXPENSES</span>
          <span className="summary-icon violet">
            <Wallet size={18} />
          </span>
        </div>
        {renderBreakdown(
          summary?.sharedTotals ?? [],
          summary?.personalTotals ?? [],
          summary?.totals ?? [],
        )}
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
          {renderBreakdown(payer.sharedTotals, payer.personalTotals, payer.totals)}
          <div className="summary-foot">
            <span className="subtle-dot" />
            {payer.totals.reduce((sum, total) => sum + total.expenseCount, 0)} expenses
          </div>
        </article>
      ))}
    </section>
  );
}
