'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'outline' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {

    const variantClasses = {
      primary: 'bg-primary-50 text-primary-950 border-primary-200',
      secondary: 'bg-gray-100 text-gray-900 border-gray-200',
      accent: 'bg-primary-950 text-white border-primary-950',
      success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      warning: 'bg-amber-50 text-amber-900 border-amber-200',
      outline: 'bg-transparent text-gray-500 border-gray-200',
    }[variant] || 'bg-primary-50 text-primary-950 border-primary-200';

    const sizeClasses = {
      sm: 'px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase',
      md: 'px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase',
      lg: 'px-5 py-2 text-[11px] font-black tracking-[0.3em] uppercase',
    }[size] || 'px-4 py-1.5 text-[10px] font-black tracking-[0.25em] uppercase';

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border transition-all duration-500 shadow-sm',
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
