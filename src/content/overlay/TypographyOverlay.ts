import type { TypographyData } from '@shared/types/element.types';
import type { OverlayLayer } from '@shared/types/overlay.types';

const BG_COLOR = '#1E1E2E';
const TEXT_COLOR = '#CDD6F4';

/** Builds SVG typography detail badge */
export class TypographyOverlay {
  static build(data: TypographyData, rect: DOMRect): OverlayLayer {
    const lines: string[] = [];

    // Line 1: font family / size / weight / line-height
    const family = data.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    lines.push(`${family} / ${data.fontSize}px / ${data.fontWeight} / ${data.lineHeight}`);

    // Line 2: color + contrast + WCAG
    const aa = data.wcagAA ? 'AA \u2713' : 'AA \u2717';
    const aaa = data.wcagAAA ? 'AAA \u2713' : 'AAA \u2717';
    const contrast = data.contrastRatio ? `${data.contrastRatio}:1` : '';
    lines.push(`${data.color}  contrast: ${contrast}  ${aa}  ${aaa}`);

    const width = Math.max(...lines.map((l) => l.length * 6.5 + 16), 200);
    const height = lines.length * 16 + 12;
    const x = rect.left;
    const y = rect.bottom + 6;

    let svg = `
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="6"
        fill="${BG_COLOR}" stroke="#45475A" stroke-width="1" opacity="0.95"/>
    `;

    lines.forEach((line, i) => {
      const color = i === 0 ? TEXT_COLOR : '#A6ADC8';
      svg += `<text x="${x + 8}" y="${y + 14 + i * 16}" fill="${color}" font-size="10"
        font-family="monospace" style="pointer-events:none">${TypographyOverlay.escape(line)}</text>`;
    });

    return {
      id: 'typography-overlay',
      type: 'typography',
      svgContent: svg,
      zOrder: 35,
    };
  }

  private static escape(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
