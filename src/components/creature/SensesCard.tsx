import type { CreatureEnriched } from '@/types/creature-complete';

interface SensesCardProps {
  creature: CreatureEnriched;
}

export function SensesCard({ creature }: SensesCardProps) {
  if (!creature.senses || Object.keys(creature.senses).length === 0) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Senses
        </div>
      <div className="space-y-1">
        <div className="text-sm">
          {Object.entries(creature.senses)
            .map(([sense, value]) => `${sense}${typeof value === 'number' ? ` ${value}ft` : ''}`)
            .join(', ')}
        </div>
      </div>
    </div>
  );
}