import React, { useState } from 'react';

const viewLabels = {
  dashboard: 'Overview',
  devices: 'Devices',
  compliance: 'Compliance',
  evidence: 'Findings',
  assistant: 'Training Studio',
  drift: 'Drift Center',
  reports: 'Reports Center',
  graph: 'Security Graph',
  whatif: 'Query & What-If',
  frameworks: 'Frameworks & Rules',
  mappings: 'Mapping Library',
  audit: 'Audit Trail & Integrity',
  health: 'System Status & Settings',
  help: 'Help & Documentation',
  settings: 'Settings',
  remediation: 'Remediation',
};

export default function Topbar({ activeTab, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const label = viewLabels[activeTab] || 'Overview';

  return (
    <header className="topbar">
      {/* Breadcrumb */}
      <div className="topbar-breadcrumb">
        <span>Cipher-X</span>
        <span className="topbar-breadcrumb-separator">/</span>
        <span className="topbar-breadcrumb-current">{label}</span>
      </div>

      {/* Environment Badge */}
      <div className="topbar-environment">Production-US-East</div>

      {/* Search */}
      <div className="topbar-search">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          placeholder="Search devices, rules, hashes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch(searchQuery)}
        />
      </div>

      {/* Action Buttons */}
      <div className="topbar-actions">
        <button className="topbar-action-btn">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
          Export Report
        </button>
        <button className="topbar-icon-btn">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="topbar-icon-btn">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <button className="topbar-icon-btn">
          <span className="material-symbols-outlined">tune</span>
        </button>
      </div>
    </header>
  );
}
