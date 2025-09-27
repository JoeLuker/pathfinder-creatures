interface InfoListProps {
  label: string;
  items: string[] | undefined | null;
}

export function InfoList({ label, items }: InfoListProps) { // noqa
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-text-secondary">{label}</div>
      <div className="text-sm text-text-primary break-words">{items.join(', ')}</div>
    </div>
  );
}