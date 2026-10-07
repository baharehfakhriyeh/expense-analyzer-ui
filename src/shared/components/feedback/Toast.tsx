import { useEffect } from 'react'
import { Check } from 'lucide-react'
export default function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => { const timer = window.setTimeout(onDismiss, 2800); return () => window.clearTimeout(timer) }, [message, onDismiss])
  return <div className="toast"><span><Check size={15} /></span>{message}</div>
}