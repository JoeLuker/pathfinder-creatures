import type { CreatureEnriched } from '@/types/creature-complete';
import { cn } from '@/lib/utils';

interface SkillsCardProps {
  creature: CreatureEnriched;
}

export function SkillsCard({ creature }: SkillsCardProps) {
  if (!creature.skills || Object.keys(creature.skills).filter(k => !k.startsWith('_')).length === 0) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Skills
        </div>
      <div className="space-y-1">
        <div className="grid grid-cols-1 gap-y-0.5 text-xs">
          {Object.entries(creature.skills)
            .filter(([key]) => !key.startsWith('_'))
            .sort(([,a], [,b]) => (typeof b === 'number' ? b : 0) - (typeof a === 'number' ? a : 0))
            .map(([skill, value]) => {
              const bonus = typeof value === 'number' ? value : 0;
              const isHigh = bonus >= 15;
              return (
                <div key={skill} className="flex justify-between">
                  <span className="text-muted-foreground truncate">{skill}</span>
                  <span className={cn("font-medium ml-2", isHigh && "text-primary")}>
                    +{bonus}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}