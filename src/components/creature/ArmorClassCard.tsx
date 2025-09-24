import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';

interface ArmorClassCardProps {
  creature: CreatureEnriched;
}

export function ArmorClassCard({ creature }: ArmorClassCardProps) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">Armor Class</div>
      <div className="space-y-1">
        <Badge variant="default">
          AC {creature.ac?.AC ?? '—'}
        </Badge>
        {creature.ac?.touch && (
          <Badge variant="secondary">
            Touch {creature.ac.touch}
          </Badge>
        )}
        {creature.ac?.flat_footed && (
          <Badge variant="secondary">
            Flat {creature.ac.flat_footed}
          </Badge>
        )}
      </div>
    </div>
  );
}