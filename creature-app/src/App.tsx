import { useState, useEffect } from 'react';
import { useCreatures } from '@/hooks/useCreatures';
import { CreatureDetailMain } from '@/components/CreatureDetailMain';
import { Sidebar } from '@/components/Sidebar';
import { ActiveFilters } from '@/components/ActiveFilters';
import { SmartSearch } from '@/components/SmartSearch';
import { MobileFilters } from '@/components/MobileFilters';
import type { CreatureEnriched } from '@/types/creature-complete';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    currentPage,
    setCurrentPage,
    totalPages,
    allCreatures,
    crDistribution
  } = useCreatures();

  const [selectedCreature, setSelectedCreature] = useState<CreatureEnriched | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showCreatureList, setShowCreatureList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Mobile view - show either list or details
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Creatures</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredCount}
                </span>
                <MobileFilters
                  filters={filters}
                  setFilters={setFilters}
                  creatures={allCreatures}
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

        {/* Mobile Content */}
        {selectedCreature ? (
          <CreatureDetailMain
            creature={selectedCreature}
            onBack={() => setSelectedCreature(null)}
          />
        ) : (
          <div className="flex-1 p-4">
            <SmartSearch
              value={filters.search}
              onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
              creatures={creatures}
            />
            <ActiveFilters filters={filters} setFilters={setFilters} />
            <div className="space-y-2 mt-4">
              {creatures.map((creature) => (
                <div
                  key={creature.url}
                  onClick={() => handleCreatureClick(creature)}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{creature.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {creature.type} • {creature.size}
                      </span>
                    </div>
                    <Badge className="bg-secondary">
                      CR {creature.cr_parsed?.display ?? creature.cr ?? '-'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop view - split screen
  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar with Filters */}
      <aside className={`${showFilters ? 'w-80' : 'w-12'} transition-all duration-300 border-r bg-white flex-shrink-0 relative`}>
        <div className={`h-full flex flex-col ${showFilters ? '' : 'opacity-0 pointer-events-none'}`}>
          <div className="p-4 border-b">
            <SmartSearch
              value={filters.search}
              onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
              creatures={creatures}
            />
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              <Sidebar
                filters={filters}
                setFilters={setFilters}
                creatures={allCreatures}
                crDistribution={crDistribution}
              />
            </div>
          </ScrollArea>
        </div>
        {/* Collapse/Expand Tab */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute -right-6 top-1/2 -translate-y-1/2 h-20 w-6 p-0 bg-white border border-l-0 rounded-r-md hover:bg-gray-100 z-10 shadow-md"
          title={showFilters ? "Hide filters" : "Show filters"}
        >
          {showFilters ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Creature List */}
        <div className={`${showCreatureList ? 'w-96' : 'w-12'} transition-all duration-300 border-r bg-white flex-shrink-0 relative`}>
          <div className={`flex flex-col h-full ${showCreatureList ? '' : 'opacity-0 pointer-events-none'}`}>
            {/* List Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">
                  {filteredCount} of {totalCreatures} creatures
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Sort by:</span>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value as any)}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    <option value="name">Name</option>
                    <option value="cr">CR</option>
                    <option value="type">Type</option>
                    <option value="size">Size</option>
                  </select>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                    title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
              <ActiveFilters filters={filters} setFilters={setFilters} />
            </div>

            {/* Creature List Content */}
            <ScrollArea className="flex-1">
            <div className="p-4">
              {creatures.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No creatures found</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({
                      search: '',

                      // Basic creature info
                      types: [],
                      sizes: [],
                      alignments: [],
                      subtypes: [],

                      // Challenge and Experience
                      crMin: null,
                      crMax: null,
                      mrMin: null,
                      mrMax: null,
                      xpMin: null,
                      xpMax: null,

                      // Combat Stats - AC
                      acMin: null,
                      acMax: null,
                      touchAcMin: null,
                      touchAcMax: null,
                      flatFootedAcMin: null,
                      flatFootedAcMax: null,

                      // Hit Points
                      hpMin: null,
                      hpMax: null,

                      // Initiative
                      initiativeMin: null,
                      initiativeMax: null,

                      // Saving Throws
                      fortMin: null,
                      fortMax: null,
                      refMin: null,
                      refMax: null,
                      willMin: null,
                      willMax: null,

                      // Ability Scores
                      strMin: null,
                      strMax: null,
                      dexMin: null,
                      dexMax: null,
                      conMin: null,
                      conMax: null,
                      intMin: null,
                      intMax: null,
                      wisMin: null,
                      wisMax: null,
                      chaMin: null,
                      chaMax: null,

                      // Combat Values
                      babMin: null,
                      babMax: null,
                      cmbMin: null,
                      cmbMax: null,
                      cmdMin: null,
                      cmdMax: null,

                      // Space and Reach
                      spaceMin: null,
                      spaceMax: null,
                      reachMin: null,
                      reachMax: null,

                      // Speeds
                      baseSpeedMin: null,
                      baseSpeedMax: null,
                      burrowSpeedMin: null,
                      burrowSpeedMax: null,
                      climbSpeedMin: null,
                      climbSpeedMax: null,
                      flySpeedMin: null,
                      flySpeedMax: null,
                      swimSpeedMin: null,
                      swimSpeedMax: null,

                      // Movement Types
                      movementTypes: [],

                      // Spell Resistance
                      srMin: null,
                      srMax: null,

                      // Multi-select arrays
                      specialAbilities: [],
                      defensiveAbilities: [],
                      languages: [],
                      environments: [],
                      senseTypes: [],

                      // Damage Reduction
                      drTypes: [],
                      drAmountMin: null,
                      drAmountMax: null,

                      // Resistances
                      resistanceTypes: [],
                      resistanceAmountMin: null,
                      resistanceAmountMax: null,

                      // Immunities and Weaknesses
                      immunities: [],
                      weaknesses: [],

                      // Attack types
                      hasMeleeAttacks: null,
                      hasRangedAttacks: null,
                      hasSpecialAttacks: null,

                      // Special flags
                      hasSpellLikeAbilities: null,
                      hasSpells: null,
                      hasPsychicMagic: null,
                      hasRegeneration: null,
                      hasFastHealing: null,
                      hasAuras: null
                    })}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {creatures.map((creature) => (
                    <div
                      key={creature.url}
                      onClick={() => handleCreatureClick(creature)}
                      className={`cursor-pointer rounded-lg border p-3 hover:shadow-md transition-all ${
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
                          <div className="text-sm font-medium">CR {creature.cr_parsed?.display ?? creature.cr ?? '-'}</div>
                          {creature.xp && (
                            <div className="text-xs text-muted-foreground">{creature.xp.toLocaleString()} XP</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
            </ScrollArea>
          </div>
          {/* Collapse/Expand Tab */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreatureList(!showCreatureList)}
            className="absolute -right-6 top-1/2 -translate-y-1/2 h-20 w-6 p-0 bg-white border border-l-0 rounded-r-md hover:bg-gray-100 z-10 shadow-md"
            title={showCreatureList ? "Hide creature list" : "Show creature list"}
          >
            {showCreatureList ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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