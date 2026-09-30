import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, Plus, CheckCircle2, ShieldAlert, 
  ExternalLink, Layers, Printer, RefreshCw, ChevronRight, Lock
} from 'lucide-react';

export default function ReportsView({ onNavigateTab }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportType, setReportType] = useState('ORGANIZATION');
  const [reportTitle, setReportTitle] = useState('Quarterly Network Security Audit Report');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/v1/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        if (data.length > 0) {
          fetchReportDetail(data[0].report_id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportDetail = async (reportId) => {
    try {
      const res = await fetch(`/api/v1/reports/${reportId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedReport(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/v1/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_type: reportType,
          title: reportTitle,
          target_name: "Enterprise Fleet Infrastructure"
        })
      });
      if (res.ok) {
        const newRep = await res.json();
        fetchReports();
        setSelectedReport(newRep);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (!selectedReport) return;
    window.open(`/api/v1/reports/${selectedReport.report_id}/export/csv`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" /> Compliance Reports & Regulatory Attestations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident, cryptographically anchored security reports across CIS, NIST, DISA STIG, and ISO 27001.
          </p>
        </div>

        {/* Generate Report Trigger */}
        <div className="flex items-center gap-2">
          {selectedReport && (
            <button
              onClick={handleExportCSV}
              className="btn-cyber-secondary text-xs"
            >
              <Download className="w-4 h-4" /> Export CSV Ledger
            </button>
          )}
        </div>
      </div>

      {/* Generate New Report Strip */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
          >
            <option value="ORGANIZATION">Organization Fleet Report</option>
            <option value="DEVICE">Per-Device Assessment</option>
            <option value="FRAMEWORK">Framework Regulatory Report</option>
            <option value="AUDIT">Cryptographic Audit Trail Report</option>
            <option value="DRIFT">Configuration Drift Report</option>
            <option value="EXECUTIVE">Executive Summary Report</option>
          </select>

          <input
            type="text"
            placeholder="Report title..."
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 min-w-[220px]"
          />
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="btn-cyber-primary text-xs shrink-0"
        >
          {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Generate & Anchor Report
        </button>
      </div>

      {/* Main Grid: Report List & Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Reports List (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-heading font-semibold text-xs text-slate-300">SAVED REPORTS ({reports.length})</span>
            <button onClick={fetchReports} className="text-slate-400 hover:text-cyan-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {reports.map((rep) => {
              const isSelected = selectedReport?.report_id === rep.report_id;
              return (
                <div
                  key={rep.report_id}
                  onClick={() => fetchReportDetail(rep.report_id)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/30'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 uppercase font-bold">
                      {rep.report_type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {rep.compliance_score}%
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-slate-100 truncate">{rep.title}</h4>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 truncate">
                    SHA-256: {rep.cryptographic_hash?.substring(0, 16)}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Report Document Preview (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 space-y-5">
          {selectedReport ? (
            <div className="space-y-5">
              {/* Report Document Header */}
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase font-bold">
                    {selectedReport.report_type} AUDIT REPORT
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-slate-100 mt-1">{selectedReport.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Target: <strong className="text-slate-200">{selectedReport.target}</strong> | Created: <span className="font-mono">{selectedReport.timestamp_iso}</span>
                  </div>
                </div>

                <div className="font-mono text-right text-xs">
                  <div className="text-2xl font-extrabold text-cyan-400">{selectedReport.compliance_summary?.compliance_score}%</div>
                  <div className="text-[10px] text-slate-400">GRADE {selectedReport.compliance_summary?.grade}</div>
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash & Anchor Badge */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between">
                <div className="truncate pr-2">
                  <span className="text-slate-500">SHA-256 HASH: </span>
                  <span className="text-cyan-300 font-bold">{selectedReport.cryptographic_hash}</span>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-emerald-400 badge-pass px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" /> ANCHORED
                </span>
              </div>

              {/* Executive Summary Section */}
              <div className="space-y-1.5">
                <h4 className="font-heading font-bold text-xs uppercase text-slate-400">1. Executive Summary</h4>
                <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {selectedReport.executive_summary}
                </p>
              </div>

              {/* Findings Summary Table */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-xs uppercase text-slate-400">
                  2. Identified Security Findings ({selectedReport.findings_detail?.length || 0})
                </h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {selectedReport.findings_detail?.map((f) => (
                    <div key={f.control_id} className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{f.control_id}</span>
                        <span className="text-slate-200 truncate max-w-sm">{f.title}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        f.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'
                      }`}>
                        {f.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Appendix & Verification */}
              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Engine: Cipher-X Compliance Core v3.0</span>
                <span>FIPS 180-4 SHA-256 Verifiable</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select or generate a compliance report to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
