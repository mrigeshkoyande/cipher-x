const BASE = '/api/v1';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('cx_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

async function upload<T>(path: string, formData: FormData): Promise<T> {
  const token = localStorage.getItem('cx_token');
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Auth ---
export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ access_token: string; username: string; role: string; tenant_id: string; user_id: string }>(
        'POST', '/auth/login', { username, password }
      ),
    me: () => request<{ id: string; username: string; email: string; role: string }>('GET', '/auth/me'),
  },

  devices: {
    list: (params?: { vendor?: string; status?: string }) => {
      const q = params ? '?' + new URLSearchParams(Object.entries(params).filter(([,v]) => v) as [string,string][]).toString() : '';
      return request<Device[]>('GET', `/devices${q}`);
    },
    get: (id: string) => request<Device>('GET', `/devices/${id}`),
    create: (data: { name: string; vendor: string; platform: string; os_version?: string; ip_address?: string }) =>
      request<Device>('POST', '/devices', data),
  },

  configurations: {
    list: (deviceId?: string) => {
      const q = deviceId ? `?device_id=${deviceId}` : '';
      return request<Configuration[]>('GET', `/configurations${q}`);
    },
    get: (id: string) => request<Configuration>('GET', `/configurations/${id}`),
    upload: (file: File, deviceName?: string, deviceId?: string) => {
      const fd = new FormData();
      fd.append('file', file);
      if (deviceName) fd.append('device_name', deviceName);
      if (deviceId) fd.append('device_id', deviceId);
      return upload<Configuration>('/configurations/upload', fd);
    },
    getFacts: (id: string) => request<NormalizedFact[]>('GET', `/configurations/${id}/facts`),
    getPipeline: (id: string) => request<ProcessingPipeline>('GET', `/configurations/${id}/pipeline`),
  },

  compliance: {
    frameworks: () => request<Framework[]>('GET', '/compliance/frameworks'),
    summary: (framework?: string) => {
      const q = framework ? `?framework_code=${framework}` : '';
      return request<ComplianceSummary>('GET', `/compliance/summary${q}`);
    },
  },

  findings: {
    list: (params?: { severity?: string; status?: string; device_id?: string; config_id?: string }) => {
      const q = params ? '?' + new URLSearchParams(Object.entries(params).filter(([,v]) => v) as [string,string][]).toString() : '';
      return request<Finding[]>('GET', `/findings${q}`);
    },
    get: (id: string) => request<Finding>('GET', `/findings/${id}`),
    review: (id: string) => request<Finding>('POST', `/findings/${id}/review`),
  },

  training: {
    list: (status?: string) => {
      const q = status ? `?status=${status}` : '';
      return request<Mapping[]>('GET', `/training${q}`);
    },
    action: (id: string, action: string, normalized_parameter?: string) =>
      request<Mapping>('POST', `/training/${id}/action`, { action, normalized_parameter }),
  },

  remediation: {
    list: (severity?: string) => {
      const q = severity ? `?severity=${severity}` : '';
      return request<Remediation[]>('GET', `/remediation${q}`);
    },
  },

  reports: {
    list: () => request<Report[]>('GET', '/reports'),
    generate: (device_id: string, framework_code = 'CIS') =>
      request<Report>('POST', `/reports/generate?device_id=${device_id}&framework_code=${framework_code}`, {}),
    downloadUrl: (id: string) => `${BASE}/reports/${id}/download`,
  },

  drift: {
    compare: (oldId: string, newId: string) =>
      request<DriftResult>('GET', `/drift/compare?config_id_old=${oldId}&config_id_new=${newId}`),
  },

  query: {
    ask: (question: string) => request<QueryResponse>('POST', '/query', { question }),
  },

  simulation: {
    run: (device_id: string, parameter: string, proposed_value: unknown) =>
      request<SimulationResult>('POST', '/what-if/simulate', { device_id, parameter, proposed_value }),
  },

  graph: {
    get: (device_id?: string) => {
      const q = device_id ? `?device_id=${device_id}` : '';
      return request<SecurityGraph>('GET', `/graph${q}`);
    },
  },

  audit: {
    list: () => request<AuditEvent[]>('GET', '/audit'),
  },
};

// --- Types ---
export interface Device {
  id: string; tenant_id: string; name: string; vendor: string; platform: string;
  os_version?: string; ip_address?: string; status: string; compliance_score: number;
  risk_level: string; last_scanned_at?: string; created_at: string;
}
export interface Configuration {
  id: string; tenant_id: string; device_id: string; version: number; filename: string;
  sha256_hash: string; status: string; vendor_detected?: string; platform_detected?: string;
  confidence: number; line_count: number; uploaded_at: string; raw_content?: string;
}
export interface NormalizedFact {
  id: string; configuration_id: string; category: string; parameter: string; value: unknown;
  raw_text: string; start_line: number; end_line: number; confidence: number;
  is_unknown: boolean; ai_suggested: boolean; suggestion_reason?: string; created_at: string;
}
export interface ProcessingStage {
  stage: string; title: string; status: string; duration_ms: number; confidence: number; details?: string;
}
export interface ProcessingPipeline {
  job_id: string; configuration_id: string; current_stage: string; status: string;
  progress_percent: number; stages: ProcessingStage[];
}
export interface Framework {
  id: string; code: string; name: string; version: string; description?: string; controls_count: number;
}
export interface ComplianceSummary {
  framework_code: string; overall_score: number; total_devices: number;
  total_controls_evaluated: number; counts: Record<string, number>;
}
export interface Finding {
  id: string; tenant_id: string; device_id: string; configuration_id: string;
  framework_id: string; control_id: string; status: string; severity: string; title: string;
  description: string; observed_value: unknown; expected_value: unknown; confidence: number;
  start_line: number; end_line: number; evidence_text?: string; remediation_command?: string;
  risk_impact?: string; verification_command?: string; is_reviewed: boolean; created_at: string;
}
export interface Mapping {
  id: string; tenant_id: string; vendor: string; platform: string; raw_command_pattern: string;
  normalized_parameter: string; expected_type: string; transformation: string; confidence: number;
  status: string; created_by: string; approved_by?: string; approved_at?: string; created_at: string;
}
export interface Remediation {
  finding_id: string; device_id: string; device_name: string; vendor: string; platform: string;
  severity: string; control_id: string; title: string; recommended_command: string;
  risk_impact: string; verification_command: string; evidence_lines: string; evidence_text?: string;
}
export interface Report {
  id: string; tenant_id: string; title: string; device_id: string; configuration_id: string;
  framework_code: string; compliance_score: number; total_controls: number; passed_controls: number;
  failed_controls: number; critical_findings: number; report_url?: string; sha256_hash: string; created_at: string;
}
export interface DriftResult {
  drift_id: string; device_id: string; config_id_old: string; config_id_new: string;
  version_old: number; version_new: number; added_facts: DriftFact[]; removed_facts: DriftFact[];
  changed_facts: DriftFact[]; line_diff: LineDiff[]; risk_change: string; affected_controls_count: number;
}
export interface DriftFact { parameter: string; value: unknown; category: string; line: number; old_value?: unknown; new_value?: unknown; }
export interface LineDiff { type: string; text: string; }
export interface QueryResponse {
  question: string; answer: string; confidence: number; evidence: EvidenceRef[]; matched_count: number;
}
export interface EvidenceRef {
  device_name: string; device_id: string; config_id: string; line_start: number; line_end: number; source_text: string;
}
export interface SimulationResult {
  session_id: string; device_id: string; device_name: string; baseline_score: number; simulated_score: number;
  baseline_failed_controls: number; simulated_failed_controls: number; improved_controls_count: number;
  worsened_controls_count: number; affected_controls: { control_id: string; title: string; change: string }[];
  disclaimer: string;
}
export interface SecurityGraph {
  nodes: GraphNode[]; edges: GraphEdge[];
}
export interface GraphNode {
  id: string; label: string; type: string; status?: string; severity?: string; data: Record<string, unknown>;
}
export interface GraphEdge { id: string; source: string; target: string; label?: string; }
export interface AuditEvent {
  id: string; tenant_id: string; actor: string; action: string; entity_type: string; entity_id: string;
  description: string; event_metadata?: Record<string, unknown>; sha256_hash: string; timestamp: string;
}
