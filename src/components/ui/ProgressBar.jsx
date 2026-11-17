import React from 'react';
import { motion } from 'framer-motion';

const sizes = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'accent', // 'accent' | 'success' | 'warning' | 'error' | 'gradient'
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100))) || 0;

  const colorGradients = {
    accent: 'bg-gradient-to-r from-indigo-500 to-indigo-400',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    warning: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    error: 'bg-gradient-to-r from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  };

  const fillClass = colorGradients[color] || colorGradients.accent;

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-os-text-muted">{label}</span>}
          {showValue && (
            <span className="font-mono text-[11px] font-semibold text-os-text">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`w-full bg-black/40 rounded-full overflow-hidden border border-os-border-subtle ${
          sizes[size] || sizes.md
        }`}
      >
        <motion.div
          className={`h-full rounded-full ${fillClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
