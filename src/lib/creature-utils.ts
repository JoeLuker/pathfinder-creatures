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

