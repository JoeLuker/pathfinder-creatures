// Helper utilities for formatting creature stats

export const formatModifier = (modifier: number | undefined | null): string => {
  if (modifier === undefined || modifier === null) return '—';
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

export const formatAbilityScore = (score: number | undefined, modifier: number | undefined): string => {
  const scoreStr = score?.toString() ?? '—';
  // Calculate modifier from score if modifier is not provided
  const calculatedModifier = score !== undefined ? Math.floor((score - 10) / 2) : 0;
  const actualModifier = modifier !== undefined ? modifier : calculatedModifier;
  const modStr = formatModifier(actualModifier);
  return `${scoreStr} (${modStr})`;
};