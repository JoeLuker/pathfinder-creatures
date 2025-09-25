import React from 'react';

interface StatBlockSectionProps {
  title: string;
  children: React.ReactNode;
}

export function StatBlockSection({ title, children }: StatBlockSectionProps) { // noqa
  return (
    <div className="mt-4">
      <div className="font-bold text-base mb-2">{title}</div>
      <div className="space-y-1 leading-relaxed">
        {children}
      </div>
    </div>
  );
}