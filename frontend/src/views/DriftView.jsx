import React, { useState, useEffect } from 'react';

export default function DriftView({ selectedDeviceId }) {
  const [driftData, setDriftData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrift();
  }, [selectedDeviceId]);

  const fetchDrift = async () => {
    try {
      const url = selectedDeviceId ? `/api/v1/drift/${selectedDeviceId}` : '/api/v1/drift/latest';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDriftData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Demo data for display
  const demoDevice = {
    hostname: 'Cisco-Core-01',
    platform: 'Catalyst 9600 Backbone',
    ip: '10.240.4.1',
    baseline: { version: 'v14.1', date: 'Oct 18, 08:00 UTC' },
    running: { version: 'v14.2', date: 'Oct 18, 14:15 UTC' },
  };

  const demoDrifts = [
    {
      lineNum: 142,
      section: 'Line Auxiliary & Management Virtual Terminals',
      baseline: 'transport input ssh',
      running: 'transport input telnet ssh',
      baselineAnnotation: '[VALIDATED: SECURE]',
      runningAnnotation: '[DRIFT: MODIFIED]',
      normalizedBaseline: 'remote_management.telnet = false',
      normalizedRunning: 'remote_management.telnet = true (Changed)',
      cisBaseline: 'CIS-NET-004: PASS',
      cisRunning: 'CIS-NET-004: FAIL',
    },
  ];

  const demoImpact = {
    devicesWithDrift: 3,
    totalFleet: 128,
    newViolations: 2,
    violationSeverity: 'High Severity',
    postureImpact: -4.2,
    hashIntegrity: 'SHA256: 4a9f…b78',
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Analyzing configuration drift...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>fingerprint</span>
          FORENSIC LEDGER #DFT-2024-884
          <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>Continuous Telemetry Check</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>Configuration Drift Center</h1>
            <p>Detect and trace unauthorized configuration modifications, security posture regressions, and newly introduced regulatory violations between baseline and running states.</p>
          </div>
          <div className="info-card" style={{ padding: '0.625rem 0.875rem', marginBottom: 0, flexShrink: 0 }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em' }}>FLEET INGESTION</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>sync</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>6 hours ago (Automated Ingest)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Devices With Drift</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined" style={{ color: 'var(--severity-critical)' }}>warning</span></div>
          </div>
          <div className="stat-card-value error">{demoImpact.devicesWithDrift}</div>
          <div className="stat-card-sub">of {demoImpact.totalFleet} Fleet</div>
          <div className="stat-card-footer" style={{ fontSize: '0.625rem' }}>
            <span>IMPACTING NODES:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <span className="code-tag" style={{ fontSize: '0.625rem' }}>Cisco-Core-01</span>
            <span className="code-tag" style={{ fontSize: '0.625rem' }}>Aruba-Access-12</span>
            <span className="code-tag" style={{ fontSize: '0.625rem' }}>FortiGate-DC-01</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">New Violations Introduced</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined" style={{ color: 'var(--severity-high)' }}>gpp_bad</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div className="stat-card-value error">+{demoImpact.newViolations}</div>
            <span className="badge high">{demoImpact.violationSeverity}</span>
          </div>
          <div className="stat-card-sub">
            <span className="dot amber"></span>CIS-NET-004 Telnet enabled
            <br />
            <span className="dot amber"></span>DISA-NET-021 Cleartext Web
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Posture Impact</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">trending_down</span></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <div className="stat-card-value error">{demoImpact.postureImpact}%</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Compliance Drop</span>
          </div>
          <div className="stat-card-sub">Current: 91.8% → Baseline: 96.0%</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Golden Master Status</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">verified</span></div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>v14.1 Fleet Tag</div>
          <div className="stat-card-sub" style={{ fontSize: '0.6875rem' }}>Deterministic GitOps mirror synced.</div>
          <div className="stat-card-footer">
            <span>HASH INTEGRITY</span>
            <span className="hash-value" style={{ marginLeft: 'auto', fontSize: '0.625rem' }}>{demoImpact.hashIntegrity}</span>
          </div>
        </div>
      </div>

      {/* Target Device Section */}
      <div className="info-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--on-surface-variant)' }}>dns</span>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Target Device: {demoDevice.hostname}</span>
            <span style={{ marginLeft: '0.5rem', color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>({demoDevice.platform})</span>
            <span className="code-tag" style={{ marginLeft: '0.75rem' }}>{demoDevice.ip}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
          <span>Baseline: <strong>{demoDevice.baseline.version}</strong> ({demoDevice.baseline.date})</span>
          <span>·</span>
          <span>Running: <strong style={{ color: 'var(--severity-critical)' }}>{demoDevice.running.version}</strong> ({demoDevice.running.date})</span>
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge fail" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span className="status-dot red"></span>
            COMPLIANCE DRIFT STATUS: REGRESSION DETECTED (PASS → FAIL)
          </span>
          <button className="btn btn-secondary" style={{ padding: '0.25rem 0.625rem', fontSize: '0.6875rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>history</span>
            Revision Log
          </button>
        </div>
      </div>

      {/* Side-by-Side Diff View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Baseline */}
        <div className="diff-panel">
          <div className="diff-panel-header">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Baseline Configuration</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>{demoDevice.baseline.version}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge pass">COMPLIANT - PASS</span>
              <span className="badge neutral">Golden Reference</span>
            </div>
          </div>
          <div style={{ padding: '0.5rem 0', fontSize: '0.6875rem', color: 'var(--on-surface-variant)', paddingLeft: '1rem', borderBottom: '1px solid var(--surface-variant)' }}>
            ! Section: Line Auxiliary & Management Virtual Terminals
          </div>
          <div className="diff-line"><div className="diff-line-num">140</div><div className="diff-line-content">line vty 0 4</div></div>
          <div className="diff-line"><div className="diff-line-num">141</div><div className="diff-line-content">exec-timeout 15 0</div></div>
          <div className="diff-line" style={{ background: 'rgba(46, 125, 50, 0.06)' }}>
            <div className="diff-line-num">142</div>
            <div className="diff-line-content" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>transport input ssh</span>
              <span style={{ fontSize: '0.625rem', color: 'var(--severity-pass)' }}>✓ [VALIDATED: SECURE]</span>
            </div>
          </div>
          <div className="diff-line"><div className="diff-line-num">143</div><div className="diff-line-content">login local</div></div>
          <div className="diff-line"><div className="diff-line-num">144</div><div className="diff-line-content">logging synchronous</div></div>
          <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--surface-variant)', fontSize: '0.6875rem' }}>
            Normalized Fact: <span className="code-tag" style={{ fontSize: '0.625rem' }}>remote_management.telnet = false</span>
          </div>
          <div style={{ padding: '0.375rem 1rem', fontSize: '0.6875rem' }}>
            CIS Assessment: <span className="badge pass" style={{ fontSize: '0.625rem' }}>CIS-NET-004: PASS</span>
          </div>
        </div>

        {/* Running */}
        <div className="diff-panel">
          <div className="diff-panel-header">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Running Configuration</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>{demoDevice.running.version}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge fail">DRIFTED - FAIL</span>
              <span className="badge medium">Live Switch Image</span>
            </div>
          </div>
          <div style={{ padding: '0.5rem 0', fontSize: '0.6875rem', color: 'var(--on-surface-variant)', paddingLeft: '1rem', borderBottom: '1px solid var(--surface-variant)' }}>
            ! Active Memory Snapshot Captured via SNMP/SSH Agent
          </div>
          <div className="diff-line"><div className="diff-line-num">140</div><div className="diff-line-content">line vty 0 4</div></div>
          <div className="diff-line"><div className="diff-line-num">141</div><div className="diff-line-content">exec-timeout 15 0</div></div>
          <div className="diff-line highlight">
            <div className="diff-line-num" style={{ fontWeight: 700, color: 'var(--primary)' }}>142</div>
            <div className="diff-line-content" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <span style={{ textDecoration: 'line-through', color: 'var(--severity-critical)', opacity: 0.6 }}>transport input ssh</span>
                {' '}
                <span className="code-tag" style={{ background: 'rgba(244, 153, 26, 0.15)', borderColor: 'var(--primary-container)', fontWeight: 700 }}>transport input telnet ssh</span>
              </span>
              <span className="badge fail" style={{ fontSize: '0.5625rem' }}>⚠ [DRIFT: MODIFIED]</span>
            </div>
          </div>
          <div className="diff-line"><div className="diff-line-num">143</div><div className="diff-line-content">login local</div></div>
          <div className="diff-line"><div className="diff-line-num">144</div><div className="diff-line-content">logging synchronous</div></div>
          <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--surface-variant)', fontSize: '0.6875rem' }}>
            Normalized Fact: <span className="badge medium" style={{ fontSize: '0.625rem' }}>remote_management.telnet = true (Changed)</span>
          </div>
          <div style={{ padding: '0.375rem 1rem', fontSize: '0.6875rem' }}>
            CIS Assessment: <span className="badge fail" style={{ fontSize: '0.625rem' }}>CIS-NET-004: FAIL</span>
          </div>
        </div>
      </div>

      {/* Forensic Root Cause */}
      <div className="info-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
            Forensic Root Cause & Operational Impact Assessment
          </h3>
          <span style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)', fontFamily: "'JetBrains Mono', monospace" }}>Incident Ref: #IR-DRIFT-4091</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Who Changed It */}
          <div className="stat-card">
            <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>WHO CHANGED IT</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>terminal</span>
              <span style={{ fontWeight: 600 }}>Out-of-band CLI session via console port</span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
              Operator: <span className="code-tag">admin_local_secops</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '0.25rem' }}>
              Terminal TTY-0 directly connected in DataCenter-East Rack 04.
            </div>
          </div>

          {/* Triggered Violations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em' }}>TRIGGERED COMPLIANCE VIOLATIONS</div>
            <div className="alert error" style={{ marginBottom: '0.375rem' }}>
              <span className="material-symbols-outlined">gpp_bad</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="code-tag" style={{ fontSize: '0.625rem' }}>CIS-NET-004</span>
                  <span className="badge critical">HIGH SEVERITY</span>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>Disable cleartext Telnet on all VTY lines</span>
                </div>
                <div style={{ fontSize: '0.75rem' }}>Cleartext Telnet protocol transmits administrative credentials unencrypted over ingress network interfaces, violating NIST SP 800-53 SC-8.</div>
              </div>
            </div>
            <div className="alert warning" style={{ marginBottom: 0 }}>
              <span className="material-symbols-outlined">warning</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="code-tag" style={{ fontSize: '0.625rem' }}>NIST-AU-8</span>
                  <span className="badge medium">MEDIUM SEVERITY</span>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>NTP time drift detected</span>
                </div>
                <div style={{ fontSize: '0.75rem' }}>Console configuration change disrupted peer NTP synchronization clock source; timestamp delta exceeded 120ms tolerance.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-variant)' }}>
          <button className="btn btn-danger" style={{ fontSize: '0.8125rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
            Create ServiceNow Security Incident
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shield</span>
            Acknowledge & Accept Risk (Waiver)
          </button>
          <button className="btn btn-primary" style={{ fontSize: '0.8125rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>replay</span>
            Generate Reversion Script (CLI Patch)
          </button>
        </div>
      </div>

      {/* Remaining Drifted Devices */}
      <div className="data-table-container" style={{ marginTop: '1rem' }}>
        <div className="data-table-toolbar">
          <h4 style={{ fontSize: '0.875rem' }}>Remaining Drifted Devices in Queue (2)</h4>
          <span style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)', marginLeft: 'auto' }}>Fleet Segment: US-East-Tier1</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>IP</th>
              <th>Location</th>
              <th>Drift Detail</th>
              <th>Detected</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: '0.375rem' }}>router</span>
                Aruba-Access-12
              </td>
              <td><span className="code-tag">10.240.12.8</span></td>
              <td>Building 8 Floor 2</td>
              <td><span className="badge critical">SNMP v1/v2c Read-Write String Added</span></td>
              <td style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>4 hours ago</td>
              <td><button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>Inspect Diff</button></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: '0.375rem' }}>security</span>
                FortiGate-DC-01
              </td>
              <td><span className="code-tag">10.240.1.254</span></td>
              <td>Perimeter FW Cluster A</td>
              <td><span className="badge critical">DISA-NET-021: HTTP Web GUI Enabled</span></td>
              <td style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>1 hour ago</td>
              <td><button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.6875rem' }}>Inspect Diff</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
