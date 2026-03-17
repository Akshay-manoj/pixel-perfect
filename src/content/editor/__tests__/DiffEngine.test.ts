import { DiffEngine } from '../DiffEngine';
import type { ElementInfo } from '@shared/types/element.types';

function createMockInfo(styles: Record<string, string>): ElementInfo {
  return {
    element: document.createElement('div'),
    boxModel: {
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      border: { top: 0, right: 0, bottom: 0, left: 0 },
      content: { width: 100, height: 100 },
    },
    rect: { top: 0, left: 0, right: 100, bottom: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect,
    computedStyles: {
      getPropertyValue: (prop: string) => styles[prop] ?? '',
      length: 0,
    } as unknown as CSSStyleDeclaration,
    selector: '.card',
    tagName: 'div',
    classList: ['card'],
  };
}

describe('DiffEngine', () => {
  let engine: DiffEngine;
  let element: HTMLDivElement;

  beforeEach(() => {
    engine = new DiffEngine();
    element = document.createElement('div');
  });

  it('should return empty array if no snapshot exists', () => {
    const info = createMockInfo({ 'margin-top': '16px' });
    expect(engine.diff(element, info)).toEqual([]);
  });

  it('should return empty array when nothing changed', () => {
    const info = createMockInfo({ 'margin-top': '16px' });
    engine.saveSnapshot(element, info);
    expect(engine.diff(element, info)).toEqual([]);
  });

  it('should detect a changed property', () => {
    const before = createMockInfo({ 'margin-top': '16px' });
    engine.saveSnapshot(element, before);

    const after = createMockInfo({ 'margin-top': '24px' });
    const diffs = engine.diff(element, after);

    expect(diffs.length).toBe(1);
    expect(diffs[0].property).toBe('margin-top');
    expect(diffs[0].beforeValue).toBe('16px');
    expect(diffs[0].afterValue).toBe('24px');
  });

  it('should detect an added property', () => {
    const before = createMockInfo({});
    engine.saveSnapshot(element, before);

    const after = createMockInfo({ 'margin-top': '16px' });
    const diffs = engine.diff(element, after);

    const added = diffs.find((d) => d.property === 'margin-top');
    expect(added).toBeDefined();
    expect(added?.isAddition).toBe(true);
  });

  it('should detect a removed property', () => {
    const before = createMockInfo({ 'margin-top': '16px' });
    engine.saveSnapshot(element, before);

    const after = createMockInfo({});
    const diffs = engine.diff(element, after);

    const removed = diffs.find((d) => d.property === 'margin-top');
    expect(removed).toBeDefined();
    expect(removed?.isDeletion).toBe(true);
  });

  it('should detect multiple changes', () => {
    const before = createMockInfo({ 'margin-top': '16px', 'padding-top': '8px' });
    engine.saveSnapshot(element, before);

    const after = createMockInfo({ 'margin-top': '24px', 'padding-top': '12px' });
    const diffs = engine.diff(element, after);

    expect(diffs.length).toBe(2);
  });

  it('should clear a snapshot', () => {
    const info = createMockInfo({ 'margin-top': '16px' });
    engine.saveSnapshot(element, info);
    engine.clearSnapshot(element);

    const after = createMockInfo({ 'margin-top': '24px' });
    expect(engine.diff(element, after)).toEqual([]);
  });

  it('should include selector in diff results', () => {
    const before = createMockInfo({ 'margin-top': '16px' });
    engine.saveSnapshot(element, before);

    const after = createMockInfo({ 'margin-top': '24px' });
    const diffs = engine.diff(element, after);
    expect(diffs[0].selector).toBe('.card');
  });
});
