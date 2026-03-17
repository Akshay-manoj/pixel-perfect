import type { AuditIssue } from '@shared/types/audit.types';
import { getUniqueSelector } from '@shared/utils/selector.utils';
import { isPixelPerfectElement } from '@shared/utils/dom.utils';

const NEAR_MISS_MIN = 1;
const NEAR_MISS_MAX = 3;

/** Scans visible elements for near-miss alignments */
export class AlignmentAuditor {
  run(): AuditIssue[] {
    const issues: AuditIssue[] = [];
    const containers = document.querySelectorAll('div, section, main, article, nav, header, footer, ul, ol');

    for (let i = 0; i < containers.length; i++) {
      const container = containers[i];
      if (isPixelPerfectElement(container)) continue;
      const children = Array.from(container.children).filter((c) => this.isVisible(c));
      if (children.length < 2) continue;

      const rects = children.map((c) => ({
        el: c,
        rect: c.getBoundingClientRect(),
        selector: getUniqueSelector(c),
      }));

      for (let a = 0; a < rects.length; a++) {
        for (let b = a + 1; b < rects.length; b++) {
          const ra = rects[a].rect;
          const rb = rects[b].rect;

          this.checkEdge(ra.top, rb.top, 'top', rects[a].selector, rects[b].selector, issues);
          this.checkEdge(ra.bottom, rb.bottom, 'bottom', rects[a].selector, rects[b].selector, issues);
          this.checkEdge(ra.left, rb.left, 'left', rects[a].selector, rects[b].selector, issues);
          this.checkEdge(ra.right, rb.right, 'right', rects[a].selector, rects[b].selector, issues);
        }
      }
    }

    return issues;
  }

  private checkEdge(
    valA: number, valB: number, edge: string,
    selectorA: string, selectorB: string,
    issues: AuditIssue[],
  ): void {
    const diff = Math.abs(valA - valB);
    if (diff >= NEAR_MISS_MIN && diff <= NEAR_MISS_MAX) {
      issues.push({
        id: `near-miss-${selectorA}-${selectorB}-${edge}`,
        type: 'near-miss-alignment',
        severity: 'info',
        selector: selectorA,
        description: `${edge} edge is ${diff}px off from ${selectorB} — near-miss alignment`,
        suggestedFix: `Align ${edge} edges exactly (${diff}px difference)`,
        value: `${diff}px`,
      });
    }
  }

  private isVisible(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }
}
