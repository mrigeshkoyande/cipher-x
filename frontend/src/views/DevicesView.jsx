import React, { useState, useEffect } from 'react';

export default function DevicesView({ selectedDeviceId, onSelectDevice, onNavigateTab }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch('/api/v1/devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(data.devices || []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const demoDevices = [
    { id: 'DEV-001', hostname: 'Cisco-Core-01', ip: '10.240.0.1', vendor: 'Cisco', platform: 'IOS-XE', model: 'Catalyst 9600', location: 'DC-East Rack 04', configVersion: 'v14.2', complianceScore: 68, status: 'DRIFT', lastIngestion: '2h ago', findings: { critical: 4, high: 7, medium: 3 } },
    { id: 'DEV-002', hostname: 'FortiGate-DC-01', ip: '10.240.1.254', vendor: 'Fortinet', platform: 'FortiOS 7.4', model: 'FortiGate 600F', location: 'DC-East Perimeter', configVersion: 'v8.1', complianceScore: 72, status: 'NON-COMPLIANT', lastIngestion: '4h ago', findings: { critical: 2, high: 5, medium: 4 } },
    { id: 'DEV-003', hostname: 'Aruba-Access-12', ip: '10.240.12.8', vendor: 'Aruba', platform: 'AOS-CX 10.12', model: 'CX 6300', location: 'Building 8 Floor 2', configVersion: 'v3.8', complianceScore: 81, status: 'WARNING', lastIngestion: '6h ago', findings: { critical: 1, high: 3, medium: 2 } },
    { id: 'DEV-004', hostname: 'PAN-FW-Edge-01', ip: '10.240.254.1', vendor: 'Palo Alto', platform: 'PAN-OS 11.1', model: 'PA-5260', location: 'DC-West Edge', configVersion: 'v22.3', complianceScore: 85, status: 'COMPLIANT', lastIngestion: '1h ago', findings: { critical: 0, high: 2, medium: 1 } },
    { id: 'DEV-005', hostname: 'Juniper-Border-01', ip: '10.240.100.1', vendor: 'Juniper', platform: 'Junos 23.4R1', model: 'MX304', location: 'DC-East Core', configVersion: 'v6.2', complianceScore: 78, status: 'NON-COMPLIANT', lastIngestion: '3h ago', findings: { critical: 1, high: 4, medium: 2 } },
    { id: 'DEV-006', hostname: 'Cisco-Dist-Agg-01', ip: '10.240.10.1', vendor: 'Cisco', platform: 'NX-OS 10.3', model: 'Nexus 9300', location: 'DC-East Distribution', configVersion: 'v11.0', complianceScore: 91, status: 'COMPLIANT', lastIngestion: '2h ago', findings: { critical: 0, high: 1, medium: 0 } },
  ];

  const displayDevices = devices.length > 0 ? devices : demoDevices;

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Device Inventory...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>dns</span>
          NETWORK ASSET INVENTORY
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>Devices & Configurations</h1>
            <p>Managed network infrastructure inventory with live configuration ingestion, compliance scoring, and vendor-specific security posture assessment.</p>
          </div>
          <button className="btn btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            Add Device
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Devices</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">dns</span></div>
          </div>
          <div className="stat-card-value primary">{displayDevices.length}</div>
          <div className="stat-card-sub">Multi-vendor managed fleet</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Compliant</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">check_circle</span></div>
          </div>
          <div className="stat-card-value success">{displayDevices.filter(d => d.status === 'COMPLIANT').length}</div>
          <div className="stat-card-sub">Passing all frameworks</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Non-Compliant</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">error</span></div>
          </div>
          <div className="stat-card-value error">{displayDevices.filter(d => d.status !== 'COMPLIANT').length}</div>
          <div className="stat-card-sub">Requiring remediation</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Active Drift</span>
            <div className="stat-card-icon"><span className="material-symbols-outlined">compare_arrows</span></div>
          </div>
          <div className="stat-card-value warning">{displayDevices.filter(d => d.status === 'DRIFT').length}</div>
          <div className="stat-card-sub">Configuration drift detected</div>
        </div>
      </div>

      {/* Device Table */}
      <div className="data-table-container">
        <div className="data-table-toolbar">
          <div className="data-table-search">
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search by hostname, IP, vendor..." />
          </div>
          <div className="filter-chip">Vendor: All</div>
          <div className="filter-chip">Status: All</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Hostname</th>
              <th>IP Address</th>
              <th>Vendor & Platform</th>
              <th>Location</th>
              <th>Config Version</th>
              <th>Score</th>
              <th>Findings</th>
              <th>Status</th>
              <th>Ingested</th>
            </tr>
          </thead>
          <tbody>
            {displayDevices.map((dev, i) => (
              <tr key={i} style={{ cursor: 'pointer' }} onClick={() => { setSelectedDevice(dev); onSelectDevice && onSelectDevice(dev.id); }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--on-surface-variant)' }}>
                      {dev.vendor === 'Fortinet' || dev.vendor === 'Palo Alto' ? 'security' : 'dns'}
                    </span>
                    <span style={{ fontWeight: 700 }}>{dev.hostname}</span>
                  </div>
                </td>
                <td><span className="code-tag">{dev.ip}</span></td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{dev.vendor}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--on-surface-variant)' }}>{dev.platform}</div>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{dev.location}</td>
                <td><span className="code-tag" style={{ fontSize: '0.625rem' }}>{dev.configVersion}</span></td>
                <td>
                  <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: dev.complianceScore >= 85 ? 'var(--severity-pass)' : dev.complianceScore >= 70 ? 'var(--severity-medium)' : 'var(--severity-critical)' }}>
                    {dev.complianceScore}%
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {dev.findings.critical > 0 && <span className="badge critical">{dev.findings.critical}C</span>}
                    {dev.findings.high > 0 && <span className="badge high">{dev.findings.high}H</span>}
                    {dev.findings.medium > 0 && <span className="badge medium">{dev.findings.medium}M</span>}
                  </div>
                </td>
                <td>
                  <span className={`badge ${dev.status === 'COMPLIANT' ? 'pass' : dev.status === 'DRIFT' ? 'fail' : dev.status === 'WARNING' ? 'medium' : 'high'}`}>
                    {dev.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{dev.lastIngestion}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="data-table-footer">
          <span>Showing {displayDevices.length} devices</span>
        </div>
      </div>
    </div>
  );
}
