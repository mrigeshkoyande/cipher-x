import React, { useState, useEffect } from 'react';
import { Server, Cpu, ShieldCheck, CheckCircle2, AlertTriangle, Zap, Terminal, Sparkles } from 'lucide-react';

const pipelineStages = [
  { id: 'ingest', label: 'Raw Config', icon: Server, desc: 'Cisco, Junos, FortiOS, PAN-OS dumps', badge: 'Ingestion' },
  { id: 'detect', label: 'Vendor AST', icon: Cpu, desc: 'Fingerprinting & Lexical Tree', badge: 'Confidence: 98%' },
  { id: 'normalize', label: 'Normalized Fact', icon: Terminal, desc: 'Canonical parameter paths', badge: 'Zero-loss' },
  { id: 'audit', label: 'Compliance Engine', icon: ShieldCheck, desc: 'CIS, NIST 800-53, PCI-DSS, ISO', badge: 'Deterministic' },
  { id: 'ai', label: 'AI Co-Pilot', icon: Sparkles, desc: 'Hypothesis & Active Learning', badge: 'Human-in-Loop' },
  { id: 'findings', label: 'Evidence & Findings', icon: AlertTriangle, desc: 'Exact line-range bound proofs', badge: 'Audit-Proof' },
  { id: 'remediate', label: 'Remediation', icon: Zap, desc: 'Targeted CLI & Rollback Scripts', badge: 'Ready-to-Deploy' },
];

export function HeroVisualization() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % pipelineStages.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(21, 27, 24, 0.95) 0%, rgba(13, 19, 17, 0.98) 100%)',
        border: '1px solid rgba(48, 56, 51, 0.8)',
        borderRadius: 16,
        padding: '24px 20px',
        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}
    >
      {/* Top Telemetry Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(48, 56, 51, 0.5)',
          paddingBottom: 14,
          marginBottom: 20,
          fontSize: 11,
          fontFamily: "'JetBrains Mono', monospace",
          color: '#8C9390',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF7417', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ color: '#F2F4EA', fontWeight: 600 }}>CIPHER-X AUDIT PIPELINE ENGINE</span>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>MODE: <strong style={{ color: '#25B981' }}>DETERMINISTIC</strong></span>
          <span>LATENCY: <strong style={{ color: '#F2F4EA' }}>14ms</strong></span>
        </div>
      </div>

      {/* Pipeline Progression Nodes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 10,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {pipelineStages.map((stage, idx) => {
          const isActive = idx === activeStage;
          const isPassed = idx < activeStage;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              onClick={() => setActiveStage(idx)}
              style={{
                background: isActive
                  ? 'rgba(255, 116, 23, 0.12)'
                  : isPassed
                  ? 'rgba(37, 185, 129, 0.06)'
                  : 'rgba(28, 36, 32, 0.6)',
                border: isActive
                  ? '1px solid #FF7417'
                  : isPassed
                  ? '1px solid rgba(37, 185, 129, 0.4)'
                  : '1px solid rgba(48, 56, 51, 0.6)',
                borderRadius: 10,
                padding: '14px 10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: isActive ? '#FF7417' : isPassed ? '#25B981' : '#232D27',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={14} />
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isActive ? '#FF7417' : isPassed ? '#25B981' : '#687369',
                    fontWeight: 700,
                  }}
                >
                  0{idx + 1}
                </span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#F2F4EA', marginBottom: 2 }}>{stage.label}</div>
              <div style={{ fontSize: 10, color: '#8C9390', lineHeight: 1.3, marginBottom: 8 }}>{stage.desc}</div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 9,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: isActive ? 'rgba(255, 116, 23, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#FF7417' : '#AAB2A8',
                }}
              >
                {stage.badge}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Stage Live Inspector Sandbox */}
      <div
        style={{
          marginTop: 18,
          background: '#0F1513',
          border: '1px solid rgba(48, 56, 51, 0.7)',
          borderRadius: 8,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              background: 'rgba(255, 116, 23, 0.15)',
              color: '#FF7417',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            STAGE 0{activeStage + 1}: {pipelineStages[activeStage].label.toUpperCase()}
          </div>
          <div style={{ fontSize: 12, color: '#C5CCC4' }}>
            {activeStage === 0 && 'Ingesting CORE-SW-01.cfg (Cisco IOS-XE 17.3, 1,248 lines)...'}
            {activeStage === 1 && 'AST Lexer: vendor=Cisco platform=IOS-XE confidence=0.98'}
            {activeStage === 2 && 'Extracted: management.ssh.version = 2 (Lines 42-45)'}
            {activeStage === 3 && 'Evaluating CIS Benchmark Control 1.1.2: management.telnet == false'}
            {activeStage === 4 && 'AI Hypothesizer: Analyzed proprietary vendor command "crypto sec-p" (0.91)'}
            {activeStage === 5 && 'CRITICAL Finding Generated: CIPHER-FND-001 with cryptographically verified line coordinates'}
            {activeStage === 6 && 'Remediation script compiled: "no transport input telnet" with rollback safe-state'}
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#25B981',
            fontFamily: "'JetBrains Mono', monospace",
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <CheckCircle2 size={13} />
          EVIDENCE VERIFIED
        </div>
      </div>
    </div>
  );
}
