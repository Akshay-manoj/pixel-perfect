import type { TokenMap } from '@shared/types/token.types';

/** CSS properties that are browser defaults and should be excluded */
const DEFAULT_VALUES: Record<string, Set<string>> = {
  display: new Set(['block', 'inline']),
  position: new Set(['static']),
  visibility: new Set(['visible']),
  opacity: new Set(['1']),
  overflow: new Set(['visible']),
  'box-sizing': new Set(['content-box']),
  'float': new Set(['none']),
  clear: new Set(['none']),
  'vertical-align': new Set(['baseline']),
  'text-decoration': new Set(['none']),
  'text-transform': new Set(['none']),
  'white-space': new Set(['normal']),
  cursor: new Set(['auto']),
  'pointer-events': new Set(['auto']),
};

/** Block-level tags that have display: block by default */
const BLOCK_TAGS = new Set([
  'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'section', 'article', 'header', 'footer', 'nav', 'main', 'aside',
  'ul', 'ol', 'li', 'form', 'fieldset', 'blockquote', 'pre',
]);

/** Properties worth extracting from computed styles */
const MEANINGFUL_PROPERTIES = [
  'display', 'position', 'top', 'right', 'bottom', 'left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-radius',
  'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius',
  'background-color', 'background-image',
  'color', 'font-family', 'font-size', 'font-weight', 'font-style',
  'line-height', 'letter-spacing', 'text-align', 'text-decoration', 'text-transform',
  'opacity', 'overflow', 'z-index',
  'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'gap',
  'grid-template-columns', 'grid-template-rows',
  'box-shadow', 'cursor',
];

/** Filter out browser-default property values, returning only meaningful ones */
export function filterMeaningfulProperties(
  styles: CSSStyleDeclaration,
  tagName: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  const tag = tagName.toLowerCase();

  for (const prop of MEANINGFUL_PROPERTIES) {
    const value = styles.getPropertyValue(prop);
    if (!value || value === '' || value === 'none' || value === 'normal' || value === 'auto') {
      // Keep "none" for display, keep "auto" for specific properties
      if (prop === 'display' && value === 'none') {
        result[prop] = value;
        continue;
      }
      continue;
    }

    // Skip zero values for spacing/size
    if (value === '0px' && (prop.startsWith('margin') || prop.startsWith('padding') ||
        prop.startsWith('border-') && prop.endsWith('-width') ||
        prop === 'top' || prop === 'right' || prop === 'bottom' || prop === 'left' ||
        prop === 'gap')) {
      continue;
    }

    // Skip browser defaults
    const defaults = DEFAULT_VALUES[prop];
    if (defaults?.has(value)) {
      // Keep display:block only if it's an inline element by default
      if (prop === 'display' && value === 'block' && BLOCK_TAGS.has(tag)) continue;
      if (prop !== 'display') continue;
    }

    // Skip rgba(0,0,0,0) transparent backgrounds
    if (prop === 'background-color' && (value === 'rgba(0, 0, 0, 0)' || value === 'transparent')) {
      continue;
    }

    // Skip border style "none"
    if (prop.includes('border') && prop.includes('style') && value === 'none') continue;

    result[prop] = value;
  }

  return result;
}

/** Convert a kebab-case CSS property to camelCase */
export function toCamelCase(property: string): string {
  return property.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** Find a token name for a value, or return the raw value */
export function resolveTokenOrValue(value: string, tokenMap?: TokenMap): string {
  if (!tokenMap) return value;

  const normalized = value.trim().toLowerCase();
  const matches = tokenMap.byValue[normalized];
  if (matches && matches.length > 0) {
    return matches[0].name;
  }

  return value;
}
