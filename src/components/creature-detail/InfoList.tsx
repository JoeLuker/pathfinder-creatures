interface InfoListProps {
  label: string;
  items: string[] | undefined | null;
}

export function InfoList({ label, items }: InfoListProps) { // noqa
  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <span className="text-sm text-text-primary font-sans">{items.join(', ')}</span>
    </div>
  );
}