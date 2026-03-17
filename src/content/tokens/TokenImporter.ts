import type { DesignToken, TokenCategory } from '@shared/types/token.types';

/** Parses external token files (Style Dictionary / Figma Tokens) into DesignToken arrays */
export class TokenImporter {
  /** Parse a Style Dictionary formatted JSON into tokens */
  static parseStyleDictionary(json: Record<string, unknown>): DesignToken[] {
    const tokens: DesignToken[] = [];
    TokenImporter.walkStyleDictionary(json, [], tokens);
    return tokens;
  }

  /** Parse a Figma Tokens formatted JSON into tokens */
  static parseFigmaTokens(json: Record<string, unknown>): DesignToken[] {
    const tokens: DesignToken[] = [];

    for (const [groupName, groupValue] of Object.entries(json)) {
      if (typeof groupValue !== 'object' || groupValue === null) continue;
      TokenImporter.walkFigmaTokens(groupValue as Record<string, unknown>, [groupName], tokens);
    }

    return tokens;
  }

  /** Infer the category of a token from its name and value */
  static inferCategory(name: string, value: string): TokenCategory {
    const n = name.toLowerCase();
    const v = value.toLowerCase();

    if (n.includes('color') || n.includes('bg') || n.includes('fg') ||
        v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl')) {
      return 'color';
    }
    if (n.includes('spacing') || n.includes('gap') || n.includes('margin') || n.includes('padding') || n.includes('size')) {
      return 'spacing';
    }
    if (n.includes('radius') || n.includes('rounded')) {
      return 'radius';
    }
    if (n.includes('shadow') || n.includes('elevation')) {
      return 'shadow';
    }
    if (n.includes('font') || n.includes('text') || n.includes('line-height') || n.includes('letter')) {
      return 'typography';
    }
    return 'other';
  }

  /** Walk Style Dictionary tree: leaf nodes have a `value` key */
  private static walkStyleDictionary(
    obj: Record<string, unknown>,
    path: string[],
    tokens: DesignToken[],
  ): void {
    if (typeof obj !== 'object' || obj === null) return;

    if ('value' in obj && typeof obj.value === 'string') {
      const name = '--' + path.join('-');
      const value = obj.value as string;
      tokens.push({
        name,
        rawValue: value,
        resolvedValue: value,
        category: TokenImporter.inferCategory(name, value),
        source: 'imported',
      });
      return;
    }

    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'object' && val !== null) {
        TokenImporter.walkStyleDictionary(val as Record<string, unknown>, [...path, key], tokens);
      }
    }
  }

  /** Walk Figma Tokens tree: leaf nodes have `value` and `type` keys */
  private static walkFigmaTokens(
    obj: Record<string, unknown>,
    path: string[],
    tokens: DesignToken[],
  ): void {
    if (typeof obj !== 'object' || obj === null) return;

    if ('value' in obj && 'type' in obj) {
      const name = '--' + path.join('-');
      const value = String(obj.value);
      tokens.push({
        name,
        rawValue: value,
        resolvedValue: value,
        category: TokenImporter.inferCategory(name, value),
        source: 'imported',
      });
      return;
    }

    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'object' && val !== null) {
        TokenImporter.walkFigmaTokens(val as Record<string, unknown>, [...path, key], tokens);
      }
    }
  }
}
