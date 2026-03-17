import { AuditReportBuilder } from '../AuditReportBuilder';
import { DEFAULT_SETTINGS } from '@shared/constants/defaults.constants';
import type { UserSettings } from '@shared/types/settings.types';

describe('AuditReportBuilder', () => {
  let builder: AuditReportBuilder;
  let settings: UserSettings;

  beforeEach(() => {
    builder = new AuditReportBuilder();
    settings = { ...DEFAULT_SETTINGS };
    document.body.innerHTML = '';
    jest.restoreAllMocks();

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '0px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      color: 'rgb(0,0,0)', backgroundColor: 'rgba(0,0,0,0)',
      fontSize: '16px', fontWeight: '400',
      position: 'static', zIndex: 'auto',
      getPropertyValue: (p: string) => {
        const m: Record<string, string> = { 'color-scheme': '' };
        return m[p] ?? '';
      },
    } as unknown as CSSStyleDeclaration);
  });

  it('should return an AuditReport object', () => {
    const report = builder.run(settings);
    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('gridUnit');
    expect(report).toHaveProperty('issues');
    expect(report).toHaveProperty('summary');
  });

  it('should include the grid unit in the report', () => {
    settings.gridBaseUnit = 10;
    const report = builder.run(settings);
    expect(report.gridUnit).toBe(10);
  });

  it('should have a timestamp', () => {
    const before = Date.now();
    const report = builder.run(settings);
    expect(report.timestamp).toBeGreaterThanOrEqual(before);
  });

  it('should compute summary totals', () => {
    const report = builder.run(settings);
    expect(report.summary.total).toBe(report.issues.length);
  });

  it('should compute error count', () => {
    const report = builder.run(settings);
    const errorCount = report.issues.filter((i) => i.severity === 'error').length;
    expect(report.summary.errors).toBe(errorCount);
  });

  it('should compute warning count', () => {
    const report = builder.run(settings);
    const warnCount = report.issues.filter((i) => i.severity === 'warning').length;
    expect(report.summary.warnings).toBe(warnCount);
  });

  it('should compute info count', () => {
    const report = builder.run(settings);
    const infoCount = report.issues.filter((i) => i.severity === 'info').length;
    expect(report.summary.info).toBe(infoCount);
  });

  it('should return issues as an array', () => {
    const report = builder.run(settings);
    expect(Array.isArray(report.issues)).toBe(true);
  });
});
