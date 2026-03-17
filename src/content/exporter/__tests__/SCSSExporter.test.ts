import { SCSSExporter } from '../SCSSExporter';
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
  const byValue: Record<string, Array<{ name: string; rawValue: string; resolvedValue: string; category: 'other'; source: 'page' }>> = {};
  const byName: Record<string, { name: string; rawValue: string; resolvedValue: string; category: 'other'; source: 'page' }> = {};
  const allTokens: Array<{ name: string; rawValue: string; resolvedValue: string; category: 'other'; source: 'page' }> = [];

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

describe('SCSSExporter', () => {
  let exporter: SCSSExporter;

  beforeEach(() => {
    exporter = new SCSSExporter();
  });

  it('should export valid SCSS with selector and braces', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).toContain('.card {');
    expect(result.code).toContain('}');
  });

  it('should use semicolons', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).toContain(';');
  });

  it('should replace token values with $variables', () => {
    const tokenMap = createTokenMap([{ name: '--spacing-4', value: '16px' }]);
    const result = exporter.export(createMockInfo(), tokenMap);
    expect(result.code).toContain('$spacing-4');
  });

  it('should include raw value as inline comment when token is used', () => {
    const tokenMap = createTokenMap([{ name: '--spacing-4', value: '16px' }]);
    const result = exporter.export(createMockInfo(), tokenMap);
    expect(result.code).toContain('// 16px');
  });

  it('should use raw value when no token matches', () => {
    const result = exporter.export(createMockInfo(), createTokenMap([]));
    expect(result.code).toContain('margin-top: 16px;');
  });

  it('should return format as scss', () => {
    const result = exporter.export(createMockInfo());
    expect(result.format).toBe('scss');
  });

  it('should not use tokens when useTokens is false', () => {
    const tokenMap = createTokenMap([{ name: '--spacing-4', value: '16px' }]);
    const result = exporter.export(createMockInfo(), tokenMap, { useTokens: false });
    expect(result.code).not.toContain('$spacing-4');
    expect(result.code).toContain('16px');
  });

  it('should use custom selector when includeSelector is false', () => {
    const result = exporter.export(createMockInfo(), undefined, { includeSelector: false });
    expect(result.code).toContain('.element {');
  });

  it('should handle multiple token replacements', () => {
    const tokenMap = createTokenMap([
      { name: '--spacing-4', value: '16px' },
      { name: '--spacing-6', value: '24px' },
    ]);
    const result = exporter.export(createMockInfo(), tokenMap);
    expect(result.code).toContain('$spacing-4');
    expect(result.code).toContain('$spacing-6');
  });

  it('should include a timestamp', () => {
    const before = Date.now();
    const result = exporter.export(createMockInfo());
    expect(result.timestamp).toBeGreaterThanOrEqual(before);
  });
});
