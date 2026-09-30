import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Filter, Upload } from 'lucide-react';
import { api, Device } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { SkeletonTable } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export function DevicesPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterVendor, setFilterVendor] = useState('');

  const load = () => {
    setLoading(true);
    api.devices.list(filterVendor ? { vendor: filterVendor } : undefined)
      .then(setDevices).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filterVendor]);

  const filtered = devices.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.vendor.toLowerCase().includes(search.toLowerCase()));
  const vendors = [...new Set(devices.map(d => d.vendor))];

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 className="page-title">Devices</h1>
          <p className="page-subtitle">{devices.length} network assets monitored</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/configurations/upload" className="btn btn-secondary btn-sm">
            <Upload size={13} /> Import Config
          </Link>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/configurations/upload')}>
            <Plus size={13} /> Add Device
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 16, padding: '12px 20px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, background: 'var(--cx-surface-2)', borderRadius: 8, padding: '7px 12px', border: '1px solid var(--cx-border)' }}>
            <Search size={14} color="var(--cx-muted)" />
            <input type="text" placeholder="Search devices..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--cx-text)', width: '100%', fontFamily: 'Inter' }}
              aria-label="Search devices" />
          </div>
          <select value={filterVendor} onChange={e => setFilterVendor(e.target.value)}
            style={{ padding: '7px 12px', border: '1px solid var(--cx-border)', borderRadius: 8, background: 'var(--cx-surface-2)', fontSize: 13, color: 'var(--cx-text)', fontFamily: 'Inter' }}
            aria-label="Filter by vendor">
            <option value="">All Vendors</option>
            {vendors.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <SkeletonTable rows={5} /> : (
          filtered.length === 0 ? (
            <EmptyState title="No devices found" description="Upload a configuration file to onboard your first device." action={{ label: 'Upload Config', onClick: () => navigate('/configurations/upload') }} />
          ) : (
            <table className="data-table" aria-label="Devices list">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Vendor</th>
                  <th>Platform</th>
                  <th>OS</th>
                  <th>Status</th>
                  <th>Compliance</th>
                  <th>Risk</th>
                  <th>Last Scan</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id} onClick={() => navigate(`/devices/${d.id}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                      {d.ip_address && <div style={{ fontSize: 11, color: 'var(--cx-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{d.ip_address}</div>}
                    </td>
                    <td style={{ fontSize: 13 }}>{d.vendor}</td>
                    <td style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>{d.platform}</td>
                    <td style={{ fontSize: 12, color: 'var(--cx-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{d.os_version || '—'}</td>
                    <td><StatusBadge status={d.status as never} withDot /></td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 14, color: d.compliance_score >= 80 ? 'var(--cx-pass)' : d.compliance_score >= 60 ? 'var(--cx-warning)' : 'var(--cx-fail)' }}>
                        {d.compliance_score.toFixed(0)}%
                      </div>
                    </td>
                    <td><StatusBadge status={d.risk_level as never} /></td>
                    <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>
                      {d.last_scanned_at ? new Date(d.last_scanned_at).toLocaleDateString() : 'Never'}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); navigate(`/devices/${d.id}`); }}>View →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
      {error && <EmptyState type="error" title="Failed to load devices" description={error} action={{ label: 'Retry', onClick: load }} />}
    </div>
  );
}
