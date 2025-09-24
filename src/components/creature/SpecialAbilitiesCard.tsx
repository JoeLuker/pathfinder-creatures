import type { CreatureEnriched } from '@/types/creature-complete';

interface SpecialAbilitiesCardProps {
  creature: CreatureEnriched;
}

export function SpecialAbilitiesCard({ creature }: SpecialAbilitiesCardProps) {
  if (!creature.special_abilities?._parsed?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Special Abilities
        </div>
      <div className="space-y-1">
        {creature.special_abilities._parsed.map((ability, idx) => (
          <div key={idx} className="text-xs">
            <p className="font-medium">
              {ability.name}
              {ability.type && (
                <span className="text-muted-foreground ml-1">({ability.type})</span>
              )}
            </p>
            <p className="text-muted-foreground text-wrap leading-relaxed">
              {ability.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}