import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Sword, Shield, Heart, Zap, Brain, Eye, MessageSquare, Footprints,
  Sparkles, ShieldCheck, AlertTriangle, Target, Activity, Globe,
  BookOpen, Coins, Users, MapPin, Skull, Star, Code, ArrowLeft, Copy,
  ChevronDown, ChevronRight, Gauge, ScrollText, Swords, Package
} from 'lucide-react';

interface CreatureDetailMainProps {
  creature: CreatureEnriched | null;
  onBack: () => void;
}

export function CreatureDetailMain({ creature, onBack }: CreatureDetailMainProps) {

  if (!creature) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-primary mb-2">Select a creature</h2>
          <p>Choose a creature from the list to view details</p>
        </div>
      </div>
    );
  }

  // Use the display value from cr_parsed if available, otherwise use the cr value
  const crDisplay = creature.cr_parsed?.display ?? creature.cr?.toString() ?? '-';

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(creature, null, 2));
    toast.success('JSON copied to clipboard');
  };


  // Helper functions
  const getDefaultSpellDC = (spellLevel: number) => {
    const intMod = Math.floor(((creature.ability_scores.INT ?? 10) - 10) / 2);
    const wisMod = Math.floor(((creature.ability_scores.WIS ?? 10) - 10) / 2);
    const chaMod = Math.floor(((creature.ability_scores.CHA ?? 10) - 10) / 2);
    const abilityModifier = Math.max(intMod, wisMod, chaMod);
    return 10 + spellLevel + abilityModifier;
  };

  const formatModifier = (score: number | null | undefined) => {
    if (!score) return '+0';
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const formatSave = (save: number | undefined) => {
    if (save === undefined) return '—';
    return save >= 0 ? `+${save}` : `${save}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-surface-secondary">
      {/* Enhanced Header */}
      <div className="bg-surface-primary border-b p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="hover:bg-surface-secondary -ml-2 mt-0.5">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">{creature.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {creature.alignment && <span>{creature.alignment} </span>}
                {creature.size} {creature.type}
                {creature.subtypes_normalized?.length > 0 && (
                  <span> ({creature.subtypes_normalized.join(', ')})</span>
                )}
              </p>
              {creature.race_class?.raw && (
                <p className="text-xs text-muted-foreground mt-0.5">{creature.race_class.raw}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Badge variant="default" className="text-lg px-3 py-1">
                CR {crDisplay}
              </Badge>
              {creature.mr && (
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  MR {creature.mr}
                </Badge>
              )}
            </div>
            {creature.xp && (
              <div className="text-sm text-muted-foreground mt-1">{creature.xp.toLocaleString()} XP</div>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Combat Stats Section */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Sword className="h-5 w-5" />
              Combat Statistics
            </h2>

            {/* Dense stat block */}
            <div className="bg-surface-secondary rounded-lg border p-4 text-sm space-y-3">
              {/* Row 1: HP, AC, Init, Speed */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-muted-foreground">HP:</span>
                  <span className="font-semibold text-base ml-1">{creature.hp?.total ?? '—'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">AC:</span>
                  <span className="font-semibold text-base ml-1">{creature.ac?.AC ?? '—'}</span>
                  {creature.ac?.touch && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Touch: {creature.ac.touch} • Flat: {creature.ac.flat_footed}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Init:</span>
                  <span className="font-semibold text-base ml-1">{formatSave(creature.initiative_parsed?.value ?? creature.initiative)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Speed:</span>
                  <span className="font-semibold text-base ml-1">{creature.speeds?.base ?? 30}ft</span>
                  {creature.speeds?.fly && <span className="text-xs">, fly {creature.speeds.fly}ft</span>}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Row 2: Abilities - Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability) => (
                      <TableHead key={ability} className="text-center text-xs">{ability}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ability) => {
                      const score = creature.ability_scores[ability as keyof typeof creature.ability_scores];
                      return (
                        <TableCell key={ability} className="text-center p-2">
                          <div className="font-bold text-base">{score ?? '—'}</div>
                          <div className="text-xs text-tertiary">{formatModifier(score)}</div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>

              <Separator className="my-2" />

              {/* Row 3: Saves, Combat, Space */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <span className="text-muted-foreground">Saves:</span>
                  <div className="mt-0.5">
                    <span className="inline-block mr-3">Fort <strong>{formatSave(creature.saves?.fort)}</strong></span>
                    <span className="inline-block mr-3">Ref <strong>{formatSave(creature.saves?.ref)}</strong></span>
                    <span className="inline-block">Will <strong>{formatSave(creature.saves?.will)}</strong></span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Combat:</span>
                  <div className="mt-0.5">
                    <span className="inline-block mr-2">BAB <strong>+{creature.bab ?? 0}</strong></span>
                    <span className="inline-block mr-2">CMB <strong>+{creature.cmb ?? 0}</strong></span>
                    <span className="inline-block">CMD <strong>{creature.cmd ?? 10}</strong></span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Space/Reach:</span>
                  <span className="ml-1 font-semibold">{creature.space ?? 5}ft/{creature.reach ?? 5}ft</span>
                </div>
              </div>

              {/* Attacks */}
              {(creature.attacks?.melee?.length || creature.attacks?.ranged?.length) && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-1">
                    {creature.attacks.melee?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Melee:</span>
                        <div className="ml-2 mt-0.5 text-primary">{creature.attacks.melee.join(', ')}</div>
                      </div>
                    )}
                    {creature.attacks.ranged?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Ranged:</span>
                        <div className="ml-2 mt-0.5 text-primary">{creature.attacks.ranged.join(', ')}</div>
                      </div>
                    )}
                    {creature.attacks.special?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Special:</span>
                        <div className="ml-2 mt-0.5 text-primary">{creature.attacks.special.join(', ')}</div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Defenses */}
              {(creature.sr || creature.dr?.length || creature.immunities_normalized?.length || creature.resistances || creature.weaknesses_normalized?.length) && (
                <>
                  <Separator className="my-3" />
                  <div className="space-y-1">
                    {creature.sr && (
                      <div><span className="text-muted-foreground">SR:</span> <span className="font-semibold ml-1">{creature.sr}</span></div>
                    )}
                    {creature.dr?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">DR:</span>
                        <span className="ml-1">{creature.dr.map(dr => `${dr.amount}/${dr.types?.join(' and ') || 'special'}`).join(', ')}</span>
                      </div>
                    )}
                    {creature.immunities_normalized?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Immune:</span>
                        <span className="ml-1">{creature.immunities_normalized.join(', ')}</span>
                      </div>
                    )}
                    {creature.resistances && Object.keys(creature.resistances).length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Resist:</span>
                        <span className="ml-1">{Object.entries(creature.resistances).map(([type, value]) => `${type} ${value}`).join(', ')}</span>
                      </div>
                    )}
                    {creature.weaknesses_normalized?.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Weak:</span>
                        <span className="ml-1">{creature.weaknesses_normalized.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Senses */}
              {creature.senses && Object.keys(creature.senses).length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <span className="text-muted-foreground">Senses:</span>
                    <span className="ml-1">{Object.entries(creature.senses).map(([sense, value]) => `${sense}${typeof value === 'number' ? ` ${value}ft` : ''}`).join(', ')}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Abilities Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Abilities & Powers
            </h2>
            {/* Spells - Compact */}
            {creature.spells?.entries?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-3">
                <div className="text-sm">
                  <span className="font-semibold text-primary text-base">Spells</span>
                  {creature.spells.sources?.map((source, sidx) => (
                    <span key={sidx} className="text-muted-foreground text-xs ml-2">
                      ({source.name}{source.type && `, ${source.type}`})
                    </span>
                  ))}
                  <div className="mt-2 space-y-1">
                    {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(level => {
                      const levelSpells = creature.spells.entries.filter(s => s.level === level);
                      if (levelSpells.length === 0) return null;
                      const defaultDC = getDefaultSpellDC(level);
                      return (
                        <div key={level} className="text-primary">
                          <span className="font-medium text-muted-foreground">
                            {level === 0 ? `Cantrips` : `Level ${level}`}
                          </span>
                          <span className="text-xs text-muted-foreground ml-1">(DC {defaultDC}):</span>
                          {' '}
                          {levelSpells.map((spell, idx) => (
                            <span key={idx}>
                              {idx > 0 && ', '}
                              <span className={spell.is_mythic_spell ? 'text-interactive-primary font-semibold' : ''}>
                                {spell.name}
                                {spell.DC && spell.DC !== defaultDC && <sup className="text-xs text-tertiary"> DC{spell.DC}</sup>}
                              </span>
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Spell-Like Abilities - Compact */}
            {creature.spell_like_abilities?.entries?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-3">
                <div className="text-sm text-primary">
                  <span className="font-semibold text-primary text-base">Spell-Like Abilities</span>
                  <div className="mt-2 space-y-1">
                    {Object.entries(
                      creature.spell_like_abilities.entries.reduce((acc, spell) => {
                        const freq = spell.frequency || 'Other';
                        if (!acc[freq]) acc[freq] = [];
                        acc[freq].push(spell);
                        return acc;
                      }, {} as Record<string, any[]>)
                    ).map(([frequency, spells]) => (
                      <div key={frequency}>
                        <span className="font-medium text-muted-foreground">{frequency}:</span>{' '}
                        {spells.map((spell, idx) => (
                          <span key={idx}>
                            {idx > 0 && ', '}
                            {spell.name}{spell.DC && ` (DC ${spell.DC})`}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Special Abilities - Paragraph Flow */}
            {creature.special_abilities?._parsed?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-3">
                <div className="text-sm">
                  <span className="font-semibold text-primary text-base">Special Abilities</span>
                  <div className="mt-2 text-primary space-y-2">
                    {creature.special_abilities._parsed.map((ability, idx) => (
                      <div key={idx}>
                        <strong>{ability.name}</strong>
                        {ability.type && <span className="text-muted-foreground text-xs ml-1">({ability.type})</span>}
                        <p className="text-muted-foreground mt-0.5">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Feats - Inline */}
            {creature.feats?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-3">
                <div className="text-sm text-primary">
                  <span className="font-semibold text-primary text-base">Feats</span>
                  <div className="mt-1">{creature.feats.join(', ')}</div>
                </div>
              </div>
            )}

            {/* Skills - Compact List */}
            {creature.skills && Object.keys(creature.skills).filter(k => !k.startsWith('_')).length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-3">
                <div className="text-sm text-primary">
                  <span className="font-semibold text-primary text-base">Skills</span>
                  <div className="mt-1">
                    {Object.entries(creature.skills)
                      .filter(([key]) => !key.startsWith('_'))
                      .map(([skill, value]) => `${skill} +${value}`)
                      .join(', ')}
                  </div>
                </div>
              </div>
            )}

            {/* Languages - Inline */}
            {creature.languages?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-3">
                <div className="text-sm text-primary">
                  <span className="font-semibold text-primary text-base">Languages</span>
                  <div className="mt-1">{creature.languages.join(', ')}</div>
                </div>
              </div>
            )}

            {/* Special Qualities - Inline */}
            {creature.special_qualities_normalized?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-3">
                <div className="text-sm text-primary">
                  <span className="font-semibold text-primary text-base">Special Qualities</span>
                  <div className="mt-1">{creature.special_qualities_normalized.join(', ')}</div>
                </div>
              </div>
            )}
          </div>

          {/* Details Section - Lore, ecology, gear, tactics */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Details & Lore
            </h2>
            {/* Description */}
            {(creature.desc_short || creature.desc_long) && (
              <div className="bg-surface-primary rounded-lg border p-4">
                <h3 className="font-semibold text-lg mb-2 text-primary">Description</h3>
                {creature.desc_short && (
                  <p className="text-sm text-muted-foreground italic mb-3">{creature.desc_short}</p>
                )}
                {creature.desc_long && (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{creature.desc_long}</p>
                )}
              </div>
            )}

            {/* Ecology */}
            {(creature.environment || creature.ecology?.organization || creature.ecology?.treasure_type) && (
              <div className="bg-surface-primary rounded-lg border p-4">
                <h3 className="font-semibold text-lg mb-2 text-primary">Ecology</h3>
                <div className="space-y-1.5 text-sm">
                  {creature.environment && (
                    <div>
                      <span className="font-medium text-primary">Environment:</span> {creature.environment}
                    </div>
                  )}
                  {creature.ecology?.organization && (
                    <div>
                      <span className="font-medium text-primary">Organization:</span> {creature.ecology.organization}
                    </div>
                  )}
                  {creature.ecology?.treasure_type && (
                    <div>
                      <span className="font-medium text-primary">Treasure:</span> {creature.ecology.treasure_type}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tactics & Gear - Accordion */}
            {(creature.tactics || creature.gear?.gear?.length > 0) && (
              <Accordion type="single" collapsible className="space-y-3">
                {creature.tactics && (
                  <AccordionItem value="tactics" className="bg-surface-primary rounded-lg border">
                    <AccordionTrigger className="px-4 py-3 hover:bg-surface-secondary rounded-t-lg">
                      <h3 className="font-semibold text-base text-primary">Combat Tactics</h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 space-y-2 text-sm">
                      {creature.tactics.before_combat && (
                        <div>
                          <span className="font-medium text-primary">Before Combat:</span> {creature.tactics.before_combat}
                        </div>
                      )}
                      {creature.tactics.during_combat && (
                        <div>
                          <span className="font-medium text-primary">During Combat:</span> {creature.tactics.during_combat}
                        </div>
                      )}
                      {creature.tactics.morale && (
                        <div>
                          <span className="font-medium text-primary">Morale:</span> {creature.tactics.morale}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}

                {creature.gear?.gear?.length > 0 && (
                  <AccordionItem value="gear" className="bg-surface-primary rounded-lg border">
                    <AccordionTrigger className="px-4 py-3 hover:bg-surface-secondary rounded-t-lg">
                      <h3 className="font-semibold text-base text-primary flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Equipment & Gear ({creature.gear.gear.length} items)
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <div className="text-sm leading-relaxed">{creature.gear.gear.join(', ')}</div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            )}

            {/* Sources */}
            {creature.sources?.length > 0 && (
              <div className="bg-surface-primary rounded-lg border p-4">
                <h3 className="font-semibold text-lg mb-2 text-primary">Sources</h3>
                <div className="space-y-1.5">
                  {creature.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span>{source.name}, p. {source.page}</span>
                      {source.link && (
                        <a href={source.link} target="_blank" rel="noopener noreferrer"
                           className="text-status-info hover:underline">
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
          <Separator className="my-6" />
          <div>
            <Collapsible className="bg-surface-secondary rounded-lg border">
              <div className="p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Raw JSON Data
                </h2>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleCopyJson}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent>
                <Separator />
                <div className="p-4">
                  <div className="bg-slate-950 dark:bg-slate-900 border border-slate-800 dark:border-slate-700 rounded-lg p-4 max-h-[600px] overflow-auto font-mono text-sm">
                    <pre className="text-slate-300 dark:text-slate-400 whitespace-pre-wrap break-words leading-relaxed">
                      {JSON.stringify(creature, null, 2)}
                    </pre>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}