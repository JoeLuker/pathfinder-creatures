import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ActiveFilters } from '@/components/ActiveFilters';
import type { CreatureEnriched, Filters, SortField, SortDirection } from '@/hooks/useCreatures';
import { createDefaultFilters } from '@/utils/filterUtils';

interface CreatureListProps {
  creatures: CreatureEnriched[];
  filteredCount: number;
  totalCreatures: number;
  hasMore: boolean;
  loadMore: () => void;
  selectedCreature: CreatureEnriched | null;
  onCreatureClick: (creature: CreatureEnriched) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  className?: string;
}

export function CreatureList({
  creatures,
  filteredCount,
  totalCreatures,
  hasMore,
  loadMore,
  selectedCreature,
  onCreatureClick,
  filters,
  setFilters,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  className = ""
}: CreatureListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  // Save scroll position before selecting a creature
  const handleCreatureClick = (creature: CreatureEnriched) => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollPositionRef.current = scrollElement.scrollTop;
    }
    onCreatureClick(creature);
  };

  // Restore scroll position when returning to list
  useEffect(() => {
    if (!selectedCreature) {
      const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement && scrollPositionRef.current > 0) {
        scrollElement.scrollTop = scrollPositionRef.current;
      }
    }
  }, [selectedCreature]);
  // Remove duplicate scrollAreaRef declaration
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll intersection observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* List Header */}
      <div className="px-2 py-2 md:p-2 border-b flex-none">
        {/* Desktop layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {filteredCount} of {totalCreatures} creatures
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="text-xs px-2 py-0 border rounded bg-surface-primary text-text-primary border-border"
              >
                <option value="name">Name</option>
                <option value="cr">CR</option>
                <option value="type">Type</option>
                <option value="size">Size</option>
              </select>
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="text-xs px-2 py-0 border rounded hover:bg-surface-secondary bg-surface-primary text-text-primary border-border"
                title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-text-secondary">
              {filteredCount} creatures
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as any)}
                className="text-xs px-2 py-1 border rounded bg-surface-primary text-text-primary border-border"
              >
                <option value="name">Name</option>
                <option value="cr">CR</option>
                <option value="type">Type</option>
                <option value="size">Size</option>
              </select>
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="text-xs px-2 py-1 border rounded hover:bg-surface-secondary bg-surface-primary text-text-primary border-border"
                title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        <ActiveFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Creature List Content */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="px-2 py-2 md:p-2">
          {creatures.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No creatures found</p>
              <Button
                className="mt-2"
                variant="outline"
                size="sm"
                onClick={() => setFilters(createDefaultFilters())}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {creatures.map((creature) => (
                <div
                  key={creature.url}
                  onClick={() => handleCreatureClick(creature)}
                  className={`cursor-pointer rounded-md border p-2 hover:shadow-md transition-all bg-surface-primary overflow-hidden ${
                    selectedCreature?.url === creature.url ? 'border-primary shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{creature.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {creature.size} {creature.type} • {creature.alignment}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-text-primary">
                        CR {creature.cr_parsed?.display ?? creature.cr ?? '-'}
                      </div>
                      {creature.xp && (
                        <div className="text-xs text-muted-foreground">
                          {creature.xp.toLocaleString()} XP
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="mt-4 flex items-center justify-center py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMore}
                className="text-xs"
              >
                Load More...
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}