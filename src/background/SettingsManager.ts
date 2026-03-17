import type { UserSettings } from '@shared/types/settings.types';
import { getSettings, saveSettings, resetSettings } from '@shared/utils/storage.utils';

/** Manages user settings via chrome.storage.sync */
export class SettingsManager {
  /** Read current settings */
  async get(): Promise<UserSettings> {
    return getSettings();
  }

  /** Update partial settings */
  async update(partial: Partial<UserSettings>): Promise<void> {
    await saveSettings(partial);
  }

  /** Reset all settings to defaults */
  async reset(): Promise<void> {
    await resetSettings();
  }
}
