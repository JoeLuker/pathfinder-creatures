import { useState } from 'react';
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
import { getActiveFilterCount } from '@/utils/filterUtils';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

interface CountItem {
  value: string;
  count: number;
}

interface SidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  creatures: any[];
  crDistribution?: {
    distribution: { cr: number; count: number }[];
    minCR: number;
    maxCR: number;
  };
}

export function Sidebar({
  filters,
  setFilters,
  creatures,
  crDistribution,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    getAllCategories().reduce((acc, category) => {
      acc[category] = category === FILTER_CATEGORIES.BASIC;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Search states for multi-select filters
  const [searchStates, setSearchStates] = useState<Record<string, string>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const setSearchState = (filterKey: string, value: string) => {
    setSearchStates(prev => ({ ...prev, [filterKey]: value }));
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


  // Extract unique values for multi-select filters from creatures
  const getUniqueValues = (filterConfig: FilterConfig): CountItem[] => {
    const valuesMap = new Map<string, number>();

    creatures.forEach(creature => {
      const value = filterConfig.getValue?.(creature);
      if (value != null) {
        if (Array.isArray(value)) {
          value.forEach(v => {
            if (v) {
              const key = String(v).toLowerCase();
              valuesMap.set(key, (valuesMap.get(key) || 0) + 1);
            }
          });
        } else {
          const key = String(value).toLowerCase();
          valuesMap.set(key, (valuesMap.get(key) || 0) + 1);
        }
      }
    });

    return Array.from(valuesMap.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
  };

  const activeFiltersCount = getActiveFilterCount(filters);

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-3">
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
                }, { search: '' } as any);
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
                <div key={category} className="border-t pt-3 mt-3">
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
                    <div className="space-y-3">
                      {/* CR Distribution Histogram */}
                      <div className="h-16 flex items-end gap-0.5 px-2">
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
                                    isInRange ? 'bg-primary opacity-70' : 'bg-gray-300'
                                  }`}
                                  style={{ height: `${height}%` }}
                                  title={`CR ${cr}: ${count} creatures`}
                                />
                              );
                            });
                        })()}
                      </div>

                      {/* Range Slider */}
                      <div className="px-2 space-y-2">
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
                            className="w-20 h-7 text-xs"
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
                            className="w-20 h-7 text-xs"
                          />
                        </div>
                      </div>

                      {/* Other filters in the category */}
                      {categoryFilters.filter(f => f.key !== 'cr').map(filter => (
                        <div key={filter.key}>
                          {filter.type === 'range' && (
                            <RangeSlider
                              label={filter.label}
                              min={filter.min!}
                              max={filter.max!}
                              step={filter.step}
                              value={[(filters as any)[`${filter.key}Min`], (filters as any)[`${filter.key}Max`]]}
                              onChange={(range) => handleRangeChange(filter.key, range)}
                            />
                          )}
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
            <div key={category} className="border-t pt-3 mt-3">
              <button
                className="flex items-center justify-between w-full text-left mb-2"
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
                <div className="space-y-4">
                  {categoryFilters.map(filter => {
                    switch (filter.type) {
                      case 'range':
                        return (
                          <RangeSlider
                            key={filter.key}
                            label={filter.label}
                            min={filter.min!}
                            max={filter.max!}
                            step={filter.step}
                            value={[(filters as any)[`${filter.key}Min`], (filters as any)[`${filter.key}Max`]]}
                            onChange={(range) => handleRangeChange(filter.key, range)}
                          />
                        );
                      case 'multiSelect':
                        const uniqueValues = getUniqueValues(filter);
                        const searchValue = searchStates[filter.key] || '';
                        const filteredValues = uniqueValues.filter(({ value }) =>
                          value.toLowerCase().includes(searchValue.toLowerCase())
                        );
                        const currentValues = (filters[filter.key as keyof Filters] as string[]) || [];
                        const maxCount = Math.max(...uniqueValues.map(v => v.count));

                        return (
                          <div key={filter.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-muted-foreground">{filter.label}</span>
                              {currentValues.length > 0 && filter.excludeMode && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 px-2 text-xs"
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
                            {filter.searchable && (
                              <Input
                                type="text"
                                placeholder={`Search ${filter.label.toLowerCase()}...`}
                                value={searchValue}
                                onChange={(e) => setSearchState(filter.key, e.target.value)}
                                className="h-7 text-xs"
                              />
                            )}
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                              {filteredValues.slice(0, 50).map(({ value, count }) => {
                                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                const isChecked = currentValues.includes(value);

                                return (
                                  <label
                                    key={value}
                                    className="relative flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                                  >
                                    <div
                                      className="absolute inset-0 bg-blue-50 opacity-20 rounded"
                                      style={{ width: `${percentage}%` }}
                                    />
                                    <div className="relative flex items-center gap-2 flex-1">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleMultiSelectToggle(filter.key, value)}
                                        className="rounded border-gray-300"
                                      />
                                      <span className="text-sm capitalize">{value}</span>
                                    </div>
                                    <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
                                  </label>
                                );
                              })}
                            </div>
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
                                className="h-6 px-2 text-xs"
                                onClick={() => handleBooleanChange(filter.key, booleanValue === true ? null : true)}
                              >
                                Yes
                              </Button>
                              <Button
                                variant={booleanValue === false ? "default" : "outline"}
                                size="sm"
                                className="h-6 px-2 text-xs"
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