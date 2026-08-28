'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface RadioCardOption<T> {
  value: T;
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface RadioCardProps<T> {
  options: RadioCardOption<T>[];
  value: T;
  onChange: (val: T) => void;
  name?: string;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function RadioCard<T extends string | number>({
  options,
  value,
  onChange,
  columns = 2,
  className = ''
}: RadioCardProps<T>) {
  const colGrid = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${colGrid} gap-4 sm:gap-5 ${className}`}>
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <div
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={`relative flex items-start gap-4 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 cursor-pointer transition-all duration-200 select-none ${
              isSelected
                ? 'border-[#F95700] bg-orange-50/50 shadow-md ring-4 ring-[#F95700]/10'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
            }`}
          >
            {opt.icon && (
              <div className={`p-3 rounded-xl sm:rounded-2xl shrink-0 transition-all ${
                isSelected ? 'bg-[#F95700] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
              }`}>
                {opt.icon}
              </div>
            )}

            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-base sm:text-lg font-black tracking-tight truncate ${
                  isSelected ? 'text-[#0A1128]' : 'text-slate-800'
                }`}>
                  {opt.title}
                </span>
                {opt.badge && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-100 text-[#C23E00] shrink-0">
                    {opt.badge}
                  </span>
                )}
              </div>
              {opt.description && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                  {opt.description}
                </p>
              )}
            </div>

            {/* Selection indicator check circle */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all mt-0.5 ${
              isSelected
                ? 'bg-[#F95700] border-[#F95700] text-white shadow-xs'
                : 'border-slate-300 bg-white'
            }`}>
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
