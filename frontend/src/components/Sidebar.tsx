import React, { useState } from 'react';
import {
  LayoutDashboard,
  Brain,
  History,
  BarChart3,
  GitCompare,
  Zap,
  Menu,
  X,
  Shield,
} from 'lucide-react';

type Page =
  | 'dashboard'
  | 'assessment'
  | 'history'
  | 'analytics'
  | 'model-insights'
  | 'whatif';

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'assessment', label: 'Credit Assessment', icon: <Brain size={18} /> },
  { id: 'model-insights', label: 'Model Insights', icon: <GitCompare size={18} /> },
  { id: 'whatif', label: 'What-If Simulator', icon: <Zap size={18} /> },
  { id: 'history', label: 'Prediction History', icon: <History size={18} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>CreditWise AI</h1>
          <p>Credit Risk Assessment</p>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNav(item.id)}
              aria-current={activePage === item.id ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Shield size={12} />
            <span>Responsible AI</span>
          </div>
          <div style={{ fontSize: '0.7rem', lineHeight: 1.5 }}>
            AI-generated risk assessment<br />
            for demonstration purposes only.<br />
            Not a regulated financial decision.
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
