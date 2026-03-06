'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {

    const variantClasses = {
      primary: 'bg-primary-50 text-primary-950 border-primary-200 dark:bg-primary-900/40 dark:text-primary-100 dark:border-primary-800',
      secondary: 'bg-secondary-50 text-secondary-950 border-secondary-200 dark:bg-secondary-900/40 dark:text-secondary-100 dark:border-secondary-800',
      accent: 'bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-950/40 dark:text-accent-400 dark:border-accent-900',
      success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
      outline: 'bg-transparent text-gray-600 border-gray-200 dark:text-gray-400 dark:border-primary-900',
    }[variant] || 'bg-primary-50 text-primary-950 border-primary-200';

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase',
      md: 'px-3 py-1 text-xs font-bold tracking-widest uppercase',
      lg: 'px-4 py-1.5 text-sm font-bold tracking-wide',
    }[size] || 'px-3 py-1 text-xs font-bold tracking-widest uppercase';

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
