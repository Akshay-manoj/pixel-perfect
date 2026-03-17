import type { ElementInfo } from '@shared/types/element.types';
import type { DiffResult } from '@shared/types/editor.types';
import { filterMeaningfulProperties } from '../exporter/base.exporter';

/** Compares current element styles against saved snapshots */
export class DiffEngine {
  private snapshots: WeakMap<Element, Record<string, string>> = new WeakMap();

  /** Save a snapshot of the element's current computed styles */
  saveSnapshot(element: Element, info: ElementInfo): void {
    const props = filterMeaningfulProperties(info.computedStyles, info.tagName);
    this.snapshots.set(element, { ...props });
  }

  /** Compare current styles to the saved snapshot */
  diff(element: Element, info: ElementInfo): DiffResult[] {
    const snapshot = this.snapshots.get(element);
    if (!snapshot) return [];

    const current = filterMeaningfulProperties(info.computedStyles, info.tagName);
    const results: DiffResult[] = [];
    const allProps = new Set([...Object.keys(snapshot), ...Object.keys(current)]);

    for (const prop of allProps) {
      const before = snapshot[prop] ?? '';
      const after = current[prop] ?? '';

      if (before === after) continue;

      results.push({
        selector: info.selector,
        property: prop,
        beforeValue: before,
        afterValue: after,
        isAddition: !before && !!after,
        isDeletion: !!before && !after,
      });
    }

    return results;
  }

  /** Remove a snapshot for an element */
  clearSnapshot(element: Element): void {
    this.snapshots.delete(element);
  }
}
