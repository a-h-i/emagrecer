import React from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
  children: React.ReactNode;
}

export default function Button({ variant, children, className: specifiedClasses, ...props }: ButtonProps) {

  const commonClasses = 'rounded-xl px-4 py-3 text-sm font-medium hover:opacity-90 cursor-pointer';


  return <button {...props}

  className={clsx(commonClasses, {
    'bg-neutral-900 text-white': variant === 'primary',
  }, specifiedClasses)}
  >
    {children}
  </button>;

}