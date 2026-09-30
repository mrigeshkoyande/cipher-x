import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { api, Finding } from '../api/client';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { SkeletonTable } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL'];
const STATUSES = ['FAIL', 'PASS', 'WARNING', 'REVIEW', 'UNKNOWN'];

export function FindingsPage() {
  const navigate = useNavigate();
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => {
    setLoading(true);
    api.findings.list({ severity: filterSeverity || undefined, status: filterStatus || undefined })
      .then(setFindings).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filterSeverity, filterStatus]);

  const filtered = findings.filter(f => !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.control_id.toLowerCase().includes(search.toLowerCase()));

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  findings.forEach(f => {
    if (f.status === 'FAIL' && f.severity in counts) counts[f.severity as keyof typeof counts]++;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">Findings</h1>
            <p className="page-subtitle">{findings.filter(f => f.status === 'FAIL').length} open security findings</p>
          </div>
        </div>
      </div>

      {/* Severity Summary */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Critical', count: counts.CRITICAL, color: 'var(--cx-fail)', cls: 'badge-critical' },
          { label: 'High', count: counts.HIGH, color: 'var(--cx-orange)', cls: 'badge-high' },
          { label: 'Medium', count: counts.MEDIUM, color: 'var(--cx-warning)', cls: 'badge-medium' },
          { label: 'Low', count: counts.LOW, color: 'var(--cx-info)', cls: 'badge-low' },
        ].map(item => (
          <div key={item.label} className="metric-card" style={{ cursor: 'pointer', borderLeft: `3px solid ${item.color}` }}
            onClick={() => setFilterSeverity(filterSeverity === item.label.toUpperCase() ? '' : item.label.toUpperCase())}>
            <div className="metric-label">{item.label}</div>
            <div className="metric-value" style={{ fontSize: 36, color: item.color }}>{loading ? '—' : item.count}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16, padding: '12px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, background: 'var(--cx-surface-2)', borderRadius: 8, padding: '7px 12px', border: '1px solid var(--cx-border)' }}>
            <Search size={14} color="var(--cx-muted)" />
            <input type="text" placeholder="Search findings, controls..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--cx-text)', width: '100%', fontFamily: 'Inter' }}
              aria-label="Search findings" />
          </div>
          <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}
            style={{ padding: '7px 12px', border: '1px solid var(--cx-border)', borderRadius: 8, background: 'var(--cx-surface-2)', fontSize: 13, color: 'var(--cx-text)', fontFamily: 'Inter' }}
            aria-label="Filter by severity">
            <option value="">All Severities</option>
            {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '7px 12px', border: '1px solid var(--cx-border)', borderRadius: 8, background: 'var(--cx-surface-2)', fontSize: 13, color: 'var(--cx-text)', fontFamily: 'Inter' }}
            aria-label="Filter by status">
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(filterSeverity || filterStatus || search) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilterSeverity(''); setFilterStatus(''); setSearch(''); }}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Findings Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <SkeletonTable rows={6} /> : (
          filtered.length === 0 ? (
            <EmptyState title="No findings" description="Your configurations have no findings matching the current filters." action={{ label: 'Clear Filters', onClick: () => { setFilterSeverity(''); setFilterStatus(''); setSearch(''); } }} />
          ) : (
            <table className="data-table" aria-label="Security findings">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Control</th>
                  <th>Finding</th>
                  <th>Status</th>
                  <th>Evidence</th>
                  <th>Confidence</th>
                  <th>Reviewed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id} onClick={() => navigate(`/findings/${f.id}`)} style={{ cursor: 'pointer' }}>
                    <td><SeverityBadge severity={f.severity} /></td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600 }}>{f.control_id}</td>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{f.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--cx-muted)', marginTop: 2 }}>{f.description.slice(0, 80)}...</div>
                    </td>
                    <td><StatusBadge status={f.status as never} /></td>
                    <td>
                      {f.start_line > 0 ? (
                        <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--cx-orange)' }}>
                          Lines {f.start_line}–{f.end_line}
                        </span>
                      ) : <span style={{ color: 'var(--cx-muted)', fontSize: 12 }}>—</span>}
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 600, color: f.confidence >= 0.9 ? 'var(--cx-pass)' : 'var(--cx-warning)' }}>
                        {(f.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, color: f.is_reviewed ? 'var(--cx-pass)' : 'var(--cx-muted)' }}>
                        {f.is_reviewed ? '✓ Reviewed' : '—'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm">Investigate <ArrowRight size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
      {error && <EmptyState type="error" title="Failed to load findings" description={error} action={{ label: 'Retry', onClick: load }} />}
    </div>
  );
}
