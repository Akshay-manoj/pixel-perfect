import type { ElementInfo } from '@shared/types/element.types';
import type { OverlayLayer, OverlayTheme } from '@shared/types/overlay.types';
import { OVERLAY_COLORS, OVERLAY_COLORS_LIGHT } from '@shared/constants/colors.constants';

/** Builds the colored box model overlay (margin/border/padding/content zones) */
export class BoxModelOverlay {
  /** Build an OverlayLayer for the box model visualization */
  static build(info: ElementInfo, theme: OverlayTheme = 'dark'): OverlayLayer {
    const colors = theme === 'dark' ? OVERLAY_COLORS : OVERLAY_COLORS_LIGHT;
    const { rect, boxModel } = info;
    const { margin, border, padding } = boxModel;

    // Margin zone (outermost)
    const marginRect = {
      x: rect.left - margin.left,
      y: rect.top - margin.top,
      width: rect.width + margin.left + margin.right,
      height: rect.height + margin.top + margin.bottom,
    };

    // Border zone
    const borderRect = {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };

    // Padding zone (inside border)
    const paddingRect = {
      x: rect.left + border.left,
      y: rect.top + border.top,
      width: rect.width - border.left - border.right,
      height: rect.height - border.top - border.bottom,
    };

    // Content zone (innermost)
    const contentRect = {
      x: rect.left + border.left + padding.left,
      y: rect.top + border.top + padding.top,
      width: rect.width - border.left - border.right - padding.left - padding.right,
      height: rect.height - border.top - border.bottom - padding.top - padding.bottom,
    };

    const svgContent = [
      BoxModelOverlay.svgRect(marginRect, colors.MARGIN),
      BoxModelOverlay.svgRect(borderRect, colors.BORDER),
      BoxModelOverlay.svgRect(paddingRect, colors.PADDING),
      BoxModelOverlay.svgRect(contentRect, colors.CONTENT),
    ].join('\n');

    return {
      id: 'box-model',
      type: 'box-model',
      svgContent,
      zOrder: 10,
    };
  }

  private static svgRect(
    r: { x: number; y: number; width: number; height: number },
    fill: string
  ): string {
    if (r.width <= 0 || r.height <= 0) return '';
    return `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="${fill}" />`;
  }
}
