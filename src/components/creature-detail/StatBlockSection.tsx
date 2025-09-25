import React from 'react';

interface StatBlockSectionProps {
  title: string;
  children: React.ReactNode;
}

export function StatBlockSection({ title, children }: StatBlockSectionProps) { // noqa
  return (
    <div className="relative mb-6 pb-6 border-b border-border/30 last:border-0 last:pb-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-6 w-1 bg-interactive-primary rounded-full" />
        <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
          {title}
        </h3>
      </div>
      <div className="space-y-2 pl-4">{children}</div>
    </div>
  );
}