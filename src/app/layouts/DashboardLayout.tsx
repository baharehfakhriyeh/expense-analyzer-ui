import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
export default function DashboardLayout({ children, transactionCount }: { children: ReactNode; transactionCount: number }) {
  return <div className="app-shell"><Sidebar transactionCount={transactionCount} /><main className="main-content" id="top"><Topbar />{children}</main></div>
}