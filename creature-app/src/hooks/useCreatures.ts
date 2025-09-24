import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { CreatureEnriched } from '@/types/creature-complete';

export interface Filters {
  search: string;

  // Basic creature info
  types: string[];
  sizes: string[];
  alignments: string[];
  subtypes: string[];

  // Challenge and Experience
  crMin: number | null;
  crMax: number | null;
  mrMin: number | null;  // Mythic Rank
  mrMax: number | null;
  xpMin: number | null;
  xpMax: number | null;

  // Combat Stats - AC
  acMin: number | null;
  acMax: number | null;
  touchAcMin: number | null;
  touchAcMax: number | null;
  flatFootedAcMin: number | null;
  flatFootedAcMax: number | null;

  // Hit Points
  hpMin: number | null;
  hpMax: number | null;

  // Initiative
  initiativeMin: number | null;
  initiativeMax: number | null;

  // Saving Throws
  fortMin: number | null;
  fortMax: number | null;
  refMin: number | null;
  refMax: number | null;
  willMin: number | null;
  willMax: number | null;

  // Ability Scores
  strMin: number | null;
  strMax: number | null;
  dexMin: number | null;
  dexMax: number | null;
  conMin: number | null;
  conMax: number | null;
  intMin: number | null;
  intMax: number | null;
  wisMin: number | null;
  wisMax: number | null;
  chaMin: number | null;
  chaMax: number | null;

  // Combat Values
  babMin: number | null;
  babMax: number | null;
  cmbMin: number | null;
  cmbMax: number | null;
  cmdMin: number | null;
  cmdMax: number | null;

  // Space and Reach
  spaceMin: number | null;
  spaceMax: number | null;
  reachMin: number | null;
  reachMax: number | null;

  // Speeds
  baseSpeedMin: number | null;
  baseSpeedMax: number | null;
  burrowSpeedMin: number | null;
  burrowSpeedMax: number | null;
  climbSpeedMin: number | null;
  climbSpeedMax: number | null;
  flySpeedMin: number | null;
  flySpeedMax: number | null;
  swimSpeedMin: number | null;
  swimSpeedMax: number | null;

  // Movement Types (has movement type)
  movementTypes: string[];

  // Spell Resistance
  srMin: number | null;
  srMax: number | null;

  // Multi-select arrays
  specialAbilities: string[];
  defensiveAbilities: string[];
  languages: string[];
  environments: string[];
  senseTypes: string[];

  // Damage Reduction
  drTypes: string[];  // e.g., ["magic", "silver", "cold iron"]
  drAmountMin: number | null;
  drAmountMax: number | null;

  // Resistances
  resistanceTypes: string[];  // e.g., ["fire", "cold", "acid"]
  resistanceAmountMin: number | null;
  resistanceAmountMax: number | null;

  // Immunities and Weaknesses
  immunities: string[];
  weaknesses: string[];

  // Attack types
  hasMeleeAttacks: boolean | null;
  hasRangedAttacks: boolean | null;
  hasSpecialAttacks: boolean | null;

  // Special flags
  hasSpellLikeAbilities: boolean | null;
  hasSpells: boolean | null;
  hasPsychicMagic: boolean | null;
  hasRegeneration: boolean | null;
  hasFastHealing: boolean | null;
  hasAuras: boolean | null;

  excludeMode?: {
    types?: boolean;
    sizes?: boolean;
    alignments?: boolean;
    subtypes?: boolean;
    movementTypes?: boolean;
    specialAbilities?: boolean;
    defensiveAbilities?: boolean;
    languages?: boolean;
    environments?: boolean;
    senseTypes?: boolean;
    drTypes?: boolean;
    resistanceTypes?: boolean;
    immunities?: boolean;
    weaknesses?: boolean;
  };
}

export type SortField = 'name' | 'cr' | 'type' | 'size';
export type SortDirection = 'asc' | 'desc';

const sizeOrder = ['Fine', 'Diminutive', 'Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan', 'Colossal'];

export function useCreatures() {
  const [creatures, setCreatures] = useState<CreatureEnriched[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',

    // Basic creature info
    types: [],
    sizes: [],
    alignments: [],
    subtypes: [],

    // Challenge and Experience
    crMin: null,
    crMax: null,
    mrMin: null,
    mrMax: null,
    xpMin: null,
    xpMax: null,

    // Combat Stats - AC
    acMin: null,
    acMax: null,
    touchAcMin: null,
    touchAcMax: null,
    flatFootedAcMin: null,
    flatFootedAcMax: null,

    // Hit Points
    hpMin: null,
    hpMax: null,

    // Initiative
    initiativeMin: null,
    initiativeMax: null,

    // Saving Throws
    fortMin: null,
    fortMax: null,
    refMin: null,
    refMax: null,
    willMin: null,
    willMax: null,

    // Ability Scores
    strMin: null,
    strMax: null,
    dexMin: null,
    dexMax: null,
    conMin: null,
    conMax: null,
    intMin: null,
    intMax: null,
    wisMin: null,
    wisMax: null,
    chaMin: null,
    chaMax: null,

    // Combat Values
    babMin: null,
    babMax: null,
    cmbMin: null,
    cmbMax: null,
    cmdMin: null,
    cmdMax: null,

    // Space and Reach
    spaceMin: null,
    spaceMax: null,
    reachMin: null,
    reachMax: null,

    // Speeds
    baseSpeedMin: null,
    baseSpeedMax: null,
    burrowSpeedMin: null,
    burrowSpeedMax: null,
    climbSpeedMin: null,
    climbSpeedMax: null,
    flySpeedMin: null,
    flySpeedMax: null,
    swimSpeedMin: null,
    swimSpeedMax: null,

    // Movement Types
    movementTypes: [],

    // Spell Resistance
    srMin: null,
    srMax: null,

    // Multi-select arrays
    specialAbilities: [],
    defensiveAbilities: [],
    languages: [],
    environments: [],
    senseTypes: [],

    // Damage Reduction
    drTypes: [],
    drAmountMin: null,
    drAmountMax: null,

    // Resistances
    resistanceTypes: [],
    resistanceAmountMin: null,
    resistanceAmountMax: null,

    // Immunities and Weaknesses
    immunities: [],
    weaknesses: [],

    // Attack types
    hasMeleeAttacks: null,
    hasRangedAttacks: null,
    hasSpecialAttacks: null,

    // Special flags
    hasSpellLikeAbilities: null,
    hasSpells: null,
    hasPsychicMagic: null,
    hasRegeneration: null,
    hasFastHealing: null,
    hasAuras: null
  });
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    fetch('/creatures_enriched.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch creature data');
        return res.json();
      })
      .then(data => {
        const creaturesArray = Object.values(data) as CreatureEnriched[];
        setCreatures(creaturesArray);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Set up Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(creatures, {
      keys: [
        { name: 'name', weight: 2 },  // Name gets higher weight
        'type',
        'alignment',
        'size',
        'environment',
        'desc_short',
        'subtypes_normalized',
        'special_abilities._parsed.name',
        'defensive_abilities_normalized',
        'immunities_normalized',
        'languages_normalized',
        'feats'
      ],
      threshold: 0.3,  // 0 = exact match, 1 = match anything
      includeScore: true,
      ignoreLocation: true,  // Don't care where in the string the match is
      minMatchCharLength: 2
    });
  }, [creatures]);

  const filteredCreatures = useMemo(() => {
    // First apply fuzzy search if there's a search term
    let searchResults = creatures;
    if (filters.search && filters.search.trim().length > 0) {
      const results = fuse.search(filters.search);
      searchResults = results.map(result => result.item);
    }

    // Then apply all filters
    return searchResults.filter(creature => {
      // Helper function for range filtering
      const inRange = (value: number | null | undefined, min: number | null, max: number | null): boolean => {
        if (min !== null && (value === null || value === undefined || value < min)) return false;
        if (max !== null && (value === null || value === undefined || value > max)) return false;
        return true;
      };

      // Helper function for multi-select filtering with exclude mode
      const multiSelectFilter = (
        values: string[],
        creatureValues: string | string[] | null | undefined,
        excludeMode: boolean | undefined
      ): boolean => {
        if (values.length === 0) return true;
        if (!creatureValues) return false;

        const creatureValuesArray = Array.isArray(creatureValues) ? creatureValues : [creatureValues];
        const matches = values.some(filter =>
          creatureValuesArray.some(val => val.toLowerCase().includes(filter.toLowerCase()))
        );

        return excludeMode ? !matches : matches;
      };

      // Basic creature info filters
      if (!multiSelectFilter(filters.types, creature.type, filters.excludeMode?.types)) return false;
      if (!multiSelectFilter(filters.sizes, creature.size, filters.excludeMode?.sizes)) return false;
      if (!multiSelectFilter(filters.alignments, creature.alignment, filters.excludeMode?.alignments)) return false;
      if (!multiSelectFilter(filters.subtypes, creature.subtypes_normalized, filters.excludeMode?.subtypes)) return false;

      // Challenge and Experience filters
      const crValue = creature.cr_parsed?.value ?? creature.cr;
      if (!inRange(crValue, filters.crMin, filters.crMax)) return false;

      const mrValue = creature.mr_parsed?.value ?? creature.mr;
      if (!inRange(mrValue, filters.mrMin, filters.mrMax)) return false;

      if (!inRange(creature.xp, filters.xpMin, filters.xpMax)) return false;

      // AC filters
      if (!inRange(creature.ac, filters.acMin, filters.acMax)) return false;
      if (!inRange(creature.touch_ac, filters.touchAcMin, filters.touchAcMax)) return false;
      if (!inRange(creature.flat_ac, filters.flatFootedAcMin, filters.flatFootedAcMax)) return false;

      // HP filters
      if (!inRange(creature.hp?.total, filters.hpMin, filters.hpMax)) return false;

      // Initiative filters
      const initiativeValue = creature.initiative_parsed?.value ??
        (Array.isArray(creature.initiative) ? creature.initiative[0] : creature.initiative);
      if (!inRange(initiativeValue, filters.initiativeMin, filters.initiativeMax)) return false;

      // Saving Throws filters
      if (!inRange(creature.fort, filters.fortMin, filters.fortMax)) return false;
      if (!inRange(creature.ref, filters.refMin, filters.refMax)) return false;
      if (!inRange(creature.will, filters.willMin, filters.willMax)) return false;

      // Ability Score filters
      if (!inRange(creature.ability_scores.STR, filters.strMin, filters.strMax)) return false;
      if (!inRange(creature.ability_scores.DEX, filters.dexMin, filters.dexMax)) return false;
      if (!inRange(creature.ability_scores.CON, filters.conMin, filters.conMax)) return false;
      if (!inRange(creature.ability_scores.INT, filters.intMin, filters.intMax)) return false;
      if (!inRange(creature.ability_scores.WIS, filters.wisMin, filters.wisMax)) return false;
      if (!inRange(creature.ability_scores.CHA, filters.chaMin, filters.chaMax)) return false;

      // Combat Values filters
      if (!inRange(creature.bab, filters.babMin, filters.babMax)) return false;
      if (!inRange(creature.cmb, filters.cmbMin, filters.cmbMax)) return false;
      if (!inRange(creature.cmd, filters.cmdMin, filters.cmdMax)) return false;

      // Space and Reach filters
      if (!inRange(creature.space, filters.spaceMin, filters.spaceMax)) return false;
      if (!inRange(creature.reach, filters.reachMin, filters.reachMax)) return false;

      // Speed filters
      if (!inRange(creature.speeds?.base, filters.baseSpeedMin, filters.baseSpeedMax)) return false;
      if (!inRange(creature.speeds?.burrow, filters.burrowSpeedMin, filters.burrowSpeedMax)) return false;
      if (!inRange(creature.speeds?.climb, filters.climbSpeedMin, filters.climbSpeedMax)) return false;
      if (!inRange(creature.speeds?.fly, filters.flySpeedMin, filters.flySpeedMax)) return false;
      if (!inRange(creature.speeds?.swim, filters.swimSpeedMin, filters.swimSpeedMax)) return false;

      // Movement Types filter (has movement type)
      if (filters.movementTypes.length > 0) {
        const parsedSpeeds = creature.speeds?._parsed;
        const hasMovement = filters.movementTypes.some(moveType => {
          switch(moveType) {
            case 'burrow': return parsedSpeeds?.burrow !== null || creature.speeds?.burrow !== null;
            case 'climb': return parsedSpeeds?.climb !== null || creature.speeds?.climb !== null;
            case 'fly': return parsedSpeeds?.fly !== null || creature.speeds?.fly !== null;
            case 'swim': return parsedSpeeds?.swim !== null || creature.speeds?.swim !== null;
            default: return false;
          }
        });
        if (!hasMovement) return false;
      }

      // Spell Resistance filter
      const srValue = typeof creature.sr === 'number' ? creature.sr : (creature.sr_parsed?.value ?? null);
      if (!inRange(srValue, filters.srMin, filters.srMax)) return false;

      // Special abilities filters
      if (!multiSelectFilter(filters.specialAbilities,
        creature.special_abilities?._parsed?.map(a => a.name) || [],
        filters.excludeMode?.specialAbilities)) return false;

      if (!multiSelectFilter(filters.defensiveAbilities,
        creature.defensive_abilities_normalized,
        filters.excludeMode?.defensiveAbilities)) return false;

      // Language filters
      if (!multiSelectFilter(filters.languages,
        creature.languages_normalized,
        filters.excludeMode?.languages)) return false;

      // Environment filters
      if (!multiSelectFilter(filters.environments,
        creature.environment,
        filters.excludeMode?.environments)) return false;

      // Senses filters
      if (filters.senseTypes.length > 0) {
        const senseNames = creature.senses ? Object.keys(creature.senses) : [];
        if (!multiSelectFilter(filters.senseTypes, senseNames, filters.excludeMode?.senseTypes)) return false;
      }

      // Damage Reduction filters
      if (filters.drTypes.length > 0 || filters.drAmountMin !== null || filters.drAmountMax !== null) {
        const drEntries = creature.dr || [];
        if (drEntries.length === 0) {
          if (filters.drTypes.length > 0) return false;
        } else {
          if (filters.drTypes.length > 0) {
            const matches = drEntries.some(dr =>
              filters.drTypes.some(filterType =>
                dr.types?.some(type => type.toLowerCase().includes(filterType.toLowerCase()))
              )
            );
            if (filters.excludeMode?.drTypes ? matches : !matches) return false;
          }

          if (filters.drAmountMin !== null || filters.drAmountMax !== null) {
            const amounts = drEntries.map(dr => dr.amount).filter(Boolean);
            if (amounts.length === 0) return false;

            const maxAmount = Math.max(...amounts);
            if (!inRange(maxAmount, filters.drAmountMin, filters.drAmountMax)) return false;
          }
        }
      }

      // Resistances filters
      if (filters.resistanceTypes.length > 0 || filters.resistanceAmountMin !== null || filters.resistanceAmountMax !== null) {
        const resistances = creature.resistances;
        if (!resistances || Object.keys(resistances).length === 0) {
          if (filters.resistanceTypes.length > 0) return false;
        } else {
          if (filters.resistanceTypes.length > 0) {
            const resistanceNames = Object.keys(resistances);
            if (!multiSelectFilter(filters.resistanceTypes, resistanceNames, filters.excludeMode?.resistanceTypes)) return false;
          }

          if (filters.resistanceAmountMin !== null || filters.resistanceAmountMax !== null) {
            const amounts = Object.values(resistances).map(val => typeof val === 'number' ? val : null).filter(Boolean) as number[];
            if (amounts.length === 0) return false;

            const maxAmount = Math.max(...amounts);
            if (!inRange(maxAmount, filters.resistanceAmountMin, filters.resistanceAmountMax)) return false;
          }
        }
      }

      // Immunities and Weaknesses filters
      if (!multiSelectFilter(filters.immunities, creature.immunities_normalized, filters.excludeMode?.immunities)) return false;
      if (!multiSelectFilter(filters.weaknesses, creature.weaknesses_normalized, filters.excludeMode?.weaknesses)) return false;

      // Attack type filters
      if (filters.hasMeleeAttacks !== null) {
        const hasMelee = (creature.attacks?.melee?.length ?? 0) > 0;
        if (filters.hasMeleeAttacks !== hasMelee) return false;
      }

      if (filters.hasRangedAttacks !== null) {
        const hasRanged = (creature.attacks?.ranged?.length ?? 0) > 0;
        if (filters.hasRangedAttacks !== hasRanged) return false;
      }

      if (filters.hasSpecialAttacks !== null) {
        const hasSpecial = (creature.attacks?.special?.length ?? 0) > 0;
        if (filters.hasSpecialAttacks !== hasSpecial) return false;
      }

      // Special flags filters
      if (filters.hasSpellLikeAbilities !== null) {
        const hasSpellLike = !!(creature.spell_like_abilities?.entries?.length);
        if (filters.hasSpellLikeAbilities !== hasSpellLike) return false;
      }

      if (filters.hasSpells !== null) {
        const hasSpells = !!(creature.spells?.entries?.length);
        if (filters.hasSpells !== hasSpells) return false;
      }

      if (filters.hasPsychicMagic !== null) {
        const hasPsychic = !!(creature.psychic_magic?.entries?.length);
        if (filters.hasPsychicMagic !== hasPsychic) return false;
      }

      if (filters.hasRegeneration !== null) {
        const hasRegen = !!(creature.hp?.regeneration);
        if (filters.hasRegeneration !== hasRegen) return false;
      }

      if (filters.hasFastHealing !== null) {
        const hasFastHeal = !!(creature.hp?.fast_healing);
        if (filters.hasFastHealing !== hasFastHeal) return false;
      }

      if (filters.hasAuras !== null) {
        const hasAuras = (creature.auras_normalized?.length ?? 0) > 0;
        if (filters.hasAuras !== hasAuras) return false;
      }

      return true;
    });
  }, [creatures, filters]);

  const sortedCreatures = useMemo(() => {
    const sorted = [...filteredCreatures].sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'cr':
          const crA = a.cr_parsed?.value ?? a.cr ?? -1;
          const crB = b.cr_parsed?.value ?? b.cr ?? -1;
          compareValue = crA - crB;
          break;
        case 'type':
          compareValue = (a.type || '').localeCompare(b.type || '');
          break;
        case 'size':
          const sizeA = sizeOrder.indexOf(a.size);
          const sizeB = sizeOrder.indexOf(b.size);
          compareValue = sizeA - sizeB;
          break;
      }

      return sortDirection === 'desc' ? -compareValue : compareValue;
    });

    return sorted;
  }, [filteredCreatures, sortField, sortDirection]);

  const paginatedCreatures = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCreatures.slice(startIndex, endIndex);
  }, [sortedCreatures, currentPage]);

  const totalPages = Math.ceil(sortedCreatures.length / itemsPerPage);

  // Calculate CR distribution for histogram
  const crDistribution = useMemo(() => {
    const distribution = new Map<number, number>();

    // Count creatures at each CR value
    filteredCreatures.forEach(creature => {
      const cr = creature.cr_parsed?.value ?? parseFloat(creature.cr || '0');
      if (!isNaN(cr)) {
        distribution.set(cr, (distribution.get(cr) || 0) + 1);
      }
    });

    // Convert to array and sort by CR
    const sorted = Array.from(distribution.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([cr, count]) => ({ cr, count }));

    // Find min and max CR values
    const allCRs = creatures.map(c => c.cr_parsed?.value ?? parseFloat(c.cr || '0')).filter(cr => !isNaN(cr));
    const minCR = Math.min(...allCRs);
    const maxCR = Math.max(...allCRs);

    return { distribution: sorted, minCR, maxCR };
  }, [filteredCreatures, creatures]);

  const uniqueTypesWithCounts = useMemo(() => {
    const typeCounts = new Map<string, number>();
    filteredCreatures.forEach(c => {
      if (c.type) {
        typeCounts.set(c.type, (typeCounts.get(c.type) || 0) + 1);
      }
    });
    return Array.from(typeCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([type, count]) => ({ value: type, count }));
  }, [filteredCreatures]);

  const uniqueSizesWithCounts = useMemo(() => {
    const sizeCounts = new Map<string, number>();
    filteredCreatures.forEach(c => {
      if (c.size) {
        sizeCounts.set(c.size, (sizeCounts.get(c.size) || 0) + 1);
      }
    });
    return Array.from(sizeCounts.entries())
      .sort((a, b) => {
        const aIndex = sizeOrder.indexOf(a[0]);
        const bIndex = sizeOrder.indexOf(b[0]);
        if (aIndex === -1 && bIndex === -1) return a[0].localeCompare(b[0]);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      })
      .map(([size, count]) => ({ value: size, count }));
  }, [filteredCreatures]);

  const uniqueAlignmentsWithCounts = useMemo(() => {
    const alignmentCounts = new Map<string, number>();
    filteredCreatures.forEach(c => {
      if (c.alignment) {
        alignmentCounts.set(c.alignment, (alignmentCounts.get(c.alignment) || 0) + 1);
      }
    });
    return Array.from(alignmentCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([alignment, count]) => ({ value: alignment, count }));
  }, [filteredCreatures]);

  const uniqueSubtypesWithCounts = useMemo(() => {
    const subtypeCounts = new Map<string, number>();
    filteredCreatures.forEach(c => {
      if (c.subtypes_normalized) {
        c.subtypes_normalized.forEach(subtype => {
          subtypeCounts.set(subtype, (subtypeCounts.get(subtype) || 0) + 1);
        });
      }
    });
    return Array.from(subtypeCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([subtype, count]) => ({ value: subtype, count }));
  }, [filteredCreatures]);

  const uniqueMovementTypesWithCounts = useMemo(() => {
    const moveTypeCounts = new Map<string, number>();
    filteredCreatures.forEach(c => {
      const parsed = c.speeds?._parsed;
      if (parsed) {
        if (parsed.burrow !== null) moveTypeCounts.set('burrow', (moveTypeCounts.get('burrow') || 0) + 1);
        if (parsed.climb !== null) moveTypeCounts.set('climb', (moveTypeCounts.get('climb') || 0) + 1);
        if (parsed.fly !== null) moveTypeCounts.set('fly', (moveTypeCounts.get('fly') || 0) + 1);
        if (parsed.swim !== null) moveTypeCounts.set('swim', (moveTypeCounts.get('swim') || 0) + 1);
      }
    });
    return Array.from(moveTypeCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([moveType, count]) => ({ value: moveType, count }));
  }, [filteredCreatures]);

  const uniqueSpecialAbilitiesWithCounts = useMemo(() => {
    const abilityCounts = new Map<string, number>();
    filteredCreatures.forEach(c => {
      const parsed = c.special_abilities?._parsed;
      if (parsed) {
        parsed.forEach(ability => {
          if (ability.name) {
            abilityCounts.set(ability.name, (abilityCounts.get(ability.name) || 0) + 1);
          }
        });
      }
    });
    return Array.from(abilityCounts.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 50)
      .map(([ability, count]) => ({ value: ability, count }));
  }, [filteredCreatures]);

  const uniqueDefensiveAbilitiesWithCounts = useMemo(() => {
    const abilityCounts = new Map<string, number>();
    filteredCreatures.forEach(c => {
      if (c.defensive_abilities_normalized) {
        c.defensive_abilities_normalized.forEach(ability => {
          abilityCounts.set(ability, (abilityCounts.get(ability) || 0) + 1);
        });
      }
    });
    return Array.from(abilityCounts.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 30)
      .map(([ability, count]) => ({ value: ability, count }));
  }, [filteredCreatures]);

  // Keep the old ones for backward compatibility
  const uniqueTypes = useMemo(() => uniqueTypesWithCounts.map(t => t.value), [uniqueTypesWithCounts]);
  const uniqueSizes = useMemo(() => uniqueSizesWithCounts.map(s => s.value), [uniqueSizesWithCounts]);
  const uniqueAlignments = useMemo(() => uniqueAlignmentsWithCounts.map(a => a.value), [uniqueAlignmentsWithCounts]);
  const uniqueSubtypes = useMemo(() => uniqueSubtypesWithCounts.map(s => s.value), [uniqueSubtypesWithCounts]);
  const uniqueMovementTypes = useMemo(() => uniqueMovementTypesWithCounts.map(m => m.value), [uniqueMovementTypesWithCounts]);
  const uniqueSpecialAbilities = useMemo(() => uniqueSpecialAbilitiesWithCounts.map(s => s.value), [uniqueSpecialAbilitiesWithCounts]);
  const uniqueDefensiveAbilities = useMemo(() => uniqueDefensiveAbilitiesWithCounts.map(d => d.value), [uniqueDefensiveAbilitiesWithCounts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortField, sortDirection]);

  return {
    creatures: paginatedCreatures,
    allCreatures: creatures, // All creatures for filter extraction
    totalCreatures: creatures.length,
    filteredCount: sortedCreatures.length,
    loading,
    error,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    totalPages,
    uniqueTypes,
    uniqueSizes,
    uniqueAlignments,
    uniqueSubtypes,
    uniqueMovementTypes,
    uniqueSpecialAbilities,
    uniqueDefensiveAbilities,
    uniqueTypesWithCounts,
    uniqueSizesWithCounts,
    uniqueAlignmentsWithCounts,
    uniqueSubtypesWithCounts,
    uniqueMovementTypesWithCounts,
    uniqueSpecialAbilitiesWithCounts,
    uniqueDefensiveAbilitiesWithCounts,
    crDistribution
  };
}