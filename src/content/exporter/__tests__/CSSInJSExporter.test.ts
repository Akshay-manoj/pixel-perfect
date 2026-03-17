import { CSSInJSExporter } from '../CSSInJSExporter';
import type { ElementInfo } from '@shared/types/element.types';

function createMockInfo(styles: Record<string, string> = {}): ElementInfo {
  const defaultStyles: Record<string, string> = {
    'margin-top': '16px',
    'padding-top': '24px',
    'border-radius': '8px',
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

describe('CSSInJSExporter', () => {
  let exporter: CSSInJSExporter;

  beforeEach(() => {
    exporter = new CSSInJSExporter();
  });

  describe('template mode', () => {
    it('should output styled-components template literal', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'template' });
      expect(result.code).toContain('const Div = styled.div`');
      expect(result.code).toContain('`;');
    });

    it('should use kebab-case property names in template mode', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'template' });
      expect(result.code).toContain('margin-top: 16px;');
      expect(result.code).toContain('border-radius: 8px;');
    });

    it('should include semicolons in template mode', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'template' });
      expect(result.code).toContain('margin-top: 16px;');
    });

    it('should return css-in-js-template format', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'template' });
      expect(result.format).toBe('css-in-js-template');
    });

    it('should capitalize component name from tagName', () => {
      const info = createMockInfo();
      const result = exporter.export(info, undefined, { cssInJSMode: 'template' });
      expect(result.code).toContain('const Div');
    });
  });

  describe('object mode', () => {
    it('should output a JS object', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'object' });
      expect(result.code).toContain('const styles = {');
      expect(result.code).toContain('};');
    });

    it('should use camelCase property names', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'object' });
      expect(result.code).toContain('marginTop');
      expect(result.code).toContain('borderRadius');
    });

    it('should wrap values in quotes', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'object' });
      expect(result.code).toContain("'16px'");
    });

    it('should return css-in-js-object format', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'object' });
      expect(result.format).toBe('css-in-js-object');
    });

    it('should convert background-color to backgroundColor', () => {
      const result = exporter.export(createMockInfo(), undefined, { cssInJSMode: 'object' });
      expect(result.code).toContain('backgroundColor');
    });
  });
});
