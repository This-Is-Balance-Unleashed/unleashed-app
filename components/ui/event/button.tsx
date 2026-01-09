import { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { Route } from 'next';

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: Route | string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ children, variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  const classes = clsx(
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
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href as Route} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
