import type { AlignmentResult } from '@shared/types/element.types';
import type { OverlayLayer } from '@shared/types/overlay.types';
import { OVERLAY_COLORS } from '@shared/constants/colors.constants';

/** Builds SVG dotted alignment guide lines across the viewport */
export class AlignmentGuideOverlay {
  static build(alignment: AlignmentResult, rectA: DOMRect, rectB: DOMRect): OverlayLayer {
    const color = OVERLAY_COLORS.ALIGNMENT_GUIDE;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let svg = '';

    if (alignment.alignedTop) {
      const y = (rectA.top + rectB.top) / 2;
      svg += AlignmentGuideOverlay.horizontalGuide(y, vw, 'top aligned', color);
    }

    if (alignment.alignedBottom) {
      const y = (rectA.bottom + rectB.bottom) / 2;
      svg += AlignmentGuideOverlay.horizontalGuide(y, vw, 'bottom aligned', color);
    }

    if (alignment.alignedLeft) {
      const x = (rectA.left + rectB.left) / 2;
      svg += AlignmentGuideOverlay.verticalGuide(x, vh, 'left aligned', color);
    }

    if (alignment.alignedRight) {
      const x = (rectA.right + rectB.right) / 2;
      svg += AlignmentGuideOverlay.verticalGuide(x, vh, 'right aligned', color);
    }

    if (alignment.alignedCenterX) {
      const x = (rectA.left + rectA.width / 2 + rectB.left + rectB.width / 2) / 2;
      svg += AlignmentGuideOverlay.verticalGuide(x, vh, 'center', color);
    }

    if (alignment.alignedCenterY) {
      const y = (rectA.top + rectA.height / 2 + rectB.top + rectB.height / 2) / 2;
      svg += AlignmentGuideOverlay.horizontalGuide(y, vw, 'center', color);
    }

    return {
      id: 'alignment-guides',
      type: 'alignment-guides',
      svgContent: svg,
      zOrder: 15,
    };
  }

  private static horizontalGuide(y: number, vw: number, label: string, color: string): string {
    return `
      <line x1="0" y1="${y}" x2="${vw}" y2="${y}"
        stroke="${color}" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="${vw - 8}" y="${y - 4}" text-anchor="end"
        fill="${color}" font-size="10" font-family="monospace, sans-serif"
        style="pointer-events:none">${label}</text>
    `;
  }

  private static verticalGuide(x: number, vh: number, label: string, color: string): string {
    return `
      <line x1="${x}" y1="0" x2="${x}" y2="${vh}"
        stroke="${color}" stroke-width="1" stroke-dasharray="4 4"/>
      <text x="${x + 4}" y="12" text-anchor="start"
        fill="${color}" font-size="10" font-family="monospace, sans-serif"
        style="pointer-events:none">${label}</text>
    `;
  }
}
