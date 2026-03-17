import { TokenMapper } from '../TokenMapper';
import type { TokenMap, DesignToken } from '@shared/types/token.types';

function makeToken(name: string, resolvedValue: string, source: 'page' | 'custom' | 'imported' = 'page'): DesignToken {
  return {
    name,
    rawValue: resolvedValue,
    resolvedValue,
    category: 'other',
    source,
  };
}

function buildMap(tokens: DesignToken[]): TokenMap {
  const byValue: Record<string, DesignToken[]> = {};
  const byName: Record<string, DesignToken> = {};
  for (const t of tokens) {
    const key = t.resolvedValue.toLowerCase();
    if (!byValue[key]) byValue[key] = [];
    byValue[key].push(t);
    byName[t.name] = t;
  }
  return { byValue, byName, allTokens: tokens };
}

describe('TokenMapper', () => {
  it('should find token by exact value match', () => {
    const map = buildMap([makeToken('--spacing-6', '24px')]);
    const mapper = new TokenMapper(map);
    expect(mapper.findToken('24px')?.name).toBe('--spacing-6');
  });

  it('should find token by rgb value matching hex via normalization', () => {
    const map = buildMap([makeToken('--color-primary', '#3b82f6')]);
    const mapper = new TokenMapper(map);
    expect(mapper.findToken('rgb(59, 130, 246)')?.name).toBe('--color-primary');
  });

  it('should find token by hex matching when stored as rgb', () => {
    const map = buildMap([makeToken('--color-primary', 'rgb(59, 130, 246)')]);
    const mapper = new TokenMapper(map);
    expect(mapper.findToken('#3b82f6')?.name).toBe('--color-primary');
  });

  it('should return null for unknown values', () => {
    const map = buildMap([makeToken('--spacing-6', '24px')]);
    const mapper = new TokenMapper(map);
    expect(mapper.findToken('42px')).toBeNull();
  });

  it('should prefer custom token over page token for same value', () => {
    const map = buildMap([
      makeToken('--page-spacing', '16px', 'page'),
      makeToken('--custom-spacing', '16px', 'custom'),
    ]);
    const mapper = new TokenMapper(map);
    expect(mapper.findToken('16px')?.name).toBe('--custom-spacing');
  });

  it('should prefer imported token over page token', () => {
    const map = buildMap([
      makeToken('--page-color', '#ff0000', 'page'),
      makeToken('--imported-color', '#ff0000', 'imported'),
    ]);
    const mapper = new TokenMapper(map);
    expect(mapper.findToken('#ff0000')?.name).toBe('--imported-color');
  });

  it('should prefer most descriptive name when same source', () => {
    const map = buildMap([
      makeToken('--sp-4', '16px', 'page'),
      makeToken('--spacing-4', '16px', 'page'),
    ]);
    const mapper = new TokenMapper(map);
    // Longer name is more descriptive
    expect(mapper.findToken('16px')?.name).toBe('--spacing-4');
  });

  it('should find all tokens for a given value', () => {
    const map = buildMap([
      makeToken('--spacing-4', '16px'),
      makeToken('--size-4', '16px'),
    ]);
    const mapper = new TokenMapper(map);
    expect(mapper.findAllTokens('16px').length).toBe(2);
  });

  it('should return empty array from findAllTokens for unknown value', () => {
    const map = buildMap([]);
    const mapper = new TokenMapper(map);
    expect(mapper.findAllTokens('999px')).toEqual([]);
  });

  it('should map box model margin to token names', () => {
    const map = buildMap([makeToken('--spacing-4', '16px')]);
    const mapper = new TokenMapper(map);
    const boxModel = {
      margin: { top: 16, right: 16, bottom: 16, left: 16 },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      border: { top: 0, right: 0, bottom: 0, left: 0 },
      content: { width: 100, height: 100 },
    };
    const mapped = mapper.mapBoxModel(boxModel);
    expect(mapped.margin.top.tokenName).toBe('--spacing-4');
  });

  it('should map box model padding to Tailwind classes', () => {
    const map = buildMap([]);
    const mapper = new TokenMapper(map);
    const boxModel = {
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 16, right: 24, bottom: 16, left: 24 },
      border: { top: 0, right: 0, bottom: 0, left: 0 },
      content: { width: 100, height: 100 },
    };
    const mapped = mapper.mapBoxModel(boxModel);
    expect(mapped.padding.top.tailwindClass).toBe('pt-4');
    expect(mapped.padding.right.tailwindClass).toBe('pr-6');
  });

  it('should handle case-insensitive value matching', () => {
    const map = buildMap([makeToken('--color-primary', '#3B82F6')]);
    const mapper = new TokenMapper(map);
    // byValue is indexed as lowercase
    expect(mapper.findToken('#3b82f6')?.name).toBe('--color-primary');
  });

  it('should update token map', () => {
    const map1 = buildMap([makeToken('--old', '10px')]);
    const mapper = new TokenMapper(map1);
    expect(mapper.findToken('10px')?.name).toBe('--old');

    const map2 = buildMap([makeToken('--new', '10px')]);
    mapper.updateTokenMap(map2);
    expect(mapper.findToken('10px')?.name).toBe('--new');
  });

  it('should not produce tailwind class for unmapped border values', () => {
    const map = buildMap([]);
    const mapper = new TokenMapper(map);
    const boxModel = {
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      border: { top: 1, right: 1, bottom: 1, left: 1 },
      content: { width: 100, height: 100 },
    };
    const mapped = mapper.mapBoxModel(boxModel);
    expect(mapped.border.top.tailwindClass).toBeUndefined();
  });
});
