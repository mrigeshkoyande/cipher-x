import React, { useState } from 'react';
import { 
  HelpCircle, Send, Bot, User, Sparkles, 
  Terminal, ShieldCheck, ArrowRight, ShieldAlert, Cpu
} from 'lucide-react';

export default function AssistantView({ onNavigateTab }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "👋 Hello! I am the Cipher-X Grounded Security Assistant. I retrieve factual network configuration telemetry, compliance assessments, and audit logs to answer your cybersecurity queries without hallucinating.\n\nTry asking me one of the quick questions below:",
      grounded_facts: null,
      suggested_actions: [
        "Which devices allow Telnet?",
        "Which devices failed SSH?",
        "Show critical findings",
        "What happens if I disable Telnet?",
        "How can I remediate CTRL-TELNET-01?"
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Which devices allow Telnet?",
    "Which devices failed SSH?",
    "Which devices have weak cryptography?",
    "Show critical findings",
    "What happens if I disable Telnet?",
    "How can I remediate CTRL-SSH-01?"
  ];

  const handleSend = async (queryText = null) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', text: q }];
    setMessages(newMessages);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/assistant/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            text: data.answer,
            grounded_facts: data.grounded_facts,
            intent: data.intent,
            suggested_actions: data.suggested_actions
          }
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages([
        ...newMessages,
        { role: 'assistant', text: "An error occurred communicating with the security intelligence engine." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-cyan-400" /> Grounded AI Security Assistant
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Grounded cybersecurity intelligence with factual telemetry retrieval, prompt-injection defense, and verifiable evidence.
        </p>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-500">Quick Inquiries:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="glass-panel p-5 min-h-[500px] max-h-[600px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto pr-2 flex-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 text-xs leading-relaxed ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                </div>
              )}

              <div className={`p-4 rounded-xl max-w-2xl border space-y-2.5 ${
                m.role === 'user'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-100 rounded-tr-none'
                  : 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
              }`}>
                {/* Text Content */}
                <div className="whitespace-pre-line font-sans text-xs">
                  {m.text}
                </div>

                {/* Suggested Action Buttons */}
                {m.suggested_actions?.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                    {m.suggested_actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(act)}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300 hover:border-cyan-400 transition"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                Retrieving grounded facts from database & compliance AST engine...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a factual question (e.g. 'Which devices allow Telnet?' or 'What happens if I disable Telnet?')..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="btn-cyber-primary py-2.5 px-4 text-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
