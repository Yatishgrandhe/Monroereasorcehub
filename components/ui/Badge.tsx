// badge component - old code
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/* badge props interface */
export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

// badge component - needs review
const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'badge',
          {
            'badge-primary': variant === 'primary',
            'badge-secondary': variant === 'secondary',
            'badge-success': variant === 'success',
            'badge-warning': variant === 'warning',
            'badge-error': variant === 'error',
            'bg-transparent text-secondary-700 border border-secondary-300': variant === 'outline',
            'px-1.5 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-0.5 text-xs': size === 'md',
            'px-3 py-1 text-sm': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
