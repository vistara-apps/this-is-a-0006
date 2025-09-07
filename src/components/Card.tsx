import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
  className?: string;
}

export function Card({ children, variant = 'default', className }: CardProps) {
  const baseClasses = 'bg-surface rounded-lg p-6';
  
  const variantClasses = {
    default: 'shadow-card',
    elevated: 'shadow-lg',
  };

  return (
    <div className={clsx(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}