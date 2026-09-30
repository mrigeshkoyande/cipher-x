import React, { useState, useEffect } from 'react';
import { 
  Shield, BookOpen, Filter, Search, CheckCircle2, 
  XCircle, AlertTriangle, HelpCircle, Layers, ChevronRight, Terminal, Info, Calculator
} from 'lucide-react';

export default function ComplianceView({ selectedControlId, onSelectControl, onNavigateRemediation }) {
  const [frameworks, setFrameworks] = useState([]);
  const [controls, setControls] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [selectedControl, setSelectedControl] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplianceData();
  }, []);

  const fetchComplianceData = async () => {
    try {
      const [fwRes, ctrlRes] = await Promise.all([
        fetch('/api/v1/compliance/frameworks'),
        fetch('/api/v1/compliance/controls')
      ]);
      if (fwRes.ok && ctrlRes.ok) {
        const fwData = await fwRes.json();
        const ctrlData = await ctrlRes.json();
        setFrameworks(fwData);
        setControls(ctrlData);
        if (fwData.length > 0) setSelectedFramework(fwData[0]);
        if (selectedControlId) {
          const matched = ctrlData.find(c => c.id === selectedControlId);
          if (matched) setSelectedControl(matched);
        } else if (ctrlData.length > 0) {
          setSelectedControl(ctrlData[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredControls = controls.filter(c => {
    const matchCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchSev = severityFilter === 'ALL' || c.severity === severityFilter;
    const matchSearch = searchTerm === '' || 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSev && matchSearch;
  });

  const categories = ['ALL', ...new Set(controls.map(c => c.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header & Framework Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-cyan-400" /> Compliance Frameworks & Control Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven control specifications with normalized AST fact extractors and formal regulatory mappings.
          </p>
        </div>

        {/* Explainable Score Modal Trigger */}
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3">
          <Calculator className="w-5 h-5 text-cyan-400" />
          <div className="text-xs">
            <div className="font-semibold text-cyan-300">Transparent Scoring Engine</div>
            <div className="text-slate-400 text-[11px]">Formula: (Pass × 1.0 + Warn × 0.5) / Total Applicable</div>
          </div>
        </div>
      </div>

      {/* Framework Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {frameworks.map((fw) => {
          const isSelected = selectedFramework?.id === fw.id;
          return (
            <div
              key={fw.id}
              onClick={() => setSelectedFramework(fw)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">
                  {fw.id}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{fw.version}</span>
              </div>
              <h4 className="font-heading font-bold text-xs text-slate-200 line-clamp-1">{fw.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{fw.description}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Area: Controls Grid & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Control List (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter controls by ID, title, keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 max-w-[150px]"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* List of Controls */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredControls.map((ctrl) => {
              const isSelected = selectedControl?.id === ctrl.id;
              // Check if mapped in selected framework
              const mappedRef = Object.entries(selectedFramework?.control_mappings || {}).find(([k, v]) => v === ctrl.id)?.[0];

              return (
                <div
                  key={ctrl.id}
                  onClick={() => setSelectedControl(ctrl)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/30'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{ctrl.id}</span>
                      {mappedRef && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {mappedRef}
                        </span>
                      )}
                    </div>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      ctrl.severity === 'CRITICAL' ? 'badge-critical' : (ctrl.severity === 'HIGH' ? 'badge-high' : 'badge-medium')
                    }`}>
                      {ctrl.severity}
                    </span>
                  </div>
                  <h4 className="font-medium text-xs text-slate-200 line-clamp-1">{ctrl.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ctrl.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Control Specification (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 space-y-4">
          {selectedControl ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-sm font-bold text-cyan-400">{selectedControl.id}</span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold ${
                    selectedControl.severity === 'CRITICAL' ? 'badge-critical' : (selectedControl.severity === 'HIGH' ? 'badge-high' : 'badge-medium')
                  }`}>
                    {selectedControl.severity} SEVERITY
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-100">{selectedControl.title}</h3>
                <div className="text-xs text-slate-400 mt-1 font-mono">Category: {selectedControl.category}</div>
              </div>

              {/* Description & Rationale */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono text-slate-300 font-semibold uppercase">Description</h5>
                <p className="text-xs text-slate-300 bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                  {selectedControl.description}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-mono text-slate-300 font-semibold uppercase">Security Rationale</h5>
                <p className="text-xs text-slate-400 bg-slate-900/70 p-3 rounded-lg border border-slate-800">
                  {selectedControl.rationale}
                </p>
              </div>

              {/* Data-Driven AST Evaluator Definition */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono text-slate-300 font-semibold uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Evaluation Rule Logic
                </h5>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5">
                  <div className="text-slate-400">
                    <span className="text-slate-500">Normalized Fact:</span> <strong className="text-cyan-300">{selectedControl.normalized_fact_key}</strong>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">Operator:</span> <strong className="text-amber-300">{selectedControl.operator}</strong>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">Expected Value:</span> <strong className="text-emerald-300">{String(selectedControl.expected_value)}</strong>
                  </div>
                  {selectedControl.failure_message && (
                    <div className="text-red-400/90 text-[11px] pt-1 border-t border-slate-900">
                      Failure Trigger: "{selectedControl.failure_message}"
                    </div>
                  )}
                </div>
              </div>

              {/* Remediation Link Button */}
              {selectedControl.remediation_ref && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateRemediation && onNavigateRemediation('cisco', selectedControl.id)}
                    className="btn-cyber-primary w-full justify-center text-xs"
                  >
                    View Multi-Vendor Remediation Playbook
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Select a control to view specification
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
