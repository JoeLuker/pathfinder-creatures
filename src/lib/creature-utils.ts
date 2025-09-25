import type { CreatureEnriched } from '@/types/creature-complete';

/**
 * Utility functions for accessing creature data with proper fallbacks
 * These functions handle the various data formats and provide consistent access patterns
 */

// Get AC value with fallbacks
export function getAC(creature: CreatureEnriched): string {
  return creature.ac_data?.AC ?? creature.ac ?? '—';
}

export function getTouchAC(creature: CreatureEnriched): number | null {
  return creature.ac_data?.touch ?? null;
}

export function getFlatFootedAC(creature: CreatureEnriched): number | null {
  return creature.ac_data?.flat_footed ?? null;
}

// Get HP values with fallbacks
export function getHP(creature: CreatureEnriched): string {
  return creature.hp?.total?.toString() ?? '—';
}

export function getHPDetails(creature: CreatureEnriched): string {
  return creature.hp?.long ?? creature.hd ?? '—';
}

// Get saves with fallbacks
export function getFortSave(creature: CreatureEnriched): number | null {
  return creature.saves_data?.fort ?? creature.fort ?? creature.saves?.fort ?? null;
}

export function getRefSave(creature: CreatureEnriched): number | null {
  return creature.saves_data?.ref ?? creature.ref ?? creature.saves?.ref ?? null;
}

export function getWillSave(creature: CreatureEnriched): number | null {
  return creature.saves_data?.will ?? creature.will ?? creature.saves?.will ?? null;
}

// Get ability scores with modifiers
export function getAbilityScore(creature: CreatureEnriched, ability: 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA') {
  const abilityLower = ability.toLowerCase() as 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
  return {
    score: creature.ability_scores?.[ability] ?? null,
    modifier: creature.ability_scores_parsed?.[abilityLower]?.modifier ?? null
  };
}

// Get skills with fallbacks
export function getPerception(creature: CreatureEnriched): number | null {
  return creature.skills_parsed?.Perception?.value
    ?? creature.skills?.Perception
    ?? creature.skills_normalized?.Perception
    ?? null;
}

export function getSkills(creature: CreatureEnriched): Record<string, number> {
  const skills = creature.skills_normalized || creature.skills || {}; // noqa
  // Filter out metadata fields
  return Object.fromEntries(
    Object.entries(skills).filter(([key, value]) =>
      key !== '_racial_mods' && value !== undefined && value !== null
    )
  ) as Record<string, number>;
}

// Get combat stats with fallbacks
export function getInitiative(creature: CreatureEnriched): number | null {
  return creature.initiative_parsed?.value ?? creature.initiative ?? null;
}

export function getCR(creature: CreatureEnriched): string {
  return creature.cr_parsed?.display ?? creature.cr?.toString() ?? '-';
}

export function getXP(creature: CreatureEnriched): string {
  return creature.xp?.toLocaleString() ?? '—';
}

// Movement speeds with fallbacks
export function getMovementSpeeds(creature: CreatureEnriched) {
  return {
    base: creature.speeds?.base ?? 30,
    fly: creature.speeds?.fly ?? null,
    swim: creature.speeds?.swim ?? null,
    climb: creature.speeds?.climb ?? null,
    burrow: creature.speeds?.burrow ?? null,
  };
}

// Get feats list
export function getFeats(creature: CreatureEnriched): string[] {
  return creature.feats_normalized || creature.feats || [];
}

// Get languages list
export function getLanguages(creature: CreatureEnriched): string[] {
  return creature.languages_normalized || [];
}

// Get special qualities
export function getSpecialQualities(creature: CreatureEnriched): string[] {
  return creature.special_qualities_normalized || [];
}

// Get special attacks
export function getSpecialAttacks(creature: CreatureEnriched): string[] {
  return creature.special_attacks_normalized?.length > 0
    ? creature.special_attacks_normalized
    : creature.attacks?.special || [];
}

// Get immunities
export function getImmunities(creature: CreatureEnriched): string[] {
  return creature.immunities_normalized || [];
}

// Get resistances
export function getResistances(creature: CreatureEnriched): Array<{ type: string; value: string | number }> {
  if (creature.resistances_normalized?.length > 0) {
    return creature.resistances_normalized.map(r => ({ type: r, value: '' }));
  }

  if (creature.resistances && Object.keys(creature.resistances).length > 0) {
    return Object.entries(creature.resistances).map(([type, value]) => ({ type, value }));
  }

  return [];
}

// Get weaknesses
export function getWeaknesses(creature: CreatureEnriched): string {
  if (creature.weaknesses_normalized?.length > 0) {
    return creature.weaknesses_normalized.join(', ');
  }

  if (typeof creature.weaknesses === 'string') {
    return creature.weaknesses;
  }

  if (Array.isArray(creature.weaknesses)) {
    return creature.weaknesses
      .map(w => typeof w === 'string' ? w : `${w.weakness || ''} ${w.amount || ''}`)
      .join(', ');
  }

  return '';
}