import { TokenImporter } from '../TokenImporter';

describe('TokenImporter', () => {
  describe('parseStyleDictionary', () => {
    it('should parse flat Style Dictionary tokens', () => {
      const json = {
        color: {
          primary: { value: '#3B82F6' },
          secondary: { value: '#6366F1' },
        },
      };
      const tokens = TokenImporter.parseStyleDictionary(json);
      expect(tokens.length).toBe(2);
      expect(tokens[0].name).toBe('--color-primary');
      expect(tokens[0].rawValue).toBe('#3B82F6');
    });

    it('should parse nested Style Dictionary tokens', () => {
      const json = {
        spacing: {
          sm: { value: '8px' },
          md: { value: '16px' },
          lg: { value: '24px' },
        },
      };
      const tokens = TokenImporter.parseStyleDictionary(json);
      expect(tokens.length).toBe(3);
      expect(tokens[0].name).toBe('--spacing-sm');
    });

    it('should set source to imported', () => {
      const json = { color: { primary: { value: '#3B82F6' } } };
      const tokens = TokenImporter.parseStyleDictionary(json);
      expect(tokens[0].source).toBe('imported');
    });

    it('should handle empty JSON', () => {
      expect(TokenImporter.parseStyleDictionary({}).length).toBe(0);
    });

    it('should handle deeply nested tokens', () => {
      const json = {
        theme: { dark: { color: { bg: { value: '#1E1E2E' } } } },
      };
      const tokens = TokenImporter.parseStyleDictionary(json);
      expect(tokens[0].name).toBe('--theme-dark-color-bg');
    });
  });

  describe('parseFigmaTokens', () => {
    it('should parse Figma Tokens format', () => {
      const json = {
        global: {
          'color-primary': { value: '#3B82F6', type: 'color' },
          'spacing-4': { value: '16px', type: 'spacing' },
        },
      };
      const tokens = TokenImporter.parseFigmaTokens(json);
      expect(tokens.length).toBe(2);
      expect(tokens[0].name).toBe('--global-color-primary');
    });

    it('should handle nested Figma Token groups', () => {
      const json = {
        core: {
          colors: {
            brand: { value: '#FF0000', type: 'color' },
          },
        },
      };
      const tokens = TokenImporter.parseFigmaTokens(json);
      expect(tokens[0].name).toBe('--core-colors-brand');
    });

    it('should handle empty groups', () => {
      expect(TokenImporter.parseFigmaTokens({}).length).toBe(0);
    });
  });

  describe('inferCategory', () => {
    it('should infer color from hex value', () => {
      expect(TokenImporter.inferCategory('--primary', '#3B82F6')).toBe('color');
    });

    it('should infer spacing from name', () => {
      expect(TokenImporter.inferCategory('--spacing-4', '16px')).toBe('spacing');
    });

    it('should infer radius from name', () => {
      expect(TokenImporter.inferCategory('--radius-md', '6px')).toBe('radius');
    });

    it('should return other for unrecognized tokens', () => {
      expect(TokenImporter.inferCategory('--custom-thing', '42')).toBe('other');
    });
  });
});
