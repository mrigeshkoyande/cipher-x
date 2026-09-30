import React, { useEffect, useState } from 'react';
import { api, Configuration, Device, DriftResult } from '../api/client';
import { SkeletonCard } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

function DiffLine({ type, text }: { type: string; text: string }) {
  const colors: Record<string, { bg: string; color: string; prefix: string }> = {
    ADDED:     { bg: 'rgba(37,185,129,0.08)', color: 'var(--cx-pass)',    prefix: '+' },
    REMOVED:   { bg: 'rgba(224,90,97,0.08)',  color: 'var(--cx-fail)',    prefix: '-' },
    UNCHANGED: { bg: 'transparent',            color: 'var(--cx-dark-muted)', prefix: ' ' },
  };
  const style = colors[type] || colors.UNCHANGED;
  return (
    <div style={{ background: style.bg, padding: '2px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, borderLeft: type !== 'UNCHANGED' ? `2px solid ${style.color}` : '2px solid transparent' }}>
      <span style={{ color: style.color, marginRight: 8, userSelect: 'none' }}>{style.prefix}</span>
      <span style={{ color: style.color }}>{text}</span>
    </div>
  );
}

export function DriftPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [configOld, setConfigOld] = useState('');
  const [configNew, setConfigNew] = useState('');
  const [drift, setDrift] = useState<DriftResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.devices.list().then(d => {
      setDevices(d);
      if (d.length > 0) setSelectedDevice(d[0].id);
    }).finally(() => setInitLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;
    api.configurations.list(selectedDevice).then(c => {
      setConfigurations(c);
      setConfigOld('');
      setConfigNew('');
      setDrift(null);
    });
  }, [selectedDevice]);

  const compare = () => {
    if (!configOld || !configNew || configOld === configNew) {
      setError('Select two different configuration versions to compare');
      return;
    }
    setError('');
    setLoading(true);
    api.drift.compare(configOld, configNew)
      .then(setDrift)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  const devConfigs = configurations.sort((a, b) => a.version - b.version);

  if (initLoading) return <div className="page"><SkeletonCard /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Drift Analysis</h1>
        <p className="page-subtitle">Compare configuration versions and detect security-impacting changes</p>
      </div>

      {/* Selectors */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 200 }}>
            <label className="form-label" htmlFor="drift-device">Device</label>
            <select id="drift-device" value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)} className="form-input" aria-label="Select device">
              {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 160 }}>
            <label className="form-label" htmlFor="drift-old">Version A (Old)</label>
            <select id="drift-old" value={configOld} onChange={e => setConfigOld(e.target.value)} className="form-input" aria-label="Old configuration version">
              <option value="">Select version</option>
              {devConfigs.map(c => <option key={c.id} value={c.id}>v{c.version} — {c.filename}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: 160 }}>
            <label className="form-label" htmlFor="drift-new">Version B (New)</label>
            <select id="drift-new" value={configNew} onChange={e => setConfigNew(e.target.value)} className="form-input" aria-label="New configuration version">
              <option value="">Select version</option>
              {devConfigs.map(c => <option key={c.id} value={c.id}>v{c.version} — {c.filename}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={compare} disabled={loading || !configOld || !configNew}>
            {loading ? 'Comparing...' : 'Compare Versions'}
          </button>
        </div>
        {error && <div style={{ marginTop: 12, fontSize: 13, color: 'var(--cx-fail)' }} role="alert">{error}</div>}
      </div>

      {configurations.length < 2 && !initLoading && (
        <div style={{ padding: '16px 20px', background: 'var(--cx-surface-2)', border: '1px solid var(--cx-border)', borderRadius: 8, fontSize: 13, color: 'var(--cx-muted)' }}>
          Upload at least 2 configuration versions for this device to enable drift comparison.
        </div>
      )}

      {drift && (
        <div className="animate-fade-in">
          {/* Summary */}
          <div className="grid-4" style={{ marginBottom: 20 }}>
            {[
              { label: 'Added', count: drift.added_facts.length, color: 'var(--cx-pass)' },
              { label: 'Removed', count: drift.removed_facts.length, color: 'var(--cx-fail)' },
              { label: 'Changed', count: drift.changed_facts.length, color: 'var(--cx-warning)' },
              { label: 'Affected Controls', count: drift.affected_controls_count, color: drift.risk_change !== 'NO_CHANGE' ? 'var(--cx-orange)' : 'var(--cx-muted)' },
            ].map(item => (
              <div key={item.label} className="metric-card">
                <div className="metric-label">{item.label}</div>
                <div className="metric-value" style={{ fontSize: 36, color: item.color }}>{item.count}</div>
              </div>
            ))}
          </div>

          <div className="grid-2" style={{ gap: 16 }}>
            {/* Fact Changes */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--cx-border)' }}>
                <h3 style={{ fontSize: 14 }}>Security Parameter Changes</h3>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflow: 'auto' }}>
                {[...drift.added_facts.map(f => ({ ...f, type: 'ADDED' })), ...drift.removed_facts.map(f => ({ ...f, type: 'REMOVED' })), ...drift.changed_facts.map(f => ({ ...f, type: 'CHANGED' }))].map((fact, i) => (
                  <div key={i} style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: fact.type === 'ADDED' ? 'rgba(37,185,129,0.06)' : fact.type === 'REMOVED' ? 'rgba(224,90,97,0.06)' : 'rgba(240,161,58,0.06)',
                    border: `1px solid ${fact.type === 'ADDED' ? 'rgba(37,185,129,0.2)' : fact.type === 'REMOVED' ? 'rgba(224,90,97,0.2)' : 'rgba(240,161,58,0.2)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: fact.type === 'ADDED' ? 'var(--cx-pass)' : fact.type === 'REMOVED' ? 'var(--cx-fail)' : 'var(--cx-warning)' }}>{fact.type}</span>
                      <span style={{ fontSize: 11, color: 'var(--cx-muted)' }}>Line {fact.line}</span>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--cx-text)', marginBottom: 4 }}>{fact.parameter}</div>
                    {fact.type === 'CHANGED' ? (
                      <div style={{ fontSize: 12, color: 'var(--cx-muted)' }}>
                        <span style={{ color: 'var(--cx-fail)', textDecoration: 'line-through' }}>{String((fact as any).old_value)}</span>
                        {' → '}
                        <span style={{ color: 'var(--cx-pass)' }}>{String((fact as any).new_value)}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{String(fact.value)}</div>
                    )}
                  </div>
                ))}
                {drift.added_facts.length + drift.removed_facts.length + drift.changed_facts.length === 0 && (
                  <div style={{ color: 'var(--cx-muted)', fontSize: 13, padding: '16px 0' }}>No security parameter changes detected.</div>
                )}
              </div>
            </div>

            {/* Line Diff */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--cx-border)', display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 14 }}>Line-level Diff</h3>
                <span style={{ fontSize: 11, color: 'var(--cx-muted)' }}>v{drift.version_old} → v{drift.version_new}</span>
              </div>
              <div style={{ background: 'var(--cx-dark)', maxHeight: 400, overflow: 'auto', padding: '8px 0' }}>
                {drift.line_diff.slice(0, 80).map((line, i) => (
                  <DiffLine key={i} type={line.type} text={line.text} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
