import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal } from 'lucide-react';
import { Sidebar } from './Sidebar';
import type { Filters, SortField, SortDirection } from '@/hooks/useCreatures';
import { getActiveFilterCount, createDefaultFilters } from '@/utils/filterUtils';

interface MobileFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  creatures: any[];
  filteredCreatures?: any[];
  precomputedFilterOptions: Map<string, { value: string; count: number }[]>;
  crDistribution?: {
    distribution: { cr: number; count: number }[];
    minCR: number;
    maxCR: number;
  };
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  // Shared sidebar state
  expandedSections: Record<string, boolean>;
  setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  searchStates: Record<string, string>;
  setSearchStates: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function MobileFilters(props: MobileFiltersProps) { // noqa
  const [open, setOpen] = useState(false);

  // Count active filters
  const activeCount = getActiveFilterCount(props.filters);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 min-h-[44px] px-4">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[90vw] sm:w-[385px] p-0 flex flex-col max-w-sm">
        <SheetHeader className="px-4 py-4 border-b flex-none bg-surface-primary">
          <SheetTitle className="text-lg font-semibold">Filters</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Sidebar
            filters={props.filters}
            setFilters={props.setFilters}
            creatures={props.creatures}
            filteredCreatures={props.filteredCreatures}
            precomputedFilterOptions={props.precomputedFilterOptions}
            crDistribution={props.crDistribution}
            expandedSections={props.expandedSections}
            setExpandedSections={props.setExpandedSections}
            searchStates={props.searchStates}
            setSearchStates={props.setSearchStates}
          />
        </div>
        <div className="flex-none p-4 bg-surface-secondary border-t shadow-lg">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 min-h-[44px]"
              onClick={() => {
                props.setFilters(createDefaultFilters());
              }}
            >
              Clear All
            </Button>
            <Button
              className="flex-1 min-h-[44px]"
              onClick={() => setOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}