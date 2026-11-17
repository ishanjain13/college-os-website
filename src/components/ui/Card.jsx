import React, { forwardRef } from 'react';

export const Card = forwardRef(function Card(
  {
    children,
    className = '',
    variant = 'default', // 'default' | 'interactive' | 'glass' | 'subtle'
    onClick,
    ...props
  },
  ref
) {
  const variantStyles = {
    default:
      'glass-panel shadow-elevation-1 border border-os-border',
    interactive:
      'glass-panel shadow-elevation-1 border border-os-border hover:border-os-border-light hover:-translate-y-0.5 hover:shadow-elevation-3 cursor-pointer transition-all duration-200 ease-out active:translate-y-0 active:shadow-elevation-1',
    glass:
      'bg-os-card backdrop-blur-xl border border-os-border shadow-elevation-2 rounded-2xl',
    subtle:
      'bg-white/[0.03] border border-os-border-subtle rounded-2xl shadow-none',
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`rounded-2xl p-5 ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`flex items-center justify-between gap-3 mb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-base font-bold text-os-text font-display tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-xs text-os-text-muted mt-0.5 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`flex items-center justify-between pt-3 mt-4 border-t border-os-border text-xs text-os-text-muted ${className}`} {...props}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
