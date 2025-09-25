// Helper utilities for formatting creature stats

export const formatModifier = (modifier: number | undefined | null): string => {
  if (modifier === undefined || modifier === null) return 'ERROR';
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

export const formatAbilityScore = (score: number | undefined | null, modifier: number | undefined | null): string => {
  if (score === undefined || score === null) return 'ERROR';

  const scoreStr = score.toString();
  // Calculate modifier from score if modifier is not provided
  const calculatedModifier = Math.floor((score - 10) / 2);
  const actualModifier = modifier !== undefined && modifier !== null ? modifier : calculatedModifier;
  const modStr = formatModifier(actualModifier);
  return `${scoreStr} (${modStr})`;
};