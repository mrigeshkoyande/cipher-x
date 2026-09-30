import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle, AlertTriangle, HelpCircle, 
  TrendingUp, TrendingDown, Server, Cpu, Layers, ExternalLink, 
  FileText, ArrowUpRight, Flame, ShieldCheck, ChevronRight
} from 'lucide-react';

export default function DashboardView({ onNavigateDevice, onNavigateControl, onNavigateTab }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/v1/analytics/organization-risk');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-sm font-mono text-cyan-400">Loading Enterprise Telemetry & Risk Metrics...</div>
        </div>
      </div>
    );
  }

  const sev = analytics.severity_distribution || {};
  const score = analytics.average_compliance_score || 0;
  const grade = score >= 90 ? 'A' : (score >= 80 ? 'B' : (score >= 70 ? 'C' : 'D'));

  return (
    <div className="space-y-6">
      {/* Top Banner & Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Score Card */}
        <div className="glass-panel p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>FLEET COMPLIANCE SCORE</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">EXPLAINABLE</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {score}%
            </span>
            <span className={`text-xl font-bold font-mono px-2 py-0.5 rounded ${
              grade === 'A' ? 'badge-pass' : (grade === 'B' ? 'badge-medium' : 'badge-critical')
            }`}>
              GRADE {grade}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <span>Fleet of {analytics.total_devices} Managed Devices</span>
            <button 
              onClick={() => onNavigateTab('compliance')}
              className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              Formula Details <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Critical Findings Card */}
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>CRITICAL FINDINGS</span>
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold font-heading text-red-400">
              {sev.CRITICAL || 0}
            </span>
            <span className="text-xs font-mono text-slate-400">
              + {sev.HIGH || 0} High Severity
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <span className="text-red-400/90 font-medium">Requires Immediate Remediation</span>
            <button 
              onClick={() => onNavigateTab('remediation')}
              className="text-red-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              Playbooks <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Total Findings & Unmapped */}
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>TOTAL FINDINGS</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold font-heading text-slate-100">
              {analytics.total_findings}
            </span>
            <span className="text-xs font-mono text-purple-400 badge-unknown px-2 py-0.5 rounded">
              {sev.UNKNOWN || 0} UNKNOWN / AUDIT
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <span>No hidden / suppressed rules</span>
            <span className="text-[11px] text-slate-500 font-mono">100% Provenance</span>
          </div>
        </div>

        {/* Audit Integrity & Blockchain */}
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>AUDIT INTEGRITY PROOF</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-heading text-emerald-400 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              VALID & ANCHORED
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
              SHA-256 Hash Chained
            </span>
            <button 
              onClick={() => onNavigateTab('audit')}
              className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              Verify Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Framework Coverage & Top Failed Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Framework Compliance Breakdown */}
        <div className="glass-panel p-5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Framework Coverage
              </h3>
              <span className="text-[11px] font-mono text-slate-400">5 Standards</span>
            </div>
            <div className="space-y-3.5">
              {analytics.framework_coverage_matrix?.map((fw) => (
                <div key={fw.framework_id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">{fw.name}</span>
                    <span className="font-mono font-bold text-cyan-400">{fw.average_score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        fw.average_score >= 85 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 
                        (fw.average_score >= 70 ? 'bg-gradient-to-r from-amber-500 to-cyan-500' : 'bg-gradient-to-r from-red-500 to-amber-500')
                      }`}
                      style={{ width: `${Math.max(5, fw.average_score)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigateTab('compliance')}
            className="btn-cyber-secondary w-full justify-center text-xs mt-4"
          >
            Explore Controls Library
          </button>
        </div>

        {/* Top Failed Controls Across Enterprise */}
        <div className="glass-panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Enterprise Top Failed Controls
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Prioritized by fleet failure frequency and severity weight</p>
            </div>
            <button 
              onClick={() => onNavigateTab('whatif')}
              className="btn-cyber-primary text-xs py-1 px-3"
            >
              Simulate Fixes
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-2.5">CONTROL ID</th>
                  <th className="pb-2.5">CONTROL TITLE</th>
                  <th className="pb-2.5">SEVERITY</th>
                  <th className="pb-2.5 text-center">FAILED DEVICES</th>
                  <th className="pb-2.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analytics.top_failed_controls?.map((ctrl) => (
                  <tr key={ctrl.control_id} className="hover:bg-slate-900/40 transition">
                    <td className="py-2.5 font-mono font-bold text-cyan-400">{ctrl.control_id}</td>
                    <td className="py-2.5 font-medium text-slate-200 max-w-xs truncate">{ctrl.title}</td>
                    <td className="py-2.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        ctrl.severity === 'CRITICAL' ? 'badge-critical' : (ctrl.severity === 'HIGH' ? 'badge-high' : 'badge-medium')
                      }`}>
                        {ctrl.severity}
                      </span>
                    </td>
                    <td className="py-2.5 text-center font-mono font-bold text-slate-300">
                      {ctrl.failed_count}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onNavigateControl && onNavigateControl(ctrl.control_id)}
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] hover:underline inline-flex items-center gap-1"
                      >
                        Inspect <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Fleet Inventory Hot Spots Table */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" /> Critical Device Hot Spots
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Ranked by aggregate calculated risk score (0-100 scale)</p>
          </div>
          <button 
            onClick={() => onNavigateTab('devices')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            View All {analytics.total_devices} Devices <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.device_risk_fleet?.slice(0, 6).map((dev) => (
            <div 
              key={dev.device_id}
              onClick={() => onNavigateDevice && onNavigateDevice(dev.device_id)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                  {dev.vendor}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  dev.risk_level === 'CRITICAL' ? 'badge-critical' : (dev.risk_level === 'HIGH' ? 'badge-high' : 'badge-medium')
                }`}>
                  RISK: {dev.risk_score} PTS
                </span>
              </div>
              <h4 className="font-heading font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition truncate">
                {dev.device_name}
              </h4>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                <span>Compliance: <strong className="text-slate-200">{dev.compliance_score}%</strong> ({dev.grade})</span>
                <span>Findings: <strong className="text-red-400">{dev.total_findings}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
