import type { IExporter, ExportResult, ExportOptions } from '@shared/types/export.types';
import type { ElementInfo } from '@shared/types/element.types';
import type { TokenMap } from '@shared/types/token.types';
import { filterMeaningfulProperties } from './base.exporter';

/** Exports element styles as plain CSS */
export class CSSExporter implements IExporter {
  export(
    info: ElementInfo,
    tokenMap?: TokenMap,
    options?: Partial<ExportOptions>,
  ): ExportResult {
    const selector = options?.includeSelector !== false ? info.selector : '.element';
    const props = filterMeaningfulProperties(info.computedStyles, info.tagName);
    const lines: string[] = [];

    lines.push(`${selector} {`);
    for (const [prop, value] of Object.entries(props)) {
      lines.push(`  ${prop}: ${value};`);
    }
    lines.push('}');

    return {
      format: 'css',
      code: lines.join('\n'),
      selector: info.selector,
      timestamp: Date.now(),
    };
  }
}
