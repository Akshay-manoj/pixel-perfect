import { TooltipOverlay } from '../TooltipOverlay';
import type { ElementInfo } from '@shared/types/element.types';

function makeElementInfo(overrides?: Partial<ElementInfo>): ElementInfo {
  return {
    element: document.createElement('div'),
    boxModel: {
      margin: { top: 16, right: 16, bottom: 16, left: 16 },
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      border: { top: 1, right: 1, bottom: 1, left: 1 },
      content: { width: 150, height: 100 },
    },
    rect: { top: 100, left: 100, right: 300, bottom: 250, width: 200, height: 150, x: 100, y: 100, toJSON: () => ({}) } as DOMRect,
    computedStyles: {} as CSSStyleDeclaration,
    selector: 'div.card',
    tagName: 'div',
    classList: ['card'],
    ...overrides,
  };
}

describe('TooltipOverlay', () => {
  it('should return an OverlayLayer with type tooltip', () => {
    const layer = TooltipOverlay.build(makeElementInfo());
    expect(layer.type).toBe('tooltip');
    expect(layer.id).toBe('tooltip');
  });

  it('should display element tag and class', () => {
    const layer = TooltipOverlay.build(makeElementInfo());
    expect(layer.svgContent).toContain('div.card');
  });

  it('should display margin and padding values', () => {
    const layer = TooltipOverlay.build(makeElementInfo());
    expect(layer.svgContent).toContain('margin');
    expect(layer.svgContent).toContain('16px');
    expect(layer.svgContent).toContain('padding');
    expect(layer.svgContent).toContain('24px');
  });

  it('should display content dimensions', () => {
    const layer = TooltipOverlay.build(makeElementInfo());
    expect(layer.svgContent).toContain('150');
    expect(layer.svgContent).toContain('100');
  });

  it('should display clickable export format buttons', () => {
    const layer = TooltipOverlay.build(makeElementInfo());
    expect(layer.svgContent).toContain('data-pixelperfect-export="css"');
    expect(layer.svgContent).toContain('data-pixelperfect-export="scss"');
    expect(layer.svgContent).toContain('data-pixelperfect-export="tailwind"');
    expect(layer.svgContent).toContain('data-pixelperfect-export="css-variables"');
  });

  it('should use pointer-events:auto for interactivity', () => {
    const layer = TooltipOverlay.build(makeElementInfo());
    expect(layer.svgContent).toContain('pointer-events:auto');
  });

  describe('calculatePosition', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
    });

    it('should place tooltip to the right by default', () => {
      const rect = { top: 100, left: 100, right: 300, bottom: 250, width: 200, height: 150, x: 100, y: 100, toJSON: () => ({}) } as DOMRect;
      const pos = TooltipOverlay.calculatePosition(rect);
      expect(pos.left).toBeGreaterThan(rect.right);
      expect(pos.placement).toBe('right');
    });

    it('should flip to left when near right viewport edge', () => {
      const rect = { top: 100, left: 800, right: 1000, bottom: 250, width: 200, height: 150, x: 800, y: 100, toJSON: () => ({}) } as DOMRect;
      const pos = TooltipOverlay.calculatePosition(rect);
      expect(pos.left).toBeLessThan(rect.left);
      expect(pos.placement).toBe('left');
    });

    it('should clamp to minimum position', () => {
      const rect = { top: 2, left: 2, right: 50, bottom: 30, width: 48, height: 28, x: 2, y: 2, toJSON: () => ({}) } as DOMRect;
      const pos = TooltipOverlay.calculatePosition(rect);
      expect(pos.top).toBeGreaterThanOrEqual(4);
      expect(pos.left).toBeGreaterThanOrEqual(4);
    });
  });
});
