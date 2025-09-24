import type { CreatureEnriched } from '@/types/creature-complete';

interface SpecialAttacksCardProps {
  creature: CreatureEnriched;
}

export function SpecialAttacksCard({ creature }: SpecialAttacksCardProps) {
  if (!creature.attacks?.special?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Special Attacks
        </div>
      <div className="space-y-1">
        <div className="text-sm text-wrap">
          {creature.attacks.special.join(', ')}
        </div>
      </div>
    </div>
  );
}