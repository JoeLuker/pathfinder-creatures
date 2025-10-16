import type { CreatureEnriched } from '@/types/creature-complete';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Copy, ScrollText, BookOpen, Shield, Swords, BarChart3, Sparkles, Globe, Brain, Flame, Package } from 'lucide-react';
import { EmptyState } from './creature-detail/EmptyState';
import { StatBlockSection } from './creature-detail/StatBlockSection';
import { StatRow } from './creature-detail/StatRow';
import { InfoList } from './creature-detail/InfoList';
import { AlternateFormDisplay } from './AlternateFormDisplay';
import { formatModifier, formatAbilityScore } from '@/lib/formatters';
import {
  getAC, getTouchAC, getFlatFootedAC, getHP, getHPDetails,
  getFortSave, getRefSave, getWillSave, getAbilityScore,
  getPerception, getCR, getXP, getInitiative, getMovementSpeeds
} from '@/lib/creature-utils';
import { SemanticBadge } from '@/components/ui/semantic-badge';

interface CreatureDetailMainProps {
  creature: CreatureEnriched | null;
  onBack: () => void;
}

export function CreatureDetailMain({ creature, onBack }: CreatureDetailMainProps) { // noqa
  if (!creature) {
    return <EmptyState />;
  }

  const crDisplay = getCR(creature); // noqa

  // Swipe gesture handling for mobile navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 100; // Swipe left threshold

    if (isLeftSwipe) {
      onBack();
    }
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(creature, null, 2));
      toast.success('JSON copied to clipboard');
    } catch (err) {
      toast.error('Could not copy to clipboard');
    }
  };

  return (
    <div
      className="flex-1 flex flex-col bg-background"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced Header */}
      <div className="bg-gradient-to-b from-surface-secondary to-surface-primary border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-3 md:px-6 py-3 md:py-5">
          <div className="flex items-start justify-between gap-2 md:gap-4">
            <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="mt-0.5 md:mt-1.5 hover:bg-surface-tertiary flex-shrink-0 md:px-2"
              >
                <ArrowLeft className="h-4 w-4 md:mr-0" />
                <span className="md:hidden ml-1">Back</span>
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-3xl font-bold text-text-primary mb-2 md:mb-3 break-words">
                  {creature.name}
                  {creature['is_3.5'] && (
                    <Badge className="ml-2 bg-interactive-primary text-text-inverse text-xs">
                      3.5e
                    </Badge>
                  )}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm mb-2 md:mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-interactive-primary text-text-inverse border-0 px-2 md:px-3 py-1">
                      CR {crDisplay}
                    </Badge>
                    {creature.mr && (
                      <Badge className="bg-purple-600 text-text-inverse border-0 px-2 md:px-3 py-1">
                        MR {creature.mr}
                      </Badge>
                    )}
                    <span className="text-text-secondary font-medium text-xs md:text-sm">
                      {getXP(creature).toLocaleString()} XP
                    </span>
                  </div>
                  <div className="hidden md:block h-4 w-px bg-border" />
                  <div className="text-text-secondary font-medium text-xs md:text-sm w-full md:w-auto">
                    {creature.alignment || 'N'} {creature.size} {creature.type}
                    {creature.subtypes_normalized && creature.subtypes_normalized.length > 0 && (
                      <span className="text-text-tertiary"> ({creature.subtypes_normalized.join(', ')})</span>
                    )}
                  </div>
                </div>
                {/* Race and Class info */}
                {creature.race_class && (
                  <div className="text-sm text-text-secondary mb-1">
                    {creature.race_class.race && (
                      <span className="mr-3">
                        <span className="text-text-tertiary">Race:</span> {creature.race_class.race}
                      </span>
                    )}
                    {creature.race_class.class && Array.isArray(creature.race_class.class) && creature.race_class.class.length > 0 && (
                      <span>
                        <span className="text-text-tertiary">Class:</span> {creature.race_class.class?.map((c: any) =>
                          `${c.name} ${c.level}`
                        ).join(', ')}
                      </span>
                    )}
                  </div>
                )}
                {creature.desc_short && (
                  <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
                    {creature.desc_short}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={handleCopyJson}
              variant="outline"
              size="sm"
              className="hover:bg-surface-tertiary flex-shrink-0"
            >
              <Copy className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Copy JSON</span>
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 md:p-6">
          <div className="space-y-2">
            {/* Quick Stats Bar */}
            <Card className="p-3 md:p-5 mb-4 md:mb-6 bg-gradient-to-r from-surface-secondary/60 to-surface-primary/60 border-border shadow-sm">
              <div className="flex items-center gap-3 md:gap-8 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary font-medium text-xs md:text-sm">Initiative</span>
                  <Badge variant="outline" className="font-mono font-semibold px-2 md:px-2.5 py-0.5 md:py-1 text-xs md:text-sm">
                    {formatModifier(getInitiative(creature))}
                  </Badge>
                </div>

                {creature.senses && Object.keys(creature.senses).length > 0 && (
                  <>
                    <div className="hidden md:block h-6 w-px bg-border" />
                    <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                      <span className="text-text-secondary font-medium text-xs md:text-sm">Senses</span>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(creature.senses).map(([sense, value]) => (
                          <Badge key={sense} variant="secondary" className="text-xs font-medium">
                            {sense}{typeof value === 'number' ? ` ${value}ft` : ''}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="hidden md:block h-6 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary font-medium text-xs md:text-sm">Perception</span>
                  <Badge variant="outline" className="font-mono font-semibold px-2 md:px-2.5 py-0.5 md:py-1 text-xs md:text-sm">
                    {formatModifier(getPerception(creature))}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* DEFENSE Section */}
            <StatBlockSection title="Defense" icon={Shield}>
              <StatRow label="Armor Class">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <SemanticBadge semantic="defense">
                      {getAC(creature)}
                    </SemanticBadge>
                    {getTouchAC(creature) && (
                      <span className="text-sm text-text-secondary">
                        touch {getTouchAC(creature)}
                      </span>
                    )}
                    {getFlatFootedAC(creature) && (
                      <span className="text-sm text-text-secondary">
                        flat-footed {getFlatFootedAC(creature)}
                      </span>
                    )}
                  </div>
                  {creature.ac_data?.components && (
                    <div className="text-xs text-text-tertiary">
                      ({[
                        creature.ac_data.components.natural && `+${creature.ac_data.components.natural} natural`,
                        creature.ac_data.components.armor && `+${creature.ac_data.components.armor} armor`,
                        creature.ac_data.components.shield && `+${creature.ac_data.components.shield} shield`,
                        creature.ac_data.components.dex && `+${creature.ac_data.components.dex} Dex`,
                        creature.ac_data.components.size && `${creature.ac_data.components.size > 0 ? '+' : ''}${creature.ac_data.components.size} size`,
                        creature.ac_data.components.deflection && `+${creature.ac_data.components.deflection} deflection`,
                        creature.ac_data.components.dodge && `+${creature.ac_data.components.dodge} dodge`,
                        creature.ac_data.components.insight && `+${creature.ac_data.components.insight} insight`,
                        creature.ac_data.components.luck && `+${creature.ac_data.components.luck} luck`,
                        creature.ac_data.components.sacred && `+${creature.ac_data.components.sacred} sacred`,
                        creature.ac_data.components.profane && `+${creature.ac_data.components.profane} profane`,
                        creature.ac_data.components.other && `+${creature.ac_data.components.other} other`
                      ].filter(Boolean).join(', ')})
                    </div>
                  )}
                </div>
              </StatRow>

              <StatRow label="Hit Points">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <SemanticBadge semantic="danger">
                      {getHP(creature)}
                    </SemanticBadge>
                    <span className="text-sm text-text-tertiary">
                      ({getHPDetails(creature)})
                    </span>
                  </div>
                  {/* HD details */}
                  {creature.HD && (
                    <div className="text-xs text-text-tertiary">
                      {creature.HD.racial && (
                        <span className="mr-2">
                          {creature.HD.racial.num}d{creature.HD.racial.die}
                          {creature.HD.racial.plus && ` +${creature.HD.racial.plus}`}
                        </span>
                      )}
                      {creature.HD.class && Array.isArray(creature.HD.class) && creature.HD.class.length > 0 && (
                        <span>
                          {creature.HD.class.map((hd: any, idx: number) => (
                            <span key={`hd-class-${hd.name}-${idx}`}>
                              {idx > 0 && ' + '}
                              {hd.num}d{hd.die} ({hd.name})
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Regeneration and Fast Healing */}
                  {(creature.regeneration || creature.fast_healing) && (
                    <div className="text-xs">
                      {creature.fast_healing && (
                        <Badge variant="secondary" className="text-xs mr-1">
                          Fast Healing {creature.fast_healing}
                        </Badge>
                      )}
                      {(creature.regeneration || creature.hp?.regeneration) && (
                        <Badge variant="secondary" className="text-xs">
                          Regeneration {creature.regeneration || creature.hp?.regeneration}
                          {(creature.regeneration_weakness || creature.hp?.regeneration_weakness) && ` (${creature.regeneration_weakness || creature.hp?.regeneration_weakness})`}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </StatRow>

              <StatRow label="Saving Throws">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-tertiary">Fort</span>
                    <SemanticBadge semantic="modifier" size="xs">
                      {formatModifier(getFortSave(creature))}
                    </SemanticBadge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-tertiary">Ref</span>
                    <SemanticBadge semantic="modifier" size="xs">
                      {formatModifier(getRefSave(creature))}
                    </SemanticBadge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-tertiary">Will</span>
                    <SemanticBadge semantic="modifier" size="xs">
                      {formatModifier(getWillSave(creature))}
                    </SemanticBadge>
                  </div>
                </div>
              </StatRow>

              {/* Auras */}
              {creature.auras_normalized && creature.auras_normalized.length > 0 && (
                <StatRow label="Auras">
                  <div className="flex gap-1 flex-wrap">
                    {creature.auras_normalized.map((aura: any, idx: number) => (
                      <Badge key={`aura-${aura.name}-${idx}`} variant="secondary" className="text-xs">
                        {aura.name}
                        {aura.radius && ` (${aura.radius} ft.)`}
                        {aura.DC && `, DC ${aura.DC}`}
                      </Badge>
                    ))}
                  </div>
                </StatRow>
              )}

              {/* Defensive Abilities */}
              {creature.defensive_abilities_normalized && creature.defensive_abilities_normalized.length > 0 && (
                <StatRow label="Defensive Abilities">
                  <div className="flex gap-1 flex-wrap">
                    {creature.defensive_abilities_normalized.map((ability, idx) => (
                      <Badge key={`defensive-ability-${ability}-${idx}`} variant="secondary" className="text-xs">
                        {ability}
                      </Badge>
                    ))}
                  </div>
                </StatRow>
              )}

              {/* DR and SR */}
              {(creature.dr || creature.sr) && (
                <StatRow label="Defenses">
                  <div className="flex items-center gap-2 flex-wrap">
                    {creature.dr && (
                      <Badge variant="secondary">
                        DR {typeof creature.dr === 'string'
                          ? creature.dr
                          : Array.isArray(creature.dr)
                            ? creature.dr.map((dr: any) => dr.amount && dr.weakness ? `${dr.amount}/${dr.weakness}` : JSON.stringify(dr)).join(', ')
                            : typeof creature.dr === 'object' && 'amount' in creature.dr && 'weakness' in creature.dr
                              ? `${creature.dr.amount}/${creature.dr.weakness}`
                              : JSON.stringify(creature.dr)
                        }
                      </Badge>
                    )}
                    {creature.sr && (
                      <Badge variant="secondary">SR {creature.sr}</Badge>
                    )}
                  </div>
                </StatRow>
              )}

              {/* Immunities */}
              {creature.immunities_normalized && creature.immunities_normalized.length > 0 && (
                <StatRow label="Immune">
                  <div className="flex gap-1 flex-wrap">
                    {creature.immunities_normalized.map((item, idx) => (
                      <Badge key={`immunity-${item}-${idx}`} variant="secondary" className="text-xs">
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                      </Badge>
                    ))}
                  </div>
                </StatRow>
              )}

              {/* Resistances */}
              {((creature.resistances_normalized && creature.resistances_normalized.length > 0) || (creature.resistances && Object.keys(creature.resistances).length > 0)) && (
                <StatRow label="Resist">
                  <div className="flex gap-1 flex-wrap">
                    {creature.resistances_normalized && creature.resistances_normalized.length > 0 ? (
                      creature.resistances_normalized.map((item, idx) => (
                        <Badge key={`resistance-${item}-${idx}`} variant="secondary" className="text-xs">
                          {typeof item === 'string' ? item : JSON.stringify(item)}
                        </Badge>
                      ))
                    ) : (
                      Object.entries(creature.resistances || {}).map(([type, value]) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type} {value}
                        </Badge>
                      ))
                    )}
                  </div>
                </StatRow>
              )}

              {/* Weaknesses */}
              {((creature.weaknesses_normalized && creature.weaknesses_normalized.length > 0) || creature.weaknesses) && (
                <StatRow label="Weaknesses">
                  <div className="flex gap-1 flex-wrap">
                    <Badge className="bg-status-error/10 text-status-error border-status-error/30 text-xs">
                      {creature.weaknesses_normalized && creature.weaknesses_normalized.length > 0
                        ? creature.weaknesses_normalized.join(', ')
                        : typeof creature.weaknesses === 'string'
                          ? creature.weaknesses
                          : Array.isArray(creature.weaknesses)
                            ? creature.weaknesses.map((w: any) => typeof w === 'string' ? w : `${w.weakness || ''} ${w.amount || ''}`).join(', ')
                            : 'unknown'
                      }
                    </Badge>
                  </div>
                </StatRow>
              )}
            </StatBlockSection>

            {/* OFFENSE Section */}
            <StatBlockSection title="Offense" icon={Swords}>
              <StatRow label="Movement">
                <div className="flex items-center gap-2 flex-wrap">
                  {(() => {
                    const speeds = getMovementSpeeds(creature);
                    return (
                      <>
                        <Badge variant="outline" className="text-xs">
                          {speeds.base} ft.
                        </Badge>
                        {speeds.fly && (
                          <Badge variant="outline" className="text-xs">
                            fly {speeds.fly} ft.
                          </Badge>
                        )}
                        {speeds.swim && (
                          <Badge variant="outline" className="text-xs">
                            swim {speeds.swim} ft.
                          </Badge>
                        )}
                        {speeds.climb && (
                          <Badge variant="outline" className="text-xs">
                            climb {speeds.climb} ft.
                          </Badge>
                        )}
                        {speeds.burrow && (
                          <Badge variant="outline" className="text-xs">
                            burrow {speeds.burrow} ft.
                          </Badge>
                        )}
                      </>
                    );
                  })()}
                </div>
              </StatRow>

              {creature.attacks?.melee && (
                <InfoList label="Melee" items={creature.attacks.melee} />
              )}

              {creature.attacks?.ranged && (
                <InfoList label="Ranged" items={creature.attacks.ranged} />
              )}

              {(creature.space !== 5 || creature.reach !== 5) && (
                <StatRow label="Space/Reach">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">
                      {creature.space ?? 5} ft. / {creature.reach ?? 5} ft.
                    </span>
                    {creature.reach_other && (
                      <span className="text-xs text-muted-foreground">
                        {creature.reach_other}
                      </span>
                    )}
                  </div>
                </StatRow>
              )}

              {/* Tactics */}
              {creature.tactics && (
                <StatRow label="Tactics">
                  <div className="text-sm space-y-2">
                    {Object.entries(creature.tactics).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-semibold capitalize text-text-secondary">{key}: </span>
                        <span className="text-text-primary">{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </StatRow>
              )}

              {((creature.special_attacks_normalized && creature.special_attacks_normalized.length > 0) || creature.attacks?.special) && (
                <InfoList
                  label="Special Attacks"
                  items={(creature.special_attacks_normalized && creature.special_attacks_normalized.length > 0)
                    ? creature.special_attacks_normalized
                    : creature.attacks?.special}
                />
              )}

              {/* Spell-Like Abilities */}
              {creature.spell_like_abilities?.entries && Array.isArray(creature.spell_like_abilities.entries) && creature.spell_like_abilities.entries.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-text-secondary mb-2">Spell-Like Abilities</p>
                  {creature.spell_like_abilities?.sources?.[0] && 'concentration' in creature.spell_like_abilities.sources[0] && (
                    <p className="text-xs text-muted-foreground mb-2">
                      CL {(creature.spell_like_abilities.sources[0] as any).CL || '—'}; concentration {formatModifier((creature.spell_like_abilities.sources[0] as any).concentration)}
                    </p>
                  )}
                  <div className="space-y-2">
                    {(() => {
                      // Group abilities by frequency
                      const groupedAbilities = creature.spell_like_abilities!.entries!.reduce((acc, ability) => {
                        const freq = ability.freq || 'At will';
                        if (!acc[freq]) acc[freq] = [];
                        acc[freq].push(ability);
                        return acc;
                      }, {} as Record<string, typeof creature.spell_like_abilities.entries>);

                      const freqOrder = ['Constant', 'At will', '3/day', '2/day', '1/day', '1/week', '1/month', '1/year'];
                      const sortedFreqs = Object.keys(groupedAbilities).sort((a, b) => {
                        const aIndex = freqOrder.findIndex(f => a.startsWith(f));
                        const bIndex = freqOrder.findIndex(f => b.startsWith(f));
                        if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
                        if (aIndex === -1) return 1;
                        if (bIndex === -1) return -1;
                        return aIndex - bIndex;
                      });

                      return sortedFreqs.map(freq => (
                        <div key={freq} className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {freq}
                          </Badge>
                          <div className="flex-1 flex flex-wrap gap-1">
                            {groupedAbilities[freq].map((ability, idx) => (
                              <span key={`sla-${freq}-${ability.name}-${idx}`} className="text-sm">
                                <span className="italic text-text-secondary">{ability.name}</span>
                                {ability.DC && (
                                  <span className="text-xs text-muted-foreground"> (DC {ability.DC})</span>
                                )}
                                {idx < groupedAbilities[freq].length - 1 && <span className="text-muted-foreground">,</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              {/* Spells */}
              {creature.spells?.entries && Array.isArray(creature.spells.entries) && creature.spells.entries.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-text-secondary mb-2">
                    Spells
                    {creature.spells.sources?.[0] && 'type' in creature.spells.sources[0] && (
                      <span className="text-muted-foreground ml-1">
                        ({(creature.spells.sources[0] as any).type}
                        {(creature.spells.sources[0] as any).concentration && `, CL ${(creature.spells.sources[0] as any).concentration}`})
                      </span>
                    )}
                  </p>
                  <div className="space-y-2">
                    {(() => {
                      // Group spells by level
                      const grouped = creature.spells.entries!.reduce((acc: Record<number, any[]>, spell: any) => {
                        const level = spell.level ?? 0;
                        if (!acc[level]) acc[level] = [];
                        acc[level].push(spell);
                        return acc;
                      }, {} as Record<number, typeof creature.spells.entries>);

                      const sortedLevels = Object.keys(grouped)
                        .map(Number)
                        .sort((a, b) => b - a); // Sort descending

                      return sortedLevels.map(level => (
                        <div key={level} className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {level === 0 ? '0' : `${level}${level === 1 ? 'st' : level === 2 ? 'nd' : level === 3 ? 'rd' : 'th'}`}
                          </Badge>
                          <div className="flex-1 flex flex-wrap gap-x-2 gap-y-1">
                            {grouped[level].map((spell: any, idx: number) => (
                              <span key={`spell-${level}-${spell.name || spell}-${idx}`} className="text-sm">
                                <span className={`${spell.is_mythic_spell ? 'font-semibold text-interactive-primary' : 'text-text-secondary'}`}>
                                  {spell.metamagic?.length > 0 && (
                                    <span className="text-xs text-muted-foreground">{spell.metamagic.join(', ')} </span>
                                  )}
                                  {spell.name}
                                  {spell.count && spell.count > 1 && ` (×${spell.count})`}
                                </span>
                                {spell.DC && (
                                  <span className="text-xs text-muted-foreground"> (DC {spell.DC})</span>
                                )}
                                {idx < grouped[level].length - 1 && <span className="text-muted-foreground">,</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </StatBlockSection>

            {/* STATISTICS Section */}
            <StatBlockSection title="Statistics" icon={BarChart3}>
              <StatRow label="Abilities">
                <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                  {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const).map(ability => {
                    const { score, modifier } = getAbilityScore(creature, ability);
                    return (
                      <div key={ability} className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-text-tertiary">{ability}</span>
                        <Badge variant="outline" className="font-mono font-semibold px-2 md:px-2.5">
                          {formatAbilityScore(score, modifier)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </StatRow>

              <StatRow label="Combat">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-tertiary">BAB</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {formatModifier(creature.bab)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-tertiary">CMB</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {formatModifier(creature.cmb)}
                    </Badge>
                    {creature.cmb_other && (
                      <span className="text-xs text-muted-foreground">
                        ({creature.cmb_other})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-tertiary">CMD</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {creature.cmd ?? '—'}
                    </Badge>
                    {creature.cmd_other && (
                      <span className="text-xs text-muted-foreground">
                        ({creature.cmd_other})
                      </span>
                    )}
                  </div>
                  {creature.grapple_3_5 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-tertiary">Grapple (3.5e)</span>
                      <Badge variant="outline" className="font-mono text-xs bg-surface-secondary border-border">
                        {typeof creature.grapple_3_5 === 'number'
                          ? formatModifier(creature.grapple_3_5)
                          : creature.grapple_3_5
                        }
                      </Badge>
                    </div>
                  )}
                </div>
              </StatRow>

              {((creature.feats_normalized && creature.feats_normalized.length > 0) || (creature.feats && creature.feats.length > 0)) && (
                <StatRow label="Feats">
                  <div className="flex gap-1 flex-wrap">
                    {(creature.feats_normalized || creature.feats || []).map((feat, idx) => (
                      <Badge key={`feat-${feat}-${idx}`} variant="secondary" className="text-xs">
                        {feat}
                      </Badge>
                    ))}
                  </div>
                </StatRow>
              )}

              {((creature.skills_normalized && Object.keys(creature.skills_normalized).length > 0) ||
                (creature.skills && Object.keys(creature.skills).length > 0)) && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-text-secondary mb-2">Skills</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                    {Object.entries(creature.skills_normalized || creature.skills || {})
                      .filter(([skill, value]) => skill !== '_racial_mods' && value !== undefined && value !== null)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([skill, value]) => (
                        <div key={skill} className="flex justify-between items-center py-0.5">
                          <span className="text-text-secondary">{skill}</span>
                          <Badge variant="outline" className="font-mono text-xs h-5 px-1 bg-transparent">
                            {formatModifier(value as number)}
                          </Badge>
                        </div>
                      ))}
                  </div>
                  {creature.skills?._racial_mods && Object.keys(creature.skills._racial_mods).length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground italic">
                      Racial modifiers: {Object.entries(creature.skills._racial_mods)
                        .map(([skill, mod]: [string, any]) => `${skill} ${typeof mod === 'object' ? Object.values(mod).join(', ') : mod}`)
                        .join(', ')}
                    </div>
                  )}
                </div>
              )}

              {creature.languages_normalized && creature.languages_normalized.length > 0 && (
                <StatRow label="Languages">
                  <span className="text-sm">{creature.languages_normalized.join(', ')}</span>
                </StatRow>
              )}

              {creature.special_qualities_normalized && creature.special_qualities_normalized.length > 0 && (
                <StatRow label="SQ">
                  <span className="text-sm">{creature.special_qualities_normalized.join(', ')}</span>
                </StatRow>
              )}

              {/* Environment */}
              {creature.environment && (
                <StatRow label="Environment">
                  <span className="text-sm">{creature.environment}</span>
                </StatRow>
              )}

              {/* NPC Boon */}
              {creature.npc_boon && (
                <StatRow label="Boon">
                  <span className="text-sm">{creature.npc_boon}</span>
                </StatRow>
              )}
            </StatBlockSection>

            {/* Psychic Magic */}
            {creature.psychic_magic && (
              <StatBlockSection title="Psychic Magic" icon={Brain}>
                <div className="text-sm space-y-2">
                  {Object.entries(creature.psychic_magic).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-semibold text-text-secondary">{key}: </span>
                      <span className="text-text-primary">{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </StatBlockSection>
            )}

            {/* Kineticist Wild Talents */}
            {creature.kineticist_wild_talents && (
              <StatBlockSection title="Wild Talents" icon={Flame}>
                <div className="text-sm space-y-2">
                  {Object.entries(creature.kineticist_wild_talents).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-semibold text-text-secondary">{key}: </span>
                      <span className="text-text-primary">{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </StatBlockSection>
            )}

            {/* GEAR Section for NPCs */}
            {creature.gear?.gear && creature.gear.gear.length > 0 && (
              <StatBlockSection title="Gear" icon={Package}>
                <div className="space-y-2">
                  {creature.gear.gear.map((item, idx) => (
                    <div key={`gear-${item}-${idx}`} className="flex items-start gap-2">
                      <span className="text-text-secondary text-sm">•</span>
                      <span className="text-sm text-text-primary">{item}</span>
                    </div>
                  ))}
                </div>
              </StatBlockSection>
            )}

            {/* SPECIAL ABILITIES Section */}
            {((creature.special_abilities?._parsed && Array.isArray(creature.special_abilities._parsed) && creature.special_abilities._parsed.length > 0) || (creature.special_abilities_normalized && creature.special_abilities_normalized.length > 0)) && (
              <StatBlockSection title="Special Abilities" icon={Sparkles}>
                <div className="space-y-2 md:space-y-3">
                  {(Array.isArray(creature.special_abilities?._parsed) ? creature.special_abilities._parsed : creature.special_abilities_normalized || []).map((ability: any, idx: number) => (
                    <Card key={`ability-${typeof ability === 'string' ? ability.substring(0, 20) : (ability as any).name}-${idx}`} className="p-3 md:p-4 bg-gradient-to-br from-surface-secondary/40 to-surface-primary/40 border-border/60 hover:border-interactive-primary/40 transition-colors">
                      {typeof ability === 'string' ? (
                        <p className="text-xs md:text-sm leading-relaxed text-text-secondary">{ability}</p>
                      ) : (
                        <div>
                          <div className="flex items-start gap-2 mb-1.5 md:mb-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-interactive-primary mt-1.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm md:text-base text-text-primary">
                                {(ability as any).name}
                                {(ability as any).type && (
                                  <span className="ml-2 text-xs font-normal text-text-tertiary px-1.5 md:px-2 py-0.5 bg-surface-tertiary rounded whitespace-nowrap">
                                    {(ability as any).type}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs md:text-sm leading-relaxed text-text-secondary pl-0 md:pl-3.5">
                            {(ability as any).description}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </StatBlockSection>
            )}

            {/* ECOLOGY Section */}
            {(creature.environment || creature.ecology?.organization || creature.ecology?.treasure_type) && (
              <StatBlockSection title="Ecology" icon={Globe}>
                {creature.environment && (
                  <StatRow label="Environment">
                    <span className="text-sm">{creature.environment}</span>
                  </StatRow>
                )}
                {creature.ecology?.organization && (
                  <StatRow label="Organization">
                    <span className="text-sm">{creature.ecology.organization}</span>
                  </StatRow>
                )}
                {creature.ecology?.treasure_type && (
                  <StatRow label="Treasure">
                    <span className="text-sm">{creature.ecology.treasure_type}</span>
                  </StatRow>
                )}
              </StatBlockSection>
            )}

            {/* Alternate Forms / Second Statblock */}
            <AlternateFormDisplay creature={creature} />

            {/* Description */}
            {creature.desc_long && (
              <Card className="p-3 md:p-6 bg-gradient-to-br from-surface-secondary/40 to-surface-primary/40 border-border/60">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded-lg bg-interactive-primary/10 text-interactive-primary flex-shrink-0">
                    <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base uppercase tracking-wide text-text-primary">
                    Description
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-text-secondary leading-relaxed text-xs md:text-sm">
                    {creature.desc_long}
                  </p>
                </div>
              </Card>
            )}

            {/* Sources */}
            {creature.sources && Array.isArray(creature.sources) && creature.sources.length > 0 && (
              <Card className="p-3 md:p-5 bg-gradient-to-br from-surface-secondary/40 to-surface-primary/40 border-border/60">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded-lg bg-interactive-primary/10 text-interactive-primary flex-shrink-0">
                    <ScrollText className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base uppercase tracking-wide text-text-primary">
                    Sources
                  </h3>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  {creature.sources.map((source, idx) => (
                    <div key={`source-${source.name || source}-${idx}`} className="flex items-center justify-between text-xs md:text-sm p-1.5 md:p-2 rounded-lg hover:bg-surface-tertiary/50 transition-colors gap-2">
                      <span className="text-text-secondary font-medium flex-1 min-w-0">
                        {source.name}
                        {source.page && <span className="text-text-tertiary font-normal">, p. {source.page}</span>}
                      </span>
                      {source.link && (
                        <a
                          href={source.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-interactive-primary hover:text-interactive-primary-hover transition-colors font-medium flex-shrink-0 text-xs md:text-sm"
                        >
                          View →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}