import type { EditOperation } from '@shared/types/editor.types';

const MAX_ENTRIES = 500;

/** Records edit operations with undo support */
export class EditHistory {
  private entries: EditOperation[] = [];

  /** Record a new edit operation */
  record(operation: EditOperation): void {
    this.entries.push(operation);
    if (this.entries.length > MAX_ENTRIES) {
      this.entries.splice(0, this.entries.length - MAX_ENTRIES);
    }
  }

  /** Undo a specific edit by id, returning the operation if found */
  undo(id: string): EditOperation | null {
    const index = this.entries.findIndex((e) => e.override.id === id);
    if (index === -1) return null;

    const entry = this.entries[index];
    this.entries.splice(index, 1);

    // Re-apply the original value
    const el = document.querySelector(entry.override.selector);
    if (el) {
      (el as HTMLElement).style.setProperty(
        entry.override.property,
        entry.override.originalValue,
      );
    }

    return {
      type: 'reset',
      override: {
        ...entry.override,
        newValue: entry.override.originalValue,
      },
      previousOverride: entry.override,
    };
  }

  /** Undo the most recent edit */
  undoLast(): EditOperation | null {
    if (this.entries.length === 0) return null;
    const last = this.entries[this.entries.length - 1];
    return this.undo(last.override.id);
  }

  /** Get all recorded operations */
  getAll(): EditOperation[] {
    return [...this.entries];
  }

  /** Clear all history */
  clear(): void {
    this.entries = [];
  }

  /** Serialize history to JSON */
  toJSON(): string {
    return JSON.stringify(this.entries);
  }

  /** Restore history from JSON */
  fromJSON(json: string): void {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        this.entries = parsed;
      }
    } catch {
      // Invalid JSON, ignore
    }
  }
}
