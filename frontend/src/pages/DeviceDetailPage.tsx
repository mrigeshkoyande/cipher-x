import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileBarChart } from 'lucide-react';
import { api, Device, Configuration, Finding } from '../api/client';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { SkeletonCard } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

function formatDate(ts?: string) {
  if (!ts) return 'Never';
  return new Date(ts).toLocaleString();
}

export function DeviceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [configs, setConfigs] = useState<Configuration[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [tab, setTab] = useState<'overview' | 'configurations' | 'findings'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.devices.get(id),
      api.configurations.list(id),
      api.findings.list({ device_id: id }),
    ]).then(([d, c, f]) => { setDevice(d); setConfigs(c); setFindings(f); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><SkeletonCard /></div>;
  if (!device) return <EmptyState type="error" title="Device not found" action={{ label: 'Back to Devices', onClick: () => navigate('/devices') }} />;

  const failFindings = findings.filter(f => f.status === 'FAIL');
  const passFindings = findings.filter(f => f.status === 'PASS');

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/devices" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--cx-muted)', fontSize: 13, textDecoration: 'none', marginBottom: 12 }}>
          <ArrowLeft size={14} /> Devices
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 className="page-title">{device.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: 'var(--cx-muted)' }}>{device.vendor} · {device.platform}</span>
              {device.os_version && <span style={{ fontSize: 13, color: 'var(--cx-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{device.os_version}</span>}
              <StatusBadge status={device.status as never} withDot />
              <span style={{ fontSize: 12, color: 'var(--cx-muted)' }}>Last analyzed {formatDate(device.last_scanned_at)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/configurations/upload" className="btn btn-secondary btn-sm">
              <Upload size={13} /> Upload Config
            </Link>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => id && api.reports.generate(id).then(() => navigate('/reports'))}
            >
              <FileBarChart size={13} /> Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        {(['overview', 'configurations', 'findings'] as const).map(t => (
          <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'findings' && findings.length > 0 && (
              <span style={{ marginLeft: 6, background: 'var(--cx-orange)', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>
                {failFindings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid-2">
          {/* Compliance */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Compliance Summary</h3>
            <div style={{ fontSize: 48, fontWeight: 300, color: device.compliance_score >= 80 ? 'var(--cx-pass)' : device.compliance_score >= 60 ? 'var(--cx-warning)' : 'var(--cx-fail)' }}>
              {device.compliance_score.toFixed(0)}%
            </div>
            <div style={{ fontSize: 13, color: 'var(--cx-muted)', marginBottom: 16 }}>Overall Compliance Score</div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--cx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pass</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--cx-pass)' }}>{passFindings.length}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--cx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fail</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--cx-fail)' }}>{failFindings.length}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--cx-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--cx-warning)' }}>{device.risk_level}</div>
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Device Information</h3>
            {[
              { label: 'Name', value: device.name },
              { label: 'Vendor', value: device.vendor },
              { label: 'Platform', value: device.platform },
              { label: 'OS Version', value: device.os_version || '—' },
              { label: 'IP Address', value: device.ip_address || '—' },
              { label: 'Configurations', value: configs.length },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--cx-border)', fontSize: 13 }}>
                <div style={{ width: 120, color: 'var(--cx-muted)', flexShrink: 0 }}>{row.label}</div>
                <div style={{ fontWeight: 500 }}>{String(row.value)}</div>
              </div>
            ))}
          </div>

          {/* Recent Findings */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Recent Findings</h3>
            {findings.length === 0 ? (
              <EmptyState title="No findings" description="No compliance findings for this device." />
            ) : (
              <table className="data-table">
                <thead><tr><th>Severity</th><th>Control</th><th>Title</th><th>Status</th><th>Evidence Lines</th></tr></thead>
                <tbody>
                  {findings.slice(0, 8).map(f => (
                    <tr key={f.id} onClick={() => navigate(`/findings/${f.id}`)} style={{ cursor: 'pointer' }}>
                      <td><SeverityBadge severity={f.severity} /></td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{f.control_id}</td>
                      <td style={{ fontWeight: 500 }}>{f.title}</td>
                      <td><StatusBadge status={f.status as never} /></td>
                      <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{f.start_line > 0 ? `${f.start_line}–${f.end_line}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'configurations' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {configs.length === 0 ? (
            <EmptyState title="No configurations" description="Upload a configuration to begin analysis." action={{ label: 'Upload Config', onClick: () => navigate('/configurations/upload') }} />
          ) : (
            <table className="data-table">
              <thead><tr><th>Version</th><th>Filename</th><th>Vendor</th><th>SHA-256</th><th>Status</th><th>Uploaded</th><th></th></tr></thead>
              <tbody>
                {configs.map(c => (
                  <tr key={c.id} onClick={() => navigate(`/configurations/${c.id}`)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 700 }}>v{c.version}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{c.filename}</td>
                    <td>{c.vendor_detected || '—'}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--cx-muted)' }}>{c.sha256_hash.slice(0, 12)}...</td>
                    <td><StatusBadge status={c.status as never} /></td>
                    <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{new Date(c.uploaded_at).toLocaleDateString()}</td>
                    <td><button className="btn btn-ghost btn-sm">View →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'findings' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {findings.length === 0 ? (
            <EmptyState title="No findings" description="No compliance findings for this device." />
          ) : (
            <table className="data-table">
              <thead><tr><th>Severity</th><th>Control</th><th>Title</th><th>Status</th><th>Lines</th></tr></thead>
              <tbody>
                {findings.map(f => (
                  <tr key={f.id} onClick={() => navigate(`/findings/${f.id}`)} style={{ cursor: 'pointer' }}>
                    <td><SeverityBadge severity={f.severity} /></td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{f.control_id}</td>
                    <td style={{ fontWeight: 500 }}>{f.title}</td>
                    <td><StatusBadge status={f.status as never} /></td>
                    <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{f.start_line > 0 ? `${f.start_line}–${f.end_line}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
