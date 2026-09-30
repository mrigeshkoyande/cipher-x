import React from 'react';

const navSections = [
  {
    label: 'MAIN ECOSYSTEM',
    items: [
      { id: 'dashboard', label: 'Overview', icon: 'dashboard' },
      { id: 'devices', label: 'Devices', icon: 'dns' },
      { id: 'compliance', label: 'Compliance', icon: 'verified_user' },
      { id: 'evidence', label: 'Findings', icon: 'policy' },
    ],
  },
  {
    label: null,
    items: [
      { id: 'assistant', label: 'Training Studio', icon: 'model_training' },
      { id: 'drift', label: 'Drift', icon: 'compare_arrows' },
      { id: 'reports', label: 'Reports', icon: 'summarize' },
    ],
  },
  {
    label: 'MANAGEMENT & RULES',
    items: [
      { id: 'graph', label: 'Security Graph', icon: 'account_tree' },
      { id: 'whatif', label: 'Query', icon: 'query_stats' },
      { id: 'frameworks', label: 'Frameworks & Rules', icon: 'gavel' },
      { id: 'mappings', label: 'Mappings', icon: 'hub' },
      { id: 'audit', label: 'Audit Trail', icon: 'fingerprint' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'health', label: 'System Status', icon: 'monitor_heart' },
      { id: 'help', label: 'Help', icon: 'help_outline' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
  },
];

export default function Sidebar({ activeTab, setActiveTab, driftCount = 3 }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
        <div className="sidebar-logo-icon">
          <span className="material-symbols-outlined">shield</span>
        </div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">Cipher-X</div>
          <div className="sidebar-logo-sub">AI Compliance Auditor</div>
        </div>
      </div>

      {/* Trigger Audit Button */}
      <button className="sidebar-trigger-btn">
        <span className="material-symbols-outlined">bolt</span>
        Trigger Audit
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            {section.label && (
              <div className="sidebar-section-label">{section.label}</div>
            )}
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
                {item.id === 'drift' && driftCount > 0 && (
                  <span className="sidebar-nav-badge">{driftCount}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Security Analyst</div>
            <div className="sidebar-user-role">Tier-3 SecOps</div>
          </div>
        </div>
        <button className="sidebar-signout">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
