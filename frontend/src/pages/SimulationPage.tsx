import React, { useEffect, useState } from 'react';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import { api, Device, SimulationResult } from '../api/client';
import { SkeletonCard } from '../components/common/Skeleton';
import { useToast } from '../contexts/ToastContext';

export function SimulationPage() {
  const { addToast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [parameter, setParameter] = useState('');
  const [proposedValue, setProposedValue] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    api.devices.list().then(d => {
      setDevices(d);
      if (d.length > 0) setSelectedDevice(d[0].id);
    }).finally(() => setInitLoading(false));
  }, []);

  const run = async () => {
    if (!selectedDevice || !parameter || !proposedValue) {
      addToast('warning', 'Fill in all fields to run simulation');
      return;
    }
    setRunning(true);
    setResult(null);
    try {
      const res = await api.simulation.run(selectedDevice, parameter, proposedValue);
      setResult(res);
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const scoreChange = result ? result.simulated_score - result.baseline_score : 0;

  if (initLoading) return <div className="page"><SkeletonCard /></div>;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1 className="page-title">What-If Simulation</h1>
        <p className="page-subtitle">Predict compliance impact of configuration changes before applying them</p>
      </div>

      {/* Simulation Banner */}
      <div className="sim-banner" style={{ marginBottom: 20 }}>
        ⚠ SIMULATION MODE — Changes are not applied to any device
      </div>

      {/* Input Form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, marginBottom: 20 }}>Simulation Parameters</h3>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="sim-device">Target Device</label>
            <select id="sim-device" value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)} className="form-input" aria-label="Select device">
              {devices.map(d => <option key={d.id} value={d.id}>{d.name} ({d.vendor})</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="sim-param">Configuration Parameter</label>
            <input id="sim-param" type="text" className="form-input" value={parameter} onChange={e => setParameter(e.target.value)}
              placeholder="e.g. telnet_enabled" aria-label="Configuration parameter" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sim-value">Proposed Value</label>
          <input id="sim-value" type="text" className="form-input" value={proposedValue} onChange={e => setProposedValue(e.target.value)}
            placeholder="e.g. false, disabled, enabled, 1024" aria-label="Proposed value" />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={run} disabled={running}>
            <FlaskConical size={14} /> {running ? 'Running Simulation...' : 'Run Simulation'}
          </button>
          {result && <button className="btn btn-secondary" onClick={() => setResult(null)}>Clear Results</button>}
        </div>
      </div>

      {/* Results */}
      {running && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--cx-muted)' }}>
          <div style={{ fontSize: 14 }}>Running simulation...</div>
          <div className="skeleton" style={{ marginTop: 12, height: 4, borderRadius: 2 }} />
        </div>
      )}

      {result && !running && (
        <div className="animate-fade-in">
          {/* Score Impact */}
          <div className="posture-hero" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--cx-dark-muted)', marginBottom: 8 }}>Simulating: <strong style={{ color: 'var(--cx-orange)' }}>{result.device_name}</strong> · {parameter} = {String(proposedValue)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--cx-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Baseline Score</div>
                <div style={{ fontSize: 40, fontWeight: 300, color: 'var(--cx-dark-muted)' }}>{result.baseline_score.toFixed(0)}%</div>
              </div>
              <div style={{ fontSize: 32, color: 'var(--cx-dark-muted)' }}>→</div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--cx-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Simulated Score</div>
                <div style={{ fontSize: 40, fontWeight: 300, color: scoreChange > 0 ? 'var(--cx-pass)' : scoreChange < 0 ? 'var(--cx-fail)' : 'var(--cx-dark-text)' }}>
                  {result.simulated_score.toFixed(0)}%
                </div>
              </div>
              <div style={{ padding: '8px 16px', borderRadius: 8, background: scoreChange > 0 ? 'rgba(37,185,129,0.12)' : scoreChange < 0 ? 'rgba(224,90,97,0.12)' : 'var(--cx-dark-elevated)', border: `1px solid ${scoreChange > 0 ? 'var(--cx-pass)' : scoreChange < 0 ? 'var(--cx-fail)' : 'var(--cx-dark-border)'}` }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: scoreChange > 0 ? 'var(--cx-pass)' : scoreChange < 0 ? 'var(--cx-fail)' : 'var(--cx-dark-muted)', textAlign: 'center' }}>
                  {scoreChange > 0 ? '+' : ''}{scoreChange.toFixed(1)}%
                </div>
                <div style={{ fontSize: 11, color: 'var(--cx-dark-muted)', textAlign: 'center' }}>Score Δ</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--cx-dark-muted)' }}>Improved Controls: </span>
                <span style={{ color: 'var(--cx-pass)', fontWeight: 600 }}>{result.improved_controls_count}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--cx-dark-muted)' }}>Worsened Controls: </span>
                <span style={{ color: 'var(--cx-fail)', fontWeight: 600 }}>{result.worsened_controls_count}</span>
              </div>
            </div>
          </div>

          {/* Affected Controls */}
          {result.affected_controls.length > 0 && (
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, marginBottom: 16 }}>Affected Controls</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.affected_controls.map((ctrl, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, background: 'var(--cx-surface-2)', border: '1px solid var(--cx-border)' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--cx-orange)', minWidth: 80 }}>{ctrl.control_id}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{ctrl.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: ctrl.change === 'IMPROVED' ? 'var(--cx-pass)' : 'var(--cx-fail)', minWidth: 80, textAlign: 'right' }}>
                      {ctrl.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ padding: '12px 16px', background: 'rgba(255,116,23,0.06)', border: '1px solid rgba(255,116,23,0.3)', borderRadius: 8, fontSize: 12, color: 'var(--cx-orange)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <AlertTriangle size={14} style={{ marginTop: 1, flexShrink: 0 }} />
            <span>{result.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}
