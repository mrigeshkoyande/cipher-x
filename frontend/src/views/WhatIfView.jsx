import React, { useState, useEffect } from 'react';
import { 
  Cpu, Play, ArrowRight, CheckCircle2, ShieldCheck, 
  TrendingUp, TrendingDown, RefreshCw, Zap, Sliders, ChevronRight
} from 'lucide-react';

export default function WhatIfView({ selectedDeviceId, onNavigateTab }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [customPatch, setCustomPatch] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [devRes, scenRes] = await Promise.all([
        fetch('/api/v1/devices'),
        fetch('/api/v1/whatif/scenarios')
      ]);
      if (devRes.ok && scenRes.ok) {
        const devData = await devRes.json();
        const scenData = await scenRes.json();
        setDevices(devData);
        setScenarios(scenData);
        if (devData.length > 0) setSelectedDevice(devData[0]);
        if (scenData.length > 0) setSelectedScenario(scenData[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunSimulation = async () => {
    if (!selectedDevice) return;
    setSimulating(true);
    try {
      const res = await fetch('/api/v1/whatif/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: selectedDevice.id,
          scenario_id: selectedScenario?.id,
          custom_patch: customPatch.trim() ? customPatch : null
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-cyan-400" /> What-If Configuration Simulation Engine
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Predictively forecast compliance score gains, risk reduction, and affected regulatory controls before changing production equipment.
        </p>
      </div>

      {/* Configuration & Scenario Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulation Controls (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 font-semibold">1. SELECT TARGET DEVICE</label>
            <select
              value={selectedDevice?.id || ''}
              onChange={(e) => setSelectedDevice(devices.find(d => d.id === e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.vendor.toUpperCase()} — {d.compliance_score}%)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 font-semibold">2. SELECT POLICY MUTATION SCENARIO</label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {scenarios.map((scen) => {
                const isSelected = selectedScenario?.id === scen.id;
                return (
                  <div
                    key={scen.id}
                    onClick={() => { setSelectedScenario(scen); setCustomPatch(''); }}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold font-heading mb-0.5">
                      <span>{scen.name}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{scen.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{scen.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Patch Input */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1 font-semibold">
              OR CUSTOM CLI PATCH (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. no snmp-server community public\nip ssh version 2"
              value={customPatch}
              onChange={(e) => setCustomPatch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="btn-cyber-primary w-full justify-center text-xs py-3"
          >
            {simulating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950" />
            )}
            Run Predictive Simulation Forecast
          </button>
        </div>

        {/* Right Column: Predictive Impact & Delta Forecast (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 space-y-5">
          {simulationResult ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" /> Simulation Outcome Forecast
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Target: <strong className="text-slate-200">{selectedDevice?.name}</strong>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  SIMULATION COMPLETE
                </span>
              </div>

              {/* Key Delta Metrics */}
              <div className="grid grid-cols-2 gap-4">
                {/* Compliance Score Delta */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">PROJECTED COMPLIANCE</div>
                  <div className="flex items-baseline gap-2 font-heading">
                    <span className="text-2xl font-extrabold text-slate-400">
                      {simulationResult.baseline.compliance_score}%
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="text-3xl font-extrabold text-emerald-400">
                      {simulationResult.projected.compliance_score}%
                    </span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 mt-1 font-semibold">
                    +{simulationResult.deltas.compliance_score_delta}% Compliance Improvement
                  </div>
                </div>

                {/* Risk Score Delta */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] font-mono text-slate-400 mb-1">PROJECTED FLEET RISK</div>
                  <div className="flex items-baseline gap-2 font-heading">
                    <span className="text-2xl font-extrabold text-slate-400">
                      {simulationResult.baseline.risk_score} pts
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="text-3xl font-extrabold text-cyan-400">
                      {simulationResult.projected.risk_score} pts
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-400 mt-1 font-semibold">
                    {simulationResult.deltas.risk_score_delta} pts Risk Reduction
                  </div>
                </div>
              </div>

              {/* Resolved Findings List */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-slate-300 font-semibold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Resolved Findings ({simulationResult.resolved_findings.length})
                </h4>
                {simulationResult.resolved_findings.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-lg">No findings resolved by this patch.</div>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {simulationResult.resolved_findings.map((rf) => (
                      <div key={rf.control_id} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="font-mono font-bold text-emerald-300">{rf.control_id}</span>
                          <span className="text-slate-200 truncate max-w-sm">{rf.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400 font-semibold">FIXED</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onNavigateTab && onNavigateTab('remediation')}
                className="btn-cyber-secondary w-full justify-center text-xs"
              >
                View Approved Remediation Playbooks
              </button>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-xs flex flex-col items-center gap-2">
              <Sliders className="w-10 h-10 text-slate-600" />
              <span>Select a scenario on the left and click "Run Predictive Simulation Forecast"</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
