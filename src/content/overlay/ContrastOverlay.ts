import type { OverlayLayer } from '@shared/types/overlay.types';
import { TypographyInspector } from '../inspector/TypographyInspector';

/** Renders WCAG contrast ratio pass/fail badges on all visible text elements */
export class ContrastOverlay {
  private inspector: TypographyInspector;

  constructor() {
    this.inspector = new TypographyInspector();
  }

  /** Scan page and build overlay with contrast badges on text elements */
  build(): OverlayLayer {
    let svg = '';
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, label, td, th, button, caption');

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (!this.inspector.hasTextContent(el)) continue;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      // Skip off-screen
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;

      const data = this.inspector.inspect(el);
      if (!data.contrastRatio) continue;

      const pass = data.wcagAA;
      const color = pass ? '#22C55E' : '#EF4444';
      const label = `${data.contrastRatio}:1 ${pass ? 'AA\u2713' : 'AA\u2717'}`;
      const w = label.length * 6.5 + 8;

      svg += `
        <rect x="${rect.right + 4}" y="${rect.top}" width="${w}" height="14" rx="3"
          fill="${color}" opacity="0.85"/>
        <text x="${rect.right + 8}" y="${rect.top + 11}" fill="#FFFFFF" font-size="9"
          font-family="monospace" style="pointer-events:none">${label}</text>
      `;
    }

    return {
      id: 'contrast-overlay',
      type: 'contrast',
      svgContent: svg,
      zOrder: 25,
    };
  }
}
