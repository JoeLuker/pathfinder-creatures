import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function EmptyState() { // noqa
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Select a creature</CardTitle>
          <CardDescription>Choose a creature from the list to view details</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}