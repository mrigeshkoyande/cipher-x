import React from 'react';

type StatusType = 'PASS' | 'FAIL' | 'WARNING' | 'REVIEW' | 'UNKNOWN' | 'NOT_APPLICABLE' |
  'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL' |
  'Healthy' | 'Risk' | 'Review' | 'COMPLETED' | 'QUEUED' | 'PROCESSING' | 'REVIEW_REQUIRED' | 'FAILED';

const classMap: Record<string, string> = {
  PASS: 'badge-pass', FAIL: 'badge-fail', WARNING: 'badge-warning',
  REVIEW: 'badge-review', REVIEW_REQUIRED: 'badge-review',
  UNKNOWN: 'badge-unknown', NOT_APPLICABLE: 'badge-unknown',
  CRITICAL: 'badge-critical', HIGH: 'badge-high',
  MEDIUM: 'badge-medium', LOW: 'badge-low', INFORMATIONAL: 'badge-info',
  Healthy: 'badge-pass', Risk: 'badge-critical', COMPLETED: 'badge-pass',
  QUEUED: 'badge-info', PROCESSING: 'badge-warning', FAILED: 'badge-fail',
};

const dotColors: Record<string, string> = {
  PASS: 'var(--cx-pass)', Healthy: 'var(--cx-pass)',
  FAIL: 'var(--cx-fail)', Risk: 'var(--cx-fail)', FAILED: 'var(--cx-fail)',
  WARNING: 'var(--cx-warning)', PROCESSING: 'var(--cx-warning)',
  REVIEW: 'var(--cx-review)', REVIEW_REQUIRED: 'var(--cx-review)', Review: 'var(--cx-review)',
  UNKNOWN: 'var(--cx-unknown)', NOT_APPLICABLE: 'var(--cx-unknown)',
  QUEUED: 'var(--cx-info)', COMPLETED: 'var(--cx-pass)',
};

interface Props { status: StatusType | string; withDot?: boolean; }

export function StatusBadge({ status, withDot }: Props) {
  const cls = classMap[status] || 'badge-unknown';
  const dotColor = dotColors[status] || 'var(--cx-unknown)';
  return (
    <span className={`badge ${cls}`} aria-label={`Status: ${status}`}>
      {withDot && <span className="status-dot" style={{ background: dotColor }} aria-hidden="true" />}
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  return <StatusBadge status={severity as StatusType} />;
}
