import { BoxModelOverlay } from '../BoxModelOverlay';
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

describe('BoxModelOverlay', () => {
  it('should return an OverlayLayer with type box-model', () => {
    const layer = BoxModelOverlay.build(makeElementInfo());
    expect(layer.type).toBe('box-model');
    expect(layer.id).toBe('box-model');
  });

  it('should contain SVG rect elements', () => {
    const layer = BoxModelOverlay.build(makeElementInfo());
    expect(layer.svgContent).toContain('<rect');
    expect(layer.svgContent).toContain('fill=');
  });

  it('should use dark theme colors by default', () => {
    const layer = BoxModelOverlay.build(makeElementInfo());
    expect(layer.svgContent).toContain('rgba(246, 178, 107, 0.4)'); // margin
    expect(layer.svgContent).toContain('rgba(147, 196, 125, 0.4)'); // padding
  });

  it('should use light theme colors when specified', () => {
    const layer = BoxModelOverlay.build(makeElementInfo(), 'light');
    expect(layer.svgContent).toContain('rgba(219, 109, 0, 0.3)'); // margin light
  });

  it('should handle zero margins', () => {
    const info = makeElementInfo();
    info.boxModel.margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const layer = BoxModelOverlay.build(info);
    // Should still contain rects for other layers
    expect(layer.svgContent).toContain('<rect');
  });
});
