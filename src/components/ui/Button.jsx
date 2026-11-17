import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-os-accent text-white hover:bg-os-accent-hover shadow-sm hover:shadow-elevation-2 active:bg-os-accent-hover border border-white/10',
  secondary:
    'bg-white/10 text-os-text hover:bg-white/15 active:bg-white/20 border border-os-border hover:border-os-border-light shadow-sm',
  ghost:
    'bg-transparent text-os-text-muted hover:text-os-text hover:bg-white/5 active:bg-white/10 border border-transparent',
  outline:
    'bg-transparent text-os-text border border-os-border hover:border-os-border-light hover:bg-white/5 active:bg-white/10 shadow-sm',
  danger:
    'bg-os-error text-white hover:bg-red-600 active:bg-red-700 border border-white/10 shadow-sm',
  icon:
    'bg-transparent text-os-text-muted hover:text-os-text hover:bg-white/10 active:bg-white/15 p-2 rounded-xl border border-transparent hover:border-os-border',
};

const sizes = {
  xs: 'text-[11px] px-2.5 py-1 rounded-lg gap-1.5 font-medium',
  sm: 'text-xs px-3 py-1.5 rounded-xl gap-2 font-medium',
  md: 'text-sm px-4 py-2 rounded-xl gap-2 font-semibold',
  lg: 'text-base px-5 py-2.5 rounded-2xl gap-2.5 font-semibold',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'sm',
    className = '',
    disabled = false,
    isLoading = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    type = 'button',
    onClick,
    ...props
  },
  ref
) {
  const isIconOnly = variant === 'icon';
  const sizeClasses = isIconOnly ? '' : sizes[size] || sizes.sm;
  const variantClasses = variants[variant] || variants.primary;

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileTap={disabled || isLoading ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex items-center justify-center transition-all select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-bg ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 h-3.5 w-3.5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />}
          {children}
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </motion.button>
  );
});

export default Button;
