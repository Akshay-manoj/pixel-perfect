/** A single CSS override applied to the page */
export interface CSSOverride {
  /** Unique identifier */
  id: string;
  /** CSS selector targeting the element */
  selector: string;
  /** CSS property name */
  property: string;
  /** Value before the edit */
  originalValue: string;
  /** Current edited value */
  newValue: string;
  /** When the edit was made */
  timestamp: number;
  /** Whether this override is currently active */
  enabled: boolean;
  /** Domain this override belongs to */
  domain: string;
}

/** A recorded edit operation with undo support */
export interface EditOperation {
  /** Type of operation */
  type: 'set' | 'unset' | 'reset';
  /** The override being applied */
  override: CSSOverride;
  /** Previous override state (for undo) */
  previousOverride?: CSSOverride;
}

/** Result of comparing current styles to a saved snapshot */
export interface DiffResult {
  /** CSS selector */
  selector: string;
  /** CSS property name */
  property: string;
  /** Value before changes */
  beforeValue: string;
  /** Value after changes */
  afterValue: string;
  /** Property was added (not in snapshot) */
  isAddition: boolean;
  /** Property was removed (not in current) */
  isDeletion: boolean;
}
