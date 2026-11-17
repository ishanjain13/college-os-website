import React, { forwardRef } from 'react';
import { X } from 'lucide-react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    clearable = false,
    onClear,
    value,
    disabled = false,
    className = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-os-text-muted select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center group">
        {LeftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-os-text-subtle group-focus-within:text-os-accent transition-colors">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          disabled={disabled}
          className={`w-full bg-black/40 border text-os-text placeholder:text-os-text-subtle text-xs rounded-xl px-3.5 py-2.5 transition-all duration-150 ease-out disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-none ${
            LeftIcon ? 'pl-9' : ''
          } ${RightIcon || (clearable && value) ? 'pr-9' : ''} ${
            error
              ? 'border-os-error/70 focus-visible:border-os-error focus-visible:ring-2 focus-visible:ring-os-error/25'
              : 'border-os-border hover:border-os-border-light focus-visible:border-os-accent focus-visible:ring-2 focus-visible:ring-os-accent-glow'
          } ${className}`}
          {...props}
        />

        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 rounded-md text-os-text-subtle hover:text-os-text hover:bg-white/10 transition-colors cursor-pointer"
            title="Clear input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {RightIcon && !(clearable && value) && (
          <div className="absolute right-3 flex items-center pointer-events-none text-os-text-subtle">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-os-error font-medium flex items-center gap-1">
          <span>●</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-os-text-subtle">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
