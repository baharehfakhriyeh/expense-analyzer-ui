import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  MoreHorizontal,
  Tag,
  Wallet,
} from "lucide-react";
import { API_ORIGIN } from "../../shared/config/runtime";
import { NavLink } from "react-router-dom";
export default function Sidebar({
  transactionCount,
}: {
  transactionCount: number;
}) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#top">
        <span className="brand-mark">
          <Wallet size={21} strokeWidth={2.1} />
        </span>
        <span>
          Family expenses<span className="brand-dot">.</span>
          <small>EXPENSE ANALYZER</small>
        </span>
      </a>
      <div className="workspace-switch">
        <div className="workspace-avatar">H</div>
        <div>
          <strong>Home finances</strong>
          <small>Personal workspace</small>
        </div>
        <ChevronDown size={16} />
      </div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="nav-list">
        <NavLink
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          to="/dashboard"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        <NavLink className="nav-item" to="/dashboard#transactions">
          <CreditCard size={18} />
          Transactions
          <span className="nav-count">{transactionCount.toLocaleString()}</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
          to="/categories"
        >
          <Tag size={18} />
          Categories
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">
            <CircleHelp size={18} />
          </div>
          <strong>Need a hand?</strong>
          <p>Your spending is organized and ready to explore.</p>
          <a
            href={API_ORIGIN + "/swagger-ui.html"}
            target="_blank"
            rel="noreferrer"
          >
            API documentation <ArrowRight size={13} />
          </a>
        </div>
        <button className="profile">
          <span className="profile-avatar">B</span>
          <span>
            <strong>Bahareh</strong>
            <small>Personal account</small>
          </span>
          <MoreHorizontal size={19} />
        </button>
      </div>
    </aside>
  );
}
