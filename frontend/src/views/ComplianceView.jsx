import React, { useState, useEffect } from 'react';

export default function ComplianceView({ selectedControlId, onSelectControl, onNavigateRemediation }) {
  const [frameworks, setFrameworks] = useState([]);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFramework, setActiveFramework] = useState('all');

  useEffect(() => {
    fetchCompliance();
  }, []);

  const fetchCompliance = async () => {
    try {
      const [fwRes, findRes] = await Promise.all([
        fetch('/api/v1/compliance/frameworks'),
        fetch('/api/v1/compliance/findings'),
      ]);
      if (fwRes.ok) setFrameworks((await fwRes.json()).frameworks || []);
      if (findRes.ok) setFindings((await findRes.json()).findings || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const demoFindings = [
    { controlId: 'CIS-NET-004', title: 'Disable cleartext Telnet on all VTY lines', severity: 'HIGH', framework: 'CIS v8.0', category: 'Remote Access', device: 'Cisco-Core-01', status: 'FAIL', score: 0 },
    { controlId: 'NIST-AC-017', title: 'Enforce multi-factor authentication for remote access', severity: 'HIGH', framework: 'NIST 800-53', category: 'Access Control', device: 'FortiGate-DC-01', status: 'FAIL', score: 0 },
    { controlId: 'DISA-NET-021', title: 'Disable HTTP management interface on all devices', severity: 'MEDIUM', framework: 'DISA STIG', category: 'System & Comms Protection', device: 'Aruba-Access-12', status: 'FAIL', score: 0 },
    { controlId: 'CIS-NET-001', title: 'Enforce SSHv2 with strong cryptographic algorithms', severity: 'HIGH', framework: 'CIS v8.0', category: 'Remote Access', device: 'Juniper-Border-01', status: 'PARTIAL', score: 50 },
    { controlId: 'ISO-A8-09', title: 'Configuration management and change control', severity: 'MEDIUM', framework: 'ISO 27001', category: 'Asset Management', device: 'PAN-FW-Edge-01', status: 'PASS', score: 100 },
    { controlId: 'NIST-AU-003', title: 'Configure centralized syslog with timestamps', severity: 'MEDIUM', framework: 'NIST 800-53', category: 'Audit & Accountability', device: 'Cisco-Core-01', status: 'PASS', score: 100 },
    { controlId: 'CIS-NET-007', title: 'Enforce NTP authentication with trusted sources', severity: 'LOW', framework: 'CIS v8.0', category: 'System Integrity', device: 'Aruba-Access-12', status: 'PASS', score: 100 },
    { controlId: 'CTRL-CRYPTO-01', title: 'Disable weak cipher suites (DES, RC4, MD5)', severity: 'HIGH', framework: 'Custom Enterprise', category: 'Cryptography', device: 'FortiGate-DC-01', status: 'FAIL', score: 0 },
  ];

  const displayFindings = findings.length > 0 ? findings : demoFindings;

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Compliance Data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified_user</span>
          COMPLIANCE POSTURE
        </div>
        <h1>Compliance Frameworks & Findings</h1>
        <p>Evaluate network infrastructure compliance posture across active regulatory frameworks with deterministic explainable scoring.</p>
      </div>

      {/* Framework Filter Tabs */}
      <div className="tabs">
        {['all', 'CIS v8.0', 'NIST 800-53', 'DISA STIG', 'ISO 27001', 'Custom'].map(fw => (
          <button key={fw} className={`tab ${activeFramework === fw ? 'active' : ''}`} onClick={() => setActiveFramework(fw)}>
            {fw === 'all' ? 'All Frameworks' : fw}
          </button>
        ))}
      </div>

      {/* Findings Table */}
      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search controls, rules, devices..." />
          </div>
          <div className="filter-chip">Severity: All</div>
          <div className="filter-chip">Status: All</div>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
            Showing {displayFindings.length} findings
          </span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Control ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Framework</th>
              <th>Category</th>
              <th>Device</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayFindings.map((f, i) => (
              <tr key={i} style={{ cursor: 'pointer' }} onClick={() => onSelectControl && onSelectControl(f.controlId)}>
                <td><span className="code-tag">{f.controlId}</span></td>
                <td style={{ fontWeight: 600 }}>{f.title}</td>
                <td>
                  <span className={`badge ${f.severity === 'HIGH' ? 'high' : f.severity === 'MEDIUM' ? 'medium' : f.severity === 'CRITICAL' ? 'critical' : 'low'}`}>
                    {f.severity}
                  </span>
                </td>
                <td><span className="badge primary" style={{ fontSize: '0.625rem' }}>{f.framework}</span></td>
                <td style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{f.category}</td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}>{f.device}</td>
                <td>
                  <span className={`badge ${f.status === 'PASS' ? 'pass' : f.status === 'PARTIAL' ? 'medium' : 'fail'}`}>
                    {f.status}
                  </span>
                </td>
                <td>
                  {f.status !== 'PASS' && (
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }} onClick={(e) => { e.stopPropagation(); onNavigateRemediation && onNavigateRemediation('cisco', f.controlId); }}>
                      Remediate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="data-table-footer">
          <span>{displayFindings.filter(f => f.status === 'FAIL').length} Failed · {displayFindings.filter(f => f.status === 'PASS').length} Passed · {displayFindings.filter(f => f.status === 'PARTIAL').length} Partial</span>
        </div>
      </div>
    </div>
  );
}
