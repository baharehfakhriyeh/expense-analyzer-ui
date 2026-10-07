import { CalendarDays, Search } from 'lucide-react'
import type { ExpenseFilterField, ExpenseFilters as Filters } from '../types/expense'
interface Props { filters: Filters; onChange: (field: ExpenseFilterField, value: string) => void; onReset: () => void }
export default function ExpenseFilters({ filters, onChange, onReset }: Props) {
  return <div className="filters" id="transaction-filters">
    <div className="filter-search"><Search size={16} /><input aria-label="Filter category" placeholder="Filter by category…" value={filters.category} onChange={event => onChange('category', event.target.value)} /></div>
    <label className="date-filter"><CalendarDays size={15} /><span>From</span><input aria-label="From date" type="date" value={filters.from} onChange={event => onChange('from', event.target.value)} /></label>
    <label className="date-filter"><CalendarDays size={15} /><span>To</span><input aria-label="To date" type="date" value={filters.to} onChange={event => onChange('to', event.target.value)} /></label>
    <select className="payer-filter" aria-label="Filter by payer" value={filters.paidBy} onChange={event => onChange('paidBy', event.target.value)}><option value="">All people</option><option value="1">User1</option><option value="2">User2</option></select>
    <button className="filter-reset" onClick={onReset}>Reset</button>
  </div>
}