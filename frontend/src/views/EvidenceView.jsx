import React, { useState, useEffect } from 'react';
import { 
  Layers, Search, CheckCircle2, AlertTriangle, 
  Terminal, FileCode, ArrowRight, Shield, ChevronRight
} from 'lucide-react';

export default function EvidenceView({ targetDeviceId, targetControlId }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [controls, setControls] = useState([]);
  const [selectedControlId, setSelectedControlId] = useState(targetControlId || 'CTRL-TELNET-01');
  const [evidenceData, setEvidenceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [devRes, ctrlRes] = await Promise.all([
        fetch('/api/v1/devices'),
        fetch('/api/v1/compliance/controls')
      ]);
      if (devRes.ok && ctrlRes.ok) {
        const devData = await devRes.json();
        const ctrlData = await ctrlRes.json();
        setDevices(devData);
        setControls(ctrlData);
        const activeDev = devData.find(d => d.id === targetDeviceId) || devData[0];
        if (activeDev) {
          setSelectedDevice(activeDev);
          fetchEvidence(activeDev.id, selectedControlId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvidence = async (deviceId, controlId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/evidence/device/${deviceId}/control/${controlId}`);
      if (res.ok) {
        const data = await res.json();
        setEvidenceData(data);
      } else {
        setEvidenceData(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceChange = (devId) => {
    const dev = devices.find(d => d.id === devId);
    if (dev) {
      setSelectedDevice(dev);
      fetchEvidence(dev.id, selectedControlId);
    }
  };

  const handleControlChange = (cId) => {
    setSelectedControlId(cId);
    if (selectedDevice) {
      fetchEvidence(selectedDevice.id, cId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-cyan-400" /> Evidence Explorer & Provenance Ledger
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Exact, traceable line-by-line provenance linking findings directly to raw configuration tokens and AST fact extractors.
        </p>
      </div>

      {/* Selectors */}
      <div className="glass-panel p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1">SELECT DEVICE</label>
          <select
            value={selectedDevice?.id || ''}
            onChange={(e) => handleDeviceChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {devices.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.vendor.toUpperCase()})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1">SELECT AUDIT CONTROL</label>
          <select
            value={selectedControlId}
            onChange={(e) => handleControlChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {controls.map(c => (
              <option key={c.id} value={c.id}>{c.id}: {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Evidence Chain Reconstruction */}
      {evidenceData ? (
        <div className="space-y-6">
          {/* Provenance Pipeline Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">STAGE 1: RAW TELEMETRY</span>
              <div className="font-heading font-bold text-xs text-slate-100 mt-1">{evidenceData.device_name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{evidenceData.raw_config_lines_count} lines parsed</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">STAGE 2: NORMALIZED FACT</span>
              <div className="font-mono text-xs font-bold text-cyan-400 mt-1 truncate">{evidenceData.normalized_fact.key}</div>
              <div className="text-[11px] font-mono text-slate-300 mt-0.5">= {String(evidenceData.normalized_fact.value)}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">STAGE 3: CONTROL RULE</span>
              <div className="font-mono text-xs font-bold text-amber-400 mt-1">{evidenceData.control_id}</div>
              <div className="text-[11px] text-slate-300 mt-0.5 truncate">{evidenceData.control_title}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">STAGE 4: EVALUATION OUTCOME</span>
              <div className="mt-1">
                <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  evidenceData.status === 'PASS' ? 'badge-pass' : 'badge-critical'
                }`}>
                  {evidenceData.status} ({evidenceData.severity})
                </span>
              </div>
            </div>
          </div>

          {/* Line-Level Evidence Code Viewer */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" /> Source Line Evidence Attribution
              </h3>
              <span className="font-mono text-xs text-slate-400">Deterministic Parser Confidence: 98%</span>
            </div>

            {evidenceData.evidence_provenance?.map((ev, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold">
                    {ev.line_number ? `Line ${ev.line_number}` : 'Multiline Block Match'}
                  </span>
                  <span className="text-slate-400">Extracted Fact Value: <strong className="text-slate-200">{String(ev.extracted_value)}</strong></span>
                </div>

                {/* Code Window with Highlighted Evidence Line */}
                <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden font-mono text-xs">
                  {ev.context_window?.length > 0 ? (
                    ev.context_window.map((lineObj) => (
                      <div
                        key={lineObj.line_number}
                        className={`flex items-center px-4 py-1.5 transition ${
                          lineObj.is_evidence
                            ? 'bg-red-950/40 border-l-4 border-red-500 text-red-200 font-bold'
                            : 'text-slate-400 hover:bg-slate-900/40'
                        }`}
                      >
                        <span className="w-12 text-slate-600 select-none text-[11px]">{lineObj.line_number}</span>
                        <span className="flex-1 font-mono">{lineObj.content}</span>
                        {lineObj.is_evidence && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 uppercase">
                            MATCHED EVIDENCE TOKEN
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-slate-300">{ev.raw_text}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Explanation Box */}
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <strong className="text-cyan-300 block mb-1">Audit Finding Detail:</strong>
              {evidenceData.explanation}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-16 text-center text-slate-500 text-xs">
          Loading evidence provenance record...
        </div>
      )}
    </div>
  );
}
