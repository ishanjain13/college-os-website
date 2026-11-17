import React from 'react';
import { motion } from 'framer-motion';

export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  id,
  className = '',
}) {
  const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <div className={`inline-flex items-center justify-between gap-3 select-none ${className}`}>
      {(label || description) && (
        <label
          htmlFor={toggleId}
          onClick={() => !disabled && onChange?.(!checked)}
          className={`flex flex-col cursor-pointer ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {label && (
            <span className="text-xs font-semibold text-os-text">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-os-text-muted mt-0.5">
              {description}
            </span>
          )}
        </label>
      )}

      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-bg disabled:cursor-not-allowed disabled:opacity-40 ${
          checked ? 'bg-os-accent' : 'bg-white/15 hover:bg-white/20'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-elevation-1 ring-0 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default Toggle;
