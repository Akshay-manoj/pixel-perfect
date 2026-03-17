import type { IExporter, ExportResult, ExportOptions } from '@shared/types/export.types';
import type { ElementInfo } from '@shared/types/element.types';
import type { TokenMap } from '@shared/types/token.types';
import { TailwindMapper } from '../tokens/TailwindMapper';
import { filterMeaningfulProperties } from './base.exporter';
import { normalizeColor } from '@shared/utils/color.utils';

const tw = new TailwindMapper();

/** Property to Tailwind mapping category */
type TwCategory = 'spacing' | 'sizing' | 'border' | 'typography' | 'color' | 'layout' | 'other';

function categorize(prop: string): TwCategory {
  if (prop.startsWith('margin') || prop.startsWith('padding') || prop === 'gap') return 'spacing';
  if (prop === 'width' || prop === 'height' || prop.startsWith('min-') || prop.startsWith('max-')) return 'sizing';
  if (prop.startsWith('border')) return 'border';
  if (prop.startsWith('font') || prop === 'line-height' || prop === 'letter-spacing' || prop === 'text-align' || prop === 'text-decoration' || prop === 'text-transform') return 'typography';
  if (prop === 'color' || prop === 'background-color') return 'color';
  if (prop === 'display' || prop === 'position' || prop.startsWith('flex') || prop.startsWith('justify') || prop.startsWith('align') || prop.startsWith('grid')) return 'layout';
  return 'other';
}

/** Side prefix map for margin/padding */
const SIDE_MAP: Record<string, string> = {
  'margin-top': 'mt', 'margin-right': 'mr', 'margin-bottom': 'mb', 'margin-left': 'ml',
  'padding-top': 'pt', 'padding-right': 'pr', 'padding-bottom': 'pb', 'padding-left': 'pl',
};

/** Exports element styles as Tailwind utility class string */
export class TailwindExporter implements IExporter {
  export(
    info: ElementInfo,
    _tokenMap?: TokenMap,
    options?: Partial<ExportOptions>,
  ): ExportResult {
    const props = filterMeaningfulProperties(info.computedStyles, info.tagName);
    const classes: string[] = [];
    const unmapped: string[] = [];

    // Group by category for ordered output
    const entries = Object.entries(props);
    entries.sort((a, b) => {
      const order: TwCategory[] = ['layout', 'spacing', 'sizing', 'border', 'typography', 'color', 'other'];
      return order.indexOf(categorize(a[0])) - order.indexOf(categorize(b[0]));
    });

    for (const [prop, value] of entries) {
      const mapped = this.mapProperty(prop, value);
      if (mapped) {
        classes.push(mapped);
      } else {
        unmapped.push(`${prop}: ${value}`);
      }
    }

    let code = classes.join(' ');
    if (unmapped.length > 0) {
      code += '\n' + unmapped.map((u) => `/* no Tailwind equivalent: ${u} */`).join('\n');
    }

    return {
      format: 'tailwind',
      code,
      selector: info.selector,
      timestamp: Date.now(),
    };
  }

  private mapProperty(prop: string, value: string): string | null {
    const px = parseFloat(value);

    // Margin / padding
    if (prop in SIDE_MAP) {
      const key = tw.mapSpacing(px, prop.startsWith('margin') ? 'margin' : 'padding');
      if (key) {
        // Replace generic prefix with side-specific
        const prefix = SIDE_MAP[prop];
        return `${prefix}-${key.split('-').slice(1).join('-')}`;
      }
      return null;
    }

    if (prop === 'gap') {
      return tw.mapSpacing(px, 'gap');
    }

    // Border radius
    if (prop.includes('radius')) {
      return tw.mapBorderRadius(px);
    }

    // Font size
    if (prop === 'font-size') {
      return tw.mapFontSize(px);
    }

    // Font weight
    if (prop === 'font-weight') {
      return mapFontWeight(value);
    }

    // Colors
    if (prop === 'background-color') {
      const color = tw.mapColor(normalizeColor(value));
      return color ? `bg-${color}` : null;
    }
    if (prop === 'color') {
      const color = tw.mapColor(normalizeColor(value));
      return color ? `text-${color}` : null;
    }

    // Display
    if (prop === 'display') {
      const displayMap: Record<string, string> = {
        flex: 'flex', grid: 'grid', block: 'block', 'inline-block': 'inline-block',
        inline: 'inline', 'inline-flex': 'inline-flex', none: 'hidden',
      };
      return displayMap[value] ?? null;
    }

    // Position
    if (prop === 'position') {
      return ['relative', 'absolute', 'fixed', 'sticky'].includes(value) ? value : null;
    }

    // Text align
    if (prop === 'text-align') {
      return ['left', 'center', 'right', 'justify'].includes(value) ? `text-${value}` : null;
    }

    return null;
  }
}

function mapFontWeight(value: string): string | null {
  const weightMap: Record<string, string> = {
    '100': 'font-thin', '200': 'font-extralight', '300': 'font-light',
    '400': 'font-normal', '500': 'font-medium', '600': 'font-semibold',
    '700': 'font-bold', '800': 'font-extrabold', '900': 'font-black',
  };
  return weightMap[value] ?? null;
}
