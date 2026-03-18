import React, { useState } from 'react';
import type { AuditReport, AuditIssue, AuditSeverity } from '@shared/types/audit.types';

interface AuditReportViewProps {
  report: AuditReport | null;
  onRunAudit: () => void;
  loading?: boolean;
}

const SEVERITY_ICONS: Record<AuditSeverity, string> = {
  error: '\u2716',
  warning: '\u26A0',
  info: '\u2139',
};

const SEVERITY_COLORS: Record<AuditSeverity, string> = {
  error: '#F38BA8',
  warning: '#FAB387',
  info: '#89B4FA',
};

export const AuditReportView: React.FC<AuditReportViewProps> = ({ report, onRunAudit, loading }) => {
  const [filter, setFilter] = useState<AuditSeverity | 'all'>('all');

  const filteredIssues = report?.issues.filter(
    (i) => filter === 'all' || i.severity === filter,
  ) ?? [];

  // Group by type
  const grouped = new Map<string, AuditIssue[]>();
  for (const issue of filteredIssues) {
    if (!grouped.has(issue.type)) grouped.set(issue.type, []);
    grouped.get(issue.type)!.push(issue);
  }

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>Audit Report</span>
        <button onClick={onRunAudit} disabled={loading} style={styles.runBtn}>
          {loading ? 'Running...' : 'Run Audit'}
        </button>
      </div>

      {/* Summary bar */}
      {report && (
        <div style={styles.summary}>
          <span style={{ color: '#F38BA8' }}>{report.summary.errors} errors</span>
          <span style={{ color: '#6C7086' }}>&middot;</span>
          <span style={{ color: '#FAB387' }}>{report.summary.warnings} warnings</span>
          <span style={{ color: '#6C7086' }}>&middot;</span>
          <span style={{ color: '#89B4FA' }}>{report.summary.info} info</span>
        </div>
      )}

      {/* Filter */}
      <div style={styles.filterBar}>
        {(['all', 'error', 'warning', 'info'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === f ? '#6366F1' : 'transparent',
              color: filter === f ? '#FFFFFF' : '#A6ADC8',
            }}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Issues */}
      {!report && (
        <div style={styles.empty}>
          <p style={styles.emptyText}>Click "Run Audit" to scan the page</p>
        </div>
      )}

      {report && filteredIssues.length === 0 && (
        <div style={styles.empty}>
          <p style={{ ...styles.emptyText, color: '#A6E3A1' }}>No issues found!</p>
        </div>
      )}

      {[...grouped.entries()].map(([type, issues]) => (
        <div key={type} style={styles.group}>
          <div style={styles.groupTitle}>
            {SEVERITY_ICONS[issues[0].severity]} {type.replace(/-/g, ' ')} ({issues.length})
          </div>
          {issues.map((issue) => (
            <div key={issue.id} style={styles.issue}>
              <div style={styles.issueHeader}>
                <span style={{ color: SEVERITY_COLORS[issue.severity] }}>
                  {SEVERITY_ICONS[issue.severity]}
                </span>
                <span style={styles.issueSelector}>{issue.selector}</span>
              </div>
              <div style={styles.issueDesc}>{issue.description}</div>
              <div style={styles.issueFix}>{issue.suggestedFix}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 14, fontWeight: 700, color: '#CDD6F4' },
  runBtn: {
    background: '#6366F1', border: 'none', color: '#FFFFFF',
    fontSize: 11, padding: '5px 14px', borderRadius: 4, cursor: 'pointer',
  },
  summary: { display: 'flex', gap: 8, fontSize: 12, marginBottom: 8 },
  filterBar: { display: 'flex', gap: 2, background: '#313244', borderRadius: 6, padding: 2, marginBottom: 12 },
  filterBtn: {
    padding: '3px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
    fontSize: 10, transition: 'background-color 0.15s',
  },
  empty: { padding: 32, textAlign: 'center' },
  emptyText: { color: '#6C7086', fontSize: 13, margin: 0 },
  group: { marginBottom: 12 },
  groupTitle: { fontSize: 12, fontWeight: 600, color: '#A6ADC8', marginBottom: 6, textTransform: 'capitalize' as const },
  issue: {
    background: '#181825', border: '1px solid #313244', borderRadius: 6,
    padding: '8px 12px', marginBottom: 4,
  },
  issueHeader: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 },
  issueSelector: { color: '#89B4FA', fontSize: 11, fontFamily: 'monospace' },
  issueDesc: { color: '#CDD6F4', fontSize: 11, marginBottom: 2 },
  issueFix: { color: '#A6E3A1', fontSize: 10 },
};
