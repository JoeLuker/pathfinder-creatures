import React from 'react';
import { cn } from '@/lib/utils';

interface StatRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function StatRow({ label, children, className }: StatRowProps) { // noqa
  if (!label) {
    return (
      <div className={cn("flex items-center gap-2 flex-wrap font-sans", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-[120px_1fr] gap-3 items-start font-sans", className)}>
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">
        {children}
      </div>
    </div>
  );
}