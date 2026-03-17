import type { OverlayLayer } from '@shared/types/overlay.types';

const SVG_NS = 'http://www.w3.org/2000/svg';
const OVERLAY_ID = 'pixelperfect-overlay-root';

/** Manages the root SVG overlay layer injected into the page */
export class OverlayRenderer {
  private svg: SVGSVGElement | null = null;
  private pendingFrame: number | null = null;
  private currentLayers: OverlayLayer[] = [];

  constructor() {
    this.inject();
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  /** Render overlay layers, batched via requestAnimationFrame */
  render(layers: OverlayLayer[]): void {
    this.currentLayers = layers;
    if (this.pendingFrame !== null) {
      cancelAnimationFrame(this.pendingFrame);
    }
    this.pendingFrame = requestAnimationFrame(() => {
      this.pendingFrame = null;
      this.applyLayers(layers);
    });
  }

  /** Remove all layer content from the SVG */
  clear(): void {
    this.currentLayers = [];
    if (this.pendingFrame !== null) {
      cancelAnimationFrame(this.pendingFrame);
      this.pendingFrame = null;
    }
    if (this.svg) {
      while (this.svg.firstChild) {
        this.svg.removeChild(this.svg.firstChild);
      }
    }
  }

  /** Remove the SVG element from the DOM entirely */
  destroy(): void {
    this.clear();
    window.removeEventListener('resize', this.handleResize);
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
    this.svg = null;
  }

  /** Get the root SVG element (for testing) */
  getSVGRoot(): SVGSVGElement | null {
    return this.svg;
  }

  private inject(): void {
    // Avoid duplicate injection
    const existing = document.getElementById(OVERLAY_ID);
    if (existing) {
      this.svg = existing as unknown as SVGSVGElement;
      return;
    }

    this.svg = document.createElementNS(SVG_NS, 'svg');
    this.svg.setAttribute('id', OVERLAY_ID);
    this.svg.setAttribute('data-pixelperfect', 'overlay');
    this.svg.style.position = 'fixed';
    this.svg.style.top = '0';
    this.svg.style.left = '0';
    this.svg.style.width = '100vw';
    this.svg.style.height = '100vh';
    this.svg.style.pointerEvents = 'none';
    this.svg.style.zIndex = '2147483647';
    this.svg.style.overflow = 'visible';
    document.body.appendChild(this.svg);
  }

  private applyLayers(layers: OverlayLayer[]): void {
    if (!this.svg) return;

    // Clear existing content
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    // Sort by zOrder and inject each layer
    const sorted = [...layers].sort((a, b) => a.zOrder - b.zOrder);
    for (const layer of sorted) {
      const group = document.createElementNS(SVG_NS, 'g');
      group.setAttribute('data-layer', layer.type);
      group.setAttribute('data-layer-id', layer.id);
      group.innerHTML = layer.svgContent;
      this.svg.appendChild(group);
    }
  }

  private handleResize(): void {
    if (this.currentLayers.length > 0) {
      this.render(this.currentLayers);
    }
  }
}
