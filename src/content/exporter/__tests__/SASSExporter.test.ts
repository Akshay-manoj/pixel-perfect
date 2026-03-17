import { SASSExporter } from '../SASSExporter';
import type { ElementInfo } from '@shared/types/element.types';
import type { TokenMap } from '@shared/types/token.types';

function createMockInfo(styles: Record<string, string> = {}): ElementInfo {
  const defaultStyles: Record<string, string> = {
    'margin-top': '16px',
    'padding-top': '24px',
    ...styles,
  };

  return {
    element: document.createElement('div'),
    boxModel: {
      margin: { top: 16, right: 0, bottom: 0, left: 0 },
      padding: { top: 24, right: 0, bottom: 0, left: 0 },
      border: { top: 0, right: 0, bottom: 0, left: 0 },
      content: { width: 200, height: 100 },
    },
    rect: { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect,
    computedStyles: {
      getPropertyValue: (prop: string) => defaultStyles[prop] ?? '',
      length: 0,
    } as unknown as CSSStyleDeclaration,
    selector: '.card',
    tagName: 'div',
    classList: ['card'],
  };
}

function createTokenMap(entries: Array<{ name: string; value: string }>): TokenMap {
  const byValue: Record<string, any[]> = {};
  const byName: Record<string, any> = {};
  const allTokens: any[] = [];
  for (const { name, value } of entries) {
    const token = { name, rawValue: value, resolvedValue: value, category: 'other' as const, source: 'page' as const };
    const key = value.toLowerCase();
    if (!byValue[key]) byValue[key] = [];
    byValue[key].push(token);
    byName[name] = token;
    allTokens.push(token);
  }
  return { byValue, byName, allTokens };
}

describe('SASSExporter', () => {
  let exporter: SASSExporter;

  beforeEach(() => {
    exporter = new SASSExporter();
  });

  it('should not contain curly braces', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).not.toContain('{');
    expect(result.code).not.toContain('}');
  });

  it('should not contain semicolons', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).not.toContain(';');
  });

  it('should use 2-space indentation for properties', () => {
    const result = exporter.export(createMockInfo());
    const lines = result.code.split('\n');
    const propLines = lines.filter((l) => l !== lines[0] && l.trim().length > 0);
    for (const line of propLines) {
      expect(line).toMatch(/^ {2}\S/);
    }
  });

  it('should start with selector on first line', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code.split('\n')[0]).toBe('.card');
  });

  it('should include property values', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).toContain('margin-top: 16px');
    expect(result.code).toContain('padding-top: 24px');
  });

  it('should replace tokens with $variables', () => {
    const tokenMap = createTokenMap([{ name: '--spacing-4', value: '16px' }]);
    const result = exporter.export(createMockInfo(), tokenMap);
    expect(result.code).toContain('$spacing-4');
  });

  it('should return format as sass', () => {
    const result = exporter.export(createMockInfo());
    expect(result.format).toBe('sass');
  });

  it('should use custom selector when includeSelector is false', () => {
    const result = exporter.export(createMockInfo(), undefined, { includeSelector: false });
    expect(result.code.split('\n')[0]).toBe('.element');
  });
});
