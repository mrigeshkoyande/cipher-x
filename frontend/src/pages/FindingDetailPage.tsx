import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, CheckCircle, FileBarChart } from 'lucide-react';
import { api, Finding } from '../api/client';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { SkeletonCard } from '../components/common/Skeleton';
import { useToast } from '../contexts/ToastContext';

export function FindingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [finding, setFinding] = useState<Finding | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.findings.get(id).then(setFinding).finally(() => setLoading(false));
  }, [id]);

  const markReviewed = async () => {
    if (!id || marking) return;
    setMarking(true);
    try {
      const updated = await api.findings.review(id);
      setFinding(updated);
      addToast('success', 'Finding marked as reviewed');
    } catch {
      addToast('error', 'Failed to mark as reviewed');
    } finally {
      setMarking(false);
    }
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    addToast('success', 'Command copied to clipboard');
  };

  if (loading) return <div className="page"><SkeletonCard /></div>;
  if (!finding) return (
    <div className="page">
      <Link to="/findings" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}><ArrowLeft size={14} /> Back</Link>
      <div style={{ color: 'var(--cx-fail)' }}>Finding not found.</div>
    </div>
  );

  const evidenceLines = finding.evidence_text?.split('\n') || [];

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/findings" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--cx-muted)', fontSize: 13, textDecoration: 'none', marginBottom: 12 }}>
          <ArrowLeft size={14} /> Findings
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <SeverityBadge severity={finding.severity} />
              <StatusBadge status={finding.status as never} />
              {finding.is_reviewed && <span className="badge badge-pass">✓ Reviewed</span>}
            </div>
            <h1 className="page-title" style={{ fontSize: 24 }}>{finding.title}</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {!finding.is_reviewed && (
              <button className="btn btn-secondary btn-sm" onClick={markReviewed} disabled={marking}>
                <CheckCircle size={13} /> {marking ? 'Marking...' : 'Mark Reviewed'}
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/reports')}>
              <FileBarChart size={13} /> Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Metadata */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Finding Details</h3>
            {[
              { label: 'Control ID', value: finding.control_id },
              { label: 'Framework', value: finding.framework_id.slice(0, 12) },
              { label: 'Confidence', value: `${(finding.confidence * 100).toFixed(0)}%` },
              { label: 'Created', value: new Date(finding.created_at).toLocaleString() },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--cx-border)', fontSize: 13 }}>
                <div style={{ width: 100, color: 'var(--cx-muted)', flexShrink: 0 }}>{row.label}</div>
                <div style={{ fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{row.value}</div>
              </div>
            ))}
            <p style={{ fontSize: 13, color: 'var(--cx-muted)', marginTop: 12, lineHeight: 1.6 }}>{finding.description}</p>
          </div>

          {/* Observed vs Expected */}
          <div className="card">
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>Observed vs Expected</h3>
            <div className="grid-2" style={{ gap: 12 }}>
              <div style={{ background: finding.status === 'FAIL' ? 'rgba(224,90,97,0.07)' : 'var(--cx-surface-2)', border: `1px solid ${finding.status === 'FAIL' ? 'var(--cx-fail)' : 'var(--cx-border)'}`, borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cx-fail)', marginBottom: 8 }}>Observed</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 600, color: 'var(--cx-text)' }}>
                  {String(finding.observed_value)}
                </div>
              </div>
              <div style={{ background: 'rgba(37,185,129,0.07)', border: '1px solid var(--cx-pass)', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cx-pass)', marginBottom: 8 }}>Expected</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 600, color: 'var(--cx-text)' }}>
                  {String(finding.expected_value)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Evidence */}
          {finding.evidence_text && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--cx-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 14 }}>Evidence</h3>
                <span style={{ fontSize: 12, color: 'var(--cx-orange)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Lines {finding.start_line}–{finding.end_line}
                </span>
              </div>
              <div className="code-block" style={{ margin: 0, borderRadius: 0, border: 'none' }}>
                {evidenceLines.map((line, i) => (
                  <div key={i} className="code-line highlight">
                    <span className="code-line-number">{finding.start_line + i}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 16px', background: 'var(--cx-dark-elevated)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate(`/configurations/${finding.configuration_id}`)}
                  style={{ color: 'var(--cx-orange)', fontSize: 12 }}
                >
                  Open Configuration Viewer →
                </button>
              </div>
            </div>
          )}

          {/* Remediation */}
          {finding.remediation_command && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--cx-border)' }}>
                <h3 style={{ fontSize: 14 }}>Advisory Remediation</h3>
                <p style={{ fontSize: 12, color: 'var(--cx-muted)', marginTop: 4 }}>Review manually — never execute automatically</p>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cx-muted)', marginBottom: 8 }}>Recommended Command</div>
                  <div className="code-block" style={{ position: 'relative' }}>
                    <pre style={{ margin: 0 }}>{finding.remediation_command}</pre>
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={() => copyCommand(finding.remediation_command!)}
                      style={{ position: 'absolute', top: 8, right: 8 }}
                      title="Copy command"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                </div>
                {finding.risk_impact && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cx-muted)', marginBottom: 6 }}>Risk Impact</div>
                    <div style={{ fontSize: 13, color: 'var(--cx-text)', lineHeight: 1.6 }}>{finding.risk_impact}</div>
                  </div>
                )}
                {finding.verification_command && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cx-muted)', marginBottom: 8 }}>Verification</div>
                    <div className="code-block">
                      <pre style={{ margin: 0 }}>{finding.verification_command}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Transparency Note */}
      <div style={{ marginTop: 16, padding: '10px 16px', background: 'var(--cx-surface-2)', border: '1px solid var(--cx-border)', borderRadius: 8, fontSize: 12, color: 'var(--cx-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--cx-info)' }}>✦</span>
        Compliance status determined by the deterministic CIPHER-X engine. AI was used only for configuration interpretation (confidence: {(finding.confidence * 100).toFixed(0)}%).
      </div>
    </div>
  );
}
