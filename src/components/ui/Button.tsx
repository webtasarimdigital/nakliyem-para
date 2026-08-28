'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'navy' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs sm:text-sm px-3.5 py-2 gap-1.5 min-h-[38px]',
    md: 'text-sm sm:text-base px-5 py-2.5 gap-2 min-h-[46px]',
    lg: 'text-base sm:text-lg px-7 py-3.5 gap-2.5 min-h-[54px]'
  };

  const variantStyles = {
    primary: 'bg-[#F95700] text-white hover:bg-[#E04D00] focus:ring-[#F95700] shadow-md shadow-orange-950/10 hover:shadow-lg hover:shadow-orange-950/20',
    secondary: 'bg-[#FFF4ED] text-[#C23E00] hover:bg-[#FFE8D6] focus:ring-[#F95700] border border-[#FFD8BE]',
    navy: 'bg-[#0A1128] text-white hover:bg-[#132247] focus:ring-[#0A1128] shadow-md',
    outline: 'border-2 border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50 focus:ring-[#F95700]',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444] shadow-sm',
    gold: 'bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white hover:opacity-95 shadow-md focus:ring-[#F59E0B]'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
