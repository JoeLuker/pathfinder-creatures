import type { CreatureEnriched } from '@/types/creature-complete';

interface SpaceReachCardProps {
  creature: CreatureEnriched;
}

export function SpaceReachCard({ creature }: SpaceReachCardProps) {
  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Space & Reach
        </div>
      <div className="space-y-1">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Space</span>
            <span className="font-medium">{creature.space ?? 5}ft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reach</span>
            <span className="font-medium">{creature.reach ?? 5}ft</span>
          </div>
        </div>
      </div>
    </div>
  );
}