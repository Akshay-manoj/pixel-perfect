import type { TypographyData } from '@shared/types/element.types';
import { normalizeColor, getContrastRatio, isWCAGCompliant } from '@shared/utils/color.utils';

/** Inspects typography-related computed styles */
export class TypographyInspector {
  /** Extract typography data from an element */
  inspect(element: Element): TypographyData {
    const style = window.getComputedStyle(element);

    const color = style.color || 'rgb(0, 0, 0)';
    const bgColor = this.getEffectiveBackground(element);
    const contrastRatio = getContrastRatio(color, bgColor);

    return {
      fontFamily: style.fontFamily || 'sans-serif',
      fontSize: parseFloat(style.fontSize) || 16,
      fontWeight: style.fontWeight || '400',
      lineHeight: style.lineHeight || 'normal',
      letterSpacing: style.letterSpacing || 'normal',
      color: normalizeColor(color),
      contrastRatio,
      wcagAA: isWCAGCompliant(contrastRatio, 'AA', this.isLargeText(style)),
      wcagAAA: isWCAGCompliant(contrastRatio, 'AAA', this.isLargeText(style)),
    };
  }

  /** Check if element has visible text content */
  hasTextContent(element: Element): boolean {
    if (!element.textContent?.trim()) return false;
    // Must have direct text nodes, not just child element text
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        return true;
      }
    }
    return false;
  }

  /** Walk up the DOM tree to find the effective background color */
  private getEffectiveBackground(element: Element): string {
    let current: Element | null = element;

    while (current) {
      const bg = window.getComputedStyle(current).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
      }
      current = current.parentElement;
    }

    return 'rgb(255, 255, 255)'; // default white
  }

  /** Check if text qualifies as "large" for WCAG (>=18pt or >=14pt bold) */
  private isLargeText(style: CSSStyleDeclaration): boolean {
    const fontSize = parseFloat(style.fontSize) || 0;
    const fontWeight = parseInt(style.fontWeight, 10) || 400;
    // 18pt = 24px, 14pt bold = 18.67px
    return fontSize >= 24 || (fontSize >= 18.67 && fontWeight >= 700);
  }
}
