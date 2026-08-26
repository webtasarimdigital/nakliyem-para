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
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${colGrid} gap-3 ${className}`}>
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <div
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none ${
              isSelected
                ? 'border-[#146EF5] bg-[#EAF3FF]/60 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            {opt.icon && (
              <div className={`p-2 rounded-lg shrink-0 ${
                isSelected ? 'bg-[#146EF5] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {opt.icon}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-bold truncate ${
                  isSelected ? 'text-[#0B3B8F]' : 'text-slate-800'
                }`}>
                  {opt.title}
                </span>
                {opt.badge && (
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0">
                    {opt.badge}
                  </span>
                )}
              </div>
              {opt.description && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {opt.description}
                </p>
              )}
            </div>

            {/* Selection indicator check circle */}
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
              isSelected
                ? 'bg-[#146EF5] border-[#146EF5] text-white'
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
