import type { CreatureEnriched } from '@/types/creature-complete';

interface FeatsCardProps {
  creature: CreatureEnriched;
}

export function FeatsCard({ creature }: FeatsCardProps) {
  if (!creature.feats?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Feats
        </div>
      <div className="space-y-1">
        <p className="text-xs text-wrap leading-relaxed">
          {creature.feats.join(', ')}
        </p>
      </div>
    </div>
  );
}