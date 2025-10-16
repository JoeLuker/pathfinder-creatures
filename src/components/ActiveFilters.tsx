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

  const maxVisibleMobile = 3;
  const showMoreMobile = activeFilters.length > maxVisibleMobile;

  return (
    <div className="bg-interactive-secondary/30 rounded-md border border-border p-2 mb-2">
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary flex-shrink-0">
          <Filter className="h-4 w-4 text-interactive-primary" />
          <span className="font-medium">Active:</span>
        </div>

        {/* Mobile: Horizontal scroll with max visible */}
        <div className="md:hidden flex-1 overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div className="flex gap-1.5 min-w-max">
            {activeFilters.slice(0, maxVisibleMobile).map((filter, index) => (
              <Badge
                key={`${filter.label}-${filter.value}-${index}`}
                variant="secondary"
                className="pl-2 pr-1 py-0.5 flex items-center gap-1 bg-interactive-secondary text-text-primary border-border hover:bg-interactive-secondary-hover transition-colors flex-shrink-0"
              >
                <span className="text-xs font-medium capitalize whitespace-nowrap">{filter.value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-interactive-secondary-hover rounded-full"
                  onClick={filter.clear}
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="h-3 w-3 text-text-secondary" />
                </Button>
              </Badge>
            ))}
            {showMoreMobile && (
              <Badge variant="outline" className="pl-2 pr-2 py-0.5 text-xs text-text-secondary flex-shrink-0">
                +{activeFilters.length - maxVisibleMobile} more
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs flex-shrink-0"
              onClick={() => {
                const defaultFilters = createDefaultFilters();
                setFilters({ ...defaultFilters, search: filters.search });
              }}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Desktop: Wrap as before */}
        <div className="hidden md:flex md:flex-wrap gap-1.5 flex-1">
          {activeFilters.map((filter, index) => (
            <Badge
              key={`${filter.label}-${filter.value}-${index}`}
              variant="secondary"
              className="pl-2 pr-1 py-0.5 flex items-center gap-1 bg-interactive-secondary text-text-primary border-border hover:bg-interactive-secondary-hover transition-colors"
            >
              <span className="text-xs text-text-secondary">{filter.label}:</span>
              <span className="text-xs font-medium capitalize">{filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-interactive-secondary-hover rounded-full"
                onClick={filter.clear}
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="h-3 w-3 text-text-secondary" />
              </Button>
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs"
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