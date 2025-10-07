import React from 'react';
import type { LucideProps } from 'lucide-react';

interface StatBlockSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<LucideProps>;
}

export function StatBlockSection({ title, children, icon: Icon }: StatBlockSectionProps) {
  return (
    <div className="relative mb-6 pb-6 border-b border-border/30 last:border-0 last:pb-0">
      <div className="flex items-center gap-3 mb-4">
        {Icon ? (
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-interactive-primary/10 text-interactive-primary">
            <Icon className="h-4 w-4" />
          </div>
        ) : (
          <div className="h-6 w-1 bg-interactive-primary rounded-full" />
        )}
        <h3 className="font-semibold text-base uppercase tracking-wide text-text-primary">
          {title}
        </h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}