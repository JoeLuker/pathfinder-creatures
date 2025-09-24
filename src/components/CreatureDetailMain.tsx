import type { CreatureEnriched } from '@/types/creature-complete';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Copy
} from 'lucide-react';

interface CreatureDetailMainProps {
  creature: CreatureEnriched | null;
  onBack: () => void;
}


export function CreatureDetailMain({ creature, onBack }: CreatureDetailMainProps) {

  if (!creature) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Select a creature</CardTitle>
            <CardDescription>Choose a creature from the list to view details</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Use the display value from cr_parsed if available, otherwise use the cr value
  const crDisplay = creature.cr_parsed?.display ?? creature.cr?.toString() ?? '-';

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(creature, null, 2));
    toast.success('JSON copied to clipboard');
  };

  // Helper functions for stat block formatting
  const formatSave = (save: number | undefined) => {
    if (save === undefined || save === null) return '+0';
    return save >= 0 ? `+${save}` : `${save}`;
  };

  const formatAbilityScore = (score: number | undefined, modifier: number | undefined) => {
    const scoreStr = score?.toString() ?? '—';
    // Calculate modifier from score if modifier not provided
    const calculatedModifier = score !== undefined ? Math.floor((score - 10) / 2) : 0;
    const actualModifier = modifier !== undefined ? modifier : calculatedModifier;
    const modStr = formatSave(actualModifier);
    return `${scoreStr} (${modStr})`;
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="transition-all hover:translate-x-[-2px]">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold mb-1">{creature.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  CR {crDisplay} (XP {creature.xp?.toLocaleString() ?? '—'})
                </div>
              </div>
            </div>
            <Button
              onClick={handleCopyJson}
              variant="outline"
              size="sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy JSON
            </Button>
          </div>
        </CardHeader>
      </Card>

      <ScrollArea className="flex-1">
        <div className="container max-w-4xl mx-auto p-6">
          {/* Stat Block */}
          <div className="text-sm space-y-1 leading-relaxed">

            {/* Basic Info */}
            <div>
              <span className="font-bold">{creature.alignment || 'N'} {creature.size} {creature.type}</span>
              {creature.subtypes_normalized?.length > 0 && (
                <span> ({creature.subtypes_normalized.join(', ')})</span>
              )}
            </div>

            {/* Senses & Init */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="outline">Init {formatSave(creature.initiative_parsed?.value ?? creature.initiative)}</Badge>
              {creature.senses && Object.keys(creature.senses).length > 0 &&
                Object.entries(creature.senses).map(([sense, value]) => (
                  <Badge key={sense} variant="outline" className="text-xs">
                    {sense}{typeof value === 'number' ? ` ${value}ft` : ''}
                  </Badge>
                ))
              }
              <Badge variant="outline">Perception {formatSave(creature.skills_parsed?.Perception?.value ?? creature.skills?.Perception)}</Badge>
            </div>

            {/* DEFENSE Section */}
            <div className="mt-4">
              <div className="font-bold text-base mb-2">DEFENSE</div>

              {/* AC */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">AC</span>
                <Badge variant="default">AC {creature.ac?.AC ?? '—'}</Badge>
                {creature.ac?.touch && <Badge variant="secondary">Touch {creature.ac.touch}</Badge>}
                {creature.ac?.flat_footed && <Badge variant="secondary">Flat {creature.ac.flat_footed}</Badge>}
              </div>

              {/* HP */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">hp</span>
                <Badge variant="destructive">HP {creature.hp?.total ?? '—'}</Badge>
                <span className="text-muted-foreground">({creature.hp?.long ?? creature.hd ?? '—'})</span>
              </div>

              {/* Saves */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">Saves</span>
                <Badge variant="outline">Fort {formatSave(creature.saves?.fort)}</Badge>
                <Badge variant="outline">Ref {formatSave(creature.saves?.ref)}</Badge>
                <Badge variant="outline">Will {formatSave(creature.saves?.will)}</Badge>
              </div>

              {/* Defensive abilities */}
              {(creature.dr || creature.immunities_normalized?.length || creature.resistances_normalized?.length || creature.resistances || creature.sr) && (
                <div className="flex items-center gap-2 flex-wrap mb-1">
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
                  {creature.immunities_normalized?.length > 0 && <Badge variant="secondary">Immune: {creature.immunities_normalized.map(item => typeof item === 'string' ? item : JSON.stringify(item)).join(', ')}</Badge>}
                  {creature.resistances_normalized?.length > 0 && <Badge variant="secondary">Resist: {creature.resistances_normalized.map(item => typeof item === 'string' ? item : JSON.stringify(item)).join(', ')}</Badge>}
                  {creature.resistances && Object.keys(creature.resistances).length > 0 && !creature.resistances_normalized?.length && (
                    <Badge variant="secondary">
                      Resist: {Object.entries(creature.resistances)
                        .map(([type, value]) => `${type} ${value}`)
                        .join(', ')}
                    </Badge>
                  )}
                  {creature.sr && <Badge variant="secondary">SR {creature.sr}</Badge>}
                </div>
              )}

              {/* Weaknesses */}
              {(creature.weaknesses_normalized?.length > 0 || creature.weaknesses) && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">Weaknesses</span>
                  <Badge variant="destructive">
                    Weak: {creature.weaknesses_normalized?.length > 0
                      ? creature.weaknesses_normalized.join(', ')
                      : typeof creature.weaknesses === 'string'
                        ? creature.weaknesses
                        : Array.isArray(creature.weaknesses)
                          ? creature.weaknesses.map(w => typeof w === 'string' ? w : `${w.weakness || ''} ${w.amount || ''}`).join(', ')
                          : 'unknown'
                    }
                  </Badge>
                </div>
              )}
            </div>

            {/* OFFENSE Section */}
            <div className="mt-4">
              <div className="font-bold text-base mb-2">OFFENSE</div>

              {/* Speed */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">Speed</span>
                <Badge variant="outline">Speed {creature.speeds?.base ?? 30}ft</Badge>
                {creature.speeds?.fly && <Badge variant="outline">Fly {creature.speeds.fly}ft</Badge>}
                {creature.speeds?.swim && <Badge variant="outline">Swim {creature.speeds.swim}ft</Badge>}
              </div>

              {/* Attacks */}
              {creature.attacks?.melee?.length > 0 && (
                <div className="mb-1">
                  <span className="font-bold">Melee</span> <span className="text-sm">{creature.attacks.melee.join(', ')}</span>
                </div>
              )}

              {creature.attacks?.ranged?.length > 0 && (
                <div className="mb-1">
                  <span className="font-bold">Ranged</span> <span className="text-sm">{creature.attacks.ranged.join(', ')}</span>
                </div>
              )}

              {/* Space/Reach */}
              {(creature.space !== 5 || creature.reach !== 5) && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">Space/Reach</span>
                  <Badge variant="outline">Space {creature.space ?? 5}ft</Badge>
                  <Badge variant="outline">Reach {creature.reach ?? 5}ft</Badge>
                </div>
              )}

              {/* Special Attacks */}
              {(creature.special_attacks_normalized?.length > 0 || creature.attacks?.special?.length > 0) && (
                <div className="mb-1">
                  <span className="font-bold">Special Attacks</span>
                  <span className="text-sm">
                    {creature.special_attacks_normalized?.length > 0
                      ? creature.special_attacks_normalized.join(', ')
                      : creature.attacks?.special?.join(', ')
                    }
                  </span>
                </div>
              )}
            </div>

            {/* STATISTICS Section */}
            <div className="mt-4">
              <div className="font-bold text-base mb-2">STATISTICS</div>

              {/* Ability Scores */}
              <div className="flex items-center gap-1 flex-wrap mb-2">
                <Badge variant="outline">Str {formatAbilityScore(creature.ability_scores?.STR, creature.ability_scores_parsed?.str?.modifier)}</Badge>
                <Badge variant="outline">Dex {formatAbilityScore(creature.ability_scores?.DEX, creature.ability_scores_parsed?.dex?.modifier)}</Badge>
                <Badge variant="outline">Con {formatAbilityScore(creature.ability_scores?.CON, creature.ability_scores_parsed?.con?.modifier)}</Badge>
                <Badge variant="outline">Int {formatAbilityScore(creature.ability_scores?.INT, creature.ability_scores_parsed?.int?.modifier)}</Badge>
                <Badge variant="outline">Wis {formatAbilityScore(creature.ability_scores?.WIS, creature.ability_scores_parsed?.wis?.modifier)}</Badge>
                <Badge variant="outline">Cha {formatAbilityScore(creature.ability_scores?.CHA, creature.ability_scores_parsed?.cha?.modifier)}</Badge>
              </div>

              {/* Combat Stats */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">Combat</span>
                <Badge variant="secondary">BAB {formatSave(creature.bab ?? 0)}</Badge>
                <Badge variant="secondary">CMB {formatSave(creature.cmb ?? 0)}</Badge>
                <Badge variant="secondary">CMD {creature.cmd ?? '—'}</Badge>
              </div>

              {/* Feats */}
              {(creature.feats_normalized?.length > 0 || creature.feats?.length > 0) && (
                <div className="mb-1">
                  <span className="font-bold">Feats</span>
                  <span className="text-sm">
                    {creature.feats_normalized?.length > 0
                      ? creature.feats_normalized.join(', ')
                      : creature.feats?.join(', ')
                    }
                  </span>
                </div>
              )}

              {/* Skills */}
              {((creature.skills_normalized && Object.keys(creature.skills_normalized).length > 0) ||
                (creature.skills && Object.keys(creature.skills).length > 0)) && (
                <div className="mb-1">
                  <span className="font-bold">Skills</span>
                  <div className="flex items-center gap-1 flex-wrap mt-1">
                    {creature.skills_normalized ? (
                      Object.entries(creature.skills_normalized)
                        .filter(([, value]) => value !== undefined && value !== null)
                        .map(([skill, value]) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill} {formatSave(value as number)}
                          </Badge>
                        ))
                    ) : (
                      Object.entries(creature.skills || {})
                        .filter(([skill, value]) => skill !== '_racial_mods' && value !== undefined && value !== null)
                        .map(([skill, value]) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill} {formatSave(value as number)}
                          </Badge>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* Languages */}
              {creature.languages_normalized?.length > 0 && (
                <div className="mb-1">
                  <span className="font-bold">Languages</span> <span className="text-sm">{creature.languages_normalized.join(', ')}</span>
                </div>
              )}

              {/* Special Qualities */}
              {creature.special_qualities_normalized?.length > 0 && (
                <div className="mb-1">
                  <span className="font-bold">SQ</span> <span className="text-sm">{creature.special_qualities_normalized.join(', ')}</span>
                </div>
              )}
            </div>

            {/* SPECIAL ABILITIES Section */}
            {creature.special_abilities_normalized?.length > 0 && (
              <div className="mt-4">
                <div className="font-bold text-base mb-2">SPECIAL ABILITIES</div>
                <div className="space-y-2 ml-4">
                  {creature.special_abilities_normalized.map((ability, idx) => (
                    <div key={idx} className="text-wrap">
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ECOLOGY Section */}
            <div className="mt-4">
              <div className="font-bold text-base mb-1">ECOLOGY</div>

              {creature.environment && (
                <div>
                  <span className="font-bold">Environment</span> {creature.environment}
                </div>
              )}

              {creature.ecology?.organization && (
                <div>
                  <span className="font-bold">Organization</span> {creature.ecology.organization}
                </div>
              )}

              {creature.ecology?.treasure_type && (
                <div>
                  <span className="font-bold">Treasure</span> {creature.ecology.treasure_type}
                </div>
              )}
            </div>

            {/* Description */}
            {(creature.desc_short || creature.desc_long) && (
              <div className="mt-6 pt-4 border-t border-border">
                <div className="font-sans text-base leading-relaxed space-y-4">
                  {creature.desc_short && (
                    <p className="font-medium">{creature.desc_short}</p>
                  )}
                  {creature.desc_long && (
                    <p>{creature.desc_long}</p>
                  )}
                </div>
              </div>
            )}

            {/* Sources */}
            {creature.sources?.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border">
                <div className="font-bold text-base mb-2">SOURCES</div>
                <div className="space-y-1">
                  {creature.sources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span>{source.name}, p. {source.page}</span>
                      {source.link && (
                        <a
                          href={source.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline ml-2"
                        >
                          →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}