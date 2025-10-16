import { ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, asChild = false, children, disabled, href, ...props }, ref) => {
    const baseClasses = cn(
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-outline': variant === 'outline',
        'btn-ghost': variant === 'ghost',
        'btn-gradient': variant === 'gradient',
        'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500': variant === 'destructive',
        'btn-sm': size === 'sm',
        'btn-lg': size === 'lg',
      },
      className
    );

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
