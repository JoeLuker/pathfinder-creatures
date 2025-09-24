import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number | null, number | null];
  onChange: (value: [number | null, number | null]) => void;
  className?: string;
}

export function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  className
}: RangeSliderProps) {
  const [minVal, maxVal] = value;

  const handleSliderChange = (values: number[]) => {
    onChange([values[0], values[1]]);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : parseInt(e.target.value);
    onChange([val, maxVal]);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : parseInt(e.target.value);
    onChange([minVal, val]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium">{label}</Label>

      <div className="px-2">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[minVal ?? min, maxVal ?? max]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Input
          type="number"
          placeholder="Min"
          value={minVal ?? ''}
          onChange={handleMinInputChange}
          className="h-8 text-xs"
          min={min}
          max={max}
        />
        <span className="text-muted-foreground">to</span>
        <Input
          type="number"
          placeholder="Max"
          value={maxVal ?? ''}
          onChange={handleMaxInputChange}
          className="h-8 text-xs"
          min={min}
          max={max}
        />
      </div>
    </div>
  );
}