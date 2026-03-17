import { TailwindMapper } from '../TailwindMapper';

describe('TailwindMapper', () => {
  let mapper: TailwindMapper;

  beforeEach(() => {
    mapper = new TailwindMapper();
  });

  describe('mapSpacing', () => {
    it('should map 24px margin to m-6', () => {
      expect(mapper.mapSpacing(24, 'margin')).toBe('m-6');
    });

    it('should map 16px padding to p-4', () => {
      expect(mapper.mapSpacing(16, 'padding')).toBe('p-4');
    });

    it('should map 0px to m-0', () => {
      expect(mapper.mapSpacing(0, 'margin')).toBe('m-0');
    });

    it('should map 1px to m-px', () => {
      expect(mapper.mapSpacing(1, 'margin')).toBe('m-px');
    });

    it('should map 8px gap to gap-2', () => {
      expect(mapper.mapSpacing(8, 'gap')).toBe('gap-2');
    });

    it('should map 32px width to w-8', () => {
      expect(mapper.mapSpacing(32, 'width')).toBe('w-8');
    });

    it('should return null for unmapped spacing value', () => {
      expect(mapper.mapSpacing(13, 'margin')).toBeNull();
    });

    it('should map 96px padding to p-24', () => {
      expect(mapper.mapSpacing(96, 'padding')).toBe('p-24');
    });
  });

  describe('mapBorderRadius', () => {
    it('should map 4px to rounded (default)', () => {
      expect(mapper.mapBorderRadius(4)).toBe('rounded');
    });

    it('should map 8px to rounded-lg', () => {
      expect(mapper.mapBorderRadius(8)).toBe('rounded-lg');
    });

    it('should map 9999px to rounded-full', () => {
      expect(mapper.mapBorderRadius(9999)).toBe('rounded-full');
    });

    it('should map 0px to rounded-none', () => {
      expect(mapper.mapBorderRadius(0)).toBe('rounded-none');
    });

    it('should return null for unmapped radius value', () => {
      expect(mapper.mapBorderRadius(5)).toBeNull();
    });
  });

  describe('mapFontSize', () => {
    it('should map 16px to text-base', () => {
      expect(mapper.mapFontSize(16)).toBe('text-base');
    });

    it('should map 14px to text-sm', () => {
      expect(mapper.mapFontSize(14)).toBe('text-sm');
    });

    it('should return null for unmapped font size', () => {
      expect(mapper.mapFontSize(15)).toBeNull();
    });
  });

  describe('mapColor', () => {
    it('should map #3B82F6 to blue-500', () => {
      expect(mapper.mapColor('#3B82F6')).toBe('blue-500');
    });

    it('should map #EF4444 to red-500', () => {
      expect(mapper.mapColor('#EF4444')).toBe('red-500');
    });

    it('should return null for unmapped color', () => {
      expect(mapper.mapColor('#123456')).toBeNull();
    });
  });
});
