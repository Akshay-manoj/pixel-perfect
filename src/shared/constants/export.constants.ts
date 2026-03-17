/** All supported export format identifiers */
export const EXPORT_FORMATS = {
  CSS: 'css',
  SCSS: 'scss',
  SASS: 'sass',
  TAILWIND: 'tailwind',
  CSS_IN_JS_TEMPLATE: 'css-in-js-template',
  CSS_IN_JS_OBJECT: 'css-in-js-object',
  CSS_VARIABLES: 'css-variables',
} as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[keyof typeof EXPORT_FORMATS];

/** Display labels for each export format */
export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  css: 'CSS',
  scss: 'SCSS',
  sass: 'SASS',
  tailwind: 'Tailwind',
  'css-in-js-template': 'Styled',
  'css-in-js-object': 'JS Object',
  'css-variables': 'CSS Vars',
};

/** Default export format */
export const DEFAULT_EXPORT_FORMAT: ExportFormat = 'css';
