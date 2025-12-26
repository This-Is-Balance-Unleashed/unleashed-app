import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 hover:scale-105 active:scale-95',
        {
          // Variants
          'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
          'bg-white text-black hover:bg-white-hover': variant === 'secondary',
          'border-2 border-primary text-primary hover:bg-primary hover:text-white':
            variant === 'outline',

          // Sizes
          'px-6 py-2 text-sm': size === 'sm',
          'px-8 py-3 text-base': size === 'md',
          'px-10 py-4 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
