import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Activity, ArrowUpRight, Globe } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer
      style={{
        background: '#070C0A',
        borderTop: '1px solid #1E2822',
        color: '#AAB2A8',
        padding: '64px 24px 32px',
        fontSize: 13,
      }}
    >
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img
                src="/app-logo.png"
                alt="CIPHER-X Logo"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  objectFit: 'contain',
                  border: '1px solid rgba(255, 116, 23, 0.4)',
                }}
              />
              <span style={{ fontSize: 18, fontWeight: 800, color: '#F2F4EA', letterSpacing: '0.06em' }}>
                CIPHER-X
              </span>
            </div>
            <p style={{ lineHeight: 1.6, color: '#7E8A7F', marginBottom: 16, fontSize: 13 }}>
              AI-Powered Multi-Vendor Network Security Compliance Auditor. Transforming heterogeneous network configurations into deterministic, evidence-backed security posture intelligence.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#25B981' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#25B981', display: 'inline-block' }} />
              Deterministic Engine Operational (v1.0.0)
            </div>
          </div>

          {/* Product Links */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F2F4EA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Product
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/features" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Platform Overview</Link>
              <Link to="/app/dashboard" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Security Console</Link>
              <Link to="/app/security-graph" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Security Graph</Link>
              <Link to="/app/simulation" style={{ color: '#AAB2A8', textDecoration: 'none' }}>What-If Simulator</Link>
              <Link to="/app/drift" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Configuration Drift</Link>
              <Link to="/app/reports" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Audit Reports</Link>
            </div>
          </div>

          {/* Compliance Frameworks */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F2F4EA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Compliance
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/frameworks" style={{ color: '#AAB2A8', textDecoration: 'none' }}>CIS Benchmarks (Level 1 & 2)</Link>
              <Link to="/frameworks" style={{ color: '#AAB2A8', textDecoration: 'none' }}>NIST SP 800-53 Rev 5</Link>
              <Link to="/frameworks" style={{ color: '#AAB2A8', textDecoration: 'none' }}>PCI-DSS v4.0 Firewalls</Link>
              <Link to="/frameworks" style={{ color: '#AAB2A8', textDecoration: 'none' }}>ISO/IEC 27001:2022</Link>
              <Link to="/app/integrity" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Evidence Integrity (SHA-256)</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F2F4EA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Resources
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/how-it-works" style={{ color: '#AAB2A8', textDecoration: 'none' }}>How It Works</Link>
              <Link to="/security" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Security Architecture</Link>
              <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer" style={{ color: '#AAB2A8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Interactive API Docs <ExternalLink size={12} />
              </a>
              <Link to="/app/system-health" style={{ color: '#AAB2A8', textDecoration: 'none' }}>System Health</Link>
              <Link to="/app/training" style={{ color: '#AAB2A8', textDecoration: 'none' }}>AI Training Studio</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F2F4EA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Company
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/about" style={{ color: '#AAB2A8', textDecoration: 'none' }}>About CIPHER-X</Link>
              <Link to="/vendors" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Supported Vendors</Link>
              <a href="https://github.com/mrigeshkoyande/cipher-x" target="_blank" rel="noopener noreferrer" style={{ color: '#AAB2A8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                GitHub Repository <ExternalLink size={12} />
              </a>
              <Link to="/login" style={{ color: '#AAB2A8', textDecoration: 'none' }}>Security Login</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: 24,
            borderTop: '1px solid #19231D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            color: '#687369',
            fontSize: 12,
          }}
        >
          <div>
            <span style={{ fontWeight: 600, color: '#AAB2A8' }}>CIPHER-X</span> — Understand. Audit. Secure.
            <span style={{ margin: '0 8px' }}>•</span>
            © {new Date().getFullYear()} CIPHER-X Development Team. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>SOC2 Type II Ready</span>
            <span>Zero AI Hallucination Guard</span>
            <span>Non-Repudiable Evidence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
