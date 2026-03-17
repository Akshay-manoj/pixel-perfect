import React from 'react';

interface OverlaySettingsProps {
  showBoxModel: boolean;
  showDistanceLines: boolean;
  showAlignmentGuides: boolean;
  showTypographyInfo: boolean;
  onChange: (key: string, value: boolean) => void;
}

export const OverlaySettings: React.FC<OverlaySettingsProps> = ({
  showBoxModel, showDistanceLines, showAlignmentGuides, showTypographyInfo, onChange,
}) => {
  const toggles = [
    { key: 'showBoxModel', label: 'Box Model', value: showBoxModel },
    { key: 'showDistanceLines', label: 'Distance Lines', value: showDistanceLines },
    { key: 'showAlignmentGuides', label: 'Alignment Guides', value: showAlignmentGuides },
    { key: 'showTypographyInfo', label: 'Typography Info', value: showTypographyInfo },
  ];

  return (
    <div>
      <div style={styles.label}>OVERLAY</div>
      {toggles.map(({ key, label, value }) => (
        <label key={key} style={styles.row}>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(key, e.target.checked)}
            style={styles.checkbox}
          />
          <span style={styles.text}>{label}</span>
        </label>
      ))}
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
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '3px 0',
    cursor: 'pointer',
    fontSize: 12,
    color: '#CDD6F4',
  },
  checkbox: {
    accentColor: '#6366F1',
  },
  text: {
    fontSize: 12,
  },
};
