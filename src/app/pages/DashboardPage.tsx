import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import ExpenseFilters from "../../features/expenses/components/ExpenseFilters";
import ExpenseFormDialog from "../../features/expenses/components/ExpenseFormDialog";
import ExpenseSummaryCards from "../../features/expenses/components/ExpenseSummaryCards";
import ExpenseTable from "../../features/expenses/components/ExpenseTable";
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "../../features/expenses/api/expensesApi";
import { useExpenses } from "../../features/expenses/hooks/useExpenses";
import type {
  Expense,
  ExpenseDraft,
} from "../../features/expenses/types/expense";
import { emptyExpenseDraft } from "../../features/expenses/constants/expenseOptions";
import { getExpenseMetrics } from "../../features/dashboard/utils/expenseMetrics";
import CategorySnapshotCard from "../../features/dashboard/components/CategorySnapshotCard";
import QuickActionsCard from "../../features/dashboard/components/QuickActionsCard";
import ErrorBanner from "../../shared/components/feedback/ErrorBanner";
import Toast from "../../shared/components/feedback/Toast";
import { listCategories } from "../../features/categories/api/categoriesApi";
import type { Category } from "../../features/categories/types/category";
import { useExpenseSummary } from "../../features/expenses/hooks/useExpenseSummary";

export default function DashboardPage() {
  const {
    page,
    expenses,
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
  } = useExpenses();
  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refresh: refreshSummary,
  } = useExpenseSummary(filters.from, filters.to);
  const [modal, setModal] = useState<Expense | "new" | null>(null);
  const [draft, setDraft] = useState<ExpenseDraft>(emptyExpenseDraft());
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const dismissNotice = useCallback(() => setNotice(""), []);

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesError("");
        setCategories(await listCategories());
      } catch (cause) {
        setCategoriesError(
          cause instanceof Error ? cause.message : "Could not load categories",
        );
      } finally {
        setCategoriesLoading(false);
      }
    }

    void loadCategories();
  }, []);
  const { categoryCounts } = useMemo(
    () => getExpenseMetrics(expenses),
    [expenses],
  );
  function openNew() {
    setDraft(emptyExpenseDraft());
    setModal("new");
  }
  function openEdit(expense: Expense) {
    setDraft({
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency,
      expenseDate: expense.expenseDate,
      categoryId: expense.categoryId,
      notes: expense.notes ?? "",
      paidBy: expense.paidBy,
      isPersonal: expense.isPersonal,
    });
    setModal(expense);
  }
  async function saveExpense(nextDraft: ExpenseDraft) {
    const isCreating = modal === "new";
    setSaving(true);
    try {
      const selectedCategoryName = categories.find(
        (category) => category.id === nextDraft.categoryId,
      )?.name;
      const payload = {
        ...nextDraft,
        description: nextDraft.description?.trim() || selectedCategoryName || null,
        amount: Number(nextDraft.amount),
        notes: nextDraft.notes?.trim() || null,
      };
      if (isCreating) await createExpense(payload);
      else if (modal) await updateExpense(modal.id, payload);
      if (isCreating) {
        setDraft({
          ...emptyExpenseDraft(),
          expenseDate: nextDraft.expenseDate,
          paidBy: nextDraft.paidBy,
        });
      }
      else setModal(null);
      setNotice(isCreating ? "Expense added" : "Expense updated");
      await Promise.all([refresh(), refreshSummary()]);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save expense",
      );
    } finally {
      setSaving(false);
    }
  }
  async function removeExpense(expense: Expense) {
    if (
      !window.confirm(
        "Delete “" + (expense.description || "expense") + "”? This cannot be undone.",
      )
    )
      return;
    try {
      await deleteExpense(expense.id);
      setNotice("Expense deleted");
      if (expenses.length === 1 && pageIndex > 0) setPageIndex(pageIndex - 1);
      else await refresh();
      await refreshSummary();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not delete expense",
      );
    }
  }
  return (
    <DashboardLayout transactionCount={page?.totalElements ?? 0}>
      <div className="page-wrap" id="dashboard">
        <div className="welcome-row">
          <div>
            <div className="eyebrow">
              <Sparkles size={14} /> YOUR FINANCES, AT A GLANCE
            </div>
            <h1>
              Good morning, Bahareh <span className="wave">✳</span>
            </h1>
            <p className="page-subtitle">
              A little clarity goes a long way. Here’s what’s happening with
              your spending.
            </p>
          </div>
          <button className="primary-button" onClick={openNew}>
            <Plus size={17} /> Add expense
          </button>
        </div>
        <section className="panel date-range-panel" aria-label="Dashboard date range">
          <div className="date-range-copy">
            <strong>Expense totals</strong>
            <span>Choose a date range; leave both dates blank for all time.</span>
          </div>
          <div className="date-range-fields">
            <label className="date-range-field">
              <span>From</span>
              <input
                aria-label="Dashboard from date"
                type="date"
                max={filters.to || undefined}
                value={filters.from}
                onChange={(event) => {
                  setFilters({ ...filters, from: event.target.value });
                  setPageIndex(0);
                }}
              />
            </label>
            <label className="date-range-field">
              <span>To</span>
              <input
                aria-label="Dashboard to date"
                type="date"
                min={filters.from || undefined}
                value={filters.to}
                onChange={(event) => {
                  setFilters({ ...filters, to: event.target.value });
                  setPageIndex(0);
                }}
              />
            </label>
            {(filters.from || filters.to) && (
              <button
                className="filter-reset date-range-reset"
                type="button"
                onClick={() => {
                  setFilters({ ...filters, from: "", to: "" });
                  setPageIndex(0);
                }}
              >
                Clear dates
              </button>
            )}
          </div>
        </section>
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError("")} />
        )}
        {summaryError && summaryError !== error && (
          <ErrorBanner
            message={summaryError}
            onDismiss={() => void refreshSummary()}
          />
        )}
        {categoriesError && (
          <ErrorBanner
            message={categoriesError}
            onDismiss={() => setCategoriesError("")}
          />
        )}
        <ExpenseSummaryCards
          summary={summary}
          loading={summaryLoading}
          hasError={Boolean(summaryError)}
        />
        <section className="insights-grid">
          <CategorySnapshotCard
            expensesCount={expenses.length}
            categoryCounts={categoryCounts}
            loading={loading}
          />
          <QuickActionsCard
            onAddExpense={openNew}
            onFindTransaction={() =>
              document
                .getElementById("transaction-filters")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </section>
        <section className="panel transactions-panel" id="transactions">
          <div className="transactions-heading">
            <div>
              <div className="section-title-line">
                <h2>Recent transactions</h2>
                <span className="result-badge">{page?.totalElements ?? 0}</span>
              </div>
              <p>Your latest spending, all in one place.</p>
            </div>
            <button className="secondary-button" onClick={openNew}>
              <Plus size={16} /> New transaction
            </button>
          </div>
          <ExpenseFilters
            filters={filters}
            categories={categories}
            onChange={(field, value) => {
              setFilters({ ...filters, [field]: value });
              setPageIndex(0);
            }}
            onReset={() => {
              setFilters({ from: "", to: "", categoryId: "", paidBy: "" });
              setPageIndex(0);
            }}
          />
          <ExpenseTable
            page={page}
            expenses={expenses}
            loading={loading}
            pageIndex={pageIndex}
            sort={sort}
            onSortChange={setSort}
            onPageChange={setPageIndex}
            onCreate={openNew}
            onEdit={openEdit}
            onDelete={removeExpense}
          />
        </section>
        <footer className="footer-line">
          <span>
            Made for a little more peace of mind{" "}
            <span className="footer-spark">✳</span>
          </span>
          <span>
            Expense Analyzer <span className="footer-separator">·</span> v1.0
          </span>
        </footer>
      </div>
      {notice && <Toast message={notice} onDismiss={dismissNotice} />}
      {modal && (
        <ExpenseFormDialog
          mode={modal === "new" ? "create" : "edit"}
          draft={draft}
          categories={categories}
          categoriesLoading={categoriesLoading}
          saving={saving}
          onChange={setDraft}
          onClose={() => setModal(null)}
          onSubmit={saveExpense}
        />
      )}
    </DashboardLayout>
  );
}
