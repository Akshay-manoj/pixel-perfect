import React from 'react';
import { KEYBOARD_SHORTCUTS } from '@shared/constants/shortcuts.constants';

export const ShortcutDisplay: React.FC = () => {
  const shortcuts = Object.values(KEYBOARD_SHORTCUTS).map((sc) => {
    const keys: string[] = [];
    if ('ctrl' in sc && sc.ctrl) keys.push('Ctrl');
    if ('shift' in sc && sc.shift) keys.push('Shift');
    keys.push(sc.key);
    return { combo: keys.join('+'), description: sc.description };
  });

  return (
    <div>
      <div style={styles.label}>SHORTCUTS</div>
      <div style={styles.table}>
        {shortcuts.map((sc) => (
          <div key={sc.combo} style={styles.row}>
            <span style={styles.key}>{sc.combo}</span>
            <span style={styles.desc}>{sc.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: '#6C7086',
    letterSpacing: '0.05em',
    marginBottom: 6,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  key: {
    background: '#313244',
    border: '1px solid #45475A',
    borderRadius: 4,
    padding: '2px 6px',
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#CDD6F4',
    minWidth: 80,
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
  },
  desc: {
    fontSize: 11,
    color: '#A6ADC8',
  },
};
