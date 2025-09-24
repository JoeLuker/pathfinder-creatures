import type { CreatureEnriched } from '@/types/creature-complete';

interface CombatStatsCardProps {
  creature: CreatureEnriched;
}

export function CombatStatsCard({ creature }: CombatStatsCardProps) {
  return (
    <div className="space-y-1">
        <div className="text-sm font-medium">
        Combat
        </div>
      <div className="space-y-1">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">BAB</span>
            <span className="font-medium">+{creature.bab ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CMB</span>
            <span className="font-medium">+{creature.cmb ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CMD</span>
            <span className="font-medium">{creature.cmd ?? 10}</span>
          </div>
        </div>
      </div>
    </div>
  );
}