import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/devices': 'Devices',
  '/configurations': 'Configurations',
  '/configurations/upload': 'Upload Configuration',
  '/compliance': 'Compliance Center',
  '/findings': 'Findings',
  '/remediation': 'Remediation',
  '/training': 'Training Studio',
  '/security-graph': 'Security Graph',
  '/query': 'Natural Language Query',
  '/simulation': 'What-If Simulation',
  '/reports': 'Reports',
  '/drift': 'Drift Analysis',
  '/audit': 'Audit Trail',
  '/settings': 'Settings',
};

export function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState('');

  const label = routeLabels[location.pathname] || location.pathname.replace('/', '').replace(/-/g, ' ');

  return (
    <header className="topbar" role="banner">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cx-dark-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>
        <Link to="/dashboard" style={{ color: 'var(--cx-dark-muted)', textDecoration: 'none' }}>CIPHER-X</Link>
        <span style={{ color: 'var(--cx-dark-border)' }}>/</span>
        <span style={{ color: 'var(--cx-dark-text)' }}>{label}</span>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 480, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--cx-dark-elevated)', border: '1px solid var(--cx-dark-border)',
          borderRadius: 8, padding: '7px 12px',
        }}>
          <Search size={14} color="var(--cx-dark-muted)" />
          <input
            type="text"
            placeholder="Search devices, findings, controls..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--cx-dark-text)', fontSize: 13, width: '100%',
              fontFamily: 'Inter, sans-serif',
            }}
            aria-label="Global search"
          />
          <span style={{ fontSize: 10, color: 'var(--cx-dark-muted)', border: '1px solid var(--cx-dark-border)', borderRadius: 4, padding: '2px 5px' }}>⌘K</span>
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <div className="live-indicator">
          <span className="dot" />
          Live
        </div>
        <button className="btn btn-ghost btn-icon" title="Notifications" aria-label="Notifications">
          <Bell size={16} color="var(--cx-dark-muted)" />
        </button>
        <button className="btn btn-ghost btn-icon" title="Help" aria-label="Help">
          <HelpCircle size={16} color="var(--cx-dark-muted)" />
        </button>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: 'var(--cx-orange)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', flexShrink: 0,
        }} title={user?.username} aria-label={`User: ${user?.username}`}>
          {user?.username?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
