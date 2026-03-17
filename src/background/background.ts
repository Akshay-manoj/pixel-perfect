import { MESSAGE_ACTIONS } from '@shared/constants/messages.constants';
import { getSettings, saveSettings } from '@shared/utils/storage.utils';
import { DEFAULT_SETTINGS } from '@shared/constants/defaults.constants';

/** Initialize default settings on extension install */
chrome.runtime.onInstalled.addListener(async () => {
  await saveSettings(DEFAULT_SETTINGS);
  // eslint-disable-next-line no-console
  console.debug('[PixelPerfect] Extension installed — settings initialized');
});

/** Route messages between extension contexts */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === MESSAGE_ACTIONS.GET_SETTINGS) {
    getSettings().then(sendResponse);
    return true;
  }

  if (message.action === MESSAGE_ACTIONS.UPDATE_SETTINGS) {
    saveSettings(message.payload).then(() => sendResponse({ success: true }));
    return true;
  }

  if (message.action === MESSAGE_ACTIONS.TOGGLE_INSPECTOR) {
    // Forward to active tab content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message, sendResponse);
      } else {
        sendResponse({ success: false });
      }
    });
    return true;
  }

  return false;
});
