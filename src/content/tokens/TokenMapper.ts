import type { TokenMap, DesignToken, MappedBoxModel, MappedValue } from '@shared/types/token.types';
import type { BoxModel } from '@shared/types/element.types';
import { normalizeColor } from '@shared/utils/color.utils';
import { TailwindMapper } from './TailwindMapper';

/** Reverse-maps computed CSS values back to design token names */
export class TokenMapper {
  private tailwind: TailwindMapper;

  constructor(private tokenMap: TokenMap) {
    this.tailwind = new TailwindMapper();
  }

  /** Update the internal token map (e.g. after rescan) */
  updateTokenMap(tokenMap: TokenMap): void {
    this.tokenMap = tokenMap;
  }

  /** Find the best matching token for a computed value */
  findToken(computedValue: string): DesignToken | null {
    const tokens = this.findAllTokens(computedValue);
    if (tokens.length === 0) return null;

    // Prefer custom > imported > page
    const sourceOrder: Record<string, number> = { custom: 0, imported: 1, page: 2 };
    tokens.sort((a, b) => {
      const sDiff = (sourceOrder[a.source] ?? 9) - (sourceOrder[b.source] ?? 9);
      if (sDiff !== 0) return sDiff;
      // Prefer most descriptive name (longer name = more specific)
      return b.name.length - a.name.length;
    });

    return tokens[0];
  }

  /** Find all tokens matching a computed value */
  findAllTokens(computedValue: string): DesignToken[] {
    const normalized = computedValue.trim().toLowerCase();
    const results: DesignToken[] = [];

    // Direct match
    if (this.tokenMap.byValue[normalized]) {
      results.push(...this.tokenMap.byValue[normalized]);
    }

    // Try color normalization for hex/rgb values
    if (normalized.startsWith('#') || normalized.startsWith('rgb')) {
      const hex = normalizeColor(normalized);
      if (hex !== normalized && this.tokenMap.byValue[hex]) {
        results.push(...this.tokenMap.byValue[hex]);
      }
      // Also check rgb form if input was hex
      if (normalized.startsWith('#')) {
        for (const [key, tokens] of Object.entries(this.tokenMap.byValue)) {
          if (normalizeColor(key) === hex && key !== normalized) {
            results.push(...tokens);
          }
        }
      }
    }

    return results;
  }

  /** Map a full box model to token names and Tailwind classes */
  mapBoxModel(boxModel: BoxModel): MappedBoxModel {
    const mapEdge = (
      value: number,
      property: 'margin' | 'padding' | 'border',
      side: 'top' | 'right' | 'bottom' | 'left',
    ): MappedValue => {
      const rawValue = `${value}px`;
      const token = this.findToken(rawValue);
      const sidePrefix = { top: 't', right: 'r', bottom: 'b', left: 'l' }[side];
      const propPrefix = property === 'margin' ? 'm' : property === 'padding' ? 'p' : 'border';

      let tailwindClass: string | null = null;
      if (property === 'margin' || property === 'padding') {
        tailwindClass = this.tailwind.mapSpacing(value, property);
        if (tailwindClass) {
          // Convert generic class to side-specific: m-6 → mt-6
          tailwindClass = tailwindClass.replace(
            /^([mp])-/,
            `$1${sidePrefix}-`,
          );
        }
      }

      return {
        rawValue,
        tokenName: token?.name,
        tailwindClass: tailwindClass ?? undefined,
      };
    };

    return {
      margin: {
        top: mapEdge(boxModel.margin.top, 'margin', 'top'),
        right: mapEdge(boxModel.margin.right, 'margin', 'right'),
        bottom: mapEdge(boxModel.margin.bottom, 'margin', 'bottom'),
        left: mapEdge(boxModel.margin.left, 'margin', 'left'),
      },
      padding: {
        top: mapEdge(boxModel.padding.top, 'padding', 'top'),
        right: mapEdge(boxModel.padding.right, 'padding', 'right'),
        bottom: mapEdge(boxModel.padding.bottom, 'padding', 'bottom'),
        left: mapEdge(boxModel.padding.left, 'padding', 'left'),
      },
      border: {
        top: mapEdge(boxModel.border.top, 'border', 'top'),
        right: mapEdge(boxModel.border.right, 'border', 'right'),
        bottom: mapEdge(boxModel.border.bottom, 'border', 'bottom'),
        left: mapEdge(boxModel.border.left, 'border', 'left'),
      },
    };
  }
}
