import type { IExporter, ExportResult, ExportOptions } from '@shared/types/export.types';
import type { ElementInfo } from '@shared/types/element.types';
import type { TokenMap } from '@shared/types/token.types';
import { filterMeaningfulProperties, resolveTokenOrValue } from './base.exporter';

/** Exports element styles as indented SASS syntax (no braces, no semicolons) */
export class SASSExporter implements IExporter {
  export(
    info: ElementInfo,
    tokenMap?: TokenMap,
    options?: Partial<ExportOptions>,
  ): ExportResult {
    const selector = options?.includeSelector !== false ? info.selector : '.element';
    const useTokens = options?.useTokens !== false;
    const props = filterMeaningfulProperties(info.computedStyles, info.tagName);
    const lines: string[] = [];

    lines.push(selector);
    for (const [prop, value] of Object.entries(props)) {
      if (useTokens && tokenMap) {
        const tokenName = resolveTokenOrValue(value, tokenMap);
        if (tokenName !== value) {
          const sassVar = '$' + tokenName.replace(/^--/, '');
          lines.push(`  ${prop}: ${sassVar}`);
          continue;
        }
      }
      lines.push(`  ${prop}: ${value}`);
    }

    return {
      format: 'sass',
      code: lines.join('\n'),
      selector: info.selector,
      timestamp: Date.now(),
    };
  }
}
