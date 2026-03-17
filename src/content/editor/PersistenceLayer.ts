import type { CSSOverride } from '@shared/types/editor.types';
import { getOverrides, saveOverride as storageSaveOverride, deleteOverride as storageDeleteOverride } from '@shared/utils/storage.utils';

/** Persists CSS overrides to chrome.storage.local and re-applies them on page load */
export class PersistenceLayer {
  private domain: string;

  constructor() {
    this.domain = window.location.hostname;
  }

  /** Load all overrides for current domain and apply them to the page */
  async loadAndApply(): Promise<void> {
    const overrides = await getOverrides(this.domain);
    for (const override of overrides) {
      if (override.enabled) {
        this.applyOverride(override);
      }
    }
  }

  /** Save or update an override to storage */
  async saveOverride(override: CSSOverride): Promise<void> {
    await storageSaveOverride(override);
  }

  /** Delete an override from storage */
  async deleteOverride(id: string): Promise<void> {
    await storageDeleteOverride(id, this.domain);
  }

  /** Clear all overrides for current domain */
  async clearDomain(): Promise<void> {
    const overrides = await getOverrides(this.domain);
    for (const override of overrides) {
      await storageDeleteOverride(override.id, this.domain);
    }
  }

  /** Apply a single CSS override to the matching element */
  private applyOverride(override: CSSOverride): void {
    try {
      const el = document.querySelector(override.selector);
      if (el) {
        (el as HTMLElement).style.setProperty(override.property, override.newValue);
      }
    } catch {
      // Invalid selector or element not found
    }
  }
}
