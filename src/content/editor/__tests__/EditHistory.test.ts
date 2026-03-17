import { EditHistory } from '../EditHistory';
import type { EditOperation, CSSOverride } from '@shared/types/editor.types';

function makeOverride(id: string, prop: string = 'margin-top', newVal: string = '20px'): CSSOverride {
  return {
    id,
    selector: '.card',
    property: prop,
    originalValue: '16px',
    newValue: newVal,
    timestamp: Date.now(),
    enabled: true,
    domain: 'example.com',
  };
}

function makeOp(id: string, prop?: string, newVal?: string): EditOperation {
  return { type: 'set', override: makeOverride(id, prop, newVal) };
}

describe('EditHistory', () => {
  let history: EditHistory;

  beforeEach(() => {
    history = new EditHistory();
  });

  it('should record an operation', () => {
    history.record(makeOp('1'));
    expect(history.getAll().length).toBe(1);
  });

  it('should return all operations in order', () => {
    history.record(makeOp('1'));
    history.record(makeOp('2'));
    history.record(makeOp('3'));
    const all = history.getAll();
    expect(all.length).toBe(3);
    expect(all[0].override.id).toBe('1');
    expect(all[2].override.id).toBe('3');
  });

  it('should undo a specific edit by id', () => {
    history.record(makeOp('1'));
    history.record(makeOp('2'));
    const result = history.undo('1');
    expect(result).not.toBeNull();
    expect(result?.type).toBe('reset');
    expect(history.getAll().length).toBe(1);
  });

  it('should return null when undoing a nonexistent id', () => {
    history.record(makeOp('1'));
    expect(history.undo('999')).toBeNull();
  });

  it('should undo the last operation', () => {
    history.record(makeOp('1'));
    history.record(makeOp('2'));
    const result = history.undoLast();
    expect(result).not.toBeNull();
    expect(result?.previousOverride?.id).toBe('2');
    expect(history.getAll().length).toBe(1);
  });

  it('should return null from undoLast when empty', () => {
    expect(history.undoLast()).toBeNull();
  });

  it('should clear all history', () => {
    history.record(makeOp('1'));
    history.record(makeOp('2'));
    history.clear();
    expect(history.getAll().length).toBe(0);
  });

  it('should cap at 500 entries', () => {
    for (let i = 0; i < 510; i++) {
      history.record(makeOp(`${i}`));
    }
    expect(history.getAll().length).toBe(500);
  });

  it('should prune oldest entries when exceeding cap', () => {
    for (let i = 0; i < 510; i++) {
      history.record(makeOp(`${i}`));
    }
    const all = history.getAll();
    expect(all[0].override.id).toBe('10');
  });

  it('should serialize to JSON', () => {
    history.record(makeOp('1'));
    const json = history.toJSON();
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('should restore from JSON', () => {
    history.record(makeOp('1'));
    history.record(makeOp('2'));
    const json = history.toJSON();

    const restored = new EditHistory();
    restored.fromJSON(json);
    expect(restored.getAll().length).toBe(2);
  });

  it('should handle invalid JSON gracefully', () => {
    history.fromJSON('not valid json{');
    expect(history.getAll().length).toBe(0);
  });
});
