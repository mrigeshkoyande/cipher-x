import React, { useState, useEffect } from 'react';
import { 
  Network, Server, FileCode, CheckCircle2, 
  AlertTriangle, Flame, Terminal, Filter, RefreshCw, ZoomIn, Info
} from 'lucide-react';

export default function SecurityGraphView({ selectedDeviceId, onNavigateTab }) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [queryFilter, setQueryFilter] = useState('ALL');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraph();
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch('/api/v1/devices');
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchGraph = async (deviceId = null) => {
    setLoading(true);
    try {
      const url = deviceId ? `/api/v1/graph/device/${deviceId}` : '/api/v1/graph/full';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setGraphData(data);
        if (data.nodes.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceFilterChange = (deviceId) => {
    if (deviceId === 'ALL') {
      fetchGraph(null);
    } else {
      fetchGraph(deviceId);
    }
  };

  const getNodeColor = (type, node) => {
    switch (type) {
      case 'Device': return 'from-cyan-500 to-blue-600 border-cyan-400 text-cyan-200';
      case 'Configuration': return 'from-indigo-600 to-purple-600 border-indigo-400 text-indigo-200';
      case 'Fact': return 'from-slate-700 to-slate-800 border-slate-600 text-slate-300';
      case 'Control': return 'from-amber-600 to-orange-600 border-amber-400 text-amber-200';
      case 'Finding': return 'from-red-600 to-rose-700 border-red-400 text-red-200';
      case 'Risk': return 'from-rose-700 to-pink-700 border-rose-400 text-rose-200';
      case 'Remediation': return 'from-emerald-600 to-teal-700 border-emerald-400 text-emerald-200';
      default: return 'from-slate-800 to-slate-900 border-slate-700 text-slate-300';
    }
  };

  const filteredNodes = queryFilter === 'ALL' 
    ? graphData.nodes 
    : graphData.nodes.filter(n => n.type === queryFilter);

  return (
    <div className="space-y-6">
      {/* Header & Graph Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
            <Network className="w-6 h-6 text-cyan-400" /> Security Knowledge & Relationship Graph
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Device ➔ Configuration ➔ Fact ➔ Control ➔ Finding ➔ Risk ➔ Remediation graph ontology.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Device Filter */}
          <select
            onChange={(e) => handleDeviceFilterChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Enterprise Graph</option>
            {devices.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Node Type Filter */}
          <select
            value={queryFilter}
            onChange={(e) => setQueryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Node Types ({graphData.nodes.length})</option>
            <option value="Device">Devices</option>
            <option value="Configuration">Configurations</option>
            <option value="Fact">Facts</option>
            <option value="Control">Controls</option>
            <option value="Finding">Findings</option>
            <option value="Risk">Risks</option>
            <option value="Remediation">Remediations</option>
          </select>
        </div>
      </div>

      {/* Main Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Graph Topology Canvas (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-5 min-h-[550px] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="font-mono">Nodes: <strong className="text-cyan-400">{filteredNodes.length}</strong></span>
              <span className="font-mono">Edges: <strong className="text-blue-400">{graphData.edges.length}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> Device
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block ml-2"></span> Control
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block ml-2"></span> Finding
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block ml-2"></span> Fix
            </div>
          </div>

          {/* Node Grid Layout */}
          <div className="my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[440px] overflow-y-auto p-2">
            {filteredNodes.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              const colorClass = getNodeColor(n.type, n);
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className={`p-3 rounded-xl border bg-gradient-to-br cursor-pointer transition transform hover:-translate-y-1 ${colorClass} ${
                    isSelected ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/30' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="text-[9px] font-mono uppercase font-bold tracking-wider opacity-80 mb-1">
                    {n.type}
                  </div>
                  <div className="font-heading font-bold text-xs line-clamp-2 text-white">
                    {n.label || n.title || n.id}
                  </div>
                  {n.severity && (
                    <div className="mt-2 text-[9px] font-mono font-bold uppercase">
                      {n.severity}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Relationship Query Shortcuts */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">Relationship Queries:</span>
            <button 
              onClick={() => handleDeviceFilterChange('dev-cisco-core-01')}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 hover:border-cyan-400 text-[11px]"
            >
              Show everything affected by Cisco Core
            </button>
            <button 
              onClick={() => setQueryFilter('Finding')}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-red-300 hover:border-red-400 text-[11px]"
            >
              Show all active findings
            </button>
          </div>
        </div>

        {/* Right: Selected Node Properties & Impact Path (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-5 space-y-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 uppercase font-bold">
                    {selectedNode.type} NODE
                  </span>
                  <span className="font-mono text-xs text-slate-500">{selectedNode.id}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-100">{selectedNode.label || selectedNode.id}</h3>
              </div>

              {/* Node Attributes */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono text-slate-400 uppercase font-semibold">Node Attributes</h5>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-2">
                  {Object.entries(selectedNode).map(([k, v]) => {
                    if (k === 'id' || k === 'label') return null;
                    return (
                      <div key={k} className="flex justify-between items-center text-slate-300 border-b border-slate-900 pb-1">
                        <span className="text-slate-500">{k}:</span>
                        <strong className="text-cyan-300 text-right max-w-[180px] truncate">{String(v)}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connected Edges */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono text-slate-400 uppercase font-semibold">Connected Relationships</h5>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {graphData.edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800 text-[11px] font-mono flex items-center justify-between">
                        <span className="text-slate-400">{edge.source === selectedNode.id ? '➔ TARGET' : '⬅ SOURCE'}</span>
                        <span className="text-cyan-400 font-bold">{edge.relation}</span>
                        <span className="text-slate-300 truncate max-w-[100px]">{edge.source === selectedNode.id ? edge.target : edge.source}</span>
                      </div>
                    ))}
                </div>
              </div>

              {selectedNode.type === 'Finding' && (
                <button
                  onClick={() => onNavigateTab && onNavigateTab('remediation')}
                  className="btn-cyber-primary w-full justify-center text-xs"
                >
                  View Remediation Playbook
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select any graph node to inspect ontology relationships
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
