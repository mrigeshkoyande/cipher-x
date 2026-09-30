import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Server, FileText, ShieldCheck, AlertTriangle,
  BookOpen, Network, MessageSquare, FlaskConical, FileBarChart,
  GitCompare, Scroll, Settings, LogOut, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const sections = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Overview', icon: LayoutDashboard }],
  },
  {
    label: 'Assets',
    items: [
      { to: '/devices', label: 'Devices', icon: Server },
      { to: '/configurations', label: 'Configurations', icon: FileText },
    ],
  },
  {
    label: 'Security',
    items: [
      { to: '/compliance', label: 'Compliance', icon: ShieldCheck },
      { to: '/findings', label: 'Findings', icon: AlertTriangle },
      { to: '/remediation', label: 'Remediation', icon: Zap },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/training', label: 'Training Studio', icon: BookOpen },
      { to: '/security-graph', label: 'Security Graph', icon: Network },
      { to: '/query', label: 'NL Query', icon: MessageSquare },
      { to: '/simulation', label: 'What-If', icon: FlaskConical },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/reports', label: 'Reports', icon: FileBarChart },
      { to: '/drift', label: 'Drift Analysis', icon: GitCompare },
      { to: '/audit', label: 'Audit Trail', icon: Scroll },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="app-sidebar" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: 'var(--cx-orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <ShieldCheck size={16} color="#fff" />
          </div>
          <div>
            <div className="sidebar-logo-name">CIPHER-X</div>
          </div>
        </div>
        <div className="sidebar-logo-tag" style={{ marginTop: 4, marginLeft: 36 }}>Security Compliance</div>
      </div>

      {/* Navigation sections */}
      <div style={{ flex: 1 }}>
        {sections.map(section => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
                title={item.label}
              >
                <item.icon className="icon" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--cx-dark-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'var(--cx-dark-elevated)',
            border: '1px solid var(--cx-dark-border)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--cx-orange)'
          }}>
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--cx-dark-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username || 'admin'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--cx-dark-muted)' }}>{user?.role || 'ADMIN'}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut size={13} /> <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
