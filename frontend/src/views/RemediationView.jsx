import React, { useState, useEffect } from 'react';
import { 
  Terminal, ShieldAlert, CheckCircle2, RotateCcw, 
  Copy, Check, AlertTriangle, ShieldCheck, Lock, ExternalLink
} from 'lucide-react';

export default function RemediationView({ targetVendor = 'cisco', targetControlId = 'CTRL-TELNET-01' }) {
  const [vendor, setVendor] = useState(targetVendor);
  const [controlId, setControlId] = useState(targetControlId);
  const [remediation, setRemediation] = useState(null);
  const [controls, setControls] = useState([]);
  const [copied, setCopied] = useState(false);
  const [previewResult, setPreviewResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchControls();
  }, []);

  useEffect(() => {
    if (vendor && controlId) {
      fetchRemediation(vendor, controlId);
    }
  }, [vendor, controlId]);

  const fetchControls = async () => {
    try {
      const res = await fetch('/api/v1/compliance/controls');
      if (res.ok) {
        const data = await res.json();
        setControls(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRemediation = async (v, c) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/remediation/${v}/${c}`);
      if (res.ok) {
        const data = await res.json();
        setRemediation(data);
      } else {
        setRemediation(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDryRunPreview = async () => {
    try {
      const res = await fetch('/api/v1/remediation/dry-run-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendor, control_id: controlId })
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewResult(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
          <Terminal className="w-6 h-6 text-cyan-400" /> Multi-Vendor Remediation Intelligence & Guardrails
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hardened CLI commands, deterministic pre/post verification assertions, rollback scripts, and manual safety gates.
        </p>
      </div>

      {/* Selector Filters */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-4">
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1">TARGET VENDOR SYNTAX</label>
          <div className="flex items-center gap-2">
            {['cisco', 'juniper', 'fortinet', 'palo_alto'].map((v) => (
              <button
                key={v}
                onClick={() => setVendor(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                  vendor === v 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {v.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[240px]">
          <label className="text-xs font-mono text-slate-400 block mb-1">SELECT SECURITY CONTROL</label>
          <select
            value={controlId}
            onChange={(e) => setControlId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {controls.map(c => (
              <option key={c.id} value={c.id}>{c.id}: {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Safety Policy Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300">
          <strong className="text-amber-300 font-semibold block mb-0.5">CRITICAL SAFETY GUARDRAIL ENFORCED:</strong>
          Cipher-X strictly forbids automated configuration deployment against network infrastructure. All remediations provide pre-formatted CLI scripts, rollback procedures, and verification checks for review and execution inside approved maintenance windows.
        </div>
      </div>

      {/* Remediation Playbook Card */}
      {remediation ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Playbook Code (8 cols) */}
          <div className="lg:col-span-8 glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">{remediation.control_id}</span>
                <h3 className="font-heading font-bold text-base text-slate-100">{remediation.objective}</h3>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-bold">
                Impact: {remediation.impact_level}
              </span>
            </div>

            {/* REMEDIATION CLI COMMANDS */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> REMEDIATION CLI COMMANDS ({remediation.vendor.toUpperCase()})
                </span>
                <button
                  onClick={() => handleCopy(remediation.cli_command)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Script'}
                </button>
              </div>
              <pre className="bg-slate-950 p-3.5 rounded-lg border border-cyan-500/30 text-xs font-mono text-cyan-200 overflow-x-auto selection:bg-cyan-500 selection:text-black shadow-inner">
                {remediation.cli_command}
              </pre>
            </div>

            {/* BEFORE VS AFTER STATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-red-400 font-semibold">BEFORE (CURRENT NON-COMPLIANT STATE)</span>
                <pre className="bg-slate-950 p-2.5 rounded border border-red-900/40 text-xs font-mono text-red-300 overflow-x-auto">
                  {remediation.before_example}
                </pre>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">AFTER (EXPECTED COMPLIANT STATE)</span>
                <pre className="bg-slate-950 p-2.5 rounded border border-emerald-900/40 text-xs font-mono text-emerald-300 overflow-x-auto">
                  {remediation.after_example}
                </pre>
              </div>
            </div>

            {/* VERIFICATION & ROLLBACK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> VERIFICATION CLI COMMAND
                </span>
                <pre className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs font-mono text-slate-300">
                  {remediation.verification_command}
                </pre>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> ROLLBACK INSTRUCTION
                </span>
                <pre className="bg-slate-950 p-2.5 rounded border border-amber-900/40 text-xs font-mono text-amber-300 overflow-x-auto">
                  {remediation.rollback_command}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Explanation & Dry-Run Preview (4 cols) */}
          <div className="lg:col-span-4 glass-panel p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h4 className="font-heading font-bold text-sm text-slate-100">Engineering Rationale</h4>
              <p className="text-xs text-slate-300 mt-2 bg-slate-900/70 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {remediation.explanation}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-bold text-sm text-slate-100">Dry-Run Step Execution Validator</h4>
              <p className="text-xs text-slate-400">
                Validates change sequencing and prepares structured maintenance steps without altering hardware.
              </p>
              <button
                onClick={handleDryRunPreview}
                className="btn-cyber-secondary w-full justify-center text-xs"
              >
                Validate Change Sequence Steps
              </button>
            </div>

            {previewResult && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
                  STATUS: {previewResult.status}
                </div>
                <div className="space-y-1">
                  {previewResult.execution_steps?.map((st) => (
                    <div key={st.step} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono">
                      <span className="text-cyan-400 font-bold">STEP {st.step} [{st.action}]</span>
                      <div className="text-slate-300 truncate mt-0.5">{st.command || st.commands?.[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-16 text-center text-slate-500 text-xs">
          Loading playbook or no template mapped for {vendor} / {controlId}
        </div>
      )}
    </div>
  );
}
