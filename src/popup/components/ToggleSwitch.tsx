import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, disabled }) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      disabled={disabled}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        position: 'relative',
        transition: 'background-color 0.2s',
        padding: 0,
        backgroundColor: enabled ? '#22C55E' : '#4B5563',
        opacity: disabled ? 0.5 : 1,
      }}
      aria-label={enabled ? 'Disable' : 'Enable'}
      role="switch"
      aria-checked={enabled}
    >
      <span
        style={{
          display: 'block',
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: 2,
          left: 2,
          transition: 'transform 0.2s',
          transform: enabled ? 'translateX(20px)' : 'translateX(0)',
        }}
      />
    </button>
  );
};
