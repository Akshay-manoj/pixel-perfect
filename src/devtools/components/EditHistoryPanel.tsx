import React from 'react';
import type { EditOperation } from '@shared/types/editor.types';

interface EditHistoryPanelProps {
  operations: EditOperation[];
  onUndo: (id: string) => void;
  onUndoAll: () => void;
  onExportPatch: () => void;
}

export const EditHistoryPanel: React.FC<EditHistoryPanelProps> = ({
  operations, onUndo, onUndoAll, onExportPatch,
}) => {
  if (operations.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No edits yet. Click an element and modify CSS values.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Actions */}
      <div style={styles.actions}>
        <button onClick={onUndoAll} style={styles.actionBtn}>Undo All</button>
        <button onClick={onExportPatch} style={styles.actionBtnAccent}>Export as CSS Patch</button>
      </div>

      {/* History list */}
      <div style={styles.list}>
        {[...operations].reverse().map((op, i) => (
          <div key={i} style={styles.entry}>
            <div style={styles.entryHeader}>
              <span style={styles.selector}>{op.override.selector}</span>
              <span style={styles.timestamp}>
                {new Date(op.override.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div style={styles.entryBody}>
              <span style={styles.prop}>{op.override.property}: </span>
              <span style={styles.oldVal}>{op.override.originalValue}</span>
              <span style={styles.arrow}> → </span>
              <span style={styles.newVal}>{op.override.newValue}</span>
            </div>
            <button
              onClick={() => onUndo(op.override.id)}
              style={styles.undoBtn}
            >
              Undo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  empty: { padding: 32, textAlign: 'center' },
  emptyText: { color: '#6C7086', fontSize: 13, margin: 0 },
  actions: { display: 'flex', gap: 8, marginBottom: 12 },
  actionBtn: {
    background: '#313244', border: '1px solid #45475A', color: '#CDD6F4',
    fontSize: 11, padding: '5px 12px', borderRadius: 4, cursor: 'pointer',
  },
  actionBtnAccent: {
    background: '#6366F1', border: 'none', color: '#FFFFFF',
    fontSize: 11, padding: '5px 12px', borderRadius: 4, cursor: 'pointer',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 6 },
  entry: {
    background: '#181825', border: '1px solid #313244', borderRadius: 6,
    padding: '8px 12px', position: 'relative',
  },
  entryHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
  selector: { color: '#89B4FA', fontSize: 11, fontFamily: 'monospace' },
  timestamp: { color: '#6C7086', fontSize: 10 },
  entryBody: { fontSize: 11, fontFamily: 'monospace' },
  prop: { color: '#6C7086' },
  oldVal: { color: '#F38BA8', textDecoration: 'line-through' },
  arrow: { color: '#6C7086' },
  newVal: { color: '#A6E3A1' },
  undoBtn: {
    position: 'absolute', top: 8, right: 8,
    background: 'none', border: '1px solid #45475A', color: '#FAB387',
    fontSize: 10, padding: '2px 8px', borderRadius: 3, cursor: 'pointer',
  },
};
