import type { ExportFormat } from '../constants/export.constants';
import type { ElementInfo } from './element.types';
import type { TokenMap } from './token.types';

export type { ExportFormat };

/** CSS-in-JS output mode */
export type CSSInJSMode = 'template' | 'object';

/** Result of an export operation */
export interface ExportResult {
  /** Which format was used */
  format: ExportFormat;
  /** The generated code string */
  code: string;
  /** CSS selector of the inspected element */
  selector: string;
  /** When this export was generated */
  timestamp: number;
  /** Whether the export encountered an error */
  error?: boolean;
}

/** Options for controlling export behavior */
export interface ExportOptions {
  format: ExportFormat;
  includeSelector: boolean;
  useTokens: boolean;
  remBase: number;
  cssInJSMode: CSSInJSMode;
}

/** Interface all exporters must implement */
export interface IExporter {
  export(
    info: ElementInfo,
    tokenMap?: TokenMap,
    options?: Partial<ExportOptions>
  ): ExportResult;
}
