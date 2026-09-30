import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
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
  const [unreadCount, setUnreadCount] = useState(2);
  const [healthStatus, setHealthStatus] = useState({ status: 'READY' });
  
  // Navigation parameters between views
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedControlId, setSelectedControlId] = useState(null);
  const [targetVendor, setTargetVendor] = useState('cisco');

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        healthStatus={healthStatus}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Cipher-X Cybersecurity & Compliance Engine v3.0</span>
          <span className="text-cyan-400/80">FIPS 180-4 SHA-256 Provenance & Blockchain Anchor Active</span>
          <span>Zero-Trust Enterprise Architecture</span>
        </div>
      </footer>
    </div>
  );
}
