import React from 'react';
import { cn } from '@/lib/utils';

interface StatRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function StatRow({ label, children, className }: StatRowProps) { // noqa
  return (
    <div className={cn("flex items-center gap-2 flex-wrap mb-1", className)}>
      <span className="font-bold">{label}</span>
      {children}
    </div>
  );
}