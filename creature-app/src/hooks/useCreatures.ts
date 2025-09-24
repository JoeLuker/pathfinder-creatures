import { useState, useEffect, useMemo } from 'react';
import type { CreatureEnriched } from '@/types/creature-complete';

export interface Filters {
  search: string;
  types: string[];  // Changed to array for multi-select
  sizes: string[];  // Changed to array for multi-select
  crMin: number | null;
  crMax: number | null;
  alignments: string[];  // Changed to array for multi-select
  subtypes: string[];
  movementTypes: string[];
  specialAbilities: string[];
  defensiveAbilities: string[];
  excludeMode?: {
    types?: boolean;
    sizes?: boolean;
    alignments?: boolean;
    subtypes?: boolean;
    movementTypes?: boolean;
    specialAbilities?: boolean;
    defensiveAbilities?: boolean;
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
    types: [],
    sizes: [],
    crMin: null,
    crMax: null,
    alignments: [],
    subtypes: [],
    movementTypes: [],
    specialAbilities: [],
    defensiveAbilities: []
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

  const filteredCreatures = useMemo(() => {
    return creatures.filter(creature => {
      // Full-text search across all relevant fields
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();

        // Build comprehensive search text
        const searchableText = [
          creature.name,
          creature.type,
          creature.alignment,
          creature.size,
          creature.environment,
          creature.desc_short,
          creature.desc_long,
          // Add subtypes
          ...(creature.subtypes_normalized || []),
          // Add special abilities names
          ...(creature.special_abilities?._parsed?.map(a => a.name) || []),
          // Add defensive abilities
          ...(creature.defensive_abilities_normalized || []),
          // Add immunities
          ...(creature.immunities_normalized || []),
          // Add languages
          ...(creature.languages_normalized || []),
          // Add CR as text
          `cr ${creature.cr_parsed?.value ?? creature.cr}`,
          `cr${creature.cr_parsed?.value ?? creature.cr}`,
          // Add movement types
          creature.speeds?._parsed?.fly ? 'fly flying flight' : '',
          creature.speeds?._parsed?.swim ? 'swim swimming aquatic' : '',
          creature.speeds?._parsed?.burrow ? 'burrow burrowing' : '',
          creature.speeds?._parsed?.climb ? 'climb climbing' : '',
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }
      // Types filter (multi-select with exclude mode)
      if (filters.types.length > 0 && creature.type) {
        const matches = filters.types.includes(creature.type);
        if (filters.excludeMode?.types) {
          if (matches) return false; // Exclude if it matches any selected type
        } else {
          if (!matches) return false; // Include only if it matches a selected type
        }
      }

      // Sizes filter (multi-select with exclude mode)
      if (filters.sizes.length > 0 && creature.size) {
        const matches = filters.sizes.includes(creature.size);
        if (filters.excludeMode?.sizes) {
          if (matches) return false;
        } else {
          if (!matches) return false;
        }
      }

      // Use parsed CR values for more accurate filtering
      const crValue = creature.cr_parsed?.value ?? creature.cr;
      if (filters.crMin !== null && (crValue === null || crValue < filters.crMin)) {
        return false;
      }
      if (filters.crMax !== null && (crValue === null || crValue > filters.crMax)) {
        return false;
      }

      // Alignments filter (multi-select with exclude mode)
      if (filters.alignments.length > 0 && creature.alignment) {
        const matches = filters.alignments.includes(creature.alignment);
        if (filters.excludeMode?.alignments) {
          if (matches) return false;
        } else {
          if (!matches) return false;
        }
      }

      // Filter by subtypes (normalized array)
      if (filters.subtypes.length > 0) {
        const creatureSubtypes = creature.subtypes_normalized || [];
        if (!filters.subtypes.some(subtype => creatureSubtypes.includes(subtype))) {
          return false;
        }
      }

      // Filter by movement types (from parsed speeds)
      if (filters.movementTypes.length > 0) {
        const parsedSpeeds = creature.speeds?._parsed;
        if (!parsedSpeeds) return false;

        const hasMovement = filters.movementTypes.some(moveType => {
          switch(moveType) {
            case 'burrow': return parsedSpeeds.burrow !== null;
            case 'climb': return parsedSpeeds.climb !== null;
            case 'fly': return parsedSpeeds.fly !== null;
            case 'swim': return parsedSpeeds.swim !== null;
            default: return false;
          }
        });
        if (!hasMovement) return false;
      }

      // Filter by special abilities (from parsed array)
      if (filters.specialAbilities.length > 0) {
        const parsedAbilities = creature.special_abilities?._parsed || [];
        const abilityNames = parsedAbilities.map(a => a.name.toLowerCase());
        if (!filters.specialAbilities.some(ability =>
          abilityNames.some(name => name.includes(ability.toLowerCase()))
        )) {
          return false;
        }
      }

      // Filter by defensive abilities (normalized array)
      if (filters.defensiveAbilities.length > 0) {
        const defAbilities = creature.defensive_abilities_normalized || [];
        if (!filters.defensiveAbilities.some(ability =>
          defAbilities.some(def => def.toLowerCase().includes(ability.toLowerCase()))
        )) {
          return false;
        }
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