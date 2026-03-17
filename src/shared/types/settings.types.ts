import type { ExportFormat, CSSInJSMode } from './export.types';

/** All user-configurable settings */
export interface UserSettings {
  /** Whether the inspector is currently enabled */
  isEnabled: boolean;
  /** Grid base unit in pixels */
  gridBaseUnit: number;
  /** Base pixel value for rem calculations */
  remBase: number;
  /** Default export format */
  exportFormat: ExportFormat;
  /** CSS-in-JS output mode */
  cssInJSMode: CSSInJSMode;
  /** Overlay color theme */
  overlayTheme: 'dark' | 'light';
  /** Show box model overlay bands */
  showBoxModel: boolean;
  /** Show distance measurement lines */
  showDistanceLines: boolean;
  /** Show alignment guide lines */
  showAlignmentGuides: boolean;
  /** Show typography info badges */
  showTypographyInfo: boolean;
  /** Show WCAG contrast ratio badges */
  showContrastRatios: boolean;
  /** Show focus order numbers */
  showFocusOrder: boolean;
  /** Show ARIA role badges */
  showAriaRoles: boolean;
  /** User-defined custom tokens */
  customTokens: CustomToken[];
  /** Path to Tailwind config file */
  tailwindConfigPath?: string;
}

/** A user-defined custom design token */
export interface CustomToken {
  /** Display name for the token */
  name: string;
  /** CSS value this token represents */
  value: string;
  /** Optional category for grouping */
  category?: string;
}
