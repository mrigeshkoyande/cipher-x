import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, Bell, Search, Server, Cpu, 
  Terminal, FileText, CheckCircle2, AlertTriangle, 
  GitCommit, Network, HelpCircle, Layers, Check, ExternalLink, Lock
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, unreadCount, onSearch, healthStatus }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/v1/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/v1/notifications/read-all', { method: 'POST' });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Analytics & Fleet Risk', icon: Activity },
    { id: 'compliance', label: 'Compliance Frameworks', icon: Shield },
    { id: 'devices', label: 'Devices & Configs', icon: Server },
    { id: 'drift', label: 'Drift Intelligence', icon: GitCommit },
    { id: 'graph', label: 'Security Graph', icon: Network },
    { id: 'whatif', label: 'What-If Simulator', icon: Cpu },
    { id: 'remediation', label: 'Remediation & Guardrails', icon: Terminal },
    { id: 'evidence', label: 'Evidence Explorer', icon: Layers },
    { id: 'assistant', label: 'AI Security Assistant', icon: HelpCircle },
    { id: 'audit', label: 'Audit & Blockchain', icon: Lock },
    { id: 'reports', label: 'Reports & Attestations', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400/50">
            <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                CIPHER-X
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase font-semibold tracking-wide">
                v3.0 ENTERPRISE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 tracking-tight font-medium">
              Network Cybersecurity & Compliance Intelligence
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search devices, controls (e.g. CTRL-SSH-01, Telnet), findings..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
          />
        </div>

        {/* Status Pills & Profile */}
        <div className="flex items-center gap-3">
          {/* Health Status Pill */}
          <div 
            onClick={() => setActiveTab('health')}
            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium hover:bg-emerald-500/20 transition"
            title="Click to view full subsystem health inspection"
          >
            <span className="pulse-dot bg-emerald-400"></span>
            <span>SYSTEM: {healthStatus?.status || 'READY'}</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel p-4 z-50 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="font-heading font-semibold text-sm">Security Alerts & Events</span>
                  </div>
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-slate-400 text-center py-4">No active security alerts</div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-lg border text-xs transition ${
                          n.read ? 'bg-slate-900/40 border-slate-800/60 opacity-70' : 'bg-slate-900/90 border-cyan-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-slate-200">{n.title}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                            n.severity === 'CRITICAL' ? 'badge-critical' : (n.severity === 'HIGH' ? 'badge-high' : 'badge-low')
                          }`}>
                            {n.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200">Security Admin</div>
              <div className="text-[10px] font-mono text-cyan-400">CISO / SOC Lead</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
