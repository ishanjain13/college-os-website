import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedCheckmark({
  size = 20,
  checked = true,
  color = '#10b981',
  className = '',
}) {
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="2"
          fill={checked ? color : 'transparent'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
        {checked && (
          <motion.path
            d="M7 12.5L10.5 16L17 8.5"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.28, ease: 'easeOut', delay: 0.08 }}
          />
        )}
      </svg>
    </div>
  );
}

export default AnimatedCheckmark;
