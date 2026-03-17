import type { EditOperation } from '@shared/types/editor.types';

/** Generates a CSS patch file from edit operations */
export class PatchExporter {
  /** Generate a CSS patch file from recorded operations */
  static generate(operations: EditOperation[], domain: string): string {
    const lines: string[] = [];

    // Header comment
    lines.push('/**');
    lines.push(` * PixelPerfect CSS Patch`);
    lines.push(` * Domain: ${domain}`);
    lines.push(` * Generated: ${new Date().toISOString()}`);
    lines.push(` * Operations: ${operations.length}`);
    lines.push(' */');
    lines.push('');

    // Group operations by selector
    const bySelector = new Map<string, Map<string, string>>();
    for (const op of operations) {
      if (op.type === 'reset') continue;
      const { selector, property, newValue } = op.override;
      if (!bySelector.has(selector)) {
        bySelector.set(selector, new Map());
      }
      bySelector.get(selector)!.set(property, newValue);
    }

    // Generate CSS rules
    for (const [selector, props] of bySelector) {
      lines.push(`${selector} {`);
      for (const [prop, value] of props) {
        lines.push(`  ${prop}: ${value};`);
      }
      lines.push('}');
      lines.push('');
    }

    return lines.join('\n');
  }
}
