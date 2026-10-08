import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, BreadcrumbItem } from '@/lib/seo/schema';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  showHomeIcon = true,
}) => {
  const schema = buildBreadcrumbSchema(items);

  return (
    <>
      <JsonLd data={schema} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap py-1 ${className}`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={item.url}>
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {isLast ? (
                <span
                  className="font-bold text-[#111E38] truncate"
                  aria-current="page"
                >
                  {index === 0 && showHomeIcon && (
                    <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                  )}
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-[#F95700] transition-colors truncate flex items-center gap-1"
                >
                  {index === 0 && showHomeIcon && (
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{item.name}</span>
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
};

export default Breadcrumb;
