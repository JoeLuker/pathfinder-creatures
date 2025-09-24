import type { CreatureEnriched } from '@/types/creature-complete';

interface ResistancesCardProps {
  creature: CreatureEnriched;
}

export function ResistancesCard({ creature }: ResistancesCardProps) {
  if (!creature.resistances || Object.keys(creature.resistances).length === 0) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Resistances
        </div>
      <div className="space-y-1">
        <div className="text-sm">
          {Object.entries(creature.resistances).map(([type, value]) => `${type} ${value}`).join(', ')}
        </div>
      </div>
    </div>
  );
}