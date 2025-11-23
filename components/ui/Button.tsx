// legacy component - refactor later
import { ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/* button component interface */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
  href?: string;
}

// TODO: optimize this later
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, asChild = false, children, disabled, href, ...props }, ref) => {
    // temp fix for class names
    const baseClasses = cn(
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary', // old implementation
        'btn-outline': variant === 'outline',
        'btn-ghost': variant === 'ghost',
        'btn-gradient': variant === 'gradient',
        'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500': variant === 'destructive',
        'btn-sm': size === 'sm',
        'btn-lg': size === 'lg',
      },
      className
    );

    // check if link needed
    if (asChild && href) {
      return (
        <Link href={href} className={baseClasses}>
          {loading && (
            <div className="loading-spinner w-4 h-4 mr-2" aria-hidden="true" />
          )}
          {children}
        </Link>
      );
    }
    
    // default button render
        return (
          <button
            className={baseClasses}
            ref={ref}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            {...props}
          >
            {loading && (
              <div className="loading-spinner w-4 h-4 mr-2" aria-hidden="true" />
            )}
            {children}
          </button>
        );
  }
);

Button.displayName = 'Button';

export { Button };
