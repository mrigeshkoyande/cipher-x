import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      addToast('success', `Welcome back, ${username}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cx-dark)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img
            src="/app-logo.png"
            alt="Cipher-X Logo"
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              objectFit: 'contain',
              margin: '0 auto 16px',
              display: 'block',
              boxShadow: '0 0 24px rgba(255, 107, 0, 0.45)',
              border: '2px solid rgba(255, 107, 0, 0.4)'
            }}
          />
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--cx-dark-text)', letterSpacing: '0.05em' }}>CIPHER-X</div>
          <div style={{ fontSize: 13, color: 'var(--cx-dark-muted)', marginTop: 4 }}>AI-Powered Network Security Compliance Auditor</div>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--cx-dark-surface)', border: '1px solid var(--cx-dark-border)',
          borderRadius: 'var(--cx-radius-lg)', padding: 32
        }}>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--cx-dark-text)', marginBottom: 24 }}>Sign In</div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ color: 'var(--cx-dark-muted)' }} htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="form-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
                style={{ background: 'var(--cx-dark-elevated)', color: 'var(--cx-dark-text)', borderColor: 'var(--cx-dark-border)' }}
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" style={{ color: 'var(--cx-dark-muted)' }} htmlFor="password">Password</label>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                style={{ background: 'var(--cx-dark-elevated)', color: 'var(--cx-dark-text)', borderColor: 'var(--cx-dark-border)', paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: 30, background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={15} color="var(--cx-dark-muted)" /> : <Eye size={15} color="var(--cx-dark-muted)" />}
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(224,90,97,0.1)', border: '1px solid var(--cx-fail)', borderRadius: 8, padding: '10px 14px', color: 'var(--cx-fail)', fontSize: 13, marginBottom: 16 }} role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, marginTop: 8 }}
            >
              {loading ? 'Authenticating...' : 'Sign In to CIPHER-X'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--cx-dark-elevated)', borderRadius: 8, fontSize: 12, color: 'var(--cx-dark-muted)' }}>
            <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--cx-dark-text)' }}>Demo Credentials</div>
            <div>Username: <span style={{ color: 'var(--cx-orange)' }}>admin</span> · Password: <span style={{ color: 'var(--cx-orange)' }}>admin123</span></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: 'var(--cx-dark-muted)' }}>
          Understand. Audit. Secure.
        </div>
      </div>
    </div>
  );
}
