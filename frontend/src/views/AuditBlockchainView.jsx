import React, { useState, useEffect } from 'react';
import { 
  Lock, ShieldCheck, AlertOctagon, CheckCircle2, 
  RefreshCw, Cpu, Database, Link as LinkIcon, Flame, Layers
} from 'lucide-react';

export default function AuditBlockchainView() {
  const [auditEvents, setAuditEvents] = useState([]);
  const [anchors, setAnchors] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const [tamperingSimulationResult, setTamperingSimulationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('chain');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      const [evtRes, ancRes, verRes] = await Promise.all([
        fetch('/api/v1/audit/events'),
        fetch('/api/v1/blockchain/anchors'),
        fetch('/api/v1/audit/verify')
      ]);
      if (evtRes.ok && ancRes.ok && verRes.ok) {
        const evtData = await evtRes.json();
        const ancData = await ancRes.json();
        const verData = await verRes.json();
        setAuditEvents(evtData);
        setAnchors(ancData);
        setVerificationResult(verData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    setTamperingSimulationResult(null);
    try {
      const res = await fetch('/api/v1/audit/verify');
      if (res.ok) {
        const data = await res.json();
        setVerificationResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const handleSimulateTampering = async () => {
    if (auditEvents.length < 2) return;
    try {
      const res = await fetch('/api/v1/audit/simulate-tamper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_index: 1,
          modified_message: "UNAUTHORIZED_MALICIOUS_LOG_TAMPERING_INJECTED"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTamperingSimulationResult(data);
        setVerificationResult(data.verification_result);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
            <Lock className="w-6 h-6 text-cyan-400" /> Cryptographic Audit Integrity & Blockchain Anchoring
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            SHA-256 hash chaining (Event_N = SHA256(Payload + Event_N-1)) and distributed ledger Merkle proofs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyIntegrity}
            disabled={verifying}
            className="btn-cyber-primary text-xs"
          >
            {verifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            Verify Audit Chain Integrity
          </button>
          <button
            onClick={handleSimulateTampering}
            className="btn-cyber-secondary text-xs text-amber-400 hover:text-amber-300"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Simulate Tamper Demo
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
          verificationResult.valid
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/15 border-red-500/40 text-red-300 animate-pulse'
        }`}>
          <div className="flex items-center gap-3">
            {verificationResult.valid ? (
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5 text-red-400" />
              </div>
            )}
            <div>
              <div className="font-heading font-extrabold text-sm uppercase tracking-wide">
                AUDIT INTEGRITY STATUS: {verificationResult.status}
              </div>
              <div className="text-xs opacity-90 mt-0.5">
                {verificationResult.message || verificationResult.reason}
              </div>
            </div>
          </div>

          <div className="font-mono text-xs text-right hidden md:block">
            <div>Chain Length: <strong>{verificationResult.total_events || auditEvents.length} Events</strong></div>
            <div className="text-[10px] opacity-75">Genesis: 0000000000000000...</div>
          </div>
        </div>
      )}

      {/* View Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('chain')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'chain' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Cryptographic Hash Chain ({auditEvents.length} Events)
        </button>
        <button
          onClick={() => setActiveTab('blockchain')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'blockchain' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Blockchain Anchors & Merkle Proofs ({anchors.length})
        </button>
      </div>

      {/* Tab: Hash Chained Audit Events */}
      {activeTab === 'chain' && (
        <div className="glass-panel p-5 space-y-4">
          <div className="space-y-3">
            {auditEvents.map((evt, idx) => (
              <div
                key={evt.index}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 font-mono text-xs relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                      BLOCK #{evt.index}
                    </span>
                    <span className="text-slate-200 font-bold">{evt.event_type}</span>
                  </div>
                  <span className="text-slate-500 text-[11px] font-sans">
                    {new Date(evt.timestamp * 1000).toLocaleString()}
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] font-sans">
                  Actor: <strong className="text-slate-300">{evt.actor}</strong> | Resource: <strong className="text-slate-300">{evt.resource_id}</strong>
                </div>

                {/* Hashes Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded border border-slate-900">
                  <div className="truncate">
                    <span className="text-slate-500">PREV HASH: </span>
                    <span className="text-slate-400">{evt.previous_hash}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-cyan-500">BLOCK HASH: </span>
                    <span className="text-cyan-300 font-bold">{evt.event_hash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Blockchain Ledger Anchors */}
      {activeTab === 'blockchain' && (
        <div className="glass-panel p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anchors.map((anc) => (
              <div key={anc.anchor_id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                    {anc.asset_type} ANCHOR
                  </span>
                  <span className="text-slate-500 text-[10px]">Block #{anc.block_height}</span>
                </div>

                <div className="text-slate-300 truncate">
                  Tx Hash: <strong className="text-cyan-400">{anc.transaction_hash}</strong>
                </div>

                <div className="text-slate-400 text-[11px] truncate">
                  Content SHA-256: <span className="text-slate-200">{anc.content_hash}</span>
                </div>

                <div className="text-slate-400 text-[11px] truncate">
                  Merkle Root: <span className="text-slate-200">{anc.merkle_root}</span>
                </div>

                <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5 flex items-center justify-between">
                  <span>{anc.ledger_network}</span>
                  <span className="text-emerald-400 font-bold">ON-CHAIN VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
