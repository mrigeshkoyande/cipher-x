import React, { useState, useEffect } from 'react';

export default function ReportsView({ onNavigateTab }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/v1/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const demoReports = [
    { title: 'Q3 2024 CIS Benchmark Fleet Attestation', id: 'REP-2024-Q3-CIS-8812', scope: 'All 128 Fleet', scopeDetail: '100% Ingestion Coverage', framework: 'CIS v8.0', frameworkLevel: 'Level 2', generated: 'Oct 18, 2024 14:30 UTC', actor: 'Scheduled Bot', actorDetail: '(Engine v3.2)', hash: 'a812…91bf', hashStatus: 'Tamper-Proof Ledger Verified', format: 'PDF & JSON Package', size: '4.2 MB / 18.4 MB' },
    { title: 'NIST SP 800-53 Core Router Assurance Dossier', id: 'REP-2024-NIST-0419', scope: 'Cisco-Core-01 & Edge (18 Nodes)', scopeDetail: 'US-East Backbones', framework: 'NIST 800-53', frameworkLevel: 'r5', generated: 'Oct 17, 2024 19:12 UTC', actor: 'Security Analyst (ANL-9042)', actorDetail: '', hash: 'c771…dfaa', hashStatus: 'Tamper-Proof Ledger Verified', format: 'PDF Dossier', size: '9.6 MB' },
    { title: 'Daily Configuration Drift & Exception Summary', id: 'REP-DRIFT-2024-10-18', scope: 'Perimeter Firewalls (6 Nodes)', scopeDetail: 'Palo Alto DMZ clusters', framework: 'DISA STIG', frameworkLevel: 'Network', generated: 'Oct 18, 2024 00:00 UTC', actor: 'Scheduled Bot', actorDetail: '(Engine v3.2)', hash: '3f29…01e8', hashStatus: 'Tamper-Proof Ledger Verified', format: 'JSON Evidence Bundle', size: '24.1 MB' },
    { title: 'Executive CISO Security Posture Brief', id: 'REP-EXEC-2024-Q3', scope: 'Enterprise Fleet (Aggregate)', scopeDetail: 'Board-level summary metrics', framework: 'Multi-Standard', frameworkLevel: '', generated: 'Oct 15, 2024 18:00 UTC', actor: 'Chief Information Security Officer', actorDetail: '', hash: 'b109…77ca', hashStatus: 'Tamper-Proof Ledger Verified', format: 'Executive PDF Deck', size: '2.8 MB' },
    { title: 'ISO 27001 Annex A.13 Telemetry Attestation', id: 'REP-ISO-27001-A13', scope: 'Cloud Edge Transit Gateway', scopeDetail: 'AWS Direct Connect Routers', framework: 'ISO 27001:2022', frameworkLevel: '', generated: 'Oct 12, 2024 11:45 UTC', actor: 'External Auditor (Deloitte)', actorDetail: '', hash: 'ee88…34ac', hashStatus: 'Tamper-Proof Ledger Verified', format: 'PDF + Raw Config AST', size: '14.1 MB' },
  ];

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>assured_workload</span>
          CRYPTOGRAPHIC EVIDENCE ARCHIVE
          <span style={{ marginLeft: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>EPOCH #2024-Q3-REV4</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>Compliance & Audit Reports Center</h1>
            <p>Cryptographically anchored, audit-ready compliance dossiers, executive summaries, and technical evidence packages for heterogeneous network environments.</p>
          </div>
          <div className="info-card" style={{ padding: '0.625rem 0.875rem', marginBottom: 0, flexShrink: 0, textAlign: 'right' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em' }}>IMMUTABLE ANCHOR BLOCK</div>
            <div style={{ fontWeight: 800, fontSize: '1.125rem', fontFamily: "'JetBrains Mono', monospace" }}>#19,842,109</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Published Reports</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">description</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div className="stat-card-value">46</div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>Dossiers</span>
          </div>
          <div className="stat-card-sub"><span className="dot green"></span>+8 dossiers generated this quarter</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Cryptographic Attestation</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">verified_user</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div className="stat-card-value success">100%</div>
            <span className="badge validated">VALIDATED</span>
          </div>
          <div className="stat-card-sub"><span className="dot green"></span>SHA-256 Ledger Anchor Validated</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Regulatory Baselines</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">account_balance</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div className="stat-card-value primary">4</div>
            <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>Active Standards</span>
          </div>
          <div className="stat-card-sub">CIS v8, NIST 800-53, DISA, ISO</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Automated Cadence</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">schedule</span></div>
          </div>
          <div className="stat-card-value">Daily 00:00 <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>UTC</span></div>
          <div className="stat-card-sub"><span className="dot green"></span>Next ingestion sweep in 4h 18m</div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search by Report Title, Hash, or Node scope..." />
          </div>
          <div className="filter-chip">Framework: All Frameworks (Any)</div>
          <div className="filter-chip">Target Scope: Enterprise Fleet (All)</div>
          <div className="filter-chip">Audit Window: Q3 2024 (Active Cycle)</div>
          <div className="filter-chip active">Integrity: Verified Ledger (SHA)</div>
        </div>
        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <div style={{ fontWeight: 700 }}>OFFICIAL AUDIT REPORT DOSSIERS</div>
          <span style={{ color: 'var(--on-surface-variant)' }}>Showing 5 of 46 records</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Report Title & Type</th>
              <th>Target Scope & Nodes</th>
              <th>Framework</th>
              <th>Generated Timestamp & Actor</th>
              <th>Cryptographic Hash & Proof</th>
              <th>Format & Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demoReports.map((rpt, i) => (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{rpt.title}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.625rem', color: 'var(--on-surface-variant)' }}>DOSSIER-ID: {rpt.id}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem' }}>{rpt.scope}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>{rpt.scopeDetail}</div>
                </td>
                <td>
                  <span className="badge primary">{rpt.framework}</span>
                  {rpt.frameworkLevel && <div style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>{rpt.frameworkLevel}</div>}
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem', fontFamily: "'JetBrains Mono', monospace" }}>{rpt.generated}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>{rpt.actor}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span className="hash-value" style={{ fontSize: '0.625rem' }}>{rpt.hash}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--severity-pass)' }}>check_circle</span>
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>{rpt.hashStatus}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{rpt.format}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>{rpt.size}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>Preview</button>
                    <button className="topbar-icon-btn" style={{ width: 28, height: 28 }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span></button>
                    <button className="topbar-icon-btn" style={{ width: 28, height: 28 }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>content_copy</span></button>
                    <button className="topbar-icon-btn" style={{ width: 28, height: 28 }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>share</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="data-table-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
            <span>Archival Ledger: Block #19,842,109 · Synced with Private Governance Consortia</span>
          </div>
          <div className="pagination">
            <button>Previous</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <span style={{ padding: '0 0.25rem' }}>…</span>
            <button>10</button>
            <button>Next</button>
          </div>
        </div>
      </div>

      {/* Cryptographic Proof Footer */}
      <div className="alert info" style={{ marginTop: '1rem' }}>
        <span className="material-symbols-outlined">verified</span>
        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Cryptographic Proof & Non-Repudiation Guarantee</div>
          <div style={{ fontSize: '0.8125rem' }}>
            Every published report is hashed using <span className="code-tag">SHA-256</span> and permanently notarized onto the private Cipher-X audit ledger. External auditors may download the raw JSON evidence packages to verify AST deterministic integrity independently without providing direct operational credentials to network nodes.
          </div>
        </div>
      </div>
    </div>
  );
}
