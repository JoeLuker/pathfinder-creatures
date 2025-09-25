interface InfoListProps {
  label: string;
  items: string[] | undefined | null;
}

export function InfoList({ label, items }: InfoListProps) { // noqa
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-1">
      <span className="font-bold">{label}</span>{' '}
      <span className="text-sm">{items.join(', ')}</span>
    </div>
  );
}