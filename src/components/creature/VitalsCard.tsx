import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';

interface VitalsCardProps {
  creature: CreatureEnriched;
}

export function VitalsCard({ creature }: VitalsCardProps) {
  const formatSave = (save: number | undefined) => {
    if (save === undefined || save === null) return '+0';
    return save >= 0 ? `+${save}` : `${save}`;
  };

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">Vitals</div>
      <div className="space-y-1">
        <Badge variant="destructive">
          HP {creature.hp?.total ?? '—'}
        </Badge>
        <Badge variant="outline">
          Init {formatSave(creature.initiative_parsed?.value ?? creature.initiative)}
        </Badge>
      </div>
    </div>
  );
}