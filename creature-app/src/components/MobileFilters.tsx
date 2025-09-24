import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal } from 'lucide-react';
import { Sidebar } from './Sidebar';
import type { Filters, SortField, SortDirection } from '@/hooks/useCreatures';

interface MobileFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  uniqueTypes: string[];
  uniqueSizes: string[];
  uniqueAlignments: string[];
  uniqueSubtypes: string[];
  uniqueMovementTypes: string[];
  uniqueSpecialAbilities: string[];
  uniqueDefensiveAbilities: string[];
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
}

export function MobileFilters(props: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  // Count active filters
  const activeCount =
    props.filters.types.length +
    props.filters.sizes.length +
    props.filters.alignments.length +
    (props.filters.crMin !== null || props.filters.crMax !== null ? 1 : 0) +
    props.filters.subtypes.length +
    props.filters.movementTypes.length +
    props.filters.specialAbilities.length +
    props.filters.defensiveAbilities.length;

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
          <Sidebar {...props} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                props.setFilters({
                  search: '',
                  type: '',
                  size: '',
                  crMin: null,
                  crMax: null,
                  alignment: '',
                  subtypes: [],
                  movementTypes: [],
                  specialAbilities: [],
                  defensiveAbilities: []
                });
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