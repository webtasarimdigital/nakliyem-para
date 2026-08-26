import React from 'react';
import { ArrowRight, MapPin, ArrowDown } from 'lucide-react';

export interface RouteDisplayProps {
  originCity: string;
  originDistrict?: string;
  destinationCity: string;
  destinationDistrict?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'responsive';
  className?: string;
  distanceKm?: number;
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({
  originCity,
  originDistrict,
  destinationCity,
  destinationDistrict,
  size = 'md',
  layout = 'responsive',
  className = '',
  distanceKm
}) => {
  const originText = originDistrict ? `${originCity} / ${originDistrict}` : originCity;
  const destText = destinationDistrict ? `${destinationCity} / ${destinationDistrict}` : destinationCity;

  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#146EF5] ring-4 ring-[#EAF3FF] shrink-0" />
          <span>{originText}</span>
        </div>
        <div className="ml-1 pl-3 border-l-2 border-dashed border-slate-200 py-0.5 text-xs text-slate-500 font-medium">
          {distanceKm ? `~${distanceKm} km` : 'Güzergâh'}
        </div>
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-50 shrink-0" />
          <span>{destText}</span>
        </div>
      </div>
    );
  }

  const textSize = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold'
  }[size];

  return (
    <div className={`flex flex-wrap items-center gap-2 text-slate-800 ${textSize} ${className}`}>
      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-[#146EF5] shrink-0" />
        <span className="truncate max-w-[160px] sm:max-w-none">{originText}</span>
      </div>

      <div className="flex items-center text-slate-400 px-1">
        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:inline" />
        <ArrowDown className="w-4 h-4 text-slate-400 shrink-0 sm:hidden" />
      </div>

      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="truncate max-w-[160px] sm:max-w-none">{destText}</span>
      </div>

      {distanceKm !== undefined && (
        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-auto sm:ml-2">
          ~{distanceKm} km
        </span>
      )}
    </div>
  );
};
