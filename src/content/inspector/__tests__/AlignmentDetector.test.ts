import { AlignmentDetector } from '../AlignmentDetector';

function makeRect(x: number, y: number, w: number, h: number): DOMRect {
  return {
    x, y, width: w, height: h,
    top: y, left: x, right: x + w, bottom: y + h,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('AlignmentDetector', () => {
  let detector: AlignmentDetector;

  beforeEach(() => {
    detector = new AlignmentDetector();
  });

  it('should detect exact same top alignment', () => {
    const a = makeRect(0, 100, 50, 50);
    const b = makeRect(200, 100, 80, 80);
    expect(detector.detect(a, b).alignedTop).toBe(true);
  });

  it('should detect top alignment within 1px tolerance', () => {
    const a = makeRect(0, 100, 50, 50);
    const b = makeRect(200, 101, 80, 80);
    expect(detector.detect(a, b).alignedTop).toBe(true);
  });

  it('should reject top alignment at 3px difference (outside default tolerance)', () => {
    const a = makeRect(0, 100, 50, 50);
    const b = makeRect(200, 103, 80, 80);
    expect(detector.detect(a, b).alignedTop).toBe(false);
  });

  it('should detect exact bottom alignment', () => {
    const a = makeRect(0, 0, 50, 150);
    const b = makeRect(200, 70, 80, 80);
    expect(detector.detect(a, b).alignedBottom).toBe(true);
  });

  it('should detect exact left alignment', () => {
    const a = makeRect(100, 0, 50, 50);
    const b = makeRect(100, 200, 80, 80);
    expect(detector.detect(a, b).alignedLeft).toBe(true);
  });

  it('should detect exact right alignment', () => {
    const a = makeRect(0, 0, 150, 50);
    const b = makeRect(70, 200, 80, 80);
    expect(detector.detect(a, b).alignedRight).toBe(true);
  });

  it('should detect center X alignment', () => {
    // a center = 25, b center = 25
    const a = makeRect(0, 0, 50, 50);
    const b = makeRect(0, 200, 50, 80);
    expect(detector.detect(a, b).alignedCenterX).toBe(true);
  });

  it('should detect center Y alignment', () => {
    // a centerY = 25, b centerY = 25
    const a = makeRect(0, 0, 50, 50);
    const b = makeRect(200, 0, 80, 50);
    expect(detector.detect(a, b).alignedCenterY).toBe(true);
  });

  it('should return tolerance in result', () => {
    const a = makeRect(0, 0, 50, 50);
    const b = makeRect(100, 100, 50, 50);
    expect(detector.detect(a, b).tolerance).toBe(2);
  });

  it('should detect no alignment when rects are unaligned', () => {
    const a = makeRect(0, 0, 50, 50);
    const b = makeRect(200, 200, 80, 80);
    const result = detector.detect(a, b);
    expect(result.alignedTop).toBe(false);
    expect(result.alignedBottom).toBe(false);
    expect(result.alignedLeft).toBe(false);
    expect(result.alignedRight).toBe(false);
    expect(result.alignedCenterX).toBe(false);
    expect(result.alignedCenterY).toBe(false);
  });

  it('should respect custom tolerance — detect at 5px with tolerance=5', () => {
    detector.setTolerance(5);
    const a = makeRect(0, 100, 50, 50);
    const b = makeRect(200, 105, 80, 80);
    expect(detector.detect(a, b).alignedTop).toBe(true);
  });

  it('should respect custom tolerance — reject at 6px with tolerance=5', () => {
    detector.setTolerance(5);
    const a = makeRect(0, 100, 50, 50);
    const b = makeRect(200, 106, 80, 80);
    expect(detector.detect(a, b).alignedTop).toBe(false);
  });
});
