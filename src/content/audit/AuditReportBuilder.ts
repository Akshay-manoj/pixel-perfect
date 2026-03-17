import type { AuditReport } from '@shared/types/audit.types';
import type { UserSettings } from '@shared/types/settings.types';
import { SpacingAuditor } from './SpacingAuditor';
import { AlignmentAuditor } from './AlignmentAuditor';
import { ContrastAuditor } from './ContrastAuditor';
import { DarkModeAuditor } from './DarkModeAuditor';

/** Combines all auditors into a single structured report */
export class AuditReportBuilder {
  run(settings: UserSettings): AuditReport {
    const spacingAuditor = new SpacingAuditor();
    const alignmentAuditor = new AlignmentAuditor();
    const contrastAuditor = new ContrastAuditor();
    const darkModeAuditor = new DarkModeAuditor();

    const issues = [
      ...spacingAuditor.run(settings.gridBaseUnit),
      ...alignmentAuditor.run(),
      ...contrastAuditor.run(),
      ...darkModeAuditor.run(),
    ];

    return {
      timestamp: Date.now(),
      gridUnit: settings.gridBaseUnit,
      issues,
      summary: {
        total: issues.length,
        errors: issues.filter((i) => i.severity === 'error').length,
        warnings: issues.filter((i) => i.severity === 'warning').length,
        info: issues.filter((i) => i.severity === 'info').length,
      },
    };
  }
}
