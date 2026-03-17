import type { ElementInfo } from '@shared/types/element.types';
import type { OverlayLayer, OverlayTheme, TooltipPosition } from '@shared/types/overlay.types';
import { OVERLAY_COLORS, OVERLAY_COLORS_LIGHT } from '@shared/constants/colors.constants';
import { pxToRem } from '@shared/utils/unit.utils';
import { EXPORT_FORMAT_LABELS } from '@shared/constants/export.constants';
import type { MappedBoxModel } from '@shared/types/token.types';

const TOOLTIP_WIDTH = 280;
const TOOLTIP_PADDING = 12;
const TOOLTIP_OFFSET = 12;
const LINE_HEIGHT = 18;

/** Builds the floating measurement tooltip with element info and copy buttons */
export class TooltipOverlay {
  /** Build an OverlayLayer for the tooltip */
  static build(
    info: ElementInfo,
    theme: OverlayTheme = 'dark',
    mappedBoxModel?: MappedBoxModel
  ): OverlayLayer {
    const colors = theme === 'dark' ? OVERLAY_COLORS : OVERLAY_COLORS_LIGHT;
    const pos = TooltipOverlay.calculatePosition(info.rect);
    const { boxModel } = info;

    const lines: string[] = [];

    // Header: tag.class
    const classStr = info.classList.length > 0 ? '.' + info.classList.slice(0, 2).join('.') : '';
    const header = `${info.tagName}${classStr}`;
    lines.push(header);

    // Separator
    lines.push('─'.repeat(32));

    // Box model values
    const edges = [
      { label: 'margin', edge: boxModel.margin, mapped: mappedBoxModel?.margin },
      { label: 'padding', edge: boxModel.padding, mapped: mappedBoxModel?.padding },
      { label: 'border', edge: boxModel.border, mapped: mappedBoxModel?.border },
    ];

    for (const { label, edge, mapped } of edges) {
      const hasValue = edge.top || edge.right || edge.bottom || edge.left;
      if (!hasValue) continue;

      const allSame = edge.top === edge.right && edge.right === edge.bottom && edge.bottom === edge.left;
      const vertHoriz = edge.top === edge.bottom && edge.left === edge.right && edge.top !== edge.left;

      let valueStr: string;
      if (allSame) {
        valueStr = `${edge.top}px`;
      } else if (vertHoriz) {
        valueStr = `${edge.top}px ${edge.left}px`;
      } else {
        valueStr = `${edge.top}px ${edge.right}px ${edge.bottom}px ${edge.left}px`;
      }

      const remStr = allSame ? `  ${pxToRem(edge.top)}rem` : '';

      let tokenStr = '';
      if (mapped && allSame && mapped.top.tokenName) {
        tokenStr = `  →  ${mapped.top.tokenName}`;
      }

      let twStr = '';
      if (mapped && allSame && mapped.top.tailwindClass) {
        twStr = `  ${mapped.top.tailwindClass}`;
      }

      lines.push(`${label.padEnd(8)}  ${valueStr}${remStr}${tokenStr}${twStr}`);
    }

    // Content dimensions
    lines.push('─'.repeat(32));
    lines.push(
      `${Math.round(boxModel.content.width)} × ${Math.round(boxModel.content.height)}`
    );

    // Export format buttons row
    lines.push('─'.repeat(32));
    const formatButtons = ['css', 'scss', 'tailwind'] as const;
    const buttonRow = formatButtons
      .map((f) => `[${EXPORT_FORMAT_LABELS[f]}]`)
      .join('  ');
    lines.push(buttonRow);

    // Calculate tooltip height
    const tooltipHeight = lines.length * LINE_HEIGHT + TOOLTIP_PADDING * 2;

    // Build SVG foreignObject tooltip
    const escapedLines = lines.map((l) => escapeHtml(l));
    const textHtml = escapedLines
      .map((line, i) => {
        const isSep = line.startsWith('─');
        const color = isSep ? colors.TOOLTIP_MUTED : colors.TOOLTIP_TEXT;
        const fontSize = i === 0 ? '13px' : '11px';
        const fontWeight = i === 0 ? '700' : '400';
        return `<div style="color:${color};font-size:${fontSize};font-weight:${fontWeight};line-height:${LINE_HEIGHT}px;white-space:pre;font-family:monospace;">${line}</div>`;
      })
      .join('');

    const svgContent = `
      <foreignObject x="${pos.left}" y="${pos.top}" width="${TOOLTIP_WIDTH}" height="${tooltipHeight}" style="overflow:visible;">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          background:${colors.TOOLTIP_BG};
          border:1px solid ${colors.TOOLTIP_MUTED};
          border-radius:8px;
          padding:${TOOLTIP_PADDING}px;
          box-shadow:0 4px 16px rgba(0,0,0,0.3);
          pointer-events:auto;
        ">${textHtml}</div>
      </foreignObject>
    `;

    return {
      id: 'tooltip',
      type: 'tooltip',
      svgContent,
      zOrder: 100,
    };
  }

  /** Calculate tooltip position, flipping to avoid viewport edges */
  static calculatePosition(rect: DOMRect): TooltipPosition {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let left = rect.right + TOOLTIP_OFFSET;
    let top = rect.top;
    let placement: TooltipPosition['placement'] = 'right';

    // Flip left if tooltip would overflow right edge
    if (left + TOOLTIP_WIDTH > viewportW) {
      left = rect.left - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
      placement = 'left';
    }

    // Flip left further if still overflowing, place below
    if (left < 0) {
      left = Math.max(8, rect.left);
      top = rect.bottom + TOOLTIP_OFFSET;
      placement = 'bottom';
    }

    // Flip above if tooltip would overflow bottom
    if (top + 200 > viewportH && placement !== 'bottom') {
      top = Math.max(8, rect.bottom - 200);
    }

    // If placing below and overflows bottom, place above
    if (placement === 'bottom' && top + 200 > viewportH) {
      top = rect.top - 200 - TOOLTIP_OFFSET;
      placement = 'top';
    }

    // Final clamp
    left = Math.max(4, left);
    top = Math.max(4, top);

    return { left, top, placement };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
