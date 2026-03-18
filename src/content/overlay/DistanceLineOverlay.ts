import type { ElementInfo, DistanceMeasurement } from '@shared/types/element.types';
import type { OverlayLayer, OverlayTheme } from '@shared/types/overlay.types';
import { OVERLAY_COLORS, OVERLAY_COLORS_LIGHT } from '@shared/constants/colors.constants';

/** Builds SVG red measurement lines between two elements */
export class DistanceLineOverlay {
  static build(
    infoA: ElementInfo,
    infoB: ElementInfo,
    distance: DistanceMeasurement,
    theme: OverlayTheme = 'dark',
  ): OverlayLayer {
    const colors = theme === 'light' ? OVERLAY_COLORS_LIGHT : OVERLAY_COLORS;
    const lineColor = colors.DISTANCE_LINE;
    const rA = infoA.rect;
    const rB = infoB.rect;
    let svg = '';

    // Top gap: A is above B
    if (distance.top > 0) {
      const x = Math.max(rA.left, rB.left) + Math.min(rA.right - rA.left, rB.right - rB.left) / 2;
      svg += DistanceLineOverlay.verticalLine(x, rA.bottom, x, rB.top, distance.top, lineColor);
    }

    // Bottom gap: B is above A
    if (distance.bottom > 0) {
      const x = Math.max(rA.left, rB.left) + Math.min(rA.right - rA.left, rB.right - rB.left) / 2;
      svg += DistanceLineOverlay.verticalLine(x, rB.bottom, x, rA.top, distance.bottom, lineColor);
    }

    // Left gap: A is to the left of B
    if (distance.left > 0) {
      const y = Math.max(rA.top, rB.top) + Math.min(rA.bottom - rA.top, rB.bottom - rB.top) / 2;
      svg += DistanceLineOverlay.horizontalLine(rA.right, y, rB.left, y, distance.left, lineColor);
    }

    // Right gap: B is to the left of A
    if (distance.right > 0) {
      const y = Math.max(rA.top, rB.top) + Math.min(rA.bottom - rA.top, rB.bottom - rB.top) / 2;
      svg += DistanceLineOverlay.horizontalLine(rB.right, y, rA.left, y, distance.right, lineColor);
    }

    return {
      id: 'distance-lines',
      type: 'distance-lines',
      svgContent: svg,
      zOrder: 20,
    };
  }

  private static verticalLine(
    x1: number, y1: number, x2: number, y2: number,
    value: number, color: string,
  ): string {
    const midY = (y1 + y2) / 2;
    return `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
        stroke="${color}" stroke-width="1.5" stroke-dasharray="6 3">
        <animate attributeName="stroke-dashoffset" from="9" to="0" dur="0.4s" fill="freeze"/>
      </line>
      ${DistanceLineOverlay.label(x1, midY, value, color)}
    `;
  }

  private static horizontalLine(
    x1: number, y1: number, x2: number, y2: number,
    value: number, color: string,
  ): string {
    const midX = (x1 + x2) / 2;
    return `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
        stroke="${color}" stroke-width="1.5" stroke-dasharray="6 3">
        <animate attributeName="stroke-dashoffset" from="9" to="0" dur="0.4s" fill="freeze"/>
      </line>
      ${DistanceLineOverlay.label(midX, y1, value, color)}
    `;
  }

  private static label(x: number, y: number, value: number, color: string): string {
    const text = `Distance: ${Math.round(value)}px`;
    const width = text.length * 7 + 10;
    const height = 18;
    return `
      <rect x="${x - width / 2}" y="${y - height / 2}" width="${width}" height="${height}"
        rx="4" fill="${color}" opacity="0.9"/>
      <text x="${x}" y="${y + 4.5}" text-anchor="middle"
        fill="#FFFFFF" font-size="11" font-family="monospace, sans-serif"
        style="pointer-events:none">${text}</text>
    `;
  }
}
