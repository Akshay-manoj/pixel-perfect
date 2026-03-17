/** Category of a design token */
export type TokenCategory = 'color' | 'spacing' | 'radius' | 'shadow' | 'typography' | 'other';

/** Source of a design token */
export type TokenSource = 'page' | 'custom' | 'imported';

/** A single design token */
export interface DesignToken {
  /** CSS custom property name, e.g. "--color-primary" */
  name: string;
  /** Raw authored value, e.g. "#3B82F6" */
  rawValue: string;
  /** Resolved computed value, e.g. "rgb(59, 130, 246)" */
  resolvedValue: string;
  /** Auto-detected or user-assigned category */
  category: TokenCategory;
  /** Where this token came from */
  source: TokenSource;
}

/** Bidirectional lookup map for design tokens */
export interface TokenMap {
  /** Reverse lookup: computed value → matching tokens */
  byValue: Record<string, DesignToken[]>;
  /** Lookup by name → token data */
  byName: Record<string, DesignToken>;
  /** All tokens as a flat array */
  allTokens: DesignToken[];
}

/** A single CSS value with optional token/Tailwind mappings */
export interface MappedValue {
  /** The raw computed value, e.g. "24px" */
  rawValue: string;
  /** Matched token name, e.g. "--spacing-6" */
  tokenName?: string;
  /** Matched Tailwind class, e.g. "m-6" */
  tailwindClass?: string;
  /** Converted rem value, e.g. "1.5rem" */
  remValue?: string;
}

/** Box model with token mappings on each edge */
export interface MappedBoxModel {
  margin: { top: MappedValue; right: MappedValue; bottom: MappedValue; left: MappedValue };
  padding: { top: MappedValue; right: MappedValue; bottom: MappedValue; left: MappedValue };
  border: { top: MappedValue; right: MappedValue; bottom: MappedValue; left: MappedValue };
}
