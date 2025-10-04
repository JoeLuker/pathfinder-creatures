import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import type { Filters } from '@/hooks/useCreatures';
import { createDefaultFilters } from '@/utils/filterUtils';
import { FILTER_DEFINITIONS } from '@/config/filters';

interface ActiveFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function ActiveFilters({ filters, setFilters }: ActiveFiltersProps) {
  const activeFilters: { label: string; value: string; clear: () => void }[] = [];

  // Use configuration-driven approach to collect active filters
  FILTER_DEFINITIONS.forEach(filterConfig => {
    switch (filterConfig.type) {
      case 'multiSelect': {
        const values = (filters as any)[filterConfig.key] as string[] || [];
        const excludeMode = filters.excludeMode?.[filterConfig.key as keyof typeof filters.excludeMode];
        const labelPrefix = excludeMode ? 'Exclude' : '';

        values.forEach(value => {
          activeFilters.push({
            label: labelPrefix ? `${labelPrefix} ${filterConfig.label}` : filterConfig.label,
            value,
            clear: () => setFilters(prev => ({
              ...prev,
              [filterConfig.key]: ((prev as any)[filterConfig.key] as string[]).filter(v => v !== value)
            }))
          });
        });
        break;
      }
      case 'range': {
        const minKey = `${filterConfig.key}Min` as keyof Filters;
        const maxKey = `${filterConfig.key}Max` as keyof Filters;
        const min = filters[minKey] as number | null;
        const max = filters[maxKey] as number | null;

        if (min !== null || max !== null) {
          let rangeText = '';
          if (min !== null && max !== null) {
            rangeText = `${min} - ${max}`;
          } else if (min !== null) {
            rangeText = `≥ ${min}`;
          } else {
            rangeText = `≤ ${max}`;
          }

          activeFilters.push({
            label: filterConfig.label,
            value: rangeText,
            clear: () => setFilters(prev => ({
              ...prev,
              [minKey]: null,
              [maxKey]: null
            }))
          });
        }
        break;
      }
      case 'boolean': {
        const value = filters[filterConfig.key as keyof Filters] as boolean | null;
        if (value !== null) {
          activeFilters.push({
            label: filterConfig.label,
            value: value ? 'Yes' : 'No',
            clear: () => setFilters(prev => ({
              ...prev,
              [filterConfig.key]: null
            }))
          });
        }
        break;
      }
    }
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-interactive-secondary/30 rounded-md border border-border p-2 mb-2">
      <div className="flex items-start gap-2">
        <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary pt-1">
          <Filter className="h-4 w-4 text-interactive-primary" />
          <span className="font-medium">Active:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {activeFilters.map((filter, index) => (
            <Badge
              key={`${filter.label}-${filter.value}-${index}`}
              variant="secondary"
              className="pl-2.5 pr-1.5 py-1 md:py-0.5 flex items-center gap-1.5 bg-interactive-secondary text-text-primary border-border hover:bg-interactive-secondary-hover transition-colors min-h-[32px] md:min-h-auto"
            >
              <span className="text-xs text-text-secondary hidden md:inline">{filter.label}:</span>
              <span className="text-xs font-medium capitalize">{filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 md:h-4 md:w-4 p-0 ml-0.5 hover:bg-interactive-secondary-hover rounded-full min-h-[24px] md:min-h-auto"
                onClick={filter.clear}
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="h-3.5 w-3.5 md:h-3 md:w-3 text-text-secondary" />
              </Button>
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 md:h-7 px-2.5 text-xs min-h-[32px] md:min-h-auto"
              onClick={() => {
                const defaultFilters = createDefaultFilters();
                setFilters({ ...defaultFilters, search: filters.search });
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}