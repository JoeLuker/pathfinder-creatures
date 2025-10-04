import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full p-6 bg-surface-secondary">
      <Card className="max-w-2xl w-full p-8 bg-surface-primary shadow-lg">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-interactive-primary/20 blur-2xl rounded-full"></div>
              <Sparkles className="h-16 w-16 text-interactive-primary relative" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Welcome to the Pathfinder Creature Database
            </h2>
            <p className="text-text-secondary">
              Browse 3,600+ creatures from across the Pathfinder universe
            </p>
          </div>

          <div className="space-y-4 text-left">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider text-center">
              Quick Start Guide
            </h3>

            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary/50">
                <Search className="h-5 w-5 text-interactive-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Search by Name</p>
                  <p className="text-xs text-text-tertiary">Type in the search bar to find creatures by name</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary/50">
                <Filter className="h-5 w-5 text-interactive-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Use Quick Filters</p>
                  <p className="text-xs text-text-tertiary">Filter by CR, Size, or Type for instant results</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-secondary/50">
                <Sparkles className="h-5 w-5 text-interactive-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Advanced Filters</p>
                  <p className="text-xs text-text-tertiary">Expand filter categories for detailed searches by alignment, environment, and more</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-text-tertiary mb-3">Popular Searches:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="text-xs">
                Dragons
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                CR 10+
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Undead
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Aberrations
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}