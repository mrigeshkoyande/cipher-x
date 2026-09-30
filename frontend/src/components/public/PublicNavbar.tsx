import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, Lock, Terminal, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Platform', to: '/features' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Compliance', to: '/frameworks' },
    { label: 'Vendors', to: '/vendors' },
    { label: 'Security', to: '/security' },
    { label: 'About', to: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(10, 16, 32, 0.88)'
          : 'rgba(5, 9, 20, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(48, 56, 51, 0.6)'
          : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '0 24px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Left: Brand Identity */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src="/app-logo.png"
            alt="CIPHER-X Logo"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              objectFit: 'contain',
              border: '1px solid rgba(255, 116, 23, 0.45)',
              boxShadow: '0 0 16px rgba(255, 116, 23, 0.35)',
            }}
          />
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#F2F4EA',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              CIPHER-X
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  background: 'rgba(255, 116, 23, 0.15)',
                  color: '#FF7417',
                  border: '1px solid rgba(255, 116, 23, 0.3)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                }}
              >
                v1.0
              </span>
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: '#AAB2A8',
                letterSpacing: '0.04em',
                marginTop: -1,
              }}
            >
              Network Security Auditor
            </div>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 6,
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#FF7417' : '#AAB2A8',
                  textDecoration: 'none',
                  borderRadius: 6,
                  transition: 'all 0.15s ease',
                  background: active ? 'rgba(255, 116, 23, 0.08)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#F2F4EA';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#AAB2A8';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <Link
              to="/app/dashboard"
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Open Console
              <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#AAB2A8',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '8px 14px',
                  borderRadius: 6,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F2F4EA')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#AAB2A8')}
              >
                Sign In
              </Link>
              <Link
                to="/app/dashboard"
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 0 16px rgba(255, 116, 23, 0.35)',
                }}
              >
                Launch CIPHER-X
                <ArrowRight size={14} />
              </Link>
            </>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'flex',
              background: 'transparent',
              border: '1px solid rgba(48, 56, 51, 0.8)',
              color: '#F2F4EA',
              padding: 8,
              borderRadius: 6,
              cursor: 'pointer',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            background: '#0D1311',
            borderBottom: '1px solid rgba(48, 56, 51, 0.8)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
          className="mobile-drawer"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '10px 14px',
                fontSize: 14,
                fontWeight: 500,
                color: isActive(link.to) ? '#FF7417' : '#F2F4EA',
                textDecoration: 'none',
                borderRadius: 6,
                background: isActive(link.to) ? 'rgba(255, 116, 23, 0.1)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ paddingTop: 12, borderTop: '1px solid rgba(48, 56, 51, 0.5)', display: 'flex', gap: 12 }}>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 500,
                color: '#F2F4EA',
                border: '1px solid #303833',
                borderRadius: 6,
                textDecoration: 'none',
              }}
            >
              Sign In
            </Link>
            <Link
              to="/app/dashboard"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary"
              style={{
                flex: 1,
                textAlign: 'center',
                justifyContent: 'center',
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Launch Platform
            </Link>
          </div>
        </div>
      )}

      {/* Inline styles for desktop/mobile visibility */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  );
}
