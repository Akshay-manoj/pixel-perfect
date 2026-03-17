import type { IExporter, ExportResult, ExportOptions } from '@shared/types/export.types';
import type { ElementInfo } from '@shared/types/element.types';
import type { TokenMap } from '@shared/types/token.types';
import { filterMeaningfulProperties, resolveTokenOrValue } from './base.exporter';

/** Exports element styles as SCSS with $variable token references */
export class SCSSExporter implements IExporter {
  export(
    info: ElementInfo,
    tokenMap?: TokenMap,
    options?: Partial<ExportOptions>,
  ): ExportResult {
    const selector = options?.includeSelector !== false ? info.selector : '.element';
    const useTokens = options?.useTokens !== false;
    const props = filterMeaningfulProperties(info.computedStyles, info.tagName);
    const lines: string[] = [];

    lines.push(`${selector} {`);
    for (const [prop, value] of Object.entries(props)) {
      if (useTokens && tokenMap) {
        const tokenName = resolveTokenOrValue(value, tokenMap);
        if (tokenName !== value) {
          // Convert --token-name to $token-name
          const scssVar = '$' + tokenName.replace(/^--/, '');
          lines.push(`  ${prop}: ${scssVar}; // ${value}`);
          continue;
        }
      }
      lines.push(`  ${prop}: ${value};`);
    }
    lines.push('}');

    return {
      format: 'scss',
      code: lines.join('\n'),
      selector: info.selector,
      timestamp: Date.now(),
    };
  }
}
