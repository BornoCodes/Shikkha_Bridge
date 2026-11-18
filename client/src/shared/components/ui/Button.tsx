import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-terracotta text-white hover:bg-terracotta/90 shadow-md shadow-terracotta/20 hover:shadow-lg hover:shadow-terracotta/30',
  secondary:
    'bg-turmeric text-matti hover:bg-turmeric/90 shadow-md shadow-turmeric/20 hover:shadow-lg hover:shadow-turmeric/30',
  outline:
    'border-2 border-terracotta text-terracotta bg-transparent hover:bg-terracotta/5',
  ghost:
    'text-matti bg-transparent hover:bg-parchment',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-7 py-3.5 text-base gap-2.5 rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        disabled={disabled || isLoading}
        className={`
          relative inline-flex items-center justify-center font-medium
          transition-colors duration-200 focus:outline-none focus:ring-2
          focus:ring-terracotta/40 focus:ring-offset-2 focus:ring-offset-cream
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          group
          ${className}
        `}
        {...props}
      >
        {/* Nakshi hover border effect */}
        <span
          className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 3px,
              rgba(232,163,23,0.3) 3px,
              rgba(232,163,23,0.3) 4px
            )`,
            backgroundSize: '8px 1px',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'repeat-x',
            maskImage:
              'linear-gradient(to bottom, transparent 85%, black 85%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 85%, black 85%)',
          }}
        />

        {isLoading && (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} />
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
export type { ButtonProps };
export default Button;
