import type { CSSOverride } from '@shared/types/editor.types';
import { getOverrides, saveOverride, deleteOverride } from '@shared/utils/storage.utils';

/** Manages CSS overrides via chrome.storage.local */
export class OverrideManager {
  /** Get all overrides for a domain */
  async getForDomain(domain: string): Promise<CSSOverride[]> {
    return getOverrides(domain);
  }

  /** Save or update an override */
  async save(override: CSSOverride): Promise<void> {
    await saveOverride(override);
  }

  /** Delete an override by id */
  async delete(id: string, domain: string): Promise<void> {
    await deleteOverride(id, domain);
  }
}
