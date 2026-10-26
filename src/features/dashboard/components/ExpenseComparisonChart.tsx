import type { CurrencyExpenseTotal, ExpenseSummary } from "../../expenses/types/expense";
import { formatMoney, payerName } from "../../expenses/utils/formatters";

interface Props {
  summary: ExpenseSummary | null;
  loading: boolean;
  hasError: boolean;
}

interface ChartRow {
  label: string;
  shared: CurrencyExpenseTotal;
}

export default function ExpenseComparisonChart({ summary, loading, hasError }: Props) {
  if (loading) {
    return (
      <section className="panel expense-comparison-panel" aria-labelledby="expense-comparison-title">
        <ChartHeading />
        <p className="comparison-chart-state" role="status">Loading spending chart…</p>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="panel expense-comparison-panel" aria-labelledby="expense-comparison-title">
        <ChartHeading />
        <p className="comparison-chart-state" role="status">Spending chart unavailable.</p>
      </section>
    );
  }

  if (!summary?.totals.length) {
    return (
      <section className="panel expense-comparison-panel" aria-labelledby="expense-comparison-title">
        <ChartHeading />
        <p className="comparison-chart-state">No expenses in this period to chart.</p>
      </section>
    );
  }

  return (
    <section className="panel expense-comparison-panel" aria-labelledby="expense-comparison-title">
      <ChartHeading />
      <div className="comparison-legend" aria-label="Chart legend">
        <span><i className="comparison-legend-shared" />Shared</span>
      </div>
      <div className="comparison-currencies">
        {summary.totals.map((overallTotal) => {
          const currency = overallTotal.currency;
          const rows: ChartRow[] = [
            {
              label: "Overall",
              shared: findTotal(summary.sharedTotals, currency),
            },
            ...summary.payers.map((payer) => ({
              label: payerName(payer.paidBy),
              shared: findTotal(payer.sharedTotals, currency),
            })),
          ];
          const maximum = Math.max(...rows.map((row) => row.shared.amount), 1);

          return (
            <section className="comparison-currency" key={currency} aria-label={`${currency} spending`}>
              <h3>{currency}</h3>
              <div className="comparison-columns">
                {rows.map((row) => (
                  <div
                    className="comparison-column"
                    key={row.label}
                    role="img"
                    aria-label={`${row.label}: shared ${formatMoney(row.shared.amount, currency)}`}
                  >
                    <strong className="comparison-column-total">
                      {formatMoney(row.shared.amount, currency)}
                    </strong>
                    <span className="comparison-column-track" aria-hidden="true">
                      <span
                        className="comparison-bar-shared"
                        style={{ height: `${(row.shared.amount / maximum) * 100}%` }}
                      />
                    </span>
                    <span className="comparison-column-label">{row.label}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function ChartHeading() {
  return (
    <div className="panel-heading">
      <div>
        <h2 id="expense-comparison-title">Shared spending</h2>
        <p>Shared expense totals by currency and payer.</p>
      </div>
    </div>
  );
}

function findTotal(totals: CurrencyExpenseTotal[], currency: CurrencyExpenseTotal["currency"]) {
  return totals.find((total) => total.currency === currency) ?? {
    currency,
    amount: 0,
    expenseCount: 0,
  };
}
