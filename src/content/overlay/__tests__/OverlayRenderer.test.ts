import { OverlayRenderer } from '../OverlayRenderer';
import type { OverlayLayer } from '@shared/types/overlay.types';

let rafCallback: FrameRequestCallback | null = null;

beforeEach(() => {
  document.body.innerHTML = '';
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    rafCallback = cb;
    return 1;
  };
  global.cancelAnimationFrame = jest.fn();
});

afterEach(() => {
  rafCallback = null;
});

function flushRAF() {
  if (rafCallback) {
    rafCallback(0);
    rafCallback = null;
  }
}

function makeLayer(id: string, zOrder: number = 10, type = 'box-model'): OverlayLayer {
  return {
    id,
    type: type as OverlayLayer['type'],
    svgContent: `<rect x="0" y="0" width="100" height="100" fill="red" data-test="${id}" />`,
    zOrder,
  };
}

describe('OverlayRenderer', () => {
  it('should inject an SVG element into the DOM', () => {
    const renderer = new OverlayRenderer();
    const svg = renderer.getSVGRoot();
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('data-pixelperfect')).toBe('overlay');
    renderer.destroy();
  });

  it('should set correct SVG styles', () => {
    const renderer = new OverlayRenderer();
    const svg = renderer.getSVGRoot();
    expect(svg?.style.position).toBe('fixed');
    expect(svg?.style.pointerEvents).toBe('none');
    expect(svg?.style.zIndex).toBe('2147483647');
    renderer.destroy();
  });

  it('should render layers after rAF', () => {
    const renderer = new OverlayRenderer();
    renderer.render([makeLayer('layer-1')]);

    // Before rAF fires, SVG should still be empty
    const svg = renderer.getSVGRoot();
    expect(svg?.querySelectorAll('g').length).toBe(0);

    flushRAF();
    expect(svg?.querySelectorAll('g').length).toBe(1);
    expect(svg?.querySelector('[data-layer-id="layer-1"]')).not.toBeNull();
    renderer.destroy();
  });

  it('should sort layers by zOrder', () => {
    const renderer = new OverlayRenderer();
    renderer.render([
      makeLayer('high', 100),
      makeLayer('low', 1),
      makeLayer('mid', 50),
    ]);
    flushRAF();

    const svg = renderer.getSVGRoot();
    const groups = svg?.querySelectorAll('g');
    expect(groups?.[0]?.getAttribute('data-layer-id')).toBe('low');
    expect(groups?.[1]?.getAttribute('data-layer-id')).toBe('mid');
    expect(groups?.[2]?.getAttribute('data-layer-id')).toBe('high');
    renderer.destroy();
  });

  it('should clear all layers', () => {
    const renderer = new OverlayRenderer();
    renderer.render([makeLayer('layer-1')]);
    flushRAF();

    renderer.clear();
    const svg = renderer.getSVGRoot();
    expect(svg?.querySelectorAll('g').length).toBe(0);
    renderer.destroy();
  });

  it('should remove SVG from DOM on destroy', () => {
    const renderer = new OverlayRenderer();
    expect(document.querySelector('[data-pixelperfect="overlay"]')).not.toBeNull();

    renderer.destroy();
    expect(document.querySelector('[data-pixelperfect="overlay"]')).toBeNull();
  });

  it('should cancel pending frame on rapid render calls', () => {
    const renderer = new OverlayRenderer();
    renderer.render([makeLayer('first')]);
    renderer.render([makeLayer('second')]);

    expect(global.cancelAnimationFrame).toHaveBeenCalled();

    flushRAF();
    const svg = renderer.getSVGRoot();
    expect(svg?.querySelector('[data-layer-id="second"]')).not.toBeNull();
    expect(svg?.querySelector('[data-layer-id="first"]')).toBeNull();
    renderer.destroy();
  });

  it('should not duplicate SVG on re-instantiation', () => {
    const renderer1 = new OverlayRenderer();
    const renderer2 = new OverlayRenderer();

    const overlays = document.querySelectorAll('[data-pixelperfect="overlay"]');
    expect(overlays.length).toBe(1);

    renderer1.destroy();
    renderer2.destroy();
  });

  it('should replace old layers on re-render', () => {
    const renderer = new OverlayRenderer();
    renderer.render([makeLayer('old')]);
    flushRAF();

    renderer.render([makeLayer('new')]);
    flushRAF();

    const svg = renderer.getSVGRoot();
    expect(svg?.querySelector('[data-layer-id="old"]')).toBeNull();
    expect(svg?.querySelector('[data-layer-id="new"]')).not.toBeNull();
    renderer.destroy();
  });
});
