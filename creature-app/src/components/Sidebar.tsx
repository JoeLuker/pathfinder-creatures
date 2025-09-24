import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import type { Filters, SortField, SortDirection } from '@/hooks/useCreatures';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Shield, Footprints, Sparkles, ShieldCheck } from 'lucide-react';

interface CountItem {
  value: string;
  count: number;
}

interface SidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  uniqueTypes: string[];
  uniqueSizes: string[];
  uniqueAlignments: string[];
  uniqueSubtypes: string[];
  uniqueMovementTypes: string[];
  uniqueSpecialAbilities: string[];
  uniqueDefensiveAbilities: string[];
  uniqueTypesWithCounts?: CountItem[];
  uniqueSizesWithCounts?: CountItem[];
  uniqueAlignmentsWithCounts?: CountItem[];
  uniqueSubtypesWithCounts?: CountItem[];
  uniqueMovementTypesWithCounts?: CountItem[];
  uniqueSpecialAbilitiesWithCounts?: CountItem[];
  uniqueDefensiveAbilitiesWithCounts?: CountItem[];
  crDistribution?: {
    distribution: { cr: number; count: number }[];
    minCR: number;
    maxCR: number;
  };
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
}

export function Sidebar({
  filters,
  setFilters,
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
  crDistribution,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    size: false,
    alignment: false,
    cr: false,
    subtypes: false,
    movement: false,
    abilities: false,
    defensive: false,
    sort: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleAlignmentToggle = (alignment: string) => {
    setFilters(prev => ({
      ...prev,
      alignments: prev.alignments.includes(alignment)
        ? prev.alignments.filter(a => a !== alignment)
        : [...prev.alignments, alignment]
    }));
  };

  const handleSubtypeToggle = (subtype: string) => {
    setFilters(prev => ({
      ...prev,
      subtypes: prev.subtypes.includes(subtype)
        ? prev.subtypes.filter(s => s !== subtype)
        : [...prev.subtypes, subtype]
    }));
  };

  const handleMovementToggle = (movement: string) => {
    setFilters(prev => ({
      ...prev,
      movementTypes: prev.movementTypes.includes(movement)
        ? prev.movementTypes.filter(m => m !== movement)
        : [...prev.movementTypes, movement]
    }));
  };

  const handleSpecialAbilityToggle = (ability: string) => {
    setFilters(prev => ({
      ...prev,
      specialAbilities: prev.specialAbilities.includes(ability)
        ? prev.specialAbilities.filter(a => a !== ability)
        : [...prev.specialAbilities, ability]
    }));
  };

  const handleDefensiveAbilityToggle = (ability: string) => {
    setFilters(prev => ({
      ...prev,
      defensiveAbilities: prev.defensiveAbilities.includes(ability)
        ? prev.defensiveAbilities.filter(a => a !== ability)
        : [...prev.defensiveAbilities, ability]
    }));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    filters.types.length +
    filters.sizes.length +
    filters.alignments.length +
    (filters.crMin !== null ? 1 : 0) +
    (filters.crMax !== null ? 1 : 0) +
    filters.subtypes.length +
    filters.movementTypes.length +
    filters.specialAbilities.length +
    filters.defensiveAbilities.length;

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
              onClick={() => setFilters({
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
              })}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Type Filter */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <button
              className="flex items-center gap-2 flex-1 text-left"
              onClick={() => toggleSection('type')}
            >
              <span className="text-sm font-medium">Types</span>
              {filters.types.length > 0 && (
                <Badge
                  variant={filters.excludeMode?.types ? "destructive" : "secondary"}
                  className="text-xs h-5"
                >
                  {filters.types.length} {filters.excludeMode?.types ? 'excluded' : 'selected'}
                </Badge>
              )}
            </button>
            <div className="flex items-center gap-1">
              {filters.types.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    excludeMode: {
                      ...prev.excludeMode,
                      types: !prev.excludeMode?.types
                    }
                  }))}
                >
                  {filters.excludeMode?.types ? 'Include' : 'Exclude'}
                </Button>
              )}
              {expandedSections.type ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
          {expandedSections.type && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {(uniqueTypesWithCounts || uniqueTypes.map(t => ({ value: t, count: 0 }))).map(({ value: type, count }) => (
                <label
                  key={type}
                  className={`flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer ${
                    !filters.types.includes(type) && count === 0 ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="rounded border-gray-300"
                      disabled={!filters.types.includes(type) && count === 0}
                    />
                    <span className={`text-sm capitalize ${count === 0 && !filters.types.includes(type) ? 'text-gray-400' : ''}`}>{type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Size Filter */}
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between mb-2">
            <button
              className="flex items-center gap-2 flex-1 text-left"
              onClick={() => toggleSection('size')}
            >
              <span className="text-sm font-medium">Sizes</span>
              {filters.sizes.length > 0 && (
                <Badge
                  variant={filters.excludeMode?.sizes ? "destructive" : "secondary"}
                  className="text-xs h-5"
                >
                  {filters.sizes.length} {filters.excludeMode?.sizes ? 'excluded' : 'selected'}
                </Badge>
              )}
            </button>
            <div className="flex items-center gap-1">
              {filters.sizes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    excludeMode: {
                      ...prev.excludeMode,
                      sizes: !prev.excludeMode?.sizes
                    }
                  }))}
                >
                  {filters.excludeMode?.sizes ? 'Include' : 'Exclude'}
                </Button>
              )}
              {expandedSections.size ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
          {expandedSections.size && (
            <div className="space-y-1">
              {(uniqueSizesWithCounts || uniqueSizes.map(s => ({ value: s, count: 0 }))).map(({ value: size, count }) => (
                <label
                  key={size}
                  className={`flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer ${
                    !filters.sizes.includes(size) && count === 0 ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="rounded border-gray-300"
                      disabled={!filters.sizes.includes(size) && count === 0}
                    />
                    <span className={`text-sm ${count === 0 && !filters.sizes.includes(size) ? 'text-gray-400' : ''}`}>{size}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* CR Filter */}
        <div className="border-t pt-3 mt-3">
          <button
            className="flex items-center justify-between w-full text-left mb-2"
            onClick={() => toggleSection('cr')}
          >
            <span className="text-sm font-medium">Challenge Rating</span>
            {expandedSections.cr ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.cr && crDistribution && (
            <div className="space-y-3">
              {/* CR Distribution Histogram */}
              <div className="h-16 flex items-end gap-0.5 px-2">
                {(() => {
                  const maxCount = Math.max(...crDistribution.distribution.map(d => d.count));
                  const bucketWidth = 1; // Group CRs into buckets
                  const buckets = new Map<number, number>();

                  // Create buckets for histogram
                  for (let cr = crDistribution.minCR; cr <= crDistribution.maxCR; cr += bucketWidth) {
                    buckets.set(cr, 0);
                  }

                  // Fill buckets with counts
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
                {/* Input Boxes Below */}
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
            </div>
          )}
        </div>

        {/* Movement Types Filter */}
        <div className="border-t pt-3 mt-3">
          <button
            className="flex items-center justify-between w-full text-left mb-2"
            onClick={() => toggleSection('movement')}
          >
            <div className="flex items-center gap-2">
              <Footprints className="h-4 w-4" />
              <span className="text-sm font-medium">Movement</span>
            </div>
            {expandedSections.movement ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.movement && (
            <div className="space-y-1">
              {(uniqueMovementTypesWithCounts || uniqueMovementTypes.map(m => ({ value: m, count: 0 }))).map(({ value: movement, count }) => (
                <label
                  key={movement}
                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.movementTypes.includes(movement)}
                      onChange={() => handleMovementToggle(movement)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm capitalize">{movement}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Subtypes Filter */}
        <div className="border-t pt-3 mt-3">
          <button
            className="flex items-center justify-between w-full text-left mb-2"
            onClick={() => toggleSection('subtypes')}
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Subtypes</span>
            </div>
            {expandedSections.subtypes ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.subtypes && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {(uniqueSubtypesWithCounts || uniqueSubtypes.map(s => ({ value: s, count: 0 }))).slice(0, 30).map(({ value: subtype, count }) => (
                <label
                  key={subtype}
                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.subtypes.includes(subtype)}
                      onChange={() => handleSubtypeToggle(subtype)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{subtype}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Special Abilities Filter */}
        <div className="border-t pt-3 mt-3">
          <button
            className="flex items-center justify-between w-full text-left mb-2"
            onClick={() => toggleSection('abilities')}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Special Abilities</span>
            </div>
            {expandedSections.abilities ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.abilities && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <Input
                type="text"
                placeholder="Search abilities..."
                className="mb-2 text-xs"
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                  const filtered = uniqueSpecialAbilities.filter(a =>
                    a.toLowerCase().includes(searchTerm)
                  );
                  // Just for visual filtering - actual toggle still uses full list
                  const container = e.target.parentElement;
                  if (container) {
                    const labels = container.querySelectorAll('label');
                    labels.forEach(label => {
                      const text = label.textContent?.toLowerCase() || '';
                      if (searchTerm && !text.includes(searchTerm)) {
                        label.style.display = 'none';
                      } else {
                        label.style.display = '';
                      }
                    });
                  }
                }}
              />
              {(uniqueSpecialAbilitiesWithCounts || uniqueSpecialAbilities.map(s => ({ value: s, count: 0 }))).map(({ value: ability, count }) => (
                <label
                  key={ability}
                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.specialAbilities.includes(ability)}
                      onChange={() => handleSpecialAbilityToggle(ability)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{ability}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Defensive Abilities Filter */}
        <div className="border-t pt-3 mt-3">
          <button
            className="flex items-center justify-between w-full text-left mb-2"
            onClick={() => toggleSection('defensive')}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Defensive Abilities</span>
            </div>
            {expandedSections.defensive ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.defensive && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {(uniqueDefensiveAbilitiesWithCounts || uniqueDefensiveAbilities.map(d => ({ value: d, count: 0 }))).map(({ value: ability, count }) => (
                <label
                  key={ability}
                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.defensiveAbilities.includes(ability)}
                      onChange={() => handleDefensiveAbilityToggle(ability)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{ability}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Alignment Filter */}
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between mb-2">
            <button
              className="flex items-center gap-2 flex-1 text-left"
              onClick={() => toggleSection('alignment')}
            >
              <span className="text-sm font-medium">Alignments</span>
              {filters.alignments.length > 0 && (
                <Badge
                  variant={filters.excludeMode?.alignments ? "destructive" : "secondary"}
                  className="text-xs h-5"
                >
                  {filters.alignments.length} {filters.excludeMode?.alignments ? 'excluded' : 'selected'}
                </Badge>
              )}
            </button>
            <div className="flex items-center gap-1">
              {filters.alignments.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    excludeMode: {
                      ...prev.excludeMode,
                      alignments: !prev.excludeMode?.alignments
                    }
                  }))}
                >
                  {filters.excludeMode?.alignments ? 'Include' : 'Exclude'}
                </Button>
              )}
              {expandedSections.alignment ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
          {expandedSections.alignment && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {(uniqueAlignmentsWithCounts || uniqueAlignments.map(a => ({ value: a, count: 0 }))).slice(0, 20).map(({ value: alignment, count }) => (
                <label
                  key={alignment}
                  className={`flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer ${
                    count === 0 ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.alignments.includes(alignment)}
                      onChange={() => handleAlignmentToggle(alignment)}
                      className="rounded border-gray-300"
                      disabled={!filters.alignments.includes(alignment) && count === 0}
                    />
                    <span className={`text-sm ${count === 0 && !filters.alignments.includes(alignment) ? 'text-gray-400' : ''}`}>{alignment}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <button
          className="flex items-center justify-between w-full text-left mb-2"
          onClick={() => toggleSection('sort')}
        >
          <span className="font-medium text-sm">Sort By</span>
          {expandedSections.sort ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.sort && (
          <div className="space-y-1">
            {[
              { field: 'name' as SortField, label: 'Name' },
              { field: 'cr' as SortField, label: 'Challenge Rating' },
              { field: 'type' as SortField, label: 'Type' },
              { field: 'size' as SortField, label: 'Size' },
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-50 ${
                  sortField === field ? 'bg-secondary text-secondary-foreground' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {sortField === field && (
                    <span className="text-xs">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}