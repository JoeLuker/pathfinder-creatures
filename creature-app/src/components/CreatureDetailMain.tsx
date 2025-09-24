import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Sword, Shield, Heart, Zap, Brain, Eye, MessageSquare, Footprints,
  Sparkles, ShieldCheck, AlertTriangle, Target, Activity, Globe,
  BookOpen, Coins, Users, MapPin, Skull, Star, Code, ArrowLeft, Copy,
  ChevronDown, ChevronRight, Gauge, ScrollText, Swords, Package
} from 'lucide-react';
import { useState } from 'react';

interface CreatureDetailMainProps {
  creature: CreatureEnriched | null;
  onBack: () => void;
}

export function CreatureDetailMain({ creature, onBack }: CreatureDetailMainProps) {
  const [jsonCopied, setJsonCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    spells: false,
    gear: false,
    tactics: false,
  });

  if (!creature) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Select a creature</h2>
          <p>Choose a creature from the list to view details</p>
        </div>
      </div>
    );
  }

  // Use the display value from cr_parsed if available, otherwise use the cr value
  const crDisplay = creature.cr_parsed?.display ?? creature.cr?.toString() ?? '-';

  // Stat modifier calculation
  const getModifier = (score: number | null | undefined) => {
    if (!score) return '+0';
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // Format HP display
  const formatHP = () => {
    if (!creature.hp) return 'Unknown';
    const { total, long: longHP } = creature.hp;
    if (total && longHP) {
      return `${total} (${longHP})`;
    }
    return total || longHP || 'Unknown';
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(creature, null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 -ml-2 mt-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{creature.name}</h1>
              <p className="text-muted-foreground">
                {creature.alignment && <span>{creature.alignment} </span>}
                {creature.size} {creature.type}
                {creature.subtypes_normalized?.length > 0 && (
                  <span> ({creature.subtypes_normalized.join(', ')})</span>
                )}
              </p>
              {creature.race_class?.raw && (
                <p className="text-xs text-muted-foreground">{creature.race_class.raw}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              CR {crDisplay}
              {creature.mr && <span className="text-lg text-purple-600"> / MR {creature.mr}</span>}
            </div>
            {creature.xp && (
              <div className="text-sm text-muted-foreground">{creature.xp.toLocaleString()} XP</div>
            )}
          </div>
        </div>

        {/* Quick Stats Bar - Always Visible */}
        <div className="grid grid-cols-6 gap-2 mt-4">
          <div className="bg-gray-50 rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">HP</div>
            <div className="font-bold">{creature.hp?.total ?? '-'}</div>
          </div>
          <div className="bg-gray-50 rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">AC</div>
            <div className="font-bold">{creature.ac?.AC ?? creature.ac ?? '-'}</div>
          </div>
          <div className="bg-gray-50 rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Fort</div>
            <div className="font-bold">
              {creature.saves?.fort !== undefined ? `${creature.saves.fort >= 0 ? '+' : ''}${creature.saves.fort}` : '-'}
            </div>
          </div>
          <div className="bg-gray-50 rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Ref</div>
            <div className="font-bold">
              {creature.saves?.ref !== undefined ? `${creature.saves.ref >= 0 ? '+' : ''}${creature.saves.ref}` : '-'}
            </div>
          </div>
          <div className="bg-gray-50 rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Will</div>
            <div className="font-bold">
              {creature.saves?.will !== undefined ? `${creature.saves.will >= 0 ? '+' : ''}${creature.saves.will}` : '-'}
            </div>
          </div>
          <div className="bg-gray-50 rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Init</div>
            <div className="font-bold">
              {creature.initiative_parsed?.value !== undefined
                ? `${creature.initiative_parsed.value >= 0 ? '+' : ''}${creature.initiative_parsed.value}`
                : creature.initiative !== undefined
                ? `${creature.initiative >= 0 ? '+' : ''}${creature.initiative}`
                : '-'}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="combat" className="flex-1 flex flex-col">
        <div className="bg-white border-b">
          <TabsList className="w-full justify-start rounded-none bg-transparent h-auto p-0 px-6">
            <TabsTrigger value="combat" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <Sword className="h-4 w-4 mr-2" />
              Combat
            </TabsTrigger>
            <TabsTrigger value="abilities" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <Sparkles className="h-4 w-4 mr-2" />
              Abilities
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <BookOpen className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="json" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              <Code className="h-4 w-4 mr-2" />
              JSON
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          {/* Combat Tab - Essential combat information */}
          <TabsContent value="combat" className="p-6 space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column - Offense */}
              <div className="space-y-4">
                {/* Movement */}
                {creature.speeds && (
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Footprints className="h-4 w-4" />
                      Movement
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {creature.speeds.base && (
                        <span className="text-sm">
                          <span className="text-muted-foreground">Base:</span> {creature.speeds.base} ft.
                        </span>
                      )}
                      {creature.speeds.fly && (
                        <span className="text-sm">
                          <span className="text-muted-foreground">Fly:</span> {creature.speeds.fly} ft.
                        </span>
                      )}
                      {creature.speeds.swim && (
                        <span className="text-sm">
                          <span className="text-muted-foreground">Swim:</span> {creature.speeds.swim} ft.
                        </span>
                      )}
                      {creature.speeds.burrow && (
                        <span className="text-sm">
                          <span className="text-muted-foreground">Burrow:</span> {creature.speeds.burrow} ft.
                        </span>
                      )}
                      {creature.speeds.climb && (
                        <span className="text-sm">
                          <span className="text-muted-foreground">Climb:</span> {creature.speeds.climb} ft.
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Attacks */}
                {(creature.attacks?.melee?.length > 0 || creature.attacks?.ranged?.length > 0 || creature.attacks?.special?.length > 0) && (
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Swords className="h-4 w-4" />
                      Attacks
                    </h3>
                    {creature.attacks.melee?.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Melee</h4>
                        {creature.attacks.melee.map((attack, idx) => (
                          <div key={idx} className="text-sm mb-1">{attack}</div>
                        ))}
                      </div>
                    )}
                    {creature.attacks.ranged?.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Ranged</h4>
                        {creature.attacks.ranged.map((attack, idx) => (
                          <div key={idx} className="text-sm mb-1">{attack}</div>
                        ))}
                      </div>
                    )}
                    {creature.attacks.special?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Special</h4>
                        {creature.attacks.special.map((attack, idx) => (
                          <div key={idx} className="text-sm mb-1">{attack}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Combat Maneuvers & Space/Reach */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-semibold text-sm mb-3">Combat Stats</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">BAB:</span> +{creature.bab ?? 0}
                    </div>
                    <div>
                      <span className="text-muted-foreground">CMB:</span> +{creature.cmb ?? 0}
                      {creature.cmb_other && <span className="text-xs"> ({creature.cmb_other})</span>}
                    </div>
                    <div>
                      <span className="text-muted-foreground">CMD:</span> {creature.cmd ?? 10}
                      {creature.cmd_other && <span className="text-xs"> ({creature.cmd_other})</span>}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Space/Reach:</span> {creature.space ?? 5}/{creature.reach ?? 5} ft.
                    </div>
                  </div>
                </div>

                {/* Senses */}
                {creature.senses && (
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Senses
                    </h3>
                    <div className="text-sm">
                      {Object.entries(creature.senses)
                        .map(([sense, value]) => {
                          if (value === true) return sense;
                          if (typeof value === 'number') return `${sense} ${value} ft.`;
                          return null;
                        })
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Defense */}
              <div className="space-y-4">
                {/* AC Details */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Armor Class
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">AC:</span> {creature.ac?.AC ?? '-'}
                      {creature.ac?.components && Object.keys(creature.ac.components).length > 0 && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({Object.entries(creature.ac.components)
                            .map(([type, value]) => `${value >= 0 ? '+' : ''}${value} ${type}`)
                            .join(', ')})
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Touch:</span> {creature.ac?.touch ?? '-'} •
                      <span className="font-medium ml-2">Flat-footed:</span> {creature.ac?.flat_footed ?? '-'}
                    </div>
                  </div>
                </div>

                {/* Defenses */}
                {(creature.dr?.length > 0 || creature.sr || creature.resistances ||
                  creature.immunities_normalized?.length > 0 || creature.weaknesses_normalized?.length > 0) && (
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Defenses
                    </h3>
                    <div className="space-y-2 text-sm">
                      {creature.sr && (
                        <div><span className="font-medium">SR:</span> {creature.sr}</div>
                      )}
                      {creature.dr?.length > 0 && (
                        <div>
                          <span className="font-medium">DR:</span> {
                            creature.dr.map(dr => `${dr.amount}/${dr.weakness}`).join(', ')
                          }
                        </div>
                      )}
                      {creature.resistances && Object.keys(creature.resistances).length > 0 && (
                        <div>
                          <span className="font-medium">Resist:</span> {
                            Object.entries(creature.resistances)
                              .map(([type, value]) => `${type} ${value}`)
                              .join(', ')
                          }
                        </div>
                      )}
                      {creature.immunities_normalized?.length > 0 && (
                        <div>
                          <span className="font-medium">Immune:</span> {creature.immunities_normalized.join(', ')}
                        </div>
                      )}
                      {creature.weaknesses_normalized?.length > 0 && (
                        <div>
                          <span className="font-medium">Weak:</span> {creature.weaknesses_normalized.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ability Scores */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Ability Scores
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(ability => {
                      const score = creature.ability_scores[ability as keyof typeof creature.ability_scores];
                      return (
                        <div key={ability} className="text-center">
                          <div className="text-xs text-muted-foreground">{ability}</div>
                          <div className="font-bold">{score ?? '—'}</div>
                          <div className="text-xs text-muted-foreground">{getModifier(score)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Auras */}
                {creature.auras_normalized?.length > 0 && (
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-sm mb-3">Auras</h3>
                    <div className="text-sm">{creature.auras_normalized.join(', ')}</div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Abilities Tab - Spells, special abilities, feats, skills */}
          <TabsContent value="abilities" className="p-6 space-y-4 mt-0">
            {/* Spells - Collapsible */}
            {creature.spells?.entries?.length > 0 && (
              <div className="bg-white rounded-lg border">
                <button
                  onClick={() => toggleSection('spells')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    Spells ({creature.spells.entries.length} known)
                  </h3>
                  {expandedSections.spells ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {expandedSections.spells && (
                  <div className="px-4 pb-4 border-t">
                    {creature.spells.sources?.map((source, sidx) => (
                      <div key={sidx} className="text-xs text-muted-foreground mt-3 mb-2">
                        {source.name} {source.type && `(${source.type})`}
                        {source.concentration && ` • Concentration +${source.concentration}`}
                      </div>
                    ))}
                    <div className="space-y-2">
                      {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(level => {
                        const levelSpells = creature.spells.entries.filter(s => s.level === level);
                        if (levelSpells.length === 0) return null;
                        return (
                          <div key={level} className="text-sm">
                            <span className="font-medium">
                              {level === 0 ? 'Cantrips' : `Level ${level}`}:
                            </span>{' '}
                            {levelSpells.map((spell, idx) => (
                              <span key={idx}>
                                {idx > 0 && ', '}
                                <span className={spell.is_mythic_spell ? 'text-purple-600 font-medium' : ''}>
                                  {spell.name}
                                  {spell.DC && ` (DC ${spell.DC})`}
                                </span>
                              </span>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Spell-Like Abilities */}
            {creature.spell_like_abilities?.entries?.length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Spell-Like Abilities</h3>
                <div className="text-sm space-y-1">
                  {Object.entries(
                    creature.spell_like_abilities.entries.reduce((acc, spell) => {
                      const freq = spell.frequency || 'Other';
                      if (!acc[freq]) acc[freq] = [];
                      acc[freq].push(spell);
                      return acc;
                    }, {} as Record<string, any[]>)
                  ).map(([frequency, spells]) => (
                    <div key={frequency}>
                      <span className="font-medium">{frequency}:</span>{' '}
                      {spells.map((spell, idx) => (
                        <span key={idx}>
                          {idx > 0 && ', '}
                          {spell.name}
                          {spell.DC && ` (DC ${spell.DC})`}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Abilities */}
            {creature.special_abilities?._parsed?.length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Special Abilities
                </h3>
                <div className="space-y-3">
                  {creature.special_abilities._parsed.map((ability, idx) => (
                    <div key={idx} className="pb-3 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{ability.name}</span>
                        {ability.type && (
                          <Badge variant="outline" className="text-xs">{ability.type}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{ability.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feats */}
            {creature.feats?.length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Feats</h3>
                <div className="text-sm">{creature.feats.join(', ')}</div>
              </div>
            )}

            {/* Skills */}
            {creature.skills && Object.keys(creature.skills).filter(k => !k.startsWith('_')).length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Skills</h3>
                <div className="text-sm grid grid-cols-2 gap-2">
                  {Object.entries(creature.skills)
                    .filter(([key]) => !key.startsWith('_'))
                    .map(([skill, value]) => (
                      <div key={skill}>
                        <span className="text-muted-foreground">{skill}:</span> +{value}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {creature.languages?.length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Languages</h3>
                <div className="text-sm">{creature.languages.join(', ')}</div>
              </div>
            )}

            {/* Special Qualities */}
            {creature.special_qualities_normalized?.length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Special Qualities</h3>
                <div className="text-sm">{creature.special_qualities_normalized.join(', ')}</div>
              </div>
            )}
          </TabsContent>

          {/* Details Tab - Lore, ecology, gear, tactics */}
          <TabsContent value="details" className="p-6 space-y-4 mt-0">
            {/* Description */}
            {(creature.desc_short || creature.desc_long) && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Description</h3>
                {creature.desc_short && (
                  <p className="text-sm text-muted-foreground italic mb-3">{creature.desc_short}</p>
                )}
                {creature.desc_long && (
                  <p className="text-sm whitespace-pre-wrap">{creature.desc_long}</p>
                )}
              </div>
            )}

            {/* Ecology */}
            {(creature.environment || creature.ecology?.organization || creature.ecology?.treasure_type) && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Ecology</h3>
                <div className="space-y-2 text-sm">
                  {creature.environment && (
                    <div>
                      <span className="font-medium">Environment:</span> {creature.environment}
                    </div>
                  )}
                  {creature.ecology?.organization && (
                    <div>
                      <span className="font-medium">Organization:</span> {creature.ecology.organization}
                    </div>
                  )}
                  {creature.ecology?.treasure_type && (
                    <div>
                      <span className="font-medium">Treasure:</span> {creature.ecology.treasure_type}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tactics - Collapsible */}
            {creature.tactics && (
              <div className="bg-white rounded-lg border">
                <button
                  onClick={() => toggleSection('tactics')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-sm">Combat Tactics</h3>
                  {expandedSections.tactics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {expandedSections.tactics && (
                  <div className="px-4 pb-4 border-t space-y-2 text-sm">
                    {creature.tactics.before_combat && (
                      <div>
                        <span className="font-medium">Before Combat:</span> {creature.tactics.before_combat}
                      </div>
                    )}
                    {creature.tactics.during_combat && (
                      <div>
                        <span className="font-medium">During Combat:</span> {creature.tactics.during_combat}
                      </div>
                    )}
                    {creature.tactics.morale && (
                      <div>
                        <span className="font-medium">Morale:</span> {creature.tactics.morale}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Gear - Collapsible */}
            {creature.gear?.gear?.length > 0 && (
              <div className="bg-white rounded-lg border">
                <button
                  onClick={() => toggleSection('gear')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Equipment & Gear ({creature.gear.gear.length} items)
                  </h3>
                  {expandedSections.gear ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {expandedSections.gear && (
                  <div className="px-4 pb-4 border-t">
                    <div className="text-sm">{creature.gear.gear.join(', ')}</div>
                  </div>
                )}
              </div>
            )}

            {/* Sources */}
            {creature.sources?.length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Sources</h3>
                <div className="space-y-2">
                  {creature.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span>{source.name}, p. {source.page}</span>
                      {source.link && (
                        <a href={source.link} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline">
                          View →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* JSON Tab */}
          <TabsContent value="json" className="p-6 mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Raw JSON Data</h3>
                <Button
                  onClick={handleCopyJson}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {jsonCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-4 max-h-[600px] overflow-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                  {JSON.stringify(creature, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}