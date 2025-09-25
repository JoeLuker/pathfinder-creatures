import { useState, useMemo } from 'react';
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
}

export function Sidebar({ // noqa
  filters,
  setFilters,
  creatures,
  filteredCreatures,
  precomputedFilterOptions,
  crDistribution,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return getAllCategories().reduce((acc, category) => {
      // On mobile, expand commonly used sections by default
      if (isMobile) {
        acc[category] = category === FILTER_CATEGORIES.BASIC ||
                       category === FILTER_CATEGORIES.CHALLENGE ||
                       category === FILTER_CATEGORIES.COMBAT;
      } else {
        acc[category] = false;
      }
      return acc;
    }, {} as Record<string, boolean>);
  });

  // Search states for multi-select filters
  const [searchStates, setSearchStates] = useState<Record<string, string>>({});

  // Filter display states - show all values vs only values with data
  const [showAllValues, setShowAllValues] = useState<Record<string, boolean>>({});

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

        {/* Dynamic Filter Sections by Category */}
        {getAllCategories().map(category => {
          const categoryFilters = getFiltersByCategory(category);
          const isExpanded = expandedSections[category];

          // Special handling for CR filter with histogram
          if (category === FILTER_CATEGORIES.CHALLENGE && crDistribution) {
            const crFilter = categoryFilters.find(f => f.key === 'cr');
            if (crFilter) {
              return (
                <div key={category} className="border-t pt-3 mt-1">
                  <button
                    className="flex items-center justify-between w-full text-left mb-2"
                    onClick={() => toggleSection(category)}
                  >
                    <div className="flex items-center gap-2">
                      {crFilter.icon && <crFilter.icon className="h-4 w-4" />}
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
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
                className="flex items-center justify-between w-full text-left mb-2 py-2 px-1 -mx-1 rounded-md hover:bg-surface-secondary min-h-[44px] md:min-h-auto md:py-0"
                onClick={() => toggleSection(category)}
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    const IconComponent = categoryFilters[0]?.icon;
                    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                  })()}
                  <span className="text-sm font-medium">{category}</span>
                  {/* Show active filter count for this category */}
                  {(() => {
                    const activeCount = categoryFilters.reduce((count, filter) => {
                      switch (filter.type) {
                        case 'range':
                          const minKey = `${filter.key}Min` as keyof Filters;
                          const maxKey = `${filter.key}Max` as keyof Filters;
                          return count + (filters[minKey] !== null || filters[maxKey] !== null ? 1 : 0);
                        case 'multiSelect':
                          const multiValue = filters[filter.key as keyof Filters] as string[];
                          return count + (multiValue?.length > 0 ? 1 : 0);
                        case 'boolean':
                          return count + (filters[filter.key as keyof Filters] !== null ? 1 : 0);
                        default:
                          return count;
                      }
                    }, 0);
                    return activeCount > 0 && (
                      <Badge variant="secondary" className="text-xs h-5">
                        {activeCount}
                      </Badge>
                    );
                  })()
                  }
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
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

                        // Filter by search and optionally by data availability
                        const filteredValues = uniqueValues.filter(({ value, count }) => {
                          const matchesSearch = value.toLowerCase().includes(searchValue.toLowerCase());
                          const hasData = count > 0;
                          return matchesSearch && (showAll || hasData);
                        });

                        const currentValues = (filters[filter.key as keyof Filters] as string[]) || [];
                        const maxCount = Math.max(...uniqueValues.map(v => v.count));
                        const currentFilterMode = filters.filterMode?.[filter.key as keyof typeof filters.filterMode] || 'any';

                        return (
                          <div key={filter.key} className="space-y-1 md:space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">{filter.label}</span>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 md:h-5 px-2 text-xs min-h-[32px] md:min-h-auto"
                                  onClick={() => toggleShowAllValues(filter.key)}
                                >
                                  {showAll ? 'With Data' : 'Show All'}
                                </Button>
                                {currentValues.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 md:h-5 px-2 text-xs min-h-[32px] md:min-h-auto"
                                    onClick={() => toggleFilterMode(filter.key)}
                                  >
                                    {currentFilterMode === 'all' ? 'ALL' : 'ANY'}
                                  </Button>
                                )}
                                {currentValues.length > 0 && filter.excludeMode && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 md:h-5 px-2 text-xs min-h-[32px] md:min-h-auto"
                                    onClick={() => setFilters(prev => ({
                                      ...prev,
                                      excludeMode: {
                                        ...prev.excludeMode,
                                        [filter.key]: !prev.excludeMode?.[filter.key as keyof typeof prev.excludeMode]
                                      }
                                    }))}
                                  >
                                    {(filters.excludeMode as any)?.[filter.key] ? 'Include' : 'Exclude'}
                                  </Button>
                                )}
                              </div>
                            </div>
                            {filter.searchable && (
                              <Input
                                type="text"
                                placeholder={`Search ${filter.label.toLowerCase()}...`}
                                value={searchValue}
                                onChange={(e) => setSearchState(filter.key, e.target.value)}
                                className="h-10 md:h-7 text-xs min-h-[40px] md:min-h-auto"
                              />
                            )}
                            {filteredValues.length > 100 ? (
                              // Use virtualization for large lists
                              <List
                                style={{ height: 192, overflow: 'auto' }} // 192px = 48 * 4 (tailwind's max-h-48)
                                rowCount={filteredValues.length}
                                rowHeight={36} // Height of each checkbox item
                                rowComponent={({ index, style }) => {
                                  const { value, count } = filteredValues[index];
                                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                  const isChecked = currentValues.includes(value);

                                  return (
                                    <div style={style}>
                                      <label
                                        className="relative flex items-center justify-between px-2 py-2 md:py-1 hover:bg-surface-secondary rounded cursor-pointer min-h-[44px] md:min-h-auto"
                                      >
                                        <div
                                          className="absolute inset-0 bg-interactive-primary opacity-20 rounded"
                                          style={{ width: `${percentage}%` }}
                                        />
                                        <div className="relative flex items-center gap-2 flex-1">
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleMultiSelectToggle(filter.key, value)}
                                            className="rounded border-border"
                                          />
                                          <span className="text-sm capitalize">{value}</span>
                                        </div>
                                        <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
                                      </label>
                                    </div>
                                  );
                                }}
                                rowProps={{}}
                              />
                            ) : (
                              // Use regular rendering for small lists
                              <div className="space-y-1 max-h-48 overflow-y-auto">
                                {filteredValues.map(({ value, count }) => {
                                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                  const isChecked = currentValues.includes(value);

                                  return (
                                    <label
                                      key={value}
                                      className="relative flex items-center justify-between px-2 py-2 md:py-1 hover:bg-surface-secondary rounded cursor-pointer min-h-[44px] md:min-h-auto"
                                    >
                                      <div
                                        className="absolute inset-0 bg-interactive-primary opacity-20 rounded"
                                        style={{ width: `${percentage}%` }}
                                      />
                                      <div className="relative flex items-center gap-2 flex-1">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => handleMultiSelectToggle(filter.key, value)}
                                          className="rounded border-border"
                                        />
                                        <span className="text-sm capitalize">{value}</span>
                                      </div>
                                      <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
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
                                variant={booleanValue === true ? "default" : "outline"}
                                size="sm"
                                className="h-8 md:h-6 px-2 text-xs min-h-[32px] md:min-h-auto"
                                onClick={() => handleBooleanChange(filter.key, booleanValue === true ? null : true)}
                              >
                                Yes
                              </Button>
                              <Button
                                variant={booleanValue === false ? "default" : "outline"}
                                size="sm"
                                className="h-8 md:h-6 px-2 text-xs min-h-[32px] md:min-h-auto"
                                onClick={() => handleBooleanChange(filter.key, booleanValue === false ? null : false)}
                              >
                                No
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