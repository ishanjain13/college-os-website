import React from 'react';

const variants = {
  default:
    'bg-white/10 text-os-text border-white/10',
  primary:
    'bg-os-accent/15 text-indigo-300 border-os-accent/30',
  success:
    'bg-os-success/15 text-emerald-300 border-os-success/30',
  warning:
    'bg-os-warning/15 text-amber-300 border-os-warning/30',
  error:
    'bg-os-error/15 text-rose-300 border-os-error/30',
  info:
    'bg-os-info/15 text-blue-300 border-os-info/30',
  outline:
    'bg-transparent text-os-text-muted border-os-border',
};

const dotColors = {
  default: 'bg-os-text-muted',
  primary: 'bg-indigo-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-rose-400',
  info: 'bg-blue-400',
  outline: 'bg-os-text-subtle',
};

const sizes = {
  xs: 'text-[10px] px-1.5 py-0.5 gap-1 rounded-md font-medium',
  sm: 'text-[11px] px-2 py-0.5 gap-1.5 rounded-lg font-medium',
  md: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg font-semibold',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  dotPulse = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.sm;
  const dotColor = dotColors[variant] || dotColors.default;

  return (
    <span
      className={`inline-flex items-center border font-mono select-none tracking-tight ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {dotPulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`} />
        </span>
      )}
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
