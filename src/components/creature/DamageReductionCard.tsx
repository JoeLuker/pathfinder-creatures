import type { CreatureEnriched } from '@/types/creature-complete';

interface DamageReductionCardProps {
  creature: CreatureEnriched;
}

export function DamageReductionCard({ creature }: DamageReductionCardProps) {
  if (!creature.dr?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Damage Reduction
        </div>
      <div className="space-y-1">
        <div className="text-sm">
          {creature.dr.map(dr => `${dr.amount}/${dr.types?.join(' and ') || 'special'}`).join(', ')}
        </div>
      </div>
    </div>
  );
}