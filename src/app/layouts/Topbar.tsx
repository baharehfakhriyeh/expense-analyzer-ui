import { Settings2 } from "lucide-react";
export default function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumbs">
        <span>Workspace</span>
        <span className="crumb-slash">/</span>
        <strong>Dashboard</strong>
      </div>
      <div className="topbar-actions">
        <span className="sync-status">
          <span /> Live data
        </span>
        <button className="icon-button" aria-label="Settings">
          <Settings2 size={18} />
        </button>
        <button className="top-avatar" aria-label="Profile">
          B
        </button>
      </div>
    </header>
  );
}
