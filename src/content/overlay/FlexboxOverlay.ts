import type { FlexboxData } from '@shared/types/element.types';
import type { OverlayLayer } from '@shared/types/overlay.types';

const ARROW_COLOR = '#8B5CF6';
const BADGE_BG = '#6D28D9';

/** Builds SVG overlay showing flexbox axis arrows and child badges */
export class FlexboxOverlay {
  static build(data: FlexboxData, containerRect: DOMRect): OverlayLayer {
    let svg = '';
    const { left, top, width, height } = containerRect;
    const cx = left + width / 2;
    const cy = top + height / 2;

    // Main axis arrow
    const isRow = data.direction === 'row' || data.direction === 'row-reverse';
    const reverse = data.direction.includes('reverse');

    if (isRow) {
      const x1 = reverse ? left + width - 10 : left + 10;
      const x2 = reverse ? left + 10 : left + width - 10;
      svg += FlexboxOverlay.arrow(x1, cy, x2, cy, ARROW_COLOR);
      svg += FlexboxOverlay.label(cx, top - 6, `${data.direction}  justify: ${data.justifyContent}`, ARROW_COLOR);
    } else {
      const y1 = reverse ? top + height - 10 : top + 10;
      const y2 = reverse ? top + 10 : top + height - 10;
      svg += FlexboxOverlay.arrow(cx, y1, cx, y2, ARROW_COLOR);
      svg += FlexboxOverlay.label(left - 6, cy, `${data.direction}  align: ${data.alignItems}`, ARROW_COLOR);
    }

    // Cross axis arrow (perpendicular, shorter)
    if (isRow) {
      svg += FlexboxOverlay.arrow(left + 20, top + 8, left + 20, top + height - 8, '#A78BFA');
    } else {
      svg += FlexboxOverlay.arrow(left + 8, top + 20, left + width - 8, top + 20, '#A78BFA');
    }

    // Child badges
    for (const child of data.children) {
      const r = child.element.getBoundingClientRect();
      const badgeText = `${child.flexGrow}/${child.flexShrink}/${child.flexBasis}`;
      svg += `
        <rect x="${r.left}" y="${r.bottom + 2}" width="${badgeText.length * 6.5 + 10}" height="16"
          rx="3" fill="${BADGE_BG}" opacity="0.9"/>
        <text x="${r.left + 5}" y="${r.bottom + 14}" fill="#FFFFFF" font-size="10"
          font-family="monospace" style="pointer-events:none">${badgeText}</text>
      `;
    }

    // Gap badge
    if (data.gap > 0) {
      svg += FlexboxOverlay.label(left + width - 60, top + height + 14, `gap: ${data.gap}px`, BADGE_BG);
    }

    return {
      id: 'flexbox-overlay',
      type: 'flexbox',
      svgContent: svg,
      zOrder: 30,
    };
  }

  private static arrow(x1: number, y1: number, x2: number, y2: number, color: string): string {
    return `
      <defs><marker id="pp-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="${color}"/>
      </marker></defs>
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
        stroke="${color}" stroke-width="2" marker-end="url(#pp-arrow)"/>
    `;
  }

  private static label(x: number, y: number, text: string, color: string): string {
    const w = text.length * 6.5 + 10;
    return `
      <rect x="${x}" y="${y - 12}" width="${w}" height="16" rx="3" fill="${color}" opacity="0.9"/>
      <text x="${x + 5}" y="${y}" fill="#FFFFFF" font-size="10"
        font-family="monospace" style="pointer-events:none">${text}</text>
    `;
  }
}
