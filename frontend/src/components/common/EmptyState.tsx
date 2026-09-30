import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
  type?: 'empty' | 'error';
}

export function EmptyState({
  title = 'No data found',
  description = '',
  icon,
  action,
  type = 'empty'
}: Props) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px', textAlign: 'center', color: 'var(--cx-muted)',
    }} role={type === 'error' ? 'alert' : undefined}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%', background: 'var(--cx-surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        {icon || (type === 'error' ? <AlertTriangle size={22} color="var(--cx-fail)" /> : <AlertTriangle size={22} color="var(--cx-muted)" />)}
      </div>
      <div style={{ fontWeight: 600, color: 'var(--cx-text)', fontSize: 15, marginBottom: 8 }}>{title}</div>
      {description && <div style={{ fontSize: 13, maxWidth: 360, lineHeight: 1.6 }}>{description}</div>}
      {action && (
        <button className="btn btn-primary" onClick={action.onClick} style={{ marginTop: 20 }}>
          <RefreshCw size={14} /> {action.label}
        </button>
      )}
    </div>
  );
}
