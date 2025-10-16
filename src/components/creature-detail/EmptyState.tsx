import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

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
        </div>
      </Card>
    </div>
  );
}