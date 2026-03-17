import type { EditOperation, CSSOverride } from '@shared/types/editor.types';
import type { EditHistory } from './EditHistory';

/** Handles arrow key nudging of margin values on the selected element */
export class NudgeController {
  private element: Element | null = null;
  private selector: string = '';
  private gridBaseUnit: number = 8;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private enabled = false;

  constructor(private history: EditHistory) {
    this.boundKeyDown = this.handleKeyDown.bind(this);
  }

  /** Set the active element for nudging */
  setElement(element: Element, selector: string): void {
    this.element = element;
    this.selector = selector;
  }

  /** Update the grid base unit for Shift+Arrow nudging */
  setGridBaseUnit(unit: number): void {
    this.gridBaseUnit = unit;
  }

  /** Enable keyboard listening */
  enable(): void {
    if (this.enabled) return;
    this.enabled = true;
    document.addEventListener('keydown', this.boundKeyDown, true);
  }

  /** Disable keyboard listening */
  disable(): void {
    if (!this.enabled) return;
    this.enabled = false;
    document.removeEventListener('keydown', this.boundKeyDown, true);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.element) return;

    const arrowMap: Record<string, string> = {
      ArrowUp: 'margin-top',
      ArrowDown: 'margin-bottom',
      ArrowLeft: 'margin-left',
      ArrowRight: 'margin-right',
    };

    const prop = arrowMap[e.key];
    if (!prop) return;

    e.preventDefault();
    e.stopPropagation();

    const delta = e.shiftKey ? this.gridBaseUnit : 1;
    const direction = (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 1;
    const htmlEl = this.element as HTMLElement;
    const computed = window.getComputedStyle(htmlEl);
    const currentValue = parseFloat(computed.getPropertyValue(prop)) || 0;
    const newValue = currentValue + delta * direction;

    const originalValue = `${currentValue}px`;
    const newValueStr = `${newValue}px`;

    htmlEl.style.setProperty(prop, newValueStr);

    const override: CSSOverride = {
      id: `${this.selector}::${prop}`,
      selector: this.selector,
      property: prop,
      originalValue,
      newValue: newValueStr,
      timestamp: Date.now(),
      enabled: true,
      domain: window.location.hostname,
    };

    const operation: EditOperation = { type: 'set', override };
    this.history.record(operation);
  }
}
