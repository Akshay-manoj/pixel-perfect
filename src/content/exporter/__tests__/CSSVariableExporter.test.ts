import { CSSVariableExporter } from '../CSSVariableExporter';
import type { ElementInfo } from '@shared/types/element.types';
import type { TokenMap } from '@shared/types/token.types';

function createMockInfo(styles: Record<string, string> = {}): ElementInfo {
  const defaultStyles: Record<string, string> = {
    'margin-top': '16px',
    'padding-top': '24px',
    'background-color': '#3B82F6',
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

describe('CSSVariableExporter', () => {
  let exporter: CSSVariableExporter;

  beforeEach(() => {
    exporter = new CSSVariableExporter();
  });

  it('should wrap token values in var()', () => {
    const tokenMap = createTokenMap([{ name: '--spacing-4', value: '16px' }]);
    const result = exporter.export(createMockInfo(), tokenMap);
    expect(result.code).toContain('var(--spacing-4)');
  });

  it('should add "no token found" comment for unmatched values', () => {
    const result = exporter.export(createMockInfo(), createTokenMap([]));
    expect(result.code).toContain('/* no token found */');
  });

  it('should export with selector and braces', () => {
    const result = exporter.export(createMockInfo(), createTokenMap([]));
    expect(result.code).toContain('.card {');
    expect(result.code).toContain('}');
  });

  it('should return format as css-variables', () => {
    const result = exporter.export(createMockInfo());
    expect(result.format).toBe('css-variables');
  });

  it('should not use tokens when useTokens is false', () => {
    const tokenMap = createTokenMap([{ name: '--spacing-4', value: '16px' }]);
    const result = exporter.export(createMockInfo(), tokenMap, { useTokens: false });
    expect(result.code).not.toContain('var(--spacing-4)');
  });

  it('should use custom selector when includeSelector is false', () => {
    const result = exporter.export(createMockInfo(), undefined, { includeSelector: false });
    expect(result.code).toContain('.element {');
  });

  it('should handle multiple tokens', () => {
    const tokenMap = createTokenMap([
      { name: '--spacing-4', value: '16px' },
      { name: '--spacing-6', value: '24px' },
    ]);
    const result = exporter.export(createMockInfo(), tokenMap);
    expect(result.code).toContain('var(--spacing-4)');
    expect(result.code).toContain('var(--spacing-6)');
  });

  it('should include a timestamp', () => {
    const before = Date.now();
    const result = exporter.export(createMockInfo());
    expect(result.timestamp).toBeGreaterThanOrEqual(before);
  });
});
