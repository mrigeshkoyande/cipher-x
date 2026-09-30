import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../contexts/AuthContext';

export function AppShell() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--cx-dark)', flexDirection: 'column', gap: 16
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--cx-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>CX</span>
        </div>
        <div style={{ color: 'var(--cx-dark-muted)', fontSize: 13 }}>Loading CIPHER-X...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Topbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main" id="main-content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
