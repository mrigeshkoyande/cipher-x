import React, { useState, useEffect } from 'react';

export default function DashboardView({ onNavigateDevice, onNavigateControl, onNavigateTab }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/v1/analytics/organization-risk');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Enterprise Telemetry & Risk Metrics...</div>
        </div>
      </div>
    );
  }

  const sev = analytics.severity_distribution || {};
  const score = analytics.average_compliance_score || 0;
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D';

  return (
    <div className="animate-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>monitoring</span>
          FLEET ANALYTICS
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>Security Posture Overview</h1>
            <p>Real-time compliance posture, fleet risk intelligence, and severity distribution across all managed network infrastructure.</p>
          </div>
          <div className="engine-badge" style={{ flexShrink: 0 }}>
            <span className="engine-badge-icon">{'{ }'}</span>
            <span className="engine-badge-label">Engine</span>
            <span className="engine-badge-version">v4.22</span>
            <span className="engine-badge-status">Active</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="stat-cards">
        {/* Compliance Score */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Fleet Compliance Score</span>
            <div className="stat-card-icon">
              <span className="material-symbols-outlined">verified</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <div className={`stat-card-value ${score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error'}`}>
              {score}%
            </div>
            <span className={`badge ${grade === 'A' ? 'pass' : grade === 'B' ? 'medium' : 'fail'}`}>
              Grade {grade}
            </span>
            <span className="badge neutral">EXPLAINABLE</span>
          </div>
          <div className="stat-card-footer">
            <span>Fleet of {analytics.total_devices} Managed Devices</span>
            <button
              onClick={() => onNavigateTab('compliance')}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Formula Details
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_outward</span>
            </button>
          </div>
        </div>

        {/* Critical Findings */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Critical Findings</span>
            <div className="stat-card-icon">
              <span className="material-symbols-outlined" style={{ color: 'var(--severity-critical)' }}>local_fire_department</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <div className="stat-card-value error">{sev.CRITICAL || 0}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>+ {sev.HIGH || 0} High</span>
          </div>
          <div className="stat-card-footer">
            <span style={{ color: 'var(--severity-critical)', fontWeight: 600 }}>Requires Immediate Remediation</span>
            <button
              onClick={() => onNavigateTab('remediation')}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--severity-critical)', cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              Playbooks
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_outward</span>
            </button>
          </div>
        </div>

        {/* Device Fleet */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Managed Fleet</span>
            <div className="stat-card-icon">
              <span className="material-symbols-outlined">dns</span>
            </div>
          </div>
          <div className="stat-card-value primary">{analytics.total_devices}</div>
          <div className="stat-card-sub">
            <span className="dot green"></span> Network Infrastructure Nodes
          </div>
          <div className="stat-card-footer">
            <span>Multi-Vendor: Cisco, Juniper, Fortinet, PAN</span>
          </div>
        </div>

        {/* Total Findings */}
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Findings</span>
            <div className="stat-card-icon">
              <span className="material-symbols-outlined">bug_report</span>
            </div>
          </div>
          <div className="stat-card-value">{analytics.total_findings}</div>
          <div className="stat-card-sub">
            Across all compliance frameworks
          </div>
          <div className="stat-card-footer">
            <span>{analytics.frameworks_evaluated} Frameworks Evaluated</span>
          </div>
        </div>
      </div>

      {/* Severity Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="info-card">
          <h3 style={{ marginBottom: '1rem' }}>Severity Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'CRITICAL', count: sev.CRITICAL || 0, color: 'var(--severity-critical)', className: 'critical' },
              { label: 'HIGH', count: sev.HIGH || 0, color: 'var(--severity-high)', className: 'high' },
              { label: 'MEDIUM', count: sev.MEDIUM || 0, color: 'var(--severity-medium)', className: 'medium' },
              { label: 'LOW', count: sev.LOW || 0, color: 'var(--severity-low)', className: 'low' },
              { label: 'INFO', count: sev.INFORMATIONAL || 0, color: 'var(--severity-info)', className: 'info' },
            ].map((s) => {
              const total = Object.values(sev).reduce((a, b) => a + b, 1);
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge ${s.className}`} style={{ width: 80, justifyContent: 'center' }}>{s.label}</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--surface-container)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: s.color, borderRadius: 3, transition: 'width 0.6s ease' }}></div>
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, width: 32, textAlign: 'right', fontFamily: "'JetBrains Mono', monospace" }}>{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="info-card">
          <h3 style={{ marginBottom: '1rem' }}>Compliance by Framework</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(analytics.framework_scores || [
              { name: 'CIS Benchmark v8.0', score: 87 },
              { name: 'NIST SP 800-53 Rev 5', score: 82 },
              { name: 'DISA STIG v10.1', score: 79 },
              { name: 'ISO 27001:2022', score: 91 },
              { name: 'Custom Enterprise', score: 85 },
            ]).map((fw, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{fw.name}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: fw.score >= 85 ? 'var(--severity-pass)' : fw.score >= 70 ? 'var(--severity-medium)' : 'var(--severity-critical)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {fw.score}%
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--surface-container)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${fw.score}%`, height: '100%', background: fw.score >= 85 ? 'var(--severity-pass)' : fw.score >= 70 ? 'var(--severity-medium)' : 'var(--severity-critical)', borderRadius: 2, transition: 'width 0.6s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Devices Table */}
      <div className="data-table-container">
        <div className="data-table-toolbar">
          <h3 style={{ fontSize: '0.9375rem' }}>Highest Risk Devices</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginLeft: 'auto' }}>
            Showing top devices by compliance risk
          </span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Vendor & Platform</th>
              <th>Compliance Score</th>
              <th>Critical</th>
              <th>High</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(analytics.top_risk_devices || [
              { hostname: 'Cisco-Core-01', ip: '10.240.0.1', vendor: 'Cisco IOS-XE', score: 68, critical: 4, high: 7, status: 'DRIFT' },
              { hostname: 'FortiGate-DC-01', ip: '10.240.1.254', vendor: 'Fortinet FortiOS', score: 72, critical: 2, high: 5, status: 'NON-COMPLIANT' },
              { hostname: 'Aruba-Access-12', ip: '10.240.12.8', vendor: 'Aruba AOS-CX', score: 81, critical: 1, high: 3, status: 'WARNING' },
              { hostname: 'PAN-FW-Edge-01', ip: '10.240.254.1', vendor: 'Palo Alto PAN-OS', score: 85, critical: 0, high: 2, status: 'COMPLIANT' },
              { hostname: 'Juniper-Border-01', ip: '10.240.100.1', vendor: 'Juniper Junos', score: 78, critical: 1, high: 4, status: 'NON-COMPLIANT' },
            ]).map((dev, i) => (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 600 }}>{dev.hostname}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)', fontFamily: "'JetBrains Mono', monospace" }}>{dev.ip}</div>
                </td>
                <td><span className="code-tag">{dev.vendor}</span></td>
                <td>
                  <span style={{ fontWeight: 700, color: dev.score >= 85 ? 'var(--severity-pass)' : dev.score >= 70 ? 'var(--severity-medium)' : 'var(--severity-critical)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {dev.score}%
                  </span>
                </td>
                <td>
                  {dev.critical > 0 ? (
                    <span className="badge critical">{dev.critical}</span>
                  ) : (
                    <span style={{ color: 'var(--outline)' }}>—</span>
                  )}
                </td>
                <td>
                  {dev.high > 0 ? (
                    <span className="badge high">{dev.high}</span>
                  ) : (
                    <span style={{ color: 'var(--outline)' }}>—</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${dev.status === 'COMPLIANT' ? 'pass' : dev.status === 'DRIFT' ? 'critical' : dev.status === 'WARNING' ? 'medium' : 'high'}`}>
                    {dev.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => onNavigateDevice(dev.hostname)}
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.625rem', fontSize: '0.6875rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    Inspect
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="data-table-footer">
          <span>Showing 5 of {analytics.total_devices} devices</span>
          <button
            onClick={() => onNavigateTab('devices')}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            View All Devices
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
