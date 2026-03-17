import type { AuditIssue } from '@shared/types/audit.types';
import { getUniqueSelector } from '@shared/utils/selector.utils';
import { isPixelPerfectElement } from '@shared/utils/dom.utils';
import { getContrastRatio, isWCAGCompliant, normalizeColor } from '@shared/utils/color.utils';

const TEXT_SELECTORS = 'p, h1, h2, h3, h4, h5, h6, span, a, li, label, td, th, button, caption, blockquote, figcaption';

/** Scans all text elements for WCAG contrast compliance */
export class ContrastAuditor {
  run(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const elements = document.querySelectorAll(TEXT_SELECTORS);

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (isPixelPerfectElement(el)) continue;
      if (!this.hasTextContent(el)) continue;
      if (!this.isVisible(el)) continue;

      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = this.getEffectiveBackground(el);
      const ratio = getContrastRatio(color, bgColor);
      const isLarge = this.isLargeText(style);
      const selector = getUniqueSelector(el);

      // Check AA
      if (!isWCAGCompliant(ratio, 'AA', isLarge)) {
        const required = isLarge ? '3:1' : '4.5:1';
        issues.push({
          id: `contrast-aa-${selector}`,
          type: 'contrast-fail',
          severity: 'error',
          selector,
          description: `Contrast ratio ${ratio}:1 fails WCAG AA (requires ${required}${isLarge ? ' for large text' : ''})`,
          suggestedFix: `Increase contrast between ${normalizeColor(color)} and ${normalizeColor(bgColor)}`,
          value: `${ratio}:1`,
        });
      }
      // Check AAA (only if AA passes)
      else if (!isWCAGCompliant(ratio, 'AAA', isLarge)) {
        const required = isLarge ? '4.5:1' : '7:1';
        issues.push({
          id: `contrast-aaa-${selector}`,
          type: 'contrast-fail',
          severity: 'warning',
          selector,
          description: `Contrast ratio ${ratio}:1 fails WCAG AAA (requires ${required}${isLarge ? ' for large text' : ''})`,
          suggestedFix: `Increase contrast for AAA compliance`,
          value: `${ratio}:1`,
        });
      }
    }

    return issues;
  }

  private getEffectiveBackground(element: Element): string {
    let current: Element | null = element;
    while (current) {
      const bg = window.getComputedStyle(current).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
      }
      current = current.parentElement;
    }
    return 'rgb(255, 255, 255)';
  }

  private isLargeText(style: CSSStyleDeclaration): boolean {
    const fontSize = parseFloat(style.fontSize) || 0;
    const fontWeight = parseInt(style.fontWeight, 10) || 400;
    return fontSize >= 24 || (fontSize >= 18.67 && fontWeight >= 700);
  }

  private hasTextContent(el: Element): boolean {
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        return true;
      }
    }
    return false;
  }

  private isVisible(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }
}
