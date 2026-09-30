import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ArrowRight, Server, AlertTriangle, Zap,
  FileText, CheckCircle2, XCircle, Sparkles, Network,
  GitCompare, FlaskConical, Layers, ChevronRight
} from 'lucide-react';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';
import { HeroVisualization } from '../components/public/HeroVisualization';

export function LandingPage() {
  const [pipelineStep, setPipelineStep] = useState(0);
  const [vendorTab, setVendorTab] = useState<'cisco' | 'juniper' | 'fortinet' | 'paloalto'>('cisco');
  const [simState, setSimState] = useState<'before' | 'after'>('before');

  const pipelineSteps = [
    { name: 'UPLOAD', title: 'Upload & Storage', desc: 'Securely ingest raw running/startup configs via drag-and-drop or automated CI/CD webhooks.' },
    { name: 'DETECT', title: 'Vendor Fingerprinting', desc: 'Syntax-aware heuristics identify Cisco IOS/XE, Junos, FortiOS, or PAN-OS with 98%+ confidence.' },
    { name: 'PARSE', title: 'Hierarchical AST Parsing', desc: 'Lexical analyzers tokenize block structures, tables, and set-syntax without data loss.' },
    { name: 'NORMALIZE', title: 'Fact Normalization', desc: 'Extracts parameter paths (e.g. management.ssh.version = 2) with exact 1-indexed line references.' },
    { name: 'AUDIT', title: 'Deterministic Compliance', desc: 'Evaluates controls across CIS, NIST 800-53, PCI-DSS, and ISO 27001 with zero AI hallucination.' },
    { name: 'INVESTIGATE', title: 'Evidence & Findings', desc: 'Binds non-repudiable line-level evidence to each violation for rapid forensic verification.' },
    { name: 'REMEDIATE', title: 'Automated Fix Synthesis', desc: 'Compiles vendor-tailored CLI commands alongside emergency rollback playbooks.' },
    { name: 'REPORT', title: 'Audit Reporting', desc: 'Generates executive summaries and deep technical PDF compliance attestations.' },
  ];

  return (
    <div style={{ position: 'relative', background: '#050914', color: '#F2F4EA', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Background Translucent Video — Landing Page Only */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/background.mp4"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            opacity: 0.5,
            filter: 'contrast(1.1) brightness(0.95)',
          }}
        />
        {/* Subtle dark gradient overlay to ensure crisp contrast and text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 90% 70% at 50% 30%, rgba(5, 9, 20, 0.25) 0%, rgba(5, 9, 20, 0.55) 100%)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Navigation */}
        <PublicNavbar />

        {/* SECTION 1 — HERO */}
        <section
          style={{
            position: 'relative',
            paddingTop: 140,
            paddingBottom: 80,
            background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255, 116, 23, 0.12) 0%, rgba(5, 9, 20, 0.3) 100%)',
            borderBottom: '1px solid rgba(48, 56, 51, 0.5)',
          }}
        >
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px' }}>
            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(36px, 5.5vw, 64px)',
                fontWeight: 800,
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: 960,
                margin: '0 auto 20px',
                color: '#F2F4EA',
              }}
            >
            Turn Network Configurations Into{' '}
            <span style={{ color: '#FF7417', textShadow: '0 0 28px rgba(255, 116, 23, 0.35)' }}>
              Security Intelligence.
            </span>
          </h1>

          {/* Supporting Headline & Text */}
          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              textAlign: 'center',
              lineHeight: 1.6,
              color: '#AAB2A8',
              maxWidth: 780,
              margin: '0 auto 36px',
            }}
          >
            AI-powered multi-vendor network security compliance auditing with deterministic controls, evidence-backed findings, configuration intelligence, and predictive security analysis.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
            <Link
              to="/app/dashboard"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 24px rgba(255, 116, 23, 0.45)',
              }}
            >
              Launch CIPHER-X
              <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                color: '#F2F4EA',
                background: 'rgba(21, 27, 24, 0.7)',
                border: '1px solid #303833',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FF7417')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#303833')}
            >
              Explore the Platform
              <ChevronRight size={16} color="#AAB2A8" />
            </a>
          </div>

          {/* Interactive Hero Architecture Visualizer */}
          <HeroVisualization />
        </div>
      </section>

      {/* SECTION 2 — HERO PRODUCT PREVIEW */}
      <section style={{ padding: '60px 24px', background: 'rgba(9, 14, 23, 0.65)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(48, 56, 51, 0.5)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#FF7417', textTransform: 'uppercase' }}>
              SECURITY OPERATIONS CONSOLE PREVIEW
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#F2F4EA', marginTop: 4 }}>
              Deterministic Fleet Posture at a Glance
            </h2>
          </div>

          {/* Dashboard Preview Mockup Card */}
          <div
            style={{
              background: '#0D1311',
              border: '1px solid #303833',
              borderRadius: 14,
              boxShadow: '0 24px 60px -20px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}
          >
            {/* Topbar of Mockup */}
            <div
              style={{
                background: '#151B18',
                padding: '12px 20px',
                borderBottom: '1px solid #303833',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E05A61' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F0A13A' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#25B981' }} />
                <span style={{ marginLeft: 12, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: '#AAB2A8' }}>
                  CIPHER-X / Operations / Fleet Posture Overview (24 Monitored Nodes)
                </span>
              </div>
              <span className="live-indicator"><span className="dot" /> Realtime Audit Active</span>
            </div>

            {/* Metrics Row */}
            <div style={{ padding: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16 }}>
              <div style={{ background: '#18201B', padding: 18, borderRadius: 8, border: '1px solid #28322B' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8', fontWeight: 600 }}>SECURITY POSTURE</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#25B981', marginTop: 4 }}>87%</div>
                <div style={{ fontSize: 11, color: '#25B981', marginTop: 4 }}>+4% vs last baseline</div>
              </div>
              <div style={{ background: '#18201B', padding: 18, borderRadius: 8, border: '1px solid #28322B' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8', fontWeight: 600 }}>CRITICAL FINDINGS</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#E05A61', marginTop: 4 }}>4</div>
                <div style={{ fontSize: 11, color: '#E05A61', marginTop: 4 }}>Requires immediate CLI fix</div>
              </div>
              <div style={{ background: '#18201B', padding: 18, borderRadius: 8, border: '1px solid #28322B' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8', fontWeight: 600 }}>HIGH FINDINGS</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#FF7417', marginTop: 4 }}>12</div>
                <div style={{ fontSize: 11, color: '#AAB2A8', marginTop: 4 }}>3 in Training review</div>
              </div>
              <div style={{ background: '#18201B', padding: 18, borderRadius: 8, border: '1px solid #28322B' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8', fontWeight: 600 }}>DEVICES AUDITED</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#F2F4EA', marginTop: 4 }}>24</div>
                <div style={{ fontSize: 11, color: '#AAB2A8', marginTop: 4 }}>Cisco, Junos, Fortinet, PAN</div>
              </div>
              <div style={{ background: '#18201B', padding: 18, borderRadius: 8, border: '1px solid #28322B' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8', fontWeight: 600 }}>COMPLIANCE RATE</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#25B981', marginTop: 4 }}>91%</div>
                <div style={{ fontSize: 11, color: '#25B981', marginTop: 4 }}>CIS Level 1 & 2 pass</div>
              </div>
              <div style={{ background: '#18201B', padding: 18, borderRadius: 8, border: '1px solid #28322B' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8', fontWeight: 600 }}>RISK SCORE</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#F0A13A', marginTop: 4 }}>18 / 100</div>
                <div style={{ fontSize: 11, color: '#25B981', marginTop: 4 }}>Low enterprise blast</div>
              </div>
            </div>

            {/* Findings Preview Table */}
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#AAB2A8', marginBottom: 12, textTransform: 'uppercase' }}>
                High-Priority Security Violations (Exact Line Proofs)
              </div>
              <div style={{ border: '1px solid #28322B', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px 100px', background: '#151B18', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#AAB2A8' }}>
                  <span>ID</span>
                  <span>Finding Title</span>
                  <span>Device</span>
                  <span>Framework</span>
                  <span>Severity</span>
                </div>
                {[
                  { id: 'FND-001', title: 'Unencrypted Telnet Management Protocol Active', dev: 'CORE-SW-01', fw: 'CIS 1.1.2', sev: 'CRITICAL', col: '#E05A61' },
                  { id: 'FND-014', title: 'Insecure SSH v1 Protocol Allowed on VTY Lines', dev: 'EDGE-RTR-01', fw: 'NIST SC-8', sev: 'HIGH', col: '#FF7417' },
                  { id: 'FND-023', title: 'SNMP v1/v2c Read-Write Community String Insecure', dev: 'DMZ-FW-01', fw: 'PCI-DSS 2.2', sev: 'MEDIUM', col: '#F0A13A' },
                  { id: 'FND-041', title: 'Syslog Remote Logging Daemon Not Configured', dev: 'BRANCH-RTR-02', fw: 'ISO A.8.15', sev: 'LOW', col: '#7A8FA6' },
                ].map((f) => (
                  <div key={f.id} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px 130px 100px', padding: '10px 16px', fontSize: 12, borderTop: '1px solid #202A24', background: '#111714', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#FF7417' }}>{f.id}</span>
                    <span style={{ color: '#F2F4EA', fontWeight: 500 }}>{f.title}</span>
                    <span style={{ color: '#AAB2A8' }}>{f.dev}</span>
                    <span style={{ color: '#AAB2A8' }}>{f.fw}</span>
                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, background: `${f.col}22`, color: f.col, fontWeight: 700, fontSize: 10, textAlign: 'center' }}>
                      {f.sev}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — TRUST / CAPABILITY STRIP */}
      <section style={{ padding: '36px 24px', background: 'rgba(7, 12, 10, 0.65)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(48, 56, 51, 0.5)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          {/* Vendors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#687369', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              MULTI-VENDOR SUPPORT
            </span>
            {['Cisco (IOS-XE, NX-OS)', 'Juniper (Junos)', 'Fortinet (FortiOS)', 'Palo Alto (PAN-OS)'].map((v) => (
              <span key={v} style={{ fontSize: 13, fontWeight: 600, color: '#C5CCC4', background: '#121A15', padding: '6px 12px', borderRadius: 6, border: '1px solid #25332A' }}>
                {v}
              </span>
            ))}
          </div>

          {/* Compliance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#687369', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              STANDARDS READY
            </span>
            {['CIS Benchmarks', 'NIST SP 800-53', 'PCI-DSS v4.0', 'ISO/IEC 27001'].map((c) => (
              <span key={c} style={{ fontSize: 13, fontWeight: 600, color: '#FF7417', background: 'rgba(255, 116, 23, 0.08)', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255, 116, 23, 0.3)' }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — THE PROBLEM */}
      <section style={{ padding: '80px 24px', background: 'rgba(5, 9, 20, 0.6)', backdropFilter: 'blur(8px)' }} id="problem">
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 50px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#FF7417', textTransform: 'uppercase', marginBottom: 8 }}>
              THE ENTERPRISE CHALLENGE
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#F2F4EA', lineHeight: 1.2 }}>
              Network security becomes difficult when infrastructure speaks different languages.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                icon: Layers,
                title: 'Vendor Fragmentation',
                desc: 'Different hardware vendors use radically distinct configuration syntax. Regex scripts break whenever firmware patches introduce minor formatting changes.',
              },
              {
                icon: FileText,
                title: 'Evidence Gaps',
                desc: 'Auditors require exact configuration proof with line coordinates, not vague summaries. Tracking evidence across 10,000-line running configs consumes weeks.',
              },
              {
                icon: AlertTriangle,
                title: 'Configuration Complexity',
                desc: 'Enterprise switches, edge firewalls, and core routers contain thousands of nested blocks where critical security weaknesses easily hide in plain sight.',
              },
              {
                icon: XCircle,
                title: 'AI Hallucination Risk',
                desc: 'Generic LLMs hallucinate default parameters and miss subtle access-list exclusions. Mission-critical compliance audits require deterministic validation certainty.',
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  style={{
                    background: '#0D1311',
                    border: '1px solid #232D27',
                    borderRadius: 12,
                    padding: 28,
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF7417';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#232D27';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255, 116, 23, 0.12)', color: '#FF7417', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F2F4EA', marginBottom: 10 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: '#AAB2A8', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — THE CIPHER-X APPROACH */}
      <section style={{ padding: '80px 24px', background: 'rgba(9, 14, 23, 0.65)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(48, 56, 51, 0.5)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 40px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#25B981', textTransform: 'uppercase', marginBottom: 8 }}>
              THE CIPHER-X SOLUTION
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#F2F4EA' }}>
              One security intelligence layer across your network.
            </h2>
            <p style={{ fontSize: 15, color: '#AAB2A8', marginTop: 12 }}>
              From heterogeneous CLI dumps to non-repudiable audit evidence in milliseconds.
            </p>
          </div>

          {/* Interactive Visual Pipeline Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            {pipelineSteps.map((step, idx) => (
              <button
                key={step.name}
                onClick={() => setPipelineStep(idx)}
                style={{
                  background: pipelineStep === idx ? '#FF7417' : '#111714',
                  color: pipelineStep === idx ? '#FFFFFF' : '#AAB2A8',
                  border: pipelineStep === idx ? '1px solid #FF7417' : '1px solid #232D27',
                  borderRadius: 8,
                  padding: '12px 8px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 10, opacity: 0.8 }}>0{idx + 1}</span>
                {step.name}
              </button>
            ))}
          </div>

          <div
            style={{
              background: '#0D1311',
              border: '1px solid #2D3932',
              borderRadius: 12,
              padding: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: '#FF7417', fontWeight: 700, letterSpacing: '0.06em' }}>
                STAGE 0{pipelineStep + 1} ARCHITECTURE
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#F2F4EA', marginTop: 4, marginBottom: 8 }}>
                {pipelineSteps[pipelineStep].title}
              </div>
              <div style={{ fontSize: 14, color: '#AAB2A8', maxWidth: 650, lineHeight: 1.6 }}>
                {pipelineSteps[pipelineStep].desc}
              </div>
            </div>
            <Link
              to="/app/configurations/upload"
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}
            >
              Test Configuration Upload
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — KEY FEATURES */}
      <section style={{ padding: '90px 24px', background: 'rgba(5, 9, 20, 0.6)', backdropFilter: 'blur(8px)' }} id="features">
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 60px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#FF7417', textTransform: 'uppercase', marginBottom: 8 }}>
              ENTERPRISE CAPABILITIES
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#F2F4EA' }}>
              Engineered for Complete Fleet Governance
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {[
              {
                icon: Server,
                title: 'Multi-Vendor Configuration Intelligence',
                desc: 'Natively analyze Cisco IOS/XE/NX-OS, Juniper Junos, Fortinet FortiOS, and Palo Alto PAN-OS configurations in one unified schema.',
              },
              {
                icon: ShieldCheck,
                title: 'Deterministic Compliance Engine',
                desc: 'Audits configurations using rigorous mathematical comparison operators without allowing AI hallucinations to determine compliance truth.',
              },
              {
                icon: Sparkles,
                title: 'Human-in-the-Loop AI Training',
                desc: 'When unknown syntax is discovered, the AI assistant hypothesizes its schema. Analysts approve it once, and it becomes a permanent deterministic rule.',
              },
              {
                icon: CheckCircle2,
                title: 'Evidence-Backed Findings',
                desc: 'Every finding binds directly to exact 1-indexed configuration lines. Zero guesswork for auditors reviewing non-repudiable proof.',
              },
              {
                icon: FlaskConical,
                title: 'What-If Security Simulation',
                desc: 'Simulate planned configuration changes before applying them to production routers to predict compliance score delta and new vulnerabilities.',
              },
              {
                icon: GitCompare,
                title: 'Configuration Drift Engine',
                desc: 'Compare historical configuration snapshots with dual-layer lexical and semantic AST diffing to detect unauthorized changes instantly.',
              },
              {
                icon: Network,
                title: 'Security Topology Graph',
                desc: 'Visualize network devices, interfaces, VLANs, and firewall ACLs on an interactive canvas powered by @xyflow/react with blast radius mapping.',
              },
              {
                icon: Zap,
                title: 'Automated Remediation',
                desc: 'Synthesize vendor-specific remediation commands with matching emergency rollback scripts to guarantee safe implementation.',
              },
              {
                icon: FileText,
                title: 'Executive & Technical Reports',
                desc: 'Generate comprehensive audit reports, executive scorecards, and regulatory compliance attestations with a single click.',
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  style={{
                    background: '#0D1311',
                    border: '1px solid #232D27',
                    borderRadius: 12,
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255, 116, 23, 0.1)', color: '#FF7417', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#F2F4EA', marginBottom: 8 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: '#AAB2A8', lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8 — AI + DETERMINISTIC ENGINE SPLIT */}
      <section style={{ padding: '80px 24px', background: 'rgba(7, 12, 10, 0.65)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(48, 56, 51, 0.5)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 50px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#FF7417', textTransform: 'uppercase', marginBottom: 8 }}>
              ARCHITECTURAL FOUNDATION
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.8vw, 38px)', fontWeight: 800, color: '#F2F4EA' }}>
              AI where intelligence matters. Deterministic logic where security demands certainty.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'stretch' }}>
            {/* Left: Deterministic */}
            <div style={{ background: '#0D1311', border: '1px solid #25B981', borderRadius: 12, padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#25B981', marginBottom: 16 }}>
                <ShieldCheck size={24} />
                <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  DETERMINISTIC SECURITY ENGINE
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#AAB2A8', marginBottom: 20 }}>
                Authoritative compliance evaluation. Mathematical certainty with zero hallucination.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Multi-Vendor AST Lexical Parsing',
                  'Canonical NormalizedFact Extraction',
                  'Deterministic Control Operators (EQUALS, CONTAINS, REGEX)',
                  'Exact Line-Range Cryptographic Evidence Binding',
                  'Severity & Compliance Score Calculation',
                  'Non-Repudiable Regulatory Attestation',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#F2F4EA' }}>
                    <CheckCircle2 size={16} color="#25B981" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Intelligence */}
            <div style={{ background: '#0D1311', border: '1px solid #FF7417', borderRadius: 12, padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FF7417', marginBottom: 16 }}>
                <Sparkles size={24} />
                <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  AI INTELLIGENCE LAYER
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#AAB2A8', marginBottom: 20 }}>
                Co-pilot for natural language exploration, unknown vendor syntax, and simulation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Zero-Shot Unknown Syntax Hypothesis Generation',
                  'Active Learning via Human-in-the-Loop Training Studio',
                  'Natural Language Plain-English Security Queries',
                  'Blast-Radius Contextual Impact Traversal',
                  'Intelligent Remediation CLI Syntax Assistance',
                  'Plain-English Security Finding Forensic Explanations',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#F2F4EA' }}>
                    <CheckCircle2 size={16} color="#FF7417" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — COMPLIANCE FRAMEWORKS */}
      <section style={{ padding: '80px 24px', background: 'rgba(5, 9, 20, 0.6)', backdropFilter: 'blur(8px)' }} id="compliance">
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 50px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#FF7417', textTransform: 'uppercase', marginBottom: 8 }}>
              REGULATORY BENCHMARKS
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#F2F4EA' }}>
              One platform. Multiple security frameworks.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { code: 'CIS', name: 'CIS Benchmarks', desc: 'Center for Internet Security hardening baselines for routers, switches, and firewalls.', controls: 68, score: 94, status: 'PASS' },
              { code: 'NIST', name: 'NIST SP 800-53 Rev 5', desc: 'Federal security catalog controls (Access Control, Configuration Management, System Protection).', controls: 84, score: 88, status: 'PASS' },
              { code: 'PCI-DSS', name: 'PCI-DSS v4.0', desc: 'Cardholder Data Environment network segmentation and firewall security requirements.', controls: 42, score: 82, status: 'REVIEW' },
              { code: 'ISO 27001', name: 'ISO/IEC 27001:2022', desc: 'Annex A.8 Technological Controls for network segregation and privileged access logging.', controls: 56, score: 91, status: 'PASS' },
            ].map((fw) => (
              <div
                key={fw.code}
                style={{
                  background: '#0D1311',
                  border: '1px solid #232D27',
                  borderRadius: 12,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#FF7417', background: 'rgba(255, 116, 23, 0.1)', padding: '4px 8px', borderRadius: 4 }}>
                      {fw.code}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: fw.status === 'PASS' ? '#25B981' : '#F0A13A' }}>
                      {fw.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#F2F4EA', marginBottom: 6 }}>{fw.name}</div>
                  <div style={{ fontSize: 12, color: '#AAB2A8', lineHeight: 1.5, marginBottom: 16 }}>{fw.desc}</div>
                </div>

                <div style={{ borderTop: '1px solid #1E2822', paddingTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#8C9390' }}>{fw.controls} Controls Evaluated</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#25B981' }}>{fw.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — MULTI-VENDOR TRANSLATION */}
      <section style={{ padding: '80px 24px', background: 'rgba(9, 14, 23, 0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderTop: '1px solid rgba(48, 56, 51, 0.5)' }} id="vendors">
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 40px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#25B981', textTransform: 'uppercase', marginBottom: 8 }}>
              UNIVERSAL AST NORMALIZATION
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#F2F4EA' }}>
              Different syntax. One security language.
            </h2>
          </div>

          {/* Vendor Selector Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            {[
              { key: 'cisco', label: 'Cisco IOS-XE' },
              { key: 'juniper', label: 'Juniper Junos' },
              { key: 'fortinet', label: 'Fortinet FortiOS' },
              { key: 'paloalto', label: 'Palo Alto PAN-OS' },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setVendorTab(v.key as any)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: vendorTab === v.key ? '#FF7417' : '#121A15',
                  color: vendorTab === v.key ? '#FFF' : '#AAB2A8',
                  border: vendorTab === v.key ? '1px solid #FF7417' : '1px solid #232D27',
                }}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Split Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Raw CLI Syntax */}
            <div style={{ background: '#0D1311', border: '1px solid #232D27', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#FF7417', marginBottom: 12, textTransform: 'uppercase' }}>
                RAW VENDOR CLI INPUT
              </div>
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#C5CCC4', background: '#080C0A', padding: 16, borderRadius: 6, overflowX: 'auto', lineHeight: 1.6 }}>
                {vendorTab === 'cisco' && `line vty 0 4\n transport input ssh\n exec-timeout 15 0\n service password-encryption\n ip ssh version 2`}
                {vendorTab === 'juniper' && `set system services ssh protocol-version v2\nset system services ssh root-login deny\nset system login retry-options tries-before-disconnect 3`}
                {vendorTab === 'fortinet' && `config system admin\n edit "admin"\n set password-policy enable\n next\nend\nconfig system global\n set admin-sport 8443\nend`}
                {vendorTab === 'paloalto' && `set deviceconfig system service disable-telnet yes\nset deviceconfig system service disable-http yes\nset deviceconfig system ssh-key-exchange-algorithms [ diffie-hellman-group14-sha1 ]`}
              </pre>
            </div>

            {/* Normalized Fact JSON */}
            <div style={{ background: '#0D1311', border: '1px solid #25B981', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#25B981', marginBottom: 12, textTransform: 'uppercase' }}>
                CIPHER-X CANONICAL NORMALIZEDFACTS
              </div>
              <pre style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#25B981', background: '#080C0A', padding: 16, borderRadius: 6, overflowX: 'auto', lineHeight: 1.6 }}>
                {`{\n  "category": "management",\n  "parameter": "management.ssh.version",\n  "value": 2,\n  "confidence": 0.98,\n  "line_coordinates": { "start": 42, "end": 44 },\n  "compliance_mapping": ["CIS-1.1.1", "NIST-SC-8", "PCI-2.2.4"]\n}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12 — WHAT-IF PREVIEW */}
      <section style={{ padding: '80px 24px', background: 'rgba(5, 9, 20, 0.60)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderTop: '1px solid rgba(48, 56, 51, 0.5)' }} id="simulation">
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 40px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#FF7417', textTransform: 'uppercase', marginBottom: 8 }}>
              PREDICTIVE SECURITY SIMULATION
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#F2F4EA' }}>
              What happens before you deploy the change?
            </h2>
          </div>

          <div style={{ background: '#0D1311', border: '1px solid #303833', borderRadius: 12, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#F2F4EA' }}>
                Scenario: Upgrading Edge Router Management Protocol (Telnet ➔ SSH v2)
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setSimState('before')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: simState === 'before' ? '#E05A61' : '#1C2420',
                    color: '#FFF',
                    border: 'none',
                  }}
                >
                  BEFORE (Current)
                </button>
                <button
                  onClick={() => setSimState('after')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: simState === 'after' ? '#25B981' : '#1C2420',
                    color: '#FFF',
                    border: 'none',
                  }}
                >
                  AFTER (Simulated)
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ background: '#151B18', padding: 20, borderRadius: 8, border: '1px solid #232D27' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8' }}>COMPLIANCE SCORE</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: simState === 'after' ? '#25B981' : '#E05A61', marginTop: 4 }}>
                  {simState === 'after' ? '92%' : '80%'}
                </div>
                <div style={{ fontSize: 11, color: '#25B981', marginTop: 4 }}>
                  {simState === 'after' ? '+12% Projected Gain' : 'Current baseline'}
                </div>
              </div>
              <div style={{ background: '#151B18', padding: 20, borderRadius: 8, border: '1px solid #232D27' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8' }}>RISK SCORE</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: simState === 'after' ? '#25B981' : '#E05A61', marginTop: 4 }}>
                  {simState === 'after' ? '12 / 100' : '30 / 100'}
                </div>
                <div style={{ fontSize: 11, color: '#25B981', marginTop: 4 }}>
                  {simState === 'after' ? '-18% Risk Reduction' : 'Elevated risk'}
                </div>
              </div>
              <div style={{ background: '#151B18', padding: 20, borderRadius: 8, border: '1px solid #232D27' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8' }}>AFFECTED DEVICES</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#F2F4EA', marginTop: 4 }}>2</div>
                <div style={{ fontSize: 11, color: '#AAB2A8', marginTop: 4 }}>EDGE-RTR-01, CORE-SW-01</div>
              </div>
              <div style={{ background: '#151B18', padding: 20, borderRadius: 8, border: '1px solid #232D27' }}>
                <div style={{ fontSize: 11, color: '#AAB2A8' }}>RESOLVED DEFECTS</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#25B981', marginTop: 4 }}>
                  {simState === 'after' ? '3' : '0'}
                </div>
                <div style={{ fontSize: 11, color: '#25B981', marginTop: 4 }}>Zero regressions detected</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link
                to="/app/simulation"
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontSize: 13, textDecoration: 'none' }}
              >
                Run a Live What-If Simulation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 16 — FINAL CALL TO ACTION */}
      <section
        style={{
          padding: '100px 24px',
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255, 116, 23, 0.15) 0%, rgba(5, 9, 20, 0.5) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          textAlign: 'center',
          borderTop: '1px solid rgba(48, 56, 51, 0.5)',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#F2F4EA', lineHeight: 1.15, marginBottom: 20 }}>
            Your network already contains the evidence.{' '}
            <span style={{ color: '#FF7417' }}>CIPHER-X turns it into intelligence.</span>
          </h2>
          <p style={{ fontSize: 16, color: '#AAB2A8', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 36px' }}>
            Empower your network engineering and cybersecurity compliance teams with deterministic audits, active-learning AI, and non-repudiable audit evidence.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              to="/app/dashboard"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 34px',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 24px rgba(255, 116, 23, 0.45)',
              }}
            >
              Launch CIPHER-X
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                color: '#F2F4EA',
                background: 'rgba(21, 27, 24, 0.8)',
                border: '1px solid #303833',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              Access Secure Console
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
      </div>
    </div>
  );
}
