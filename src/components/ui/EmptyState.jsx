import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col items-center justify-center text-center p-8 glass-panel border border-os-border/60 rounded-2xl max-w-sm mx-auto select-none my-6 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-os-accent/15 border border-os-accent/25 flex items-center justify-center text-os-accent mb-3.5 shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
      )}

      {title && (
        <h3 className="text-sm font-bold text-os-text font-display">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-xs text-os-text-muted mt-1 leading-relaxed max-w-xs">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="primary"
            onClick={onAction}
            leftIcon={actionIcon}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export default EmptyState;
