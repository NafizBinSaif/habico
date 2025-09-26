import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  id?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, id, disabled = false }) => (
  <button
    id={id}
    onClick={() => !disabled && onChange(!enabled)}
    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-habico-blue dark:focus:ring-offset-dark-habico-card ${
      enabled ? 'bg-habico-blue' : 'bg-gray-300 dark:bg-gray-600'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    role="switch"
    aria-checked={enabled}
    disabled={disabled}
  >
    <span
      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);
