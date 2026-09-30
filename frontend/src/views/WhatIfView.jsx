import React, { useState, useEffect } from 'react';

export default function WhatIfView({ selectedDeviceId, onNavigateTab }) {
  const [loading, setLoading] = useState(true);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const demoMutations = [
    { id: 1, description: 'Add "transport input telnet" to line vty 0 4', impact: 'CRITICAL', controlsAffected: ['CIS-NET-004', 'NIST-SC-008'], scoreDelta: -8.2, riskLabel: 'Enables cleartext credential transmission' },
    { id: 2, description: 'Remove "ntp authenticate" from global config', impact: 'MEDIUM', controlsAffected: ['CIS-NET-007', 'NIST-AU-008'], scoreDelta: -3.1, riskLabel: 'Disables NTP authentication chain' },
    { id: 3, description: 'Add "ip ssh version 2" to global config', impact: 'POSITIVE', controlsAffected: ['CIS-NET-001'], scoreDelta: +4.5, riskLabel: 'Enforces SSHv2 protocol exclusively' },
    { id: 4, description: 'Add "snmp-server community PUBLIC RO" to global config', impact: 'HIGH', controlsAffected: ['CIS-NET-005', 'DISA-NET-030'], scoreDelta: -6.7, riskLabel: 'Exposes SNMP with default community string' },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <div className="loading-text">Initializing What-If Simulator...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>query_stats</span>
          PREDICTIVE INTELLIGENCE
        </div>
        <h1>Query & What-If Simulator</h1>
        <p>Predictive configuration mutation simulator — forecast compliance score impact before deploying changes to production network infrastructure.</p>
      </div>

      {/* Query Input */}
      <div className="info-card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>terminal</span>
          Configuration Mutation Query
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <select style={{ padding: '0.375rem 0.75rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
            <option>Target: Cisco-Core-01</option>
            <option>Target: FortiGate-DC-01</option>
            <option>Target: All Fleet</option>
          </select>
          <select style={{ padding: '0.375rem 0.75rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontSize: '0.8125rem', fontFamily: 'inherit' }}>
            <option>Framework: CIS v8.0</option>
            <option>Framework: NIST 800-53</option>
            <option>Framework: All Frameworks</option>
          </select>
        </div>
        <textarea
          placeholder="Enter configuration change to simulate (e.g., 'What happens if I enable telnet on VTY lines?')..."
          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', minHeight: 80, resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button className="btn btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_arrow</span>
            Run Simulation
          </button>
        </div>
      </div>

      {/* Simulation Results */}
      <h3 style={{ marginBottom: '0.75rem' }}>Simulation Results — Predicted Impact</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {demoMutations.map((mut) => (
          <div className="info-card" key={mut.id} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <span className={`badge ${mut.impact === 'CRITICAL' ? 'critical' : mut.impact === 'HIGH' ? 'high' : mut.impact === 'MEDIUM' ? 'medium' : 'pass'}`}>
                    {mut.impact}
                  </span>
                  <span style={{ fontWeight: 600 }}>{mut.riskLabel}</span>
                </div>
                <div className="code-block" style={{ padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
                  {mut.description}
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', fontSize: '0.6875rem' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Controls Affected:</span>
                  {mut.controlsAffected.map((c, i) => (
                    <span key={i} className="code-tag" style={{ fontSize: '0.625rem' }}>{c}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '0.625rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--on-surface-variant)', marginBottom: '0.25rem' }}>SCORE DELTA</div>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: "'JetBrains Mono', monospace", color: mut.scoreDelta > 0 ? 'var(--severity-pass)' : 'var(--severity-critical)' }}>
                  {mut.scoreDelta > 0 ? '+' : ''}{mut.scoreDelta}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="alert warning" style={{ marginTop: '1rem' }}>
        <span className="material-symbols-outlined">warning</span>
        <div>
          <div style={{ fontWeight: 700 }}>Aggregate Impact Summary</div>
          <div style={{ fontSize: '0.8125rem' }}>
            If all listed mutations are applied simultaneously, the predicted fleet compliance score would drop from <strong>91.8%</strong> to <strong>78.3%</strong> (Δ -13.5%). This would trigger 6 new HIGH severity findings and 2 CRITICAL violations.
          </div>
        </div>
      </div>
    </div>
  );
}
