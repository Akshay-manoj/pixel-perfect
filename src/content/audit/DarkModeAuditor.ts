import type { AuditIssue } from '@shared/types/audit.types';
import { getUniqueSelector } from '@shared/utils/selector.utils';
import { isPixelPerfectElement } from '@shared/utils/dom.utils';
import { hexToRgb, normalizeColor } from '@shared/utils/color.utils';

/** Detects elements that may break in dark mode */
export class DarkModeAuditor {
  run(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const elements = document.querySelectorAll('*');

    // Check if page has color-scheme declaration
    const rootStyle = window.getComputedStyle(document.documentElement);
    const colorScheme = rootStyle.getPropertyValue('color-scheme');
    if (!colorScheme || colorScheme === 'normal') {
      issues.push({
        id: 'missing-color-scheme',
        type: 'dark-mode-conflict',
        severity: 'info',
        selector: ':root',
        description: 'No color-scheme declaration found on :root',
        suggestedFix: 'Add `color-scheme: light dark;` to :root for system dark mode support',
      });
    }

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (isPixelPerfectElement(el)) continue;
      if (!this.isVisible(el)) continue;

      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const color = style.color;

      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') continue;

      const bgHex = normalizeColor(bg);
      const colorHex = normalizeColor(color);

      // Hardcoded near-white background
      if (this.isNearWhite(bgHex) && this.isNearBlack(colorHex)) {
        const selector = getUniqueSelector(el);
        issues.push({
          id: `hardcoded-light-${selector}`,
          type: 'dark-mode-conflict',
          severity: 'warning',
          selector,
          description: `Hardcoded light background (${bgHex}) with dark text — may not adapt to dark mode`,
          suggestedFix: `Use CSS custom properties or prefers-color-scheme media query`,
          value: bgHex,
        });
      }
    }

    return issues;
  }

  private isNearWhite(hex: string): boolean {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    return rgb.r > 240 && rgb.g > 240 && rgb.b > 240;
  }

  private isNearBlack(hex: string): boolean {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    return rgb.r < 30 && rgb.g < 30 && rgb.b < 30;
  }

  private isVisible(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }
}
