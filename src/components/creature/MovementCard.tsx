import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';

interface MovementCardProps {
  creature: CreatureEnriched;
}

export function MovementCard({ creature }: MovementCardProps) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium">Movement</div>
      <div className="space-y-1">
        <Badge variant="outline">
          Speed {creature.speeds?.base ?? 30}ft
        </Badge>
        {creature.speeds?.fly && (
          <Badge variant="outline">
            Fly {creature.speeds.fly}ft
          </Badge>
        )}
      </div>
    </div>
  );
}