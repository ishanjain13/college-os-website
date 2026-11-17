import React from 'react';

export function Skeleton({
  className = '',
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular'
  width,
  height,
  ...props
}) {
  const variantStyles = {
    text: 'h-3.5 w-full rounded-md',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded-xl w-full h-24',
  };

  const style = {
    width: width,
    height: height,
  };

  return (
    <div
      aria-hidden="true"
      style={style}
      className={`animate-shimmer bg-white/[0.06] border border-white/[0.04] select-none ${
        variantStyles[variant] || variantStyles.rectangular
      } ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 w-full ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-4 glass-panel border border-os-border space-y-3 ${className}`} aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-9 h-9" />
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="text" className="w-1/2 h-3" />
          <Skeleton variant="text" className="w-1/3 h-2.5" />
        </div>
      </div>
      <Skeleton variant="rectangular" className="h-16" />
    </div>
  );
}

Skeleton.Text = SkeletonText;
Skeleton.Card = SkeletonCard;

export default Skeleton;
