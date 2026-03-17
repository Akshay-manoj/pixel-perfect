import type { GridData } from '@shared/types/element.types';
import type { OverlayLayer } from '@shared/types/overlay.types';

const TRACK_COLOR = 'rgba(99, 102, 241, 0.5)';
const LABEL_BG = '#4338CA';

/** Builds SVG overlay showing CSS Grid track lines and area labels */
export class GridOverlay {
  static build(data: GridData, containerRect: DOMRect): OverlayLayer {
    let svg = '';
    const { left, top, width, height } = containerRect;

    // Parse column tracks
    const colSizes = GridOverlay.parseTracks(data.templateColumns, width);
    let x = left;
    for (let i = 0; i < colSizes.length; i++) {
      // Draw track line
      svg += `<line x1="${x}" y1="${top}" x2="${x}" y2="${top + height}"
        stroke="${TRACK_COLOR}" stroke-width="1" stroke-dasharray="4 2"/>`;
      // Label
      const label = GridOverlay.trackLabel(colSizes[i]);
      svg += `
        <rect x="${x + 2}" y="${top - 16}" width="${label.length * 6 + 8}" height="14" rx="2" fill="${LABEL_BG}" opacity="0.85"/>
        <text x="${x + 6}" y="${top - 5}" fill="#FFFFFF" font-size="9" font-family="monospace" style="pointer-events:none">${label}</text>
      `;
      x += colSizes[i];
    }
    // Closing line
    svg += `<line x1="${x}" y1="${top}" x2="${x}" y2="${top + height}"
      stroke="${TRACK_COLOR}" stroke-width="1" stroke-dasharray="4 2"/>`;

    // Parse row tracks
    const rowSizes = GridOverlay.parseTracks(data.templateRows, height);
    let y = top;
    for (let i = 0; i < rowSizes.length; i++) {
      svg += `<line x1="${left}" y1="${y}" x2="${left + width}" y2="${y}"
        stroke="${TRACK_COLOR}" stroke-width="1" stroke-dasharray="4 2"/>`;
      const label = GridOverlay.trackLabel(rowSizes[i]);
      svg += `
        <rect x="${left - label.length * 6 - 12}" y="${y + 2}" width="${label.length * 6 + 8}" height="14" rx="2" fill="${LABEL_BG}" opacity="0.85"/>
        <text x="${left - label.length * 6 - 8}" y="${y + 13}" fill="#FFFFFF" font-size="9" font-family="monospace" style="pointer-events:none">${label}</text>
      `;
      y += rowSizes[i];
    }
    svg += `<line x1="${left}" y1="${y}" x2="${left + width}" y2="${y}"
      stroke="${TRACK_COLOR}" stroke-width="1" stroke-dasharray="4 2"/>`;

    // Gap badges
    if (data.columnGap > 0 || data.rowGap > 0) {
      const gapText = `gap: ${data.columnGap}px / ${data.rowGap}px`;
      svg += `
        <rect x="${left}" y="${top + height + 4}" width="${gapText.length * 6 + 10}" height="14" rx="2" fill="${LABEL_BG}" opacity="0.85"/>
        <text x="${left + 5}" y="${top + height + 15}" fill="#FFFFFF" font-size="9" font-family="monospace" style="pointer-events:none">${gapText}</text>
      `;
    }

    // Child placement highlights
    for (const child of data.children) {
      const r = child.element.getBoundingClientRect();
      svg += `<rect x="${r.left}" y="${r.top}" width="${r.width}" height="${r.height}"
        fill="rgba(99, 102, 241, 0.1)" stroke="rgba(99, 102, 241, 0.4)" stroke-width="1"/>`;
      if (child.gridArea && child.gridArea !== 'auto') {
        svg += `<text x="${r.left + 4}" y="${r.top + 12}" fill="#A5B4FC" font-size="9" font-family="monospace" style="pointer-events:none">${child.gridArea}</text>`;
      }
    }

    return {
      id: 'grid-overlay',
      type: 'grid',
      svgContent: svg,
      zOrder: 30,
    };
  }

  /** Parse track sizes from computed gridTemplate string — returns pixel widths */
  private static parseTracks(template: string, totalSize: number): number[] {
    if (!template || template === 'none') return [totalSize];
    const parts = template.trim().split(/\s+/);
    return parts.map((p) => parseFloat(p) || totalSize / parts.length);
  }

  private static trackLabel(px: number): string {
    return `${Math.round(px)}px`;
  }
}
