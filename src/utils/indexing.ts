import type { CreatureEnriched } from '@/types/creature-complete';

// Indexed data structure for O(1) filtering
export interface CreatureIndexes {
  // Direct indexes for exact matches
  byType: Map<string, Set<CreatureEnriched>>;
  bySize: Map<string, Set<CreatureEnriched>>;
  byAlignment: Map<string, Set<CreatureEnriched>>;
  byEnvironment: Map<string, Set<CreatureEnriched>>;
  bySource: Map<string, Set<CreatureEnriched>>;

  // Multi-value indexes (creature can have multiple values)
  bySubtype: Map<string, Set<CreatureEnriched>>;
  byLanguage: Map<string, Set<CreatureEnriched>>;
  bySpecialAbility: Map<string, Set<CreatureEnriched>>;
  byDefensiveAbility: Map<string, Set<CreatureEnriched>>;
  byImmunity: Map<string, Set<CreatureEnriched>>;
  byWeakness: Map<string, Set<CreatureEnriched>>;
  bySenseType: Map<string, Set<CreatureEnriched>>;
  byDRType: Map<string, Set<CreatureEnriched>>;
  byResistanceType: Map<string, Set<CreatureEnriched>>;
  byMovementType: Map<string, Set<CreatureEnriched>>;

  // Sorted arrays for range queries (binary search)
  byCR: { cr: number; creatures: CreatureEnriched[] }[];
  byHP: { hp: number; creatures: CreatureEnriched[] }[];
  byAC: { ac: number; creatures: CreatureEnriched[] }[];
  byInitiative: { value: number; creatures: CreatureEnriched[] }[];

  // Boolean indexes
  withSpells: Set<CreatureEnriched>;
  withSpellLikeAbilities: Set<CreatureEnriched>;
  withPsychicMagic: Set<CreatureEnriched>;
  withRegeneration: Set<CreatureEnriched>;
  withFastHealing: Set<CreatureEnriched>;
  withAuras: Set<CreatureEnriched>;
  withMeleeAttacks: Set<CreatureEnriched>;
  withRangedAttacks: Set<CreatureEnriched>;
  withSpecialAttacks: Set<CreatureEnriched>;

  // All creatures for reference
  all: CreatureEnriched[];
}

// Build all indexes in one pass
export function buildCreatureIndexes(creatures: CreatureEnriched[]): CreatureIndexes {
  const indexes: CreatureIndexes = {
    byType: new Map(),
    bySize: new Map(),
    byAlignment: new Map(),
    byEnvironment: new Map(),
    bySource: new Map(),
    bySubtype: new Map(),
    byLanguage: new Map(),
    bySpecialAbility: new Map(),
    byDefensiveAbility: new Map(),
    byImmunity: new Map(),
    byWeakness: new Map(),
    bySenseType: new Map(),
    byDRType: new Map(),
    byResistanceType: new Map(),
    byMovementType: new Map(),
    byCR: [],
    byHP: [],
    byAC: [],
    byInitiative: [],
    withSpells: new Set(),
    withSpellLikeAbilities: new Set(),
    withPsychicMagic: new Set(),
    withRegeneration: new Set(),
    withFastHealing: new Set(),
    withAuras: new Set(),
    withMeleeAttacks: new Set(),
    withRangedAttacks: new Set(),
    withSpecialAttacks: new Set(),
    all: creatures
  };

  // Maps for range queries (will be converted to sorted arrays)
  const crMap = new Map<number, CreatureEnriched[]>();
  const hpMap = new Map<number, CreatureEnriched[]>();
  const acMap = new Map<number, CreatureEnriched[]>();
  const initiativeMap = new Map<number, CreatureEnriched[]>();

  // Build indexes in a single pass
  creatures.forEach(creature => {
    // Simple field indexes
    addToIndex(indexes.byType, creature.type_clean || creature.type, creature);
    addToIndex(indexes.bySize, creature.size_clean || creature.size, creature);
    addToIndex(indexes.byAlignment, creature.alignment_clean || creature.alignment, creature);
    const environment = creature.environment_clean || creature.environment;
    if (environment && environment !== null) {
      addToIndex(indexes.byEnvironment, environment, creature);
    }

    // Source indexes
    creature.sources?.forEach(source => {
      addToIndex(indexes.bySource, source.name, creature);
    });

    // Multi-value indexes
    const subtypes = creature.subtypes_normalized || creature.subtypes || [];
    subtypes.forEach(subtype => {
      if (subtype) addToIndex(indexes.bySubtype, String(subtype).toLowerCase(), creature);
    });

    const languages = creature.languages_normalized || creature.languages || [];
    languages.forEach(language => {
      if (language) addToIndex(indexes.byLanguage, String(language).toLowerCase(), creature);
    });

    // Special abilities
    if (creature.special_abilities) {
      Object.keys(creature.special_abilities).forEach(ability => {
        addToIndex(indexes.bySpecialAbility, ability.toLowerCase(), creature);
      });
    }

    // Defensive abilities
    const defensiveAbilities = creature.defensive_abilities_normalized || creature.defensive_abilities || [];
    defensiveAbilities.forEach(ability => {
      if (ability) addToIndex(indexes.byDefensiveAbility, String(ability).toLowerCase(), creature);
    });

    // Immunities
    const immunities = creature.immunities_normalized || creature.immunities || [];
    immunities.forEach(immunity => {
      if (immunity) addToIndex(indexes.byImmunity, String(immunity).toLowerCase(), creature);
    });

    // Weaknesses
    const weaknesses = creature.weaknesses_normalized || creature.weaknesses || [];
    weaknesses.forEach(weakness => {
      if (weakness) addToIndex(indexes.byWeakness, String(weakness).toLowerCase(), creature);
    });

    // Senses
    if (creature.senses) {
      Object.keys(creature.senses).forEach(sense => {
        addToIndex(indexes.bySenseType, sense.toLowerCase(), creature);
      });
    }

    // DR types
    if (creature.dr && Array.isArray(creature.dr)) {
      creature.dr.forEach(dr => {
        if (typeof dr === 'object' && dr.weakness) {
          addToIndex(indexes.byDRType, dr.weakness.toLowerCase(), creature);
        }
      });
    }

    // Resistance types
    if (creature.resistances) {
      Object.keys(creature.resistances).forEach(resistance => {
        addToIndex(indexes.byResistanceType, resistance.toLowerCase(), creature);
      });
    }

    // Movement types
    if (creature.speeds && typeof creature.speeds === 'object') {
      Object.keys(creature.speeds).forEach(speed => {
        if (speed !== 'base' && creature.speeds?.[speed as keyof typeof creature.speeds]) {
          addToIndex(indexes.byMovementType, speed.toLowerCase(), creature);
        }
      });
    }

    // Range query indexes
    const cr = creature.cr_parsed?.value ?? creature.cr;
    if (cr !== null && cr !== undefined) {
      addToRangeMap(crMap, Number(cr), creature);
    }

    const hp = creature.hp?.total;
    if (hp !== null && hp !== undefined) {
      addToRangeMap(hpMap, Number(hp), creature);
    }

    if (creature.ac !== null && creature.ac !== undefined) {
      addToRangeMap(acMap, Number(creature.ac), creature);
    }

    const initiative = Array.isArray(creature.initiative) ? creature.initiative[0] : creature.initiative;
    if (initiative !== null && initiative !== undefined) {
      addToRangeMap(initiativeMap, Number(initiative), creature);
    }

    // Boolean flags
    if (creature.spells && Object.keys(creature.spells).length > 0) {
      indexes.withSpells.add(creature);
    }

    if (creature.spell_like_abilities && Object.keys(creature.spell_like_abilities).length > 0) {
      indexes.withSpellLikeAbilities.add(creature);
    }

    if (creature.psychic_magic) {
      indexes.withPsychicMagic.add(creature);
    }

    if (creature.special_abilities?.regeneration) {
      indexes.withRegeneration.add(creature);
    }

    if (creature.special_abilities?.['fast healing']) {
      indexes.withFastHealing.add(creature);
    }

    if (creature.auras && Array.isArray(creature.auras) && creature.auras.length > 0) {
      indexes.withAuras.add(creature);
    }

    if (creature.attacks?.melee && Array.isArray(creature.attacks.melee) && creature.attacks.melee.length > 0) {
      indexes.withMeleeAttacks.add(creature);
    }

    if (creature.attacks?.ranged && Array.isArray(creature.attacks.ranged) && creature.attacks.ranged.length > 0) {
      indexes.withRangedAttacks.add(creature);
    }

    if (creature.attacks?.special && Array.isArray(creature.attacks.special) && creature.attacks.special.length > 0) {
      indexes.withSpecialAttacks.add(creature);
    }
  });

  // Convert range maps to sorted arrays for binary search
  indexes.byCR = Array.from(crMap.entries())
    .map(([cr, creatures]) => ({ cr, creatures }))
    .sort((a, b) => a.cr - b.cr);

  indexes.byHP = Array.from(hpMap.entries())
    .map(([hp, creatures]) => ({ hp, creatures }))
    .sort((a, b) => a.hp - b.hp);

  indexes.byAC = Array.from(acMap.entries())
    .map(([ac, creatures]) => ({ ac, creatures }))
    .sort((a, b) => a.ac - b.ac);

  indexes.byInitiative = Array.from(initiativeMap.entries())
    .map(([value, creatures]) => ({ value, creatures }))
    .sort((a, b) => a.value - b.value);

  return indexes;
}

// Helper to add to index
function addToIndex(index: Map<string, Set<CreatureEnriched>>, key: string | undefined, creature: CreatureEnriched) {
  if (!key) return;
  const normalizedKey = String(key).toLowerCase();
  if (!index.has(normalizedKey)) {
    index.set(normalizedKey, new Set());
  }
  index.get(normalizedKey)!.add(creature);
}

// Helper for range maps
function addToRangeMap(map: Map<number, CreatureEnriched[]>, value: number, creature: CreatureEnriched) {
  if (!map.has(value)) {
    map.set(value, []);
  }
  map.get(value)!.push(creature);
}

// Set intersection for combining filters
export function intersectSets<T>(...sets: Set<T>[]): Set<T> {
  if (sets.length === 0) return new Set();
  if (sets.length === 1) return sets[0];

  // Start with smallest set for efficiency
  const sortedSets = sets.sort((a, b) => a.size - b.size);
  const result = new Set<T>();

  // Check each item in smallest set against all others
  sortedSets[0].forEach(item => {
    if (sortedSets.every(set => set.has(item))) {
      result.add(item);
    }
  });

  return result;
}

// Binary search for range queries
export function getRangeFromSortedArray<T extends { creatures: CreatureEnriched[] }>(
  sortedArray: T[],
  valueExtractor: (item: T) => number,
  min?: number | null,
  max?: number | null
): Set<CreatureEnriched> {
  const result = new Set<CreatureEnriched>();

  if (!sortedArray.length) return result;

  // Find start index using binary search
  let startIdx = 0;
  if (min !== null && min !== undefined) {
    let left = 0;
    let right = sortedArray.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (valueExtractor(sortedArray[mid]) < min) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    startIdx = left;
  }

  // Find end index using binary search
  let endIdx = sortedArray.length - 1;
  if (max !== null && max !== undefined) {
    let left = 0;
    let right = sortedArray.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (valueExtractor(sortedArray[mid]) <= max) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    endIdx = right;
  }

  // Collect all creatures in range
  for (let i = startIdx; i <= endIdx; i++) {
    sortedArray[i].creatures.forEach(creature => result.add(creature));
  }

  return result;
}