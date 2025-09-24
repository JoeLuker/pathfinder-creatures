import type { CreatureEnriched } from '@/types/creature-complete';

interface LanguagesCardProps {
  creature: CreatureEnriched;
}

export function LanguagesCard({ creature }: LanguagesCardProps) {
  if (!creature.languages?.length) return null;

  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Languages
        </div>
      <div className="space-y-1">
        <p className="text-xs text-wrap">
          {creature.languages.join(', ')}
        </p>
      </div>
    </div>
  );
}