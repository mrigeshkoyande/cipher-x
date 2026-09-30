import React, { useState } from 'react';

export default function AssistantView({ onNavigateTab }) {
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'Welcome to the Cipher-X Training Studio & Security Assistant. You can ask compliance questions, request device analysis, or explore security recommendations.',
    },
    {
      role: 'assistant',
      content: 'How can I help you today? You can ask me about:\n\n• **Compliance posture** for specific devices\n• **Security findings** and remediation guidance\n• **Framework mapping** between CIS, NIST, DISA STIG\n• **Configuration analysis** and drift detection\n• **Risk assessment** for configuration changes',
      citations: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'No response available.', citations: data.citations || [] }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I was unable to process your request. Please try again.' }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. The security assistant service may be offline.' }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-badge">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>model_training</span>
          AI SECURITY INTELLIGENCE
        </div>
        <h1>Training Studio & Security Assistant</h1>
        <p>Grounded cybersecurity assistant trained on your compliance frameworks, device configurations, and security policies. All responses include provenance citations.</p>
      </div>

      {/* Chat Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1rem' }}>
        {/* Chat Messages */}
        <div className="info-card" style={{ minHeight: 500, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)',
                background: msg.role === 'user' ? 'var(--primary-container)' : msg.role === 'system' ? 'var(--surface-container)' : 'var(--surface-container-low)',
                color: msg.role === 'user' ? '#fff' : 'var(--on-surface)',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                border: msg.role === 'system' ? '1px solid var(--outline-variant)' : 'none',
              }}>
                {msg.role === 'system' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
                    SYSTEM
                  </div>
                )}
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--primary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>smart_toy</span>
                    CIPHER-X ASSISTANT
                  </div>
                )}
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: `1px solid ${msg.role === 'user' ? 'rgba(255,255,255,0.2)' : 'var(--surface-variant)'}`, fontSize: '0.6875rem' }}>
                    <span style={{ fontWeight: 600 }}>Citations:</span>
                    {msg.citations.map((c, ci) => (
                      <span key={ci} className="code-tag" style={{ fontSize: '0.5625rem', marginLeft: '0.375rem' }}>{c}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--on-surface-variant)', padding: '0.5rem' }}>
                <div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
                Analyzing your query...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--surface-variant)', paddingTop: '0.75rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about compliance, security findings, or configuration analysis..."
              style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-low)', fontFamily: 'inherit', fontSize: '0.8125rem' }}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>send</span>
              Send
            </button>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div>
          <div className="info-card">
            <h4 style={{ marginBottom: '0.75rem' }}>Quick Queries</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                'Show critical findings for Cisco-Core-01',
                'What is the compliance score for NIST 800-53?',
                'List devices with Telnet enabled',
                'Explain CIS-NET-004 control',
                'Generate remediation for weak SSH ciphers',
                'Compare baseline vs running config',
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(query); }}
                  style={{ textAlign: 'left', padding: '0.5rem 0.625rem', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-md)', background: 'var(--surface-container-lowest)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', transition: 'all 0.15s' }}
                  onMouseOver={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; }}
                  onMouseOut={(e) => { e.target.style.borderColor = 'var(--outline-variant)'; e.target.style.color = 'var(--on-surface)'; }}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          <div className="info-card" style={{ marginTop: '0.75rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Grounding Sources</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                <span className="status-dot green"></span> 5 Compliance Frameworks
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                <span className="status-dot green"></span> 274 Security Controls
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
                <span className="status-dot green"></span> 128 Device Configs
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span className="status-dot green"></span> 482 Semantic Mappings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
