import type { ZIndexLayer } from '@shared/types/element.types';
import type { OverlayLayer } from '@shared/types/overlay.types';

const LAYER_COLORS = [
  'rgba(239, 68, 68, 0.15)',
  'rgba(249, 115, 22, 0.15)',
  'rgba(234, 179, 8, 0.15)',
  'rgba(34, 197, 94, 0.15)',
  'rgba(59, 130, 246, 0.15)',
  'rgba(139, 92, 246, 0.15)',
];
const BADGE_BG = '#1E1E2E';

/** Builds SVG 3D-perspective z-index stack visualization */
export class ZIndexOverlay {
  static build(layers: ZIndexLayer[], highlightElement?: Element): OverlayLayer {
    let svg = '';
    const total = layers.length;

    for (let i = 0; i < total; i++) {
      const layer = layers[i];
      const { left, top, width, height } = layer.rect;
      const color = LAYER_COLORS[i % LAYER_COLORS.length];
      const isHighlighted = highlightElement && layer.element === highlightElement;
      const offset = i * 3; // 3D offset for perspective

      // Layer rectangle with slight offset for depth effect
      svg += `<rect x="${left - offset}" y="${top - offset}" width="${width}" height="${height}"
        fill="${color}" stroke="${isHighlighted ? '#FFFFFF' : 'rgba(255,255,255,0.2)'}"
        stroke-width="${isHighlighted ? 2 : 1}" rx="2"/>`;

      // Z-index badge
      const badgeText = `z: ${layer.zIndex}`;
      const bw = badgeText.length * 7 + 10;
      svg += `
        <rect x="${left - offset}" y="${top - offset - 18}" width="${bw}" height="16" rx="3"
          fill="${BADGE_BG}" stroke="#45475A" stroke-width="1" opacity="0.95"/>
        <text x="${left - offset + 5}" y="${top - offset - 6}" fill="#CDD6F4" font-size="10"
          font-family="monospace" style="pointer-events:none">${badgeText}</text>
      `;
    }

    return {
      id: 'zindex-overlay',
      type: 'z-index',
      svgContent: svg,
      zOrder: 40,
    };
  }
}
