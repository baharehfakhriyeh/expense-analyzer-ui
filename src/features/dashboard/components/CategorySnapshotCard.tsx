import { CalendarDays, LoaderCircle, Sparkles, Wallet } from 'lucide-react'
import type { CategoryCount } from '../utils/expenseMetrics'
interface Props { expensesCount: number; categoryCounts: CategoryCount[]; loading: boolean }
const colors = ['#8b7bf6', '#39b8a6', '#f1a84a', '#f07285', '#6ca8f4', '#b17be8']
export default function CategorySnapshotCard({ expensesCount, categoryCounts, loading }: Props) {
  return <article className="panel category-panel" id="categories">
    <div className="panel-heading"><div><h2>Spending snapshot</h2><p>Transaction mix by category</p></div><button className="period-button"><CalendarDays size={14} /> This page <span>⌄</span></button></div>
    {loading ? <div className="chart-loading"><LoaderCircle className="spin" size={20} /> Loading snapshot</div> : categoryCounts.length ? <div className="category-chart"><div className="donut-wrap"><div className="donut" style={{ background: donutGradient(categoryCounts.map(([, count]) => count)) }}><div className="donut-center"><strong>{expensesCount}</strong><span>expenses</span></div></div></div><div className="legend">{categoryCounts.map(([name, count], index) => <div className="legend-row" key={name}><span className="legend-label"><i style={{ background: colors[index % colors.length] }} />{name}</span><span className="legend-count">{count}<small> {count === 1 ? 'item' : 'items'}</small></span></div>)}</div></div> : <div className="empty-chart"><span className="empty-illustration"><Wallet size={22} /></span><strong>Nothing to chart yet</strong><span>Add an expense and your category mix will appear here.</span></div>}
    <div className="panel-note"><span className="note-spark"><Sparkles size={14} /></span>Counts reflect the current page and filters.</div>
  </article>
}
function donutGradient(counts: number[]) {
  const total = counts.reduce((sum, count) => sum + count, 0)
  let offset = 0
  const segments = counts.map((count, index) => { const start = offset; offset += count / total * 100; return colors[index % colors.length] + ' ' + start + '% ' + offset + '%' })
  return 'conic-gradient(' + segments.join(', ') + ')'
}