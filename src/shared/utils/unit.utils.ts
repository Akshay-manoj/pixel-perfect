import { REM_BASE } from '../constants/spacing.constants';

/** Convert pixels to rem units */
export function pxToRem(px: number, base: number = REM_BASE): number {
  if (base === 0) return 0;
  return roundToDecimal(px / base, 4);
}

/** Convert rem units to pixels */
export function remToPx(rem: number, base: number = REM_BASE): number {
  return roundToDecimal(rem * base, 2);
}

/** Round a number to a specified number of decimal places */
export function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/** Format a pixel value as a string with 'px' suffix */
export function formatPx(value: number): string {
  return `${value}px`;
}

/** Format a rem value as a string with 'rem' suffix */
export function formatRem(value: number): string {
  return `${value}rem`;
}

/** Snap a pixel value to the nearest grid unit */
export function snapToGrid(value: number, gridUnit: number): number {
  if (gridUnit <= 0) return value;
  return Math.round(value / gridUnit) * gridUnit;
}

/** Check if a pixel value falls on the grid (within tolerance) */
export function isOnGrid(value: number, gridUnit: number, tolerance: number = 0): boolean {
  if (gridUnit <= 0) return true;
  const remainder = Math.abs(value % gridUnit);
  return remainder <= tolerance || gridUnit - remainder <= tolerance;
}

/** Parse a CSS pixel value string to a number. Returns 0 for non-numeric values. */
export function parsePixelValue(value: string): number {
  if (!value || value === 'auto' || value === 'none' || value === 'normal') {
    return 0;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}
