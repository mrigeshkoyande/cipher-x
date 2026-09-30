import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { api, QueryResponse } from '../api/client';
import { useToast } from '../contexts/ToastContext';

const SUGGESTIONS = [
  'Which devices have telnet enabled?',
  'Are any devices missing SSH timeout configuration?',
  'Show me devices with weak password policies',
  'Which devices lack logging configuration?',
];

export function QueryPage() {
  const { addToast } = useToast();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<QueryResponse[]>([]);

  const ask = async (q?: string) => {
    const finalQ = q || question;
    if (!finalQ.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await api.query.ask(finalQ);
      setResponse(res);
      setHistory(prev => [res, ...prev].slice(0, 10));
      setQuestion('');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1 className="page-title">Natural Language Query</h1>
        <p className="page-subtitle">Ask security questions in plain English — evidence-backed answers</p>
      </div>

      {/* Input */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--cx-muted)', marginBottom: 8 }}>Ask a Security Question</div>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
              placeholder="e.g. Which devices are missing SNMP v3 configuration?"
              rows={3}
              style={{
                width: '100%', padding: '10px 14px', background: 'var(--cx-surface-2)',
                border: '1px solid var(--cx-border)', borderRadius: 8, fontSize: 14,
                color: 'var(--cx-text)', outline: 'none', fontFamily: 'Inter',
                resize: 'none', lineHeight: 1.5,
              }}
              aria-label="Security question"
            />
          </div>
          <button className="btn btn-primary" onClick={() => ask()} disabled={loading || !question.trim()} style={{ padding: '12px 20px', height: 'fit-content' }}>
            {loading ? '...' : <Send size={16} />}
          </button>
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUGGESTIONS.map(s => (
            <button key={s} className="btn btn-secondary btn-sm" onClick={() => ask(s)} style={{ fontSize: 11 }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Response */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--cx-muted)' }}>
          <div className="skeleton" style={{ height: 16, width: '60%', margin: '0 auto 12px' }} />
          <div className="skeleton" style={{ height: 14, width: '40%', margin: '0 auto' }} />
        </div>
      )}

      {response && !loading && (
        <div className="animate-fade-in">
          {/* Answer */}
          <div className="posture-hero" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <MessageSquare size={16} color="var(--cx-orange)" />
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cx-orange)' }}>CIPHER-X Response</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--cx-dark-muted)' }}>
                Confidence: <strong style={{ color: response.confidence >= 0.8 ? 'var(--cx-pass)' : 'var(--cx-warning)' }}>{(response.confidence * 100).toFixed(0)}%</strong>
              </span>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--cx-dark-muted)', marginBottom: 16 }}>"{response.question}"</div>
            <div style={{ fontSize: 16, color: 'var(--cx-dark-text)', lineHeight: 1.7, fontWeight: 300 }}>{response.answer}</div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--cx-dark-muted)' }}>{response.matched_count} evidence source{response.matched_count !== 1 ? 's' : ''} matched</div>
          </div>

          {/* Evidence */}
          {response.evidence.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: 14, marginBottom: 16 }}>Evidence Sources ({response.evidence.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {response.evidence.map((ev, i) => (
                  <div key={i} style={{ padding: '12px 14px', background: 'var(--cx-surface-2)', borderRadius: 8, border: '1px solid var(--cx-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{ev.device_name}</div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--cx-orange)' }}>Lines {ev.line_start}–{ev.line_end}</span>
                    </div>
                    <div className="code-block" style={{ padding: '8px 12px', fontSize: 12 }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{ev.source_text}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Transparency */}
          <div style={{ marginTop: 16, padding: '10px 16px', background: 'var(--cx-surface-2)', border: '1px solid var(--cx-border)', borderRadius: 8, fontSize: 12, color: 'var(--cx-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--cx-info)' }}>✦</span>
            Answers are derived from actual configuration evidence — not AI speculation. Compliance status is never inferred from query responses.
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--cx-muted)', marginBottom: 12 }}>Previous Queries</div>
          {history.slice(1).map((h, i) => (
            <div key={i} className="card" style={{ marginBottom: 8, padding: '12px 16px', cursor: 'pointer' }} onClick={() => setResponse(h)}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cx-text)' }}>{h.question}</div>
              <div style={{ fontSize: 12, color: 'var(--cx-muted)', marginTop: 4 }}>{h.answer.slice(0, 100)}...</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
