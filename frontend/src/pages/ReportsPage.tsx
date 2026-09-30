import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, FileBarChart } from 'lucide-react';
import { api, Report, Device } from '../api/client';
import { SkeletonCard } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../contexts/ToastContext';

export function ReportsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('CIS');

  const load = () => {
    setLoading(true);
    Promise.all([api.reports.list(), api.devices.list()])
      .then(([r, d]) => { setReports(r); setDevices(d); if (d.length > 0) setSelectedDevice(d[0].id); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const generate = async () => {
    if (!selectedDevice) return;
    setGenerating(true);
    try {
      await api.reports.generate(selectedDevice, selectedFramework);
      addToast('success', 'Report generated successfully');
      setShowGenerate(false);
      load();
    } catch (e) {
      addToast('error', 'Report generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">PDF compliance audit reports with SHA-256 integrity</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowGenerate(true)}>
          <Plus size={14} /> Generate Report
        </button>
      </div>

      {/* Generate Modal */}
      {showGenerate && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--cx-orange)' }}>
          <h3 style={{ fontSize: 14, marginBottom: 16 }}>Generate New Report</h3>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="report-device">Device</label>
              <select id="report-device" value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)} className="form-input" aria-label="Select device">
                {devices.map(d => <option key={d.id} value={d.id}>{d.name} ({d.vendor})</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="report-framework">Framework</label>
              <select id="report-framework" value={selectedFramework} onChange={e => setSelectedFramework(e.target.value)} className="form-input" aria-label="Select framework">
                {['CIS', 'NIST_800_53', 'DISA_STIG', 'ISO_27001'].map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={generate} disabled={generating || !selectedDevice}>
              <FileBarChart size={14} /> {generating ? 'Generating...' : 'Generate PDF Report'}
            </button>
            <button className="btn btn-secondary" onClick={() => setShowGenerate(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports generated"
          description="Generate your first compliance audit report for a device."
          action={{ label: 'Generate Report', onClick: () => setShowGenerate(true) }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reports.map(r => {
            const dev = devices.find(d => d.id === r.device_id);
            return (
              <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 24px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--cx-surface-2)', border: '1px solid var(--cx-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileBarChart size={20} color="var(--cx-orange)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--cx-muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span>{dev?.name || r.device_id.slice(0,8)}</span>
                    <span>{r.framework_code}</span>
                    <span>Score: <strong style={{ color: r.compliance_score >= 80 ? 'var(--cx-pass)' : r.compliance_score >= 60 ? 'var(--cx-warning)' : 'var(--cx-fail)' }}>{r.compliance_score.toFixed(0)}%</strong></span>
                    <span>{r.critical_findings} critical findings</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>SHA: {r.sha256_hash.slice(0,8)}...</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--cx-muted)', marginBottom: 8 }}>
                    {new Date(r.created_at).toLocaleString()}
                  </div>
                  <a
                    href={api.reports.downloadUrl(r.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    download
                  >
                    <Download size={13} /> Download PDF
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
