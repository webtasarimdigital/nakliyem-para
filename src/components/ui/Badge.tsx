import React from 'react';
import { ShieldCheck, Award, Zap, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export interface BadgeProps {
  variant?: 'verified' | 'gold' | 'pro' | 'pending' | 'success' | 'danger' | 'warning' | 'neutral' | 'elevator';
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  size = 'md',
  className = '',
  showIcon = true
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5'
  };

  const variants = {
    verified: {
      style: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
      defaultText: 'Onaylı Firma'
    },
    gold: {
      style: 'bg-amber-50 text-amber-900 border border-amber-300 font-bold',
      icon: <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
      defaultText: 'GOLD Üye'
    },
    pro: {
      style: 'bg-blue-50 text-[#0B3B8F] border border-blue-200',
      icon: <Zap className="w-3.5 h-3.5 text-[#146EF5] shrink-0" />,
      defaultText: 'PRO Üye'
    },
    elevator: {
      style: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
      defaultText: 'Mobil Asansörlü'
    },
    pending: {
      style: 'bg-slate-100 text-slate-700 border border-slate-200',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
      defaultText: 'İnceleniyor'
    },
    success: {
      style: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
      defaultText: 'Başarılı'
    },
    warning: {
      style: 'bg-amber-50 text-amber-800 border border-amber-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
      defaultText: 'Uyarı'
    },
    danger: {
      style: 'bg-rose-50 text-rose-700 border border-rose-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
      defaultText: 'İptal / Kapalı'
    },
    neutral: {
      style: 'bg-slate-100 text-slate-700 border border-slate-200',
      icon: null,
      defaultText: ''
    }
  };

  const current = variants[variant];

  return (
    <span className={`inline-flex items-center rounded-md shrink-0 ${sizeStyles[size]} ${current.style} ${className}`}>
      {showIcon && current.icon}
      <span>{children || current.defaultText}</span>
    </span>
  );
};
