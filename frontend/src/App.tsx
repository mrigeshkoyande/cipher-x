import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
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

function SettingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Platform configuration and administration</p>
      </div>
      <div className="card" style={{ maxWidth: 600 }}>
        <div style={{ fontSize: 14, color: 'var(--cx-muted)', textAlign: 'center', padding: 24 }}>
          Settings module coming soon in next release.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="/devices/:id" element={<DeviceDetailPage />} />
        <Route path="/configurations" element={<ConfigurationsPage />} />
        <Route path="/configurations/upload" element={<ConfigurationUploadPage />} />
        <Route path="/configurations/:id" element={<ConfigurationDetailPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/findings" element={<FindingsPage />} />
        <Route path="/findings/:id" element={<FindingDetailPage />} />
        <Route path="/remediation" element={<RemediationPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/security-graph" element={<SecurityGraphPage />} />
        <Route path="/query" element={<QueryPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/drift" element={<DriftPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
