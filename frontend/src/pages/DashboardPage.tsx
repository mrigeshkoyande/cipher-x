import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Server, ShieldCheck, AlertTriangle, Activity, Upload, ArrowRight } from 'lucide-react';
import { api, Device, Finding, ComplianceSummary } from '../api/client';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { SkeletonCard, SkeletonTable } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

function formatTime(ts?: string) {
  if (!ts) return 'Never';
  const d = new Date(ts);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return d.toLocaleDateString();
}

function VendorBar({ vendor, count, total }: { vendor: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const colors: Record<string, string> = {
    Cisco: '#1B78D0', Fortinet: '#EE3124', Juniper: '#84BD00', 'Palo Alto': '#FA582D'
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <div style={{ width: 72, fontSize: 12, color: 'var(--cx-dark-muted)', textAlign: 'right' }}>{vendor}</div>
      <div style={{ flex: 1, height: 6, background: 'var(--cx-dark-border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: colors[vendor] || 'var(--cx-orange)', borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
      <div style={{ width: 24, fontSize: 12, fontWeight: 600, color: 'var(--cx-dark-text)', textAlign: 'right' }}>{count}</div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [summary, setSummary] = useState<ComplianceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.devices.list(), api.findings.list(), api.compliance.summary()])
      .then(([d, f, s]) => { setDevices(d); setFindings(f); setSummary(s); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const score = summary?.overall_score ?? 82;
  const totalDevices = devices.length || summary?.total_devices || 0;
  const criticalFindings = findings.filter(f => f.severity === 'CRITICAL' && f.status === 'FAIL').length;
  const highFindings = findings.filter(f => f.severity === 'HIGH' && f.status === 'FAIL').length;
  const openFindings = findings.filter(f => f.status === 'FAIL').length;
  const unknownItems = findings.filter(f => f.status === 'UNKNOWN' || f.status === 'REVIEW').length;

  const vendorCounts: Record<string, number> = {};
  devices.forEach(d => { vendorCounts[d.vendor] = (vendorCounts[d.vendor] || 0) + 1; });

  const recentFindings = findings.slice(0, 5);

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 className="page-title">Security Overview</h1>
          <p className="page-subtitle">Real-time network security compliance posture</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/configurations/upload" className="btn btn-primary">
            <Upload size={14} /> Upload Config
          </Link>
        </div>
      </div>

      {/* Hero — Security Posture */}
      <div className="posture-hero" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ color: 'var(--cx-dark-text)', fontSize: 16, fontWeight: 600 }}>Security Posture</h2>
          <div className="live-indicator">
            <span className="dot" />
            Live Analysis
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          {/* Score Ring */}
          <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
            <svg width="140" height="140" viewBox="0 0 140 140" aria-label={`Compliance score: ${score}%`}>
              <circle cx="70" cy="70" r="58" fill="none" stroke="var(--cx-dark-border)" strokeWidth="10" />
              <circle
                cx="70" cy="70" r="58" fill="none"
                stroke={score >= 80 ? 'var(--cx-pass)' : score >= 60 ? 'var(--cx-warning)' : 'var(--cx-fail)'}
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - score / 100)}`}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 28, fontWeight: 300, color: 'var(--cx-dark-text)' }}>{score.toFixed(0)}%</span>
              <span style={{ fontSize: 10, color: 'var(--cx-dark-muted)', textAlign: 'center' }}>Compliance</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { label: 'Total Devices', value: totalDevices, color: 'var(--cx-dark-text)' },
              { label: 'Open Findings', value: openFindings, color: openFindings > 0 ? 'var(--cx-fail)' : 'var(--cx-pass)' },
              { label: 'Critical Issues', value: criticalFindings, color: criticalFindings > 0 ? 'var(--cx-fail)' : 'var(--cx-pass)' },
              { label: 'Controls Evaluated', value: summary?.total_controls_evaluated || 0, color: 'var(--cx-dark-text)' },
              { label: 'Unknown / Review', value: unknownItems, color: unknownItems > 0 ? 'var(--cx-review)' : 'var(--cx-dark-muted)' },
              { label: 'Compliance Score', value: `${score.toFixed(1)}%`, color: score >= 80 ? 'var(--cx-pass)' : 'var(--cx-warning)' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: 10, color: 'var(--cx-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 26, fontWeight: 300, color: stat.color, lineHeight: 1 }}>{loading ? '—' : stat.value}</div>
              </div>
            ))}
          </div>

          {/* Vendor distribution */}
          <div style={{ width: 220, flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--cx-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Vendor Distribution</div>
            {loading ? <div className="skeleton" style={{ height: 80 }} /> : Object.entries(vendorCounts).map(([v, c]) => (
              <VendorBar key={v} vendor={v} count={c} total={totalDevices} />
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {loading ? (
          [1,2,3,4].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            <div className="metric-card">
              <div className="metric-label">Devices</div>
              <div className="metric-value">{totalDevices}</div>
              <div className="metric-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Server size={11} /> Monitored assets
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Compliance</div>
              <div className="metric-value" style={{ color: score >= 80 ? 'var(--cx-pass)' : 'var(--cx-warning)' }}>{score.toFixed(0)}%</div>
              <div className="metric-sub">CIS Benchmark Coverage</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Open Findings</div>
              <div className="metric-value" style={{ color: openFindings > 0 ? 'var(--cx-fail)' : 'var(--cx-pass)' }}>{openFindings}</div>
              <div className="metric-sub">{criticalFindings} critical · {highFindings} high</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Unknown / Review</div>
              <div className="metric-value" style={{ color: unknownItems > 0 ? 'var(--cx-review)' : 'var(--cx-muted)' }}>{unknownItems}</div>
              <div className="metric-sub">Require human review</div>
            </div>
          </>
        )}
      </div>

      {/* Lower Grid */}
      <div className="grid-2" style={{ gap: 16 }}>
        {/* Compliance Alerts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14 }}>Compliance Alerts</h3>
            <Link to="/findings" style={{ fontSize: 12, color: 'var(--cx-orange)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {loading ? <SkeletonTable rows={4} /> : (
            <div>
              {[
                { label: 'CRITICAL', color: 'var(--cx-fail)', count: findings.filter(f => f.severity === 'CRITICAL' && f.status === 'FAIL').length },
                { label: 'HIGH', color: 'var(--cx-orange)', count: findings.filter(f => f.severity === 'HIGH' && f.status === 'FAIL').length },
                { label: 'MEDIUM', color: 'var(--cx-warning)', count: findings.filter(f => f.severity === 'MEDIUM' && f.status === 'FAIL').length },
                { label: 'LOW', color: 'var(--cx-info)', count: findings.filter(f => f.severity === 'LOW' && f.status === 'FAIL').length },
                { label: 'REVIEW', color: 'var(--cx-review)', count: findings.filter(f => f.status === 'REVIEW').length },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 64, fontSize: 11, fontWeight: 600, color: item.color }}>{item.label}</div>
                  <div style={{ flex: 1, height: 6, background: 'var(--cx-surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, item.count * 12)}%`, background: item.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 20, fontSize: 12, textAlign: 'right', color: 'var(--cx-text)', fontWeight: 600 }}>{String(item.count).padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Devices */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14 }}>Active Assets</h3>
            <Link to="/devices" style={{ fontSize: 12, color: 'var(--cx-orange)', textDecoration: 'none' }}>Manage →</Link>
          </div>
          {loading ? <SkeletonTable rows={4} /> : (
            devices.length === 0 ? (
              <EmptyState
                title="No devices"
                description="Upload a configuration to onboard your first asset."
                action={{ label: 'Upload Config', onClick: () => navigate('/configurations/upload') }}
              />
            ) : (
              <div>
                {devices.slice(0, 5).map(d => (
                  <div
                    key={d.id}
                    onClick={() => navigate(`/devices/${d.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 0', borderBottom: '1px solid var(--cx-border)', cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="status-dot" style={{ background: d.status === 'Healthy' ? 'var(--cx-pass)' : d.status === 'Risk' ? 'var(--cx-fail)' : 'var(--cx-review)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--cx-muted)' }}>{d.vendor} · {d.platform}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: d.compliance_score >= 80 ? 'var(--cx-pass)' : d.compliance_score >= 60 ? 'var(--cx-warning)' : 'var(--cx-fail)' }}>
                        {d.compliance_score.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--cx-muted)' }}>{formatTime(d.last_scanned_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Recent Findings */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14 }}>Recent Findings</h3>
            <Link to="/findings" className="btn btn-secondary btn-sm">
              View All Findings <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? <SkeletonTable rows={3} /> : (
            recentFindings.length === 0 ? (
              <EmptyState title="No findings" description="Your configurations have no recorded findings." />
            ) : (
              <table className="data-table" aria-label="Recent findings">
                <thead>
                  <tr>
                    <th>Severity</th><th>Title</th><th>Device</th><th>Control</th><th>Status</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentFindings.map(f => (
                    <tr key={f.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/findings/${f.id}`)}>
                      <td><SeverityBadge severity={f.severity} /></td>
                      <td style={{ fontWeight: 500 }}>{f.title}</td>
                      <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{f.device_id.slice(0, 8)}</td>
                      <td style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{f.control_id}</td>
                      <td><StatusBadge status={f.status as never} /></td>
                      <td><button className="btn btn-ghost btn-sm">Investigate →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
}
