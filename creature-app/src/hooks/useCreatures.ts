import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { CreatureEnriched } from '@/types/creature-complete';
import { FILTER_DEFINITIONS } from '@/config/filters';
import { createDefaultFilters, applyFilter } from '@/utils/filterUtils';

// Generate Filters interface from configuration
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
  mrMin: number | null;
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

  // Movement Types
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
  drTypes: string[];
  drAmountMin: number | null;
  drAmountMax: number | null;

  // Resistances
  resistanceTypes: string[];
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
  const [filters, setFilters] = useState<Filters>(createDefaultFilters());
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

    // Then apply all filters using configuration-driven approach
    return searchResults.filter(creature => {
      // Apply each configured filter
      return FILTER_DEFINITIONS.every(filterConfig => {
        return applyFilter(creature, filterConfig, filters, filters.excludeMode?.[filterConfig.key as keyof typeof filters.excludeMode]);
      });
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
      const cr = creature.cr_parsed?.value ?? parseFloat(String(creature.cr) || '0');
      if (!isNaN(cr)) {
        distribution.set(cr, (distribution.get(cr) || 0) + 1);
      }
    });

    // Convert to array and sort by CR
    const sorted = Array.from(distribution.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([cr, count]) => ({ cr, count }));

    // Find min and max CR values
    const allCRs = creatures.map(c => c.cr_parsed?.value ?? parseFloat(String(c.cr) || '0')).filter(cr => !isNaN(cr));
    const minCR = Math.min(...allCRs);
    const maxCR = Math.max(...allCRs);

    return { distribution: sorted, minCR, maxCR };
  }, [filteredCreatures, creatures]);


  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortField, sortDirection]);

  return {
    creatures: paginatedCreatures,
    allCreatures: creatures,
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
    crDistribution
  };
}