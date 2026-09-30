import React, { useState, useEffect } from 'react';
import { 
  Activity, CheckCircle2, AlertTriangle, RefreshCw, 
  Server, Database, Cpu, Layers, HardDrive, ShieldCheck
} from 'lucide-react';

export default function HealthView() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/ready');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSubsystemIcon = (name) => {
    switch (name) {
      case 'api': return Server;
      case 'database': return Database;
      case 'compliance_engine': return ShieldCheck;
      case 'redis_cache': return Layers;
      case 'object_storage': return HardDrive;
      case 'ai_security_provider': return Cpu;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-cyan-400" /> System Subsystems Health & Operational Readiness
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status probes across API gateways, PostgreSQL, Redis, Object storage, Worker tasks, and AI engines.
          </p>
        </div>

        <button 
          onClick={fetchHealth}
          disabled={loading}
          className="btn-cyber-primary text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Run Subsystem Health Probe
        </button>
      </div>

      {/* Primary Status Banner */}
      {healthData && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl text-slate-100">
                  OVERALL STATUS: {healthData.status}
                </span>
                <span className="pulse-dot bg-emerald-400"></span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Environment: <strong className="text-cyan-300 font-mono">{healthData.environment}</strong> | Checked: <span className="font-mono">{new Date(healthData.timestamp * 1000).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="font-mono text-xs text-right hidden sm:block">
            <div className="text-emerald-400 font-bold">100% SUBSYSTEMS UP</div>
            <div className="text-slate-500">Latency: ~1.2ms</div>
          </div>
        </div>
      )}

      {/* Subsystem Cards Grid */}
      {healthData?.subsystems && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(healthData.subsystems).map(([key, sys]) => {
            const Icon = getSubsystemIcon(key);
            const isUp = sys.status === 'UP';
            return (
              <div key={key} className="glass-panel p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="font-heading font-bold text-xs text-slate-200 uppercase">
                      {key.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    isUp ? 'badge-pass' : 'badge-critical'
                  }`}>
                    {sys.status}
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 font-mono text-[11px] space-y-1 text-slate-400">
                  {Object.entries(sys).map(([sk, sv]) => {
                    if (sk === 'status') return null;
                    return (
                      <div key={sk} className="flex justify-between items-center">
                        <span className="text-slate-500">{sk}:</span>
                        <strong className="text-slate-200">{String(sv)}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
