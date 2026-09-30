import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, ArrowRight, CheckCircle2, Lock, Terminal, Sparkles, Layers, FileText, Network, GitCompare, Zap } from 'lucide-react';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';

function PublicPageLayout({ title, subtitle, badge, children }: { title: string; subtitle: string; badge: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#050914', color: '#F2F4EA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <main style={{ flex: 1, paddingTop: 130, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                color: '#FF7417',
                background: 'rgba(255, 116, 23, 0.1)',
                border: '1px solid rgba(255, 116, 23, 0.3)',
                padding: '4px 12px',
                borderRadius: 20,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {badge}
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: '#F2F4EA', marginBottom: 16, lineHeight: 1.15 }}>
              {title}
            </h1>
            <p style={{ fontSize: 16, color: '#AAB2A8', maxWidth: 740, margin: '0 auto', lineHeight: 1.6 }}>
              {subtitle}
            </p>
          </div>

          {/* Content */}
          {children}

          {/* Bottom Launch Banner */}
          <div
            style={{
              marginTop: 80,
              background: 'linear-gradient(180deg, #151B18 0%, #0D1311 100%)',
              border: '1px solid #303833',
              borderRadius: 16,
              padding: '40px 32px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: 24, fontWeight: 700, color: '#F2F4EA', marginBottom: 12 }}>
              Ready to evaluate your network infrastructure?
            </h3>
            <p style={{ fontSize: 14, color: '#AAB2A8', maxWidth: 540, margin: '0 auto 24px' }}>
              Launch CIPHER-X to ingest configurations, detect security drift, and generate deterministic compliance scorecards.
            </p>
            <Link
              to="/app/dashboard"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', fontSize: 14, textDecoration: 'none' }}
            >
              Launch CIPHER-X Console
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

// 1. Features Page
export function FeaturesPage() {
  return (
    <PublicPageLayout
      badge="PLATFORM FEATURES"
      title="Complete Network Security Intelligence"
      subtitle="From multi-vendor configuration parsing to predictive what-if simulations and automated remediation playbooks."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {[
          { title: 'Deterministic Compliance Engine', icon: ShieldCheck, desc: 'Audits CIS, NIST, PCI-DSS, and ISO 27001 rules without allowing AI hallucinations to determine compliance truth.' },
          { title: 'Multi-Vendor Lexical Parsing', icon: Cpu, desc: 'Grammar engines for Cisco IOS/XE/NX-OS, Juniper Junos, Fortinet FortiOS, and Palo Alto PAN-OS dumps.' },
          { title: 'Cryptographic Line Evidence', icon: FileText, desc: 'Every security defect binds to exact 1-indexed file line coordinates for rapid forensic validation.' },
          { title: 'Human-in-the-Loop AI Training', icon: Sparkles, desc: 'Security analysts approve AI interpretations of unknown vendor syntax once, committing them permanently into the parser.' },
          { title: 'Predictive What-If Simulation', icon: Terminal, desc: 'Simulate planned CLI changes before deployment to predict compliance deltas and prevent security regressions.' },
          { title: 'Configuration Drift Engine', icon: GitCompare, desc: 'Unified AST and lexical diffing across historical uploads flags unauthorized configuration changes.' },
          { title: 'Security Topology Graph', icon: Network, desc: 'Interactive topology canvas rendering device nodes, interfaces, VLANs, and firewall ACL blast radiuses.' },
          { title: 'Automated Remediation & Rollback', icon: Zap, desc: 'Synthesize vendor-specific CLI fix commands alongside matching emergency rollback scripts.' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} style={{ background: '#0D1311', border: '1px solid #232D27', borderRadius: 12, padding: 28 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255, 116, 23, 0.1)', color: '#FF7417', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={20} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F2F4EA', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: '#AAB2A8', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          );
        })}
      </div>
    </PublicPageLayout>
  );
}

// 2. How It Works Page
export function HowItWorksPage() {
  return (
    <PublicPageLayout
      badge="PIPELINE ARCHITECTURE"
      title="How CIPHER-X Audits Networks"
      subtitle="A transparent, 7-stage architectural journey from raw text dumps to non-repudiable audit evidence."
    >
      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { step: '01', title: 'Configuration Ingestion', text: 'Upload raw running-config or startup-config files (.txt, .cfg, .conf, .set) via web UI or API webhooks.' },
          { step: '02', title: 'Vendor Fingerprinting & Lexing', text: 'Syntax heuristics identify vendor platform (Cisco, Juniper, Fortinet, Palo Alto) with 98%+ confidence and construct hierarchical AST trees.' },
          { step: '03', title: 'NormalizedFact Extraction', text: 'Universal categories (management, password_policy, snmp, logging, interfaces) extract canonical parameter paths with line coordinates.' },
          { step: '04', title: 'Deterministic Compliance Evaluation', text: 'Mathematical operator algebra (EQUALS, CONTAINS, REGEX, GREATER_THAN) evaluates controls across CIS, NIST, PCI-DSS, and ISO 27001.' },
          { step: '05', title: 'AI Co-Pilot & Training Studio', text: 'Proprietary vendor commands are analyzed by Google Gemini. Analysts approve schemas in the Training Studio, updating the engine with zero code redeployment.' },
          { step: '06', title: 'Evidence Binding & Finding Generation', text: 'Violations generate findings with exact line coordinates, observed vs expected values, and severity levels (CRITICAL, HIGH, MEDIUM, LOW).' },
          { step: '07', title: 'Remediation & Executive Reporting', text: 'Generates vendor CLI remediation scripts, emergency rollback instructions, and structured technical audit reports.' },
        ].map((s) => (
          <div key={s.step} style={{ display: 'flex', gap: 24, background: '#0D1311', border: '1px solid #232D27', borderRadius: 12, padding: 24, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#FF7417', fontFamily: "'JetBrains Mono', monospace" }}>{s.step}</span>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F2F4EA', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: '#AAB2A8', lineHeight: 1.6, margin: 0 }}>{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
}

// 3. Frameworks Page
export function FrameworksPage() {
  return (
    <PublicPageLayout
      badge="COMPLIANCE STANDARDS"
      title="Supported Regulatory Frameworks"
      subtitle="Cross-map normalized network configuration facts across multiple international security benchmarks."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {[
          { code: 'CIS', name: 'CIS Benchmarks (Level 1 & 2)', controls: '68 Controls', desc: 'Industry consensus hardening guidelines for network infrastructure. Covers SSH versioning, Telnet disabling, privileged exec timeout, and local user hashing.' },
          { code: 'NIST', name: 'NIST SP 800-53 Rev 5', controls: '84 Controls', desc: 'Federal security catalog controls including AC-17 (Remote Access), CM-7 (Least Functionality), IA-5 (Authenticator Management), and SC-8 (Transmission Confidentiality).' },
          { code: 'PCI-DSS', name: 'PCI-DSS v4.0', controls: '42 Controls', desc: 'Payment Card Industry Data Security Standards for Cardholder Data Environments (CDE). Focuses on perimeter firewalls, DMZ isolation, and SNMPv3 encryption.' },
          { code: 'ISO', name: 'ISO/IEC 27001:2022', controls: '56 Controls', desc: 'Technological controls under Annex A.8 for network segregation, access control management, logging integrity, and capacity management.' },
        ].map((f) => (
          <div key={f.code} style={{ background: '#0D1311', border: '1px solid #232D27', borderRadius: 12, padding: 28 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#FF7417', background: 'rgba(255, 116, 23, 0.1)', padding: '4px 8px', borderRadius: 4 }}>
              {f.code}
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F2F4EA', marginTop: 12, marginBottom: 4 }}>{f.name}</h3>
            <div style={{ fontSize: 12, color: '#25B981', fontWeight: 600, marginBottom: 12 }}>{f.controls}</div>
            <p style={{ fontSize: 13, color: '#AAB2A8', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
}

// 4. Vendors Page
export function VendorsPage() {
  return (
    <PublicPageLayout
      badge="HARDWARE & FIRMWARE"
      title="Multi-Vendor Ecosystem"
      subtitle="Universal security intelligence across multi-vendor enterprise fleets."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {[
          { vendor: 'Cisco Systems', platforms: 'IOS, IOS-XE, NX-OS, ASA', syntax: 'Block line & indented delimiters', example: 'line vty 0 4\n transport input ssh' },
          { vendor: 'Juniper Networks', platforms: 'Junos OS', syntax: 'Hierarchical bracket blocks & set directives', example: 'set system services ssh protocol-version v2' },
          { vendor: 'Fortinet', platforms: 'FortiOS (FortiGate)', syntax: 'Config table entries & edit blocks', example: 'config system admin\n edit "admin"\n set password-policy enable' },
          { vendor: 'Palo Alto Networks', platforms: 'PAN-OS', syntax: 'Hierarchical set deviceconfig & set network commands', example: 'set deviceconfig system service disable-telnet yes' },
        ].map((v) => (
          <div key={v.vendor} style={{ background: '#0D1311', border: '1px solid #232D27', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F2F4EA', marginBottom: 4 }}>{v.vendor}</h3>
            <div style={{ fontSize: 12, color: '#FF7417', fontWeight: 600, marginBottom: 12 }}>{v.platforms}</div>
            <div style={{ fontSize: 12, color: '#8C9390', marginBottom: 14 }}>Syntax: {v.syntax}</div>
            <pre style={{ margin: 0, padding: 12, background: '#080C0A', borderRadius: 6, fontSize: 11, color: '#C5CCC4', fontFamily: "'JetBrains Mono', monospace" }}>
              {v.example}
            </pre>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
}

// 5. Security Page
export function SecurityPage() {
  return (
    <PublicPageLayout
      badge="TRUST & COMPLIANCE"
      title="Security & Non-Repudiation"
      subtitle="How CIPHER-X protects sensitive configuration dumps and guarantees audit integrity."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {[
          { title: 'Zero AI Hallucination Guard', desc: 'Deterministic compliance operators ensure that probabilistic models never decide whether a configuration passes or fails.' },
          { title: 'SHA-256 Non-Repudiable Evidence', desc: 'Every configuration file and audit finding is cryptographically hashed to guarantee tamper-proof audit trails.' },
          { title: 'Air-Gapped & Offline Ready', desc: 'Operates 100% offline with deterministic fallback engines in classified and isolated security network enclaves.' },
          { title: 'Role-Based Access Control (RBAC)', desc: 'Multi-tenant architecture with granular privilege tiers for Security Analysts, Network Architects, and CISOs.' },
        ].map((s) => (
          <div key={s.title} style={{ background: '#0D1311', border: '1px solid #232D27', borderRadius: 12, padding: 24 }}>
            <div style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(37, 185, 129, 0.1)', color: '#25B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Lock size={18} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F2F4EA', marginBottom: 8 }}>{s.title}</h3>
            <p style={{ fontSize: 13, color: '#AAB2A8', lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
}

// 6. About Page
export function AboutPage() {
  return (
    <PublicPageLayout
      badge="MISSION & ARCHITECTURE"
      title="About CIPHER-X"
      subtitle="Universal Security Intelligence for Heterogeneous Networks."
    >
      <div style={{ background: '#0D1311', border: '1px solid #232D27', borderRadius: 12, padding: 36, lineHeight: 1.7, color: '#C5CCC4', maxWidth: 880, margin: '0 auto' }}>
        <p style={{ fontSize: 15, marginBottom: 20 }}>
          Modern enterprise networks span multiple hardware vendors, firmware iterations, and syntax dialects. Auditing these environments typically involves fragile regex scripts or human error that can leave critical attack surfaces exposed.
        </p>
        <p style={{ fontSize: 15, marginBottom: 20 }}>
          <strong>CIPHER-X</strong> was built on a simple conviction: <em>AI is an intelligence layer, but deterministic rules must remain authoritative.</em> By pairing multi-vendor lexical parsers with an active learning AI co-pilot, CIPHER-X gives security teams the certainty of mathematical rules with the agility of machine learning.
        </p>
        <div style={{ borderTop: '1px solid #232D27', paddingTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div><strong style={{ color: '#F2F4EA' }}>Version:</strong> 1.0.0</div>
          <div><strong style={{ color: '#F2F4EA' }}>Architecture:</strong> Hybrid Deterministic + Active Learning AI</div>
          <div><strong style={{ color: '#F2F4EA' }}>License:</strong> Enterprise Open Core</div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
