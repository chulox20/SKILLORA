import React from 'react';

export function Skeleton({ className = '', variant = 'rectangular' }) {
  const base = 'animate-pulse bg-slate-800/80';
  const variants = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} />;
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-4">
      <Skeleton className="w-full h-44 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="w-24 h-5 rounded-full" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-3/4 h-4" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="w-full h-5" />
        </td>
      ))}
    </tr>
  );
}
