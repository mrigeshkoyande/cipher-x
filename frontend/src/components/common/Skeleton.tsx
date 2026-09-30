import React from 'react';

interface Props { text?: string; lines?: number; className?: string; }

export function Skeleton({ text, lines = 1, className = '' }: Props) {
  if (text) {
    return <div className={`skeleton ${className}`} style={{ height: 16, width: '60%', borderRadius: 4 }} aria-hidden="true" />;
  }
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 8 }} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 14, width: i === lines - 1 ? '70%' : '100%', borderRadius: 4 }} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-hidden="true">
      <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 40, width: '60%', borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 12, width: '50%', borderRadius: 4 }} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }} aria-hidden="true">
      <div className="skeleton" style={{ height: 40, borderRadius: 0 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 54, borderRadius: 0, opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  );
}
