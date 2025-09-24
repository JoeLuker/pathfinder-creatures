import type { CreatureEnriched } from '@/types/creature-complete';

interface SpellLikeAbilitiesCardProps {
  creature: CreatureEnriched;
}

export function SpellLikeAbilitiesCard({ creature }: SpellLikeAbilitiesCardProps) {
  if (!creature.spell_like_abilities?.entries?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Spell-Like Abilities
        </div>
      <div className="space-y-1">
        {Object.entries(
          creature.spell_like_abilities.entries.reduce((acc, spell) => {
            const freq = spell.frequency || 'Other';
            if (!acc[freq]) acc[freq] = [];
            acc[freq].push(spell);
            return acc;
          }, {} as Record<string, any[]>)
        ).map(([frequency, spells]) => (
          <div key={frequency} className="text-xs">
            <span className="font-medium text-muted-foreground">{frequency}:</span>{' '}
            <span className="text-wrap">
              {spells.map((spell, idx) => (
                <span key={idx}>
                  {idx > 0 && ', '}
                  {spell.name}{spell.DC && ` (DC ${spell.DC})`}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}