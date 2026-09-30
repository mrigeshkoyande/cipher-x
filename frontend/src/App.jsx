import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './views/DashboardView';
import ComplianceView from './views/ComplianceView';
import DevicesView from './views/DevicesView';
import DriftView from './views/DriftView';
import SecurityGraphView from './views/SecurityGraphView';
import WhatIfView from './views/WhatIfView';
import RemediationView from './views/RemediationView';
import EvidenceView from './views/EvidenceView';
import AssistantView from './views/AssistantView';
import AuditBlockchainView from './views/AuditBlockchainView';
import ReportsView from './views/ReportsView';
import HealthView from './views/HealthView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedControlId, setSelectedControlId] = useState(null);
  const [targetVendor, setTargetVendor] = useState('cisco');

  const handleNavigateDevice = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setActiveTab('devices');
  };

  const handleNavigateControl = (controlId) => {
    setSelectedControlId(controlId);
    setActiveTab('compliance');
  };

  const handleNavigateRemediation = (vendor, controlId) => {
    setTargetVendor(vendor);
    setSelectedControlId(controlId);
    setActiveTab('remediation');
  };

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Bar */}
        <Topbar activeTab={activeTab} />

        {/* Page Content */}
        <div className="page-content">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateDevice={handleNavigateDevice}
              onNavigateControl={handleNavigateControl}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceView
              selectedControlId={selectedControlId}
              onSelectControl={setSelectedControlId}
              onNavigateRemediation={handleNavigateRemediation}
            />
          )}

          {activeTab === 'devices' && (
            <DevicesView
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={setSelectedDeviceId}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'drift' && (
            <DriftView selectedDeviceId={selectedDeviceId} />
          )}

          {activeTab === 'graph' && (
            <SecurityGraphView
              selectedDeviceId={selectedDeviceId}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'whatif' && (
            <WhatIfView
              selectedDeviceId={selectedDeviceId}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'remediation' && (
            <RemediationView
              targetVendor={targetVendor}
              targetControlId={selectedControlId || 'CTRL-TELNET-01'}
            />
          )}

          {activeTab === 'evidence' && (
            <EvidenceView
              targetDeviceId={selectedDeviceId}
              targetControlId={selectedControlId}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantView onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'audit' && (
            <AuditBlockchainView />
          )}

          {activeTab === 'reports' && (
            <ReportsView onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'health' && (
            <HealthView />
          )}

          {/* Placeholder views for new nav items */}
          {activeTab === 'frameworks' && (
            <div className="page-header">
              <div className="page-header-badge">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>gavel</span>
                GOVERNANCE
              </div>
              <h1>Frameworks & Rules Management</h1>
              <p>Manage compliance frameworks, custom control policies, and vendor-specific rule sets across your security posture baseline.</p>
              <div className="stat-cards" style={{ marginTop: '1.5rem' }}>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Active Frameworks</span>
                    <div className="stat-card-icon"><span className="material-symbols-outlined">library_books</span></div>
                  </div>
                  <div className="stat-card-value primary">5</div>
                  <div className="stat-card-sub">CIS, NIST, DISA STIG, ISO 27001, Custom</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Total Controls</span>
                    <div className="stat-card-icon"><span className="material-symbols-outlined">rule</span></div>
                  </div>
                  <div className="stat-card-value">274</div>
                  <div className="stat-card-sub">Across all active frameworks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Custom Policies</span>
                    <div className="stat-card-icon"><span className="material-symbols-outlined">edit_note</span></div>
                  </div>
                  <div className="stat-card-value">12</div>
                  <div className="stat-card-sub">Enterprise zero-trust policies</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Last Evaluation</span>
                    <div className="stat-card-icon"><span className="material-symbols-outlined">schedule</span></div>
                  </div>
                  <div className="stat-card-value success">0.42s</div>
                  <div className="stat-card-sub">Deterministic execution time</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mappings' && (
            <div className="page-header">
              <div className="page-header-badge">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>hub</span>
                REUSABLE KNOWLEDGE
              </div>
              <h1>Mapping Library</h1>
              <p>Reusable learned semantic mappings catalog. Converts heterogeneous multi-vendor CLI syntaxes into normalized vendor-neutral security facts.</p>
              <div className="stat-cards" style={{ marginTop: '1.5rem' }}>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Total Learned Mappings</span>
                    <div className="stat-card-icon"><span className="material-symbols-outlined">diamond</span></div>
                  </div>
                  <div className="stat-card-value primary">482</div>
                  <div className="stat-card-sub"><span className="dot green"></span>312 Human <span className="dot blue"></span>142 AI</div>
                  <div className="stat-card-footer">28 Default</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Schema Coverage</span>
                    <div className="stat-card-icon"><span className="material-symbols-outlined">check_box</span></div>
                  </div>
                  <div className="stat-card-value success">96.4%</div>
                  <div className="stat-card-sub">Across 8 Supported Network OS</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-header">
                    <span className="stat-card-label">Ingestion Reprocessing</span>
                    <div className="stat-card-icon"><span className="material-symbols-outlined">sync</span></div>
                  </div>
                  <div className="stat-card-value">0</div>
                  <div className="stat-card-sub">All telemetry synchronized</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="page-header">
              <h1>Help & Documentation</h1>
              <p>Access platform documentation, API reference, compliance guides, and support resources for Cipher-X.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="page-header">
              <h1>Settings</h1>
              <p>Configure platform preferences, API integrations, and user management.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <span>CIPHER-X AI AUDIT ENGINE v4.8.2-PROD</span>
          <span className="app-footer-highlight">Cryptographic State Proof: 0x9e88…ec12</span>
          <span>Institutional Security Baseline: NIST 800-53 Rev 5 & CIS Benchmark Level 2</span>
        </footer>
      </div>
    </div>
  );
}
