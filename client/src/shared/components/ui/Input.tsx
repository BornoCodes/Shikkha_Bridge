import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`${fullWidth ? 'w-full' : 'inline-flex flex-col'}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-matti/80 mb-1.5"
          >
            {label}
            {props.required && (
              <span className="text-terracotta ml-0.5">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-matti/40 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border bg-white/70 px-4 py-2.5
              text-matti placeholder:text-matti/30
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:bg-white
              ${
                error
                  ? 'border-red-400 focus:ring-red-300/40 focus:border-red-400'
                  : 'border-parchment focus:ring-terracotta/30 focus:border-terracotta'
              }
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />

          {rightIcon && !error && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-matti/40">
              {rightIcon}
            </span>
          )}

          {error && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
              <AlertCircle size={18} />
            </span>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-xs text-matti/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
