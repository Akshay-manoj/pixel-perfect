import type { IExporter, ExportResult, ExportOptions } from '@shared/types/export.types';
import type { ElementInfo } from '@shared/types/element.types';
import type { TokenMap } from '@shared/types/token.types';
import { filterMeaningfulProperties, toCamelCase } from './base.exporter';

/** Exports element styles as CSS-in-JS (template literal or object) */
export class CSSInJSExporter implements IExporter {
  export(
    info: ElementInfo,
    _tokenMap?: TokenMap,
    options?: Partial<ExportOptions>,
  ): ExportResult {
    const mode = options?.cssInJSMode ?? 'template';
    const props = filterMeaningfulProperties(info.computedStyles, info.tagName);

    const code = mode === 'template'
      ? this.buildTemplate(info, props)
      : this.buildObject(props);

    const format = mode === 'template' ? 'css-in-js-template' as const : 'css-in-js-object' as const;

    return {
      format,
      code,
      selector: info.selector,
      timestamp: Date.now(),
    };
  }

  private buildTemplate(info: ElementInfo, props: Record<string, string>): string {
    const name = this.componentName(info.tagName);
    const tag = info.tagName;
    const lines: string[] = [];

    lines.push(`const ${name} = styled.${tag}\``);
    for (const [prop, value] of Object.entries(props)) {
      lines.push(`  ${prop}: ${value};`);
    }
    lines.push('`;');

    return lines.join('\n');
  }

  private buildObject(props: Record<string, string>): string {
    const lines: string[] = [];

    lines.push('const styles = {');
    const entries = Object.entries(props);
    for (let i = 0; i < entries.length; i++) {
      const [prop, value] = entries[i];
      const camelProp = toCamelCase(prop);
      const comma = i < entries.length - 1 ? ',' : '';
      lines.push(`  ${camelProp}: '${value}'${comma}`);
    }
    lines.push('};');

    return lines.join('\n');
  }

  private componentName(tagName: string): string {
    return tagName.charAt(0).toUpperCase() + tagName.slice(1).toLowerCase();
  }
}
