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
      <div className={cn("flex items-center gap-2 flex-wrap", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col md:grid md:grid-cols-[120px_1fr] gap-1 md:gap-3 md:items-start", className)}>
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <div className="flex items-center gap-2 flex-wrap">
        {children}
      </div>
    </div>
  );
}