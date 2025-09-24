import type { CreatureEnriched } from '@/types/creature-complete';
import { cn } from '@/lib/utils';

interface SpellsCardProps {
  creature: CreatureEnriched;
}

export function SpellsCard({ creature }: SpellsCardProps) {
  if (!creature.spells?.entries?.length) return null;

  const getDefaultSpellDC = (spellLevel: number) => {
    const intMod = Math.floor(((creature.ability_scores.INT ?? 10) - 10) / 2);
    const wisMod = Math.floor(((creature.ability_scores.WIS ?? 10) - 10) / 2);
    const chaMod = Math.floor(((creature.ability_scores.CHA ?? 10) - 10) / 2);
    const abilityModifier = Math.max(intMod, wisMod, chaMod);
    return 10 + spellLevel + abilityModifier;
  };

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Spells
        {creature.spells.sources?.map((source, sidx) => (
          <CardDescription key={sidx} className="text-xs">
            {source.name}{source.type && `, ${source.type}`}
          </CardDescription>
        ))}
        </div>
      <div className="space-y-1">
        {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(level => {
          const levelSpells = creature.spells.entries.filter(s => s.level === level);
          if (levelSpells.length === 0) return null;
          const defaultDC = getDefaultSpellDC(level);
          return (
            <div key={level} className="text-xs">
              <span className="font-medium text-muted-foreground">
                {level === 0 ? 'Cantrips' : `L${level}`}
              </span>
              <span className="text-xs text-muted-foreground ml-1">(DC {defaultDC}):</span>
              {' '}
              <span className="text-wrap">
                {levelSpells.map((spell, idx) => (
                  <span key={idx}>
                    {idx > 0 && ', '}
                    <span className={cn(spell.is_mythic_spell && "text-primary font-semibold")}>
                      {spell.name}
                      {spell.DC && spell.DC !== defaultDC && <sup className="text-xs"> DC{spell.DC}</sup>}
                    </span>
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}