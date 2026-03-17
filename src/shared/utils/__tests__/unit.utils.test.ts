import {
  pxToRem,
  remToPx,
  roundToDecimal,
  formatPx,
  formatRem,
  snapToGrid,
  isOnGrid,
  parsePixelValue,
} from '../unit.utils';

describe('unit.utils', () => {
  describe('pxToRem', () => {
    it('should convert 24px to 1.5rem with default base', () => {
      expect(pxToRem(24)).toBe(1.5);
    });

    it('should convert 24px to 2.4rem with custom base 10', () => {
      expect(pxToRem(24, 10)).toBe(2.4);
    });

    it('should return 0 for 0px', () => {
      expect(pxToRem(0)).toBe(0);
    });

    it('should return 0 when base is 0', () => {
      expect(pxToRem(24, 0)).toBe(0);
    });
  });

  describe('remToPx', () => {
    it('should convert 1.5rem to 24px with default base', () => {
      expect(remToPx(1.5)).toBe(24);
    });

    it('should convert 1.5rem to 15px with custom base 10', () => {
      expect(remToPx(1.5, 10)).toBe(15);
    });
  });

  describe('roundToDecimal', () => {
    it('should round 1.555 to 1.56 with 2 decimals', () => {
      expect(roundToDecimal(1.555, 2)).toBe(1.56);
    });

    it('should round 24 to 24 with 0 decimals', () => {
      expect(roundToDecimal(24, 0)).toBe(24);
    });
  });

  describe('formatPx', () => {
    it('should format 24 as "24px"', () => {
      expect(formatPx(24)).toBe('24px');
    });

    it('should format 0 as "0px"', () => {
      expect(formatPx(0)).toBe('0px');
    });
  });

  describe('formatRem', () => {
    it('should format 1.5 as "1.5rem"', () => {
      expect(formatRem(1.5)).toBe('1.5rem');
    });
  });

  describe('snapToGrid', () => {
    it('should snap 13 to 16 on 8pt grid', () => {
      expect(snapToGrid(13, 8)).toBe(16);
    });

    it('should snap 11 to 8 on 8pt grid', () => {
      expect(snapToGrid(11, 8)).toBe(8);
    });

    it('should snap 0 to 0', () => {
      expect(snapToGrid(0, 8)).toBe(0);
    });

    it('should return value unchanged when gridUnit is 0', () => {
      expect(snapToGrid(13, 0)).toBe(13);
    });
  });

  describe('isOnGrid', () => {
    it('should return true for 16 on 8pt grid', () => {
      expect(isOnGrid(16, 8)).toBe(true);
    });

    it('should return false for 13 on 8pt grid', () => {
      expect(isOnGrid(13, 8)).toBe(false);
    });

    it('should return true for 14 on 8pt grid with tolerance 2', () => {
      expect(isOnGrid(14, 8, 2)).toBe(true);
    });

    it('should return true when gridUnit is 0', () => {
      expect(isOnGrid(13, 0)).toBe(true);
    });
  });

  describe('parsePixelValue', () => {
    it('should parse "24px" to 24', () => {
      expect(parsePixelValue('24px')).toBe(24);
    });

    it('should parse "auto" to 0', () => {
      expect(parsePixelValue('auto')).toBe(0);
    });

    it('should parse "0" to 0', () => {
      expect(parsePixelValue('0')).toBe(0);
    });

    it('should parse empty string to 0', () => {
      expect(parsePixelValue('')).toBe(0);
    });

    it('should parse "16.5px" to 16.5', () => {
      expect(parsePixelValue('16.5px')).toBe(16.5);
    });

    it('should parse "none" to 0', () => {
      expect(parsePixelValue('none')).toBe(0);
    });
  });
});
