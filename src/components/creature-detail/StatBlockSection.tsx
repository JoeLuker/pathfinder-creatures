import React from 'react';
import type { LucideProps } from 'lucide-react';

interface StatBlockSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<LucideProps>;
}

export function StatBlockSection({ title, children, icon: Icon }: StatBlockSectionProps) {
  return (
    <div className="relative mb-4 md:mb-6 pb-4 md:pb-6 border-b border-border/30 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        {Icon ? (
          <div className="flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded-lg bg-interactive-primary/10 text-interactive-primary flex-shrink-0">
            <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </div>
        ) : (
          <div className="h-5 md:h-6 w-1 bg-interactive-primary rounded-full flex-shrink-0" />
        )}
        <h3 className="font-semibold text-sm md:text-base uppercase tracking-wide text-text-primary">
          {title}
        </h3>
      </div>
      <div className="space-y-2 md:space-y-3">{children}</div>
    </div>
  );
}