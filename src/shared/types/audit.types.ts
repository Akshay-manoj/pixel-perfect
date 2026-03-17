/** Severity level of an audit issue */
export type AuditSeverity = 'error' | 'warning' | 'info';

/** Type of audit issue detected */
export type AuditIssueType =
  | 'off-grid'
  | 'magic-number'
  | 'near-miss-alignment'
  | 'inconsistent-siblings'
  | 'contrast-fail'
  | 'dark-mode-conflict'
  | 'unused-class';

/** A single issue found during an audit */
export interface AuditIssue {
  /** Unique identifier */
  id: string;
  /** Category of issue */
  type: AuditIssueType;
  /** Severity level */
  severity: AuditSeverity;
  /** CSS selector of the affected element */
  selector: string;
  /** Human-readable description */
  description: string;
  /** Suggested fix */
  suggestedFix: string;
  /** The problematic value */
  value?: string;
  /** Nearest grid-aligned value */
  nearestGridValue?: number;
}

/** Complete audit report */
export interface AuditReport {
  /** When the audit was run */
  timestamp: number;
  /** Grid unit used for the audit */
  gridUnit: number;
  /** All issues found */
  issues: AuditIssue[];
  /** Summary counts by severity */
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
  };
}
