import { useState } from 'react';
import { List } from 'react-window';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RangeSlider } from '@/components/ui/range-slider';
import type { Filters } from '@/hooks/useCreatures';
import {
  FILTER_DEFINITIONS,
  FILTER_CATEGORIES,
  getAllCategories,
  getFiltersByCategory,
  type FilterConfig
} from '@/config/filters';
import { getActiveFilterCount, getPredictiveCount } from '@/utils/filterUtils';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

// Constants for virtualization
const VIRTUAL_LIST_HEIGHT = 192; // 48 * 4 (tailwind's max-h-48)
const VIRTUAL_ROW_HEIGHT = 36;
const VIRTUAL_LIST_STYLE = { height: VIRTUAL_LIST_HEIGHT, overflow: 'auto' as const };

interface CountItem {
  value: string;
  count: number;
}

interface SidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  creatures: any[]; // All creatures for filter extraction
  filteredCreatures?: any[]; // Currently filtered creatures for predictive counts
  precomputedFilterOptions: Map<string, { value: string; count: number }[]>;
  crDistribution?: {
    distribution: { cr: number; count: number }[];
    minCR: number;
    maxCR: number;
  };
  // Shared state for responsive consistency
  expandedSections: Record<string, boolean>;
  setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  searchStates: Record<string, string>;
  setSearchStates: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function Sidebar({ // noqa
  filters,
  setFilters,
  creatures,
  filteredCreatures,
  precomputedFilterOptions,
  crDistribution,
  expandedSections,
  setExpandedSections,
  searchStates,
  setSearchStates,
}: SidebarProps) {

  // Filter display states - show all values vs only values with data
  const [showAllValues, setShowAllValues] = useState<Record<string, boolean>>({});

  // Helper to determine toggle button appearance
  const getToggleVariant = (isActive: boolean) => isActive ? "secondary" : "ghost";

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const setSearchState = (filterKey: string, value: string) => {
    setSearchStates(prev => ({ ...prev, [filterKey]: value }));
  };

  const toggleShowAllValues = (filterKey: string) => {
    setShowAllValues(prev => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  const toggleFilterMode = (filterKey: string) => {
    setFilters(prev => ({
      ...prev,
      filterMode: {
        ...prev.filterMode,
        [filterKey]: prev.filterMode?.[filterKey as keyof typeof prev.filterMode] === 'all' ? 'any' : 'all'
      }
    }));
  };

  // Get active filter count for a category
  const getCategoryActiveCount = (category: string) => {
    const categoryFilters = getFiltersByCategory(category);
    let count = 0;

    categoryFilters.forEach(filter => {
      if (filter.type === 'multiSelect') {
        const values = (filters[filter.key as keyof Filters] as string[]) || [];
        count += values.length;
      } else if (filter.type === 'range') {
        const minKey = `${filter.key}Min` as keyof Filters;
        const maxKey = `${filter.key}Max` as keyof Filters;
        if (filters[minKey] !== null || filters[maxKey] !== null) count++;
      } else if (filter.type === 'boolean') {
        if (filters[filter.key as keyof Filters] !== null) count++;
      }
    });

    return count;
  };

  // Generic toggle handler for multi-select filters
  const handleMultiSelectToggle = (filterKey: string, value: string) => {
    setFilters(prev => {
      const currentValues = (prev[filterKey as keyof Filters] as string[]) || [];
      return {
        ...prev,
        [filterKey]: currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  // Generic range handler
  const handleRangeChange = (filterKey: string, [min, max]: [number | null, number | null]) => {
    setFilters(prev => ({
      ...prev,
      [`${filterKey}Min`]: min,
      [`${filterKey}Max`]: max
    }));
  };

  // Generic boolean handler
  const handleBooleanChange = (filterKey: string, value: boolean | null) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };


  // Get unique numeric values for range fields
  const getUniqueRangeValues = (filterConfig: FilterConfig): number[] => {
    const values = new Set<number>();
    creatures.forEach(creature => {
      const value = filterConfig.getValue?.(creature);
      if (typeof value === 'number' && !isNaN(value)) {
        values.add(value);
      }
    });
    return Array.from(values).sort((a, b) => a - b);
  };


  const activeFiltersCount = getActiveFilterCount(filters);
  const [globalFilterSearch, setGlobalFilterSearch] = useState('');

  return (
    <div className="space-y-2 md:space-y-1 h-full overflow-y-auto">
      {/* Filters */}
      <div className="bg-surface-primary rounded-md shadow-sm border p-3 md:p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const defaultFilters = FILTER_DEFINITIONS.reduce((acc, filter) => {
                  switch (filter.type) {
                    case 'range':
                      acc[`${filter.key}Min`] = null;
                      acc[`${filter.key}Max`] = null;
                      break;
                    case 'multiSelect':
                      acc[filter.key] = [];
                      break;
                    case 'boolean':
                      acc[filter.key] = null;
                      break;
                  }
                  return acc;
                }, {
                  search: '',
                  excludeMode: {},
                  filterMode: {}
                } as any);
                setFilters(defaultFilters);
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Global Filter Search */}
        <div className="mb-3">
          <Input
            type="text"
            placeholder="Search filters..."
            value={globalFilterSearch}
            onChange={(e) => setGlobalFilterSearch(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Dynamic Filter Sections by Category */}
        {getAllCategories().filter(category => {
          if (!globalFilterSearch) return true;
          const searchLower = globalFilterSearch.toLowerCase();
          return category.toLowerCase().includes(searchLower) ||
            getFiltersByCategory(category).some(f => f.label.toLowerCase().includes(searchLower));
        }).map(category => {
          const categoryFilters = getFiltersByCategory(category);
          const isExpanded = expandedSections[category];

          // Special handling for CR filter with histogram
          if (category === FILTER_CATEGORIES.CHALLENGE && crDistribution) {
            const crFilter = categoryFilters.find(f => f.key === 'cr');
            if (crFilter) {
              return (
                <div key={category} className="border-t pt-3 mt-1">
                  <button
                    className="flex items-center justify-between w-full text-left mb-2 py-1.5 px-1 -mx-1 rounded-md hover:bg-surface-secondary transition-colors group"
                    onClick={() => toggleSection(category)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {crFilter.icon && <crFilter.icon className="h-4 w-4 flex-shrink-0" />}
                      <span className="text-sm font-medium truncate">{category}</span>
                      {(() => {
                        const activeCount = getCategoryActiveCount(category);
                        return activeCount > 0 ? (
                          <span className="flex-shrink-0 h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-interactive-primary text-text-inverse text-xs rounded-full font-semibold">
                            {activeCount}
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-text-tertiary group-hover:text-text-secondary transition-colors" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-text-tertiary group-hover:text-text-secondary transition-colors" />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="space-y-1">
                      {/* CR Distribution Histogram */}
                      <div className="h-12 md:h-16 flex items-end gap-0.5 px-2">
                        {(() => {
                          const maxCount = Math.max(...crDistribution.distribution.map(d => d.count));
                          const bucketWidth = 1;
                          const buckets = new Map<number, number>();

                          for (let cr = crDistribution.minCR; cr <= crDistribution.maxCR; cr += bucketWidth) {
                            buckets.set(cr, 0);
                          }

                          crDistribution.distribution.forEach(({ cr, count }) => {
                            const bucket = Math.floor(cr / bucketWidth) * bucketWidth;
                            buckets.set(bucket, (buckets.get(bucket) || 0) + count);
                          });

                          return Array.from(buckets.entries())
                            .sort((a, b) => a[0] - b[0])
                            .map(([cr, count]) => {
                              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                              const isInRange =
                                (filters.crMin === null || cr >= filters.crMin) &&
                                (filters.crMax === null || cr <= filters.crMax);

                              return (
                                <div
                                  key={cr}
                                  className={`flex-1 min-w-[2px] transition-colors ${
                                    isInRange
                                      ? 'opacity-80'
                                      : 'opacity-20'
                                  }`}
                                  style={{ // noqa
                                    height: `${height}%`,
                                    backgroundColor: 'var(--color-interactive-primary)'
                                  }}
                                  title={`CR ${cr}: ${count} creatures`}
                                />
                              );
                            });
                        })()}
                      </div>

                      {/* Range Slider */}
                      <div className="px-2 space-y-0.5">
                        <Slider
                          min={crDistribution.minCR}
                          max={crDistribution.maxCR}
                          step={0.5}
                          value={[
                            filters.crMin ?? crDistribution.minCR,
                            filters.crMax ?? crDistribution.maxCR
                          ]}
                          onValueChange={([min, max]) => {
                            setFilters(prev => ({
                              ...prev,
                              crMin: min === crDistribution.minCR ? null : min,
                              crMax: max === crDistribution.maxCR ? null : max
                            }));
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between items-center gap-2">
                          <Input
                            type="number"
                            value={filters.crMin ?? crDistribution.minCR}
                            onChange={(e) => {
                              const value = e.target.value ? Number(e.target.value) : crDistribution.minCR;
                              setFilters(prev => ({
                                ...prev,
                                crMin: value === crDistribution.minCR ? null : value
                              }));
                            }}
                            min={crDistribution.minCR}
                            max={filters.crMax ?? crDistribution.maxCR}
                            step={0.5}
                            className="w-20 h-10 md:h-7 text-xs min-h-[40px] md:min-h-auto"
                          />
                          <span className="text-xs text-muted-foreground">to</span>
                          <Input
                            type="number"
                            value={filters.crMax ?? crDistribution.maxCR}
                            onChange={(e) => {
                              const value = e.target.value ? Number(e.target.value) : crDistribution.maxCR;
                              setFilters(prev => ({
                                ...prev,
                                crMax: value === crDistribution.maxCR ? null : value
                              }));
                            }}
                            min={filters.crMin ?? crDistribution.minCR}
                            max={crDistribution.maxCR}
                            step={0.5}
                            className="w-20 h-10 md:h-7 text-xs min-h-[40px] md:min-h-auto"
                          />
                        </div>
                      </div>

                      {/* Other filters in the category */}
                      {categoryFilters.filter(f => f.key !== 'cr').map(filter => (
                        <div key={filter.key}>
                          {filter.type === 'range' && (() => {
                            const rangeValues = getUniqueRangeValues(filter);
                            if (rangeValues.length === 0) return null;

                            const minValue = Math.min(...rangeValues);
                            const maxValue = Math.max(...rangeValues);
                            const stepValue = rangeValues.length > 1 ? Math.min(...rangeValues.slice(1).map((v, i) => v - rangeValues[i])) : 1;

                            return (
                              <RangeSlider
                                label={filter.label}
                                min={minValue}
                                max={maxValue}
                                step={stepValue}
                                value={[(filters as any)[`${filter.key}Min`], (filters as any)[`${filter.key}Max`]]}
                                onChange={(range) => handleRangeChange(filter.key, range)}
                              />
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          }

          if (categoryFilters.length === 0) return null;

          return (
            <div key={category} className="border-t pt-3 mt-1">
              <button
                className="flex items-center justify-between w-full text-left mb-2 py-1.5 px-1 -mx-1 rounded-md hover:bg-surface-secondary transition-colors group"
                onClick={() => toggleSection(category)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {(() => {
                    const IconComponent = categoryFilters[0]?.icon;
                    return IconComponent ? <IconComponent className="h-4 w-4 flex-shrink-0" /> : null;
                  })()}
                  <span className="text-sm font-medium truncate">{category}</span>
                  {(() => {
                    const activeCount = getCategoryActiveCount(category);
                    return activeCount > 0 ? (
                      <span className="flex-shrink-0 h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-interactive-primary text-text-inverse text-xs rounded-full font-semibold">
                        {activeCount}
                      </span>
                    ) : null;
                  })()}
                </div>
                <div className="flex-shrink-0 ml-2">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-text-tertiary group-hover:text-text-secondary transition-colors" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-text-tertiary group-hover:text-text-secondary transition-colors" />
                  )}
                </div>
              </button>
              {isExpanded && (
                <div className="space-y-2 md:space-y-1">
                  {categoryFilters.map(filter => {
                    switch (filter.type) {
                      case 'range':
                        const rangeValues = getUniqueRangeValues(filter);
                        if (rangeValues.length === 0) return null;

                        const minValue = Math.min(...rangeValues);
                        const maxValue = Math.max(...rangeValues);
                        const stepValue = rangeValues.length > 1 ? Math.min(...rangeValues.slice(1).map((v, i) => v - rangeValues[i])) : 1;

                        return (
                          <RangeSlider
                            key={filter.key}
                            label={filter.label}
                            min={minValue}
                            max={maxValue}
                            step={stepValue}
                            value={[(filters as any)[`${filter.key}Min`], (filters as any)[`${filter.key}Max`]]}
                            onChange={(range) => handleRangeChange(filter.key, range)}
                          />
                        );
                      case 'multiSelect':
                        const uniqueValues = precomputedFilterOptions.get(filter.key) || [];
                        const searchValue = searchStates[filter.key] || '';
                        const showAll = showAllValues[filter.key] ?? false;

                        // Compute counts from currently filtered creatures
                        const filteredCounts = new Map<string, number>();
                        if (filteredCreatures) {
                          filteredCreatures.forEach(creature => {
                            const value = filter.getValue?.(creature);
                            if (value != null) {
                              if (Array.isArray(value)) {
                                value.forEach(v => {
                                  if (v) {
                                    const key = String(v).toLowerCase();
                                    filteredCounts.set(key, (filteredCounts.get(key) || 0) + 1);
                                  }
                                });
                              } else {
                                const key = String(value).toLowerCase();
                                filteredCounts.set(key, (filteredCounts.get(key) || 0) + 1);
                              }
                            }
                          });
                        }

                        // Filter by search and optionally by data availability in filtered results
                        const filteredValues = uniqueValues.filter(({ value }) => {
                          const matchesSearch = value.toLowerCase().includes(searchValue.toLowerCase());
                          const hasDataInFiltered = filteredCounts.has(value);
                          return matchesSearch && (showAll || hasDataInFiltered);
                        }).map(({ value, count }) => ({
                          value,
                          count: filteredCounts.get(value) || 0,
                          totalCount: count
                        }));

                        const currentValues = (filters[filter.key as keyof Filters] as string[]) || [];
                        const totalCreatures = filteredCreatures?.length || 1;
                        const currentFilterMode = filters.filterMode?.[filter.key as keyof typeof filters.filterMode] || 'any';

                        return (
                          <div key={filter.key} className="space-y-1.5">
                            {filter.label && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-text-secondary">{filter.label}</span>
                                  {currentValues.length > 0 && (
                                    <span className="text-xs text-text-tertiary">
                                      {currentValues.length} selected
                                    </span>
                                  )}
                                </div>
                                {/* Advanced controls - only show when relevant */}
                                {(currentValues.length > 0 || uniqueValues.length > filteredValues.length) && (
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {uniqueValues.length > filteredValues.length && (
                                      <Button
                                        variant={getToggleVariant(showAll)}
                                        size="sm"
                                        className="h-6 px-2 text-[10px]"
                                        onClick={() => toggleShowAllValues(filter.key)}
                                        title={showAll ? "Showing all options" : "Showing only options with data"}
                                      >
                                        {showAll ? 'All' : 'Available'}
                                      </Button>
                                    )}
                                    {currentValues.length > 1 && (
                                      <Button
                                        variant={getToggleVariant(currentFilterMode === 'all')}
                                        size="sm"
                                        className="h-6 px-2 text-[10px]"
                                        onClick={() => toggleFilterMode(filter.key)}
                                        title={currentFilterMode === 'all' ? "Match ALL selected" : "Match ANY selected"}
                                      >
                                        {currentFilterMode === 'all' ? 'AND' : 'OR'}
                                      </Button>
                                    )}
                                    {currentValues.length > 0 && filter.excludeMode && (
                                      <Button
                                        variant={(filters.excludeMode as any)?.[filter.key] ? "destructive" : "ghost"}
                                        size="sm"
                                        className="h-6 px-2 text-[10px]"
                                        onClick={() => setFilters(prev => ({
                                          ...prev,
                                          excludeMode: {
                                            ...prev.excludeMode,
                                            [filter.key]: !prev.excludeMode?.[filter.key as keyof typeof prev.excludeMode]
                                          }
                                        }))}
                                        title={(filters.excludeMode as any)?.[filter.key] ? "Excluding selected" : "Including selected"}
                                      >
                                        {(filters.excludeMode as any)?.[filter.key] ? 'Exclude' : 'Include'}
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            {filter.searchable && uniqueValues.length > 10 && (
                              <Input
                                type="text"
                                placeholder={`Search...`}
                                value={searchValue}
                                onChange={(e) => setSearchState(filter.key, e.target.value)}
                                className="h-8 text-xs"
                              />
                            )}
                            {filteredValues.length > 100 ? (
                              // Use virtualization for large lists
                              <List
                                style={VIRTUAL_LIST_STYLE}
                                rowCount={filteredValues.length}
                                rowHeight={VIRTUAL_ROW_HEIGHT}
                                rowComponent={({ index, style }) => {
                                  const { value, count } = filteredValues[index];
                                  const percentage = totalCreatures > 0 ? (count / totalCreatures) * 100 : 0;
                                  const isChecked = currentValues.includes(value);

                                  return (
                                    <div style={style}>
                                      <label className="flex items-center gap-2 px-1 py-1 hover:bg-surface-secondary rounded cursor-pointer group">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => handleMultiSelectToggle(filter.key, value)}
                                          className="rounded border-border flex-shrink-0"
                                        />
                                        <div
                                          className="flex items-center gap-2 flex-1 min-w-0"
                                          style={{
                                            backgroundImage: `linear-gradient(to right, color-mix(in srgb, var(--color-interactive-primary) 20%, transparent) 0%, color-mix(in srgb, var(--color-interactive-primary) 20%, transparent) ${percentage}%, transparent ${percentage}%)`
                                          }}
                                        >
                                          <span className="text-xs flex-1 min-w-0 truncate" title={value}>{value}</span>
                                          <span className="text-xs text-text-tertiary flex-shrink-0 opacity-60 group-hover:opacity-100">
                                            {count}
                                          </span>
                                        </div>
                                      </label>
                                    </div>
                                  );
                                }}
                                rowProps={{}}
                              />
                            ) : (
                              // Use regular rendering for small lists
                              <div className="space-y-0.5 max-h-64 overflow-y-auto">
                                {filteredValues.map(({ value, count }, index) => {
                                  const isChecked = currentValues.includes(value);
                                  const percentage = totalCreatures > 0 ? (count / totalCreatures) * 100 : 0;
                                  return (
                                    <label
                                      key={value}
                                      className="flex items-center gap-2 px-1 py-1 hover:bg-surface-secondary rounded cursor-pointer group"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleMultiSelectToggle(filter.key, value)}
                                        className="rounded border-border flex-shrink-0"
                                      />
                                      <div
                                        className="flex items-center gap-2 flex-1 min-w-0"
                                        style={{
                                          backgroundImage: `linear-gradient(to right, color-mix(in srgb, var(--color-interactive-primary) 20%, transparent) 0%, color-mix(in srgb, var(--color-interactive-primary) 20%, transparent) ${percentage}%, transparent ${percentage}%)`
                                        }}
                                      >
                                        <span className="text-xs flex-1 min-w-0 truncate" title={value}>{value}</span>
                                        <span className="text-xs text-text-tertiary flex-shrink-0 opacity-60 group-hover:opacity-100">
                                          {count}
                                        </span>
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      case 'boolean':
                        const booleanValue = filters[filter.key as keyof Filters] as boolean | null;
                        return (
                          <div key={filter.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const IconComponent = filter.icon;
                                return IconComponent ? <IconComponent className="h-3 w-3" /> : null;
                              })()}
                              <span className="text-sm">{filter.label}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant={booleanValue === true ? "secondary" : "ghost"}
                                size="sm"
                                className="h-8 md:h-6 px-2 text-xs min-h-[32px] md:min-h-auto"
                                onClick={() => handleBooleanChange(filter.key, booleanValue === true ? null : true)}
                                title={booleanValue === true ? "Currently filtering to Yes" : "Click to filter to Yes"}
                              >
                                {booleanValue === true ? '✓ Yes' : 'Yes'}
                              </Button>
                              <Button
                                variant={booleanValue === false ? "secondary" : "ghost"}
                                size="sm"
                                className="h-8 md:h-6 px-2 text-xs min-h-[32px] md:min-h-auto"
                                onClick={() => handleBooleanChange(filter.key, booleanValue === false ? null : false)}
                                title={booleanValue === false ? "Currently filtering to No" : "Click to filter to No"}
                              >
                                {booleanValue === false ? '✓ No' : 'No'}
                              </Button>
                            </div>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}