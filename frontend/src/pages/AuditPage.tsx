import React, { useEffect, useState } from 'react';
import { api, AuditEvent } from '../api/client';
import { SkeletonTable } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.audit.list().then(setEvents).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-subtitle">Immutable, cryptographically hashed audit log of all platform actions</p>
        </div>
        <div className="live-indicator">
          <span className="dot" />
          Tamper-evident
        </div>
      </div>

      {/* Notice */}
      <div style={{ padding: '10px 16px', background: 'var(--cx-surface-2)', border: '1px solid var(--cx-border)', borderRadius: 8, marginBottom: 20, fontSize: 12, color: 'var(--cx-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--cx-info)' }}>🔒</span>
        Every entry in the audit trail is signed with a SHA-256 hash. Entries cannot be modified or deleted after creation.
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <SkeletonTable rows={8} /> : error ? (
          <EmptyState type="error" title="Failed to load audit trail" description={error} />
        ) : events.length === 0 ? (
          <EmptyState title="No audit events" description="Platform actions will appear here." />
        ) : (
          <table className="data-table" aria-label="Audit trail">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Description</th>
                <th>SHA-256</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id}>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--cx-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{e.actor}</td>
                  <td>
                    <span style={{ padding: '3px 8px', background: 'var(--cx-surface-2)', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--cx-orange)', border: '1px solid var(--cx-border)' }}>
                      {e.action}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{e.entity_type}</td>
                  <td style={{ fontSize: 13, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--cx-muted)' }}>
                    <span title={e.sha256_hash}>{e.sha256_hash.slice(0, 10)}...</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
