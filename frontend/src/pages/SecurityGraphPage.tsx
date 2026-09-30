import React, { useEffect, useState } from 'react';
import { api, SecurityGraph, GraphNode, GraphEdge } from '../api/client';
import { api as apiClient, Device } from '../api/client';
import { SkeletonCard } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

const NODE_COLORS: Record<string, string> = {
  device: 'var(--cx-info)', finding: 'var(--cx-fail)', control: 'var(--cx-warning)',
  framework: 'var(--cx-orange)', configuration: 'var(--cx-pass)',
};

export function SecurityGraphPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [graph, setGraph] = useState<SecurityGraph | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    apiClient.devices.list().then(d => {
      setDevices(d);
    }).finally(() => setInitLoading(false));
  }, []);

  const loadGraph = () => {
    setLoading(true);
    api.graph.get(selectedDevice || undefined).then(g => { setGraph(g); setSelectedNode(null); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (!initLoading) loadGraph(); }, [selectedDevice, initLoading]);

  if (initLoading) return <div className="page"><SkeletonCard /></div>;

  const nodesByType: Record<string, GraphNode[]> = {};
  (graph?.nodes || []).forEach(n => { nodesByType[n.type] = [...(nodesByType[n.type] || []), n]; });

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Security Graph</h1>
          <p className="page-subtitle">Relationships between devices, configurations, findings, and controls</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)}
            style={{ padding: '7px 12px', border: '1px solid var(--cx-border)', borderRadius: 8, background: 'var(--cx-surface-2)', fontSize: 13, color: 'var(--cx-text)', fontFamily: 'Inter' }}
            aria-label="Filter by device">
            <option value="">All Devices</option>
            {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={loadGraph} disabled={loading}>Refresh</button>
        </div>
      </div>

      {loading ? <SkeletonCard /> : !graph ? <EmptyState title="No graph data" description="Upload configurations to generate the security relationship graph." action={{ label: 'Refresh', onClick: loadGraph }} /> : (
        <div className="grid-2" style={{ gap: 16, alignItems: 'start' }}>
          {/* Graph visualization — simplified block layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(nodesByType).map(([type, nodes]) => (
              <div key={type} className="card" style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: NODE_COLORS[type] || 'var(--cx-muted)', display: 'inline-block' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--cx-muted)' }}>{type}s ({nodes.length})</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {nodes.map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        style={{
                          padding: '7px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
                          background: isSelected ? NODE_COLORS[type] || 'var(--cx-border)' : 'var(--cx-surface-2)',
                          border: `1px solid ${isSelected ? NODE_COLORS[type] || 'var(--cx-border)' : 'var(--cx-border)'}`,
                          color: isSelected ? '#fff' : 'var(--cx-text)',
                          fontWeight: isSelected ? 600 : 400,
                          transition: 'all 0.15s',
                        }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                      >
                        {node.label}
                        {node.status && (
                          <span style={{ marginLeft: 6, fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--cx-muted)' }}>
                            {node.status === 'PASS' ? '✓' : node.status === 'FAIL' ? '✕' : '?'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Edges summary */}
            <div className="card" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--cx-muted)', marginBottom: 10 }}>Relationships ({graph.edges.length})</div>
              <div style={{ maxHeight: 200, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {graph.edges.slice(0, 20).map(edge => (
                  <div key={edge.id} style={{ fontSize: 12, color: 'var(--cx-muted)', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--cx-text)' }}>{graph.nodes.find(n => n.id === edge.source)?.label?.slice(0, 20) || edge.source.slice(0,8)}</span>
                    <span>—{edge.label || 'relates'}→</span>
                    <span style={{ color: 'var(--cx-text)' }}>{graph.nodes.find(n => n.id === edge.target)?.label?.slice(0, 20) || edge.target.slice(0,8)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node Detail */}
          <div>
            {selectedNode ? (
              <div className="card-dark" style={{ position: 'sticky', top: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: NODE_COLORS[selectedNode.type] || 'var(--cx-muted)', display: 'inline-block' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--cx-dark-muted)' }}>{selectedNode.type}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--cx-dark-text)', marginBottom: 16 }}>{selectedNode.label}</div>
                {Object.entries(selectedNode.data || {}).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--cx-dark-border)', fontSize: 13 }}>
                    <div style={{ width: 120, color: 'var(--cx-dark-muted)', flexShrink: 0 }}>{k}</div>
                    <div style={{ color: 'var(--cx-dark-text)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, wordBreak: 'break-all' }}>{String(v)}</div>
                  </div>
                ))}
                {graph.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--cx-dark-muted)', marginBottom: 10 }}>Connections</div>
                    {graph.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(e => {
                      const other = e.source === selectedNode.id ? graph.nodes.find(n => n.id === e.target) : graph.nodes.find(n => n.id === e.source);
                      return (
                        <div key={e.id} style={{ fontSize: 12, color: 'var(--cx-dark-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {e.source === selectedNode.id ? '→' : '←'}
                          <span style={{ fontSize: 10, color: 'var(--cx-dark-muted)' }}>{e.label}</span>
                          <span style={{ color: 'var(--cx-dark-text)', cursor: 'pointer' }} onClick={() => setSelectedNode(other || null)}>{other?.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--cx-muted)' }}>
                <div style={{ fontSize: 14 }}>Click a node to view details</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>
                  {graph.nodes.length} nodes · {graph.edges.length} relationships
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
