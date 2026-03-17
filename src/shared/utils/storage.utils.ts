import type { UserSettings } from '../types/settings.types';
import type { CSSOverride } from '../types/editor.types';
import { DEFAULT_SETTINGS } from '../constants/defaults.constants';

const SETTINGS_KEY = 'pixelperfect_settings';
const OVERRIDES_KEY = 'pixelperfect_overrides';

/** Read user settings from chrome.storage.sync. Returns defaults on failure. */
export async function getSettings(): Promise<UserSettings> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(SETTINGS_KEY, (result) => {
          if (chrome.runtime.lastError) {
            resolve({ ...DEFAULT_SETTINGS });
            return;
          }
          resolve({ ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) });
        });
      });
    }
  } catch {
    // Fall through to defaults
  }

  // Fallback for test environments
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {
    // Fall through to defaults
  }

  return { ...DEFAULT_SETTINGS };
}

/** Save partial settings to chrome.storage.sync */
export async function saveSettings(settings: Partial<UserSettings>): Promise<void> {
  try {
    const current = await getSettings();
    const merged = { ...current, ...settings };

    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [SETTINGS_KEY]: merged }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }

    // Fallback for test environments
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  } catch {
    // Silent fail
  }
}

/** Get the default settings object */
export function getDefaultSettings(): UserSettings {
  return { ...DEFAULT_SETTINGS };
}

/** Reset settings to defaults */
export async function resetSettings(): Promise<void> {
  await saveSettings(DEFAULT_SETTINGS);
}

/** Read CSS overrides for a domain from chrome.storage.local */
export async function getOverrides(domain: string): Promise<CSSOverride[]> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(OVERRIDES_KEY, (result) => {
          if (chrome.runtime.lastError) {
            resolve([]);
            return;
          }
          const allOverrides = result[OVERRIDES_KEY] || {};
          resolve(allOverrides[domain] || []);
        });
      });
    }
  } catch {
    // Fall through
  }

  // Fallback for test environments
  try {
    const stored = localStorage.getItem(OVERRIDES_KEY);
    if (stored) {
      const all = JSON.parse(stored);
      return all[domain] || [];
    }
  } catch {
    // Fall through
  }

  return [];
}

/** Save a CSS override to chrome.storage.local */
export async function saveOverride(override: CSSOverride): Promise<void> {
  try {
    const domain = override.domain;
    const existing = await getOverrides(domain);
    const index = existing.findIndex((o) => o.id === override.id);
    if (index >= 0) {
      existing[index] = override;
    } else {
      existing.push(override);
    }

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(OVERRIDES_KEY, (result) => {
          const allOverrides = result[OVERRIDES_KEY] || {};
          allOverrides[domain] = existing;
          chrome.storage.local.set({ [OVERRIDES_KEY]: allOverrides }, () => {
            resolve();
          });
        });
      });
    }

    // Fallback
    const stored = localStorage.getItem(OVERRIDES_KEY);
    const all = stored ? JSON.parse(stored) : {};
    all[domain] = existing;
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
  } catch {
    // Silent fail
  }
}

/** Delete a CSS override by id */
export async function deleteOverride(id: string, domain: string): Promise<void> {
  try {
    const existing = await getOverrides(domain);
    const filtered = existing.filter((o) => o.id !== id);

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(OVERRIDES_KEY, (result) => {
          const allOverrides = result[OVERRIDES_KEY] || {};
          allOverrides[domain] = filtered;
          chrome.storage.local.set({ [OVERRIDES_KEY]: allOverrides }, () => {
            resolve();
          });
        });
      });
    }

    // Fallback
    const stored = localStorage.getItem(OVERRIDES_KEY);
    const all = stored ? JSON.parse(stored) : {};
    all[domain] = filtered;
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
  } catch {
    // Silent fail
  }
}
