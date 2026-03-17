import type { AuditIssue } from '@shared/types/audit.types';
import { isOnGrid, snapToGrid } from '@shared/utils/unit.utils';
import { getUniqueSelector } from '@shared/utils/selector.utils';
import { isPixelPerfectElement } from '@shared/utils/dom.utils';
import { GRID_TOLERANCE } from '@shared/constants/spacing.constants';

const SPACING_PROPS = [
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'gap',
];

/** Scans visible elements for spacing inconsistencies */
export class SpacingAuditor {
  run(gridUnit: number): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const valueCounts = new Map<number, number>();
    const elements = document.querySelectorAll('*');

    // First pass: count all spacing values
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (isPixelPerfectElement(el)) continue;
      if (!this.isVisible(el)) continue;

      const style = window.getComputedStyle(el);
      for (const prop of SPACING_PROPS) {
        const val = parseFloat((style as unknown as Record<string, string>)[prop]) || 0;
        if (val > 0) {
          valueCounts.set(val, (valueCounts.get(val) || 0) + 1);
        }
      }
    }

    // Second pass: find issues
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (isPixelPerfectElement(el)) continue;
      if (!this.isVisible(el)) continue;

      const style = window.getComputedStyle(el);
      const selector = getUniqueSelector(el);

      for (const prop of SPACING_PROPS) {
        const val = parseFloat((style as unknown as Record<string, string>)[prop]) || 0;
        if (val <= 0) continue;

        // Off-grid check
        if (!isOnGrid(val, gridUnit, GRID_TOLERANCE)) {
          const nearest = snapToGrid(val, gridUnit);
          issues.push({
            id: `off-grid-${selector}-${prop}`,
            type: 'off-grid',
            severity: 'warning',
            selector,
            description: `${prop}: ${val}px is not on the ${gridUnit}px grid`,
            suggestedFix: `Change to ${nearest}px (nearest grid value)`,
            value: `${val}px`,
            nearestGridValue: nearest,
          });
        }

        // Magic number check (value appears only once)
        if ((valueCounts.get(val) || 0) === 1 && val > 0 && val !== gridUnit) {
          issues.push({
            id: `magic-${selector}-${prop}`,
            type: 'magic-number',
            severity: 'info',
            selector,
            description: `${prop}: ${val}px appears only once — possible magic number`,
            suggestedFix: `Consider using a design token or grid multiple`,
            value: `${val}px`,
          });
        }
      }
    }

    // Sibling consistency check
    issues.push(...this.checkSiblingConsistency());

    return issues;
  }

  private checkSiblingConsistency(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const containers = document.querySelectorAll('ul, ol, nav, section, div, main');

    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];
      if (isPixelPerfectElement(container)) continue;
      const children = Array.from(container.children).filter((c) => this.isVisible(c));
      if (children.length < 2) continue;

      // Group by tag name
      const byTag = new Map<string, Element[]>();
      for (const child of children) {
        const tag = child.tagName;
        if (!byTag.has(tag)) byTag.set(tag, []);
        byTag.get(tag)!.push(child);
      }

      for (const [, siblings] of byTag) {
        if (siblings.length < 2) continue;

        const gaps: number[] = [];
        for (let j = 1; j < siblings.length; j++) {
          const prevRect = siblings[j - 1].getBoundingClientRect();
          const currRect = siblings[j].getBoundingClientRect();
          const gap = currRect.top - prevRect.bottom;
          if (gap >= 0) gaps.push(Math.round(gap));
        }

        if (gaps.length < 2) continue;
        const unique = new Set(gaps);
        if (unique.size > 1) {
          const selector = getUniqueSelector(container);
          issues.push({
            id: `inconsistent-${selector}`,
            type: 'inconsistent-siblings',
            severity: 'warning',
            selector,
            description: `Sibling ${siblings[0].tagName.toLowerCase()} elements have inconsistent gaps: ${[...unique].join(', ')}px`,
            suggestedFix: `Standardize gaps to a single value`,
            value: [...unique].join(', '),
          });
        }
      }
    }

    return issues;
  }

  private isVisible(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }
}
