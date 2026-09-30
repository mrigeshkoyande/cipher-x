import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LaunchSplashScreen } from './components/common/LaunchSplashScreen';
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage, HowItWorksPage, FrameworksPage, VendorsPage, SecurityPage, AboutPage } from './pages/PublicSubPages';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceDetailPage } from './pages/DeviceDetailPage';
import { ConfigurationsPage } from './pages/ConfigurationsPage';
import { ConfigurationUploadPage } from './pages/ConfigurationUploadPage';
import { ConfigurationDetailPage } from './pages/ConfigurationDetailPage';
import { CompliancePage } from './pages/CompliancePage';
import { FindingsPage } from './pages/FindingsPage';
import { FindingDetailPage } from './pages/FindingDetailPage';
import { RemediationPage } from './pages/RemediationPage';
import { TrainingPage } from './pages/TrainingPage';
import { ReportsPage } from './pages/ReportsPage';
import { DriftPage } from './pages/DriftPage';
import { QueryPage } from './pages/QueryPage';
import { SimulationPage } from './pages/SimulationPage';
import { SecurityGraphPage } from './pages/SecurityGraphPage';
import { AuditPage } from './pages/AuditPage';
import { IntegrityPage } from './pages/IntegrityPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { useAuth } from './contexts/AuthContext';

function SettingsPage() {
  return (
    <div className="page" style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ fontSize: 24, fontWeight: 700, color: 'var(--cx-text)' }}>Platform Settings</h1>
        <p className="page-subtitle" style={{ fontSize: 13, color: 'var(--cx-muted)' }}>Tenant configuration, compliance thresholds, and integration keys</p>
      </div>
      <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--cx-text)', marginBottom: 6 }}>Tenant Name</label>
          <input type="text" className="form-input" defaultValue="Enterprise Production Cluster (Default)" readOnly style={{ width: '100%', maxWidth: 440 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--cx-text)', marginBottom: 6 }}>Authoritative Framework Mode</label>
          <input type="text" className="form-input" defaultValue="CIS Benchmarks Level 1 & 2 (Authoritative Deterministic)" readOnly style={{ width: '100%', maxWidth: 440 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--cx-text)', marginBottom: 6 }}>AI Provider Integration</label>
          <input type="text" className="form-input" defaultValue="Google Gemini API / Hybrid Deterministic Fallback" readOnly style={{ width: '100%', maxWidth: 440 }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleReplay = () => setShowSplash(true);
    window.addEventListener('cipherx:replay-intro', handleReplay);
    return () => window.removeEventListener('cipherx:replay-intro', handleReplay);
  }, []);

  // Show 8s splash on explicit replay or initial home visit if not previously seen
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('cx_has_seen_splash');
    if (!hasSeenSplash && location.pathname === '/') {
      setShowSplash(true);
      sessionStorage.setItem('cx_has_seen_splash', 'true');
    }
  }, [location.pathname]);

  return (
    <>
      {showSplash && (
        <LaunchSplashScreen
          durationSeconds={8}
          onComplete={() => setShowSplash(false)}
        />
      )}

      <Routes>
        {/* PUBLIC EXPERIENCE */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/frameworks" element={<FrameworksPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* AUTHENTICATED APPLICATION CONSOLE */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="devices/:id" element={<DeviceDetailPage />} />
          <Route path="configurations" element={<ConfigurationsPage />} />
          <Route path="configurations/upload" element={<ConfigurationUploadPage />} />
          <Route path="configurations/:id" element={<ConfigurationDetailPage />} />
          <Route path="compliance" element={<CompliancePage />} />
          <Route path="compliance/:framework" element={<CompliancePage />} />
          <Route path="findings" element={<FindingsPage />} />
          <Route path="findings/:id" element={<FindingDetailPage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="query" element={<QueryPage />} />
          <Route path="simulation" element={<SimulationPage />} />
          <Route path="drift" element={<DriftPage />} />
          <Route path="security-graph" element={<SecurityGraphPage />} />
          <Route path="remediation" element={<RemediationPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/:id" element={<ReportsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="integrity" element={<IntegrityPage />} />
          <Route path="system-health" element={<SystemHealthPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* BACKWARD COMPATIBILITY REDIRECTS */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/devices" element={<Navigate to="/app/devices" replace />} />
        <Route path="/devices/:id" element={<Navigate to="/app/devices/:id" replace />} />
        <Route path="/configurations" element={<Navigate to="/app/configurations" replace />} />
        <Route path="/configurations/upload" element={<Navigate to="/app/configurations/upload" replace />} />
        <Route path="/configurations/:id" element={<Navigate to="/app/configurations/:id" replace />} />
        <Route path="/compliance" element={<Navigate to="/app/compliance" replace />} />
        <Route path="/findings" element={<Navigate to="/app/findings" replace />} />
        <Route path="/findings/:id" element={<Navigate to="/app/findings/:id" replace />} />
        <Route path="/training" element={<Navigate to="/app/training" replace />} />
        <Route path="/security-graph" element={<Navigate to="/app/security-graph" replace />} />
        <Route path="/query" element={<Navigate to="/app/query" replace />} />
        <Route path="/simulation" element={<Navigate to="/app/simulation" replace />} />
        <Route path="/drift" element={<Navigate to="/app/drift" replace />} />
        <Route path="/remediation" element={<Navigate to="/app/remediation" replace />} />
        <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
        <Route path="/audit" element={<Navigate to="/app/audit" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
