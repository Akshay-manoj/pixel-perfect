import { CSSExporter } from '../CSSExporter';
import type { ElementInfo } from '@shared/types/element.types';

function createMockInfo(
  overrides: Partial<{
    selector: string;
    tagName: string;
    styles: Record<string, string>;
  }> = {},
): ElementInfo {
  const styles = overrides.styles ?? {
    'margin-top': '16px',
    'padding-top': '24px',
    'background-color': '#3B82F6',
    'border-radius': '8px',
    'display': 'block',
    'position': 'static',
  };

  return {
    element: document.createElement(overrides.tagName ?? 'div'),
    boxModel: {
      margin: { top: 16, right: 0, bottom: 0, left: 0 },
      padding: { top: 24, right: 0, bottom: 0, left: 0 },
      border: { top: 0, right: 0, bottom: 0, left: 0 },
      content: { width: 200, height: 100 },
    },
    rect: { top: 0, left: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect,
    computedStyles: {
      getPropertyValue: (prop: string) => styles[prop] ?? '',
      length: 0,
    } as unknown as CSSStyleDeclaration,
    selector: overrides.selector ?? '.card',
    tagName: overrides.tagName ?? 'div',
    classList: ['card'],
  };
}

describe('CSSExporter', () => {
  let exporter: CSSExporter;

  beforeEach(() => {
    exporter = new CSSExporter();
  });

  it('should export valid CSS with selector', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).toContain('.card {');
    expect(result.code).toContain('}');
  });

  it('should include meaningful properties', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).toContain('margin-top: 16px;');
    expect(result.code).toContain('padding-top: 24px;');
  });

  it('should include background-color', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).toContain('background-color: #3B82F6;');
  });

  it('should include border-radius', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).toContain('border-radius: 8px;');
  });

  it('should strip browser default display:block for div', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).not.toContain('display: block');
  });

  it('should strip browser default position:static', () => {
    const result = exporter.export(createMockInfo());
    expect(result.code).not.toContain('position: static');
  });

  it('should use custom selector when includeSelector is false', () => {
    const result = exporter.export(createMockInfo(), undefined, { includeSelector: false });
    expect(result.code).toContain('.element {');
  });

  it('should return format as css', () => {
    const result = exporter.export(createMockInfo());
    expect(result.format).toBe('css');
  });

  it('should return the original selector', () => {
    const result = exporter.export(createMockInfo({ selector: '#my-el' }));
    expect(result.selector).toBe('#my-el');
  });

  it('should include a timestamp', () => {
    const before = Date.now();
    const result = exporter.export(createMockInfo());
    expect(result.timestamp).toBeGreaterThanOrEqual(before);
  });
});
