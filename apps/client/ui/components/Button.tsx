import React from 'react';
import clsx from 'clsx';

import NextLink from 'next/link';
import { Link as IntlLink } from '@/i18n/navigation';
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success'
  | 'link';

type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {}

export function Button({
  variant,
  children,
  size,
  fullWidth,
  loading,
  leadingIcon,
  trailingIcon,
  disabled,
  className: specifiedClasses,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-2 ' +
    'disabled:opacity-50c disabled:cursor-not-allowed cursor-pointer';

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50',
    ghost: 'text-neutral-900 hover:bg-neutral-100',
    destructive: 'bg-red-600 text-white hover:bg-red-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500',
    link: 'h-auto px-0 py-0 text-neutral-900 underline underline-offset-2 hover:opacity-80',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading}
      className={clsx(
        baseClasses,
        sizes[size || 'md'],
        variants[variant],
        {
          'w-full': fullWidth,
        },
        specifiedClasses,
      )}
    >
      {loading && variant !== 'link' && (
        <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' aria-hidden>
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
            fill='none'
          />
          <path
            className='opacity-75'
            d='M4 12a8 8 0 018-8'
            stroke='currentColor'
            strokeWidth='4'
            fill='none'
            strokeLinecap='round'
          />
        </svg>
      )}
      {leadingIcon && <span className='inline-flex'>{leadingIcon}</span>}
      <span className={clsx(loading && variant !== 'link' && 'opacity-0')}>
        {children}
      </span>
      {trailingIcon && <span className='inline-flex'>{trailingIcon}</span>}
    </button>
  );
}

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    BaseProps {
  prefetch?: boolean;
  localeAware?: boolean;
  href: string;
}

export function ButtonLink({
  href,
  prefetch,
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  leadingIcon,
  trailingIcon,
  className: specifiedClasses,
  children,
  localeAware = true,
  ...rest
}: ButtonLinkProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 cursor-pointer';
  const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    outline: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-50',
    ghost: 'text-neutral-900 hover:bg-neutral-100',
    destructive: 'bg-red-600 text-white hover:bg-red-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500',
    link: 'h-auto px-0 py-0 text-neutral-900 underline underline-offset-2 hover:opacity-80',
  };
  const LinkComponent = localeAware ? IntlLink : NextLink;
  return (
    <LinkComponent
      href={href}
      prefetch={prefetch}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        {
          'w-full': fullWidth,
        },
        specifiedClasses,
      )}
      {...rest}
    >
      {loading && variant !== 'link' && (
        <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24' aria-hidden>
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
            fill='none'
          />
          <path
            className='opacity-75'
            d='M4 12a8 8 0 018-8'
            stroke='currentColor'
            strokeWidth='4'
            fill='none'
            strokeLinecap='round'
          />
        </svg>
      )}
      {leadingIcon && <span className='inline-flex'>{leadingIcon}</span>}
      <span className={clsx(loading && variant !== 'link' && 'opacity-0')}>
        {children}
      </span>
      {trailingIcon && <span className='inline-flex'>{trailingIcon}</span>}
    </LinkComponent>
  );
}
