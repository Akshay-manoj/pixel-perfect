import React from 'react';
import { EXPORT_FORMAT_LABELS } from '@shared/constants/export.constants';
import type { ExportFormat } from '@shared/types/export.types';

interface ExportFormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

const FORMATS: ExportFormat[] = ['css', 'scss', 'sass', 'tailwind', 'css-in-js-template', 'css-in-js-object', 'css-variables'];

export const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = ({ value, onChange }) => {
  return (
    <div>
      <div style={styles.label}>EXPORT FORMAT</div>
      <div style={styles.segmented}>
        {FORMATS.map((format) => (
          <button
            key={format}
            onClick={() => onChange(format)}
            style={{
              ...styles.btn,
              backgroundColor: value === format ? '#6366F1' : 'transparent',
              color: value === format ? '#FFFFFF' : '#A6ADC8',
            }}
          >
            {EXPORT_FORMAT_LABELS[format]}
          </button>
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
  segmented: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
    background: '#313244',
    borderRadius: 6,
    padding: 2,
  },
  btn: {
    padding: '4px 8px',
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    fontSize: 10,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    transition: 'background-color 0.15s',
  },
};
