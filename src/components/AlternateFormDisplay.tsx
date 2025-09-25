import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import type { CreatureEnriched } from '@/types/creature-complete';

interface AlternateFormDisplayProps {
  creature: CreatureEnriched;
}

export function AlternateFormDisplay({ creature }: AlternateFormDisplayProps) {
  const [showAlternateForm, setShowAlternateForm] = useState(false);

  // Check if creature has alternate form data
  const hasAlternateForm = creature.second_statblock;

  if (!hasAlternateForm) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-600" />
          <h3 className="font-semibold text-sm uppercase tracking-wider text-purple-800">
            Alternate Form Available
          </h3>
          <Badge className="bg-purple-600 text-white text-xs">
            Transformation
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAlternateForm(!showAlternateForm)}
          className="text-purple-700 hover:text-purple-900 hover:bg-purple-100"
        >
          {showAlternateForm ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Hide Form
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Alternate Form
            </>
          )}
        </Button>
      </div>

      {showAlternateForm && (
        <div className="space-y-4">
          <div className="text-sm text-purple-700 bg-purple-50 p-3 rounded border border-purple-200">
            <p className="font-medium mb-2">Alternate Form Notes:</p>
            <p>
              This creature has transformation abilities or alternate statistics.
              The data structure may contain modified stats, abilities, or forms
              that represent the creature in different states.
            </p>
          </div>

          {/* Display any alternate form data */}
          <div className="bg-surface-primary p-4 rounded border border-purple-200">
            <pre className="text-xs text-text-secondary overflow-auto">
              {JSON.stringify(creature.second_statblock, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}