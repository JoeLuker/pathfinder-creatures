import type { CreatureEnriched } from '@/types/creature-complete';

interface ImmunitiesCardProps {
  creature: CreatureEnriched;
}

export function ImmunitiesCard({ creature }: ImmunitiesCardProps) {
  if (!creature.immunities_normalized?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Immunities
        </div>
      <div className="space-y-1">
        <div className="text-sm">
          {creature.immunities_normalized.join(', ')}
        </div>
      </div>
    </div>
  );
}