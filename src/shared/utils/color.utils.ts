/** Parse an RGBA string into components. Returns null for invalid input. */
export function parseRGBAString(
  rgba: string
): { r: number; g: number; b: number; a: number } | null {
  const match = rgba.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/
  );
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

/** Convert an rgb() or rgba() string to lowercase hex */
export function rgbToHex(rgb: string): string {
  const parsed = parseRGBAString(rgb);
  if (!parsed) return rgb;
  const { r, g, b } = parsed;
  return (
    '#' +
    [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
  );
}

/** Convert a hex color to RGB components. Returns null for invalid input. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '');
  let r: number, g: number, b: number;

  if (cleaned.length === 3) {
    r = parseInt(cleaned[0] + cleaned[0], 16);
    g = parseInt(cleaned[1] + cleaned[1], 16);
    b = parseInt(cleaned[2] + cleaned[2], 16);
  } else if (cleaned.length === 6) {
    r = parseInt(cleaned.substring(0, 2), 16);
    g = parseInt(cleaned.substring(2, 4), 16);
    b = parseInt(cleaned.substring(4, 6), 16);
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

/** Normalize any CSS color value to lowercase hex */
export function normalizeColor(value: string): string {
  const trimmed = value.trim().toLowerCase();

  // Already hex
  if (trimmed.startsWith('#')) {
    const rgb = hexToRgb(trimmed);
    if (!rgb) return trimmed;
    return rgbToHex(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
  }

  // rgb/rgba
  if (trimmed.startsWith('rgb')) {
    return rgbToHex(trimmed);
  }

  return trimmed;
}

/** Calculate relative luminance of a color (WCAG 2.1) */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** Calculate WCAG contrast ratio between two colors (hex or rgb strings) */
export function getContrastRatio(fg: string, bg: string): number {
  const fgRgb = hexToRgb(normalizeColor(fg));
  const bgRgb = hexToRgb(normalizeColor(bg));
  if (!fgRgb || !bgRgb) return 1;

  const l1 = getRelativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const l2 = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

/** Check if a contrast ratio meets WCAG compliance level */
export function isWCAGCompliant(
  ratio: number,
  level: 'AA' | 'AAA',
  isLargeText: boolean = false
): boolean {
  if (level === 'AA') {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}
