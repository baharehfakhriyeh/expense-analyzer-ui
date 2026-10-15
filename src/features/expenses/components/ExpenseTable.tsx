import {
  ArrowDown,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type { Expense, ExpensePage, ExpenseSort } from "../types/expense";
import {
  formatDate,
  formatMoney,
  initials,
  payerName,
} from "../utils/formatters";
interface Props {
  page: ExpensePage | null;
  expenses: Expense[];
  loading: boolean;
  pageIndex: number;
  sort: ExpenseSort;
  onSortChange: (sort: ExpenseSort) => void;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}
const colors = [
  "#8b7bf6",
  "#39b8a6",
  "#f1a84a",
  "#f07285",
  "#6ca8f4",
  "#b17be8",
];
export default function ExpenseTable({
  page,
  expenses,
  loading,
  pageIndex,
  sort,
  onSortChange,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>TRANSACTION</th>
              <th>DATE</th>
              <th>CATEGORY</th>
              <th>PAID BY</th>
              <th>
                <button
                  className="sort-button"
                  onClick={() =>
                    onSortChange(
                      sort === "amount,desc"
                        ? "expenseDate,desc"
                        : "amount,desc",
                    )
                  }
                >
                  AMOUNT{" "}
                  {sort === "amount,desc" ? (
                    <ArrowDown size={12} />
                  ) : (
                    <ArrowDownUp size={12} />
                  )}
                </button>
              </th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="table-state">
                  <LoaderCircle className="spin" size={20} /> Getting your
                  transactions…
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-state">
                  <div className="empty-table">
                    <span className="empty-illustration">
                      <CreditCard size={21} />
                    </span>
                    <strong>No transactions match</strong>
                    <span>
                      Try changing your filters, or add your first expense.
                    </span>
                    <button className="secondary-button" onClick={onCreate}>
                      <Plus size={15} /> Add expense
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              expenses.map((expense, index) => (
                <tr key={expense.id}>
                  <td>
                    <div className="transaction-cell">
                      <span
                        className="merchant-icon"
                        style={{
                          color: colors[index % colors.length],
                          backgroundColor: colors[index % colors.length] + "18",
                        }}
                      >
                        {initials(expense.description)}
                      </span>
                      <span>
                        <strong>{expense.description || "No description"}</strong>
                        <small>#{expense.id.toString().padStart(4, "0")}</small>
                      </span>
                    </div>
                  </td>
                  <td className="date-cell">
                    {formatDate(expense.expenseDate)}
                  </td>
                  <td>
                    <span className="category-chip">
                      <i
                        style={{ background: colors[index % colors.length] }}
                      />
                      {expense.category}
                    </span>
                  </td>
                  <td>
                    <span className="payer-cell">
                      <span className="tiny-avatar">
                        {payerName(expense.paidBy).slice(-1)}
                      </span>
                      {payerName(expense.paidBy)}
                    </span>
                  </td>
                  <td className="amount-cell">
                    {formatMoney(expense.amount, expense.currency)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="row-icon"
                        onClick={() => onEdit(expense)}
                        aria-label={"Edit " + (expense.description || "expense")}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="row-icon danger-icon"
                        onClick={() => onDelete(expense)}
                        aria-label={"Delete " + (expense.description || "expense")}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>
          Showing{" "}
          <strong>
            {page && page.totalElements ? page.number * page.size + 1 : 0}–
            {page ? page.number * page.size + page.numberOfElements : 0}
          </strong>{" "}
          of <strong>{page?.totalElements ?? 0}</strong> transactions
        </span>
        <div className="pagination">
          <button
            className="page-arrow"
            disabled={!page || page.first || loading}
            onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
            aria-label="Previous page"
          >
            <ArrowLeft size={15} />
          </button>
          <span>
            Page <strong>{page ? page.number + 1 : 1}</strong> of{" "}
            <strong>{Math.max(page?.totalPages ?? 0, 1)}</strong>
          </span>
          <button
            className="page-arrow"
            disabled={!page || page.last || loading}
            onClick={() => onPageChange(pageIndex + 1)}
            aria-label="Next page"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
