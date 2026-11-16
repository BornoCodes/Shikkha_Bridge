import React from 'react';

type CardVariant = 'default' | 'elevated' | 'bordered';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white/80 border border-parchment shadow-sm',
  elevated:
    'bg-white/90 shadow-lg shadow-terracotta/5 border border-white/60',
  bordered:
    'bg-white/80 border-2 border-parchment relative nakshi-border',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

function Card({
  variant = 'default',
  className = '',
  children,
  padding = 'md',
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        rounded-xl transition-all duration-300
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hoverable ? 'hover:shadow-lg hover:shadow-terracotta/10 hover:-translate-y-1 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = '', children }: CardHeaderProps) {
  return (
    <div className={`pb-4 border-b border-parchment ${className}`}>
      {children}
    </div>
  );
}

function CardBody({ className = '', children }: CardBodyProps) {
  return <div className={`py-4 ${className}`}>{children}</div>;
}

function CardFooter({ className = '', children }: CardFooterProps) {
  return (
    <div className={`pt-4 border-t border-parchment ${className}`}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
