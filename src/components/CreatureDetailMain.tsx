import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Copy, Shield, Sword, Brain, Leaf, ScrollText, BookOpen } from 'lucide-react';
import { EmptyState } from './creature-detail/EmptyState';
import { StatBlockSection } from './creature-detail/StatBlockSection';
import { StatRow } from './creature-detail/StatRow';
import { InfoList } from './creature-detail/InfoList';
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

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(creature, null, 2));
    toast.success('JSON copied to clipboard');
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Enhanced Header */}
      <div className="bg-surface-secondary border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="mt-1 hover:bg-surface-tertiary"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-text-primary mb-2">
                  {creature.name}
                </h1>
                <div className="flex items-center gap-4 text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-interactive-primary text-text-inverse border-0">
                      CR {crDisplay}
                    </Badge>
                    <span className="text-text-secondary">
                      {getXP(creature)} XP
                    </span>
                  </div>
                  <div className="text-text-secondary">
                    {creature.alignment || 'N'} {creature.size} {creature.type}
                    {creature.subtypes_normalized?.length > 0 && (
                      <span className="text-text-tertiary"> ({creature.subtypes_normalized.join(', ')})</span>
                    )}
                  </div>
                </div>
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
              className="hover:bg-surface-tertiary"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy JSON
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-2">
            {/* Quick Stats Bar */}
            <Card className="p-4 mb-6 bg-surface-secondary/50 border-border/50">
              <div className="flex items-center gap-6 flex-wrap text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Initiative</span>
                  <Badge variant="outline" className="font-mono">
                    {formatModifier(getInitiative(creature))}
                  </Badge>
                </div>

                {creature.senses && Object.keys(creature.senses).length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">Senses</span>
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(creature.senses).map(([sense, value]) => (
                        <Badge key={sense} variant="secondary" className="text-xs">
                          {sense}{typeof value === 'number' ? ` ${value}ft` : ''}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Perception</span>
                  <Badge variant="outline" className="font-mono">
                    {formatModifier(getPerception(creature))}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* DEFENSE Section */}
            <StatBlockSection title="Defense">
              <StatRow label="Armor Class">
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
              </StatRow>

              <StatRow label="Hit Points">
                <div className="flex items-center gap-3">
                  <SemanticBadge semantic="danger">
                    {getHP(creature)}
                  </SemanticBadge>
                  <span className="text-sm text-text-tertiary">
                    ({getHPDetails(creature)})
                  </span>
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

              {/* Defensive Abilities */}
              {(creature.dr || creature.sr) && (
                <StatRow label="Defenses">
                  <div className="flex items-center gap-2 flex-wrap">
                    {creature.dr && (
                      <Badge variant="secondary">
                        DR {typeof creature.dr === 'string'
                          ? creature.dr
                          : Array.isArray(creature.dr)
                            ? creature.dr.map(dr => `${dr.amount}/${dr.weakness}`).join(', ')
                            : typeof creature.dr === 'object' && creature.dr.amount && creature.dr.weakness
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
              {creature.immunities_normalized?.length > 0 && (
                <StatRow label="Immune">
                  <div className="flex gap-1 flex-wrap">
                    {creature.immunities_normalized.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                      </Badge>
                    ))}
                  </div>
                </StatRow>
              )}

              {/* Resistances */}
              {(creature.resistances_normalized?.length > 0 || (creature.resistances && Object.keys(creature.resistances).length > 0)) && (
                <StatRow label="Resist">
                  <div className="flex gap-1 flex-wrap">
                    {creature.resistances_normalized?.length > 0 ? (
                      creature.resistances_normalized.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
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
              {(creature.weaknesses_normalized?.length > 0 || creature.weaknesses) && (
                <StatRow label="Weaknesses">
                  <div className="flex gap-1 flex-wrap">
                    <Badge className="bg-red-500/10 text-red-600 border-red-500/30 text-xs">
                      {creature.weaknesses_normalized?.length > 0
                        ? creature.weaknesses_normalized.join(', ')
                        : typeof creature.weaknesses === 'string'
                          ? creature.weaknesses
                          : Array.isArray(creature.weaknesses)
                            ? creature.weaknesses.map(w => typeof w === 'string' ? w : `${w.weakness || ''} ${w.amount || ''}`).join(', ')
                            : 'unknown'
                      }
                    </Badge>
                  </div>
                </StatRow>
              )}
            </StatBlockSection>

            {/* OFFENSE Section */}
            <StatBlockSection title="Offense">
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
                  <span className="text-sm">
                    {creature.space ?? 5} ft. / {creature.reach ?? 5} ft.
                  </span>
                </StatRow>
              )}

              {(creature.special_attacks_normalized?.length > 0 || creature.attacks?.special) && (
                <InfoList
                  label="Special Attacks"
                  items={creature.special_attacks_normalized?.length > 0
                    ? creature.special_attacks_normalized
                    : creature.attacks?.special}
                />
              )}
            </StatBlockSection>

            {/* STATISTICS Section */}
            <StatBlockSection title="Statistics">
              <StatRow label="Abilities">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const).map(ability => {
                    const { score, modifier } = getAbilityScore(creature, ability);
                    return (
                      <div key={ability} className="text-center">
                        <div className="text-xs text-text-tertiary mb-1">{ability}</div>
                        <Badge variant="outline" className="w-full justify-center">
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
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-tertiary">CMD</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {creature.cmd ?? '—'}
                    </Badge>
                  </div>
                </div>
              </StatRow>

              {(creature.feats_normalized?.length > 0 || creature.feats?.length > 0) && (
                <StatRow label="Feats">
                  <div className="flex gap-1 flex-wrap">
                    {(creature.feats_normalized || creature.feats || []).map((feat, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feat}
                      </Badge>
                    ))}
                  </div>
                </StatRow>
              )}

              {((creature.skills_normalized && Object.keys(creature.skills_normalized).length > 0) ||
                (creature.skills && Object.keys(creature.skills).length > 0)) && (
                <StatRow label="Skills">
                  <div className="flex gap-1 flex-wrap">
                    {Object.entries(creature.skills_normalized || creature.skills || {})
                      .filter(([skill, value]) => skill !== '_racial_mods' && value !== undefined && value !== null)
                      .map(([skill, value]) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill} {formatModifier(value as number)}
                        </Badge>
                      ))}
                  </div>
                </StatRow>
              )}

              {creature.languages_normalized?.length > 0 && (
                <StatRow label="Languages">
                  <span className="text-sm">{creature.languages_normalized.join(', ')}</span>
                </StatRow>
              )}

              {creature.special_qualities_normalized?.length > 0 && (
                <StatRow label="SQ">
                  <span className="text-sm">{creature.special_qualities_normalized.join(', ')}</span>
                </StatRow>
              )}
            </StatBlockSection>

            {/* SPECIAL ABILITIES Section */}
            {creature.special_abilities_normalized?.length > 0 && (
              <StatBlockSection title="Special Abilities">
                <div className="space-y-3">
                  {creature.special_abilities_normalized.map((ability, idx) => (
                    <Card key={idx} className="p-3 bg-surface-secondary/30 border-border/50">
                      <p className="text-sm leading-relaxed">{ability}</p>
                    </Card>
                  ))}
                </div>
              </StatBlockSection>
            )}

            {/* ECOLOGY Section */}
            {(creature.environment || creature.ecology?.organization || creature.ecology?.treasure_type) && (
              <StatBlockSection title="Ecology">
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

            {/* Description */}
            {creature.desc_long && (
              <Card className="p-6 bg-surface-secondary/30 border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-4 w-4 text-interactive-primary" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
                    Description
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-text-secondary leading-relaxed">
                    {creature.desc_long}
                  </p>
                </div>
              </Card>
            )}

            {/* Sources */}
            {creature.sources?.length > 0 && (
              <Card className="p-4 bg-surface-secondary/30 border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <ScrollText className="h-4 w-4 text-interactive-primary" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-text-secondary">
                    Sources
                  </h3>
                </div>
                <div className="space-y-1">
                  {creature.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        {source.name}
                        {source.page && <span className="text-text-tertiary">, p. {source.page}</span>}
                      </span>
                      {source.link && (
                        <a
                          href={source.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-interactive-primary hover:text-interactive-primary-hover transition-colors"
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