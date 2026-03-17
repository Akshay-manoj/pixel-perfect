import React, { useState } from 'react';
import { GRID_BASE_UNITS } from '@shared/constants/spacing.constants';

interface GridSettingsProps {
  value: number;
  onChange: (unit: number) => void;
}

export const GridSettings: React.FC<GridSettingsProps> = ({ value, onChange }) => {
  const [customValue, setCustomValue] = useState('');
  const isCustom = !(GRID_BASE_UNITS as readonly number[]).includes(value);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    const num = parseInt(val, 10);
    if (num > 0 && !isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div>
      <div style={styles.label}>GRID UNIT</div>
      <div style={styles.buttonGroup}>
        {GRID_BASE_UNITS.map((unit) => (
          <button
            key={unit}
            onClick={() => onChange(unit)}
            style={{
              ...styles.btn,
              backgroundColor: value === unit && !isCustom ? '#6366F1' : '#313244',
              color: value === unit && !isCustom ? '#FFFFFF' : '#A6ADC8',
            }}
          >
            {unit}pt
          </button>
        ))}
        <button
          onClick={() => {
            setCustomValue(String(value));
          }}
          style={{
            ...styles.btn,
            backgroundColor: isCustom ? '#6366F1' : '#313244',
            color: isCustom ? '#FFFFFF' : '#A6ADC8',
          }}
        >
          Custom
        </button>
      </div>
      {isCustom && (
        <input
          type="number"
          min="1"
          value={customValue || String(value)}
          onChange={handleCustomChange}
          placeholder="px"
          style={styles.customInput}
          aria-label="Custom grid unit"
        />
      )}
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
  buttonGroup: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  },
  btn: {
    padding: '4px 10px',
    borderRadius: 4,
    border: '1px solid #45475A',
    cursor: 'pointer',
    fontSize: 11,
    fontFamily: 'monospace',
    transition: 'background-color 0.15s',
  },
  customInput: {
    marginTop: 6,
    width: '100%',
    padding: '4px 8px',
    borderRadius: 4,
    border: '1px solid #45475A',
    background: '#313244',
    color: '#CDD6F4',
    fontSize: 12,
    fontFamily: 'monospace',
    boxSizing: 'border-box' as const,
  },
};
