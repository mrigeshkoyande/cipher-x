import React, { useState, useEffect } from 'react';
import { 
  Server, Plus, Upload, CheckCircle2, XCircle, AlertTriangle, 
  HelpCircle, Eye, GitCommit, FileText, ChevronRight, Shield, RefreshCw
} from 'lucide-react';

export default function DevicesView({ selectedDeviceId, onSelectDevice, onNavigateTab }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeConfigTab, setActiveConfigTab] = useState('findings');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [versionLabel, setVersionLabel] = useState('v2.0');
  const [changeReason, setChangeReason] = useState('Scheduled configuration update');
  const [uploading, setUploading] = useState(false);
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
        if (selectedDeviceId) {
          fetchDeviceDetail(selectedDeviceId);
        } else if (data.length > 0) {
          fetchDeviceDetail(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceDetail = async (id) => {
    try {
      const res = await fetch(`/api/v1/devices/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedDevice(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadConfig = async () => {
    if (!uploadText.trim() || !selectedDevice) return;
    setUploading(true);
    try {
      const res = await fetch('/api/v1/configurations/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: selectedDevice.id,
          raw_config: uploadText,
          version_label: versionLabel,
          change_reason: changeReason
        })
      });
      if (res.ok) {
        setShowUploadModal(false);
        setUploadText('');
        fetchDevices();
        fetchDeviceDetail(selectedDevice.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const evalData = selectedDevice?.latest_evaluation || {};
  const findings = evalData.findings || [];
  const passed = evalData.passed_controls || [];
  const configs = selectedDevice?.configurations || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
            <Server className="w-6 h-6 text-cyan-400" /> Managed Network Fleet & Config Repository
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time compliance evaluations, configuration revision history, and exact line-level evidence.
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-cyber-primary text-xs self-start"
        >
          <Upload className="w-4 h-4" /> Upload Configuration Revision
        </button>
      </div>

      {/* Main Grid: Device List & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Device Inventory (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-heading font-semibold text-xs text-slate-300">DEVICES ({devices.length})</span>
            <button onClick={fetchDevices} className="text-slate-400 hover:text-cyan-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {devices.map((dev) => {
              const isSelected = selectedDevice?.id === dev.id;
              return (
                <div
                  key={dev.id}
                  onClick={() => fetchDeviceDetail(dev.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/30'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                      {dev.vendor}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      dev.grade === 'A' ? 'badge-pass' : (dev.grade === 'B' ? 'badge-medium' : 'badge-critical')
                    }`}>
                      {dev.compliance_score}% (Gr. {dev.grade})
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-slate-100 truncate">{dev.name}</h4>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center justify-between">
                    <span>{dev.ip_address}</span>
                    <span className="text-red-400">{dev.critical_findings || 0} Critical</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Device Detail & Findings (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-5 space-y-4">
          {selectedDevice ? (
            <div className="space-y-4">
              {/* Device Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-xl text-slate-100">{selectedDevice.name}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 uppercase font-bold">
                      {selectedDevice.vendor}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>IP: <strong className="text-slate-200 font-mono">{selectedDevice.ip_address}</strong></span>
                    <span>Model: <strong className="text-slate-200">{selectedDevice.model}</strong></span>
                    <span>Location: <strong className="text-slate-200">{selectedDevice.location}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <div className="text-right font-mono">
                    <div className="text-2xl font-extrabold text-cyan-400">{evalData.compliance_score}%</div>
                    <div className="text-[10px] text-slate-400 uppercase">Risk Score: {evalData.device_risk_score} pts</div>
                  </div>
                </div>
              </div>

              {/* Explainable Score Explanation Banner */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-cyan-500/20 text-xs text-slate-300">
                <span className="font-semibold text-cyan-300">Explainable Evaluation: </span>
                {evalData.score_explanation || "Evaluation metrics computed dynamically."}
              </div>

              {/* View Subtabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveConfigTab('findings')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    activeConfigTab === 'findings' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Findings ({findings.length})
                </button>
                <button
                  onClick={() => setActiveConfigTab('passed')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    activeConfigTab === 'passed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Passed Controls ({passed.length})
                </button>
                <button
                  onClick={() => setActiveConfigTab('history')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    activeConfigTab === 'history' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Config Versions ({configs.length})
                </button>
              </div>

              {/* Tab: Non-compliant Findings */}
              {activeConfigTab === 'findings' && (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {findings.length === 0 ? (
                    <div className="text-center py-12 text-emerald-400 text-xs flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8" />
                      <span>Zero non-compliant findings! Device meets 100% of applicable controls.</span>
                    </div>
                  ) : (
                    findings.map((f) => (
                      <div key={f.control_id} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-cyan-400">{f.control_id}</span>
                            <span className="font-medium text-xs text-slate-200">{f.title}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            f.severity === 'CRITICAL' ? 'badge-critical' : (f.severity === 'HIGH' ? 'badge-high' : 'badge-medium')
                          }`}>
                            {f.severity}
                          </span>
                        </div>
                        <p className="text-xs text-red-400/90 bg-red-950/20 p-2 rounded border border-red-900/30">
                          {f.explanation}
                        </p>
                        {f.remediation && (
                          <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Remediation: <strong className="text-slate-300">{f.remediation.objective}</strong></span>
                            <button
                              onClick={() => onNavigateTab && onNavigateTab('remediation')}
                              className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                            >
                              CLI Playbook <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab: Passed Controls */}
              {activeConfigTab === 'passed' && (
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {passed.map((p) => (
                    <div key={p.control_id} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-mono font-bold text-slate-300">{p.control_id}</span>
                        <span className="text-slate-300 truncate max-w-md">{p.title}</span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400 badge-pass px-2 py-0.5 rounded">PASSED</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Config History */}
              {activeConfigTab === 'history' && (
                <div className="space-y-3">
                  {configs.map((c) => (
                    <div key={c.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-cyan-400">{c.version_label}</span>
                        <span className="text-slate-500">{new Date(c.created_at * 1000).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">Author: {c.author} — Reason: {c.change_reason}</p>
                      <pre className="bg-slate-950 p-2.5 rounded text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto border border-slate-900">
                        {c.raw_config}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select a device to inspect compliance posture
            </div>
          )}
        </div>
      </div>

      {/* Upload Configuration Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 max-w-2xl w-full space-y-4 shadow-2xl border-cyan-500/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" /> Upload Configuration for {selectedDevice?.name}
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Version Label</label>
                <input
                  type="text"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Change Reason</label>
                <input
                  type="text"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Raw Configuration Text (CLI syntax)</label>
              <textarea
                rows={10}
                placeholder="Paste Cisco, Juniper, Fortinet, or Palo Alto configuration here..."
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="btn-cyber-secondary text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleUploadConfig}
                disabled={uploading || !uploadText.trim()}
                className="btn-cyber-primary text-xs"
              >
                {uploading ? 'Processing & Evaluating...' : 'Upload & Trigger Compliance Scan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
