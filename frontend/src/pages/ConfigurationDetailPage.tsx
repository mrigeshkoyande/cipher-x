import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { api, Configuration, NormalizedFact, ProcessingStage } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { SkeletonCard } from '../components/common/Skeleton';

function PipelineStage({ stage, isLast }: { stage: ProcessingStage; isLast: boolean }) {
  const statusIcon = () => {
    if (stage.status === 'COMPLETED') return <CheckCircle size={16} color="var(--cx-pass)" />;
    if (stage.status === 'FAILED') return <AlertCircle size={16} color="var(--cx-fail)" />;
    if (stage.status === 'REVIEW_REQUIRED') return <AlertCircle size={16} color="var(--cx-review)" />;
    if (stage.status === 'PROCESSING') return <RefreshCw size={16} color="var(--cx-warning)" style={{ animation: 'spin 1s linear infinite' }} />;
    return <Clock size={16} color="var(--cx-unknown)" />;
  };

  return (
    <div>
      <div className="pipeline-stage">
        {statusIcon()}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--cx-dark-text)' }}>{stage.title}</div>
          {stage.details && <div style={{ fontSize: 12, color: 'var(--cx-dark-muted)', marginTop: 2 }}>{stage.details}</div>}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {stage.confidence < 1 && (
            <div style={{ fontSize: 11, color: 'var(--cx-dark-muted)' }}>
              <span style={{ fontWeight: 600, color: stage.confidence >= 0.9 ? 'var(--cx-pass)' : 'var(--cx-warning)' }}>
                {(stage.confidence * 100).toFixed(0)}%
              </span>
              {' '}confidence
            </div>
          )}
          {stage.duration_ms > 0 && (
            <div style={{ fontSize: 11, color: 'var(--cx-dark-muted)' }}>{stage.duration_ms}ms</div>
          )}
          <StatusBadge status={stage.status as never} />
        </div>
      </div>
      {!isLast && (
        <div style={{ marginLeft: 28, borderLeft: '2px dashed var(--cx-dark-border)', height: 12 }} />
      )}
    </div>
  );
}

export function ConfigurationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<Configuration | null>(null);
  const [facts, setFacts] = useState<NormalizedFact[]>([]);
  const [stages, setStages] = useState<ProcessingStage[]>([]);
  const [selectedFact, setSelectedFact] = useState<NormalizedFact | null>(null);
  const [tab, setTab] = useState<'viewer' | 'pipeline' | 'facts'>('viewer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.configurations.get(id),
      api.configurations.getFacts(id),
      api.configurations.getPipeline(id),
    ]).then(([c, f, p]) => { setConfig(c); setFacts(f); setStages(p.stages); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><SkeletonCard /></div>;
  if (!config) return <div className="page"><div style={{ color: 'var(--cx-fail)' }}>Configuration not found</div></div>;

  const lines = (config.raw_content || '').split('\n');
  const highlightedLines = selectedFact
    ? new Set(Array.from({ length: selectedFact.end_line - selectedFact.start_line + 1 }, (_, i) => selectedFact.start_line + i))
    : new Set<number>();

  const unknownFacts = facts.filter(f => f.is_unknown);

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <Link to="/configurations" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--cx-muted)', fontSize: 13, textDecoration: 'none', marginBottom: 12 }}>
          <ArrowLeft size={14} /> Configurations
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-title" style={{ fontSize: 22 }}>{config.filename}</h1>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--cx-muted)' }}>SHA-256: {config.sha256_hash.slice(0, 16)}...</span>
              <span style={{ fontSize: 12, color: 'var(--cx-muted)' }}>v{config.version}</span>
              {config.vendor_detected && <span style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{config.vendor_detected} · {config.platform_detected}</span>}
              <StatusBadge status={config.status as never} />
            </div>
          </div>
        </div>
      </div>

      {/* Unknown Commands Banner */}
      {unknownFacts.length > 0 && (
        <div style={{ background: 'rgba(232,184,74,0.1)', border: '1px solid var(--cx-review)', borderRadius: 'var(--cx-radius-sm)', padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={16} color="var(--cx-review)" />
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--cx-review)' }}>{unknownFacts.length} Unknown Command{unknownFacts.length > 1 ? 's' : ''} Detected</span>
            <span style={{ fontSize: 12, color: 'var(--cx-muted)' }}>AI interpretation pending human review</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/training')}>Review Mappings</button>
        </div>
      )}

      <div className="tabs-bar">
        {[{ key: 'viewer', label: 'Configuration Viewer' }, { key: 'pipeline', label: 'Processing Pipeline' }, { key: 'facts', label: `Normalized Facts (${facts.length})` }].map(t => (
          <button key={t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key as never)}>{t.label}</button>
        ))}
      </div>

      {tab === 'viewer' && (
        <div className="config-viewer-split" style={{ height: '70vh' }}>
          {/* Code viewer */}
          <div style={{ background: 'var(--cx-dark)', overflow: 'auto', padding: '16px 0' }}>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightedLines.has(lineNum);
              return (
                <div key={lineNum} className={`code-line${isHighlighted ? ' highlight' : ''}`} style={{ paddingRight: 16 }}>
                  <span className="code-line-number">{lineNum}</span>
                  <span style={{ color: line.trim().startsWith('!') || line.trim().startsWith('#') ? 'var(--cx-dark-muted)' : 'var(--cx-dark-text)' }}>
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Facts panel */}
          <div style={{ background: 'var(--cx-dark-surface)', overflow: 'auto', padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cx-dark-muted)', marginBottom: 12 }}>
              Normalized Security Model
            </div>
            {facts.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--cx-dark-muted)', padding: '20px 0' }}>No normalized facts extracted.</div>
            ) : (
              facts.map(fact => (
                <div
                  key={fact.id}
                  onClick={() => setSelectedFact(selectedFact?.id === fact.id ? null : fact)}
                  style={{
                    padding: '10px 12px', marginBottom: 4, borderRadius: 6, cursor: 'pointer',
                    background: selectedFact?.id === fact.id ? 'rgba(255,116,23,0.12)' : 'var(--cx-dark-elevated)',
                    border: `1px solid ${selectedFact?.id === fact.id ? 'var(--cx-orange)' : 'var(--cx-dark-border)'}`,
                    transition: 'all 0.15s',
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedFact?.id === fact.id}
                >
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: fact.is_unknown ? 'var(--cx-review)' : 'var(--cx-orange)', marginBottom: 4 }}>
                    {fact.is_unknown ? '⚠ ' : ''}{fact.parameter}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--cx-dark-text)', fontWeight: 600 }}>{String(fact.value)}</span>
                    <span style={{ fontSize: 10, color: fact.confidence >= 0.9 ? 'var(--cx-pass)' : 'var(--cx-warning)' }}>{(fact.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--cx-dark-muted)', marginTop: 4 }}>Lines {fact.start_line}–{fact.end_line}</div>
                  {fact.is_unknown && (
                    <div style={{ marginTop: 6, padding: '6px 8px', background: 'rgba(232,184,74,0.08)', borderRadius: 4, fontSize: 10, color: 'var(--cx-review)' }}>
                      AI Interpretation · Requires Review
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === 'pipeline' && (
        <div className="card-dark" style={{ maxWidth: 700 }}>
          <h3 style={{ fontSize: 14, marginBottom: 20 }}>Processing Pipeline</h3>
          {stages.map((s, i) => <PipelineStage key={s.stage} stage={s} isLast={i === stages.length - 1} />)}
        </div>
      )}

      {tab === 'facts' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {facts.length === 0 ? (
            <div style={{ padding: 24, color: 'var(--cx-muted)', fontSize: 13 }}>No normalized facts for this configuration.</div>
          ) : (
            <table className="data-table" aria-label="Normalized security facts">
              <thead>
                <tr><th>Category</th><th>Parameter</th><th>Value</th><th>Lines</th><th>Confidence</th><th>Type</th></tr>
              </thead>
              <tbody>
                {facts.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{f.category}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{f.parameter}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600 }}>{String(f.value)}</td>
                    <td style={{ fontSize: 12, color: 'var(--cx-muted)' }}>{f.start_line}–{f.end_line}</td>
                    <td>
                      <span style={{ fontSize: 12, color: f.confidence >= 0.9 ? 'var(--cx-pass)' : 'var(--cx-warning)', fontWeight: 600 }}>
                        {(f.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td>
                      {f.is_unknown ? (
                        <span className="badge badge-review">UNKNOWN</span>
                      ) : f.ai_suggested ? (
                        <span style={{ fontSize: 10, color: 'var(--cx-info)' }}>✦ AI</span>
                      ) : (
                        <span style={{ fontSize: 10, color: 'var(--cx-pass)' }}>✓ Validated</span>
                      )}
                    </td>
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
