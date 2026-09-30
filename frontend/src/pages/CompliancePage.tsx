import React, { useEffect, useState } from 'react';
import { api, ComplianceSummary, Framework } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { SkeletonCard } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

const STATUS_COLORS: Record<string, string> = {
  PASS: 'var(--cx-pass)', FAIL: 'var(--cx-fail)', WARNING: 'var(--cx-warning)',
  REVIEW: 'var(--cx-review)', UNKNOWN: 'var(--cx-unknown)', NOT_APPLICABLE: 'var(--cx-muted-2)',
};

export function CompliancePage() {
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState('CIS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([api.compliance.summary(selectedFramework), api.compliance.frameworks()])
      .then(([s, f]) => { setSummary(s); setFrameworks(f); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [selectedFramework]);

  const score = summary?.overall_score || 0;
  const counts = summary?.counts || {};

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Compliance Center</h1>
          <p className="page-subtitle">Deterministic security control evaluation across all assets</p>
        </div>
        <button className="btn btn-primary" onClick={load}>Run Audit</button>
      </div>

      {/* Framework Selector */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {loading ? (
            ['CIS', 'NIST_800_53', 'DISA_STIG', 'ISO_27001'].map(code => (
              <button key={code} className={`btn btn-sm ${selectedFramework === code ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedFramework(code)}>
                {code.replace('_', ' ')}
              </button>
            ))
          ) : (
            frameworks.map(fw => (
              <button key={fw.code} className={`btn btn-sm ${selectedFramework === fw.code ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedFramework(fw.code)}>
                {fw.code.replace('_', ' ')}
              </button>
            ))
          )}
        </div>
        {frameworks.find(f => f.code === selectedFramework) && (
          <div style={{ fontSize: 13, color: 'var(--cx-muted)' }}>
            {frameworks.find(f => f.code === selectedFramework)?.name} — {frameworks.find(f => f.code === selectedFramework)?.description}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid-2"><SkeletonCard /><SkeletonCard /></div>
      ) : error ? (
        <EmptyState type="error" title="Failed to load compliance data" description={error} action={{ label: 'Retry', onClick: load }} />
      ) : (
        <>
          {/* Score hero */}
          <div className="posture-hero" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
              <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 120 120" aria-label={`Compliance: ${score}%`}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--cx-dark-border)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke={score >= 80 ? 'var(--cx-pass)' : score >= 60 ? 'var(--cx-warning)' : 'var(--cx-fail)'}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 300, color: 'var(--cx-dark-text)' }}>{score.toFixed(0)}%</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--cx-dark-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Overall Compliance</div>
                <div style={{ fontSize: 44, fontWeight: 300, color: 'var(--cx-dark-text)', lineHeight: 1 }}>{score.toFixed(1)}%</div>
                <div style={{ fontSize: 13, color: 'var(--cx-dark-muted)', marginTop: 8 }}>{selectedFramework} Framework Coverage</div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid-3" style={{ marginBottom: 20 }}>
            {Object.entries(counts).map(([status, count]) => (
              <div key={status} className="card" style={{ borderLeft: `3px solid ${STATUS_COLORS[status] || 'var(--cx-border)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: STATUS_COLORS[status] || 'var(--cx-muted)', marginBottom: 6 }}>
                      {status}
                    </div>
                    <div style={{ fontSize: 36, fontWeight: 300, color: STATUS_COLORS[status] || 'var(--cx-text)' }}>{count}</div>
                  </div>
                  <StatusBadge status={status as never} />
                </div>
                <div style={{ marginTop: 10, height: 4, background: 'var(--cx-surface-2)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%',
                    width: `${summary ? (count / summary.total_controls_evaluated * 100).toFixed(0) : 0}%`,
                    background: STATUS_COLORS[status] || 'var(--cx-border)',
                    borderRadius: 2,
                    transition: 'width 0.8s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* AI Transparency */}
          <div style={{ padding: '12px 16px', background: 'var(--cx-surface-2)', border: '1px solid var(--cx-border)', borderRadius: 8, fontSize: 12, color: 'var(--cx-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--cx-info)' }}>✦</span>
            All compliance decisions are made by the deterministic CIPHER-X engine — AI only assists with unknown syntax interpretation. UNKNOWN status never represents compliance.
          </div>
        </>
      )}
    </div>
  );
}
