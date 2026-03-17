import type { TokenMap, DesignToken, TokenCategory } from '@shared/types/token.types';

const DEBOUNCE_MS = 500;
const SKIP_PREFIX = '--tw-';

/** Scans document stylesheets for CSS custom properties and builds a TokenMap */
export class TokenScanner {
  private tokenMap: TokenMap = { byValue: {}, byName: {}, allTokens: [] };
  private observer: MutationObserver | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /** Scan all stylesheets and build the token map */
  scan(): TokenMap {
    const tokens: DesignToken[] = [];
    const rootStyle = getComputedStyle(document.documentElement);

    try {
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          // Cross-origin stylesheet, skip
          continue;
        }

        this.extractTokensFromRules(rules, rootStyle, tokens);
      }
    } catch {
      // Stylesheet access error, proceed with what we have
    }

    this.tokenMap = TokenScanner.buildMap(tokens);
    return this.tokenMap;
  }

  /** Watch for new stylesheets via MutationObserver on <head> */
  observe(): void {
    if (this.observer) return;

    this.observer = new MutationObserver(() => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.scan();
      }, DEBOUNCE_MS);
    });

    this.observer.observe(document.head, {
      childList: true,
      subtree: true,
    });
  }

  /** Get the current token map */
  getTokenMap(): TokenMap {
    return this.tokenMap;
  }

  /** Stop observing and clean up */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  private extractTokensFromRules(
    rules: CSSRuleList,
    rootStyle: CSSStyleDeclaration,
    tokens: DesignToken[],
  ): void {
    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j];

      // Handle nested @media / @supports rules
      if ('cssRules' in rule && (rule as CSSGroupingRule).cssRules) {
        this.extractTokensFromRules((rule as CSSGroupingRule).cssRules, rootStyle, tokens);
        continue;
      }

      // Skip non-style rules (e.g. @import, @font-face without custom props)
      if (!('style' in rule)) continue;

      const style = (rule as CSSStyleRule).style;
      for (let k = 0; k < style.length; k++) {
        const prop = style[k];
        if (!prop.startsWith('--')) continue;
        if (prop.startsWith(SKIP_PREFIX)) continue;

        const rawValue = style.getPropertyValue(prop).trim();
        const resolvedValue = rootStyle.getPropertyValue(prop).trim();
        const category = TokenScanner.inferCategory(prop, resolvedValue || rawValue);

        tokens.push({
          name: prop,
          rawValue,
          resolvedValue: resolvedValue || rawValue,
          category,
          source: 'page',
        });
      }
    }
  }

  /** Build a TokenMap from a flat array of tokens */
  static buildMap(tokens: DesignToken[]): TokenMap {
    const byValue: Record<string, DesignToken[]> = {};
    const byName: Record<string, DesignToken> = {};

    for (const token of tokens) {
      // Index by resolved value
      const key = token.resolvedValue.toLowerCase();
      if (!byValue[key]) byValue[key] = [];
      byValue[key].push(token);

      // Index by name (last one wins if duplicates)
      byName[token.name] = token;
    }

    return { byValue, byName, allTokens: tokens };
  }

  /** Infer the category of a token from its name and value */
  static inferCategory(name: string, value: string): TokenCategory {
    const n = name.toLowerCase();
    const v = value.toLowerCase();

    if (n.includes('color') || n.includes('bg') || n.includes('fg') ||
        v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl')) {
      return 'color';
    }
    if (n.includes('spacing') || n.includes('gap') || n.includes('margin') || n.includes('padding')) {
      return 'spacing';
    }
    if (n.includes('radius') || n.includes('rounded')) {
      return 'radius';
    }
    if (n.includes('shadow')) {
      return 'shadow';
    }
    if (n.includes('font') || n.includes('text') || n.includes('line-height') || n.includes('letter')) {
      return 'typography';
    }
    return 'other';
  }
}
