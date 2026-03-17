import { PatchExporter } from '../PatchExporter';
import type { EditOperation, CSSOverride } from '@shared/types/editor.types';

function makeOp(selector: string, prop: string, value: string): EditOperation {
  return {
    type: 'set',
    override: {
      id: `${selector}::${prop}`,
      selector,
      property: prop,
      originalValue: '0px',
      newValue: value,
      timestamp: Date.now(),
      enabled: true,
      domain: 'example.com',
    },
  };
}

describe('PatchExporter', () => {
  it('should generate a CSS patch with header comment', () => {
    const ops = [makeOp('.card', 'margin-top', '16px')];
    const result = PatchExporter.generate(ops, 'example.com');
    expect(result).toContain('PixelPerfect CSS Patch');
    expect(result).toContain('Domain: example.com');
  });

  it('should include CSS rules with selector and properties', () => {
    const ops = [makeOp('.card', 'margin-top', '16px')];
    const result = PatchExporter.generate(ops, 'example.com');
    expect(result).toContain('.card {');
    expect(result).toContain('  margin-top: 16px;');
    expect(result).toContain('}');
  });

  it('should group multiple properties under same selector', () => {
    const ops = [
      makeOp('.card', 'margin-top', '16px'),
      makeOp('.card', 'padding-top', '24px'),
    ];
    const result = PatchExporter.generate(ops, 'example.com');
    // Should have only one .card { block
    const matches = result.match(/\.card \{/g);
    expect(matches?.length).toBe(1);
    expect(result).toContain('margin-top: 16px;');
    expect(result).toContain('padding-top: 24px;');
  });

  it('should handle multiple selectors', () => {
    const ops = [
      makeOp('.card', 'margin-top', '16px'),
      makeOp('.header', 'padding-top', '24px'),
    ];
    const result = PatchExporter.generate(ops, 'example.com');
    expect(result).toContain('.card {');
    expect(result).toContain('.header {');
  });

  it('should skip reset operations', () => {
    const ops: EditOperation[] = [
      makeOp('.card', 'margin-top', '16px'),
      { type: 'reset', override: makeOp('.card', 'padding-top', '0px').override },
    ];
    const result = PatchExporter.generate(ops, 'example.com');
    expect(result).toContain('margin-top: 16px;');
    expect(result).not.toContain('padding-top');
  });

  it('should include operation count in header', () => {
    const ops = [makeOp('.card', 'margin-top', '16px'), makeOp('.card', 'padding-top', '24px')];
    const result = PatchExporter.generate(ops, 'example.com');
    expect(result).toContain('Operations: 2');
  });
});
