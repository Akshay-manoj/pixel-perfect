import { TokenScanner } from '../TokenScanner';

function createMockStyleSheet(rules: Array<{ selector: string; properties: Record<string, string> }>): CSSStyleSheet {
  const cssRules = rules.map((r) => {
    const props: string[] = [];
    const propNames: string[] = [];
    for (const [name, value] of Object.entries(r.properties)) {
      props.push(`${name}: ${value}`);
      propNames.push(name);
    }
    return {
      style: {
        length: propNames.length,
        [Symbol.iterator]: function* () { yield* propNames; },
        getPropertyValue: (prop: string) => r.properties[prop] ?? '',
        ...Object.fromEntries(propNames.map((n, i) => [i, n])),
      } as unknown as CSSStyleDeclaration,
      selectorText: r.selector,
    } as unknown as CSSStyleRule;
  });

  // Make each rule pass instanceof CSSStyleRule
  for (const rule of cssRules) {
    Object.setPrototypeOf(rule, CSSStyleRule.prototype);
  }

  return {
    cssRules: {
      length: cssRules.length,
      [Symbol.iterator]: function* () { yield* cssRules; },
      ...Object.fromEntries(cssRules.map((r, i) => [i, r])),
    } as unknown as CSSRuleList,
  } as unknown as CSSStyleSheet;
}

function mockDocumentStyleSheets(sheets: CSSStyleSheet[]): void {
  Object.defineProperty(document, 'styleSheets', {
    value: {
      length: sheets.length,
      [Symbol.iterator]: function* () { yield* sheets; },
      ...Object.fromEntries(sheets.map((s, i) => [i, s])),
    },
    configurable: true,
  });
}

describe('TokenScanner', () => {
  let scanner: TokenScanner;
  let originalGetComputedStyle: typeof window.getComputedStyle;

  beforeEach(() => {
    scanner = new TokenScanner();
    originalGetComputedStyle = window.getComputedStyle;

    // Mock getComputedStyle for documentElement
    window.getComputedStyle = jest.fn().mockReturnValue({
      getPropertyValue: (prop: string) => {
        const values: Record<string, string> = {
          '--color-primary': '#3B82F6',
          '--spacing-4': '16px',
          '--spacing-6': '24px',
          '--radius-md': '6px',
          '--font-sans': 'Inter, sans-serif',
        };
        return values[prop] ?? '';
      },
    });
  });

  afterEach(() => {
    scanner.destroy();
    window.getComputedStyle = originalGetComputedStyle;
  });

  it('should scan CSS custom properties from stylesheets', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--color-primary': '#3B82F6', '--spacing-4': '16px' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.allTokens.length).toBe(2);
    expect(map.byName['--color-primary']).toBeDefined();
    expect(map.byName['--spacing-4']).toBeDefined();
  });

  it('should skip --tw- prefixed properties', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--tw-ring-color': 'blue', '--color-primary': '#3B82F6' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.allTokens.length).toBe(1);
    expect(map.byName['--tw-ring-color']).toBeUndefined();
  });

  it('should resolve computed values via getComputedStyle', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--color-primary': '#3B82F6' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.byName['--color-primary'].resolvedValue).toBe('#3B82F6');
  });

  it('should build byValue index', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--spacing-4': '16px' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.byValue['16px']).toBeDefined();
    expect(map.byValue['16px'].length).toBe(1);
  });

  it('should infer color category from hex values', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--color-primary': '#3B82F6' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.byName['--color-primary'].category).toBe('color');
  });

  it('should infer spacing category from name', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--spacing-4': '16px' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.byName['--spacing-4'].category).toBe('spacing');
  });

  it('should infer radius category from name', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--radius-md': '6px' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.byName['--radius-md'].category).toBe('radius');
  });

  it('should set source to page', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--color-primary': '#3B82F6' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.byName['--color-primary'].source).toBe('page');
  });

  it('should handle empty stylesheets', () => {
    mockDocumentStyleSheets([]);
    const map = scanner.scan();
    expect(map.allTokens.length).toBe(0);
  });

  it('should handle stylesheets with no custom properties', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: 'body', properties: {} },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.allTokens.length).toBe(0);
  });

  it('should handle multiple stylesheets', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--color-primary': '#3B82F6' } },
      ]),
      createMockStyleSheet([
        { selector: ':root', properties: { '--spacing-6': '24px' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(map.allTokens.length).toBe(2);
  });

  it('should return the same map from getTokenMap after scan', () => {
    mockDocumentStyleSheets([
      createMockStyleSheet([
        { selector: ':root', properties: { '--color-primary': '#3B82F6' } },
      ]),
    ]);

    const map = scanner.scan();
    expect(scanner.getTokenMap()).toBe(map);
  });
});
