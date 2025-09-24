import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';
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
    <div className="space-y-6">
      {/* Primary Combat Stats - Card Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* HP Card */}
        <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-xs font-medium text-red-600">Hit Points</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{creature.hp?.total ?? '—'}</div>
          {creature.hp?.long && (
            <div className="text-xs text-gray-600 mt-1">{creature.hp.long}</div>
          )}
          {creature.hp?.regeneration && (
            <div className="text-xs text-red-600 mt-1">Regen {creature.hp.regeneration}</div>
          )}
        </div>

        {/* AC Card */}
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600">Armor Class</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{creature.ac?.AC ?? '—'}</div>
          <div className="text-xs text-gray-600 mt-1">
            Touch {creature.ac?.touch ?? '—'} | FF {creature.ac?.flat_footed ?? '—'}
          </div>
        </div>

        {/* Initiative Card */}
        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-5 w-5 text-purple-500" />
            <span className="text-xs font-medium text-purple-600">Initiative</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {creature.initiative_parsed?.value !== undefined
              ? `${creature.initiative_parsed.value >= 0 ? '+' : ''}${creature.initiative_parsed.value}`
              : creature.initiative !== undefined
              ? `${creature.initiative >= 0 ? '+' : ''}${creature.initiative}`
              : '—'}
          </div>
          <div className="text-xs text-gray-600 mt-1">Roll first</div>
        </div>
      </div>

      {/* Saving Throws - Horizontal Bar */}
      <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-orange-50 rounded-xl p-4 border">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Saving Throws</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Fortitude</div>
            <div className="text-xl font-bold">
              {creature.saves?.fort !== undefined
                ? `${creature.saves.fort >= 0 ? '+' : ''}${creature.saves.fort}`
                : '—'}
            </div>
          </div>
          <div className="text-center border-l border-r">
            <div className="text-xs text-gray-600 mb-1">Reflex</div>
            <div className="text-xl font-bold">
              {creature.saves?.ref !== undefined
                ? `${creature.saves.ref >= 0 ? '+' : ''}${creature.saves.ref}`
                : '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Will</div>
            <div className="text-xl font-bold">
              {creature.saves?.will !== undefined
                ? `${creature.saves.will >= 0 ? '+' : ''}${creature.saves.will}`
                : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Ability Scores - Visual Enhancement */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Ability Scores
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability, idx) => {
            const score = creature.ability_scores[ability as keyof typeof creature.ability_scores];
            const { score: scoreStr, mod } = formatAbilityScore(score);
            const colors = [
              'from-red-100 to-red-50 border-red-200',
              'from-orange-100 to-orange-50 border-orange-200',
              'from-yellow-100 to-yellow-50 border-yellow-200',
              'from-blue-100 to-blue-50 border-blue-200',
              'from-green-100 to-green-50 border-green-200',
              'from-purple-100 to-purple-50 border-purple-200'
            ];

            return (
              <div key={ability} className={`bg-gradient-to-b ${colors[idx]} border rounded-lg p-3 text-center`}>
                <div className="text-xs font-semibold text-gray-600">{ability}</div>
                <div className="text-lg font-bold text-gray-900 mt-1">{scoreStr}</div>
                <div className="text-xs text-gray-600">{mod}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Combat Maneuvers & Movement in Two Columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Combat Stats */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Combat Maneuvers
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-sm text-gray-600">Base Attack</span>
              <span className="font-semibold">+{creature.bab ?? 0}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-sm text-gray-600">CMB</span>
              <span className="font-semibold">
                +{creature.cmb ?? 0}
                {creature.cmb_other && <span className="text-xs text-gray-500 ml-1">({creature.cmb_other})</span>}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">CMD</span>
              <span className="font-semibold">
                {creature.cmd ?? 10}
                {creature.cmd_other && <span className="text-xs text-gray-500 ml-1">({creature.cmd_other})</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Movement */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Footprints className="h-4 w-4" />
            Movement & Reach
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1 border-b">
              <span className="text-sm text-gray-600">Speed</span>
              <span className="font-semibold">{creature.speeds?.base ?? 30} ft.</span>
            </div>
            {creature.speeds?.fly && (
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-sm text-gray-600">Fly</span>
                <span className="font-semibold">{creature.speeds.fly} ft.</span>
              </div>
            )}
            {creature.speeds?.swim && (
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-sm text-gray-600">Swim</span>
                <span className="font-semibold">{creature.speeds.swim} ft.</span>
              </div>
            )}
            {creature.speeds?.climb && (
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-sm text-gray-600">Climb</span>
                <span className="font-semibold">{creature.speeds.climb} ft.</span>
              </div>
            )}
            {creature.speeds?.burrow && (
              <div className="flex justify-between items-center py-1 border-b">
                <span className="text-sm text-gray-600">Burrow</span>
                <span className="font-semibold">{creature.speeds.burrow} ft.</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Space/Reach</span>
              <span className="font-semibold">{creature.space ?? 5}/{creature.reach ?? 5} ft.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attacks - Enhanced Display */}
      {(creature.attacks?.melee?.length > 0 || creature.attacks?.ranged?.length > 0) && (
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Swords className="h-4 w-4" />
            Attacks
          </h3>
          <div className="space-y-3">
            {creature.attacks.melee?.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">MELEE</div>
                {creature.attacks.melee.map((attack, idx) => (
                  <div key={idx} className="text-sm bg-gray-50 rounded px-3 py-2 mb-1">
                    {attack}
                  </div>
                ))}
              </div>
            )}
            {creature.attacks.ranged?.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">RANGED</div>
                {creature.attacks.ranged.map((attack, idx) => (
                  <div key={idx} className="text-sm bg-gray-50 rounded px-3 py-2 mb-1">
                    {attack}
                  </div>
                ))}
              </div>
            )}
            {creature.attacks.special?.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">SPECIAL</div>
                <div className="flex flex-wrap gap-2">
                  {creature.attacks.special.map((attack, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {attack}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Defenses - Visual Cards */}
      {(creature.sr || creature.dr?.length > 0 || creature.resistances ||
        creature.immunities_normalized?.length > 0 || creature.weaknesses_normalized?.length > 0) && (
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Defenses
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {creature.sr && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-xs font-medium text-purple-600 mb-1">Spell Resistance</div>
                <div className="text-lg font-bold">{creature.sr}</div>
              </div>
            )}
            {creature.dr?.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-xs font-medium text-gray-600 mb-1">Damage Reduction</div>
                <div className="text-sm font-semibold">
                  {creature.dr.map(dr => `${dr.amount}/${dr.weakness}`).join(', ')}
                </div>
              </div>
            )}
            {creature.resistances && Object.keys(creature.resistances).length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 col-span-2">
                <div className="text-xs font-medium text-blue-600 mb-1">Resistances</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(creature.resistances).map(([type, value]) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type} {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {creature.immunities_normalized?.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 col-span-2">
                <div className="text-xs font-medium text-green-600 mb-1">Immunities</div>
                <div className="flex flex-wrap gap-2">
                  {creature.immunities_normalized.map((immunity, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-green-300 text-green-700">
                      {immunity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {creature.weaknesses_normalized?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 col-span-2">
                <div className="text-xs font-medium text-red-600 mb-1">Weaknesses</div>
                <div className="flex flex-wrap gap-2">
                  {creature.weaknesses_normalized.map((weakness, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-red-300 text-red-700">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Senses */}
      {creature.senses && Object.keys(creature.senses).length > 0 && (
        <div className="bg-white rounded-xl border p-4">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Senses
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(creature.senses).map(([sense, value]) => (
              <Badge key={sense} variant="secondary" className="text-sm">
                {sense}{typeof value === 'number' ? ` ${value} ft.` : ''}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}