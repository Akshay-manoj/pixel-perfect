import type { EditOperation, CSSOverride } from '@shared/types/editor.types';

type EditCallback = (op: EditOperation) => void;

/** Attaches drag handles to element edges for resizing */
export class DragResizer {
  private handles: HTMLDivElement[] = [];
  private currentElement: Element | null = null;
  private editCallbacks: EditCallback[] = [];

  /** Register an edit callback */
  onEdit(callback: EditCallback): this {
    this.editCallbacks.push(callback);
    return this;
  }

  /** Attach drag handles around an element */
  attach(element: Element): void {
    this.detach();
    this.currentElement = element;
    const rect = element.getBoundingClientRect();

    const edges: Array<{ side: 'top' | 'bottom' | 'left' | 'right'; cursor: string }> = [
      { side: 'top', cursor: 'ns-resize' },
      { side: 'bottom', cursor: 'ns-resize' },
      { side: 'left', cursor: 'ew-resize' },
      { side: 'right', cursor: 'ew-resize' },
    ];

    for (const { side, cursor } of edges) {
      const handle = this.createHandle(rect, side, cursor);
      document.body.appendChild(handle);
      this.handles.push(handle);
      this.attachDragBehavior(handle, element, side);
    }
  }

  /** Remove all drag handles */
  detach(): void {
    for (const handle of this.handles) {
      handle.remove();
    }
    this.handles = [];
    this.currentElement = null;
  }

  private createHandle(rect: DOMRect, side: string, cursor: string): HTMLDivElement {
    const handle = document.createElement('div');
    handle.setAttribute('data-pixelperfect', 'drag-handle');
    handle.style.position = 'fixed';
    handle.style.zIndex = '2147483647';
    handle.style.cursor = cursor;

    const SIZE = 6;

    switch (side) {
      case 'top':
        handle.style.left = `${rect.left}px`;
        handle.style.top = `${rect.top - SIZE / 2}px`;
        handle.style.width = `${rect.width}px`;
        handle.style.height = `${SIZE}px`;
        break;
      case 'bottom':
        handle.style.left = `${rect.left}px`;
        handle.style.top = `${rect.bottom - SIZE / 2}px`;
        handle.style.width = `${rect.width}px`;
        handle.style.height = `${SIZE}px`;
        break;
      case 'left':
        handle.style.left = `${rect.left - SIZE / 2}px`;
        handle.style.top = `${rect.top}px`;
        handle.style.width = `${SIZE}px`;
        handle.style.height = `${rect.height}px`;
        break;
      case 'right':
        handle.style.left = `${rect.right - SIZE / 2}px`;
        handle.style.top = `${rect.top}px`;
        handle.style.width = `${SIZE}px`;
        handle.style.height = `${rect.height}px`;
        break;
    }

    return handle;
  }

  private attachDragBehavior(handle: HTMLDivElement, element: Element, side: string): void {
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      const rect = element.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const htmlEl = element as HTMLElement;

      if (side === 'right') {
        htmlEl.style.width = `${startWidth + dx}px`;
      } else if (side === 'left') {
        htmlEl.style.width = `${startWidth - dx}px`;
      } else if (side === 'bottom') {
        htmlEl.style.height = `${startHeight + dy}px`;
      } else if (side === 'top') {
        htmlEl.style.height = `${startHeight - dy}px`;
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const htmlEl = element as HTMLElement;
      const prop = (side === 'left' || side === 'right') ? 'width' : 'height';
      const newValue = htmlEl.style.getPropertyValue(prop);
      const originalValue = (side === 'left' || side === 'right') ? `${startWidth}px` : `${startHeight}px`;

      const selector = this.getSelector(element);
      const override: CSSOverride = {
        id: `${selector}::${prop}`,
        selector,
        property: prop,
        originalValue,
        newValue,
        timestamp: Date.now(),
        enabled: true,
        domain: window.location.hostname,
      };

      for (const cb of this.editCallbacks) {
        cb({ type: 'set', override });
      }
    };

    handle.addEventListener('mousedown', onMouseDown);
  }

  private getSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    return element.tagName.toLowerCase();
  }
}
