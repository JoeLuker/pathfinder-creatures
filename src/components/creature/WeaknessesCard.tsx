import type { CreatureEnriched } from '@/types/creature-complete';

interface WeaknessesCardProps {
  creature: CreatureEnriched;
}

export function WeaknessesCard({ creature }: WeaknessesCardProps) {
  if (!creature.weaknesses_normalized?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Weaknesses
        </div>
      <div className="space-y-1">
        <div className="text-sm">
          {creature.weaknesses_normalized.join(', ')}
        </div>
      </div>
    </div>
  );
}