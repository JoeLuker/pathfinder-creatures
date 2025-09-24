import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AbilityScoresCardProps {
  creature: CreatureEnriched;
}

export function AbilityScoresCard({ creature }: AbilityScoresCardProps) {
  const formatModifier = (score: number | null | undefined) => {
    if (!score) return '+0';
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Ability Scores
        </div>
      <div className="space-y-1">
        <div className="grid grid-cols-6 gap-1">
          {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability) => {
            const score = creature.ability_scores[ability as keyof typeof creature.ability_scores];
            const modifier = formatModifier(score);
            return (
              <div key={ability} className="flex flex-col items-center">
                <Badge variant="secondary" className="text-xs px-1 py-0.5 h-auto flex-col">
                  <span className="text-xs">{ability}</span>
                  <span className="font-bold">{score ?? '—'}</span>
                  <span className="text-xs">{modifier}</span>
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}