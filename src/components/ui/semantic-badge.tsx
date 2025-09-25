import React from 'react';
import { Badge, type BadgeProps } from './badge';
import { cn } from '@/lib/utils';

interface SemanticBadgeProps extends BadgeProps {
  semantic?: 'default' | 'defense' | 'danger' | 'modifier' | 'primary';
  size?: 'xs' | 'sm' | 'default';
}

/**
 * Semantic Badge component that provides consistent styling for different data types
 * Uses design system colors appropriately for each type of information
 */
export function SemanticBadge({ // noqa
  semantic = 'default',
  size = 'default',
  className,
  children,
  ...props
}: SemanticBadgeProps) {
  const semanticStyles = {
    default: '',
    defense: 'bg-sapphire-500/10 text-sapphire-600 border-sapphire-500/30',
    danger: 'bg-red-500/10 text-red-600 border-red-500/30',
    modifier: 'font-mono',
    primary: 'bg-interactive-primary text-text-inverse border-0',
  };

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    default: '',
  };

  return (
    <Badge
      className={cn(
        semanticStyles[semantic],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}