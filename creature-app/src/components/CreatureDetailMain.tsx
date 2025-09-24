import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { StatBlock } from './StatBlock';
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
    gear: false,
    tactics: false,
    json: false
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

  // Helper function to calculate default spell DC for a given level
  const getDefaultSpellDC = (spellLevel: number) => {
    // Calculate default DC: 10 + spell level + casting ability modifier
    const intMod = Math.floor(((creature.ability_scores.INT ?? 10) - 10) / 2);
    const wisMod = Math.floor(((creature.ability_scores.WIS ?? 10) - 10) / 2);
    const chaMod = Math.floor(((creature.ability_scores.CHA ?? 10) - 10) / 2);

    // Use the highest mental ability modifier as default
    const abilityModifier = Math.max(intMod, wisMod, chaMod);

    return 10 + spellLevel + abilityModifier;
  };

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary">
      {/* Enhanced Header */}
      <div className="bg-surface-primary border-b p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-surface-secondary -ml-2 mt-1">
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
          <div className="bg-surface-secondary rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">HP</div>
            <div className="font-bold">{creature.hp?.total ?? '-'}</div>
          </div>
          <div className="bg-surface-secondary rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">AC</div>
            <div className="font-bold">{creature.ac?.AC ?? creature.ac ?? '-'}</div>
          </div>
          <div className="bg-surface-secondary rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Fort</div>
            <div className="font-bold">
              {creature.saves?.fort !== undefined ? `${creature.saves.fort >= 0 ? '+' : ''}${creature.saves.fort}` : '-'}
            </div>
          </div>
          <div className="bg-surface-secondary rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Ref</div>
            <div className="font-bold">
              {creature.saves?.ref !== undefined ? `${creature.saves.ref >= 0 ? '+' : ''}${creature.saves.ref}` : '-'}
            </div>
          </div>
          <div className="bg-surface-secondary rounded px-3 py-2 text-center">
            <div className="text-xs text-muted-foreground">Will</div>
            <div className="font-bold">
              {creature.saves?.will !== undefined ? `${creature.saves.will >= 0 ? '+' : ''}${creature.saves.will}` : '-'}
            </div>
          </div>
          <div className="bg-surface-secondary rounded px-3 py-2 text-center">
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

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Combat Stats Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Combat Statistics
            </h2>
            <StatBlock creature={creature} />
          </div>

          {/* Abilities Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-t pt-6">
              <Sparkles className="h-5 w-5" />
              Abilities & Powers
            </h2>
            {/* Spells */}
            {creature.spells?.entries?.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-purple-600" />
                  Spells
                </h3>
                {creature.spells.sources?.map((source, sidx) => (
                  <div key={sidx} className="text-xs text-secondary mb-3">
                    {source.name} {source.type && `(${source.type})`}
                    {source.concentration && ` • Concentration +${source.concentration}`}
                  </div>
                ))}
                <div className="grid gap-2">
                  {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(level => {
                    const levelSpells = creature.spells.entries.filter(s => s.level === level);
                    if (levelSpells.length === 0) return null;
                    const defaultDC = getDefaultSpellDC(level);
                    return (
                      <div key={level} className="flex flex-wrap items-start gap-2">
                        <Badge variant="outline" className="text-xs font-semibold min-w-[80px] justify-center">
                          {level === 0 ? `Cantrip DC ${defaultDC}` : `${level}th DC ${defaultDC}`}
                        </Badge>
                        <div className="flex-1 text-sm">
                          {levelSpells.map((spell, idx) => (
                            <span key={idx}>
                              {idx > 0 && ' • '}
                              <span className={spell.is_mythic_spell ? 'text-purple-600 font-semibold' : ''}>
                                {spell.name}
                                {spell.DC && (
                                  <span className="text-xs text-tertiary"> DC {spell.DC}</span>
                                )}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spell-Like Abilities */}
            {creature.spell_like_abilities?.entries?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-4">
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
              <div className="bg-surface-primary rounded-lg border p-4">
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
              <div className="bg-surface-primary rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Feats</h3>
                <div className="text-sm">{creature.feats.join(', ')}</div>
              </div>
            )}

            {/* Skills */}
            {creature.skills && Object.keys(creature.skills).filter(k => !k.startsWith('_')).length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-4">
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
              <div className="bg-surface-primary rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Languages</h3>
                <div className="text-sm">{creature.languages.join(', ')}</div>
              </div>
            )}

            {/* Special Qualities */}
            {creature.special_qualities_normalized?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Special Qualities</h3>
                <div className="text-sm">{creature.special_qualities_normalized.join(', ')}</div>
              </div>
            )}
          </div>

          {/* Details Section - Lore, ecology, gear, tactics */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 border-t pt-6">
              <BookOpen className="h-5 w-5" />
              Details & Lore
            </h2>
            {/* Description */}
            {(creature.desc_short || creature.desc_long) && (
              <div className="bg-surface-primary rounded-lg border p-4">
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
              <div className="bg-surface-primary rounded-lg border p-4">
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
              <div className="bg-surface-primary rounded-lg border">
                <button
                  onClick={() => toggleSection('tactics')}
                  className="w-full p-4 flex items-center justify-between hover:bg-surface-secondary"
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
              <div className="bg-surface-primary rounded-lg border">
                <button
                  onClick={() => toggleSection('gear')}
                  className="w-full p-4 flex items-center justify-between hover:bg-surface-secondary"
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
              <div className="bg-surface-primary rounded-lg border p-4">
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
          </div>

          {/* Raw JSON Section - Collapsible */}
          <div className="mt-8 border-t pt-6">
            <div className="bg-surface-secondary rounded-xl border">
              <button
                onClick={() => toggleSection('json')}
                className="w-full p-4 flex items-center justify-between hover:bg-surface-tertiary rounded-t-xl"
              >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Raw JSON Data
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyJson();
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {jsonCopied ? 'Copied!' : 'Copy'}
                  </Button>
                  {expandedSections.json ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </button>
              {expandedSections.json && (
                <div className="p-4 border-t">
                  <div className="bg-slate-900 text-inverse rounded-lg p-4 max-h-[600px] overflow-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(creature, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}