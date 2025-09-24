import type { CreatureEnriched } from '@/types/creature-complete';

interface RangedAttacksCardProps {
  creature: CreatureEnriched;
}

export function RangedAttacksCard({ creature }: RangedAttacksCardProps) {
  if (!creature.attacks?.ranged?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Ranged Attacks
        </div>
      <div className="space-y-1">
        <div className="text-sm text-wrap">
          {creature.attacks.ranged.join(', ')}
        </div>
      </div>
    </div>
  );
}