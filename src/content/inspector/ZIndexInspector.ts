import type { ZIndexLayer } from '@shared/types/element.types';
import { getUniqueSelector } from '@shared/utils/selector.utils';

/** Scans positioned elements and builds a z-index stacking layer list */
export class ZIndexInspector {
  /** Scan the page for all positioned elements with explicit z-index */
  scan(): ZIndexLayer[] {
    const layers: ZIndexLayer[] = [];
    const all = document.querySelectorAll('*');

    for (let i = 0; i < all.length; i++) {
      const el = all[i];
      const style = window.getComputedStyle(el);
      const position = style.position;

      if (position === 'static') continue;

      const zIndex = parseInt(style.zIndex, 10);
      if (isNaN(zIndex)) continue;

      // Skip PixelPerfect's own elements
      if (el.closest('[data-pixelperfect]')) continue;

      layers.push({
        element: el,
        selector: getUniqueSelector(el),
        zIndex,
        position,
        rect: el.getBoundingClientRect(),
      });
    }

    layers.sort((a, b) => a.zIndex - b.zIndex);
    return layers;
  }

  /** Get the z-index layer for a specific element */
  getLayer(element: Element): ZIndexLayer | null {
    const style = window.getComputedStyle(element);
    if (style.position === 'static') return null;
    const zIndex = parseInt(style.zIndex, 10);
    if (isNaN(zIndex)) return null;

    return {
      element,
      selector: getUniqueSelector(element),
      zIndex,
      position: style.position,
      rect: element.getBoundingClientRect(),
    };
  }
}
