import { ArrowRight, Plus, Search, SlidersHorizontal } from "lucide-react";
interface Props {
  onAddExpense: () => void;
  onFindTransaction: () => void;
}
export default function QuickActionsCard({
  onAddExpense,
  onFindTransaction,
}: Props) {
  return (
    <article className="panel quick-panel">
      <div className="panel-heading">
        <div>
          <h2>Quick actions</h2>
          <p>Keep your records up to date</p>
        </div>
        <span className="quick-glyph">
          <SlidersHorizontal size={17} />
        </span>
      </div>
      <button className="quick-action" onClick={onAddExpense}>
        <span className="action-icon lilac">
          <Plus size={17} />
        </span>
        <span>
          <strong>Record an expense</strong>
          <small>Add a purchase or bill</small>
        </span>
        <ArrowRight size={16} />
      </button>
      <button className="quick-action" onClick={onFindTransaction}>
        <span className="action-icon sage">
          <Search size={17} />
        </span>
        <span>
          <strong>Find a transaction</strong>
          <small>Filter by date or category</small>
        </span>
        <ArrowRight size={16} />
      </button>
      <div className="tip-box">
        <span className="tip-mark">✳</span>
        <span>
          <strong>A gentle reminder</strong>
          <small>
            Small, consistent check-ins make your money easier to understand.
          </small>
        </span>
      </div>
    </article>
  );
}
