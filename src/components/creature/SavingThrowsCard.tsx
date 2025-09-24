import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';

interface SavingThrowsCardProps {
  creature: CreatureEnriched;
}

export function SavingThrowsCard({ creature }: SavingThrowsCardProps) {
  const formatSave = (save: number | undefined) => {
    if (save === undefined || save === null) return '+0';
    return save >= 0 ? `+${save}` : `${save}`;
  };

  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">Saving Throws</div>
      <div className="space-y-1">
        <Badge variant="outline">
          Fort {formatSave(creature.saves?.fort)}
        </Badge>
        <Badge variant="outline">
          Ref {formatSave(creature.saves?.ref)}
        </Badge>
        <Badge variant="outline">
          Will {formatSave(creature.saves?.will)}
        </Badge>
      </div>
    </div>
  );
}