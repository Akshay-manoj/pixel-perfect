import { CSSEditor } from '../CSSEditor';
import type { ElementInfo } from '@shared/types/element.types';

function createMockInfo(styles: Record<string, string> = {}): { info: ElementInfo; element: HTMLDivElement } {
  const element = document.createElement('div');
  element.className = 'card';
  document.body.appendChild(element);

  const defaultStyles: Record<string, string> = {
    'margin-top': '16px',
    'padding-top': '24px',
    'background-color': '#3B82F6',
    ...styles,
  };

  const info: ElementInfo = {
    element,
    boxModel: {
      margin: { top: 16, right: 0, bottom: 0, left: 0 },
      padding: { top: 24, right: 0, bottom: 0, left: 0 },
      border: { top: 0, right: 0, bottom: 0, left: 0 },
      content: { width: 200, height: 100 },
    },
    rect: { top: 100, left: 100, right: 300, bottom: 200, width: 200, height: 100, x: 100, y: 100, toJSON: () => ({}) } as DOMRect,
    computedStyles: {
      getPropertyValue: (prop: string) => defaultStyles[prop] ?? '',
      length: 0,
    } as unknown as CSSStyleDeclaration,
    selector: '.card',
    tagName: 'div',
    classList: ['card'],
  };

  return { info, element };
}

describe('CSSEditor', () => {
  let editor: CSSEditor;

  beforeEach(() => {
    editor = new CSSEditor();
  });

  afterEach(() => {
    editor.close();
    document.body.innerHTML = '';
  });

  it('should open the editor panel', () => {
    const { info } = createMockInfo();
    editor.open(info.element, info);
    expect(editor.isOpen()).toBe(true);
  });

  it('should inject panel into the DOM', () => {
    const { info } = createMockInfo();
    editor.open(info.element, info);
    const panel = document.getElementById('pixelperfect-editor-panel');
    expect(panel).not.toBeNull();
  });

  it('should have data-pixelperfect attribute', () => {
    const { info } = createMockInfo();
    editor.open(info.element, info);
    const panel = document.getElementById('pixelperfect-editor-panel');
    expect(panel?.getAttribute('data-pixelperfect')).toBe('editor');
  });

  it('should close the editor panel', () => {
    const { info } = createMockInfo();
    editor.open(info.element, info);
    editor.close();
    expect(editor.isOpen()).toBe(false);
    expect(document.getElementById('pixelperfect-editor-panel')).toBeNull();
  });

  it('should report isOpen as false before opening', () => {
    expect(editor.isOpen()).toBe(false);
  });

  it('should close previous panel when opening new one', () => {
    const { info: info1 } = createMockInfo();
    const { info: info2 } = createMockInfo({ 'color': '#000000' });
    editor.open(info1.element, info1);
    editor.open(info2.element, info2);
    const panels = document.querySelectorAll('#pixelperfect-editor-panel');
    expect(panels.length).toBe(1);
  });

  it('should show property labels in the panel', () => {
    const { info } = createMockInfo();
    editor.open(info.element, info);
    const panel = document.getElementById('pixelperfect-editor-panel');
    expect(panel?.textContent).toContain('margin-top');
  });

  it('should show element tag in header', () => {
    const { info } = createMockInfo();
    editor.open(info.element, info);
    const panel = document.getElementById('pixelperfect-editor-panel');
    expect(panel?.textContent).toContain('div');
  });

  it('should call onEdit callback when edit is committed', () => {
    const { info, element } = createMockInfo();
    const callback = jest.fn();
    editor.onEdit(callback);
    editor.open(element, info);

    // Simulate editing an input
    const inputs = document.querySelectorAll('#pixelperfect-editor-panel input');
    if (inputs.length > 0) {
      const input = inputs[0] as HTMLInputElement;
      input.value = '20px';
      input.dispatchEvent(new Event('blur'));
    }

    expect(callback).toHaveBeenCalled();
  });

  it('should apply style to element on input', () => {
    const { info, element } = createMockInfo();
    editor.open(element, info);

    const inputs = document.querySelectorAll('#pixelperfect-editor-panel input');
    if (inputs.length > 0) {
      const input = inputs[0] as HTMLInputElement;
      input.value = '32px';
      input.dispatchEvent(new Event('input'));
    }

    // The element should have the style applied
    expect(element.style.getPropertyValue('margin-top') || element.style.getPropertyValue('padding-top') || element.style.getPropertyValue('background-color')).toBeTruthy();
  });
});
