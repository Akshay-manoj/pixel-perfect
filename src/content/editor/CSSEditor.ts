import type { ElementInfo } from '@shared/types/element.types';
import type { EditOperation, CSSOverride } from '@shared/types/editor.types';
import { filterMeaningfulProperties } from '../exporter/base.exporter';

const EDITOR_ID = 'pixelperfect-editor-panel';

type EditCallback = (op: EditOperation) => void;

/** Inline CSS editor panel that opens on element click */
export class CSSEditor {
  private currentElement: Element | null = null;
  private currentInfo: ElementInfo | null = null;
  private panel: HTMLDivElement | null = null;
  private editCallbacks: EditCallback[] = [];
  private originalValues: Map<string, string> = new Map();

  /** Open the editor panel for an element */
  open(element: Element, info: ElementInfo): void {
    this.close();
    this.currentElement = element;
    this.currentInfo = info;
    this.originalValues.clear();

    const props = filterMeaningfulProperties(info.computedStyles, info.tagName);

    // Store original values
    for (const [prop, value] of Object.entries(props)) {
      this.originalValues.set(prop, value);
    }

    this.panel = this.buildPanel(props, info);
    document.body.appendChild(this.panel);
    this.positionPanel(info.rect);
  }

  /** Close the editor panel */
  close(): void {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
    this.currentElement = null;
    this.currentInfo = null;
    this.originalValues.clear();
  }

  /** Register an edit callback */
  onEdit(callback: EditCallback): this {
    this.editCallbacks.push(callback);
    return this;
  }

  /** Whether the editor is currently open */
  isOpen(): boolean {
    return this.panel !== null;
  }

  private buildPanel(props: Record<string, string>, info: ElementInfo): HTMLDivElement {
    const panel = document.createElement('div');
    panel.id = EDITOR_ID;
    panel.setAttribute('data-pixelperfect', 'editor');
    panel.style.cssText = `
      position: fixed; z-index: 2147483647;
      background: #1E1E2E; color: #CDD6F4; border: 1px solid #6C7086;
      border-radius: 8px; padding: 12px; font-family: monospace;
      font-size: 12px; min-width: 280px; max-height: 400px;
      overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      pointer-events: auto;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;';
    header.innerHTML = `<span style="color:#89B4FA;font-weight:700;">${info.tagName}${info.classList.length ? '.' + info.classList[0] : ''}</span>`;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '\u00d7';
    closeBtn.style.cssText = 'background:none;border:none;color:#CDD6F4;font-size:18px;cursor:pointer;padding:0 4px;';
    closeBtn.addEventListener('click', () => this.close());
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Property rows
    for (const [prop, value] of Object.entries(props)) {
      const row = this.createPropertyRow(prop, value, info);
      panel.appendChild(row);
    }

    // Separator
    const sep = document.createElement('div');
    sep.style.cssText = 'border-top:1px solid #45475A;margin:8px 0;';
    panel.appendChild(sep);

    // Export / copy buttons
    const btnContainer = document.createElement('div');
    btnContainer.setAttribute('data-pixelperfect', 'export-buttons');
    btnContainer.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;';

    const formats = [
      { format: 'css', label: 'CSS' },
      { format: 'scss', label: 'SCSS' },
      { format: 'tailwind', label: 'Tailwind' },
      { format: 'css-variables', label: 'Vars' },
    ];

    for (const { format, label } of formats) {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.setAttribute('data-pixelperfect-export', format);
      btn.setAttribute('data-pixelperfect-selector', info.selector);
      btn.setAttribute('data-pixelperfect', 'export-btn');
      btn.style.cssText = `
        background: none; border: 1px solid #6C7086; color: #89B4FA;
        font-size: 11px; font-family: monospace, sans-serif; padding: 4px 10px;
        border-radius: 4px; cursor: pointer; line-height: 16px;
      `;
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#313244';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'none';
      });
      btnContainer.appendChild(btn);
    }

    panel.appendChild(btnContainer);

    return panel;
  }

  private createPropertyRow(prop: string, value: string, info: ElementInfo): HTMLDivElement {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:4px;padding:2px 0;';

    const label = document.createElement('span');
    label.textContent = prop;
    label.style.cssText = 'color:#6C7086;min-width:140px;flex-shrink:0;';

    const input = document.createElement('input');
    input.value = value;
    input.style.cssText = `
      background: #313244; color: #CDD6F4; border: 1px solid #45475A;
      border-radius: 4px; padding: 2px 6px; font-family: monospace;
      font-size: 12px; flex: 1; min-width: 0;
    `;

    input.addEventListener('input', () => {
      this.applyValue(prop, input.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
        this.commitEdit(prop, input.value, info);
      } else if (e.key === 'Escape') {
        const original = this.originalValues.get(prop) ?? '';
        input.value = original;
        this.applyValue(prop, original);
      }
    });

    input.addEventListener('blur', () => {
      const original = this.originalValues.get(prop) ?? '';
      if (input.value !== original) {
        this.commitEdit(prop, input.value, info);
      }
    });

    row.appendChild(label);
    row.appendChild(input);
    return row;
  }

  private applyValue(prop: string, value: string): void {
    if (!this.currentElement) return;
    (this.currentElement as HTMLElement).style.setProperty(prop, value);
  }

  private commitEdit(prop: string, newValue: string, info: ElementInfo): void {
    const originalValue = this.originalValues.get(prop) ?? '';
    const override: CSSOverride = {
      id: `${info.selector}::${prop}`,
      selector: info.selector,
      property: prop,
      originalValue,
      newValue,
      timestamp: Date.now(),
      enabled: true,
      domain: window.location.hostname,
    };

    const operation: EditOperation = {
      type: 'set',
      override,
    };

    this.originalValues.set(prop, newValue);

    for (const cb of this.editCallbacks) {
      cb(operation);
    }
  }

  private positionPanel(rect: DOMRect): void {
    if (!this.panel) return;
    const OFFSET = 12;
    let left = rect.right + OFFSET;
    let top = rect.top;

    if (left + 300 > window.innerWidth) {
      left = rect.left - 300 - OFFSET;
    }
    if (left < 8) left = 8;
    if (top + 400 > window.innerHeight) {
      top = Math.max(8, window.innerHeight - 408);
    }

    this.panel.style.left = `${left}px`;
    this.panel.style.top = `${top}px`;
  }
}
