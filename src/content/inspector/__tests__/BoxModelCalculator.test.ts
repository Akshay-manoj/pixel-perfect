import { BoxModelCalculator } from '../BoxModelCalculator';

function createMockElement(styles: Record<string, string> = {}, rect?: Partial<DOMRect>): Element {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const defaultRect = {
    top: 100,
    left: 100,
    right: 300,
    bottom: 250,
    width: 200,
    height: 150,
    x: 100,
    y: 100,
    toJSON: () => ({}),
    ...rect,
  };

  jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(defaultRect as DOMRect);

  const defaultStyles: Record<string, string> = {
    marginTop: '16px',
    marginRight: '16px',
    marginBottom: '16px',
    marginLeft: '16px',
    paddingTop: '24px',
    paddingRight: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    ...styles,
  };

  jest.spyOn(window, 'getComputedStyle').mockReturnValue(defaultStyles as unknown as CSSStyleDeclaration);

  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

describe('BoxModelCalculator', () => {
  it('should calculate margin values correctly', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement({ marginTop: '16px', marginRight: '24px', marginBottom: '16px', marginLeft: '24px' });
    const info = calc.calculate(el);

    expect(info.boxModel.margin.top).toBe(16);
    expect(info.boxModel.margin.right).toBe(24);
    expect(info.boxModel.margin.bottom).toBe(16);
    expect(info.boxModel.margin.left).toBe(24);
  });

  it('should calculate padding values correctly', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement({ paddingTop: '8px', paddingRight: '12px', paddingBottom: '16px', paddingLeft: '20px' });
    const info = calc.calculate(el);

    expect(info.boxModel.padding.top).toBe(8);
    expect(info.boxModel.padding.right).toBe(12);
    expect(info.boxModel.padding.bottom).toBe(16);
    expect(info.boxModel.padding.left).toBe(20);
  });

  it('should calculate border values correctly', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement({ borderTopWidth: '2px', borderRightWidth: '2px', borderBottomWidth: '2px', borderLeftWidth: '2px' });
    const info = calc.calculate(el);

    expect(info.boxModel.border.top).toBe(2);
    expect(info.boxModel.border.right).toBe(2);
  });

  it('should calculate content dimensions', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement({
      paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px', paddingLeft: '10px',
      borderTopWidth: '1px', borderRightWidth: '1px', borderBottomWidth: '1px', borderLeftWidth: '1px',
    }, { width: 200, height: 150 });
    const info = calc.calculate(el);

    // content = 200 - 10 - 10 - 1 - 1 = 178
    expect(info.boxModel.content.width).toBe(178);
    // content = 150 - 10 - 10 - 1 - 1 = 128
    expect(info.boxModel.content.height).toBe(128);
  });

  it('should cache results per element', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement();

    const info1 = calc.calculate(el);
    const info2 = calc.calculate(el);

    expect(info1).toBe(info2); // same reference
  });

  it('should return fresh result after invalidate', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement();

    const info1 = calc.calculate(el);
    calc.invalidate(el);
    const info2 = calc.calculate(el);

    expect(info1).not.toBe(info2); // different reference
  });

  it('should clear entire cache', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement();

    const info1 = calc.calculate(el);
    calc.clearCache();
    const info2 = calc.calculate(el);

    expect(info1).not.toBe(info2);
  });

  it('should include selector in ElementInfo', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement();
    el.id = 'test-el';

    const info = calc.calculate(el);
    expect(info.selector).toContain('test-el');
  });

  it('should include tagName and classList', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement();
    el.classList.add('card', 'featured');

    const info = calc.calculate(el);
    expect(info.tagName).toBe('div');
    expect(info.classList).toContain('card');
    expect(info.classList).toContain('featured');
  });

  it('should handle "auto" margin as 0', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement({ marginTop: 'auto', marginBottom: 'auto' });
    const info = calc.calculate(el);

    expect(info.boxModel.margin.top).toBe(0);
    expect(info.boxModel.margin.bottom).toBe(0);
  });

  it('should handle subpixel values', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement({ marginTop: '16.5px' });
    const info = calc.calculate(el);

    expect(info.boxModel.margin.top).toBe(16.5);
  });

  it('should handle zero values', () => {
    const calc = new BoxModelCalculator();
    const el = createMockElement({ marginTop: '0px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px' });
    const info = calc.calculate(el);

    expect(info.boxModel.margin.top).toBe(0);
    expect(info.boxModel.margin.right).toBe(0);
  });

  describe('parseEdgeValues', () => {
    it('should parse single value "16px" to all sides', () => {
      const calc = new BoxModelCalculator();
      const result = calc.parseEdgeValues('16px');
      expect(result).toEqual({ top: 16, right: 16, bottom: 16, left: 16 });
    });

    it('should parse two values "16px 24px"', () => {
      const calc = new BoxModelCalculator();
      const result = calc.parseEdgeValues('16px 24px');
      expect(result).toEqual({ top: 16, right: 24, bottom: 16, left: 24 });
    });

    it('should parse four values "8px 12px 16px 20px"', () => {
      const calc = new BoxModelCalculator();
      const result = calc.parseEdgeValues('8px 12px 16px 20px');
      expect(result).toEqual({ top: 8, right: 12, bottom: 16, left: 20 });
    });
  });
});
