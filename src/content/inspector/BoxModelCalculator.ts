import type { BoxModel, EdgeValues, ElementInfo } from '@shared/types/element.types';
import { getUniqueSelector } from '@shared/utils/selector.utils';

/** Computes the full CSS box model for any DOM element */
export class BoxModelCalculator {
  private cache: WeakMap<Element, ElementInfo> = new WeakMap();

  /** Calculate full ElementInfo for an element. Results are cached per element reference. */
  calculate(element: Element): ElementInfo {
    const cached = this.cache.get(element);
    if (cached) return cached;

    const computed = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    const boxModel: BoxModel = {
      margin: {
        top: this.parsePixelValue(computed.marginTop),
        right: this.parsePixelValue(computed.marginRight),
        bottom: this.parsePixelValue(computed.marginBottom),
        left: this.parsePixelValue(computed.marginLeft),
      },
      padding: {
        top: this.parsePixelValue(computed.paddingTop),
        right: this.parsePixelValue(computed.paddingRight),
        bottom: this.parsePixelValue(computed.paddingBottom),
        left: this.parsePixelValue(computed.paddingLeft),
      },
      border: {
        top: this.parsePixelValue(computed.borderTopWidth),
        right: this.parsePixelValue(computed.borderRightWidth),
        bottom: this.parsePixelValue(computed.borderBottomWidth),
        left: this.parsePixelValue(computed.borderLeftWidth),
      },
      content: {
        width: rect.width
          - this.parsePixelValue(computed.paddingLeft)
          - this.parsePixelValue(computed.paddingRight)
          - this.parsePixelValue(computed.borderLeftWidth)
          - this.parsePixelValue(computed.borderRightWidth),
        height: rect.height
          - this.parsePixelValue(computed.paddingTop)
          - this.parsePixelValue(computed.paddingBottom)
          - this.parsePixelValue(computed.borderTopWidth)
          - this.parsePixelValue(computed.borderBottomWidth),
      },
    };

    const info: ElementInfo = {
      element,
      boxModel,
      rect,
      computedStyles: computed,
      selector: getUniqueSelector(element),
      tagName: element.tagName.toLowerCase(),
      classList: Array.from(element.classList),
    };

    this.cache.set(element, info);
    return info;
  }

  /** Remove cached data for a specific element */
  invalidate(element: Element): void {
    this.cache.delete(element);
  }

  /** Clear the entire cache */
  clearCache(): void {
    this.cache = new WeakMap();
  }

  /** Parse a shorthand edge value string like "16px 24px" into EdgeValues */
  parseEdgeValues(value: string): EdgeValues {
    const parts = value.trim().split(/\s+/).map((v) => this.parsePixelValue(v));

    switch (parts.length) {
      case 1:
        return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
      case 2:
        return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
      case 3:
        return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
      case 4:
        return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
      default:
        return { top: 0, right: 0, bottom: 0, left: 0 };
    }
  }

  /** Parse a CSS pixel value string to a number */
  parsePixelValue(value: string): number {
    if (!value || value === 'auto' || value === 'none' || value === 'normal') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}
