import type {
  ExpenseFilterField,
  ExpenseFilters as Filters,
} from "../types/expense";
import type { Category } from "../../categories/types/category";
interface Props {
  filters: Filters;
  categories: Category[];
  onChange: (field: ExpenseFilterField, value: string) => void;
  onReset: () => void;
}
export default function ExpenseFilters({ filters, categories, onChange, onReset }: Props) {
  return (
    <div className="filters" id="transaction-filters">
      <select
        className="payer-filter"
        aria-label="Filter by category"
        value={filters.categoryId}
        onChange={(event) => onChange("categoryId", event.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <select
        className="payer-filter"
        aria-label="Filter by payer"
        value={filters.paidBy}
        onChange={(event) => onChange("paidBy", event.target.value)}
      >
        <option value="">All people</option>
        <option value="1">User1</option>
        <option value="2">User2</option>
      </select>
      <button className="filter-reset" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
