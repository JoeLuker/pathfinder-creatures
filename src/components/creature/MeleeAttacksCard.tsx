import type { CreatureEnriched } from '@/types/creature-complete';

interface MeleeAttacksCardProps {
  creature: CreatureEnriched;
}

export function MeleeAttacksCard({ creature }: MeleeAttacksCardProps) {
  if (!creature.attacks?.melee?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Melee Attacks
        </div>
      <div className="space-y-1">
        <div className="text-sm text-wrap">
          {creature.attacks.melee.join(', ')}
        </div>
      </div>
    </div>
  );
}