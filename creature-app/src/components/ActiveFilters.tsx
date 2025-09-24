import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import type { Filters } from '@/hooks/useCreatures';

interface ActiveFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function ActiveFilters({ filters, setFilters }: ActiveFiltersProps) {
  const activeFilters: { label: string; value: string; clear: () => void }[] = [];

  // Collect all active filters
  filters.types.forEach(type => {
    activeFilters.push({
      label: filters.excludeMode?.types ? 'Exclude Type' : 'Type',
      value: type,
      clear: () => setFilters(prev => ({
        ...prev,
        types: prev.types.filter(t => t !== type)
      }))
    });
  });

  filters.sizes.forEach(size => {
    activeFilters.push({
      label: filters.excludeMode?.sizes ? 'Exclude Size' : 'Size',
      value: size,
      clear: () => setFilters(prev => ({
        ...prev,
        sizes: prev.sizes.filter(s => s !== size)
      }))
    });
  });

  filters.alignments.forEach(alignment => {
    activeFilters.push({
      label: filters.excludeMode?.alignments ? 'Exclude Alignment' : 'Alignment',
      value: alignment,
      clear: () => setFilters(prev => ({
        ...prev,
        alignments: prev.alignments.filter(a => a !== alignment)
      }))
    });
  });

  if (filters.crMin !== null || filters.crMax !== null) {
    const crRange = `${filters.crMin ?? '0'} - ${filters.crMax ?? '30'}`;
    activeFilters.push({
      label: 'CR',
      value: crRange,
      clear: () => setFilters(prev => ({ ...prev, crMin: null, crMax: null }))
    });
  }

  filters.subtypes.forEach(subtype => {
    activeFilters.push({
      label: 'Subtype',
      value: subtype,
      clear: () => setFilters(prev => ({
        ...prev,
        subtypes: prev.subtypes.filter(s => s !== subtype)
      }))
    });
  });

  filters.movementTypes.forEach(movement => {
    activeFilters.push({
      label: 'Movement',
      value: movement,
      clear: () => setFilters(prev => ({
        ...prev,
        movementTypes: prev.movementTypes.filter(m => m !== movement)
      }))
    });
  });

  filters.specialAbilities.forEach(ability => {
    activeFilters.push({
      label: 'Ability',
      value: ability,
      clear: () => setFilters(prev => ({
        ...prev,
        specialAbilities: prev.specialAbilities.filter(a => a !== ability)
      }))
    });
  });

  filters.defensiveAbilities.forEach(ability => {
    activeFilters.push({
      label: 'Defense',
      value: ability,
      clear: () => setFilters(prev => ({
        ...prev,
        defensiveAbilities: prev.defensiveAbilities.filter(a => a !== ability)
      }))
    });
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Active Filters:</span>
        </div>
        <div className="flex flex-wrap gap-2 flex-1">
          {activeFilters.map((filter, index) => (
            <Badge
              key={`${filter.label}-${filter.value}-${index}`}
              variant="secondary"
              className="pl-2 pr-1 py-1 flex items-center gap-1 hover:bg-secondary/80 transition-colors"
            >
              <span className="text-xs text-muted-foreground">{filter.label}:</span>
              <span className="text-xs font-medium">{filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={filter.clear}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setFilters({
              search: filters.search, // Keep search
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
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}