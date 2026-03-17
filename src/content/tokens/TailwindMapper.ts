import { TAILWIND_SPACING_SCALE, TAILWIND_RADIUS_SCALE } from '@shared/constants/spacing.constants';
import { normalizeColor } from '@shared/utils/color.utils';

/** Maps raw CSS values to Tailwind utility class names */
export class TailwindMapper {
  /** Map a pixel spacing value to a Tailwind class */
  mapSpacing(
    px: number,
    property: 'margin' | 'padding' | 'gap' | 'width' | 'height',
  ): string | null {
    const key = TAILWIND_SPACING_SCALE[px];
    if (key === undefined) return null;

    const prefix = {
      margin: 'm',
      padding: 'p',
      gap: 'gap',
      width: 'w',
      height: 'h',
    }[property];

    return `${prefix}-${key}`;
  }

  /** Map a pixel border-radius value to a Tailwind class */
  mapBorderRadius(px: number): string | null {
    const key = TAILWIND_RADIUS_SCALE[px];
    if (key === undefined) return null;
    if (key === '') return 'rounded';
    return `rounded-${key}`;
  }

  /** Map a pixel font-size value to a Tailwind class */
  mapFontSize(px: number): string | null {
    const sizeMap: Record<number, string> = {
      12: 'text-xs',
      14: 'text-sm',
      16: 'text-base',
      18: 'text-lg',
      20: 'text-xl',
      24: 'text-2xl',
      30: 'text-3xl',
      36: 'text-4xl',
      48: 'text-5xl',
      60: 'text-6xl',
      72: 'text-7xl',
      96: 'text-8xl',
      128: 'text-9xl',
    };
    return sizeMap[px] ?? null;
  }

  /** Map a hex color to a Tailwind color palette name */
  mapColor(hex: string): string | null {
    const normalized = normalizeColor(hex);
    return TAILWIND_COLOR_MAP[normalized] ?? null;
  }
}

/** Subset of Tailwind default color palette mapped from hex to name */
const TAILWIND_COLOR_MAP: Record<string, string> = {
  '#000000': 'black',
  '#ffffff': 'white',
  // slate
  '#f8fafc': 'slate-50', '#f1f5f9': 'slate-100', '#e2e8f0': 'slate-200',
  '#cbd5e1': 'slate-300', '#94a3b8': 'slate-400', '#64748b': 'slate-500',
  '#475569': 'slate-600', '#334155': 'slate-700', '#1e293b': 'slate-800',
  '#0f172a': 'slate-900',
  // gray
  '#f9fafb': 'gray-50', '#f3f4f6': 'gray-100', '#e5e7eb': 'gray-200',
  '#d1d5db': 'gray-300', '#9ca3af': 'gray-400', '#6b7280': 'gray-500',
  '#4b5563': 'gray-600', '#374151': 'gray-700', '#1f2937': 'gray-800',
  '#111827': 'gray-900',
  // red
  '#fef2f2': 'red-50', '#fee2e2': 'red-100', '#fecaca': 'red-200',
  '#fca5a5': 'red-300', '#f87171': 'red-400', '#ef4444': 'red-500',
  '#dc2626': 'red-600', '#b91c1c': 'red-700', '#991b1b': 'red-800',
  '#7f1d1d': 'red-900',
  // orange
  '#fff7ed': 'orange-50', '#ffedd5': 'orange-100', '#fed7aa': 'orange-200',
  '#fdba74': 'orange-300', '#fb923c': 'orange-400', '#f97316': 'orange-500',
  '#ea580c': 'orange-600', '#c2410c': 'orange-700', '#9a3412': 'orange-800',
  '#7c2d12': 'orange-900',
  // yellow
  '#fefce8': 'yellow-50', '#fef9c3': 'yellow-100', '#fef08a': 'yellow-200',
  '#fde047': 'yellow-300', '#facc15': 'yellow-400', '#eab308': 'yellow-500',
  '#ca8a04': 'yellow-600', '#a16207': 'yellow-700', '#854d0e': 'yellow-800',
  '#713f12': 'yellow-900',
  // green
  '#f0fdf4': 'green-50', '#dcfce7': 'green-100', '#bbf7d0': 'green-200',
  '#86efac': 'green-300', '#4ade80': 'green-400', '#22c55e': 'green-500',
  '#16a34a': 'green-600', '#15803d': 'green-700', '#166534': 'green-800',
  '#14532d': 'green-900',
  // blue
  '#eff6ff': 'blue-50', '#dbeafe': 'blue-100', '#bfdbfe': 'blue-200',
  '#93c5fd': 'blue-300', '#60a5fa': 'blue-400', '#3b82f6': 'blue-500',
  '#2563eb': 'blue-600', '#1d4ed8': 'blue-700', '#1e40af': 'blue-800',
  '#1e3a8a': 'blue-900',
  // indigo
  '#eef2ff': 'indigo-50', '#e0e7ff': 'indigo-100', '#c7d2fe': 'indigo-200',
  '#a5b4fc': 'indigo-300', '#818cf8': 'indigo-400', '#6366f1': 'indigo-500',
  '#4f46e5': 'indigo-600', '#4338ca': 'indigo-700', '#3730a3': 'indigo-800',
  '#312e81': 'indigo-900',
  // violet
  '#f5f3ff': 'violet-50', '#ede9fe': 'violet-100', '#ddd6fe': 'violet-200',
  '#c4b5fd': 'violet-300', '#a78bfa': 'violet-400', '#8b5cf6': 'violet-500',
  '#7c3aed': 'violet-600', '#6d28d9': 'violet-700', '#5b21b6': 'violet-800',
  '#4c1d95': 'violet-900',
  // purple
  '#faf5ff': 'purple-50', '#f3e8ff': 'purple-100', '#e9d5ff': 'purple-200',
  '#d8b4fe': 'purple-300', '#c084fc': 'purple-400', '#a855f7': 'purple-500',
  '#9333ea': 'purple-600', '#7e22ce': 'purple-700', '#6b21a8': 'purple-800',
  '#581c87': 'purple-900',
  // pink
  '#fdf2f8': 'pink-50', '#fce7f3': 'pink-100', '#fbcfe8': 'pink-200',
  '#f9a8d4': 'pink-300', '#f472b6': 'pink-400', '#ec4899': 'pink-500',
  '#db2777': 'pink-600', '#be185d': 'pink-700', '#9d174d': 'pink-800',
  '#831843': 'pink-900',
};
