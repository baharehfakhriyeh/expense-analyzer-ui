import type { FormEvent } from 'react'
import { Check, LoaderCircle, Sparkles, X } from 'lucide-react'
import { currencies, payers } from '../constants/expenseOptions'
import type { Currency, ExpenseDraft } from '../types/expense'
interface Props { mode: 'create' | 'edit'; draft: ExpenseDraft; saving: boolean; onChange: (draft: ExpenseDraft) => void; onClose: () => void; onSubmit: (draft: ExpenseDraft) => void }
export default function ExpenseFormDialog({ mode, draft, saving, onChange, onClose, onSubmit }: Props) {
  function update<K extends keyof ExpenseDraft>(field: K, value: ExpenseDraft[K]) { onChange({ ...draft, [field]: value }) }
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSubmit(draft) }
  return <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section className="expense-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-head"><div><div className="eyebrow"><Sparkles size={13} /> A MOMENT FOR YOUR MONEY</div><h2 id="modal-title">{mode === 'create' ? 'Add an expense' : 'Edit expense'}</h2><p>It’s the little details that add up to a clearer picture.</p></div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div>
      <form onSubmit={handleSubmit}>
        <label className="form-field full-field"><span>Description</span><input autoFocus required maxLength={200} placeholder="e.g. Weekly groceries" value={draft.description} onChange={event => update('description', event.target.value)} /></label>
        <div className="form-grid"><label className="form-field"><span>Amount</span><input required type="number" min="0.0001" max="999999999999999.9999" step="0.0001" placeholder="0.00" value={draft.amount || ''} onChange={event => update('amount', Number(event.target.value))} /></label><label className="form-field"><span>Currency</span><select value={draft.currency} onChange={event => update('currency', event.target.value as Currency)}>{currencies.map(currency => <option key={currency}>{currency}</option>)}</select></label></div>
        <div className="form-grid"><label className="form-field"><span>Date</span><input required type="date" value={draft.expenseDate} onChange={event => update('expenseDate', event.target.value)} /></label><label className="form-field"><span>Category</span><input required maxLength={80} placeholder="e.g. Food" value={draft.category} onChange={event => update('category', event.target.value)} /></label></div>
        <label className="form-field full-field"><span>Paid by</span><select required value={draft.paidBy} onChange={event => update('paidBy', Number(event.target.value))}>{payers.map(person => <option key={person.id} value={person.id}>{person.text}</option>)}</select></label>
        <label className="form-field full-field"><span>Notes <small>OPTIONAL</small></span><textarea maxLength={2000} rows={3} placeholder="Add a note if you'd like…" value={draft.notes ?? ''} onChange={event => update('notes', event.target.value)} /></label>
        <div className="modal-footer"><span>All fields marked are saved with your expense.</span><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />}{saving ? 'Saving…' : 'Save expense'}</button></div>
      </form>
    </section>
  </div>
}