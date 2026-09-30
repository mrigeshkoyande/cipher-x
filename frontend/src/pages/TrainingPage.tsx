import React, { useEffect, useState } from 'react';
import { CheckCircle, X, AlertTriangle, HelpCircle } from 'lucide-react';
import { api, Mapping } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { SkeletonCard } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../contexts/ToastContext';

export function TrainingPage() {
  const { addToast } = useToast();
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'PENDING' | 'VALIDATED' | 'REJECTED'>('PENDING');
  const [selected, setSelected] = useState<Mapping | null>(null);
  const [editParam, setEditParam] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.training.list(tab).then(setMappings).finally(() => setLoading(false));
  };
  useEffect(() => { load(); setSelected(null); }, [tab]);

  const handleAction = async (id: string, action: string, param?: string) => {
    setSaving(true);
    try {
      const updated = await api.training.action(id, action, param || undefined);
      setMappings(prev => prev.filter(m => m.id !== id));
      setSelected(null);
      addToast('success', `Mapping ${action.toLowerCase()}d successfully`);
      if (action === 'APPROVE') load();
    } catch {
      addToast('error', `Failed to ${action.toLowerCase()} mapping`);
    } finally {
      setSaving(false);
    }
  };

  const pendingCount = mappings.length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Training Studio</h1>
        <p className="page-subtitle">Teach CIPHER-X how to understand new vendor syntax</p>
      </div>

      {/* Notice */}
      <div style={{ padding: '12px 16px', background: 'rgba(122,143,166,0.08)', border: '1px solid var(--cx-info)', borderRadius: 8, marginBottom: 20, fontSize: 13, color: 'var(--cx-info)' }}>
        ✦ Approved mappings are stored in the registry and used for all future configurations. AI suggests interpretations — humans approve them.
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['PENDING', 'VALIDATED', 'REJECTED'] as const).map(t => (
          <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t)}>
            {t}
            {t === 'PENDING' && pendingCount > 0 && (
              <span style={{ marginLeft: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid-2">{[1,2].map(i => <SkeletonCard key={i} />)}</div>
      ) : mappings.length === 0 ? (
        <EmptyState
          title={tab === 'PENDING' ? 'No mappings require review' : `No ${tab.toLowerCase()} mappings`}
          description={tab === 'PENDING' ? 'CIPHER-X has no unknown configuration syntax waiting for administrator approval.' : `No mappings have been ${tab.toLowerCase()} yet.`}
        />
      ) : (
        <div className="grid-2">
          {/* Left: List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mappings.map(m => (
              <div
                key={m.id}
                onClick={() => { setSelected(m); setEditParam(m.normalized_parameter); }}
                className="card"
                style={{
                  cursor: 'pointer',
                  borderColor: selected?.id === m.id ? 'var(--cx-orange)' : 'var(--cx-border)',
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600, color: 'var(--cx-text)', wordBreak: 'break-all' }}>
                    {m.raw_command_pattern}
                  </div>
                  <StatusBadge status={m.status as never} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--cx-muted)' }}>
                  {m.vendor} · {m.platform}
                </div>
                <div style={{ fontSize: 11, color: 'var(--cx-orange)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                  → {m.normalized_parameter}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: m.confidence >= 0.8 ? 'var(--cx-pass)' : 'var(--cx-warning)', fontWeight: 600 }}>
                    AI: {(m.confidence * 100).toFixed(0)}%
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--cx-muted)' }}>confidence</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Detail panel */}
          {selected ? (
            <div className="card-dark">
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cx-dark-muted)', marginBottom: 8 }}>Raw Configuration</div>
                <div className="code-block" style={{ fontSize: 13, padding: '12px 14px' }}>
                  <pre style={{ margin: 0 }}>{selected.raw_command_pattern}</pre>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cx-dark-muted)', marginBottom: 8 }}>
                  ✦ AI Interpretation
                  <span style={{ marginLeft: 8, fontWeight: 400, color: selected.confidence >= 0.8 ? 'var(--cx-pass)' : 'var(--cx-warning)' }}>
                    {(selected.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
                <div style={{ padding: '12px 14px', background: 'var(--cx-dark-elevated)', borderRadius: 8, border: '1px solid var(--cx-dark-border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--cx-dark-muted)', marginBottom: 6 }}>Suggested Parameter:</div>
                  <input
                    type="text"
                    value={editParam}
                    onChange={e => setEditParam(e.target.value)}
                    style={{ width: '100%', background: 'var(--cx-dark)', border: '1px solid var(--cx-dark-border)', borderRadius: 6, padding: '8px 12px', color: 'var(--cx-dark-text)', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, outline: 'none' }}
                    aria-label="Edit normalized parameter"
                  />
                  <div style={{ fontSize: 12, color: 'var(--cx-dark-muted)', marginTop: 8 }}>Transformation: <span style={{ color: 'var(--cx-orange)' }}>{selected.transformation}</span></div>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cx-dark-muted)', marginBottom: 8 }}>Security Model Target</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--cx-orange)', padding: '10px 14px', background: 'var(--cx-dark-elevated)', borderRadius: 8 }}>
                  {editParam || selected.normalized_parameter}
                </div>
              </div>

              {tab === 'PENDING' && (
                <>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,116,23,0.07)', border: '1px solid rgba(255,116,23,0.3)', borderRadius: 8, fontSize: 12, color: 'var(--cx-dark-muted)', marginBottom: 16 }}>
                    This mapping will apply to all future {selected.vendor} {selected.platform} configurations.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" onClick={() => handleAction(selected.id, 'APPROVE', editParam)} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                      <CheckCircle size={14} /> {saving ? 'Saving...' : 'Approve Mapping'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleAction(selected.id, 'REJECT')} disabled={saving}>
                      <X size={14} /> Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, color: 'var(--cx-muted)', textAlign: 'center' }}>
              <HelpCircle size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <div style={{ fontSize: 14 }}>Select a mapping to review</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Review AI-suggested parameter mappings and approve or reject them.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
