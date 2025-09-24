import type { Filters } from '@/hooks/useCreatures';
import { FILTER_DEFINITIONS, type FilterConfig } from '@/config/filters';

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
  excludeMode: boolean = false
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
      const matches = selectedValues.some((filterVal: string) =>
        creatureValues.some((creatureVal: string) =>
          creatureVal.toLowerCase().includes(filterVal.toLowerCase())
        )
      );

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

// Get summary of active filters
export const getActiveFilterSummary = (filters: Filters): string[] => {
  const summary: string[] = [];

  if (filters.search && filters.search.trim().length > 0) {
    summary.push(`Search: "${filters.search}"`);
  }

  FILTER_DEFINITIONS.forEach(filter => {
    switch (filter.type) {
      case 'range': {
        const minKey = `${filter.key}Min` as keyof Filters;
        const maxKey = `${filter.key}Max` as keyof Filters;
        const min = filters[minKey] as number | null;
        const max = filters[maxKey] as number | null;

        if (min !== null || max !== null) {
          let rangeText = filter.label + ': ';
          if (min !== null && max !== null) {
            rangeText += `${min} - ${max}`;
          } else if (min !== null) {
            rangeText += `≥ ${min}`;
          } else {
            rangeText += `≤ ${max}`;
          }
          summary.push(rangeText);
        }
        break;
      }
      case 'multiSelect': {
        const values = filters[filter.key as keyof Filters] as string[];
        if (values && values.length > 0) {
          summary.push(`${filter.label}: ${values.length} selected`);
        }
        break;
      }
      case 'boolean': {
        const value = filters[filter.key as keyof Filters];
        if (value !== null) {
          summary.push(`${filter.label}: ${value ? 'Yes' : 'No'}`);
        }
        break;
      }
    }
  });

  return summary;
};

// Validate filter ranges
export const validateFilterRanges = (filters: Filters): { [key: string]: string[] } => {
  const errors: { [key: string]: string[] } = {};

  FILTER_DEFINITIONS.forEach(filter => {
    if (filter.type === 'range') {
      const minKey = `${filter.key}Min` as keyof Filters;
      const maxKey = `${filter.key}Max` as keyof Filters;
      const min = filters[minKey] as number | null;
      const max = filters[maxKey] as number | null;

      const filterErrors: string[] = [];

      if (min !== null && filter.min !== undefined && min < filter.min) {
        filterErrors.push(`Minimum value cannot be less than ${filter.min}`);
      }
      if (max !== null && filter.max !== undefined && max > filter.max) {
        filterErrors.push(`Maximum value cannot be greater than ${filter.max}`);
      }
      if (min !== null && max !== null && min > max) {
        filterErrors.push(`Minimum value cannot be greater than maximum value`);
      }

      if (filterErrors.length > 0) {
        errors[filter.key] = filterErrors;
      }
    }
  });

  return errors;
};

// Reset specific filter category
export const resetFilterCategory = (category: string): Partial<Filters> => {
  const categoryFilters = FILTER_DEFINITIONS.filter(f => f.category === category);
  const resetUpdates: any = {};

  categoryFilters.forEach(filter => {
    switch (filter.type) {
      case 'range':
        resetUpdates[`${filter.key}Min`] = null;
        resetUpdates[`${filter.key}Max`] = null;
        break;
      case 'multiSelect':
        resetUpdates[filter.key] = [];
        break;
      case 'boolean':
        resetUpdates[filter.key] = null;
        break;
    }
  });

  return resetUpdates;
};

// Get filter display value
export const getFilterDisplayValue = (filters: Filters, filterKey: string): string => {
  const filter = FILTER_DEFINITIONS.find(f => f.key === filterKey);
  if (!filter) return '';

  switch (filter.type) {
    case 'range': {
      const minKey = `${filter.key}Min` as keyof Filters;
      const maxKey = `${filter.key}Max` as keyof Filters;
      const min = filters[minKey] as number | null;
      const max = filters[maxKey] as number | null;

      if (min !== null && max !== null) return `${min} - ${max}`;
      if (min !== null) return `≥ ${min}`;
      if (max !== null) return `≤ ${max}`;
      return '';
    }
    case 'multiSelect': {
      const values = filters[filterKey as keyof Filters] as string[];
      return values?.length ? `${values.length} selected` : '';
    }
    case 'boolean': {
      const value = filters[filterKey as keyof Filters];
      return value !== null ? (value ? 'Yes' : 'No') : '';
    }
    default:
      return '';
  }
};