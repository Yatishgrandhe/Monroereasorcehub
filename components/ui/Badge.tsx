'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {

    const variantClasses = {
      primary: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
      secondary: 'bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 border-secondary-500/20',
      success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
      error: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      outline: 'bg-transparent text-secondary-600 dark:text-secondary-400 border-secondary-200 dark:border-secondary-800',
      glass: 'glass border-white/20 dark:border-white/5 text-secondary-800 dark:text-white shadow-premium',
    }[variant];

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
      md: 'px-3 py-1 text-xs font-bold tracking-wider uppercase',
      lg: 'px-4 py-1.5 text-sm font-bold tracking-wide',
    }[size];

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border transition-all duration-300',
          variantClasses,
          sizeClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
