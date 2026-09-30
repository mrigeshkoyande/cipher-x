import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Server, FileText, ShieldCheck, AlertTriangle,
  BookOpen, Network, MessageSquare, FlaskConical, FileBarChart,
  GitCompare, Scroll, Settings, LogOut, Zap, Lock, Activity,
  ChevronLeft, ChevronRight, HelpCircle, BookMarked
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const sections = [
  {
    label: 'Overview',
    items: [
      { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { to: '/app/devices', label: 'Devices', icon: Server },
      { to: '/app/configurations', label: 'Configurations', icon: FileText },
    ],
  },
  {
    label: 'Security & Posture',
    items: [
      { to: '/app/compliance', label: 'Compliance', icon: ShieldCheck },
      { to: '/app/findings', label: 'Findings', icon: AlertTriangle },
      { to: '/app/security-graph', label: 'Security Graph', icon: Network },
      { to: '/app/drift', label: 'Configuration Drift', icon: GitCompare },
    ],
  },
  {
    label: 'Intelligence & AI',
    items: [
      { to: '/app/training', label: 'AI Training Studio', icon: BookOpen },
      { to: '/app/query', label: 'Security Query', icon: MessageSquare },
      { to: '/app/simulation', label: 'What-If Simulator', icon: FlaskConical },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/app/remediation', label: 'Remediation Center', icon: Zap },
      { to: '/app/reports', label: 'Audit Reports', icon: FileBarChart },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/app/audit', label: 'Audit Trail', icon: Scroll },
      { to: '/app/integrity', label: 'Evidence Integrity', icon: Lock },
      { to: '/app/system-health', label: 'System Health', icon: Activity },
      { to: '/app/settings', label: 'Platform Settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="app-sidebar"
      aria-label="Main navigation"
      style={{
        width: collapsed ? 68 : 240,
        minWidth: collapsed ? 68 : 240,
        transition: 'width 0.2s ease, min-width 0.2s ease',
        background: '#0D1311',
        borderRight: '1px solid #1E2822',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #1E2822',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        <NavLink to="/app/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img
            src="/app-logo.png"
            alt="Cipher-X Logo"
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              objectFit: 'contain',
              boxShadow: '0 0 12px rgba(255, 116, 23, 0.35)',
              border: '1px solid rgba(255, 116, 23, 0.4)',
              flexShrink: 0,
            }}
          />
          {!collapsed && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#F2F4EA', letterSpacing: '0.06em' }}>CIPHER-X</div>
              <div style={{ fontSize: 10, color: '#687369', letterSpacing: '0.04em' }}>Compliance Auditor</div>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
        {sections.map((section) => (
          <div key={section.label} style={{ marginBottom: 16 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#687369',
                  padding: '6px 10px',
                }}
              >
                {section.label}
              </div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: collapsed ? '9px 0' : '9px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#AAB2A8',
                  textDecoration: 'none',
                  marginBottom: 2,
                  transition: 'all 0.15s ease',
                }}
              >
                <item.icon size={16} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom User & Collapse Bar */}
      <div style={{ borderTop: '1px solid #1E2822', padding: 8 }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: '#687369',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: 6,
            marginBottom: 4,
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '8px 10px',
            background: '#121A15',
            borderRadius: 6,
          }}
        >
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#F2F4EA', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user?.username || 'Security Admin'}
              </div>
              <div style={{ fontSize: 10, color: '#25B981' }}>Authenticated</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#AAB2A8',
              cursor: 'pointer',
              padding: 4,
            }}
            title="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
}
