import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { api, Configuration } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { StatusBadge } from '../components/common/StatusBadge';

interface FileItem {
  file: File;
  id: string;
  status: 'ready' | 'uploading' | 'done' | 'error';
  result?: Configuration;
  error?: string;
}

export function ConfigurationUploadPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [deviceName, setDeviceName] = useState('');
  const [uploading, setUploading] = useState(false);

  const addFiles = (newFiles: File[]) => {
    const valid = newFiles.filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ['txt', 'cfg', 'conf', 'json', 'set'].includes(ext || '');
    });
    if (valid.length < newFiles.length) addToast('warning', 'Some files were skipped (unsupported format)');
    setFiles(prev => [...prev, ...valid.map(f => ({
      file: f, id: Math.random().toString(36).slice(2), status: 'ready' as const
    }))]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, []);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const uploadAll = async () => {
    const pending = files.filter(f => f.status === 'ready');
    if (pending.length === 0) return;
    setUploading(true);

    for (const item of pending) {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading' } : f));
      try {
        const result = await api.configurations.upload(item.file, deviceName || undefined);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'done', result } : f));
        addToast('success', `${item.file.name} uploaded and analyzed`);
      } catch (err) {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', error: (err as Error).message } : f));
        addToast('error', `Failed to upload ${item.file.name}`);
      }
    }
    setUploading(false);
  };

  const allDone = files.length > 0 && files.every(f => f.status === 'done');
  const hasDoneFiles = files.some(f => f.status === 'done');

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="page" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Upload Configuration</h1>
        <p className="page-subtitle">Analyze network device configurations with CIPHER-X</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`dropzone${dragOver ? ' active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        role="button"
        tabIndex={0}
        aria-label="Drop zone: Click or drag files to upload"
        onKeyDown={e => e.key === 'Enter' && document.getElementById('file-input')?.click()}
        style={{ cursor: 'pointer', marginBottom: 24 }}
      >
        <Upload size={32} color={dragOver ? 'var(--cx-orange)' : 'var(--cx-muted)'} style={{ margin: '0 auto 16px' }} />
        <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--cx-text)', marginBottom: 8 }}>
          Drag & drop configuration files here
        </div>
        <div style={{ fontSize: 13, color: 'var(--cx-muted)', marginBottom: 16 }}>
          or <span style={{ color: 'var(--cx-orange)', fontWeight: 600 }}>browse files</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['.txt', '.cfg', '.conf', '.json', '.set'].map(ext => (
            <span key={ext} style={{ padding: '3px 8px', background: 'var(--cx-surface-2)', borderRadius: 4, fontSize: 12, color: 'var(--cx-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{ext}</span>
          ))}
        </div>
        <input id="file-input" type="file" multiple accept=".txt,.cfg,.conf,.json,.set" style={{ display: 'none' }} onChange={handleFilePick} />
      </div>

      {/* Feature Info */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Max File Size', value: '10 MB' },
          { label: 'SHA-256 Hash', value: 'Auto-generated' },
          { label: 'Vendor Detection', value: 'Automatic' },
          { label: 'Storage', value: 'Immutable' },
        ].map(item => (
          <div key={item.label} className="card" style={{ textAlign: 'center', padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--cx-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cx-text)' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Device Name Override */}
      {files.length > 0 && files.some(f => f.status === 'ready') && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="device-name">Device Name (optional)</label>
            <input id="device-name" type="text" className="form-input" value={deviceName}
              onChange={e => setDeviceName(e.target.value)} placeholder="e.g. CORE-SW-01 (auto-detected if blank)" />
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="card" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--cx-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{files.length} file{files.length > 1 ? 's' : ''} selected</span>
            {!uploading && files.some(f => f.status === 'ready') && (
              <button className="btn btn-primary btn-sm" onClick={uploadAll}>
                <Upload size={13} /> Analyze {files.filter(f => f.status === 'ready').length} file{files.filter(f => f.status === 'ready').length > 1 ? 's' : ''}
              </button>
            )}
          </div>
          {files.map(item => (
            <div key={item.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--cx-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <FileText size={18} color="var(--cx-muted)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.file.name}</div>
                <div style={{ fontSize: 11, color: 'var(--cx-muted)', marginTop: 2 }}>
                  {formatSize(item.file.size)}
                  {item.result && <span style={{ marginLeft: 8, color: 'var(--cx-muted)' }}>· {item.result.vendor_detected} · v{item.result.version} · SHA: {item.result.sha256_hash.slice(0, 8)}...</span>}
                  {item.error && <span style={{ marginLeft: 8, color: 'var(--cx-fail)' }}>{item.error}</span>}
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {item.status === 'ready' && <span style={{ fontSize: 12, color: 'var(--cx-muted)' }}>Ready</span>}
                {item.status === 'uploading' && (
                  <span style={{ fontSize: 12, color: 'var(--cx-warning)' }}>
                    <span className="pulse-dot">⏳</span> Analyzing...
                  </span>
                )}
                {item.status === 'done' && <CheckCircle size={18} color="var(--cx-pass)" />}
                {item.status === 'error' && <AlertCircle size={18} color="var(--cx-fail)" />}
              </div>
              {item.status === 'done' && item.result && (
                <StatusBadge status={item.result.status as never} />
              )}
              {item.status !== 'uploading' && item.status !== 'done' && (
                <button className="btn btn-ghost btn-icon" onClick={() => removeFile(item.id)} aria-label="Remove file">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Done Banner */}
      {allDone && (
        <div style={{ textAlign: 'center', padding: 24, background: 'rgba(37,185,129,0.08)', border: '1px solid var(--cx-pass)', borderRadius: 'var(--cx-radius-md)' }}>
          <CheckCircle size={32} color="var(--cx-pass)" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--cx-pass)', marginBottom: 8 }}>Analysis Complete</div>
          <div style={{ fontSize: 13, color: 'var(--cx-muted)', marginBottom: 20 }}>All configurations have been processed. View findings and reports.</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/findings')}>
              View Findings <ArrowRight size={14} />
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/compliance')}>
              Compliance Center
            </button>
          </div>
        </div>
      )}

      {hasDoneFiles && !allDone && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/findings')}>View Findings</button>
          <button className="btn btn-secondary" onClick={() => navigate('/configurations')}>View Configurations</button>
        </div>
      )}
    </div>
  );
}
