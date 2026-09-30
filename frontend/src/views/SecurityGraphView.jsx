import React, { useState, useEffect } from 'react';

export default function SecurityGraphView({ selectedDeviceId, onNavigateTab }) {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filters, setFilters] = useState({
    layers: ['Device', 'Config', 'Security Fact', 'Control Policy', 'Finding', 'Remediation'],
    vendor: 'Cisco',
    severity: 'High',
  });

  useEffect(() => {
    fetchGraph();
  }, [selectedDeviceId]);

  const fetchGraph = async () => {
    try {
      const res = await fetch('/api/v1/graph/topology');
      if (res.ok) setGraphData(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const demoNodes = {
    device: { hostname: 'Cisco-Core-01', ip: '10.240.0.1', platform: 'Catalyst 9600 Series', vlan: 'VLAN 10,20,50', uptime: '142d' },
    config: { filename: 'cisco-core-01-running.cfg', version: 'v14.2', sha256: '8f91…c7d2', tokens: 2410 },
    finding: { controlId: 'CIS-NET-004', title: 'CIS-NET-004 Finding', status: 'FAIL' },
    causality: [
      { label: 'Cisco-Core-01', icon: 'dns' },
      { label: 'Snapshot v14.2', icon: 'description' },
      { label: 'remote_management.telnet = true', icon: 'code', isCode: true },
      { label: 'CIS-NET-004', icon: 'gavel' },
      { label: 'Violation FAIL', icon: 'error', isError: true },
      { label: 'Remediation CLI', icon: 'terminal' },
    ],
    blastRadius: {
      affected: 3,
      description: 'Cleartext Telnet exposure allows unencrypted credential interception traversing intermediate transit networks:',
      devices: [
        { name: 'Cisco-Dist-Agg-01', ip: '10.240.10.1' },
        { name: 'Cisco-Dist-Agg-02', ip: '10.240.10.2' },
        { name: 'Edge-Border-GW-01', ip: '10.240.254.254' },
      ],
    },
    remediation: { id: 'PB-CISCO-SSH-09', description: 'Automatically replaces transport input telnet with transport input ssh across VTY 0 to 15 without terminating active sessions.' },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Security Knowledge Graph...</div>
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
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Security Knowledge Graph
              <span className="badge primary">LIVE CAUSAL MAP</span>
            </h1>
            <p>
              Interactive relational topology visualizing the causal compliance chain:
              <span style={{ color: 'var(--severity-pass)', fontWeight: 600 }}> Device</span> →
              <span style={{ fontWeight: 600 }}> Configuration Snapshot</span> →
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}> Normalized Fact</span> →
              Compliance Control →
              <span style={{ color: 'var(--severity-critical)', fontWeight: 600 }}> Security Finding</span> →
              Remediation Action.
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sync</span>
            Graph updated 4m ago
          </div>
        </div>
      </div>

      {/* Layer Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>ACTIVE LAYERS:</span>
        {filters.layers.map((layer, i) => {
          const colors = ['var(--severity-pass)', '#555', 'var(--primary)', 'var(--severity-info)', 'var(--severity-critical)', 'var(--severity-medium)'];
          return (
            <span key={i} className="filter-chip active" style={{ borderColor: colors[i], background: `${colors[i]}15` }}>
              <span className="status-dot" style={{ background: colors[i] }}></span>
              {layer}
            </span>
          );
        })}
      </div>

      {/* Vendor/Severity Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>VENDOR:</span>
        <select style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
          <option>Cisco</option>
          <option>Juniper</option>
          <option>Fortinet</option>
          <option>Palo Alto</option>
        </select>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>SEVERITY:</span>
        <select style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
          <option>High</option>
          <option>Critical</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <div className="topbar-search" style={{ maxWidth: 250 }}>
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Cisco-Core-01" defaultValue="Cisco-Core-01" />
        </div>
      </div>

      {/* Graph Content + Side Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1rem' }}>
        {/* Graph Canvas Area */}
        <div className="info-card" style={{ minHeight: 500, position: 'relative' }}>
          {/* Tier Headers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--surface-variant)' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>TIER 1: DEVICE NODE <span style={{ marginLeft: '0.5rem' }}>N=1</span></span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>TIER 2: CONFIG SNAPSHOT <span style={{ marginLeft: '0.5rem' }}>N=1</span></span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>TIER 3: FACTS</span>
          </div>

          {/* Device Node */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="stat-card" style={{ maxWidth: 280, borderColor: 'var(--severity-pass)', borderWidth: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge pass" style={{ fontSize: '0.5625rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>dns</span>
                  CORE SWITCH
                </span>
                <span className="status-dot green" style={{ marginLeft: 'auto' }}></span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>{demoNodes.device.hostname}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', fontFamily: "'JetBrains Mono', monospace" }}>
                IP: {demoNodes.device.ip}<br />{demoNodes.device.platform}
              </div>
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--surface-variant)', display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
                <span>{demoNodes.device.vlan}</span>
                <span>UPTIME: {demoNodes.device.uptime}</span>
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
              <div style={{ width: 60, height: 2, background: 'var(--outline-variant)', position: 'relative' }}>
                <div style={{ position: 'absolute', right: -4, top: -4, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid var(--outline-variant)' }}></div>
              </div>
            </div>

            {/* Config Snapshot Node */}
            <div className="stat-card" style={{ maxWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge neutral" style={{ fontSize: '0.5625rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>description</span>
                  CFG SNAPSHOT
                </span>
                <span className="badge neutral" style={{ fontSize: '0.5625rem', marginLeft: 'auto' }}>v14.2</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{demoNodes.config.filename}</div>
              <div className="hash-value" style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
                SHA256: {demoNodes.config.sha256}
                <button className="topbar-icon-btn" style={{ width: 20, height: 20 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>content_copy</span>
                </button>
              </div>
              <div style={{ marginTop: '0.375rem', fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>
                Parsed {demoNodes.config.tokens} AST tokens
              </div>
            </div>
          </div>

          {/* Graph Status Bar */}
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.625rem 1rem', background: 'var(--surface-container)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>hub</span>
              <strong>GRAPH STATUS</strong>
            </div>
            <span>14 Active Relations · 2 Severe Paths</span>
            <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 16, height: 2, background: 'var(--on-surface)' }}></span>Verified Causality</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 16, height: 2, background: 'var(--severity-critical)' }}></span>Violation Link</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 16, height: 2, background: 'var(--primary)' }}></span>Normalized Fact</span>
            </div>
          </div>
        </div>

        {/* Inspection Sidecar */}
        <div>
          <div className="info-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>INSPECTION SIDECAR</div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Node Inspector: CIS-NET-004 Finding</div>
              </div>
              <span className="badge fail">FAIL</span>
            </div>

            {/* Causal Chain */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>CAUSAL PROPAGATION CHAIN</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.5rem', borderLeft: '2px solid var(--outline-variant)' }}>
                {demoNodes.causality.map((node, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0', paddingLeft: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: node.isError ? 'var(--severity-critical)' : 'var(--on-surface-variant)' }}>{node.icon}</span>
                    {node.isCode ? (
                      <span className="code-tag" style={{ fontSize: '0.6875rem' }}>{node.label}</span>
                    ) : (
                      <span style={{ fontSize: '0.8125rem', fontWeight: node.isError ? 700 : 500, color: node.isError ? 'var(--severity-critical)' : 'var(--on-surface)' }}>{node.label}</span>
                    )}
                    {i < demoNodes.causality.length - 1 && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--outline)' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Blast Radius */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>BLAST RADIUS ASSESSMENT</div>
              <div className="alert warning" style={{ marginBottom: '0.5rem' }}>
                <span className="material-symbols-outlined">warning</span>
                <div>
                  <div style={{ fontWeight: 700 }}>{demoNodes.blastRadius.affected} Affected Downstream Devices</div>
                  <div style={{ fontSize: '0.75rem' }}>{demoNodes.blastRadius.description}</div>
                </div>
              </div>
              {demoNodes.blastRadius.devices.map((dev, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.8125rem' }}>
                  <span>• {dev.name}</span>
                  <span className="code-tag" style={{ fontSize: '0.625rem' }}>{dev.ip}</span>
                </div>
              ))}
            </div>

            {/* Upstream Evidence */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em' }}>UPSTREAM EVIDENCE</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)' }}>Line 142 of running config</span>
              </div>
              <div className="code-block">
                <div style={{ opacity: 0.6 }}># /mnt/configs/cisco-core-01-running.cfg</div>
                <div>140: line vty 0 4</div>
                <div>141: exec-timeout 15 0</div>
                <div style={{ background: 'rgba(211, 47, 47, 0.3)', padding: '0 0.25rem', borderRadius: 2 }}>142: transport input telnet</div>
                <div>143: transport output none</div>
                <div>144: stopbits 1</div>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.375rem', fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto' }}>
                View Full Forensic Snapshot
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              </button>
            </div>

            {/* Target Action Plan */}
            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>TARGET ACTION PLAN</div>
              <div className="stat-card" style={{ marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--severity-pass)' }}>check_circle</span>
                    <span style={{ fontWeight: 600 }}>Playbook Verified</span>
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>Id: {demoNodes.remediation.id}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: '0.375rem' }}>
                  {demoNodes.remediation.description}
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
                Trigger Auto-Remediation Playbook
              </button>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>Dismiss Finding</button>
                <button style={{ background: 'none', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit' }}>Create Jira Ticket</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
