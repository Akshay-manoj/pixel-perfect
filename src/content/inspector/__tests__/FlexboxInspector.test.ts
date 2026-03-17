import { FlexboxInspector } from '../FlexboxInspector';

function mockElement(display: string, props: Record<string, string> = {}, childCount = 0): Element {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const styles: Record<string, string> = {
    display,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: '0px',
    ...props,
  };

  jest.spyOn(window, 'getComputedStyle').mockImplementation((target) => {
    if (target === el) {
      return { ...styles, getPropertyValue: (p: string) => styles[p] ?? '' } as unknown as CSSStyleDeclaration;
    }
    // Child styles
    return {
      flexGrow: '0', flexShrink: '1', flexBasis: 'auto', order: '0',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration;
  });

  for (let i = 0; i < childCount; i++) {
    el.appendChild(document.createElement('div'));
  }

  return el;
}

describe('FlexboxInspector', () => {
  let inspector: FlexboxInspector;

  beforeEach(() => {
    inspector = new FlexboxInspector();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('should detect a flex container', () => {
    const el = mockElement('flex');
    expect(inspector.isFlexContainer(el)).toBe(true);
  });

  it('should detect an inline-flex container', () => {
    const el = mockElement('inline-flex');
    expect(inspector.isFlexContainer(el)).toBe(true);
  });

  it('should not detect a block element as flex', () => {
    const el = mockElement('block');
    expect(inspector.isFlexContainer(el)).toBe(false);
  });

  it('should return null for non-flex element', () => {
    const el = mockElement('block');
    expect(inspector.inspect(el)).toBeNull();
  });

  it('should extract flex-direction', () => {
    const el = mockElement('flex', { flexDirection: 'column' });
    const data = inspector.inspect(el);
    expect(data?.direction).toBe('column');
  });

  it('should extract justify-content', () => {
    const el = mockElement('flex', { justifyContent: 'center' });
    const data = inspector.inspect(el);
    expect(data?.justifyContent).toBe('center');
  });

  it('should extract align-items', () => {
    const el = mockElement('flex', { alignItems: 'center' });
    const data = inspector.inspect(el);
    expect(data?.alignItems).toBe('center');
  });

  it('should extract gap', () => {
    const el = mockElement('flex', { gap: '16px' });
    const data = inspector.inspect(el);
    expect(data?.gap).toBe(16);
  });

  it('should extract flex-wrap', () => {
    const el = mockElement('flex', { flexWrap: 'wrap' });
    const data = inspector.inspect(el);
    expect(data?.wrap).toBe('wrap');
  });

  it('should collect child data', () => {
    const el = mockElement('flex', {}, 3);
    const data = inspector.inspect(el);
    expect(data?.children.length).toBe(3);
  });
});
