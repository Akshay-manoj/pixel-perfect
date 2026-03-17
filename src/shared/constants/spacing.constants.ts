/** Available preset grid base units */
export const GRID_BASE_UNITS = [4, 8, 10, 12, 16] as const;

/** Default grid unit in pixels */
export const DEFAULT_GRID_UNIT = 8;

/** Default browser rem base in pixels */
export const REM_BASE = 16;

/** Tolerance in px for "on grid" checks */
export const GRID_TOLERANCE = 2;

/** Tailwind spacing scale: px value → Tailwind key */
export const TAILWIND_SPACING_SCALE: Record<number, string> = {
  0: '0',
  1: 'px',
  2: '0.5',
  4: '1',
  6: '1.5',
  8: '2',
  10: '2.5',
  12: '3',
  14: '3.5',
  16: '4',
  20: '5',
  24: '6',
  28: '7',
  32: '8',
  36: '9',
  40: '10',
  44: '11',
  48: '12',
  52: '13',
  56: '14',
  60: '15',
  64: '16',
  72: '18',
  80: '20',
  96: '24',
};

/** Tailwind border-radius scale: px value → Tailwind key */
export const TAILWIND_RADIUS_SCALE: Record<number, string> = {
  0: 'none',
  2: 'sm',
  4: '',
  6: 'md',
  8: 'lg',
  12: 'xl',
  16: '2xl',
  24: '3xl',
  9999: 'full',
};
