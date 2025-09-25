import { useState } from 'react';
import { useCreatures } from '@/hooks/useCreatures';
import { CreatureDetailMain } from '@/components/CreatureDetailMain';
import { CreatureList } from '@/components/CreatureList';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { MobileFilters } from '@/components/MobileFilters';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { CreatureEnriched } from '@/types/creature-complete';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

function App() {
  const {
    creatures,
    totalCreatures,
    filteredCount,
    loading,
    error,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    hasMore,
    loadMore,
    allCreatures,
    filteredCreatures,
    crDistribution,
    precomputedFilterOptions
  } = useCreatures();

  const [selectedCreature, setSelectedCreature] = useState<CreatureEnriched | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showCreatureList, setShowCreatureList] = useState(true);

  const handleCreatureClick = (creature: CreatureEnriched) => {
    setSelectedCreature(creature);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-destructive mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Responsive layout
  return (
    <div className="h-screen bg-surface-secondary flex flex-col md:flex-row">
      {/* Mobile Header - only visible on mobile */}
      <header className="md:hidden bg-surface-primary border-border border-b sticky top-0 z-40 flex-none">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-display font-semibold text-text-primary">Pathfinder Creatures</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">
                {filteredCount}
              </span>
              <ThemeToggle />
              <MobileFilters
                filters={filters}
                setFilters={setFilters}
                creatures={allCreatures}
                filteredCreatures={filteredCreatures}
                precomputedFilterOptions={precomputedFilterOptions}
                crDistribution={crDistribution}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Content - show either list or details */}
      {selectedCreature ? (
        <div className="md:hidden flex-1">
          <CreatureDetailMain
            creature={selectedCreature}
            onBack={() => setSelectedCreature(null)}
          />
        </div>
      ) : (
        <div className="md:hidden flex-1 p-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search creatures..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
          <CreatureList
            creatures={creatures}
            filteredCount={filteredCount}
            totalCreatures={totalCreatures}
            hasMore={hasMore}
            loadMore={loadMore}
            selectedCreature={selectedCreature}
            onCreatureClick={handleCreatureClick}
            filters={filters}
            setFilters={setFilters}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            className="h-full"
          />
        </div>
      )}

      {/* Desktop Layout - hidden on mobile */}
      <div className="hidden md:flex flex-1">
        {/* Sidebar with Filters */}
        <aside className={`${showFilters ? 'w-96' : 'w-12'} transition-all duration-300 border-r border-border bg-surface-primary flex-shrink-0 relative`}>
          <div className={`h-full flex flex-col ${showFilters ? '' : 'opacity-0 pointer-events-none'}`}>
            <div className="p-2 border-b border-border flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-semibold text-text-primary">Pathfinder Creatures</h2>
                <ThemeToggle />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search creatures..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                <Sidebar
                  filters={filters}
                  setFilters={setFilters}
                  creatures={allCreatures}
                  filteredCreatures={filteredCreatures}
                  precomputedFilterOptions={precomputedFilterOptions}
                  crDistribution={crDistribution}
                />
              </div>
            </ScrollArea>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-20 w-4 p-0 bg-surface-secondary border-l hover:bg-interactive-secondary z-10 rounded-l-md"
            title={showFilters ? "Hide filters" : "Show filters"}
          >
            {showFilters ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        </aside>

        {/* Creature List */}
        <div className={`${showCreatureList ? 'w-96' : 'w-12'} transition-all duration-300 border-r bg-surface-primary flex-shrink-0 relative`}>
          <div className={`${showCreatureList ? '' : 'opacity-0 pointer-events-none'} h-full`}>
            <CreatureList
              creatures={creatures}
              filteredCount={filteredCount}
              totalCreatures={totalCreatures}
              hasMore={hasMore}
              loadMore={loadMore}
              selectedCreature={selectedCreature}
              onCreatureClick={handleCreatureClick}
              filters={filters}
              setFilters={setFilters}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreatureList(!showCreatureList)}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-20 w-4 p-0 bg-surface-secondary border-l hover:bg-interactive-secondary z-10 rounded-l-md"
            title={showCreatureList ? "Hide creature list" : "Show creature list"}
          >
            {showCreatureList ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        </div>

        {/* Detail View */}
        <CreatureDetailMain
          creature={selectedCreature}
          onBack={() => setSelectedCreature(null)}
        />
      </div>
    </div>
  );
}

export default App;