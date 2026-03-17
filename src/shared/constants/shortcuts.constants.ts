/** All keyboard shortcut definitions */
export const KEYBOARD_SHORTCUTS = {
  TOGGLE_EXTENSION: {
    key: 'S',
    ctrl: true,
    shift: true,
    description: 'Toggle PixelPerfect on/off',
    action: 'TOGGLE_INSPECTOR',
  },
  MEASURE_MODE: {
    key: 'Alt',
    description: 'Hold to measure distance between elements',
    action: 'MEASURE_MODE',
  },
  PIN_ELEMENT: {
    key: 'Click',
    shift: true,
    description: 'Pin element as fixed reference point',
    action: 'PIN_ELEMENT',
  },
  CLEAR_OVERLAYS: {
    key: 'Escape',
    description: 'Clear all overlays and exit inspection',
    action: 'CLEAR_OVERLAYS',
  },
  COPY_CSS: {
    key: 'C',
    ctrl: true,
    shift: true,
    description: 'Copy selected element in default export format',
    action: 'COPY_CSS',
  },
  NEXT_EXPORT_FORMAT: {
    key: 'Tab',
    shift: false,
    description: 'Cycle to next export format',
    action: 'NEXT_FORMAT',
  },
} as const;
