import React, { useState, useEffect } from 'react';
import { 
  GitCommit, AlertTriangle, CheckCircle, ShieldAlert, 
  ArrowRight, RefreshCw, FileDiff, ShieldCheck, Flame
} from 'lucide-react';

export default function DriftView({ selectedDeviceId }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [driftData, setDriftData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch('/api/v1/devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
        // Find device with multi-version (e.g. Juniper Edge)
        const multiVerDev = data.find(d => d.id === 'dev-juniper-edge-01') || data[0];
        if (multiVerDev) {
          setSelectedDevice(multiVerDev);
          fetchDeviceDrift(multiVerDev.id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceDrift = async (deviceId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/drift/device/${deviceId}`);
      if (res.ok) {
        const data = await res.json();
        setDriftData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
            <GitCommit className="w-6 h-6 text-cyan-400" /> Semantic Security Drift Intelligence
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Differentiates cosmetic configuration diffs from critical security posture regressions and policy violations.
          </p>
        </div>

        {/* Device Switcher */}
        <select
          value={selectedDevice?.id || ''}
          onChange={(e) => {
            const dev = devices.find(d => d.id === e.target.value);
            if (dev) {
              setSelectedDevice(dev);
              fetchDeviceDrift(dev.id);
            }
          }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
        >
          {devices.map(d => (
            <option key={d.id} value={d.id}>{d.name} ({d.vendor.toUpperCase()})</option>
          ))}
        </select>
      </div>

      {/* Drift Summary Cards */}
      {driftData && driftData.has_drift !== false && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4">
            <div className="text-xs text-slate-400 font-mono mb-1">DRIFT SEVERITY</div>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-extrabold font-heading px-2.5 py-0.5 rounded uppercase ${
                driftData.drift_severity === 'CRITICAL' ? 'badge-critical' : 
                (driftData.drift_severity === 'HIGH' ? 'badge-high' : 'badge-medium')
              }`}>
                {driftData.drift_severity || 'NONE'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              {driftData.drift_items?.length || 0} Security Changes Detected
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="text-xs text-slate-400 font-mono mb-1">COMPLIANCE IMPACT</div>
            <div className="flex items-baseline gap-2 font-heading">
              <span className="text-2xl font-extrabold text-slate-100">{driftData.score_before}%</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-2xl font-extrabold text-red-400">{driftData.score_after}%</span>
            </div>
            <div className="text-[11px] font-mono text-red-400 mt-1">
              Delta: {driftData.score_delta}% regression
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="text-xs text-slate-400 font-mono mb-1">RISK SCORE DELTA</div>
            <div className="flex items-baseline gap-2 font-heading">
              <span className="text-2xl font-extrabold text-slate-100">{driftData.risk_before} pts</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-2xl font-extrabold text-red-400">{driftData.risk_after} pts</span>
            </div>
            <div className="text-[11px] font-mono text-red-400 mt-1">
              Delta: +{driftData.risk_delta} pts risk increase
            </div>
          </div>

          <div className="glass-panel p-4">
            <div className="text-xs text-slate-400 font-mono mb-1">COSMETIC VS SECURITY</div>
            <div className="text-lg font-bold font-heading text-slate-200">
              {driftData.drift_items?.length || 0} Security / {driftData.cosmetic_changes_count || 0} Cosmetic
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Comments/descriptions filtered out
            </div>
          </div>
        </div>
      )}

      {/* Main Drift Details Table */}
      {driftData && driftData.drift_items?.length > 0 ? (
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Security-Relevant Parameter Changes
            </h3>
            <span className="font-mono text-xs text-slate-400">
              Comparing: <strong className="text-slate-200">{driftData.baseline_version}</strong> ➔ <strong className="text-cyan-400">{driftData.current_version}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {driftData.drift_items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      item.security_significance === 'CRITICAL' ? 'badge-critical' : (item.security_significance === 'HIGH' ? 'badge-high' : 'badge-medium')
                    }`}>
                      {item.security_significance}
                    </span>
                    <span className="font-semibold text-xs text-slate-200">{item.description}</span>
                  </div>
                  <span className="font-mono text-xs text-red-400">+{item.risk_delta} Risk Pts</span>
                </div>

                {/* Before vs After Snippet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Baseline State (Compliant)</div>
                    <div className="text-emerald-400">{item.before_snippet}</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-red-950/40">
                    <div className="text-[10px] text-red-500 uppercase font-semibold mb-1">Drifted State (Insecure)</div>
                    <div className="text-red-400">{item.after_snippet}</div>
                  </div>
                </div>

                {/* Affected Controls */}
                {item.affected_controls?.length > 0 && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <span>Affected Controls:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.affected_controls.map(c => (
                        <span key={c} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Unified Diff View */}
          {driftData.raw_diff && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <h4 className="font-mono text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileDiff className="w-3.5 h-3.5 text-cyan-400" /> Unified CLI Diff
              </h4>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-xs text-slate-300 max-h-52 overflow-y-auto">
                {driftData.raw_diff}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="font-heading font-bold text-base text-slate-100">No Security Drift Detected</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {driftData?.message || 'Configuration state is synchronized with approved compliance baseline.'}
          </p>
        </div>
      )}
    </div>
  );
}
