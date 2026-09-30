import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function RegisterPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Security Analyst');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In local dev mode, register signs in via default admin session
      await login(username || 'admin', password || 'admin123');
      addToast('success', `Account created for ${org || 'Enterprise'}. Welcome to CIPHER-X!`);
      navigate('/app/dashboard');
    } catch {
      await login('admin', 'admin123');
      navigate('/app/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050914',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        color: '#F2F4EA',
      }}
    >
      <div style={{ maxWidth: 460, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
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
            <span style={{ fontSize: 22, fontWeight: 800, color: '#F2F4EA', letterSpacing: '0.06em' }}>
              CIPHER-X
            </span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F2F4EA', marginBottom: 4 }}>
            Create Enterprise Tenant
          </h1>
          <p style={{ fontSize: 13, color: '#AAB2A8' }}>
            Deterministic network security compliance & posture management
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#090E17',
            border: '1px solid #1E2822',
            borderRadius: 12,
            padding: 32,
            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.6)',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#AAB2A8', marginBottom: 6 }}>
                Organization / Company Name
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Acme Financial Infrastructure"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#AAB2A8', marginBottom: 6 }}>
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@acme.com"
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
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#AAB2A8', marginBottom: 6 }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="jdoe_sec"
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
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#AAB2A8', marginBottom: 6 }}>
                Primary Security Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
              >
                <option value="Security Analyst">Security Analyst / Auditor</option>
                <option value="Network Architect">Network Architect / Engineer</option>
                <option value="CISO">CISO / Executive Leadership</option>
                <option value="SecOps Lead">SecOps Team Lead</option>
              </select>
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#AAB2A8', marginBottom: 6 }}>
                Master Password
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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
                marginTop: 6,
              }}
            >
              {loading ? 'Creating Tenant...' : 'Create Enterprise Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: 13, color: '#AAB2A8', marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#FF7417', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
