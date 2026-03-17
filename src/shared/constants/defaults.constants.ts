import type { UserSettings } from '../types/settings.types';
import { DEFAULT_EXPORT_FORMAT } from './export.constants';
import { DEFAULT_GRID_UNIT, REM_BASE } from './spacing.constants';

/** Default settings applied on first install and as fallback */
export const DEFAULT_SETTINGS: UserSettings = {
  isEnabled: false,
  gridBaseUnit: DEFAULT_GRID_UNIT,
  remBase: REM_BASE,
  exportFormat: DEFAULT_EXPORT_FORMAT,
  cssInJSMode: 'template',
  overlayTheme: 'dark',
  showBoxModel: true,
  showDistanceLines: true,
  showAlignmentGuides: true,
  showTypographyInfo: false,
  showContrastRatios: false,
  showFocusOrder: false,
  showAriaRoles: false,
  customTokens: [],
};
