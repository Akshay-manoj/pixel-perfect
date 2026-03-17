import { GridInspector } from '../GridInspector';

function mockElement(display: string, props: Record<string, string> = {}, childCount = 0): Element {
  const el = document.createElement('div');
  document.body.appendChild(el);

  const styles: Record<string, string> = {
    display,
    gridTemplateColumns: 'none',
    gridTemplateRows: 'none',
    gridTemplateAreas: 'none',
    columnGap: '0px',
    rowGap: '0px',
    ...props,
  };

  jest.spyOn(window, 'getComputedStyle').mockImplementation((target) => {
    if (target === el) {
      return { ...styles, getPropertyValue: (p: string) => styles[p] ?? '' } as unknown as CSSStyleDeclaration;
    }
    return {
      gridColumn: 'auto', gridRow: 'auto', gridArea: 'auto',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration;
  });

  for (let i = 0; i < childCount; i++) {
    el.appendChild(document.createElement('div'));
  }

  return el;
}

describe('GridInspector', () => {
  let inspector: GridInspector;

  beforeEach(() => {
    inspector = new GridInspector();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('should detect a grid container', () => {
    const el = mockElement('grid');
    expect(inspector.isGridContainer(el)).toBe(true);
  });

  it('should detect an inline-grid container', () => {
    const el = mockElement('inline-grid');
    expect(inspector.isGridContainer(el)).toBe(true);
  });

  it('should not detect a flex element as grid', () => {
    const el = mockElement('flex');
    expect(inspector.isGridContainer(el)).toBe(false);
  });

  it('should return null for non-grid element', () => {
    const el = mockElement('block');
    expect(inspector.inspect(el)).toBeNull();
  });

  it('should extract grid-template-columns', () => {
    const el = mockElement('grid', { gridTemplateColumns: '1fr 2fr' });
    const data = inspector.inspect(el);
    expect(data?.templateColumns).toBe('1fr 2fr');
  });

  it('should extract column-gap and row-gap', () => {
    const el = mockElement('grid', { columnGap: '16px', rowGap: '8px' });
    const data = inspector.inspect(el);
    expect(data?.columnGap).toBe(16);
    expect(data?.rowGap).toBe(8);
  });

  it('should collect grid children', () => {
    const el = mockElement('grid', {}, 4);
    const data = inspector.inspect(el);
    expect(data?.children.length).toBe(4);
  });

  it('should extract grid-template-areas', () => {
    const el = mockElement('grid', { gridTemplateAreas: '"header" "main" "footer"' });
    const data = inspector.inspect(el);
    expect(data?.templateAreas).toBe('"header" "main" "footer"');
  });
});
