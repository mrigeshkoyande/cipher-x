import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Automated CIS Benchmark Audit Completed',
      time: '12m ago',
      desc: '24 fleet devices analyzed. 4 critical findings flagged for review.',
      type: 'info',
    },
    {
      id: 'notif-2',
      title: 'Configuration Drift Detected: CORE-SW-01',
      time: '34m ago',
      desc: 'Line 219 modified from "transport input ssh" to "telnet".',
      type: 'critical',
    },
    {
      id: 'notif-3',
      title: 'New AI Unknown Syntax Rule Awaiting Review',
      time: '1h ago',
      desc: 'Proprietary vendor command "crypto sec-p" captured in Training Studio.',
      type: 'warning',
    },
    {
      id: 'notif-4',
      title: 'Cryptographic SHA-256 Ledger Synchronized',
      time: '3h ago',
      desc: 'All audit evidence verified with zero integrity discrepancies.',
      type: 'success',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 9, 20, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          background: '#0D1311',
          borderLeft: '1px solid #303833',
          height: '100%',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #232D27' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F2F4EA', fontWeight: 700, fontSize: 15 }}>
            <Bell size={17} color="#FF7417" /> Notifications
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8C9390', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                background: '#121A15',
                border: '1px solid #232D27',
                borderRadius: 8,
                padding: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#F2F4EA' }}>{n.title}</span>
                <span style={{ fontSize: 10, color: '#687369' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: 12, color: '#AAB2A8', margin: 0, lineHeight: 1.4 }}>{n.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: 14, borderTop: '1px solid #232D27', textAlign: 'center' }}>
          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ width: '100%', fontSize: 12, justifyContent: 'center' }}
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
}
