/** Types of overlay layers the renderer can draw */
export type OverlayLayerType =
  | 'box-model'
  | 'distance-lines'
  | 'alignment-guides'
  | 'tooltip'
  | 'flexbox'
  | 'grid'
  | 'typography'
  | 'z-index'
  | 'contrast';

/** A single renderable overlay layer */
export interface OverlayLayer {
  /** Unique identifier for this layer */
  id: string;
  /** Layer type determines rendering strategy */
  type: OverlayLayerType;
  /** SVG markup content for this layer */
  svgContent: string;
  /** Z-order within the overlay (higher = on top) */
  zOrder: number;
}

/** Overlay color theme */
export type OverlayTheme = 'dark' | 'light';

/** Tooltip positioning data */
export interface TooltipPosition {
  /** Top offset in pixels */
  top: number;
  /** Left offset in pixels */
  left: number;
  /** Placement direction relative to element */
  placement: 'top' | 'bottom' | 'left' | 'right';
}
