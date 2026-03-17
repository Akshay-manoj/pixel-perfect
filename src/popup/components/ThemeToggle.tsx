import React from 'react';
import type { OverlayTheme } from '@shared/types/overlay.types';

interface ThemeToggleProps {
  value: OverlayTheme;
  onChange: (theme: OverlayTheme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ value, onChange }) => {
  return (
    <div style={styles.container}>
      <button
        onClick={() => onChange('dark')}
        style={{
          ...styles.btn,
          backgroundColor: value === 'dark' ? '#6366F1' : '#313244',
          color: value === 'dark' ? '#FFFFFF' : '#A6ADC8',
        }}
      >
        <span style={{ ...styles.swatch, background: '#1E1E2E' }} />
        Dark
      </button>
      <button
        onClick={() => onChange('light')}
        style={{
          ...styles.btn,
          backgroundColor: value === 'light' ? '#6366F1' : '#313244',
          color: value === 'light' ? '#FFFFFF' : '#A6ADC8',
        }}
      >
        <span style={{ ...styles.swatch, background: '#FFFFFF' }} />
        Light
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    gap: 4,
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 4,
    border: '1px solid #45475A',
    cursor: 'pointer',
    fontSize: 11,
    transition: 'background-color 0.15s',
  },
  swatch: {
    display: 'inline-block',
    width: 12,
    height: 12,
    borderRadius: 3,
    border: '1px solid #6C7086',
  },
};
