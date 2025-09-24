import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
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

  // Search states for different filter sections
  const [typeSearch, setTypeSearch] = useState('');
  const [subtypeSearch, setSubtypeSearch] = useState('');
  const [abilitySearch, setAbilitySearch] = useState('');
  const [defensiveSearch, setDefensiveSearch] = useState('');

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

  // Convert types data to combobox options
  const typeOptions: ComboboxOption[] = (uniqueTypesWithCounts || uniqueTypes.map(t => ({ value: t, count: 0 })))
    .filter(({ value }) => value.toLowerCase().includes(typeSearch.toLowerCase()))
    .map(({ value, count }) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      count,
    }));

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

        {/* Type Filter - Enhanced with Combobox */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Type (Quick Select)</span>
            {filters.types.length > 0 && (
              <Badge
                variant={filters.excludeMode?.types ? "destructive" : "secondary"}
                className="text-xs h-5"
              >
                {filters.types.length} selected
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <Combobox
              options={typeOptions}
              placeholder="Select a creature type..."
              searchPlaceholder="Search creature types..."
              emptyText="No creature types found."
              onValueChange={(value) => {
                if (value && !filters.types.includes(value)) {
                  handleTypeToggle(value);
                }
              }}
            />
            {filters.types.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters.types.map(type => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleTypeToggle(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Type Filter - Original Implementation */}
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between mb-2">
            <button
              className="flex items-center gap-2 flex-1 text-left"
              onClick={() => toggleSection('type')}
            >
              <span className="text-sm font-medium">Types (Advanced)</span>
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
            <div className="space-y-2">
              {/* Search and bulk actions */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search types..."
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  className="flex-1 h-7 text-xs"
                />
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      const visibleTypes = (uniqueTypesWithCounts || uniqueTypes.map(t => ({ value: t, count: 0 })))
                        .filter(({ value, count }) =>
                          value.toLowerCase().includes(typeSearch.toLowerCase()) && count > 0
                        )
                        .map(({ value }) => value);
                      setFilters(prev => ({ ...prev, types: visibleTypes }));
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setFilters(prev => ({ ...prev, types: [] }))}
                  >
                    None
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      const visibleTypes = (uniqueTypesWithCounts || uniqueTypes.map(t => ({ value: t, count: 0 })))
                        .filter(({ value, count }) =>
                          value.toLowerCase().includes(typeSearch.toLowerCase()) && count > 0
                        )
                        .map(({ value }) => value);
                      const inverted = visibleTypes.filter(t => !filters.types.includes(t));
                      setFilters(prev => ({ ...prev, types: inverted }));
                    }}
                  >
                    Invert
                  </Button>
                </div>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {(uniqueTypesWithCounts || uniqueTypes.map(t => ({ value: t, count: 0 })))
                  .filter(({ value }) => value.toLowerCase().includes(typeSearch.toLowerCase()))
                  .map(({ value: type, count }) => {
                  const maxCount = Math.max(...(uniqueTypesWithCounts || []).map(t => t.count));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <label
                      key={type}
                      className={`relative flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer ${
                        !filters.types.includes(type) && count === 0 ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Data density bar */}
                      <div
                        className="absolute inset-0 bg-blue-50 opacity-30 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={filters.types.includes(type)}
                          onChange={() => handleTypeToggle(type)}
                          className="rounded border-gray-300"
                          disabled={!filters.types.includes(type) && count === 0}
                        />
                        <span className={`text-sm capitalize ${count === 0 && !filters.types.includes(type) ? 'text-gray-400' : ''}`}>{type}</span>
                      </div>
                      <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
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
            <div className="space-y-2">
              {/* Bulk actions for sizes */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs flex-1"
                  onClick={() => {
                    const allSizes = (uniqueSizesWithCounts || uniqueSizes.map(s => ({ value: s, count: 0 })))
                      .filter(({ count }) => count > 0)
                      .map(({ value }) => value);
                    setFilters(prev => ({ ...prev, sizes: allSizes }));
                  }}
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs flex-1"
                  onClick={() => setFilters(prev => ({ ...prev, sizes: [] }))}
                >
                  None
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs flex-1"
                  onClick={() => {
                    const allSizes = (uniqueSizesWithCounts || uniqueSizes.map(s => ({ value: s, count: 0 })))
                      .filter(({ count }) => count > 0)
                      .map(({ value }) => value);
                    const inverted = allSizes.filter(s => !filters.sizes.includes(s));
                    setFilters(prev => ({ ...prev, sizes: inverted }));
                  }}
                >
                  Invert
                </Button>
              </div>
              <div className="space-y-1">
                {(uniqueSizesWithCounts || uniqueSizes.map(s => ({ value: s, count: 0 }))).map(({ value: size, count }) => {
                  const maxCount = Math.max(...(uniqueSizesWithCounts || []).map(s => s.count));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <label
                      key={size}
                      className={`relative flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer ${
                        !filters.sizes.includes(size) && count === 0 ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Data density bar */}
                      <div
                        className="absolute inset-0 bg-green-50 opacity-30 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={filters.sizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          className="rounded border-gray-300"
                          disabled={!filters.sizes.includes(size) && count === 0}
                        />
                        <span className={`text-sm ${count === 0 && !filters.sizes.includes(size) ? 'text-gray-400' : ''}`}>{size}</span>
                      </div>
                      <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
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
              {filters.subtypes.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5">
                  {filters.subtypes.length}
                </Badge>
              )}
            </div>
            {expandedSections.subtypes ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.subtypes && (
            <div className="space-y-2">
              {/* Search and bulk actions */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search subtypes..."
                  value={subtypeSearch}
                  onChange={(e) => setSubtypeSearch(e.target.value)}
                  className="flex-1 h-7 text-xs"
                />
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      const visibleSubtypes = (uniqueSubtypesWithCounts || uniqueSubtypes.map(s => ({ value: s, count: 0 })))
                        .filter(({ value, count }) =>
                          value.toLowerCase().includes(subtypeSearch.toLowerCase()) && count > 0
                        )
                        .map(({ value }) => value);
                      setFilters(prev => ({ ...prev, subtypes: visibleSubtypes }));
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setFilters(prev => ({ ...prev, subtypes: [] }))}
                  >
                    None
                  </Button>
                </div>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {(uniqueSubtypesWithCounts || uniqueSubtypes.map(s => ({ value: s, count: 0 })))
                  .filter(({ value }) => value.toLowerCase().includes(subtypeSearch.toLowerCase()))
                  .slice(0, 50).map(({ value: subtype, count }) => {
                  const maxCount = Math.max(...(uniqueSubtypesWithCounts || []).map(s => s.count));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <label
                      key={subtype}
                      className="relative flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      {/* Data density bar */}
                      <div
                        className="absolute inset-0 bg-purple-50 opacity-30 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={filters.subtypes.includes(subtype)}
                          onChange={() => handleSubtypeToggle(subtype)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{subtype}</span>
                      </div>
                      <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
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
              {filters.specialAbilities.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5">
                  {filters.specialAbilities.length}
                </Badge>
              )}
            </div>
            {expandedSections.abilities ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.abilities && (
            <div className="space-y-2">
              {/* Search and bulk actions */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search abilities..."
                  value={abilitySearch}
                  onChange={(e) => setAbilitySearch(e.target.value)}
                  className="flex-1 h-7 text-xs"
                />
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      const visibleAbilities = (uniqueSpecialAbilitiesWithCounts || uniqueSpecialAbilities.map(s => ({ value: s, count: 0 })))
                        .filter(({ value, count }) =>
                          value.toLowerCase().includes(abilitySearch.toLowerCase()) && count > 0
                        )
                        .map(({ value }) => value);
                      setFilters(prev => ({ ...prev, specialAbilities: visibleAbilities }));
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setFilters(prev => ({ ...prev, specialAbilities: [] }))}
                  >
                    None
                  </Button>
                </div>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {(uniqueSpecialAbilitiesWithCounts || uniqueSpecialAbilities.map(s => ({ value: s, count: 0 })))
                  .filter(({ value }) => value.toLowerCase().includes(abilitySearch.toLowerCase()))
                  .map(({ value: ability, count }) => {
                  const maxCount = Math.max(...(uniqueSpecialAbilitiesWithCounts || []).map(s => s.count));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <label
                      key={ability}
                      className="relative flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      {/* Data density bar */}
                      <div
                        className="absolute inset-0 bg-yellow-50 opacity-30 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={filters.specialAbilities.includes(ability)}
                          onChange={() => handleSpecialAbilityToggle(ability)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{ability}</span>
                      </div>
                      <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
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
              {filters.defensiveAbilities.length > 0 && (
                <Badge variant="secondary" className="text-xs h-5">
                  {filters.defensiveAbilities.length}
                </Badge>
              )}
            </div>
            {expandedSections.defensive ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.defensive && (
            <div className="space-y-2">
              {/* Search and bulk actions */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search defenses..."
                  value={defensiveSearch}
                  onChange={(e) => setDefensiveSearch(e.target.value)}
                  className="flex-1 h-7 text-xs"
                />
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      const visibleDefensive = (uniqueDefensiveAbilitiesWithCounts || uniqueDefensiveAbilities.map(d => ({ value: d, count: 0 })))
                        .filter(({ value, count }) =>
                          value.toLowerCase().includes(defensiveSearch.toLowerCase()) && count > 0
                        )
                        .map(({ value }) => value);
                      setFilters(prev => ({ ...prev, defensiveAbilities: visibleDefensive }));
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setFilters(prev => ({ ...prev, defensiveAbilities: [] }))}
                  >
                    None
                  </Button>
                </div>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {(uniqueDefensiveAbilitiesWithCounts || uniqueDefensiveAbilities.map(d => ({ value: d, count: 0 })))
                  .filter(({ value }) => value.toLowerCase().includes(defensiveSearch.toLowerCase()))
                  .map(({ value: ability, count }) => {
                  const maxCount = Math.max(...(uniqueDefensiveAbilitiesWithCounts || []).map(d => d.count));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <label
                      key={ability}
                      className="relative flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      {/* Data density bar */}
                      <div
                        className="absolute inset-0 bg-orange-50 opacity-30 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={filters.defensiveAbilities.includes(ability)}
                          onChange={() => handleDefensiveAbilityToggle(ability)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{ability}</span>
                      </div>
                      <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
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
            <div className="space-y-2">
              {/* Bulk actions for alignments */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs flex-1"
                  onClick={() => {
                    const allAlignments = (uniqueAlignmentsWithCounts || uniqueAlignments.map(a => ({ value: a, count: 0 })))
                      .filter(({ count }) => count > 0)
                      .map(({ value }) => value);
                    setFilters(prev => ({ ...prev, alignments: allAlignments }));
                  }}
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs flex-1"
                  onClick={() => setFilters(prev => ({ ...prev, alignments: [] }))}
                >
                  None
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs flex-1"
                  onClick={() => {
                    const allAlignments = (uniqueAlignmentsWithCounts || uniqueAlignments.map(a => ({ value: a, count: 0 })))
                      .filter(({ count }) => count > 0)
                      .map(({ value }) => value);
                    const inverted = allAlignments.filter(a => !filters.alignments.includes(a));
                    setFilters(prev => ({ ...prev, alignments: inverted }));
                  }}
                >
                  Invert
                </Button>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {(uniqueAlignmentsWithCounts || uniqueAlignments.map(a => ({ value: a, count: 0 }))).slice(0, 20).map(({ value: alignment, count }) => {
                  const maxCount = Math.max(...(uniqueAlignmentsWithCounts || []).map(a => a.count));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <label
                      key={alignment}
                      className={`relative flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded cursor-pointer ${
                        count === 0 ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Data density bar */}
                      <div
                        className="absolute inset-0 bg-indigo-50 opacity-30 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={filters.alignments.includes(alignment)}
                          onChange={() => handleAlignmentToggle(alignment)}
                          className="rounded border-gray-300"
                          disabled={!filters.alignments.includes(alignment) && count === 0}
                        />
                        <span className={`text-sm ${count === 0 && !filters.alignments.includes(alignment) ? 'text-gray-400' : ''}`}>{alignment}</span>
                      </div>
                      <span className="relative text-xs text-muted-foreground font-medium">{count}</span>
                    </label>
                  );
                })}
              </div>
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