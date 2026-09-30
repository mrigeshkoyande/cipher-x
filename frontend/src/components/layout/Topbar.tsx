import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, HelpCircle, Film, Activity, Command, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CommandPalette } from '../modals/CommandPalette';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';
import { NotificationDrawer } from '../modals/NotificationDrawer';

const routeLabels: Record<string, { section: string; title: string }> = {
  '/app/dashboard': { section: 'Overview', title: 'Dashboard' },
  '/app/devices': { section: 'Infrastructure', title: 'Devices' },
  '/app/configurations': { section: 'Infrastructure', title: 'Configurations' },
  '/app/configurations/upload': { section: 'Infrastructure', title: 'Upload Configuration' },
  '/app/compliance': { section: 'Security', title: 'Compliance Center' },
  '/app/findings': { section: 'Security', title: 'Findings' },
  '/app/security-graph': { section: 'Security', title: 'Security Graph' },
  '/app/drift': { section: 'Security', title: 'Configuration Drift' },
  '/app/training': { section: 'Intelligence', title: 'AI Training Studio' },
  '/app/query': { section: 'Intelligence', title: 'Security Query' },
  '/app/simulation': { section: 'Intelligence', title: 'What-If Simulator' },
  '/app/remediation': { section: 'Operations', title: 'Remediation Center' },
  '/app/reports': { section: 'Operations', title: 'Reports' },
  '/app/audit': { section: 'Administration', title: 'Audit Trail' },
  '/app/integrity': { section: 'Administration', title: 'Evidence Integrity' },
  '/app/system-health': { section: 'Administration', title: 'System Health' },
  '/app/settings': { section: 'Administration', title: 'Settings' },
};

export function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const matched = routeLabels[location.pathname] || {
    section: 'Application',
    title: location.pathname.replace('/app/', '').replace(/-/g, ' ').toUpperCase() || 'CONSOLE',
  };

  return (
    <>
      <header
        className="topbar"
        role="banner"
        style={{
          height: 56,
          background: '#0D1311',
          borderBottom: '1px solid #1E2822',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Left: Dynamic Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, whiteSpace: 'nowrap' }}>
          <Link to="/app/dashboard" style={{ color: '#687369', textDecoration: 'none', fontWeight: 600 }}>
            CIPHER-X
          </Link>
          <span style={{ color: '#303833' }}>/</span>
          <span style={{ color: '#8C9390' }}>{matched.section}</span>
          <span style={{ color: '#303833' }}>/</span>
          <span style={{ color: '#F2F4EA', fontWeight: 600 }}>{matched.title}</span>
        </div>

        {/* Center: Global Search & Command Palette Trigger */}
        <div style={{ flex: 1, maxWidth: 440, margin: '0 auto' }}>
          <button
            onClick={() => setSearchModalOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#151B18',
              border: '1px solid #28322B',
              borderRadius: 6,
              padding: '6px 12px',
              color: '#8C9390',
              fontSize: 13,
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FF7417')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#28322B')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={14} color="#687369" />
              <span>Search devices, findings, controls...</span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setCommandPaletteOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                fontSize: 10,
                color: '#FF7417',
                background: 'rgba(255, 116, 23, 0.1)',
                border: '1px solid rgba(255, 116, 23, 0.3)',
                borderRadius: 4,
                padding: '2px 5px',
                fontWeight: 700,
              }}
              title="Open Command Palette"
            >
              <Command size={10} />K
            </div>
          </button>
        </div>

        {/* Right: Telemetry & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          {/* Environment Pill */}
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#25B981',
              background: 'rgba(37, 185, 129, 0.1)',
              border: '1px solid rgba(37, 185, 129, 0.3)',
              padding: '3px 8px',
              borderRadius: 4,
              letterSpacing: '0.04em',
            }}
          >
            PROD • AIRGAP READY
          </span>

          {/* Live Subsystem Indicator */}
          <Link
            to="/app/system-health"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              color: '#25B981',
              textDecoration: 'none',
              padding: '4px 8px',
              borderRadius: 4,
              background: '#121A15',
            }}
            title="System Health: 100% Operational"
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25B981', animation: 'pulse-dot 2s infinite' }} />
            99.9% Uptime
          </Link>

          {/* Replay 8s Cinematic Launch Video */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('cipherx:replay-intro'))}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF7417',
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
            }}
            title="Replay 8-Second Cinematic Launch Video"
            aria-label="Replay Launch Video"
          >
            <Film size={16} />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setNotificationsOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#AAB2A8',
              cursor: 'pointer',
              padding: 6,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#FF7417',
              }}
            />
          </button>

          {/* User Profile Avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#FF7417',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 800,
              color: '#FFFFFF',
              boxShadow: '0 0 10px rgba(255, 116, 23, 0.4)',
              cursor: 'pointer',
            }}
            title={`Logged in as ${user?.username || 'Admin'}`}
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </header>

      {/* Modals & Drawers */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <NotificationDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
