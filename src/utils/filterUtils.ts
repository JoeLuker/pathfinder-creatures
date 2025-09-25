import type { Filters } from '@/hooks/useCreatures';
import { FILTER_DEFINITIONS, type FilterConfig } from '@/config/filters';
import type { CreatureEnriched } from '@/types/creature-complete';

// Create default empty filters based on the configuration
export const createDefaultFilters = (): Filters => {
  const defaultFilters: any = { search: '' };

  FILTER_DEFINITIONS.forEach(filter => {
    switch (filter.type) {
      case 'range':
        defaultFilters[`${filter.key}Min`] = null;
        defaultFilters[`${filter.key}Max`] = null;
        break;
      case 'multiSelect':
        defaultFilters[filter.key] = [];
        break;
      case 'boolean':
        defaultFilters[filter.key] = null;
        break;
      case 'combobox':
        defaultFilters[filter.key] = [];
        break;
    }
  });

  return defaultFilters as Filters;
};

// Apply a single filter to a creature
export const applyFilter = (
  creature: any,
  filter: FilterConfig,
  filterValue: any,
  excludeMode: boolean = false,
  filterMode: 'any' | 'all' = 'any'
): boolean => {
  const creatureValue = filter.getValue?.(creature);

  switch (filter.type) {
    case 'range': {
      const minKey = `${filter.key}Min`;
      const maxKey = `${filter.key}Max`;
      const min = filterValue[minKey];
      const max = filterValue[maxKey];

      if (min !== null && (creatureValue === null || creatureValue === undefined || creatureValue < min)) {
        return false;
      }
      if (max !== null && (creatureValue === null || creatureValue === undefined || creatureValue > max)) {
        return false;
      }
      return true;
    }

    case 'multiSelect': {
      const selectedValues = filterValue[filter.key] || [];
      if (selectedValues.length === 0) return true;
      if (!creatureValue) return false;

      const creatureValues = Array.isArray(creatureValue) ? creatureValue : [creatureValue];

      let matches: boolean;
      if (filterMode === 'all') {
        // ALL mode: creature must have ALL selected values
        matches = selectedValues.every((filterVal: string) =>
          creatureValues.some((creatureVal: string) =>
            creatureVal.toLowerCase() === filterVal.toLowerCase()
          )
        );
      } else {
        // ANY mode: creature must have at least ONE selected value (default behavior)
        matches = selectedValues.some((filterVal: string) =>
          creatureValues.some((creatureVal: string) =>
            creatureVal.toLowerCase() === filterVal.toLowerCase()
          )
        );
      }

      return excludeMode ? !matches : matches;
    }

    case 'boolean': {
      const booleanValue = filterValue[filter.key];
      if (booleanValue === null) return true;
      return booleanValue === creatureValue;
    }

    default:
      return true;
  }
};

// Get active filter count
export const getActiveFilterCount = (filters: Filters): number => {
  let count = 0;

  // Search
  if (filters.search && filters.search.trim().length > 0) count++;

  // All other filters
  FILTER_DEFINITIONS.forEach(filter => {
    switch (filter.type) {
      case 'range':
        const minKey = `${filter.key}Min` as keyof Filters;
        const maxKey = `${filter.key}Max` as keyof Filters;
        if (filters[minKey] !== null || filters[maxKey] !== null) count++;
        break;
      case 'multiSelect':
        const multiSelectValue = filters[filter.key as keyof Filters] as string[];
        if (multiSelectValue && multiSelectValue.length > 0) count++;
        break;
      case 'boolean':
        if (filters[filter.key as keyof Filters] !== null) count++;
        break;
    }
  });

  return count;
};

// Calculate predictive count - how many creatures will remain if this filter value is selected
export const getPredictiveCount = (
  creatures: CreatureEnriched[],
  currentFilters: Filters,
  filterConfig: FilterConfig,
  filterValue: string | boolean | { min: number | null; max: number | null }
): number => {
  // Create a simulated filter state with the new value applied
  const simulatedFilters = { ...currentFilters };

  switch (filterConfig.type) {
    case 'multiSelect': {
      const currentValues = (currentFilters[filterConfig.key as keyof Filters] as string[]) || [];
      const isCurrentlySelected = currentValues.includes(filterValue as string);

      if (isCurrentlySelected) {
        // For selected items: simulate removing this item from the current selection
        const newValues = currentValues.filter(v => v !== filterValue as string);
        (simulatedFilters as any)[filterConfig.key] = newValues;
      } else {
        // For unselected items: simulate adding this item to the current selection
        const newValues = [...currentValues, filterValue as string];
        (simulatedFilters as any)[filterConfig.key] = newValues;
      }

      break;
    }
    case 'boolean': {
      (simulatedFilters as any)[filterConfig.key] = filterValue as boolean;
      break;
    }
    case 'range': {
      const { min, max } = filterValue as { min: number | null; max: number | null };
      (simulatedFilters as any)[`${filterConfig.key}Min`] = min;
      (simulatedFilters as any)[`${filterConfig.key}Max`] = max;
      break;
    }
  }

  // Apply all filters to get the count
  return creatures.filter(creature => {
    return FILTER_DEFINITIONS.every(config => {
      const isExcluded = simulatedFilters.excludeMode?.[config.key as keyof typeof simulatedFilters.excludeMode];
      const filterModeValue = simulatedFilters.filterMode?.[config.key as keyof typeof simulatedFilters.filterMode] || 'any';
      return applyFilter(creature, config, simulatedFilters, isExcluded, filterModeValue);
    });
  }).length;
};