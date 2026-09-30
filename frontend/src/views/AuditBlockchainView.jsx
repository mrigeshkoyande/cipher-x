import React, { useState, useEffect } from 'react';

export default function AuditBlockchainView() {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      const res = await fetch('/api/v1/audit/trail');
      if (res.ok) setAuditData(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const demoEvents = [
    { timestamp: 'Oct 18, 2024\n14:32:04 UTC', actor: 'analyst@cipherx.sec', actorRole: 'HUMAN ATTESTOR', action: 'Report Signed & Sealed', actionIcon: 'edit_document', actionColor: 'var(--severity-pass)', target: 'Q3 2024 CIS Benchmark Fleet Attestation', targetDetail: 'Doc ID: CX-AUD-2024-Q3-009', hash: 'a8120c9…' },
    { timestamp: 'Oct 18, 2024\n14:26:15 UTC', actor: 'analyst@cipherx.sec', actorRole: 'LEAD REVIEWER', action: 'Human Mapping Validated', actionIcon: 'done_all', actionColor: 'var(--primary)', target: 'MAP-VENDX-001\n(vendor-x secure-admin-mode enable)', targetDetail: 'Promoted from 72% AI suggestion to Verified Canonical Fact', hash: 'd290fa8…' },
    { timestamp: 'Oct 18, 2024\n14:18:22 UTC', actor: 'Cipher-X Ingestion Agent', actorRole: 'AUTOMATED PIPELINE', action: 'Configuration Snapshot Hashed & Parsed', actionIcon: 'inventory_2', actionColor: 'var(--on-surface-variant)', target: 'cisco-core-01-running.cfg (v14.2)', targetDetail: 'Raw config serialized into canonical AST ledger', hash: '8f91a27…' },
    { timestamp: 'Oct 18, 2024\n14:15:00 UTC', actor: 'Syslog Ingest Service', actorRole: 'EVENT STREAM', action: 'Configuration Drift Detected', actionIcon: 'warning', actionColor: 'var(--severity-medium)', target: 'Cisco-Core-01 (Line 142 changed from SSH to Telnet)', targetDetail: 'Unscheduled out-of-band change flagged by Sentinel', hash: '33bc91f…' },
    { timestamp: 'Oct 18, 2024\n08:00:10 UTC', actor: 'System Scheduled Bot', actorRole: 'CRON WORKER', action: 'Automated Compliance Evaluation Executed', actionIcon: 'schedule', actionColor: 'var(--severity-info)', target: 'Full Fleet (128 Nodes) across CIS v8.0', targetDetail: 'Scheduled global posture evaluation round', hash: 'e199042…' },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Audit Trail...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>assured_workload</span>
          IMMUTABLE FORENSIC PROVENANCE
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>Cryptographic Audit Trail & Non-Repudiation Ledger</h1>
            <p>Tamper-proof chronological ledger of all configuration ingestions, AI normalizations, human validations, compliance evaluations, and generated reports.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sync</span>
            Sync Status: Block #19,842,109 (Synced 2s ago)
          </div>
        </div>
      </div>

      {/* Integrity Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderColor: 'var(--severity-pass)', borderWidth: 2, gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--severity-pass)' }}>verified_user</span>
            <div>
              <span className="badge validated" style={{ marginBottom: '0.25rem' }}>ACTIVE GUARANTEE</span>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--severity-pass)' }}>INTEGRITY VERIFIED</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>ZERO TAMPERING DETECTED</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Ledger Anchor Block</div>
          <div className="stat-card-value" style={{ fontFamily: "'JetBrains Mono', monospace" }}>#19,842,109</div>
          <div className="stat-card-sub"><span className="dot green"></span>Public Consortium Notarization</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Current Merkle Root Hash</div>
          <div className="hash-value" style={{ marginTop: '0.375rem', fontSize: '0.75rem' }}>0x9e88ba42f…3f1a</div>
          <div className="stat-card-sub"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>check_circle</span> State Hash Validated</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Active Cryptographic Engine</div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginTop: '0.25rem' }}>SHA-256 + RSA-4096</div>
          <div className="stat-card-sub"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>check_circle</span> FIPS 140-3 HSM Rooted</div>
        </div>
      </div>

      {/* Content: Table + Verification Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1rem' }}>
        {/* Audit Trail Table */}
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>FILTERS:</span>
            <select style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
              <option>Actor: All Actors</option>
            </select>
            <select style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
              <option>Event Type: All Types</option>
            </select>
            <select style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
              <option>Today (Last 24 Hours)</option>
            </select>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
            5 of 1,420 events
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp (UTC)</th>
                  <th>Actor & Origin</th>
                  <th>Action & Operation</th>
                  <th>Target Object / Details</th>
                  <th>Crypto Hash</th>
                </tr>
              </thead>
              <tbody>
                {demoEvents.map((evt, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', whiteSpace: 'pre-line' }}>{evt.timestamp}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600, fontSize: '0.8125rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                        {evt.actor}
                      </div>
                      <div style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)', fontFamily: "'JetBrains Mono', monospace" }}>{evt.actorRole}</div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: `${evt.actionColor}15`, color: evt.actionColor, border: `1px solid ${evt.actionColor}30` }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{evt.actionIcon}</span>
                        {evt.action}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'pre-line' }}>{evt.target}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>{evt.targetDetail}</div>
                    </td>
                    <td>
                      <span className="hash-value" style={{ fontSize: '0.6875rem' }}>{evt.hash}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="data-table-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
                Append-only forensic store. Every block is signed with node key #KEY-HSM-9912
              </div>
              <div className="pagination">
                <button>Previous</button>
                <button className="active">1</button>
                <button>2</button>
                <span>…</span>
                <button>284</button>
                <button>Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Panel */}
        <div>
          <div className="info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--primary)' }}>fingerprint</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Verify File or Artifact Signature</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>Independent Proof of Non-Repudiation</div>
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div style={{ border: '2px dashed var(--outline-variant)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--outline)', display: 'block', marginBottom: '0.5rem' }}>upload_file</span>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Drag & drop raw config or report</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>.cfg, .json, .pdf, or .sha256 digest files</div>
              <button className="btn btn-secondary">Browse Local File</button>
            </div>

            {/* Hash Input */}
            <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.375rem' }}>
              OR PASTE SHA-256 / BLAKE3 HASH
            </div>
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="e.g. a8120c92f1b4904da88021ec53018247df089 1bf41209..."
                style={{ flex: 1, padding: '0.375rem 0.5rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}
              />
              <button className="btn btn-secondary" style={{ padding: '0.375rem 0.5rem', fontSize: '0.6875rem' }}>PASTE</button>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
              Verify Against Merkle Tree
            </button>

            {/* Cryptographic Path */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Cryptographic Path</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>Proof: 12 Hops</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingLeft: '0.5rem', borderLeft: '2px solid var(--outline-variant)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>subdirectory_arrow_right</span>
                  <span className="code-tag">Leaf Hash (Target)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--outline)' }}>→</span>
                  Sibling: <span className="hash-value" style={{ fontSize: '0.625rem' }}>0x48a1…61ef</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--outline)' }}>→</span>
                  Root Node: <span className="hash-value" style={{ fontSize: '0.625rem' }}>0x9e88ba42f…3f1a</span>
                </div>
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--severity-pass)', fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                Matches Ledger State #19,842,109
              </div>
            </div>

            {/* Consensus Nodes */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>CONSENSUS NODES</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>7 / 7 Active</span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                {[1,2,3,4,5,6,7].map(i => (
                  <div key={i} style={{ flex: 1, height: 6, background: 'var(--severity-info)', borderRadius: 3 }}></div>
                ))}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
                HSM Attestation Protocol: <span style={{ fontWeight: 600 }}>PKCS#11 v3.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
