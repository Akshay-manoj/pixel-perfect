import { AlignmentAuditor } from '../AlignmentAuditor';

function createContainer(childRects: Array<{ top: number; left: number; width: number; height: number }>): void {
  const container = document.createElement('div');
  document.body.appendChild(container);

  for (const r of childRects) {
    const child = document.createElement('div');
    jest.spyOn(child, 'getBoundingClientRect').mockReturnValue({
      top: r.top, left: r.left, right: r.left + r.width, bottom: r.top + r.height,
      width: r.width, height: r.height, x: r.left, y: r.top, toJSON: () => ({}),
    } as DOMRect);
    container.appendChild(child);
  }

  jest.spyOn(window, 'getComputedStyle').mockReturnValue({
    display: 'block', visibility: 'visible',
    getPropertyValue: () => '',
  } as unknown as CSSStyleDeclaration);
}

describe('AlignmentAuditor', () => {
  let auditor: AlignmentAuditor;

  beforeEach(() => {
    auditor = new AlignmentAuditor();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('should return empty for empty page', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible', getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);
    expect(auditor.run()).toEqual([]);
  });

  it('should detect near-miss top alignment at 2px', () => {
    createContainer([
      { top: 100, left: 0, width: 50, height: 50 },
      { top: 102, left: 60, width: 50, height: 50 },
    ]);
    const issues = auditor.run();
    const nearMiss = issues.filter((i) => i.type === 'near-miss-alignment');
    expect(nearMiss.length).toBeGreaterThan(0);
  });

  it('should not flag exact alignment', () => {
    createContainer([
      { top: 100, left: 0, width: 50, height: 50 },
      { top: 100, left: 60, width: 50, height: 50 },
    ]);
    const issues = auditor.run();
    const topNearMiss = issues.filter((i) => i.description.includes('top'));
    expect(topNearMiss.length).toBe(0);
  });

  it('should not flag large differences', () => {
    createContainer([
      { top: 100, left: 0, width: 50, height: 50 },
      { top: 120, left: 60, width: 50, height: 50 },
    ]);
    const issues = auditor.run();
    const topNearMiss = issues.filter((i) => i.description.includes('top'));
    expect(topNearMiss.length).toBe(0);
  });

  it('should detect near-miss left alignment', () => {
    createContainer([
      { top: 0, left: 100, width: 50, height: 50 },
      { top: 60, left: 102, width: 50, height: 50 },
    ]);
    const issues = auditor.run();
    const leftMiss = issues.filter((i) => i.description.includes('left'));
    expect(leftMiss.length).toBeGreaterThan(0);
  });

  it('should include pixel difference in value', () => {
    createContainer([
      { top: 100, left: 0, width: 50, height: 50 },
      { top: 102, left: 60, width: 50, height: 50 },
    ]);
    const issues = auditor.run();
    const near = issues.find((i) => i.type === 'near-miss-alignment');
    expect(near?.value).toBe('2px');
  });

  it('should set severity to info', () => {
    createContainer([
      { top: 100, left: 0, width: 50, height: 50 },
      { top: 102, left: 60, width: 50, height: 50 },
    ]);
    const issues = auditor.run();
    const near = issues.find((i) => i.type === 'near-miss-alignment');
    expect(near?.severity).toBe('info');
  });

  it('should detect near-miss at 3px boundary', () => {
    createContainer([
      { top: 100, left: 0, width: 50, height: 50 },
      { top: 103, left: 60, width: 50, height: 50 },
    ]);
    const issues = auditor.run();
    const nearMiss = issues.filter((i) => i.type === 'near-miss-alignment');
    expect(nearMiss.length).toBeGreaterThan(0);
  });
});
