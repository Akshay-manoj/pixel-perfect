import { TypographyInspector } from '../TypographyInspector';

function mockElement(styles: Record<string, string> = {}, textContent = 'Hello'): Element {
  const el = document.createElement('p');
  el.textContent = textContent;
  document.body.appendChild(el);

  const defaultStyles: Record<string, string> = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '1.5',
    letterSpacing: 'normal',
    color: 'rgb(0, 0, 0)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'block',
    position: 'static',
    ...styles,
  };

  jest.spyOn(window, 'getComputedStyle').mockReturnValue({
    ...defaultStyles,
    getPropertyValue: (p: string) => defaultStyles[p] ?? '',
  } as unknown as CSSStyleDeclaration);

  return el;
}

describe('TypographyInspector', () => {
  let inspector: TypographyInspector;

  beforeEach(() => {
    inspector = new TypographyInspector();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('should extract font-family', () => {
    const el = mockElement({ fontFamily: 'Roboto, sans-serif' });
    expect(inspector.inspect(el).fontFamily).toBe('Roboto, sans-serif');
  });

  it('should extract font-size as number', () => {
    const el = mockElement({ fontSize: '24px' });
    expect(inspector.inspect(el).fontSize).toBe(24);
  });

  it('should extract font-weight', () => {
    const el = mockElement({ fontWeight: '700' });
    expect(inspector.inspect(el).fontWeight).toBe('700');
  });

  it('should extract line-height', () => {
    const el = mockElement({ lineHeight: '1.75' });
    expect(inspector.inspect(el).lineHeight).toBe('1.75');
  });

  it('should extract letter-spacing', () => {
    const el = mockElement({ letterSpacing: '0.05em' });
    expect(inspector.inspect(el).letterSpacing).toBe('0.05em');
  });

  it('should normalize color to hex', () => {
    const el = mockElement({ color: 'rgb(59, 130, 246)' });
    expect(inspector.inspect(el).color).toBe('#3b82f6');
  });

  it('should calculate contrast ratio', () => {
    const el = mockElement({ color: 'rgb(0, 0, 0)', backgroundColor: 'rgb(255, 255, 255)' });
    const data = inspector.inspect(el);
    expect(data.contrastRatio).toBeGreaterThan(1);
  });

  it('should determine WCAG AA pass for high contrast', () => {
    const el = mockElement({ color: 'rgb(0, 0, 0)', backgroundColor: 'rgb(255, 255, 255)' });
    const data = inspector.inspect(el);
    expect(data.wcagAA).toBe(true);
  });

  it('should detect text content', () => {
    const el = mockElement({}, 'Some text');
    expect(inspector.hasTextContent(el)).toBe(true);
  });

  it('should detect no text content in empty element', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(inspector.hasTextContent(el)).toBe(false);
  });
});
