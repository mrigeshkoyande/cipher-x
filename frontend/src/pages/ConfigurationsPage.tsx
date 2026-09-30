import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Upload } from 'lucide-react';
import { api, Configuration } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { SkeletonTable } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export function ConfigurationsPage() {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.configurations.list().then(setConfigs).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = configs.filter(c => !search || c.filename.toLowerCase().includes(search.toLowerCase()) || (c.vendor_detected || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 className="page-title">Configurations</h1>
          <p className="page-subtitle">{configs.length} configuration snapshots stored</p>
        </div>
        <Link to="/configurations/upload" className="btn btn-primary">
          <Upload size={14} /> Upload Config
        </Link>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--cx-surface-2)', borderRadius: 8, padding: '7px 12px', border: '1px solid var(--cx-border)' }}>
          <Search size={14} color="var(--cx-muted)" />
          <input type="text" placeholder="Search by filename or vendor..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--cx-text)', width: '100%', fontFamily: 'Inter' }}
            aria-label="Search configurations" />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <SkeletonTable rows={5} /> : filtered.length === 0 ? (
          <EmptyState title="No configurations found" description="Upload a configuration file to begin analysis." action={{ label: 'Upload Config', onClick: () => navigate('/configurations/upload') }} />
        ) : (
          <table className="data-table" aria-label="Configurations list">
            <thead>
              <tr>
                <th>Version</th>
                <th>Filename</th>
                <th>Vendor</th>
                <th>Platform</th>
                <th>Lines</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>SHA-256</th>
                <th>Uploaded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => navigate(`/configurations/${c.id}`)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 700, fontSize: 13 }}>v{c.version}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{c.filename}</td>
                  <td>{c.vendor_detected || '—'}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{c.platform_detected || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{c.line_count}</td>
                  <td><StatusBadge status={c.status as never} /></td>
                  <td>
                    <span style={{ fontSize: 12, fontWeight: 600, color: c.confidence >= 0.9 ? 'var(--cx-pass)' : 'var(--cx-warning)' }}>
                      {(c.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--cx-muted)' }}>
                    <span title={c.sha256_hash}>{c.sha256_hash.slice(0, 12)}...</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{new Date(c.uploaded_at).toLocaleDateString()}</td>
                  <td><button className="btn btn-ghost btn-sm">View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {error && <EmptyState type="error" title="Failed to load configurations" description={error} action={{ label: 'Retry', onClick: load }} />}
    </div>
  );
}
