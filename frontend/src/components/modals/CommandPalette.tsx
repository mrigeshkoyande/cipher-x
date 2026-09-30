import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, Server, FileText, ShieldCheck, AlertTriangle,
  BookOpen, Network, FlaskConical, GitCompare, Zap, FileBarChart, Scroll,
  Settings, Activity, Lock, X, ArrowRight
} from 'lucide-react';

interface PaletteItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Frameworks' | 'Security';
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  to?: string;
  action?: () => void;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const items: PaletteItem[] = [
    { id: 'dash', category: 'Navigation', label: 'Go to Dashboard', sublabel: 'Fleet compliance & executive posture', icon: LayoutDashboard, to: '/app/dashboard' },
    { id: 'devs', category: 'Navigation', label: 'Go to Devices', sublabel: 'Network inventory & vendor platforms', icon: Server, to: '/app/devices' },
    { id: 'upload', category: 'Actions', label: 'Upload Configuration', sublabel: 'Ingest raw .cfg/.conf dumps', icon: FileText, to: '/app/configurations/upload' },
    { id: 'finds', category: 'Navigation', label: 'Open Findings', sublabel: 'Evidence-backed security violations', icon: AlertTriangle, to: '/app/findings' },
    { id: 'comp', category: 'Navigation', label: 'Open Compliance Matrix', sublabel: 'CIS, NIST 800-53, PCI-DSS, ISO', icon: ShieldCheck, to: '/app/compliance' },
    { id: 'graph', category: 'Navigation', label: 'Open Security Graph', sublabel: 'Interactive network topology & blast radius', icon: Network, to: '/app/security-graph' },
    { id: 'train', category: 'Navigation', label: 'Open AI Training Studio', sublabel: 'Review unknown command syntax', icon: BookOpen, to: '/app/training' },
    { id: 'sim', category: 'Navigation', label: 'Open What-If Simulator', sublabel: 'Predictive configuration sandbox', icon: FlaskConical, to: '/app/simulation' },
    { id: 'drift', category: 'Navigation', label: 'Open Drift Analysis', sublabel: 'Compare configuration revisions', icon: GitCompare, to: '/app/drift' },
    { id: 'remed', category: 'Navigation', label: 'Open Remediation Center', sublabel: 'Vendor CLI fixes & rollback playbooks', icon: Zap, to: '/app/remediation' },
    { id: 'rep', category: 'Navigation', label: 'Generate / View Reports', sublabel: 'Executive & technical PDF audits', icon: FileBarChart, to: '/app/reports' },
    { id: 'audit', category: 'Security', label: 'Open Audit Trail', sublabel: 'Immutable chronological event ledger', icon: Scroll, to: '/app/audit' },
    { id: 'integ', category: 'Security', label: 'Verify Evidence Integrity', sublabel: 'SHA-256 non-repudiation proofs', icon: Lock, to: '/app/integrity' },
    { id: 'health', category: 'Security', label: 'System Health & Latency', sublabel: 'Subsystem uptime monitoring', icon: Activity, to: '/app/system-health' },
    { id: 'sett', category: 'Navigation', label: 'Platform Settings', sublabel: 'Tenant configurations & API keys', icon: Settings, to: '/app/settings' },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.sublabel?.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          execute(filtered[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  const execute = (item: PaletteItem) => {
    onClose();
    if (item.to) {
      navigate(item.to);
    } else if (item.action) {
      item.action();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 9, 20, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: 16,
        paddingRight: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 600,
          background: '#0D1311',
          border: '1px solid #303833',
          borderRadius: 12,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 18px',
            borderBottom: '1px solid #232D27',
          }}
        >
          <Search size={18} color="#FF7417" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search sections, or jump to device..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F2F4EA',
              fontSize: 14,
            }}
          />
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#8C9390',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#8C9390', fontSize: 13 }}>
              No commands or sections found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => execute(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 6,
                    background: isSelected ? 'rgba(255, 116, 23, 0.12)' : 'transparent',
                    border: isSelected ? '1px solid rgba(255, 116, 23, 0.4)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: isSelected ? '#FF7417' : '#1C2420',
                        color: isSelected ? '#FFF' : '#AAB2A8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#F2F4EA' : '#C5CCC4' }}>
                        {item.label}
                      </div>
                      {item.sublabel && (
                        <div style={{ fontSize: 11, color: '#8C9390' }}>{item.sublabel}</div>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: isSelected ? '#FF7417' : '#687369',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid #1E2822',
            background: '#090E17',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
            color: '#687369',
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div>CIPHER-X Command Palette</div>
        </div>
      </div>
    </div>
  );
}
