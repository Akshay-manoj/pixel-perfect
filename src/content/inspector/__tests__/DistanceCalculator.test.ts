import { DistanceCalculator } from '../DistanceCalculator';

function makeRect(x: number, y: number, w: number, h: number): DOMRect {
  return {
    x, y, width: w, height: h,
    top: y, left: x, right: x + w, bottom: y + h,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('DistanceCalculator', () => {
  let calc: DistanceCalculator;

  beforeEach(() => {
    calc = new DistanceCalculator();
  });

  describe('calculate', () => {
    it('should compute left gap when A is left of B with 24px gap', () => {
      const a = makeRect(0, 0, 100, 100);
      const b = makeRect(124, 0, 100, 100);
      const result = calc.calculate(a, b);
      expect(result.left).toBe(24);
      expect(result.isOverlapping).toBe(false);
    });

    it('should compute right gap when B is left of A', () => {
      const a = makeRect(124, 0, 100, 100);
      const b = makeRect(0, 0, 100, 100);
      const result = calc.calculate(a, b);
      expect(result.right).toBe(24);
    });

    it('should compute top gap when A is above B with 16px gap', () => {
      const a = makeRect(0, 0, 100, 100);
      const b = makeRect(0, 116, 100, 100);
      const result = calc.calculate(a, b);
      expect(result.top).toBe(16);
      expect(result.isOverlapping).toBe(false);
    });

    it('should compute bottom gap when B is above A', () => {
      const a = makeRect(0, 116, 100, 100);
      const b = makeRect(0, 0, 100, 100);
      const result = calc.calculate(a, b);
      expect(result.bottom).toBe(16);
    });

    it('should detect overlapping rects', () => {
      const a = makeRect(0, 0, 100, 100);
      const b = makeRect(50, 50, 100, 100);
      const result = calc.calculate(a, b);
      expect(result.isOverlapping).toBe(true);
    });

    it('should return negative edge distances and overlapping for same rect', () => {
      const a = makeRect(10, 10, 100, 100);
      const b = makeRect(10, 10, 100, 100);
      const result = calc.calculate(a, b);
      // top = b.top - a.bottom = 10 - 110 = -100
      expect(result.top).toBe(-100);
      expect(result.bottom).toBe(-100);
      expect(result.left).toBe(-100);
      expect(result.right).toBe(-100);
      expect(result.horizontal).toBe(0);
      expect(result.vertical).toBe(0);
      expect(result.isOverlapping).toBe(true);
    });

    it('should return only positive top when A is directly above B', () => {
      const a = makeRect(50, 0, 100, 50);
      const b = makeRect(50, 80, 100, 50);
      const result = calc.calculate(a, b);
      expect(result.top).toBe(30);
      // bottom = a.top - b.bottom = 0 - 130 = -130
      expect(result.bottom).toBe(-130);
    });

    it('should compute horizontal center-to-center distance', () => {
      const a = makeRect(0, 0, 100, 100);   // centerX = 50
      const b = makeRect(200, 0, 100, 100); // centerX = 250
      const result = calc.calculate(a, b);
      expect(result.horizontal).toBe(200);
    });

    it('should compute vertical center-to-center distance', () => {
      const a = makeRect(0, 0, 100, 100);   // centerY = 50
      const b = makeRect(0, 200, 100, 100); // centerY = 250
      const result = calc.calculate(a, b);
      expect(result.vertical).toBe(200);
    });

    it('should return negative distances for overlap on each side', () => {
      const a = makeRect(0, 0, 200, 200);
      const b = makeRect(50, 50, 100, 100);
      const result = calc.calculate(a, b);
      // b.top - a.bottom = 50 - 200 = -150
      expect(result.top).toBeLessThan(0);
      expect(result.isOverlapping).toBe(true);
    });

    it('should handle adjacent rects with zero gap', () => {
      const a = makeRect(0, 0, 100, 100);
      const b = makeRect(100, 0, 100, 100);
      const result = calc.calculate(a, b);
      expect(result.left).toBe(0);
      expect(result.isOverlapping).toBe(false);
    });

    it('should handle rects touching at bottom-top edge', () => {
      const a = makeRect(0, 0, 100, 100);
      const b = makeRect(0, 100, 100, 100);
      const result = calc.calculate(a, b);
      expect(result.top).toBe(0);
      expect(result.isOverlapping).toBe(false);
    });

    it('should compute negative horizontal center distance when B is to the left', () => {
      const a = makeRect(200, 0, 100, 100); // centerX = 250
      const b = makeRect(0, 0, 100, 100);   // centerX = 50
      const result = calc.calculate(a, b);
      expect(result.horizontal).toBe(-200);
    });

    it('should compute negative vertical center distance when B is above', () => {
      const a = makeRect(0, 200, 100, 100); // centerY = 250
      const b = makeRect(0, 0, 100, 100);   // centerY = 50
      const result = calc.calculate(a, b);
      expect(result.vertical).toBe(-200);
    });

    it('should handle diagonal rects with gap on both axes', () => {
      const a = makeRect(0, 0, 50, 50);
      const b = makeRect(100, 100, 50, 50);
      const result = calc.calculate(a, b);
      expect(result.top).toBe(50);
      expect(result.left).toBe(50);
      expect(result.isOverlapping).toBe(false);
    });

    it('should handle very large distances', () => {
      const a = makeRect(0, 0, 10, 10);
      const b = makeRect(10000, 0, 10, 10);
      const result = calc.calculate(a, b);
      expect(result.left).toBe(9990);
    });

    it('should handle rects with zero dimensions', () => {
      const a = makeRect(50, 50, 0, 0);
      const b = makeRect(100, 100, 0, 0);
      const result = calc.calculate(a, b);
      expect(result.horizontal).toBe(50);
      expect(result.vertical).toBe(50);
      expect(result.isOverlapping).toBe(false);
    });
  });

  describe('getNearestEdgeDistance', () => {
    it('should return the smallest positive edge distance', () => {
      const a = makeRect(0, 0, 100, 100);
      const b = makeRect(120, 50, 100, 100);
      const result = calc.getNearestEdgeDistance(a, b);
      expect(result).toBe(20); // left gap of 20
    });

    it('should return 0 for overlapping rects', () => {
      const a = makeRect(0, 0, 100, 100);
      const b = makeRect(50, 50, 100, 100);
      expect(calc.getNearestEdgeDistance(a, b)).toBe(0);
    });
  });
});
