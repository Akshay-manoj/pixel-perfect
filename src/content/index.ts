import { ElementPicker } from './inspector/ElementPicker';
import { BoxModelCalculator } from './inspector/BoxModelCalculator';
import { DistanceCalculator } from './inspector/DistanceCalculator';
import { AlignmentDetector } from './inspector/AlignmentDetector';
import { OverlayRenderer } from './overlay/OverlayRenderer';
import { BoxModelOverlay } from './overlay/BoxModelOverlay';
import { TooltipOverlay } from './overlay/TooltipOverlay';
import { DistanceLineOverlay } from './overlay/DistanceLineOverlay';
import { AlignmentGuideOverlay } from './overlay/AlignmentGuideOverlay';
import { TokenScanner } from './tokens/TokenScanner';
import { TokenMapper } from './tokens/TokenMapper';
import { getSettings } from '@shared/utils/storage.utils';
import { MESSAGE_ACTIONS } from '@shared/constants/messages.constants';
import type { UserSettings } from '@shared/types/settings.types';

let picker: ElementPicker | null = null;
let calculator: BoxModelCalculator | null = null;
let distanceCalculator: DistanceCalculator | null = null;
let alignmentDetector: AlignmentDetector | null = null;
let renderer: OverlayRenderer | null = null;
let tokenScanner: TokenScanner | null = null;
let tokenMapper: TokenMapper | null = null;
let currentSettings: UserSettings | null = null;

/** Initialize the inspection system */
async function init(): Promise<void> {
  try {
    currentSettings = await getSettings();

    calculator = new BoxModelCalculator();
    distanceCalculator = new DistanceCalculator();
    alignmentDetector = new AlignmentDetector();
    tokenScanner = new TokenScanner();
    const tokenMap = tokenScanner.scan();
    tokenScanner.observe();
    tokenMapper = new TokenMapper(tokenMap);
    renderer = new OverlayRenderer();
    picker = new ElementPicker();

    picker.onHover((element) => {
      try {
        if (!currentSettings || !renderer || !calculator) return;
        const info = calculator.calculate(element);
        const mappedBoxModel = tokenMapper?.mapBoxModel(info.boxModel);
        renderer.render([
          BoxModelOverlay.build(info, currentSettings.overlayTheme),
          TooltipOverlay.build(info, currentSettings.overlayTheme, mappedBoxModel),
        ]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug('[PixelPerfect] Overlay render failed:', err);
      }
    });

    picker.onMeasure((elementA, elementB) => {
      try {
        if (!currentSettings || !renderer || !calculator || !distanceCalculator || !alignmentDetector) return;
        const infoA = calculator.calculate(elementA);
        const infoB = calculator.calculate(elementB);
        const distance = distanceCalculator.calculate(infoA.rect, infoB.rect);
        const alignment = alignmentDetector.detect(infoA.rect, infoB.rect);
        renderer.render([
          DistanceLineOverlay.build(infoA, infoB, distance, currentSettings.overlayTheme),
          AlignmentGuideOverlay.build(alignment, infoA.rect, infoB.rect),
        ]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug('[PixelPerfect] Distance measurement render failed:', err);
      }
    });

    picker.onLeave(() => {
      renderer?.clear();
    });

    if (currentSettings.isEnabled) {
      picker.enable();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.debug('[PixelPerfect] Init failed:', err);
  }
}

/** Listen for messages from popup/background */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === MESSAGE_ACTIONS.TOGGLE_INSPECTOR) {
    const enabled = message.payload?.enabled;
    if (enabled && picker) {
      picker.enable();
    } else if (!enabled && picker) {
      picker.disable();
      renderer?.clear();
    }
    sendResponse({ success: true });
    return true;
  }

  if (message.action === MESSAGE_ACTIONS.UPDATE_SETTINGS) {
    if (currentSettings && message.payload) {
      currentSettings = { ...currentSettings, ...message.payload };
      calculator?.clearCache();
    }
    sendResponse({ success: true });
    return true;
  }

  return false;
});

init();
