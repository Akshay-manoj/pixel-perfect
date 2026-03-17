import {
  rgbToHex,
  hexToRgb,
  normalizeColor,
  getContrastRatio,
  isWCAGCompliant,
  parseRGBAString,
} from '../color.utils';

describe('color.utils', () => {
  describe('rgbToHex', () => {
    it('should convert rgb(59, 130, 246) to #3b82f6', () => {
      expect(rgbToHex('rgb(59, 130, 246)')).toBe('#3b82f6');
    });

    it('should convert rgb(0, 0, 0) to #000000', () => {
      expect(rgbToHex('rgb(0, 0, 0)')).toBe('#000000');
    });

    it('should convert rgb(255, 255, 255) to #ffffff', () => {
      expect(rgbToHex('rgb(255, 255, 255)')).toBe('#ffffff');
    });
  });

  describe('hexToRgb', () => {
    it('should convert #3b82f6 to components', () => {
      expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 });
    });

    it('should handle shorthand hex #000', () => {
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
    });

    it('should handle shorthand hex #fff', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    });
  });

  describe('normalizeColor', () => {
    it('should normalize rgb to hex', () => {
      expect(normalizeColor('rgb(59, 130, 246)')).toBe('#3b82f6');
    });

    it('should lowercase hex', () => {
      expect(normalizeColor('#3B82F6')).toBe('#3b82f6');
    });

    it('should handle already lowercase hex', () => {
      expect(normalizeColor('#3b82f6')).toBe('#3b82f6');
    });
  });

  describe('getContrastRatio', () => {
    it('should return 21 for black on white', () => {
      expect(getContrastRatio('#000000', '#ffffff')).toBe(21);
    });

    it('should return 1 for white on white', () => {
      expect(getContrastRatio('#ffffff', '#ffffff')).toBe(1);
    });

    it('should handle rgb string input', () => {
      const ratio = getContrastRatio('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
      expect(ratio).toBe(21);
    });
  });

  describe('isWCAGCompliant', () => {
    it('should pass AA at 4.5 ratio', () => {
      expect(isWCAGCompliant(4.5, 'AA')).toBe(true);
    });

    it('should fail AA at 4.4 ratio', () => {
      expect(isWCAGCompliant(4.4, 'AA')).toBe(false);
    });

    it('should pass AAA at 7 ratio', () => {
      expect(isWCAGCompliant(7, 'AAA')).toBe(true);
    });

    it('should pass AA for large text at 3 ratio', () => {
      expect(isWCAGCompliant(3, 'AA', true)).toBe(true);
    });
  });

  describe('parseRGBAString', () => {
    it('should parse rgba with alpha', () => {
      expect(parseRGBAString('rgba(59, 130, 246, 0.5)')).toEqual({
        r: 59,
        g: 130,
        b: 246,
        a: 0.5,
      });
    });

    it('should parse rgb without alpha', () => {
      expect(parseRGBAString('rgb(59, 130, 246)')).toEqual({
        r: 59,
        g: 130,
        b: 246,
        a: 1,
      });
    });

    it('should return null for invalid input', () => {
      expect(parseRGBAString('not-a-color')).toBeNull();
    });
  });
});
