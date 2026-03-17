import { SpacingAuditor } from '../SpacingAuditor';

function setupDOM(elements: Array<{ tag?: string; styles: Record<string, string>; parent?: Element }>): void {
  for (const { tag, styles, parent } of elements) {
    const el = document.createElement(tag || 'div');
    const allStyles: Record<string, string> = {
      display: 'block', visibility: 'visible',
      marginTop: '0px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      ...styles,
    };

    // Mock getBoundingClientRect
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, right: 100, bottom: 50, width: 100, height: 50, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);

    (parent || document.body).appendChild(el);
  }

  // Mock getComputedStyle to return styles based on element's data
  const origGetComputedStyle = window.getComputedStyle;
  jest.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
    // Find matching element's styles from inline or return defaults
    const mockStyles: Record<string, string> = {
      display: 'block', visibility: 'visible',
      marginTop: '0px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
    };
    // Read from element's data attribute if set
    const data = (el as HTMLElement).dataset?.styles;
    if (data) {
      Object.assign(mockStyles, JSON.parse(data));
    }
    return { ...mockStyles, getPropertyValue: (p: string) => mockStyles[p] ?? '' } as unknown as CSSStyleDeclaration;
  });
}

describe('SpacingAuditor', () => {
  let auditor: SpacingAuditor;

  beforeEach(() => {
    auditor = new SpacingAuditor();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('should return empty array for empty page', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '0px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);
    const issues = auditor.run(8);
    expect(issues).toEqual([]);
  });

  it('should detect off-grid spacing values', () => {
    const el = document.createElement('div');
    el.dataset.styles = JSON.stringify({ marginTop: '13px' });
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '13px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    const offGrid = issues.filter((i) => i.type === 'off-grid');
    expect(offGrid.length).toBeGreaterThan(0);
  });

  it('should not flag on-grid values', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '16px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '8px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    const offGrid = issues.filter((i) => i.type === 'off-grid');
    expect(offGrid.length).toBe(0);
  });

  it('should include nearestGridValue in off-grid issues', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '13px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    const offGrid = issues.find((i) => i.type === 'off-grid');
    expect(offGrid?.nearestGridValue).toBe(16);
  });

  it('should detect magic numbers', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '37px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    const magic = issues.filter((i) => i.type === 'magic-number');
    expect(magic.length).toBeGreaterThan(0);
  });

  it('should set off-grid severity to warning', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '13px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    const offGrid = issues.find((i) => i.type === 'off-grid');
    expect(offGrid?.severity).toBe('warning');
  });

  it('should set magic number severity to info', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '37px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    const magic = issues.find((i) => i.type === 'magic-number');
    expect(magic?.severity).toBe('info');
  });

  it('should skip hidden elements', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'none', visibility: 'hidden',
      marginTop: '13px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    expect(issues.length).toBe(0);
  });

  it('should skip pixelperfect elements', () => {
    const el = document.createElement('div');
    el.setAttribute('data-pixelperfect', 'overlay');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '13px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    expect(issues.length).toBe(0);
  });

  it('should handle different grid units', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '20px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    // 20px is on grid for 4pt unit
    const issuesOn = auditor.run(4);
    expect(issuesOn.filter((i) => i.type === 'off-grid').length).toBe(0);

    // 20px is off grid for 12pt unit (20%12=8, tolerance=2, 12-8=4 > 2)
    const issuesOff = auditor.run(12);
    expect(issuesOff.filter((i) => i.type === 'off-grid').length).toBeGreaterThan(0);
  });

  it('should include value in issue', () => {
    const el = document.createElement('div');
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({ width: 100, height: 50, top: 0, left: 0, right: 100, bottom: 50, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible',
      marginTop: '13px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px',
      paddingTop: '0px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px',
      gap: '0px',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run(8);
    const issue = issues.find((i) => i.type === 'off-grid');
    expect(issue?.value).toBe('13px');
  });
});
