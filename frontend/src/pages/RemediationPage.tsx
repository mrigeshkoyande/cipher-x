import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle } from 'lucide-react';
import { api, Remediation } from '../api/client';
import { SeverityBadge } from '../components/common/StatusBadge';
import { SkeletonCard } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../contexts/ToastContext';

export function RemediationPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState<Remediation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSev, setFilterSev] = useState('');

  const load = () => {
    setLoading(true);
    api.remediation.list(filterSev || undefined).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filterSev]);

  const copyCmd = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    addToast('success', 'Command copied to clipboard');
  };

  const sev_order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const grouped: Record<string, Remediation[]> = {};
  items.forEach(i => { grouped[i.severity] = [...(grouped[i.severity] || []), i]; });

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Remediation</h1>
          <p className="page-subtitle">Advisory remediation commands — review manually before applying</p>
        </div>
      </div>

      {/* Notice */}
      <div style={{ padding: '12px 16px', background: 'rgba(255,116,23,0.07)', border: '1px solid var(--cx-orange)', borderRadius: 8, marginBottom: 20, fontSize: 13, color: 'var(--cx-orange)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
        ⚠ Advisory only — CIPHER-X never executes remediation commands automatically
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '12px 20px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`btn btn-sm ${!filterSev ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterSev('')}>All</button>
          {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
            <button key={s} className={`btn btn-sm ${filterSev === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterSev(s)}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No remediation items" description="No failed findings require remediation for the selected severity." action={{ label: 'View Findings', onClick: () => {} }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {sev_order.filter(s => grouped[s]?.length > 0).map(sev => (
            <div key={sev}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <SeverityBadge severity={sev} />
                <span style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{grouped[sev].length} remediation{grouped[sev].length > 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {grouped[sev].map(item => (
                  <div key={item.finding_id} className="card">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--cx-muted)' }}>
                          {item.vendor} {item.platform} · {item.device_name}
                        </div>
                      </div>
                      <SeverityBadge severity={item.severity} />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cx-muted)', marginBottom: 8 }}>Recommended Command</div>
                      <div style={{ position: 'relative' }}>
                        <div className="code-block">
                          <pre style={{ margin: 0 }}>{item.recommended_command}</pre>
                        </div>
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => copyCmd(item.recommended_command)}
                          style={{ position: 'absolute', top: 8, right: 8 }}
                        >
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                    </div>

                    <div className="grid-2" style={{ gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cx-muted)', marginBottom: 6 }}>Risk Impact</div>
                        <div style={{ fontSize: 13, color: 'var(--cx-text)', lineHeight: 1.6 }}>{item.risk_impact}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cx-muted)', marginBottom: 6 }}>Verification</div>
                        <div className="code-block" style={{ fontSize: 12, padding: '8px 12px' }}>
                          <pre style={{ margin: 0 }}>{item.verification_command}</pre>
                        </div>
                      </div>
                    </div>

                    {item.evidence_text && (
                      <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--cx-surface-2)', borderRadius: 8, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--cx-muted)' }}>
                        Evidence (lines {item.evidence_lines}): {item.evidence_text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
