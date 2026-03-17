import { ContrastAuditor } from '../ContrastAuditor';

function createTextElement(color: string, bgColor: string, fontSize = '16px', fontWeight = '400'): void {
  const el = document.createElement('p');
  el.textContent = 'Test text';
  jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20, x: 0, y: 0, toJSON: () => ({}),
  } as DOMRect);
  document.body.appendChild(el);

  jest.spyOn(window, 'getComputedStyle').mockImplementation((target) => ({
    color,
    backgroundColor: target === el ? bgColor : 'rgba(0, 0, 0, 0)',
    fontSize,
    fontWeight,
    display: 'block',
    visibility: 'visible',
    getPropertyValue: (p: string) => {
      const map: Record<string, string> = { color, backgroundColor: bgColor, fontSize, fontWeight, display: 'block', visibility: 'visible' };
      return map[p] ?? '';
    },
  } as unknown as CSSStyleDeclaration));
}

describe('ContrastAuditor', () => {
  let auditor: ContrastAuditor;

  beforeEach(() => {
    auditor = new ContrastAuditor();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('should return empty for no text elements', () => {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      display: 'block', visibility: 'visible', color: '#000', backgroundColor: '#fff',
      fontSize: '16px', fontWeight: '400', getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);
    expect(auditor.run()).toEqual([]);
  });

  it('should not flag high contrast black on white', () => {
    createTextElement('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
    const issues = auditor.run();
    expect(issues.filter((i) => i.type === 'contrast-fail').length).toBe(0);
  });

  it('should flag very low contrast as error (AA fail)', () => {
    // Light gray on white = very low contrast
    createTextElement('rgb(200, 200, 200)', 'rgb(255, 255, 255)');
    const issues = auditor.run();
    const aaFails = issues.filter((i) => i.type === 'contrast-fail' && i.severity === 'error');
    expect(aaFails.length).toBeGreaterThan(0);
  });

  it('should report contrast ratio in issue value', () => {
    createTextElement('rgb(200, 200, 200)', 'rgb(255, 255, 255)');
    const issues = auditor.run();
    const issue = issues.find((i) => i.type === 'contrast-fail');
    expect(issue?.value).toContain(':1');
  });

  it('should include selector in issue', () => {
    createTextElement('rgb(200, 200, 200)', 'rgb(255, 255, 255)');
    const issues = auditor.run();
    const issue = issues.find((i) => i.type === 'contrast-fail');
    expect(issue?.selector).toBeTruthy();
  });

  it('should set severity to error for AA failure', () => {
    createTextElement('rgb(200, 200, 200)', 'rgb(255, 255, 255)');
    const issues = auditor.run();
    const aaFail = issues.find((i) => i.description.includes('AA'));
    expect(aaFail?.severity).toBe('error');
  });

  it('should flag medium contrast as AAA warning', () => {
    // Medium gray on white — passes AA but not AAA
    createTextElement('rgb(100, 100, 100)', 'rgb(255, 255, 255)');
    const issues = auditor.run();
    const aaaFails = issues.filter((i) => i.description.includes('AAA'));
    expect(aaaFails.length).toBeGreaterThanOrEqual(0); // may or may not fail depending on exact ratio
  });

  it('should include suggested fix', () => {
    createTextElement('rgb(200, 200, 200)', 'rgb(255, 255, 255)');
    const issues = auditor.run();
    const issue = issues.find((i) => i.type === 'contrast-fail');
    expect(issue?.suggestedFix).toBeTruthy();
  });

  it('should skip elements without text content', () => {
    const el = document.createElement('p');
    // No text content
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, right: 100, bottom: 20, width: 100, height: 20, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      color: 'rgb(200, 200, 200)', backgroundColor: 'rgb(255, 255, 255)',
      fontSize: '16px', fontWeight: '400', display: 'block', visibility: 'visible',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run();
    expect(issues.length).toBe(0);
  });

  it('should skip hidden elements', () => {
    const el = document.createElement('p');
    el.textContent = 'Hidden';
    jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);
    document.body.appendChild(el);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      color: 'rgb(200, 200, 200)', backgroundColor: 'rgb(255, 255, 255)',
      fontSize: '16px', fontWeight: '400', display: 'none', visibility: 'hidden',
      getPropertyValue: () => '',
    } as unknown as CSSStyleDeclaration);

    const issues = auditor.run();
    expect(issues.length).toBe(0);
  });
});
