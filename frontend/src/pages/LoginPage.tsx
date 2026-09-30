import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Lock, ArrowRight, Server, Network, CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      addToast('success', `Welcome to CIPHER-X, ${username}`);
      navigate('/app/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Use admin / admin123');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setUsername('admin');
    setPassword('admin123');
    setLoading(true);
    try {
      await login('admin', 'admin123');
      addToast('success', 'Logged in as Enterprise Admin (Demo Session)');
      navigate('/app/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050914',
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 480px)',
        color: '#F2F4EA',
      }}
      className="login-container"
    >
      {/* Left Column: Visual Showcase & Brand */}
      <div
        style={{
          background: 'radial-gradient(ellipse 90% 70% at 20% 40%, rgba(255, 116, 23, 0.15) 0%, rgba(5, 9, 20, 0.95) 100%)',
          borderRight: '1px solid #1E2822',
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        className="login-left-pane"
      >
        {/* Brand Header */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img
            src="/app-logo.png"
            alt="CIPHER-X Logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: '1px solid rgba(255, 116, 23, 0.4)',
              boxShadow: '0 0 16px rgba(255, 116, 23, 0.3)',
            }}
          />
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#F2F4EA', letterSpacing: '0.06em' }}>CIPHER-X</div>
            <div style={{ fontSize: 11, color: '#AAB2A8' }}>Security Intelligence Platform</div>
          </div>
        </Link>

        {/* Center Presentation */}
        <div style={{ maxWidth: 540, margin: '40px 0' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 116, 23, 0.1)',
              border: '1px solid rgba(255, 116, 23, 0.3)',
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              color: '#FF7417',
              marginBottom: 20,
            }}
          >
            <Lock size={12} />
            RESTRICTED ENTERPRISE CONSOLE
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#F2F4EA', lineHeight: 1.2, marginBottom: 16 }}>
            Security intelligence for modern networks.
          </h2>
          <p style={{ fontSize: 15, color: '#AAB2A8', lineHeight: 1.6, marginBottom: 32 }}>
            Deterministic compliance auditing, active learning grammar parsers, and predictive what-if security simulations across multi-vendor fleets.
          </p>

          {/* Feature Bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              'Deterministic CIS & NIST Controls Evaluation',
              'Non-Repudiable Cryptographic Evidence Tracing',
              'Multi-Vendor AST Parsers (Cisco, Junos, FortiOS, PAN-OS)',
            ].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#C5CCC4' }}>
                <CheckCircle2 size={16} color="#25B981" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Meta */}
        <div style={{ fontSize: 12, color: '#687369' }}>
          © {new Date().getFullYear()} CIPHER-X Security Systems. All sessions encrypted.
        </div>
      </div>

      {/* Right Column: Authentication Card */}
      <div
        style={{
          background: '#090E17',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: 380, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F2F4EA', marginBottom: 6 }}>Sign In</h1>
            <p style={{ fontSize: 13, color: '#AAB2A8' }}>Access your CIPHER-X security tenant console</p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(224, 90, 97, 0.1)',
                border: '1px solid #E05A61',
                borderRadius: 6,
                padding: '10px 14px',
                fontSize: 12,
                color: '#E05A61',
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#AAB2A8', marginBottom: 6 }} htmlFor="username">
                Username / Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                style={{
                  width: '100%',
                  background: '#121A16',
                  border: '1px solid #303833',
                  borderRadius: 6,
                  padding: '10px 14px',
                  color: '#F2F4EA',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#AAB2A8' }} htmlFor="password">
                  Password
                </label>
                <a href="#forgot" style={{ fontSize: 11, color: '#FF7417', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert('Default demo credentials: admin / admin123'); }}>
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  background: '#121A16',
                  border: '1px solid #303833',
                  borderRadius: 6,
                  padding: '10px 14px',
                  paddingRight: 40,
                  color: '#F2F4EA',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 31,
                  background: 'none',
                  border: 'none',
                  color: '#8C9390',
                  cursor: 'pointer',
                }}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#AAB2A8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#FF7417' }}
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: 14,
                fontWeight: 700,
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(255, 116, 23, 0.35)',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              style={{
                width: '100%',
                background: 'rgba(37, 185, 129, 0.1)',
                border: '1px solid #25B981',
                borderRadius: 6,
                padding: '10px',
                color: '#25B981',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Zap size={14} /> Quick Demo Login (admin / admin123)
            </button>
          </form>

          <div style={{ margin: '24px 0', borderTop: '1px solid #1E2822', position: 'relative', textAlign: 'center' }}>
            <span style={{ position: 'relative', top: -10, background: '#090E17', padding: '0 10px', fontSize: 11, color: '#687369' }}>
              OR ENTERPRISE SSO
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleDemoLogin()}
            style={{
              width: '100%',
              background: '#121A16',
              border: '1px solid #303833',
              borderRadius: 6,
              padding: '10px',
              color: '#F2F4EA',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 20,
            }}
          >
            Continue with Okta / SAML 2.0
          </button>

          <div style={{ textAlign: 'center', fontSize: 13, color: '#AAB2A8' }}>
            Don't have an enterprise account?{' '}
            <Link to="/register" style={{ color: '#FF7417', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .login-container { grid-template-columns: 1fr !important; }
          .login-left-pane { display: none !important; }
        }
      `}</style>
    </div>
  );
}
