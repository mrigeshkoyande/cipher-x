import React, { useState, useEffect } from 'react';

export default function EvidenceView({ targetDeviceId, targetControlId }) {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvidence();
  }, [targetDeviceId, targetControlId]);

  const fetchEvidence = async () => {
    try {
      const res = await fetch('/api/v1/evidence/export');
      if (res.ok) setEvidence((await res.json()).items || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const demoFindings = [
    { id: 'FND-001', controlId: 'CIS-NET-004', severity: 'HIGH', device: 'Cisco-Core-01', ip: '10.240.0.1', description: 'Cleartext Telnet enabled on VTY lines 0-4', evidenceLine: '142: transport input telnet ssh', normalizedFact: 'remote_management.telnet = true', framework: 'CIS v8.0', status: 'OPEN', detectedAt: 'Oct 18, 2024 14:15 UTC', hash: '33bc91f…' },
    { id: 'FND-002', controlId: 'NIST-AC-017', severity: 'HIGH', device: 'FortiGate-DC-01', ip: '10.240.1.254', description: 'Remote access MFA not enforced on admin portal', evidenceLine: 'set two-factor disable', normalizedFact: 'auth.mfa.enabled = false', framework: 'NIST 800-53', status: 'OPEN', detectedAt: 'Oct 17, 2024 09:30 UTC', hash: 'a72f1d3…' },
    { id: 'FND-003', controlId: 'DISA-NET-021', severity: 'MEDIUM', device: 'Aruba-Access-12', ip: '10.240.12.8', description: 'HTTP management interface enabled', evidenceLine: 'web-management http', normalizedFact: 'management.http.enabled = true', framework: 'DISA STIG', status: 'OPEN', detectedAt: 'Oct 18, 2024 06:45 UTC', hash: 'e48b20a…' },
    { id: 'FND-004', controlId: 'CIS-NET-005', severity: 'HIGH', device: 'FortiGate-DC-01', ip: '10.240.1.254', description: 'SNMPv1 community string PUBLIC configured', evidenceLine: 'config system snmp community\nset name "PUBLIC"', normalizedFact: 'snmp.v1v2c.community_default = true', framework: 'CIS v8.0', status: 'OPEN', detectedAt: 'Oct 18, 2024 04:00 UTC', hash: '9d3f44b…' },
    { id: 'FND-005', controlId: 'CTRL-CRYPTO-01', severity: 'HIGH', device: 'Juniper-Border-01', ip: '10.240.100.1', description: 'Weak cipher suite DES-CBC3-SHA still permitted', evidenceLine: 'set security ssh ciphers [ des-cbc3-sha ]', normalizedFact: 'crypto.weak_ciphers_present = true', framework: 'Custom Enterprise', status: 'ACKNOWLEDGED', detectedAt: 'Oct 16, 2024 12:00 UTC', hash: '71a982c…' },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Findings & Evidence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>policy</span>
          SECURITY FINDINGS
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>Findings & Evidence Explorer</h1>
            <p>Detailed security findings with upstream evidence, normalized facts, and cryptographic provenance for each detected compliance violation.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
              Export CSV
            </button>
            <button className="btn btn-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>data_object</span>
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Findings</div>
          <div className="stat-card-value error">{demoFindings.length}</div>
          <div className="stat-card-sub">Across all devices</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Open</div>
          <div className="stat-card-value warning">{demoFindings.filter(f => f.status === 'OPEN').length}</div>
          <div className="stat-card-sub">Awaiting remediation</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">High Severity</div>
          <div className="stat-card-value" style={{ color: 'var(--severity-high)' }}>{demoFindings.filter(f => f.severity === 'HIGH').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Devices Affected</div>
          <div className="stat-card-value primary">{new Set(demoFindings.map(f => f.device)).size}</div>
        </div>
      </div>

      {/* Findings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {demoFindings.map((finding) => (
          <div className="info-card" key={finding.id} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${finding.severity === 'HIGH' ? 'high' : finding.severity === 'CRITICAL' ? 'critical' : 'medium'}`}>{finding.severity}</span>
                <span className="code-tag">{finding.controlId}</span>
                <span style={{ fontWeight: 700 }}>{finding.description}</span>
              </div>
              <span className={`badge ${finding.status === 'OPEN' ? 'fail' : 'medium'}`}>{finding.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.8125rem' }}>
              <div>
                <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>DEVICE</div>
                <div style={{ fontWeight: 600 }}>{finding.device}</div>
                <div className="code-tag" style={{ fontSize: '0.625rem', marginTop: '0.125rem' }}>{finding.ip}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>UPSTREAM EVIDENCE</div>
                <div className="code-block" style={{ padding: '0.375rem 0.5rem', fontSize: '0.6875rem' }}>{finding.evidenceLine}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>NORMALIZED FACT</div>
                <span className="code-tag">{finding.normalizedFact}</span>
                <div style={{ marginTop: '0.375rem', display: 'flex', gap: '0.5rem', fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
                  <span className="badge primary" style={{ fontSize: '0.5625rem' }}>{finding.framework}</span>
                  <span className="hash-value" style={{ fontSize: '0.5625rem' }}>{finding.hash}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.625rem', paddingTop: '0.625rem', borderTop: '1px solid var(--surface-variant)', fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
              <span>Detected: {finding.detectedAt}</span>
              <span>Finding ID: {finding.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
