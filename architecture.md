# PixelPerfect — Chrome Extension
## Claude Code Master Build Prompt — Final Product

---

## 📌 How to Use This Prompt

1. Paste this **entire file** into Claude Code once at the start
2. Claude Code will read all phases but execute **only Phase 1**
3. After each phase it will **stop and wait** for your confirmation
4. To continue, say: `Start Phase 2`, `Start Phase 3`, etc.
5. Never skip phases — each one builds on the previous

---

## 🧭 Project Brief

Build **PixelPerfect** — a production-grade Chrome Extension (Manifest V3) that brings Figma-like spacing measurement, design token inspection, live CSS editing, and multi-format export directly into the browser.

> "DevTools tells you what the CSS is.
>  PixelPerfect tells you what it should be — in your language, on your grid, with your tokens."

**Target users:** Frontend developers, designers doing browser QA, junior devs, no-code/low-code builders, QA engineers verifying design implementation.

---

## ⚙️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript (strict mode) | 5.x |
| Extension Platform | Chrome Manifest V3 | MV3 |
| UI Framework | React | 18.x |
| Styling | Tailwind CSS | 3.x |
| Overlay Rendering | SVG injected layer | — |
| Build Tool | Vite + vite-plugin-web-extension | 5.x |
| Testing | Jest + React Testing Library | 29.x / 14.x |
| Linting | ESLint + Prettier | — |
| Storage | Chrome Storage API (sync + local) | — |
| Package Manager | npm | 10.x |

> ⚠️ The content script uses **zero third-party runtime libraries** — only native browser APIs. React and Tailwind are only used in Popup and DevTools Panel. This keeps the content script bundle under 50KB gzipped.

---

## 📁 Complete Target Folder Structure

Every file must be created at exactly this path. No exceptions.

```
pixelperfect/
│
├── manifest.json                        # Chrome MV3 extension manifest
├── package.json                         # npm dependencies and build scripts
├── tsconfig.json                        # TypeScript config, strict mode, path aliases
├── vite.config.ts                       # Vite build with vite-plugin-web-extension
├── jest.config.js                       # Jest test runner, jsdom env, coverage config
├── tailwind.config.js                   # Tailwind config for popup + panel UI
├── postcss.config.js                    # PostCSS for Tailwind processing
├── .eslintrc.json                       # ESLint rules with TypeScript plugin
├── .prettierrc                          # Prettier formatting rules
├── .gitignore                           # Ignores dist/, node_modules/, coverage/
├── ARCHITECTURE.md                      # System architecture documentation
├── CHANGELOG.md                         # Semantic version history
├── README.md                            # Setup, install, usage guide
│
├── src/
│   ├── background/
│   │   ├── background.ts                # Service worker entry — message router + init
│   │   ├── MessageRouter.ts             # Routes chrome.runtime messages to handlers
│   │   ├── SettingsManager.ts           # Reads/writes settings from chrome.storage.sync
│   │   ├── OverrideManager.ts           # Reads/writes CSS overrides from chrome.storage.local
│   │   └── __tests__/
│   │       ├── MessageRouter.test.ts
│   │       ├── SettingsManager.test.ts
│   │       └── OverrideManager.test.ts
│   │
│   ├── content/
│   │   ├── index.ts                     # Content script entry — bootstraps all modules
│   │   │
│   │   ├── inspector/
│   │   │   ├── ElementPicker.ts         # Hover/click/pin element detection with Alt mode
│   │   │   ├── BoxModelCalculator.ts    # Computes full BoxModel from getComputedStyle
│   │   │   ├── DistanceCalculator.ts    # Measures pixel gaps between two element rects
│   │   │   ├── AlignmentDetector.ts     # Detects shared edges and center alignment
│   │   │   ├── FlexboxInspector.ts      # Reads flex container + item properties
│   │   │   ├── GridInspector.ts         # Reads CSS grid track, area, placement data
│   │   │   ├── TypographyInspector.ts   # Reads all typography-related computed styles
│   │   │   ├── ZIndexInspector.ts       # Builds z-index stack for positioned elements
│   │   │   └── __tests__/
│   │   │       ├── ElementPicker.test.ts
│   │   │       ├── BoxModelCalculator.test.ts
│   │   │       ├── DistanceCalculator.test.ts
│   │   │       ├── AlignmentDetector.test.ts
│   │   │       ├── FlexboxInspector.test.ts
│   │   │       └── TypographyInspector.test.ts
│   │   │
│   │   ├── overlay/
│   │   │   ├── OverlayRenderer.ts       # Manages root SVG layer injected into page
│   │   │   ├── BoxModelOverlay.ts       # Colored margin/padding/border/content zones
│   │   │   ├── DistanceLineOverlay.ts   # Red measurement lines between two elements
│   │   │   ├── AlignmentGuideOverlay.ts # Full-viewport dotted alignment guides
│   │   │   ├── TooltipOverlay.ts        # Floating measurement tooltip with copy buttons
│   │   │   ├── FlexboxOverlay.ts        # Flex axis arrows and child value badges
│   │   │   ├── GridOverlay.ts           # Grid track lines and area labels
│   │   │   ├── TypographyOverlay.ts     # Typography detail badge on hover
│   │   │   ├── ZIndexOverlay.ts         # 3D stacking layer visualization
│   │   │   ├── ContrastOverlay.ts       # WCAG contrast ratio badges on text elements
│   │   │   └── __tests__/
│   │   │       ├── OverlayRenderer.test.ts
│   │   │       ├── BoxModelOverlay.test.ts
│   │   │       └── TooltipOverlay.test.ts
│   │   │
│   │   ├── tokens/
│   │   │   ├── TokenScanner.ts          # Scans stylesheets for CSS custom properties
│   │   │   ├── TokenMapper.ts           # Reverse-maps computed values to token names
│   │   │   ├── TailwindMapper.ts        # Maps values to Tailwind utility classes
│   │   │   ├── TokenImporter.ts         # Parses tokens.json (Figma / Style Dictionary)
│   │   │   └── __tests__/
│   │   │       ├── TokenScanner.test.ts
│   │   │       ├── TokenMapper.test.ts
│   │   │       ├── TailwindMapper.test.ts
│   │   │       └── TokenImporter.test.ts
│   │   │
│   │   ├── exporter/
│   │   │   ├── base.exporter.ts         # IExporter interface + shared filter logic
│   │   │   ├── CSSExporter.ts           # Outputs plain CSS block
│   │   │   ├── SCSSExporter.ts          # Outputs SCSS with $variable names
│   │   │   ├── SASSExporter.ts          # Outputs indented SASS syntax
│   │   │   ├── TailwindExporter.ts      # Outputs Tailwind utility class string
│   │   │   ├── CSSInJSExporter.ts       # Outputs styled-components or object syntax
│   │   │   ├── CSSVariableExporter.ts   # Outputs var(--token) format
│   │   │   ├── ClipboardManager.ts      # Writes to clipboard + shows copied feedback
│   │   │   └── __tests__/
│   │   │       ├── CSSExporter.test.ts
│   │   │       ├── SCSSExporter.test.ts
│   │   │       ├── SASSExporter.test.ts
│   │   │       ├── TailwindExporter.test.ts
│   │   │       ├── CSSInJSExporter.test.ts
│   │   │       └── CSSVariableExporter.test.ts
│   │   │
│   │   ├── editor/
│   │   │   ├── CSSEditor.ts             # Inline CSS editing panel injected near element
│   │   │   ├── EditHistory.ts           # Records, stores, and replays edit operations
│   │   │   ├── DragResizer.ts           # Drag-to-resize element edges
│   │   │   ├── NudgeController.ts       # Arrow key nudging for margin/padding
│   │   │   ├── PersistenceLayer.ts      # Syncs edits to chrome.storage.local per domain
│   │   │   ├── DiffEngine.ts            # Compares current styles to saved snapshot
│   │   │   ├── PatchExporter.ts         # Exports session edits as a .css patch file
│   │   │   └── __tests__/
│   │   │       ├── CSSEditor.test.ts
│   │   │       ├── EditHistory.test.ts
│   │   │       ├── DiffEngine.test.ts
│   │   │       └── PatchExporter.test.ts
│   │   │
│   │   ├── audit/
│   │   │   ├── SpacingAuditor.ts        # Scans page for off-grid and magic number values
│   │   │   ├── AlignmentAuditor.ts      # Finds near-miss alignment across all elements
│   │   │   ├── ContrastAuditor.ts       # WCAG contrast pass/fail for all text elements
│   │   │   ├── DarkModeAuditor.ts       # Detects elements that break in dark mode
│   │   │   ├── AuditReportBuilder.ts    # Combines all auditors into one AuditReport
│   │   │   └── __tests__/
│   │   │       ├── SpacingAuditor.test.ts
│   │   │       ├── ContrastAuditor.test.ts
│   │   │       └── AuditReportBuilder.test.ts
│   │   │
│   │   └── keyboard/
│   │       ├── ShortcutManager.ts       # Registers, listens, and dispatches shortcuts
│   │       └── __tests__/
│   │           └── ShortcutManager.test.ts
│   │
│   ├── popup/
│   │   ├── index.html                   # Popup HTML shell
│   │   ├── main.tsx                     # React root mount
│   │   ├── Popup.tsx                    # Root popup component
│   │   ├── components/
│   │   │   ├── ToggleSwitch.tsx         # Main enable/disable toggle
│   │   │   ├── GridSettings.tsx         # Grid base unit selector
│   │   │   ├── ExportFormatSelector.tsx # Segmented control for all export formats
│   │   │   ├── TokenConfigPanel.tsx     # Add/remove/import custom design tokens
│   │   │   ├── OverlaySettings.tsx      # Show/hide individual overlay types
│   │   │   ├── AccessibilitySettings.tsx# Contrast/focus/ARIA overlay toggles
│   │   │   ├── ShortcutDisplay.tsx      # Read-only keyboard shortcut reference
│   │   │   ├── ThemeToggle.tsx          # Dark/light overlay theme toggle
│   │   │   └── AboutPanel.tsx           # Version, links, feedback button
│   │   └── __tests__/
│   │       ├── Popup.test.tsx
│   │       ├── GridSettings.test.tsx
│   │       └── ExportFormatSelector.test.tsx
│   │
│   ├── devtools/
│   │   ├── devtools.html                # Registers the DevTools panel
│   │   ├── devtools.ts                  # Calls chrome.devtools.panels.create()
│   │   ├── panel.html                   # DevTools panel HTML shell
│   │   ├── main.tsx                     # React root mount for panel
│   │   ├── Panel.tsx                    # Root panel component
│   │   └── components/
│   │       ├── ElementDetailsView.tsx   # Full element styles with token mapping
│   │       ├── ExportTabsView.tsx       # All export formats with syntax highlighting
│   │       ├── EditHistoryPanel.tsx     # Session edit timeline with undo
│   │       ├── AuditReportView.tsx      # Full audit results with fix suggestions
│   │       └── AnimationDebugger.tsx    # Slow-motion animation timeline
│   │
│   └── shared/
│       ├── constants/
│       │   ├── colors.constants.ts      # All overlay colors for both themes
│       │   ├── spacing.constants.ts     # Grid units, Tailwind scale, rem base
│       │   ├── shortcuts.constants.ts   # All keyboard shortcut definitions
│       │   ├── export.constants.ts      # Export format identifiers and labels
│       │   ├── messages.constants.ts    # Chrome message action name strings
│       │   └── defaults.constants.ts    # Default UserSettings object
│       │
│       ├── types/
│       │   ├── element.types.ts         # BoxModel, EdgeValues, ElementInfo, DistanceMeasurement
│       │   ├── token.types.ts           # DesignToken, TokenCategory, TokenMap, MappedBoxModel
│       │   ├── overlay.types.ts         # OverlayLayer, OverlayTheme, TooltipPosition
│       │   ├── export.types.ts          # ExportFormat, ExportResult, IExporter
│       │   ├── settings.types.ts        # UserSettings, GridConfig, CustomToken
│       │   ├── editor.types.ts          # CSSOverride, EditOperation, DiffResult
│       │   └── audit.types.ts           # AuditReport, AuditIssue, AuditSeverity
│       │
│       └── utils/
│           ├── unit.utils.ts            # px/rem conversion, grid snapping, rounding
│           ├── color.utils.ts           # rgb/hex conversion, contrast ratio, WCAG check
│           ├── selector.utils.ts        # Unique CSS selector generator for any element
│           ├── storage.utils.ts         # Chrome storage read/write with typed generics
│           ├── dom.utils.ts             # Shadow DOM traversal, scroll offset, iframe check
│           └── __tests__/
│               ├── unit.utils.test.ts
│               ├── color.utils.test.ts
│               ├── selector.utils.test.ts
│               └── dom.utils.test.ts
│
└── assets/
    ├── icons/
    │   ├── icon-16.png
    │   ├── icon-32.png
    │   ├── icon-48.png
    │   └── icon-128.png
    └── screenshots/
        ├── box-model-overlay.png
        ├── distance-measurement.png
        └── export-formats.png
```

---

## 📐 Naming Conventions (Enforced Across All Phases)

| Item | Convention | Example |
|---|---|---|
| TypeScript class files | PascalCase + role suffix | `BoxModelCalculator.ts` |
| Utility files | camelCase + `.utils.ts` | `unit.utils.ts` |
| Constant files | camelCase + `.constants.ts` | `colors.constants.ts` |
| Type files | camelCase + `.types.ts` | `element.types.ts` |
| Test files | mirrors source + `.test.ts` | `BoxModelCalculator.test.ts` |
| React components | PascalCase + `.tsx` | `GridSettings.tsx` |
| Classes | PascalCase | `ElementPicker` |
| Abstract interfaces | PascalCase with `I` prefix | `IExporter` |
| Data shape interfaces | PascalCase, no prefix | `UserSettings` |
| Constant objects | SCREAMING_SNAKE_CASE | `OVERLAY_COLORS` |
| Boolean fields | `is` / `has` / `should` prefix | `isEnabled`, `hasToken` |
| Event handlers | `handle` prefix | `handleToggleChange` |
| Chrome messages | SCREAMING_SNAKE_CASE strings | `'TOGGLE_INSPECTOR'` |
| DOM data attributes | `data-pixelperfect-*` | `data-pixelperfect="overlay"` |

---

## 📌 Global Rules (Apply to Every Phase Without Exception)

1. **Folder structure is law** — every file at exactly the path specified above
2. **TypeScript strict mode** — no `any`, no `@ts-ignore`, no implicit `any`
3. **JSDoc on every exported class and function** — single-line minimum
4. **Every utility function has a unit test** — minimum test counts specified per phase
5. **No magic numbers** — all numeric values imported from constants files
6. **No inline Chrome API calls** in business logic — always wrapped in utils
7. **Content script: zero third-party imports** — native browser APIs only
8. **After every phase**: run `npm run build` and `npm test` — both must pass before stopping
9. **Commit format**: `feat(phase-N): description` after each phase completes
10. **Stop gate**: after completing a phase, print the exact stop message specified and wait

---

---

# ════════════════════════════════════════
# PHASE 1 — Project Scaffold & Foundation
# ════════════════════════════════════════

## 🎯 Goal
Set up the complete project skeleton — all configuration files, constants, TypeScript types, shared utilities with full test suites, and stub entry points. No functional extension logic yet. Everything else in later phases builds on top of this foundation.

---

## Tasks

### 1.1 — Initialize Project & Install Dependencies

```bash
mkdir pixelperfect && cd pixelperfect
npm init -y
```

Install all dependencies:
```bash
# Runtime
npm install react react-dom

# Dev — TypeScript + Build
npm install -D typescript vite vite-plugin-web-extension
npm install -D @types/chrome @types/react @types/react-dom

# Dev — Styling
npm install -D tailwindcss postcss autoprefixer

# Dev — Testing
npm install -D jest @types/jest ts-jest jest-environment-jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Dev — Linting
npm install -D eslint prettier eslint-config-prettier
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

### 1.2 — Configuration Files

**`tsconfig.json`**
- `target`: ES2020
- `module`: ESNext
- `moduleResolution`: bundler
- `jsx`: react-jsx
- `strict`: true
- `paths`: `@content/*`, `@popup/*`, `@shared/*`, `@background/*`

**`vite.config.ts`**
- Use `vite-plugin-web-extension`
- Entry points: popup `src/popup/index.html`, content `src/content/index.ts`, background `src/background/background.ts`, devtools `src/devtools/devtools.html`
- Output directory: `dist/`

**`manifest.json`** (Manifest V3)
```json
{
  "manifest_version": 3,
  "name": "PixelPerfect",
  "version": "1.0.0",
  "description": "Figma-like spacing measurement and design token inspector for developers",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": ["<all_urls>"],
  "action": {
    "default_popup": "popup/index.html",
    "default_icon": {
      "16": "assets/icons/icon-16.png",
      "32": "assets/icons/icon-32.png",
      "48": "assets/icons/icon-48.png",
      "128": "assets/icons/icon-128.png"
    }
  },
  "background": {
    "service_worker": "background/background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/index.js"],
      "run_at": "document_idle"
    }
  ],
  "devtools_page": "devtools/devtools.html"
}
```

**`jest.config.js`**
- `preset`: ts-jest
- `testEnvironment`: jsdom
- `setupFilesAfterFramework`: `@testing-library/jest-dom`
- `moduleNameMapper` for all path aliases (`@content`, `@shared`, `@popup`, `@background`)
- `coverageDirectory`: coverage/
- `collectCoverageFrom`: all `.ts` and `.tsx` in `src/`

**`tailwind.config.js`** — content paths: `src/popup/**/*.tsx`, `src/devtools/**/*.tsx`

**`.eslintrc.json`**
- extends: `@typescript-eslint/recommended`, `prettier`
- rules: `no-console: warn`, `@typescript-eslint/no-explicit-any: error`

**`.prettierrc`**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**`.gitignore`** — dist/, node_modules/, coverage/, *.js.map

---

### 1.3 — Constants Files

**`src/shared/constants/colors.constants.ts`**
```ts
export const OVERLAY_COLORS = {
  MARGIN: 'rgba(246, 178, 107, 0.4)',
  PADDING: 'rgba(147, 196, 125, 0.4)',
  BORDER: 'rgba(234, 153, 153, 0.4)',
  CONTENT: 'rgba(111, 168, 220, 0.4)',
  DISTANCE_LINE: '#FF4444',
  ALIGNMENT_GUIDE: 'rgba(99, 102, 241, 0.6)',
  TOOLTIP_BG: '#1E1E2E',
  TOOLTIP_TEXT: '#CDD6F4',
  TOOLTIP_MUTED: '#6C7086',
  TOOLTIP_ACCENT: '#89B4FA',
} as const;

export const OVERLAY_COLORS_LIGHT = {
  MARGIN: 'rgba(219, 109, 0, 0.3)',
  PADDING: 'rgba(56, 142, 60, 0.3)',
  BORDER: 'rgba(198, 40, 40, 0.3)',
  CONTENT: 'rgba(21, 101, 192, 0.3)',
  DISTANCE_LINE: '#CC0000',
  ALIGNMENT_GUIDE: 'rgba(55, 48, 163, 0.6)',
  TOOLTIP_BG: '#FFFFFF',
  TOOLTIP_TEXT: '#1E1E2E',
  TOOLTIP_MUTED: '#6C7086',
  TOOLTIP_ACCENT: '#1D4ED8',
} as const;
```

**`src/shared/constants/spacing.constants.ts`**
```ts
export const GRID_BASE_UNITS = [4, 8, 10, 12, 16] as const;
export const DEFAULT_GRID_UNIT = 8;
export const REM_BASE = 16;
export const GRID_TOLERANCE = 2; // px — within this is "on grid"

export const TAILWIND_SPACING_SCALE: Record<number, string> = {
  0: '0', 1: 'px', 2: '0.5', 4: '1', 6: '1.5', 8: '2',
  10: '2.5', 12: '3', 14: '3.5', 16: '4', 20: '5', 24: '6',
  28: '7', 32: '8', 36: '9', 40: '10', 44: '11', 48: '12',
  52: '13', 56: '14', 60: '15', 64: '16', 72: '18', 80: '20',
  96: '24',
};

export const TAILWIND_RADIUS_SCALE: Record<number, string> = {
  0: 'none', 2: 'sm', 4: '', 6: 'md', 8: 'lg',
  12: 'xl', 16: '2xl', 24: '3xl', 9999: 'full',
};
```

**`src/shared/constants/shortcuts.constants.ts`**
```ts
export const KEYBOARD_SHORTCUTS = {
  TOGGLE_EXTENSION: {
    key: 'S', ctrl: true, shift: true,
    description: 'Toggle PixelPerfect on/off',
    action: 'TOGGLE_INSPECTOR',
  },
  MEASURE_MODE: {
    key: 'Alt',
    description: 'Hold to measure distance between elements',
    action: 'MEASURE_MODE',
  },
  PIN_ELEMENT: {
    key: 'Click', shift: true,
    description: 'Pin element as fixed reference point',
    action: 'PIN_ELEMENT',
  },
  CLEAR_OVERLAYS: {
    key: 'Escape',
    description: 'Clear all overlays and exit inspection',
    action: 'CLEAR_OVERLAYS',
  },
  COPY_CSS: {
    key: 'C', ctrl: true, shift: true,
    description: 'Copy selected element in default export format',
    action: 'COPY_CSS',
  },
  NEXT_EXPORT_FORMAT: {
    key: 'Tab', shift: false,
    description: 'Cycle to next export format',
    action: 'NEXT_FORMAT',
  },
} as const;
```

**`src/shared/constants/export.constants.ts`**
```ts
export const EXPORT_FORMATS = {
  CSS: 'css',
  SCSS: 'scss',
  SASS: 'sass',
  TAILWIND: 'tailwind',
  CSS_IN_JS_TEMPLATE: 'css-in-js-template',
  CSS_IN_JS_OBJECT: 'css-in-js-object',
  CSS_VARIABLES: 'css-variables',
} as const;

export type ExportFormat = typeof EXPORT_FORMATS[keyof typeof EXPORT_FORMATS];

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  css: 'CSS',
  scss: 'SCSS',
  sass: 'SASS',
  tailwind: 'Tailwind',
  'css-in-js-template': 'Styled',
  'css-in-js-object': 'JS Object',
  'css-variables': 'CSS Vars',
};

export const DEFAULT_EXPORT_FORMAT: ExportFormat = 'css';
```

**`src/shared/constants/messages.constants.ts`**
```ts
export const MESSAGE_ACTIONS = {
  TOGGLE_INSPECTOR: 'TOGGLE_INSPECTOR',
  GET_SETTINGS: 'GET_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  ELEMENT_SELECTED: 'ELEMENT_SELECTED',
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  RUN_AUDIT: 'RUN_AUDIT',
  GET_TOKEN_MAP: 'GET_TOKEN_MAP',
  SAVE_OVERRIDE: 'SAVE_OVERRIDE',
  GET_OVERRIDES: 'GET_OVERRIDES',
  CLEAR_OVERRIDES: 'CLEAR_OVERRIDES',
  EXPORT_PATCH: 'EXPORT_PATCH',
} as const;

export type MessageAction = typeof MESSAGE_ACTIONS[keyof typeof MESSAGE_ACTIONS];
```

**`src/shared/constants/defaults.constants.ts`**
```ts
import { UserSettings } from '../types/settings.types';
import { DEFAULT_EXPORT_FORMAT } from './export.constants';
import { DEFAULT_GRID_UNIT, REM_BASE } from './spacing.constants';

export const DEFAULT_SETTINGS: UserSettings = {
  isEnabled: false,
  gridBaseUnit: DEFAULT_GRID_UNIT,
  remBase: REM_BASE,
  exportFormat: DEFAULT_EXPORT_FORMAT,
  cssInJSMode: 'template',
  overlayTheme: 'dark',
  showBoxModel: true,
  showDistanceLines: true,
  showAlignmentGuides: true,
  showTypographyInfo: false,
  showContrastRatios: false,
  showFocusOrder: false,
  showAriaRoles: false,
  customTokens: [],
};
```

---

### 1.4 — Type Definition Files

**`src/shared/types/element.types.ts`**
```ts
/** Pixel values for each side of a CSS edge property */
export interface EdgeValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Full CSS box model for an element */
export interface BoxModel {
  margin: EdgeValues;
  padding: EdgeValues;
  border: EdgeValues;
  content: { width: number; height: number };
}

/** All inspection data about a hovered/selected element */
export interface ElementInfo {
  element: Element;
  boxModel: BoxModel;
  rect: DOMRect;
  computedStyles: CSSStyleDeclaration;
  selector: string;
  tagName: string;
  classList: string[];
}

/** Distance measurement between two elements */
export interface DistanceMeasurement {
  top: number;
  right: number;
  bottom: number;
  left: number;
  horizontal: number;
  vertical: number;
  isOverlapping: boolean;
}

/** Alignment detection result */
export interface AlignmentResult {
  alignedTop: boolean;
  alignedBottom: boolean;
  alignedLeft: boolean;
  alignedRight: boolean;
  alignedCenterX: boolean;
  alignedCenterY: boolean;
  tolerance: number;
}

/** Flexbox container and children data */
export interface FlexboxData {
  direction: string;
  wrap: string;
  justifyContent: string;
  alignItems: string;
  gap: number;
  children: FlexChildData[];
}

export interface FlexChildData {
  element: Element;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  order: number;
}

/** Typography data for an element */
export interface TypographyData {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  color: string;
  contrastRatio?: number;
  wcagAA?: boolean;
  wcagAAA?: boolean;
}
```

**`src/shared/types/token.types.ts`**
```ts
export type TokenCategory = 'color' | 'spacing' | 'radius' | 'shadow' | 'typography' | 'other';
export type TokenSource = 'page' | 'custom' | 'imported';

export interface DesignToken {
  name: string;           // "--color-primary"
  rawValue: string;       // "#3B82F6"
  resolvedValue: string;  // "rgb(59, 130, 246)"
  category: TokenCategory;
  source: TokenSource;
}

export interface TokenMap {
  byValue: Record<string, DesignToken[]>;
  byName: Record<string, DesignToken>;
  allTokens: DesignToken[];
}

export interface MappedValue {
  rawValue: string;
  tokenName?: string;
  tailwindClass?: string;
  remValue?: string;
}

export interface MappedBoxModel {
  margin: { top: MappedValue; right: MappedValue; bottom: MappedValue; left: MappedValue };
  padding: { top: MappedValue; right: MappedValue; bottom: MappedValue; left: MappedValue };
  border: { top: MappedValue; right: MappedValue; bottom: MappedValue; left: MappedValue };
}
```

**`src/shared/types/overlay.types.ts`**
```ts
export type OverlayLayerType =
  | 'box-model' | 'distance-lines' | 'alignment-guides'
  | 'tooltip' | 'flexbox' | 'grid' | 'typography'
  | 'z-index' | 'contrast';

export interface OverlayLayer {
  id: string;
  type: OverlayLayerType;
  svgContent: string;
  zOrder: number;
}

export type OverlayTheme = 'dark' | 'light';

export interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}
```

**`src/shared/types/export.types.ts`**
```ts
import { ExportFormat } from '../constants/export.constants';
import { ElementInfo } from './element.types';
import { TokenMap } from './token.types';

export { ExportFormat };

export type CSSInJSMode = 'template' | 'object';

export interface ExportResult {
  format: ExportFormat;
  code: string;
  selector: string;
  timestamp: number;
  error?: boolean;
}

export interface ExportOptions {
  format: ExportFormat;
  includeSelector: boolean;
  useTokens: boolean;
  remBase: number;
  cssInJSMode: CSSInJSMode;
}

export interface IExporter {
  export(info: ElementInfo, tokenMap?: TokenMap, options?: Partial<ExportOptions>): ExportResult;
}
```

**`src/shared/types/settings.types.ts`**
```ts
import { ExportFormat, CSSInJSMode } from './export.types';

export interface UserSettings {
  isEnabled: boolean;
  gridBaseUnit: number;
  remBase: number;
  exportFormat: ExportFormat;
  cssInJSMode: CSSInJSMode;
  overlayTheme: 'dark' | 'light';
  showBoxModel: boolean;
  showDistanceLines: boolean;
  showAlignmentGuides: boolean;
  showTypographyInfo: boolean;
  showContrastRatios: boolean;
  showFocusOrder: boolean;
  showAriaRoles: boolean;
  customTokens: CustomToken[];
  tailwindConfigPath?: string;
}

export interface CustomToken {
  name: string;
  value: string;
  category?: string;
}
```

**`src/shared/types/editor.types.ts`**
```ts
export interface CSSOverride {
  id: string;
  selector: string;
  property: string;
  originalValue: string;
  newValue: string;
  timestamp: number;
  enabled: boolean;
  domain: string;
}

export interface EditOperation {
  type: 'set' | 'unset' | 'reset';
  override: CSSOverride;
  previousOverride?: CSSOverride;
}

export interface DiffResult {
  selector: string;
  property: string;
  beforeValue: string;
  afterValue: string;
  isAddition: boolean;
  isDeletion: boolean;
}
```

**`src/shared/types/audit.types.ts`**
```ts
export type AuditSeverity = 'error' | 'warning' | 'info';
export type AuditIssueType =
  | 'off-grid' | 'magic-number' | 'near-miss-alignment'
  | 'inconsistent-siblings' | 'contrast-fail' | 'dark-mode-conflict'
  | 'unused-class';

export interface AuditIssue {
  id: string;
  type: AuditIssueType;
  severity: AuditSeverity;
  selector: string;
  description: string;
  suggestedFix: string;
  value?: string;
  nearestGridValue?: number;
}

export interface AuditReport {
  timestamp: number;
  gridUnit: number;
  issues: AuditIssue[];
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
  };
}
```

---

### 1.5 — Shared Utility Files with Full Test Suites

**`src/shared/utils/unit.utils.ts`**

Implement with full JSDoc:
- `pxToRem(px: number, base?: number): number`
- `remToPx(rem: number, base?: number): number`
- `roundToDecimal(value: number, decimals: number): number`
- `formatPx(value: number): string` → `"24px"`
- `formatRem(value: number): string` → `"1.5rem"`
- `snapToGrid(value: number, gridUnit: number): number`
- `isOnGrid(value: number, gridUnit: number, tolerance?: number): boolean`
- `parsePixelValue(value: string): number` — parses `"24px"` → `24`, handles `"auto"` → `0`

Write `src/shared/utils/__tests__/unit.utils.test.ts` — **minimum 18 tests**:
- `pxToRem(24)` → `1.5`
- `pxToRem(24, 10)` → `2.4` (custom base)
- `pxToRem(0)` → `0`
- `remToPx(1.5)` → `24`
- `roundToDecimal(1.555, 2)` → `1.56`
- `roundToDecimal(24, 0)` → `24`
- `formatPx(24)` → `"24px"`
- `formatPx(0)` → `"0px"`
- `formatRem(1.5)` → `"1.5rem"`
- `snapToGrid(13, 8)` → `16` (rounds up to nearest)
- `snapToGrid(11, 8)` → `8` (rounds down)
- `snapToGrid(0, 8)` → `0`
- `isOnGrid(16, 8)` → `true`
- `isOnGrid(13, 8)` → `false`
- `isOnGrid(14, 8, 2)` → `true` (within tolerance)
- `parsePixelValue("24px")` → `24`
- `parsePixelValue("auto")` → `0`
- `parsePixelValue("0")` → `0`

**`src/shared/utils/color.utils.ts`**

Implement with full JSDoc:
- `rgbToHex(rgb: string): string` — `"rgb(59, 130, 246)"` → `"#3b82f6"`
- `hexToRgb(hex: string): { r: number; g: number; b: number } | null`
- `normalizeColor(value: string): string` — normalize any color format to lowercase hex
- `getRelativeLuminance(r: number, g: number, b: number): number`
- `getContrastRatio(fg: string, bg: string): number`
- `isWCAGCompliant(ratio: number, level: 'AA' | 'AAA', isLargeText?: boolean): boolean`
- `parseRGBAString(rgba: string): { r: number; g: number; b: number; a: number } | null`

Write `src/shared/utils/__tests__/color.utils.test.ts` — **minimum 14 tests**:
- `rgbToHex("rgb(59, 130, 246)")` → `"#3b82f6"`
- `rgbToHex("rgb(0, 0, 0)")` → `"#000000"`
- `rgbToHex("rgb(255, 255, 255)")` → `"#ffffff"`
- `hexToRgb("#3b82f6")` → `{ r: 59, g: 130, b: 246 }`
- `hexToRgb("#000")` → `{ r: 0, g: 0, b: 0 }` (shorthand hex)
- `hexToRgb("invalid")` → `null`
- `normalizeColor("rgb(59, 130, 246)")` → `"#3b82f6"`
- `normalizeColor("#3B82F6")` → `"#3b82f6"` (lowercased)
- `getContrastRatio("#000000", "#ffffff")` → `21`
- `getContrastRatio("#ffffff", "#ffffff")` → `1`
- `isWCAGCompliant(4.5, 'AA')` → `true`
- `isWCAGCompliant(4.4, 'AA')` → `false`
- `isWCAGCompliant(7, 'AAA')` → `true`
- `parseRGBAString("rgba(59, 130, 246, 0.5)")` → `{ r: 59, g: 130, b: 246, a: 0.5 }`

**`src/shared/utils/selector.utils.ts`**

Implement with full JSDoc:
- `getUniqueSelector(element: Element): string` — shortest unique CSS selector for the element
- `getElementPath(element: Element): string[]` — array of tag/class breadcrumbs from `<html>` to element
- `findElementBySelector(selector: string): Element | null`
- `escapeSelector(value: string): string` — escapes special CSS selector characters

Write `src/shared/utils/__tests__/selector.utils.test.ts` — **minimum 10 tests** using jsdom.

**`src/shared/utils/dom.utils.ts`**

Implement with full JSDoc:
- `isCrossOriginIframe(element: Element): boolean`
- `isInShadowDOM(element: Element): boolean`
- `getScrollOffset(): { x: number; y: number }`
- `isPixelPerfectElement(element: Element): boolean` — checks `data-pixelperfect` attribute
- `getViewportSize(): { width: number; height: number }`
- `isElementVisible(element: Element): boolean`

Write `src/shared/utils/__tests__/dom.utils.test.ts` — **minimum 8 tests** using jsdom.

**`src/shared/utils/storage.utils.ts`**

Implement with full JSDoc:
- `getSettings(): Promise<UserSettings>` — reads from `chrome.storage.sync`, returns `DEFAULT_SETTINGS` on failure
- `saveSettings(settings: Partial<UserSettings>): Promise<void>`
- `getDefaultSettings(): UserSettings` — returns `DEFAULT_SETTINGS`
- `resetSettings(): Promise<void>` — writes `DEFAULT_SETTINGS` to storage
- `getOverrides(domain: string): Promise<CSSOverride[]>`
- `saveOverride(override: CSSOverride): Promise<void>`
- `deleteOverride(id: string, domain: string): Promise<void>`

Use `chrome.storage.sync` for settings, `chrome.storage.local` for overrides. Include `localStorage` fallback for test environments.

---

### 1.6 — Background Service Worker (Stub)

**`src/background/background.ts`**
```ts
import { MESSAGE_ACTIONS } from '@shared/constants/messages.constants';
import { getSettings, saveSettings } from '@shared/utils/storage.utils';
import { DEFAULT_SETTINGS } from '@shared/constants/defaults.constants';

chrome.runtime.onInstalled.addListener(async () => {
  await saveSettings(DEFAULT_SETTINGS);
  console.debug('[PixelPerfect] Extension installed — settings initialized');
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === MESSAGE_ACTIONS.GET_SETTINGS) {
    getSettings().then(sendResponse);
    return true; // async response
  }
  if (message.action === MESSAGE_ACTIONS.UPDATE_SETTINGS) {
    saveSettings(message.payload).then(() => sendResponse({ success: true }));
    return true;
  }
});
```

---

### 1.7 — Content Script Stub

**`src/content/index.ts`**
```ts
// [PixelPerfect] Content script entry point
// Full initialization will be wired in Phase 2
console.debug('[PixelPerfect] Content script loaded');
```

---

### 1.8 — Popup Stub

**`src/popup/index.html`** — HTML shell loading `main.tsx`

**`src/popup/main.tsx`**
```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Popup } from './Popup';
import './index.css';

const root = document.getElementById('root');
if (root) createRoot(root).render(<Popup />);
```

**`src/popup/Popup.tsx`**
```tsx
export const Popup = () => (
  <div style={{ padding: 16, fontFamily: 'monospace', background: '#1E1E2E', color: '#CDD6F4' }}>
    <h1>PixelPerfect v1.0</h1>
    <p>Phase 1 — Scaffold complete ✅</p>
  </div>
);
```

---

## ✅ Phase 1 Deliverables Checklist

- [ ] `package.json` with all dependencies installed
- [ ] `tsconfig.json` with strict mode + path aliases
- [ ] `vite.config.ts` with extension plugin + all entry points
- [ ] `manifest.json` (MV3) valid
- [ ] `jest.config.js` with jsdom + path aliases
- [ ] `tailwind.config.js` + `postcss.config.js`
- [ ] `.eslintrc.json` + `.prettierrc` + `.gitignore`
- [ ] All 6 constants files with correct TypeScript types
- [ ] All 7 type definition files with full JSDoc
- [ ] `unit.utils.ts` + 18 passing tests
- [ ] `color.utils.ts` + 14 passing tests
- [ ] `selector.utils.ts` + 10 passing tests
- [ ] `dom.utils.ts` + 8 passing tests
- [ ] `storage.utils.ts` implemented
- [ ] `background.ts` stub wired
- [ ] `content/index.ts` stub
- [ ] `popup/Popup.tsx` stub renders
- [ ] `npm run build` — completes with zero errors
- [ ] `npm test` — all tests pass

## 🛑 STOP — Phase 1 Complete
```
✅ Phase 1 complete — Project scaffold, all constants, types, and utilities with test suites.
Run: npm run build && npm test
Both must pass before continuing.
Say "Start Phase 2" to continue.
```

---

---

# ════════════════════════════════════════════════════
# PHASE 2 — Element Inspector & Box Model Overlay
# ════════════════════════════════════════════════════

## 🎯 Goal
Build the core inspection engine. Hovering any element on the page shows a live colored box model overlay — margin (orange), padding (green), border (red), content (blue) — with a floating tooltip showing exact values in px and rem.

---

## Tasks

### 2.1 — ElementPicker (`src/content/inspector/ElementPicker.ts`)

Responsibilities:
- Attach `mousemove`, `mouseover`, `mouseout`, `click` event listeners to `document`
- Ignore any element with `data-pixelperfect` attribute (prevents infinite overlay loops)
- Track `hoveredElement` and `pinnedElement` (Shift+Click to pin)
- Expose callback registration: `onHover`, `onLeave`, `onClick`, `onPin`
- Expose `enable()` / `disable()` to start/stop listening
- Use `requestAnimationFrame` to throttle mousemove to 60fps

```ts
export class ElementPicker {
  private hoveredElement: Element | null = null;
  private pinnedElement: Element | null = null;
  private isEnabled: boolean = false;
  private pendingFrame: number | null = null;

  enable(): void
  disable(): void
  getHoveredElement(): Element | null
  getPinnedElement(): Element | null
  onHover(callback: (el: Element) => void): this
  onLeave(callback: () => void): this
  onClick(callback: (el: Element) => void): this
  onPin(callback: (el: Element) => void): this
}
```

Write `__tests__/ElementPicker.test.ts` — **minimum 10 tests** (mock DOM events).

### 2.2 — BoxModelCalculator (`src/content/inspector/BoxModelCalculator.ts`)

Responsibilities:
- Given an `Element`, return a complete `ElementInfo`
- Use `getComputedStyle()` to read all CSS values
- Parse shorthand values like `"16px 24px"` and `"8px 12px 16px 20px"` into `EdgeValues`
- Cache results in a `WeakMap<Element, ElementInfo>` — invalidated by MutationObserver
- Use `getBoundingClientRect()` for the `rect` property

```ts
export class BoxModelCalculator {
  private cache: WeakMap<Element, ElementInfo> = new WeakMap();

  calculate(element: Element): ElementInfo
  invalidate(element: Element): void
  clearCache(): void
  private parseEdgeValues(value: string): EdgeValues
  private parsePixelValue(value: string): number
}
```

Write `__tests__/BoxModelCalculator.test.ts` — **minimum 14 tests**:
- `"16px 24px"` → `{ top: 16, right: 24, bottom: 16, left: 24 }`
- `"8px 12px 16px 20px"` → `{ top: 8, right: 12, bottom: 16, left: 20 }`
- `"16px"` → all sides `16`
- `"0px"` → all sides `0`
- `"auto"` → `0`
- `"0"` (no unit) → `0`
- Cache hit returns same reference
- Cache miss after `invalidate()` recalculates
- Negative values handled gracefully
- Subpixel values (`"16.5px"`) parsed correctly

### 2.3 — OverlayRenderer (`src/content/overlay/OverlayRenderer.ts`)

Responsibilities:
- Inject a single `<svg data-pixelperfect="overlay">` into `document.body`
- Full-viewport fixed position, `pointer-events: none`, `z-index: 2147483647`
- Maintain named `<g>` groups per layer type
- `render(layers: OverlayLayer[])` — batches updates in `requestAnimationFrame`
- `clear()` — removes all layer content
- `destroy()` — removes SVG from DOM entirely
- Handle `window.resize` — re-render current layers at new viewport size
- Handle `window.scroll` — layers stay accurate (uses fixed positioning + viewport-relative rects)

```ts
export class OverlayRenderer {
  private svg: SVGSVGElement;
  private pendingFrame: number | null = null;

  constructor()
  render(layers: OverlayLayer[]): void
  clear(): void
  destroy(): void
}
```

Write `__tests__/OverlayRenderer.test.ts` — **minimum 8 tests**.

### 2.4 — BoxModelOverlay (`src/content/overlay/BoxModelOverlay.ts`)

Responsibilities:
- Given an `ElementInfo`, build the `OverlayLayer` for the colored box model zones
- Draw 4 SVG `<rect>` elements, outermost first: margin → border → padding → content
- Positions calculated from `rect` + box model values
- Colors from `OVERLAY_COLORS` constant (respect current theme from settings)
- Each rect has a small opacity, making them visually stackable

```ts
export class BoxModelOverlay {
  static build(info: ElementInfo, theme?: OverlayTheme): OverlayLayer
}
```

### 2.5 — TooltipOverlay (`src/content/overlay/TooltipOverlay.ts`)

Responsibilities:
- Given `ElementInfo`, build the tooltip `OverlayLayer`
- Display element tag + selector, then margin/padding/border/content values in px and rem
- Smart positioning: prefer bottom-right, flip if near viewport edge
- Dark theme by default (uses `OVERLAY_COLORS.TOOLTIP_BG` etc.)
- Show copy buttons: `[CSS]` `[SCSS]` `[Tailwind]` (format buttons wired in Phase 5)

Layout:
```
┌──────────────────────────────┐
│ div.card                     │
├──────────────────────────────┤
│ margin    16px  1rem         │
│ padding   24px  1.5rem       │
│ border    1px                │
│ content   320 × 180          │
├──────────────────────────────┤
│ [CSS]  [SCSS]  [Tailwind]    │
└──────────────────────────────┘
```

```ts
export class TooltipOverlay {
  static build(info: ElementInfo, theme?: OverlayTheme): OverlayLayer
  private static calculatePosition(rect: DOMRect): TooltipPosition
}
```

Write `__tests__/TooltipOverlay.test.ts` — **minimum 6 tests** (position flipping, content correctness).

### 2.6 — Wire Content Script (`src/content/index.ts`)

```ts
import { ElementPicker } from './inspector/ElementPicker';
import { BoxModelCalculator } from './inspector/BoxModelCalculator';
import { OverlayRenderer } from './overlay/OverlayRenderer';
import { BoxModelOverlay } from './overlay/BoxModelOverlay';
import { TooltipOverlay } from './overlay/TooltipOverlay';
import { getSettings } from '@shared/utils/storage.utils';

async function init(): Promise<void> {
  try {
    const settings = await getSettings();
    if (!settings.isEnabled) return;

    const picker = new ElementPicker();
    const calculator = new BoxModelCalculator();
    const renderer = new OverlayRenderer();

    picker.onHover((element) => {
      try {
        const info = calculator.calculate(element);
        renderer.render([
          BoxModelOverlay.build(info, settings.overlayTheme),
          TooltipOverlay.build(info, settings.overlayTheme),
        ]);
      } catch (err) {
        console.debug('[PixelPerfect] Overlay render failed:', err);
      }
    });

    picker.onLeave(() => renderer.clear());
    picker.enable();
  } catch (err) {
    console.debug('[PixelPerfect] Init failed:', err);
  }
}

init();
```

### 2.7 — Update Popup with Toggle

Update `src/popup/Popup.tsx` to show:
- Extension logo/name header
- ON/OFF toggle switch (styled, not browser default)
- Status text: "Inspecting" / "Off"
- When toggled: `chrome.storage.sync` updates `isEnabled`, sends `TOGGLE_INSPECTOR` message to active tab

---

## ✅ Phase 2 Deliverables Checklist

- [ ] `ElementPicker.ts` with rAF throttle + all callbacks + 10 tests
- [ ] `BoxModelCalculator.ts` with WeakMap cache + 14 tests
- [ ] `OverlayRenderer.ts` with SVG layer management + 8 tests
- [ ] `BoxModelOverlay.ts` with correct colored rects
- [ ] `TooltipOverlay.ts` with smart positioning + 6 tests
- [ ] `content/index.ts` fully wired with try/catch
- [ ] `Popup.tsx` with working ON/OFF toggle
- [ ] `npm run build` passes
- [ ] `npm test` passes (all previous + new tests)
- [ ] Load in Chrome → hover elements → colored overlay + tooltip visible

## 🛑 STOP — Phase 2 Complete
```
✅ Phase 2 complete — Box model overlay and tooltip are live in the browser.
Load the unpacked extension: chrome://extensions → Load unpacked → select dist/
Hover any element and verify the colored overlay + tooltip appears.
Say "Start Phase 3" to continue.
```

---

---

# ═══════════════════════════════════════════════════════
# PHASE 3 — Distance Measurement & Alignment Guides
# ═══════════════════════════════════════════════════════

## 🎯 Goal
Implement the Figma red lines feature. Hold `Alt` and hover near a second element — red measurement lines show the exact pixel gap between two elements, with dotted alignment guides when shared edges are detected.

---

## Tasks

### 3.1 — DistanceCalculator (`src/content/inspector/DistanceCalculator.ts`)

Given two `DOMRect` objects, compute all distance measurements:
- `top`: space from rectA's bottom to rectB's top
- `bottom`: space from rectB's bottom to rectA's top
- `left`: space from rectA's right to rectB's left
- `right`: space from rectB's right to rectA's left
- `horizontal`: center-to-center horizontal
- `vertical`: center-to-center vertical
- `isOverlapping`: true if rects intersect

```ts
export class DistanceCalculator {
  calculate(rectA: DOMRect, rectB: DOMRect): DistanceMeasurement
  getNearestEdgeDistance(rectA: DOMRect, rectB: DOMRect): number
}
```

Write `__tests__/DistanceCalculator.test.ts` — **minimum 16 tests**:
- Side-by-side with 24px gap → `left: 24`
- Stacked with 16px gap → `top: 16`
- Overlapping → `isOverlapping: true`
- Same rect → all zero, `isOverlapping: true`
- rectA above rectB → only `top` is positive
- Center-to-center calculations
- Negative distances for overlap cases

### 3.2 — AlignmentDetector (`src/content/inspector/AlignmentDetector.ts`)

Given two `DOMRect` objects, detect shared edges and centers within a tolerance:

```ts
export class AlignmentDetector {
  private tolerance: number = 2;

  detect(rectA: DOMRect, rectB: DOMRect): AlignmentResult
  setTolerance(px: number): void
}
```

Write `__tests__/AlignmentDetector.test.ts` — **minimum 12 tests**:
- Exact same top → `alignedTop: true`
- 1px off → `true` (within tolerance)
- 3px off → `false` (outside default tolerance)
- Center X alignment
- Center Y alignment
- Custom tolerance changes results

### 3.3 — DistanceLineOverlay (`src/content/overlay/DistanceLineOverlay.ts`)

Given two `ElementInfo` + `DistanceMeasurement`, build SVG red measurement lines:
- Dashed red lines from closest edges of rectA to rectB
- Small pill-shaped label on each line showing the px value
- Animated in with SVG `stroke-dasharray` on mount
- Only show lines for non-overlapping sides (skip negative distances)

```ts
export class DistanceLineOverlay {
  static build(infoA: ElementInfo, infoB: ElementInfo, distance: DistanceMeasurement, theme?: OverlayTheme): OverlayLayer
}
```

### 3.4 — AlignmentGuideOverlay (`src/content/overlay/AlignmentGuideOverlay.ts`)

Given `AlignmentResult` and two rects, draw full-viewport dotted guide lines:
- One guide per detected alignment axis
- Indigo color from `OVERLAY_COLORS.ALIGNMENT_GUIDE`
- Label at viewport edge: `"top aligned"`, `"center"`

```ts
export class AlignmentGuideOverlay {
  static build(alignment: AlignmentResult, rectA: DOMRect, rectB: DOMRect): OverlayLayer
}
```

### 3.5 — Update ElementPicker for Alt Mode

Add to `ElementPicker.ts`:
- `isAltPressed` flag tracked via `keydown` / `keyup`
- `onMeasure(callback: (elA: Element, elB: Element) => void)` callback
- When Alt held: use `pinnedElement` as reference, or last hovered element
- When Alt released: clear distance overlays, resume normal hover mode

### 3.6 — Update `content/index.ts`

Wire distance measurement and alignment guides:
```ts
picker.onMeasure((elementA, elementB) => {
  const infoA = calculator.calculate(elementA);
  const infoB = calculator.calculate(elementB);
  const distance = distanceCalculator.calculate(infoA.rect, infoB.rect);
  const alignment = alignmentDetector.detect(infoA.rect, infoB.rect);
  renderer.render([
    DistanceLineOverlay.build(infoA, infoB, distance, settings.overlayTheme),
    AlignmentGuideOverlay.build(alignment, infoA.rect, infoB.rect),
  ]);
});
```

---

## ✅ Phase 3 Deliverables Checklist

- [ ] `DistanceCalculator.ts` + 16 tests
- [ ] `AlignmentDetector.ts` + 12 tests
- [ ] `DistanceLineOverlay.ts` with animated red lines + labels
- [ ] `AlignmentGuideOverlay.ts` with dotted viewport-wide guides
- [ ] `ElementPicker.ts` updated with Alt mode
- [ ] `content/index.ts` updated
- [ ] Hold Alt + hover → red lines appear between elements
- [ ] Dotted guides appear on shared edges
- [ ] All tests pass

## 🛑 STOP — Phase 3 Complete
```
✅ Phase 3 complete — Distance measurement (Figma red lines) is working.
Test: hold Alt and hover between elements on any site — red measurement lines should appear.
Say "Start Phase 4" to continue.
```

---

---

# ══════════════════════════════════════════════════
# PHASE 4 — Design Token Scanner & Mapper
# ══════════════════════════════════════════════════

## 🎯 Goal
Make PixelPerfect token-aware. On page load, scan all CSS custom properties and build a token map. When inspecting elements, reverse-map computed values back to token names. Show `var(--color-primary)` instead of `rgb(59, 130, 246)`.

---

## Tasks

### 4.1 — TokenScanner (`src/content/tokens/TokenScanner.ts`)

Responsibilities:
- Iterate `document.styleSheets` on page load
- For each rule, find CSS custom property declarations (name starts with `--`)
- Skip `--tw-*` internal Tailwind properties
- Resolve computed values via `getComputedStyle(document.documentElement)`
- Build a `TokenMap` with `byValue` and `byName` indexes
- Watch for new stylesheets via `MutationObserver` on `<head>` (handles SPAs)
- Debounce re-scans by 500ms

```ts
export class TokenScanner {
  private tokenMap: TokenMap = { byValue: {}, byName: {}, allTokens: [] };

  scan(): TokenMap
  observe(): void
  getTokenMap(): TokenMap
  destroy(): void
}
```

Write `__tests__/TokenScanner.test.ts` — **minimum 12 tests** (mock `document.styleSheets`).

### 4.2 — TokenMapper (`src/content/tokens/TokenMapper.ts`)

Responsibilities:
- Given a computed value, find the best matching `DesignToken`
- Normalize colors before matching (rgb ↔ hex)
- Prefer most descriptive name when multiple tokens share a value
- Custom tokens (from user settings) take priority over page-scanned tokens
- `mapBoxModel(boxModel, tokenMap)` returns `MappedBoxModel` with token names where found

```ts
export class TokenMapper {
  constructor(private tokenMap: TokenMap) {}

  findToken(computedValue: string): DesignToken | null
  findAllTokens(computedValue: string): DesignToken[]
  mapBoxModel(boxModel: BoxModel): MappedBoxModel
}
```

Write `__tests__/TokenMapper.test.ts` — **minimum 14 tests**:
- `"24px"` → token `--spacing-6`
- `"rgb(59, 130, 246)"` → token `--color-primary` (via hex normalization)
- Unknown value → `null`
- Custom token overrides page token for same value
- Multiple tokens for same value → most descriptive name wins

### 4.3 — TailwindMapper (`src/content/tokens/TailwindMapper.ts`)

Responsibilities:
- Map spacing values to Tailwind utility classes using `TAILWIND_SPACING_SCALE`
- Map border-radius values using `TAILWIND_RADIUS_SCALE`
- Map color hex values to Tailwind color palette names
- Return `null` for unmapped values

```ts
export class TailwindMapper {
  mapSpacing(px: number, property: 'margin' | 'padding' | 'gap' | 'width' | 'height'): string | null
  mapBorderRadius(px: number): string | null
  mapFontSize(px: number): string | null
  mapColor(hex: string): string | null
}
```

Write `__tests__/TailwindMapper.test.ts` — **minimum 16 tests**:
- `24px` margin → `m-6`
- `16px` padding top → `pt-4`
- `16px 24px` padding → recognizes as `py-4 px-6`
- `8px` radius → `rounded`
- `9999px` radius → `rounded-full`
- `#3B82F6` → `blue-500`
- Unmapped value → `null`

### 4.4 — TokenImporter (`src/content/tokens/TokenImporter.ts`)

Responsibilities:
- Parse a `tokens.json` file in Figma Tokens / Style Dictionary format
- Convert to `DesignToken[]` with correct category inference
- Merge with existing TokenMap (imported tokens get `source: 'imported'`)

```ts
export class TokenImporter {
  static parseStyleDictionary(json: Record<string, unknown>): DesignToken[]
  static parseFigmaTokens(json: Record<string, unknown>): DesignToken[]
  static inferCategory(name: string, value: string): TokenCategory
}
```

Write `__tests__/TokenImporter.test.ts` — **minimum 10 tests**.

### 4.5 — Update TooltipOverlay with Token Info

Update `TooltipOverlay.ts` to accept `MappedBoxModel` and show token data:

```
div.card
─────────────────────────────────────────
margin    16px  →  var(--spacing-4)  m-4
padding   24px  →  var(--spacing-6)  px-6
border    1px
─────────────────────────────────────────
320 × 180
─────────────────────────────────────────
[CSS]  [SCSS]  [SASS]  [Tailwind]  [Vars]
```

Token name shown in muted color. Tailwind class in accent color.

### 4.6 — Initialize TokenScanner in Content Script

Update `content/index.ts`:
```ts
const tokenScanner = new TokenScanner();
const tokenMap = tokenScanner.scan();
tokenScanner.observe(); // watch for SPA style changes
const tokenMapper = new TokenMapper(tokenMap);
```

---

## ✅ Phase 4 Deliverables Checklist

- [ ] `TokenScanner.ts` + 12 tests
- [ ] `TokenMapper.ts` + 14 tests
- [ ] `TailwindMapper.ts` + 16 tests
- [ ] `TokenImporter.ts` + 10 tests
- [ ] `TooltipOverlay.ts` updated with token + Tailwind display
- [ ] `content/index.ts` initializes scanner
- [ ] Works on Tailwind sites — hover shows `m-6` etc.
- [ ] Works on sites with CSS vars — hover shows `var(--color-primary)`
- [ ] All tests pass

## 🛑 STOP — Phase 4 Complete
```
✅ Phase 4 complete — Design token scanning and reverse-mapping is live.
Test on a Tailwind site (e.g. tailwindcss.com) — hover elements should show Tailwind classes.
Test on a site with CSS variables — hover should show token names.
Say "Start Phase 5" to continue.
```

---

---

# ═══════════════════════════════════════════════════════════
# PHASE 5 — Export Engine (CSS / SCSS / SASS / Tailwind / CSS-in-JS)
# ═══════════════════════════════════════════════════════════

## 🎯 Goal
One-click copy of any element's styles in 7 different formats. All exporters are pure, stateless, fully tested, and token-aware.

---

## Tasks

### 5.1 — Base Exporter Interface (`src/content/exporter/base.exporter.ts`)

```ts
import { IExporter, ExportResult, ExportOptions } from '@shared/types/export.types';
import { ElementInfo } from '@shared/types/element.types';
import { TokenMap } from '@shared/types/token.types';

// Shared helper: filter out browser-default property values
export function filterMeaningfulProperties(
  styles: CSSStyleDeclaration,
  tagName: string
): Record<string, string>

// Shared helper: convert kebab-case to camelCase
export function toCamelCase(property: string): string

// Shared helper: find token name or return raw value
export function resolveTokenOrValue(value: string, tokenMap?: TokenMap): string
```

### 5.2 — CSSExporter (`src/content/exporter/CSSExporter.ts`)

Output:
```css
.card {
  margin: 16px;
  padding: 24px;
  border-radius: 8px;
  background-color: #3B82F6;
}
```

Strips browser defaults. Includes only meaningful properties. Uses `getUniqueSelector` for the class name.

Write `__tests__/CSSExporter.test.ts` — **minimum 10 tests**.

### 5.3 — SCSSExporter (`src/content/exporter/SCSSExporter.ts`)

Output:
```scss
.card {
  margin: $spacing-4;           // 16px
  padding: $spacing-6;          // 24px
  border-radius: $radius-md;    // 8px
  background-color: $color-primary; // #3B82F6
}
```

Token names converted to `$variable` format. Raw value as inline comment.

Write `__tests__/SCSSExporter.test.ts` — **minimum 10 tests**.

### 5.4 — SASSExporter (`src/content/exporter/SASSExporter.ts`)

Output:
```sass
.card
  margin: $spacing-4
  padding: $spacing-6
  border-radius: $radius-md
  background-color: $color-primary
```

No curly braces. No semicolons. Indented syntax only.

Write `__tests__/SASSExporter.test.ts` — **minimum 8 tests** including: no braces, no semicolons, correct indentation.

### 5.5 — TailwindExporter (`src/content/exporter/TailwindExporter.ts`)

Output:
```
m-4 p-6 rounded-lg bg-blue-500 text-sm font-semibold
```

Groups by category. Adds `/* no Tailwind equivalent: gap: 37px */` comment for unmapped values.

Write `__tests__/TailwindExporter.test.ts` — **minimum 12 tests**.

### 5.6 — CSSInJSExporter (`src/content/exporter/CSSInJSExporter.ts`)

Two modes based on `cssInJSMode` setting:

**Template (styled-components / emotion):**
```ts
const Card = styled.div`
  margin: 16px;
  padding: 24px;
  border-radius: 8px;
`;
```

**Object (MUI / inline styles):**
```ts
const styles = {
  margin: '16px',
  padding: '24px',
  borderRadius: '8px',  // camelCase
};
```

Write `__tests__/CSSInJSExporter.test.ts` — **minimum 10 tests** including camelCase conversion, both modes.

### 5.7 — CSSVariableExporter (`src/content/exporter/CSSVariableExporter.ts`)

Output:
```css
.card {
  margin: var(--spacing-4);
  padding: var(--spacing-6);
  border-radius: var(--radius-md);
  background-color: var(--color-primary);
  gap: 37px; /* no token found */
}
```

Write `__tests__/CSSVariableExporter.test.ts` — **minimum 8 tests**.

### 5.8 — ClipboardManager (`src/content/exporter/ClipboardManager.ts`)

```ts
export class ClipboardManager {
  async copy(text: string): Promise<boolean>
  showCopiedFeedback(nearElement: Element, label: string): void
}
```

Uses `navigator.clipboard.writeText()` with `document.execCommand` fallback.
`showCopiedFeedback` briefly shows a `"Copied!"` SVG badge near the element for 1500ms.

### 5.9 — Wire Copy Buttons in Tooltip

Update `TooltipOverlay.ts` — clicking `[CSS]`, `[SCSS]`, etc. invokes the correct exporter and `ClipboardManager.copy()`.

---

## ✅ Phase 5 Deliverables Checklist

- [ ] `base.exporter.ts` with shared helpers
- [ ] `CSSExporter.ts` + 10 tests
- [ ] `SCSSExporter.ts` + 10 tests
- [ ] `SASSExporter.ts` + 8 tests (verify no braces/semicolons)
- [ ] `TailwindExporter.ts` + 12 tests
- [ ] `CSSInJSExporter.ts` (both modes) + 10 tests
- [ ] `CSSVariableExporter.ts` + 8 tests
- [ ] `ClipboardManager.ts` with feedback animation
- [ ] Tooltip copy buttons functional
- [ ] Click each button → paste into editor → verify correct output
- [ ] All tests pass

## 🛑 STOP — Phase 5 Complete
```
✅ Phase 5 complete — All 7 export formats working with one-click copy.
Test every format: hover an element, click each copy button, paste into your editor.
Say "Start Phase 6" to continue.
```

---

---

# ═════════════════════════════════════
# PHASE 6 — Live CSS Editor
# ═════════════════════════════════════

## 🎯 Goal
Click any element to open an inline CSS editor panel. Edit values live — the page updates instantly. Changes are tracked in edit history and can be exported as a CSS patch file. Edits persist across page refreshes.

---

## Tasks

### 6.1 — CSSEditor (`src/content/editor/CSSEditor.ts`)

Responsibilities:
- On element click (not hover), inject an inline editing panel near the element
- Panel shows all meaningful CSS properties as editable fields
- On field change: apply via `element.style.setProperty()` immediately
- On Enter/blur: confirm the edit
- On Escape: revert to original value
- Panel marked with `data-pixelperfect="editor"` so ElementPicker ignores it

```ts
export class CSSEditor {
  open(element: Element, info: ElementInfo): void
  close(): void
  onEdit(callback: (op: EditOperation) => void): this
  isOpen(): boolean
}
```

Write `__tests__/CSSEditor.test.ts` — **minimum 10 tests**.

### 6.2 — EditHistory (`src/content/editor/EditHistory.ts`)

Responsibilities:
- Record every `EditOperation` in chronological order
- `undo(id)` — reverts a specific edit by re-applying `originalValue`
- `undoLast()` — reverts most recent edit
- `getAll()` — returns full history array
- Cap at 500 entries, prune oldest on overflow
- Serialize to JSON for storage persistence

```ts
export class EditHistory {
  record(operation: EditOperation): void
  undo(id: string): EditOperation | null
  undoLast(): EditOperation | null
  getAll(): EditOperation[]
  clear(): void
  toJSON(): string
  fromJSON(json: string): void
}
```

Write `__tests__/EditHistory.test.ts` — **minimum 12 tests**.

### 6.3 — DragResizer (`src/content/editor/DragResizer.ts`)

Responsibilities:
- Attach drag handles to element edges (top, bottom, left, right)
- Dragging an edge updates `width` or `height` in real time
- On drag end: record an `EditOperation` in history
- Handles marked with `data-pixelperfect="drag-handle"`

### 6.4 — NudgeController (`src/content/editor/NudgeController.ts`)

Responsibilities:
- When an element is selected (pinned), Arrow keys nudge `margin-*` by 1px
- Shift+Arrow nudges by the current `gridBaseUnit` setting
- Each nudge records an `EditOperation` in history

### 6.5 — PersistenceLayer (`src/content/editor/PersistenceLayer.ts`)

Responsibilities:
- On every `EditOperation`, save to `chrome.storage.local` keyed by domain
- On content script init, read all overrides for current domain and re-apply them
- `saveOverride(override: CSSOverride)` — upserts by id
- `deleteOverride(id)` — removes a specific override
- `clearDomain(domain)` — removes all overrides for a domain

```ts
export class PersistenceLayer {
  async loadAndApply(): Promise<void>
  async saveOverride(override: CSSOverride): Promise<void>
  async deleteOverride(id: string): Promise<void>
  async clearDomain(): Promise<void>
  private applyOverride(override: CSSOverride): void
}
```

Write `__tests__/PersistenceLayer.test.ts` — **minimum 8 tests** (mock chrome.storage.local).

### 6.6 — DiffEngine (`src/content/editor/DiffEngine.ts`)

Responsibilities:
- `saveSnapshot(element)` — stores current computed styles for an element
- `diff(element)` — compares current styles to snapshot → returns `DiffResult[]`
- Results show added, removed, or changed properties

```ts
export class DiffEngine {
  saveSnapshot(element: Element, info: ElementInfo): void
  diff(element: Element, info: ElementInfo): DiffResult[]
  clearSnapshot(element: Element): void
}
```

Write `__tests__/DiffEngine.test.ts` — **minimum 8 tests**.

### 6.7 — PatchExporter (`src/content/editor/PatchExporter.ts`)

Responsibilities:
- Given `EditOperation[]`, generate a complete `.css` patch file
- Group changes by selector
- Include a comment header with timestamp and domain

```ts
export class PatchExporter {
  static generate(operations: EditOperation[], domain: string): string
}
```

Write `__tests__/PatchExporter.test.ts` — **minimum 6 tests**.

### 6.8 — Update `content/index.ts`

Wire CSSEditor, EditHistory, PersistenceLayer, NudgeController:
```ts
const editor = new CSSEditor();
const history = new EditHistory();
const persistence = new PersistenceLayer();
const nudger = new NudgeController(history);

await persistence.loadAndApply(); // re-apply saved overrides on load

picker.onClick((element) => {
  const info = calculator.calculate(element);
  editor.open(element, info);
});

editor.onEdit((op) => {
  history.record(op);
  persistence.saveOverride(op.override);
});
```

---

## ✅ Phase 6 Deliverables Checklist

- [ ] `CSSEditor.ts` with live editing + 10 tests
- [ ] `EditHistory.ts` with undo + 12 tests
- [ ] `DragResizer.ts` functional
- [ ] `NudgeController.ts` with arrow key nudging
- [ ] `PersistenceLayer.ts` + 8 tests
- [ ] `DiffEngine.ts` + 8 tests
- [ ] `PatchExporter.ts` + 6 tests
- [ ] Click element → editor panel opens
- [ ] Edit a value → page updates instantly
- [ ] Refresh page → override re-applied from storage
- [ ] All tests pass

## 🛑 STOP — Phase 6 Complete
```
✅ Phase 6 complete — Live CSS editor with persistence is working.
Test: click an element, edit margin-top, refresh the page — the override should persist.
Say "Start Phase 7" to continue.
```

---

---

# ═════════════════════════════════════
# PHASE 7 — Full Popup UI & Settings
# ═════════════════════════════════════

## 🎯 Goal
Build the complete, polished popup UI. All settings configurable, all changes persist and sync to the content script in real time.

---

## Tasks

### 7.1 — ToggleSwitch (`src/popup/components/ToggleSwitch.tsx`)
- Main ON/OFF toggle
- Animated pill-style toggle, green when on
- Sends `TOGGLE_INSPECTOR` message to active tab on change

### 7.2 — GridSettings (`src/popup/components/GridSettings.tsx`)
- Button group: `4pt` `8pt` `10pt` `12pt` `Custom`
- Shows custom input when "Custom" selected
- Validates: must be positive integer
- Saves on change

### 7.3 — ExportFormatSelector (`src/popup/components/ExportFormatSelector.tsx`)
- Segmented control showing all 7 format labels
- Selected format highlighted with accent color
- Saves selection as default on change

### 7.4 — TokenConfigPanel (`src/popup/components/TokenConfigPanel.tsx`)
- Shows detected page tokens (read-only, from content script via message)
- Add custom token: Name field + Value field + Add button
- List of custom tokens with delete button per item
- Import button: opens file picker for `tokens.json`
- On import: sends parsed tokens to content script

### 7.5 — OverlaySettings (`src/popup/components/OverlaySettings.tsx`)
- Individual toggles for: Box Model, Distance Lines, Alignment Guides, Typography Info

### 7.6 — AccessibilitySettings (`src/popup/components/AccessibilitySettings.tsx`)
- Individual toggles for: Contrast Ratios, Focus Order, ARIA Roles

### 7.7 — ShortcutDisplay (`src/popup/components/ShortcutDisplay.tsx`)
- Clean table from `KEYBOARD_SHORTCUTS` constant
- Key badge styled as keyboard key
- Read-only

### 7.8 — ThemeToggle (`src/popup/components/ThemeToggle.tsx`)
- Dark / Light toggle
- Shows color swatch preview

### 7.9 — AboutPanel (`src/popup/components/AboutPanel.tsx`)
- Version number
- Link to GitHub
- "Send feedback" thumbs up button

### 7.10 — Root Popup (`src/popup/Popup.tsx`)

Layout:
```
┌──────────────────────────────┐
│ ● PixelPerfect        [● ON] │
├──────────────────────────────┤
│ GRID UNIT                    │
│ [4pt][8pt][10pt][12pt][---]  │
├──────────────────────────────┤
│ EXPORT FORMAT                │
│ [CSS][SCSS][Sass][TW][JS]... │
├──────────────────────────────┤
│ OVERLAY           [Dark ▼]   │
│ ☑ Box Model                  │
│ ☑ Distance Lines             │
│ ☑ Alignment Guides           │
│ ☐ Typography Info            │
├──────────────────────────────┤
│ ACCESSIBILITY                │
│ ☐ Contrast  ☐ Focus  ☐ ARIA  │
├──────────────────────────────┤
│ DESIGN TOKENS          [+]   │
│ --brand-blue  #1D4ED8   [×]  │
│ [Import tokens.json]         │
├──────────────────────────────┤
│ SHORTCUTS                    │
│ Alt+Hover    Measure         │
│ Shift+Click  Pin             │
│ Ctrl+⇧+S     Toggle          │
├──────────────────────────────┤
│ v1.0.0   GitHub   Feedback   │
└──────────────────────────────┘
```

Styling requirements:
- Width: 320px, max-height: 600px, scrollable
- Background: `#1E1E2E`, text: `#CDD6F4`
- Accent: Indigo `#6366F1`
- Monospace font for token values and code
- Smooth section transitions
- Dividers between sections

### 7.11 — Write Popup Tests (`src/popup/__tests__/`)

Write React Testing Library tests for:
- `Popup.test.tsx` — renders all sections, toggle sends message
- `GridSettings.test.tsx` — button selection, custom input validation
- `ExportFormatSelector.test.tsx` — selection updates and persists

---

## ✅ Phase 7 Deliverables Checklist

- [ ] All 9 popup components built and styled
- [ ] `Popup.tsx` full layout rendering
- [ ] All settings persist via `chrome.storage.sync`
- [ ] Settings changes sync to content script in real time
- [ ] `tokens.json` import functional
- [ ] Popup tests passing
- [ ] Popup looks polished at 320px width

## 🛑 STOP — Phase 7 Complete
```
✅ Phase 7 complete — Full popup UI with all settings.
Open the extension popup and verify every setting works and persists across close/reopen.
Say "Start Phase 8" to continue.
```

---

---

# ══════════════════════════════════════════════════════
# PHASE 8 — Advanced Inspectors (Flexbox, Grid, Typography, Z-Index)
# ══════════════════════════════════════════════════════

## 🎯 Goal
Add deep layout inspection. Detect flex containers, grid containers, typography properties, and z-index stacking. Show contextual overlays for each.

---

## Tasks

### 8.1 — FlexboxInspector (`src/content/inspector/FlexboxInspector.ts`)

Detects if an element is a flex container. Reads `FlexboxData`:
- `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `gap`
- For each child: `flex-grow`, `flex-shrink`, `flex-basis`, `order`

Write `__tests__/FlexboxInspector.test.ts` — **minimum 10 tests**.

### 8.2 — FlexboxOverlay (`src/content/overlay/FlexboxOverlay.ts`)

Given `FlexboxData`:
- Draw main-axis arrow across the container
- Draw cross-axis arrow
- Badge on each child showing `grow/shrink/basis`
- Label `justify-content` and `align-items` values

### 8.3 — GridInspector (`src/content/inspector/GridInspector.ts`)

Detects if an element is a grid container. Reads:
- `grid-template-columns`, `grid-template-rows`, `grid-template-areas`
- `column-gap`, `row-gap`
- For each child: `grid-column`, `grid-row`, `grid-area`

Write `__tests__/GridInspector.test.ts` — **minimum 8 tests**.

### 8.4 — GridOverlay (`src/content/overlay/GridOverlay.ts`)

Given grid data:
- Draw all column track lines and row track lines
- Label each track with its size
- Highlight each grid cell with its area name (if named)
- Show child placement highlights

### 8.5 — TypographyInspector (`src/content/inspector/TypographyInspector.ts`)

For any element with text content, reads `TypographyData`:
- `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`
- Text `color`, computed contrast ratio against background
- WCAG AA and AAA pass/fail

Write `__tests__/TypographyInspector.test.ts` — **minimum 10 tests**.

### 8.6 — TypographyOverlay (`src/content/overlay/TypographyOverlay.ts`)

Shows a typography detail badge on hover when `showTypographyInfo` is enabled:
```
Söhne / 16px / 600 / 1.5
#1E1E2E  contrast: 12.4:1  AA ✓  AAA ✓
```

### 8.7 — ZIndexInspector (`src/content/inspector/ZIndexInspector.ts`)

Scans all positioned elements on the page and builds a stacking layer list sorted by effective z-index.

### 8.8 — ZIndexOverlay (`src/content/overlay/ZIndexOverlay.ts`)

Renders a 3D perspective stack visualization of all z-index layers when triggered, with the hovered element highlighted.

### 8.9 — ContrastOverlay (`src/content/overlay/ContrastOverlay.ts`)

When `showContrastRatios` is enabled, attaches WCAG pass/fail badges to every visible text element on the page.

### 8.10 — Update `content/index.ts`

Wire all new inspectors, conditionally rendered based on settings:
```ts
if (settings.showTypographyInfo) {
  // attach TypographyInspector + TypographyOverlay to hover flow
}
if (settings.showContrastRatios) {
  // run ContrastOverlay on all text elements after page load
}
```

---

## ✅ Phase 8 Deliverables Checklist

- [ ] `FlexboxInspector.ts` + 10 tests
- [ ] `FlexboxOverlay.ts` showing axis arrows + child badges
- [ ] `GridInspector.ts` + 8 tests
- [ ] `GridOverlay.ts` showing track lines + area labels
- [ ] `TypographyInspector.ts` + 10 tests
- [ ] `TypographyOverlay.ts` showing type details
- [ ] `ZIndexInspector.ts` building z-index stack
- [ ] `ZIndexOverlay.ts` 3D visualization
- [ ] `ContrastOverlay.ts` WCAG badges
- [ ] All inspectors gated by settings toggles
- [ ] All tests pass

## 🛑 STOP — Phase 8 Complete
```
✅ Phase 8 complete — Flexbox, Grid, Typography and Z-index inspectors are live.
Test on a Flexbox layout — flex arrows and child values should appear.
Test on a CSS Grid layout — track lines and area names should appear.
Say "Start Phase 9" to continue.
```

---

---

# ═══════════════════════════════════════════════════
# PHASE 9 — Spacing Audit & Accessibility Audit
# ═══════════════════════════════════════════════════

## 🎯 Goal
Full-page audit engine. Scans the entire page for spacing inconsistencies, near-miss alignments, WCAG contrast failures, and dark mode conflicts. Produces a structured report with fix suggestions.

---

## Tasks

### 9.1 — SpacingAuditor (`src/content/audit/SpacingAuditor.ts`)

Scans every visible element:
- **Off-grid values**: spacing values not divisible by `gridBaseUnit`
- **Magic numbers**: spacing values that appear only once across all elements
- **Inconsistent siblings**: sibling elements of the same tag with different gaps between them

```ts
export class SpacingAuditor {
  run(gridUnit: number): AuditIssue[]
}
```

Write `__tests__/SpacingAuditor.test.ts` — **minimum 12 tests**.

### 9.2 — AlignmentAuditor (`src/content/audit/AlignmentAuditor.ts`)

Scans visible elements for near-miss alignment — elements within 1–3px of alignment but not quite:
- Compares all elements within each container
- Reports which edge is nearly-aligned and by how many pixels

Write `__tests__/AlignmentAuditor.test.ts` — **minimum 8 tests**.

### 9.3 — ContrastAuditor (`src/content/audit/ContrastAuditor.ts`)

Scans all text elements for WCAG contrast compliance:
- Computes contrast ratio for each text element against its background
- Reports AA and AAA failures separately
- Reports large text separately (3:1 AA, 4.5:1 AAA thresholds)

Write `__tests__/ContrastAuditor.test.ts` — **minimum 10 tests**.

### 9.4 — DarkModeAuditor (`src/content/audit/DarkModeAuditor.ts`)

Detects elements that would break in dark mode:
- Hardcoded light colors (near-white backgrounds, near-black text) not using `prefers-color-scheme`
- Inverted contrast in dark mode
- Missing `color-scheme` declarations

### 9.5 — AuditReportBuilder (`src/content/audit/AuditReportBuilder.ts`)

Combines all auditors into a single `AuditReport`:

```ts
export class AuditReportBuilder {
  run(settings: UserSettings): AuditReport
}
```

Write `__tests__/AuditReportBuilder.test.ts` — **minimum 8 tests**.

### 9.6 — Message Handler for RUN_AUDIT

Update `content/index.ts` to listen for `RUN_AUDIT` message:
```ts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === MESSAGE_ACTIONS.RUN_AUDIT) {
    const report = new AuditReportBuilder().run(currentSettings);
    sendResponse(report);
    return true;
  }
});
```

---

## ✅ Phase 9 Deliverables Checklist

- [ ] `SpacingAuditor.ts` + 12 tests
- [ ] `AlignmentAuditor.ts` + 8 tests
- [ ] `ContrastAuditor.ts` + 10 tests
- [ ] `DarkModeAuditor.ts` functional
- [ ] `AuditReportBuilder.ts` + 8 tests
- [ ] `RUN_AUDIT` message handled in content script
- [ ] All tests pass

## 🛑 STOP — Phase 9 Complete
```
✅ Phase 9 complete — Full audit engine is built.
The audit is ready to be consumed by the DevTools panel in Phase 10.
Say "Start Phase 10" to continue.
```

---

---

# ══════════════════════════════════════════
# PHASE 10 — DevTools Panel
# ══════════════════════════════════════════

## 🎯 Goal
Build the Chrome DevTools panel — a full-featured secondary UI that shows element details, all export formats with syntax highlighting, edit history with undo, the full audit report, and an animation debugger.

---

## Tasks

### 10.1 — DevTools Registration

**`src/devtools/devtools.html`** — entry page that calls `chrome.devtools.panels.create()`

**`src/devtools/devtools.ts`**
```ts
chrome.devtools.panels.create(
  'PixelPerfect',
  'assets/icons/icon-16.png',
  'devtools/panel.html',
);
```

**`src/devtools/panel.html`** — HTML shell loading `main.tsx`

**`src/devtools/main.tsx`** — React root mount

### 10.2 — ElementDetailsView (`src/devtools/components/ElementDetailsView.tsx`)

When an element is selected in the browser (via content script click → `ELEMENT_SELECTED` message):
- Shows element tag, selector, and class list
- Visual box model diagram (SVG, like Chrome's native one but styled to match PixelPerfect)
- All computed styles filtered to meaningful values
- Each property shows: computed value + token name + Tailwind class (where found)

### 10.3 — ExportTabsView (`src/devtools/components/ExportTabsView.tsx`)

Tab bar with all 7 export formats:
- `CSS` | `SCSS` | `SASS` | `Tailwind` | `Styled` | `JS Object` | `CSS Vars`
- Each tab shows the exported code with syntax highlighting (use a lightweight highlighter — `highlight.js` or hand-rolled)
- Copy button per tab
- Selected element auto-populates all tabs

### 10.4 — EditHistoryPanel (`src/devtools/components/EditHistoryPanel.tsx`)

Displays `EditOperation[]` from content script:
- Chronological list: timestamp, selector, property, `old → new`
- Undo button per entry
- "Undo All" button
- "Export as CSS Patch" button → triggers `EXPORT_PATCH` message → copies result

### 10.5 — AuditReportView (`src/devtools/components/AuditReportView.tsx`)

Displays `AuditReport` from content script:
- Summary bar: `3 errors · 5 warnings · 2 info`
- Grouped by issue type
- Each issue: severity icon, selector, description, suggested fix
- "Run Audit" button triggers `RUN_AUDIT` message
- Filter by severity

Audit report display:
```
Spacing Audit Report — github.com  [Run Audit]
──────────────────────────────────────────────
⚠ Off-grid values (3)
  div.hero      margin-top: 13px   → nearest: 16px
  span.label    padding: 7px       → nearest: 8px
  .nav-item     gap: 5px           → nearest: 4px or 8px

⚠ Magic numbers (2)
  section.about  gap: 37px         → appears 1x only

✅ Consistent sibling spacing

⚠ Near-miss alignment (1)
  .card-title and .card-body        → off by 2px on left edge
```

### 10.6 — AnimationDebugger (`src/devtools/components/AnimationDebugger.tsx`)

Shows all currently active CSS transitions and animations on the page:
- List of animating elements with their animation/transition properties
- Duration and easing values
- "Slow Motion" toggle — sets `document.body.style.animationDuration` to `10x` longer
- "Pause All" toggle — freezes all animations

### 10.7 — Panel Layout (`src/devtools/Panel.tsx`)

Four-tab layout:
```
[Element Details]  [Edit History]  [Audit Report]  [Animations]
─────────────────────────────────────────────────────────────────
<active tab content>
```

Panel styled consistently with popup (same color scheme, same font choices).

---

## ✅ Phase 10 Deliverables Checklist

- [ ] DevTools panel registers and opens in Chrome DevTools
- [ ] `ElementDetailsView.tsx` shows selected element with token-mapped styles
- [ ] `ExportTabsView.tsx` with all 7 formats + syntax highlighting
- [ ] `EditHistoryPanel.tsx` with undo per entry + Export as patch
- [ ] `AuditReportView.tsx` with grouped issues + "Run Audit" button
- [ ] `AnimationDebugger.tsx` with slow-motion toggle
- [ ] Panel styled consistently with popup
- [ ] All DevTools components wired to content script messages

## 🛑 STOP — Phase 10 Complete
```
✅ Phase 10 complete — DevTools panel is fully functional.
Open Chrome DevTools → find the PixelPerfect tab → click an element → run an audit.
Say "Start Phase 11" to continue.
```

---

---

# ═══════════════════════════════════════════════════════════
# PHASE 11 — Performance, Edge Cases & Error Hardening
# ═══════════════════════════════════════════════════════════

## 🎯 Goal
Harden every module for real-world use. Handle edge cases that would crash or degrade the experience on real websites.

---

## Tasks

### 11.1 — Performance Optimizations

Apply to every module that touches the DOM:

| Module | Optimization |
|---|---|
| `ElementPicker` | Throttle with `requestAnimationFrame` — cancel pending frame on new event |
| `OverlayRenderer` | Batch all SVG writes in single rAF — never multiple writes per frame |
| `BoxModelCalculator` | `WeakMap` cache — invalidate with `MutationObserver` |
| `TokenScanner` | Run in `setTimeout(fn, 0)` after page load — non-blocking |
| `SpacingAuditor` | Batch element scanning with `requestIdleCallback` |
| `ContrastOverlay` | Virtualize — only badge visible text elements (use `IntersectionObserver`) |

Verify content script bundle is under 50KB gzipped: `npm run build && gzip -c dist/content/index.js | wc -c`

### 11.2 — Edge Cases

Handle all of the following with graceful degradation:

- **Shadow DOM**: `element.getRootNode() instanceof ShadowRoot` — pierce shadow root for inspection where permitted
- **`position: fixed` elements**: `getBoundingClientRect()` already viewport-relative — no adjustment needed; document this clearly
- **Cross-origin iframes**: `getBoundingClientRect()` returns `{0,0,0,0}` — detect with `dom.utils.isCrossOriginIframe()` and show "cross-origin" badge
- **Elements removed mid-inspection**: `MutationObserver` detects removal → `renderer.clear()`
- **CSP blocking**: use `element.setAttribute('style', ...)` not injected `<style>` for live edits
- **Very small elements** (< 10px): tooltip minimum size 200px, always positioned to avoid overflow
- **RTL layouts**: flip distance line label positions when `document.dir === 'rtl'`
- **Zoomed pages**: account for `window.devicePixelRatio` in distance calculations

### 11.3 — Error Boundaries

- Wrap all content script logic in try/catch with `console.debug('[PixelPerfect] ...')` — never `console.error`
- `ErrorBoundary` React component wrapping `Popup.tsx` root
- `ErrorBoundary` React component wrapping `Panel.tsx` root
- Each exporter catches its own errors and returns `{ error: true, code: '/* export failed */' }`
- `TokenScanner` catches `document.styleSheets` access errors — returns empty `TokenMap`
- Storage utils return defaults on any read failure

### 11.4 — Accessibility (Extension UI)

- Every interactive popup element keyboard-accessible
- `aria-label` on all icon buttons
- Focus moves to first element when popup opens
- `aria-live` region for copy success and setting-save feedback
- All popup text meets WCAG AA contrast (4.5:1)
- Respect `prefers-reduced-motion` — disable overlay animations if set:
  ```ts
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ```

---

## ✅ Phase 11 Deliverables Checklist

- [ ] rAF throttling applied to all hot paths
- [ ] `WeakMap` cache with MutationObserver invalidation
- [ ] All 8 edge cases handled with graceful degradation
- [ ] `ErrorBoundary` in popup and panel
- [ ] All exporters have internal try/catch
- [ ] Accessibility requirements met in popup UI
- [ ] `prefers-reduced-motion` respected
- [ ] Content script bundle verified < 50KB gzipped
- [ ] Extension tested on: GitHub, Vercel, Tailwind docs, a Webflow site, a React app

## 🛑 STOP — Phase 11 Complete
```
✅ Phase 11 complete — Performance hardened and edge cases handled.
Test on 5 different real websites and verify zero console errors.
Say "Start Phase 12" to continue.
```

---

---

# ════════════════════════════════════════════════════════
# PHASE 12 — Final Test Suite, Build & Chrome Web Store Prep
# ════════════════════════════════════════════════════════

## 🎯 Goal
Achieve 82%+ test coverage. Complete production build. All assets and metadata ready for Chrome Web Store submission.

---

## Tasks

### 12.1 — Final Test Coverage

Run: `npm test -- --coverage`

Ensure these targets are met:

| Module | Target |
|---|---|
| `shared/utils/` | 95% |
| `content/inspector/` | 85% |
| `content/exporter/` | 92% |
| `content/tokens/` | 88% |
| `content/editor/` | 80% |
| `content/audit/` | 85% |
| `background/` | 88% |
| `popup/` | 78% |
| **Overall** | **≥ 82%** |

For any module below target: write additional tests to cover uncovered branches.

### 12.2 — Integration Tests

Write `src/content/__tests__/integration.test.ts`:
- Full init flow: settings load → token scan → picker enabled
- Message handling: `TOGGLE_INSPECTOR` enables/disables picker
- `UPDATE_SETTINGS` propagates grid unit change to overlay
- `RUN_AUDIT` returns valid `AuditReport` structure

### 12.3 — Documentation

**`README.md`** — complete with:
- Extension name, tagline, screenshot
- Installation instructions (from Web Store + from source)
- Full keyboard shortcuts table
- All export formats with example outputs
- How to import a `tokens.json`
- Privacy policy section (no data collected, all local)
- Contributing section

**`CHANGELOG.md`** — v1.0.0 entry listing all features shipped

**`ARCHITECTURE.md`** — link to the separate `ARCHITECTURE.md` file generated from the architecture prompt

### 12.4 — Chrome Web Store Assets

- `assets/screenshots/box-model-overlay.png` — 1280×800 showing box model in use
- `assets/screenshots/distance-measurement.png` — 1280×800 showing red lines
- `assets/screenshots/export-formats.png` — 1280×800 showing export tooltip
- Promotional tile description (440×280) — plain text summary for the store listing

### 12.5 — Production Build & Verification

```bash
npm run validate   # typecheck + lint + test — all must pass
npm run build      # production build to dist/
```

Verify:
- `dist/` contains: `manifest.json`, `popup/`, `content/`, `background/`, `devtools/`, `assets/`
- Manifest MV3 valid — no MV2 fields
- Content script bundle < 50KB gzipped
- Zero `console.error` on any tested page
- Extension works correctly on all of: Google, GitHub, Vercel, Tailwind CSS docs, a Webflow site

---

## ✅ Phase 12 Final Deliverables Checklist

- [ ] `npm run validate` passes with zero errors
- [ ] Test coverage ≥ 82% overall
- [ ] Integration tests passing
- [ ] `README.md` complete
- [ ] `CHANGELOG.md` v1.0.0 entry
- [ ] 3 screenshots at 1280×800
- [ ] Production build succeeds
- [ ] Content script < 50KB gzipped
- [ ] Tested on 5 real websites with zero console errors
- [ ] Ready for Chrome Web Store upload

## 🎉 PROJECT COMPLETE
```
🎉 PixelPerfect v1.0.0 — Build complete.

All 12 phases done:
  Phase 1  — Project scaffold, constants, types, utilities
  Phase 2  — Box model overlay + tooltip
  Phase 3  — Distance measurement (Figma red lines) + alignment guides
  Phase 4  — Design token scanning + reverse mapping
  Phase 5  — 7 export formats with one-click copy
  Phase 6  — Live CSS editor with undo + persistence
  Phase 7  — Full popup UI with all settings
  Phase 8  — Flexbox, Grid, Typography, Z-index inspectors
  Phase 9  — Spacing + Accessibility audit engine
  Phase 10 — DevTools panel with all views
  Phase 11 — Performance, edge cases, error hardening
  Phase 12 — Final tests, docs, production build

Upload dist/ to the Chrome Web Store. PixelPerfect is ready.
```