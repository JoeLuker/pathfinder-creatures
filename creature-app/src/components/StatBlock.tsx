import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sword, Shield, Heart, Zap, Brain, Eye, Footprints,
  ShieldCheck, Target, Swords, Activity
} from 'lucide-react';

interface StatBlockProps {
  creature: CreatureEnriched;
}

export function StatBlock({ creature }: StatBlockProps) {
  // Stat modifier calculation
  const getModifier = (score: number | null | undefined) => {
    if (!score) return '+0';
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // Format ability score display
  const formatAbilityScore = (score: number | null | undefined) => {
    if (!score) return { score: '—', mod: '—' };
    const mod = Math.floor((score - 10) / 2);
    return {
      score: score.toString(),
      mod: mod >= 0 ? `+${mod}` : `${mod}`
    };
  };

  return (
    <TooltipProvider>
      {/* Multi-Section Layout - Web-Native */}
      <div className="grid grid-cols-12 gap-2 text-sm">

        {/* Left Column: Core Combat (5 cols) */}
        <div className="col-span-5 space-y-1">
          {/* Vitals Section */}
          <div className="bg-surface-primary rounded-md border p-2">
            <div className="grid grid-cols-2 gap-3">
              <Tooltip>
                <TooltipTrigger>
                  <div className="hover:bg-surface-secondary rounded p-1 cursor-help">
                    <Heart className="inline h-3 w-3 mr-1 text-status-error" />
                    <div className="font-semibold text-primary">{creature.hp?.total ?? '—'}</div>
                    <div className="text-xs text-secondary">Hit Points</div>
                    {creature.hp?.regeneration && <div className="text-xs text-status-error">Regen {creature.hp.regeneration}</div>}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    {creature.hp?.long && <p><strong>Formula:</strong> {creature.hp.long}</p>}
                    {creature.hp?.regeneration && <p><strong>Regeneration:</strong> {creature.hp.regeneration}</p>}
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="hover:bg-surface-secondary rounded p-1 cursor-help">
                    <Zap className="inline h-3 w-3 mr-1 text-interactive-primary" />
                    <div className="font-semibold text-primary">
                      {creature.initiative_parsed?.value !== undefined
                        ? `${creature.initiative_parsed.value >= 0 ? '+' : ''}${creature.initiative_parsed.value}`
                        : creature.initiative !== undefined
                        ? `${creature.initiative >= 0 ? '+' : ''}${creature.initiative}`
                        : '—'}
                    </div>
                    <div className="text-xs text-secondary">Initiative</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Roll initiative at start of combat</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Combat Stats Grid */}
          <div className="bg-surface-secondary rounded-md border p-2">
            <div className="text-xs font-medium text-secondary mb-1">Combat</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center hover:bg-surface-primary rounded p-1">
                    <div className="font-bold text-primary">+{creature.bab ?? 0}</div>
                    <div className="text-tertiary">BAB</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Base Attack Bonus</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center hover:bg-surface-primary rounded p-1">
                    <div className="font-bold text-primary">+{creature.cmb ?? 0}</div>
                    <div className="text-tertiary">CMB</div>
                    {creature.cmb_other && <div className="text-xs text-tertiary">({creature.cmb_other})</div>}
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Combat Maneuver Bonus</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center hover:bg-surface-primary rounded p-1">
                    <div className="font-bold text-primary">{creature.cmd ?? 10}</div>
                    <div className="text-tertiary">CMD</div>
                    {creature.cmd_other && <div className="text-xs text-tertiary">({creature.cmd_other})</div>}
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Combat Maneuver Defense</p></TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Center Column: Defenses (4 cols) */}
        <div className="col-span-4 space-y-1">
          {/* AC Section */}
          <div className="bg-surface-primary rounded-md border p-2">
            <Tooltip>
              <TooltipTrigger>
                <div className="hover:bg-surface-secondary rounded p-1 cursor-help">
                  <Shield className="inline h-3 w-3 mr-1 text-status-info" />
                  <div className="font-semibold text-primary text-lg">{creature.ac?.AC ?? '—'}</div>
                  <div className="text-xs text-secondary mb-1">Armor Class</div>
                  <div className="flex justify-between text-xs text-tertiary">
                    <span>Touch {creature.ac?.touch ?? '—'}</span>
                    <span>FF {creature.ac?.flat_footed ?? '—'}</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p><strong>Normal AC:</strong> {creature.ac?.AC ?? '—'}</p>
                  <p><strong>Touch AC:</strong> {creature.ac?.touch ?? '—'} (ignores armor/shield)</p>
                  <p><strong>Flat-footed AC:</strong> {creature.ac?.flat_footed ?? '—'} (no Dex bonus)</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Saves Section */}
          <div className="bg-surface-secondary rounded-md border p-2">
            <div className="text-xs font-medium text-secondary mb-1">Saving Throws</div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center hover:bg-surface-primary rounded p-1">
                    <div className="font-bold text-primary">
                      {creature.saves?.fort !== undefined ? `${creature.saves.fort >= 0 ? '+' : ''}${creature.saves.fort}` : '—'}
                    </div>
                    <div className="text-tertiary">Fort</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Fortitude vs poison, disease</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center hover:bg-surface-primary rounded p-1">
                    <div className="font-bold text-primary">
                      {creature.saves?.ref !== undefined ? `${creature.saves.ref >= 0 ? '+' : ''}${creature.saves.ref}` : '—'}
                    </div>
                    <div className="text-tertiary">Ref</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Reflex vs area effects</p></TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="text-center hover:bg-surface-primary rounded p-1">
                    <div className="font-bold text-primary">
                      {creature.saves?.will !== undefined ? `${creature.saves.will >= 0 ? '+' : ''}${creature.saves.will}` : '—'}
                    </div>
                    <div className="text-tertiary">Will</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Will vs mental effects</p></TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Right Column: Movement & Physical (3 cols) */}
        <div className="col-span-3 space-y-1">
          {/* Movement Section */}
          <div className="bg-surface-primary rounded-md border p-2">
            <div className="text-xs font-medium text-secondary mb-1">Movement</div>
            <div className="text-xs text-primary space-y-0.5">
              <div className="font-semibold">{creature.speeds?.base ?? 30} ft</div>
              {creature.speeds?.fly && <div className="text-tertiary">Fly {creature.speeds.fly}ft</div>}
              {creature.speeds?.swim && <div className="text-tertiary">Swim {creature.speeds.swim}ft</div>}
              {creature.speeds?.climb && <div className="text-tertiary">Climb {creature.speeds.climb}ft</div>}
              {creature.speeds?.burrow && <div className="text-tertiary">Burrow {creature.speeds.burrow}ft</div>}
            </div>
          </div>

          {/* Space/Reach */}
          <div className="bg-surface-secondary rounded-md border p-2">
            <div className="text-xs font-medium text-secondary mb-1">Reach</div>
            <div className="text-xs text-primary">
              <div>{creature.space ?? 5}ft space</div>
              <div>{creature.reach ?? 5}ft reach</div>
            </div>
          </div>
        </div>

        {/* Full-Width Ability Scores */}
        <div className="col-span-12">
          <div className="bg-surface-primary rounded-md border p-2">
            <div className="grid grid-cols-6 gap-2 text-xs">
              {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability) => {
                const score = creature.ability_scores[ability as keyof typeof creature.ability_scores];
                const { score: scoreStr, mod } = formatAbilityScore(score);
                return (
                  <Tooltip key={ability}>
                    <TooltipTrigger>
                      <div className="text-center hover:bg-surface-secondary rounded p-1 border border-transparent hover:border-border">
                        <div className="font-medium text-secondary">{ability}</div>
                        <div className="text-lg font-bold text-primary">{scoreStr}</div>
                        <div className="text-tertiary">{mod}</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p><strong>{ability}:</strong> {scoreStr} (modifier {mod})</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      </div>


      {/* Attacks - Compact List */}
      {(creature.attacks?.melee?.length > 0 || creature.attacks?.ranged?.length > 0) && (
        <div className="bg-surface-secondary rounded-md border p-2 mt-1">
          <div className="text-xs text-primary">
            {creature.attacks.melee?.length > 0 && (
              <div className="mb-1">
                <span className="font-semibold text-secondary mr-2">Melee:</span>
                {creature.attacks.melee.join('; ')}
              </div>
            )}
            {creature.attacks.ranged?.length > 0 && (
              <div className="mb-1">
                <span className="font-semibold text-secondary mr-2">Ranged:</span>
                {creature.attacks.ranged.join('; ')}
              </div>
            )}
            {creature.attacks.special?.length > 0 && (
              <div>
                <span className="font-semibold text-secondary mr-2">Special:</span>
                {creature.attacks.special.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Defenses - Compact List */}
      {(creature.sr || creature.dr?.length > 0 || creature.resistances ||
        creature.immunities_normalized?.length > 0 || creature.weaknesses_normalized?.length > 0) && (
        <div className="bg-surface-secondary rounded-md border p-2 mt-1">
          <div className="text-xs text-primary space-y-0.5">
            {creature.sr && (
              <div><span className="font-semibold text-secondary">SR:</span> {creature.sr}</div>
            )}
            {creature.dr?.length > 0 && (
              <div><span className="font-semibold text-secondary">DR:</span> {creature.dr.map(dr => `${dr.amount}/${dr.weakness}`).join(', ')}</div>
            )}
            {creature.resistances && Object.keys(creature.resistances).length > 0 && (
              <div><span className="font-semibold text-secondary">Resistances:</span> {Object.entries(creature.resistances).map(([type, value]) => `${type} ${value}`).join(', ')}</div>
            )}
            {creature.immunities_normalized?.length > 0 && (
              <div><span className="font-semibold text-secondary">Immunities:</span> {creature.immunities_normalized.join(', ')}</div>
            )}
            {creature.weaknesses_normalized?.length > 0 && (
              <div><span className="font-semibold text-secondary">Weaknesses:</span> {creature.weaknesses_normalized.join(', ')}</div>
            )}
          </div>
        </div>
      )}

      {/* Senses - Inline */}
      {creature.senses && Object.keys(creature.senses).length > 0 && (
        <div className="bg-surface-secondary rounded-md border p-2 mt-1">
          <div className="text-xs text-primary">
            <span className="font-semibold text-secondary mr-2">Senses:</span>
            {Object.entries(creature.senses).map(([sense, value]) =>
              `${sense}${typeof value === 'number' ? ` ${value} ft` : ''}`
            ).join(', ')}
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}