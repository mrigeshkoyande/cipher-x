import React, { useState, useEffect } from 'react';

export default function HealthView() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSettingsTab, setActiveSettingsTab] = useState('status');

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/v1/health/detailed');
      if (res.ok) setHealth(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const demoServices = [
    { id: 'SERVICE 01', name: 'Ingestion & Syslog API', status: 'OPERATIONAL', metrics: [{ label: 'Latency', value: '14ms' }, { label: 'Uptime', value: '99.98%' }], footer: 'UDP/TCP port 514, 6514  Healthy Pool (12/12)' },
    { id: 'SERVICE 02', name: 'Deterministic ANTLR Parser Grid', status: 'OPERATIONAL', metrics: [{ label: 'Throughput', value: '1,420 lines/s' }, { label: 'Uptime', value: '100.0%' }], footer: 'Grammars: Cisco, EOS, JunOS  Zero Backlog' },
    { id: 'SERVICE 03', name: 'Cipher-X AI Semantic Inference Engine (v4.2)', status: 'OPERATIONAL', metrics: [{ label: 'Active Model', value: 'cx-nlp-v4.2b' }, { label: 'Avg Inference', value: '240ms' }], footer: 'Transformer Quant: FP16  99.4% Precision' },
    { id: 'SERVICE 04', name: 'Compliance Rules Engine', status: 'OPERATIONAL', metrics: [{ label: 'Evaluated', value: '274 controls' }, { label: 'Execution Time', value: '0.42s' }], footer: 'NIST 800-53, CIS v8, PCI-DSS  Deterministic' },
    { id: 'SERVICE 05', name: 'Cryptographic Merkle Ingestion Anchor', status: 'OPERATIONAL', metrics: [{ label: 'Hardware Attestation', value: 'HSM Bound' }, { label: 'Tree Depth', value: '32 Layers' }], footer: 'FIPS 140-3 Level 4  Root Key Synced' },
    { id: 'SERVICE 06', name: 'Report PDF Generation Cluster', status: 'OPERATIONAL', metrics: [{ label: 'Active Ingestion Queue', value: '0 Jobs Queued' }, { label: 'Worker State', value: 'Ready (4/4)' }], footer: 'Headless Chromium Engine  Idle Buffer Free' },
  ];

  const demoSettings = [
    { name: 'High Confidence Auto-Evaluation Threshold', description: 'Rules and compliance mappings with semantic score exceeding this threshold execute and finalize without manual human review.', value: 95, min: 80, max: 99, label: 'STRICT', minLabel: '80% (Permissive)', currentLabel: '95% (Current Policy: High Assurance)', maxLabel: '99% (Maximum Lock)' },
    { name: 'Training Studio Human-in-the-Loop Trigger Threshold', description: 'Semantic evaluations scoring below 75% confidence are automatically diverted to the Training Studio review queue for manual analyst validation.', value: 75, min: 50, max: 90, label: 'TRIAGE QUEUE', minLabel: '50% (High HITL Load)', currentLabel: '75% (Target Triage Equilibrium)', maxLabel: '90% (Low HITL Load)' },
  ];

  const demoToggles = [
    { name: 'Explainable Compliance Chain Logging', description: 'Retains deterministic AST tokens and intermediate parser logic for every evaluated rule to supply unchallengeable forensic audit trails.', extra: 'Storage impact: +12 MB/audit  Compliant: SOC2 CC6.1', active: true },
    { name: 'Zero Production Touch Mandate', description: 'Enforces strict read-only compliance posture. Cipher-X is cryptographically restricted from altering live network configuration state or issuing configuration write blocks.', extra: 'POLICY CODE: CIS-SEC-RO-ENFORCED', active: true, locked: true },
    { name: 'Vendor Syntax Auto-Detection', description: 'Automatically inspects raw network telemetry banners, CLI prompts, and config structure to attach the correct ANTLR grammar parser.', active: true },
  ];

  const vendorParsers = [
    { name: 'Cisco', detail: 'IOS-XE / NX-OS', color: '#1565c0' },
    { name: 'Fortinet', detail: 'FortiOS 7.x', color: '#d32f2f' },
    { name: 'Palo Alto', detail: 'PAN-OS 11.x', color: '#e65100' },
    { name: 'Juniper', detail: 'Junos OS', color: '#2e7d32' },
    { name: 'Arista', detail: 'EOS', color: '#6a1b9a' },
    { name: 'Aruba', detail: 'AOS-CX', color: '#00695c' },
    { name: 'SONIC', detail: 'Linux NOS', color: '#37474f' },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading System Health...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>System Health & Operational Settings</h1>
            <p>Monitor live status of the Cipher-X distributed parsing grid, AI semantic engines, and manage organizational compliance preferences.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sync</span>
              Telemetrics Sync: 2s ago
            </div>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
              Refresh Grid
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeSettingsTab === 'status' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('status')}>
          <span className="material-symbols-outlined">monitor_heart</span>
          System Status
          <span className="status-dot green"></span>
        </button>
        <button className={`tab ${activeSettingsTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('ai')}>
          <span className="material-symbols-outlined">psychology</span>
          AI Configuration
          <span className="tab-badge">v4.2b</span>
        </button>
        <button className={`tab ${activeSettingsTab === 'compliance' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('compliance')}>
          <span className="material-symbols-outlined">library_books</span>
          Compliance Framework Defaults
        </button>
        <button className={`tab ${activeSettingsTab === 'integrations' ? 'active' : ''}`} onClick={() => setActiveSettingsTab('integrations')}>
          <span className="material-symbols-outlined">share</span>
          Integrations & API
          <span className="status-dot green"></span>
        </button>
      </div>

      {/* System Status Tab */}
      {activeSettingsTab === 'status' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--on-surface-variant)' }}>
              GRID TELEMETRY · Core Infrastructure Node Map
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)', fontFamily: "'JetBrains Mono', monospace" }}>
              Cluster Hash: 0x8a92f…c81e | Region: us-east-1
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            {demoServices.map((svc) => (
              <div className="service-card" key={svc.id}>
                <div className="service-card-header">
                  <span className="service-card-label">{svc.id}</span>
                  <span className="badge operational">
                    <span className="status-dot green"></span>
                    {svc.status}
                  </span>
                </div>
                <div className="service-card-title">{svc.name}</div>
                <div className="service-card-metrics">
                  {svc.metrics.map((m, i) => (
                    <div key={i}>
                      <div className="service-card-metric-label">{m.label}</div>
                      <div className="service-card-metric-value">{m.value}</div>
                    </div>
                  ))}
                </div>
                <div className="service-card-footer">{svc.footer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Configuration Tab */}
      {activeSettingsTab === 'ai' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--on-surface-variant)', marginBottom: '0.25rem' }}>TAB 2 SETTINGS PANEL</div>
              <h2>AI Confidence & Attestation Thresholds</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.8125rem' }}>Calibrate human-in-the-loop audit routing, deterministic AST evidence chains, and vendor grammar auto-profiling.</p>
            </div>
            <button className="btn btn-secondary">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>tune</span>
              Runtime Engine Config
            </button>
          </div>

          {/* Threshold Sliders */}
          {demoSettings.map((setting, idx) => (
            <div className="info-card" key={idx} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>tune</span>
                    <span style={{ fontWeight: 700 }}>{setting.name}</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', maxWidth: 600 }}>{setting.description}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '1.25rem', border: '1px solid var(--outline-variant)', padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>{setting.value}%</span>
                  <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--primary)' }}>{setting.label}</span>
                </div>
              </div>
              {/* Slider */}
              <div style={{ position: 'relative', height: 8, background: 'var(--surface-container)', borderRadius: 4, marginTop: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ width: `${((setting.value - setting.min) / (setting.max - setting.min)) * 100}%`, height: '100%', background: 'var(--primary-container)', borderRadius: 4 }}></div>
                <div style={{ position: 'absolute', left: `${((setting.value - setting.min) / (setting.max - setting.min)) * 100}%`, top: -4, transform: 'translateX(-50%)', width: 16, height: 16, background: 'var(--primary-container)', borderRadius: 4, border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
                <span>{setting.minLabel}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{setting.currentLabel}</span>
                <span>{setting.maxLabel}</span>
              </div>
            </div>
          ))}

          {/* Toggles */}
          {demoToggles.map((toggle, idx) => (
            <div className="info-card" key={idx} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: toggle.locked ? 'var(--severity-pass)' : 'var(--primary)' }}>
                      {toggle.locked ? 'lock' : 'settings'}
                    </span>
                    <span style={{ fontWeight: 700 }}>{toggle.name}</span>
                    {toggle.locked && (
                      <span className="badge pass" style={{ fontSize: '0.5625rem' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 10 }}>lock</span>
                        LOCKED ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>{toggle.description}</div>
                  {toggle.extra && (
                    <div style={{ marginTop: '0.375rem', fontSize: '0.6875rem', display: 'flex', gap: '0.75rem' }}>
                      {toggle.extra.split('  ').map((part, i) => (
                        <span key={i} className="code-tag" style={{ fontSize: '0.625rem' }}>{part}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ marginLeft: '1rem' }}>
                  {toggle.locked ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.625rem', color: 'var(--on-surface-variant)' }}>
                      ALWAYS ON
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--severity-pass)' }}>check_circle</span>
                    </div>
                  ) : (
                    <div className={`toggle ${toggle.active ? 'active' : ''}`}></div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Active Parsers */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>
              ACTIVE PARSERS IN MEMORY POOL (7 VENDORS)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {vendorParsers.map((vp, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', background: `${vp.color}12`, border: `1px solid ${vp.color}30`, borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <span className="status-dot" style={{ background: vp.color }}></span>
                  {vp.name} <span style={{ fontWeight: 400, fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>({vp.detail})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Save Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-variant)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
              All changes are hashed to the immutable audit trail upon submission.
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary">Discard Changes</button>
              <button className="btn btn-primary">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeSettingsTab === 'compliance' && (
        <div className="info-card">
          <h3>Compliance Framework Defaults</h3>
          <p style={{ color: 'var(--on-surface-variant)' }}>Configure default compliance frameworks, scoring weights, and automatic evaluation schedules.</p>
        </div>
      )}

      {activeSettingsTab === 'integrations' && (
        <div className="info-card">
          <h3>Integrations & API</h3>
          <p style={{ color: 'var(--on-surface-variant)' }}>Manage API keys, webhook configurations, SIEM integrations, and third-party connector settings.</p>
        </div>
      )}
    </div>
  );
}
