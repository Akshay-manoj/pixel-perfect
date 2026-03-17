import React from 'react';

interface AccessibilitySettingsProps {
  showContrastRatios: boolean;
  showFocusOrder: boolean;
  showAriaRoles: boolean;
  onChange: (key: string, value: boolean) => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  showContrastRatios, showFocusOrder, showAriaRoles, onChange,
}) => {
  const toggles = [
    { key: 'showContrastRatios', label: 'Contrast Ratios', value: showContrastRatios },
    { key: 'showFocusOrder', label: 'Focus Order', value: showFocusOrder },
    { key: 'showAriaRoles', label: 'ARIA Roles', value: showAriaRoles },
  ];

  return (
    <div>
      <div style={styles.label}>ACCESSIBILITY</div>
      <div style={styles.row}>
        {toggles.map(({ key, label, value }) => (
          <label key={key} style={styles.toggle}>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(key, e.target.checked)}
              style={styles.checkbox}
            />
            <span>{label}</span>
          </label>
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
  row: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
    fontSize: 11,
    color: '#CDD6F4',
  },
  checkbox: {
    accentColor: '#6366F1',
  },
};
