import { ElementPicker } from '../ElementPicker';

// Mock requestAnimationFrame for synchronous testing
let rafCallback: FrameRequestCallback | null = null;
const originalRAF = global.requestAnimationFrame;
const originalCAF = global.cancelAnimationFrame;
const originalElementFromPoint = document.elementFromPoint;

function mockElementFromPoint(el: Element | null) {
  document.elementFromPoint = jest.fn().mockReturnValue(el);
}

beforeEach(() => {
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    rafCallback = cb;
    return 1;
  };
  global.cancelAnimationFrame = jest.fn();
});

afterEach(() => {
  global.requestAnimationFrame = originalRAF;
  global.cancelAnimationFrame = originalCAF;
  document.elementFromPoint = originalElementFromPoint;
  rafCallback = null;
  document.body.innerHTML = '';
});

function flushRAF() {
  if (rafCallback) {
    rafCallback(0);
    rafCallback = null;
  }
}

describe('ElementPicker', () => {
  it('should start disabled', () => {
    const picker = new ElementPicker();
    expect(picker.getHoveredElement()).toBeNull();
  });

  it('should enable and disable event listening', () => {
    const picker = new ElementPicker();
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');

    picker.enable();
    expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function), true);
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), true);

    picker.disable();
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function), true);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('should not double-enable', () => {
    const picker = new ElementPicker();
    const addSpy = jest.spyOn(document, 'addEventListener');

    picker.enable();
    picker.enable(); // second call should be no-op
    // mousemove, mouseover, mouseout, click, keydown, keyup = 6 per enable
    expect(addSpy).toHaveBeenCalledTimes(6);

    addSpy.mockRestore();
    picker.disable();
  });

  it('should fire hover callbacks on mousemove', () => {
    const picker = new ElementPicker();
    const hoverFn = jest.fn();
    picker.onHover(hoverFn);
    picker.enable();

    const target = document.createElement('div');
    document.body.appendChild(target);

    mockElementFromPoint(target);

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50, bubbles: true }));
    flushRAF();

    expect(hoverFn).toHaveBeenCalledWith(target);
    picker.disable();
  });

  it('should fire leave callbacks on mouseout', () => {
    const picker = new ElementPicker();
    const leaveFn = jest.fn();
    picker.onLeave(leaveFn);
    picker.enable();

    document.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));

    expect(leaveFn).toHaveBeenCalled();
    picker.disable();
  });

  it('should fire click callbacks on click', () => {
    const picker = new ElementPicker();
    const clickFn = jest.fn();
    picker.onClick(clickFn);
    picker.enable();

    const target = document.createElement('div');
    document.body.appendChild(target);

    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(clickFn).toHaveBeenCalledWith(target);
    picker.disable();
  });

  it('should fire pin callbacks on Shift+Click', () => {
    const picker = new ElementPicker();
    const pinFn = jest.fn();
    picker.onPin(pinFn);
    picker.enable();

    const target = document.createElement('div');
    document.body.appendChild(target);

    target.dispatchEvent(new MouseEvent('click', { shiftKey: true, bubbles: true }));

    expect(pinFn).toHaveBeenCalledWith(target);
    expect(picker.getPinnedElement()).toBe(target);
    picker.disable();
  });

  it('should ignore PixelPerfect overlay elements', () => {
    const picker = new ElementPicker();
    const hoverFn = jest.fn();
    picker.onHover(hoverFn);
    picker.enable();

    const overlay = document.createElement('div');
    overlay.setAttribute('data-pixelperfect', 'overlay');
    document.body.appendChild(overlay);

    mockElementFromPoint(overlay);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50, bubbles: true }));
    flushRAF();

    expect(hoverFn).not.toHaveBeenCalled();
    picker.disable();
  });

  it('should track Alt key state', () => {
    const picker = new ElementPicker();
    picker.enable();

    expect(picker.getIsAltPressed()).toBe(false);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Alt', bubbles: true }));
    expect(picker.getIsAltPressed()).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Alt', bubbles: true }));
    expect(picker.getIsAltPressed()).toBe(false);

    picker.disable();
  });

  it('should clear state on disable', () => {
    const picker = new ElementPicker();
    picker.enable();

    const target = document.createElement('div');
    document.body.appendChild(target);
    mockElementFromPoint(target);

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50, bubbles: true }));
    flushRAF();
    expect(picker.getHoveredElement()).toBe(target);

    picker.disable();
    expect(picker.getHoveredElement()).toBeNull();
    expect(picker.getIsAltPressed()).toBe(false);
  });

  it('should not fire hover for the same element twice', () => {
    const picker = new ElementPicker();
    const hoverFn = jest.fn();
    picker.onHover(hoverFn);
    picker.enable();

    const target = document.createElement('div');
    document.body.appendChild(target);
    mockElementFromPoint(target);

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50, bubbles: true }));
    flushRAF();
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 51, clientY: 51, bubbles: true }));
    flushRAF();

    expect(hoverFn).toHaveBeenCalledTimes(1);
    picker.disable();
  });
});
