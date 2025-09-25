import { Card } from '@/components/ui/card';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar Skeleton */}
        <aside className="hidden md:block w-96 border-r border-border bg-surface-primary">
          <div className="p-2 border-b border-border">
            <div className="h-7 bg-surface-secondary rounded animate-pulse mb-2 w-48" />
            <div className="h-9 bg-surface-secondary rounded animate-pulse" />
          </div>
          <div className="p-2 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-5 bg-surface-secondary rounded animate-pulse w-24" />
                <div className="h-9 bg-surface-secondary rounded animate-pulse" />
              </div>
            ))}
          </div>
        </aside>

        {/* Creature List Skeleton */}
        <div className="w-96 border-r bg-surface-primary hidden md:block">
          <div className="p-2 border-b border-border">
            <div className="h-10 bg-surface-secondary rounded animate-pulse" />
          </div>
          <div className="p-2 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Card key={i} className="p-2 bg-surface-primary">
                <div className="flex justify-between items-start mb-1">
                  <div className="h-5 bg-surface-secondary rounded animate-pulse w-32" />
                  <div className="h-5 bg-surface-secondary rounded animate-pulse w-12" />
                </div>
                <div className="flex gap-2">
                  <div className="h-4 bg-surface-secondary rounded animate-pulse w-20" />
                  <div className="h-4 bg-surface-secondary rounded animate-pulse w-16" />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Detail View Skeleton */}
        <div className="flex-1 flex flex-col bg-background">
          <div className="bg-surface-secondary border-b border-border p-6">
            <div className="h-8 bg-surface-primary rounded animate-pulse w-64 mb-2" />
            <div className="h-6 bg-surface-primary rounded animate-pulse w-48" />
          </div>
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="p-4">
                  <div className="h-5 bg-surface-secondary rounded animate-pulse w-32 mb-3" />
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-secondary rounded animate-pulse" />
                    <div className="h-4 bg-surface-secondary rounded animate-pulse w-4/5" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}