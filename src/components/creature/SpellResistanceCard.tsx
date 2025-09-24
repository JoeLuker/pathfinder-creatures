import type { CreatureEnriched } from '@/types/creature-complete';

interface SpellResistanceCardProps {
  creature: CreatureEnriched;
}

export function SpellResistanceCard({ creature }: SpellResistanceCardProps) {
  if (!creature.sr) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Spell Resistance
        </div>
      <div className="space-y-1">
        <div className="text-sm font-medium">
          {creature.sr}
        </div>
      </div>
    </div>
  );
}