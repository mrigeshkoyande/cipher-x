import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Server, AlertTriangle, ShieldCheck, FileText, X, ArrowRight } from 'lucide-react';
import { api, Device, Finding } from '../../api/client';

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [d, f] = await Promise.all([
        api.devices.list().catch(() => []),
        api.findings.list().catch(() => []),
      ]);
      setDevices(d || []);
      setFindings(f || []);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredDevices = devices.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.vendor.toLowerCase().includes(query.toLowerCase()) ||
    d.platform.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFindings = findings.filter(f =>
    f.title.toLowerCase().includes(query.toLowerCase()) ||
    f.control_id.toLowerCase().includes(query.toLowerCase()) ||
    f.severity.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 9, 20, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        paddingLeft: 16,
        paddingRight: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          background: '#0D1311',
          border: '1px solid #303833',
          borderRadius: 12,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #232D27' }}>
          <Search size={18} color="#FF7417" />
          <input
            autoFocus
            type="text"
            placeholder="Search across devices, findings, frameworks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#F2F4EA', fontSize: 14 }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8C9390', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: 420, overflowY: 'auto', padding: 16 }}>
          {query.trim() === '' ? (
            <div style={{ color: '#8C9390', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>
              Type at least one character to search monitored inventory and findings
            </div>
          ) : (
            <>
              {/* Devices Section */}
              {filteredDevices.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#AAB2A8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Matching Devices ({filteredDevices.length})
                  </div>
                  {filteredDevices.slice(0, 4).map(d => (
                    <div
                      key={d.id}
                      onClick={() => { onClose(); navigate(`/app/devices/${d.id}`); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', borderRadius: 6, background: '#121A15', marginBottom: 6, cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Server size={15} color="#FF7417" />
                        <div>
                          <strong style={{ color: '#F2F4EA', fontSize: 13 }}>{d.name}</strong>
                          <span style={{ fontSize: 11, color: '#8C9390', marginLeft: 8 }}>{d.vendor} {d.platform}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: '#25B981', fontWeight: 600 }}>Score: {d.compliance_score}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Findings Section */}
              {filteredFindings.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#AAB2A8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    Matching Findings ({filteredFindings.length})
                  </div>
                  {filteredFindings.slice(0, 4).map(f => (
                    <div
                      key={f.id}
                      onClick={() => { onClose(); navigate(`/app/findings/${f.id}`); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', borderRadius: 6, background: '#121A15', marginBottom: 6, cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AlertTriangle size={15} color={f.severity === 'CRITICAL' ? '#E05A61' : '#FF7417'} />
                        <div>
                          <strong style={{ color: '#F2F4EA', fontSize: 13 }}>{f.title}</strong>
                          <span style={{ fontSize: 11, color: '#8C9390', marginLeft: 8 }}>{f.control_id}</span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: f.severity === 'CRITICAL' ? '#E05A6122' : '#FF741722',
                        color: f.severity === 'CRITICAL' ? '#E05A61' : '#FF7417'
                      }}>
                        {f.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {filteredDevices.length === 0 && filteredFindings.length === 0 && (
                <div style={{ color: '#8C9390', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>
                  No matching assets found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
