import { isPixelPerfectElement } from '@shared/utils/dom.utils';

type ElementCallback = (el: Element) => void;
type VoidCallback = () => void;

/** Tracks mouse position and identifies hovered/selected/pinned elements */
export class ElementPicker {
  private hoveredElement: Element | null = null;
  private pinnedElement: Element | null = null;
  private isEnabled = false;
  private isAltPressed = false;
  private pendingFrame: number | null = null;

  private hoverCallbacks: ElementCallback[] = [];
  private leaveCallbacks: VoidCallback[] = [];
  private clickCallbacks: ElementCallback[] = [];
  private pinCallbacks: ElementCallback[] = [];
  private measureCallbacks: Array<(a: Element, b: Element) => void> = [];

  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseOver: (e: MouseEvent) => void;
  private boundMouseOut: (e: MouseEvent) => void;
  private boundClick: (e: MouseEvent) => void;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseOver = this.handleMouseOver.bind(this);
    this.boundMouseOut = this.handleMouseOut.bind(this);
    this.boundClick = this.handleClick.bind(this);
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
  }

  /** Start listening for mouse events on the document */
  enable(): void {
    if (this.isEnabled) return;
    this.isEnabled = true;
    document.addEventListener('mousemove', this.boundMouseMove, true);
    document.addEventListener('mouseover', this.boundMouseOver, true);
    document.addEventListener('mouseout', this.boundMouseOut, true);
    document.addEventListener('click', this.boundClick, true);
    document.addEventListener('keydown', this.boundKeyDown, true);
    document.addEventListener('keyup', this.boundKeyUp, true);
  }

  /** Stop listening and clear state */
  disable(): void {
    if (!this.isEnabled) return;
    this.isEnabled = false;
    document.removeEventListener('mousemove', this.boundMouseMove, true);
    document.removeEventListener('mouseover', this.boundMouseOver, true);
    document.removeEventListener('mouseout', this.boundMouseOut, true);
    document.removeEventListener('click', this.boundClick, true);
    document.removeEventListener('keydown', this.boundKeyDown, true);
    document.removeEventListener('keyup', this.boundKeyUp, true);
    this.hoveredElement = null;
    this.isAltPressed = false;
    if (this.pendingFrame !== null) {
      cancelAnimationFrame(this.pendingFrame);
      this.pendingFrame = null;
    }
  }

  /** Get the currently hovered element */
  getHoveredElement(): Element | null {
    return this.hoveredElement;
  }

  /** Get the pinned reference element */
  getPinnedElement(): Element | null {
    return this.pinnedElement;
  }

  /** Whether Alt key is currently held */
  getIsAltPressed(): boolean {
    return this.isAltPressed;
  }

  /** Register a hover callback */
  onHover(callback: ElementCallback): this {
    this.hoverCallbacks.push(callback);
    return this;
  }

  /** Register a leave callback */
  onLeave(callback: VoidCallback): this {
    this.leaveCallbacks.push(callback);
    return this;
  }

  /** Register a click callback */
  onClick(callback: ElementCallback): this {
    this.clickCallbacks.push(callback);
    return this;
  }

  /** Register a pin callback (Shift+Click) */
  onPin(callback: ElementCallback): this {
    this.pinCallbacks.push(callback);
    return this;
  }

  /** Register a measure callback (Alt+hover with pinned element) */
  onMeasure(callback: (a: Element, b: Element) => void): this {
    this.measureCallbacks.push(callback);
    return this;
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.pendingFrame !== null) {
      cancelAnimationFrame(this.pendingFrame);
    }
    this.pendingFrame = requestAnimationFrame(() => {
      this.pendingFrame = null;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target || isPixelPerfectElement(target)) return;
      if (target === this.hoveredElement) return;

      this.hoveredElement = target;

      if (this.isAltPressed && this.pinnedElement && this.pinnedElement !== target) {
        for (const cb of this.measureCallbacks) {
          cb(this.pinnedElement, target);
        }
      } else {
        for (const cb of this.hoverCallbacks) {
          cb(target);
        }
      }
    });
  }

  private handleMouseOver(e: MouseEvent): void {
    const target = e.target as Element | null;
    if (!target || isPixelPerfectElement(target)) return;
    // mouseover is handled by mousemove for rAF throttling
  }

  private handleMouseOut(e: MouseEvent): void {
    // Don't fire leave when mouse moves to a PixelPerfect element (tooltip, editor, etc.)
    const relatedTarget = e.relatedTarget as Element | null;
    if (relatedTarget && isPixelPerfectElement(relatedTarget)) return;

    this.hoveredElement = null;
    for (const cb of this.leaveCallbacks) {
      cb();
    }
  }

  private handleClick(e: MouseEvent): void {
    const target = e.target as Element | null;
    if (!target || isPixelPerfectElement(target)) return;

    if (e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      this.pinnedElement = target;
      for (const cb of this.pinCallbacks) {
        cb(target);
      }
    } else {
      for (const cb of this.clickCallbacks) {
        cb(target);
      }
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Alt') {
      this.isAltPressed = true;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.key === 'Alt') {
      this.isAltPressed = false;
    }
  }
}
