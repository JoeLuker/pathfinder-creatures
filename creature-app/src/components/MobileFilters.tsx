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

export function MobileFilters(props: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  // Count active filters
  const activeCount = getActiveFilterCount(props.filters);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[385px] p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Filters & Sort</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-5rem)] overflow-y-auto px-6 py-4">
          <Sidebar
            filters={props.filters}
            setFilters={props.setFilters}
            creatures={props.creatures}
            filteredCreatures={props.filteredCreatures}
            crDistribution={props.crDistribution}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                props.setFilters(createDefaultFilters());
              }}
            >
              Clear All
            </Button>
            <Button
              className="flex-1"
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