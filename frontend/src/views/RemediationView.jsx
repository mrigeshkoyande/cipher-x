import React, { useState, useEffect } from 'react';

export default function RemediationView({ targetVendor, targetControlId }) {
  const [loading, setLoading] = useState(true);
  const [playbook, setPlaybook] = useState(null);

  useEffect(() => {
    fetchPlaybook();
  }, [targetVendor, targetControlId]);

  const fetchPlaybook = async () => {
    try {
      const res = await fetch(`/api/v1/remediation/playbook?vendor=${targetVendor}&control_id=${targetControlId}`);
      if (res.ok) setPlaybook(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const demoPlaybooks = [
    {
      id: 'PB-CISCO-SSH-09',
      vendor: 'cisco',
      controlId: 'CTRL-TELNET-01',
      title: 'Disable Telnet & Enforce SSHv2 on VTY Lines',
      severity: 'HIGH',
      framework: 'CIS-NET-004',
      description: 'Replaces cleartext Telnet access with SSH-only transport on all VTY lines to prevent credential interception.',
      preCheck: [
        '! Pre-Validation Check',
        'show line vty 0 15 | include transport',
        '! Expected: transport input telnet ssh',
        '! or: transport input telnet',
      ],
      commands: [
        'configure terminal',
        '  line vty 0 15',
        '    transport input ssh',
        '    transport output none',
        '    exec-timeout 15 0',
        '    login local',
        '  exit',
        '  ip ssh version 2',
        '  ip ssh time-out 60',
        '  ip ssh authentication-retries 3',
        'end',
        'write memory',
      ],
      postCheck: [
        '! Post-Validation Check',
        'show running-config | section line vty',
        '! Verify: transport input ssh (no telnet)',
        'show ssh',
        '! Verify: SSH Version 2 active',
      ],
      rollback: [
        'configure terminal',
        '  line vty 0 15',
        '    transport input telnet ssh',
        '  exit',
        'end',
        'write memory',
      ],
      safetyNotes: [
        'Non-destructive: Does not terminate active SSH sessions',
        'Telnet sessions in progress will be gracefully closed after timeout',
        'Ensure at least one local user with privilege 15 exists before applying',
        'Verify SSH keys are generated: show crypto key mypubkey rsa',
      ],
    },
  ];

  const pb = playbook || demoPlaybooks[0];

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Remediation Playbook...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>build</span>
          REMEDIATION PLAYBOOK
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1>{pb.title}</h1>
            <p>{pb.description}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
            <span className={`badge ${pb.severity === 'HIGH' ? 'high' : pb.severity === 'CRITICAL' ? 'critical' : 'medium'}`}>{pb.severity}</span>
            <span className="code-tag">{pb.framework}</span>
          </div>
        </div>
      </div>

      {/* Playbook Metadata */}
      <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-label">Playbook ID</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginTop: '0.25rem' }}>{pb.id}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Target Vendor</div>
          <div style={{ fontWeight: 700, marginTop: '0.25rem', textTransform: 'capitalize' }}>{pb.vendor}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Control</div>
          <div className="code-tag" style={{ marginTop: '0.25rem' }}>{pb.controlId}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--severity-pass)' }}>check_circle</span>
            <span style={{ fontWeight: 600, color: 'var(--severity-pass)' }}>Verified</span>
          </div>
        </div>
      </div>

      {/* Safety Notes */}
      <div className="alert info" style={{ marginBottom: '1rem' }}>
        <span className="material-symbols-outlined">shield</span>
        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.375rem' }}>Safety Guardrails & Prerequisites</div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem' }}>
            {pb.safetyNotes.map((note, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Pre-Check */}
        <div className="info-card" style={{ marginBottom: 0 }}>
          <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>fact_check</span>
            Pre-Validation Check
          </h4>
          <div className="code-block">
            {pb.preCheck.map((line, i) => (
              <div key={i} style={{ opacity: line.startsWith('!') ? 0.5 : 1 }}>{line}</div>
            ))}
          </div>
        </div>

        {/* Post-Check */}
        <div className="info-card" style={{ marginBottom: 0 }}>
          <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>
            Post-Validation Check
          </h4>
          <div className="code-block">
            {pb.postCheck.map((line, i) => (
              <div key={i} style={{ opacity: line.startsWith('!') ? 0.5 : 1 }}>{line}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Remediation Commands */}
      <div className="info-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>terminal</span>
            Remediation CLI Commands
          </h3>
          <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.625rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>content_copy</span>
            Copy to Clipboard
          </button>
        </div>
        <div className="code-block">
          {pb.commands.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* Rollback */}
      <div className="info-card" style={{ marginBottom: '1rem' }}>
        <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--severity-medium)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>undo</span>
          Emergency Rollback Script
        </h4>
        <div className="code-block">
          {pb.rollback.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-variant)' }}>
        <button className="btn btn-secondary">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
          Export Playbook
        </button>
        <button className="btn btn-primary">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_arrow</span>
          Execute Remediation
        </button>
      </div>
    </div>
  );
}
