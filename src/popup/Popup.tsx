import React, { useEffect, useState, useCallback } from 'react';
import { MESSAGE_ACTIONS } from '@shared/constants/messages.constants';
import { DEFAULT_SETTINGS } from '@shared/constants/defaults.constants';
import type { UserSettings } from '@shared/types/settings.types';
import type { ExportFormat } from '@shared/types/export.types';
import type { OverlayTheme } from '@shared/types/overlay.types';
import { ToggleSwitch } from './components/ToggleSwitch';
import { GridSettings } from './components/GridSettings';
import { ExportFormatSelector } from './components/ExportFormatSelector';
import { OverlaySettings } from './components/OverlaySettings';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { TokenConfigPanel } from './components/TokenConfigPanel';
import { ThemeToggle } from './components/ThemeToggle';
import { ShortcutDisplay } from './components/ShortcutDisplay';
import { AboutPanel } from './components/AboutPanel';

const SETTINGS_KEY = 'pixelperfect_settings';

/** Root popup component with full settings UI */
export const Popup: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
      chrome.storage.sync.get(SETTINGS_KEY, (result) => {
        const stored = result[SETTINGS_KEY];
        if (stored) {
          setSettings((prev) => ({ ...prev, ...stored }));
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };

      // Save to storage
      if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
        chrome.storage.sync.set({ [SETTINGS_KEY]: updated });
      }

      // Sync to content script
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: MESSAGE_ACTIONS.UPDATE_SETTINGS, payload: partial },
              () => { if (chrome.runtime.lastError) { /* ignore */ } },
            );
          }
        });
      }

      return updated;
    });
  }, []);

  const handleToggle = useCallback((enabled: boolean) => {
    updateSettings({ isEnabled: enabled });

    // Send toggle message
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: MESSAGE_ACTIONS.TOGGLE_INSPECTOR, payload: { enabled } },
            () => { if (chrome.runtime.lastError) { /* ignore */ } },
          );
        }
      });
    }
  }, [updateSettings]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>&#9670;</span>
          <span style={styles.logoText}>PixelPerfect</span>
        </div>
        <ToggleSwitch
          enabled={settings.isEnabled}
          onChange={handleToggle}
          disabled={loading}
        />
      </div>

      <div style={styles.divider} />

      {/* Status */}
      <div style={styles.status}>
        <span style={{
          ...styles.statusDot,
          backgroundColor: settings.isEnabled ? '#22C55E' : '#6C7086',
        }} />
        <span style={styles.statusText}>
          {loading ? 'Loading...' : settings.isEnabled ? 'Inspecting' : 'Off'}
        </span>
      </div>

      <div style={styles.divider} />

      {/* Grid Unit */}
      <GridSettings
        value={settings.gridBaseUnit}
        onChange={(unit) => updateSettings({ gridBaseUnit: unit })}
      />

      <div style={styles.divider} />

      {/* Export Format */}
      <ExportFormatSelector
        value={settings.exportFormat}
        onChange={(format: ExportFormat) => updateSettings({ exportFormat: format })}
      />

      <div style={styles.divider} />

      {/* Overlay Settings + Theme */}
      <div style={styles.sectionRow}>
        <OverlaySettings
          showBoxModel={settings.showBoxModel}
          showDistanceLines={settings.showDistanceLines}
          showAlignmentGuides={settings.showAlignmentGuides}
          showTypographyInfo={settings.showTypographyInfo}
          onChange={(key, value) => updateSettings({ [key]: value })}
        />
        <ThemeToggle
          value={settings.overlayTheme}
          onChange={(theme: OverlayTheme) => updateSettings({ overlayTheme: theme })}
        />
      </div>

      <div style={styles.divider} />

      {/* Accessibility */}
      <AccessibilitySettings
        showContrastRatios={settings.showContrastRatios}
        showFocusOrder={settings.showFocusOrder}
        showAriaRoles={settings.showAriaRoles}
        onChange={(key, value) => updateSettings({ [key]: value })}
      />

      <div style={styles.divider} />

      {/* Design Tokens */}
      <TokenConfigPanel
        customTokens={settings.customTokens}
        onChange={(tokens) => updateSettings({ customTokens: tokens })}
      />

      <div style={styles.divider} />

      {/* Shortcuts */}
      <ShortcutDisplay />

      <div style={styles.divider} />

      {/* About */}
      <AboutPanel />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 320,
    maxHeight: 600,
    overflowY: 'auto',
    padding: 16,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: '#1E1E2E',
    color: '#CDD6F4',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    color: '#6366F1',
    fontSize: 18,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 700,
  },
  divider: {
    height: 1,
    backgroundColor: '#313244',
    margin: '10px 0',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    display: 'inline-block',
  },
  statusText: {
    fontSize: 13,
    color: '#A6ADC8',
  },
  sectionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
};
